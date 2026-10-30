import crypto from "node:crypto";
import mongoose from "mongoose";
import Cart from "../../models/Cart.js";
import Category from "../../models/Category.js";
import Product from "../../models/Product.js";

const CART_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const MAX_QUANTITY = 10;
const MAX_ITEMS = 20;

function serviceError(status, message, errors = []) {
  const error = new Error(message);
  error.status = status;
  error.errors = errors;
  return error;
}

async function findCart(req) {
  const cart = await Cart.findOne({
    userId: req.user.id,
    status: "ACTIVE",
    expireAt: { $gt: new Date() },
  }).select("userId items status expireAt");
  if (!cart || cart.expireAt <= new Date()) return null;
  return cart;
}

async function createCart(req) {
  let cart;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      cart = await Cart.create({
        userId: req.user.id,
        tokenHash: crypto.randomBytes(32).toString("hex"),
        items: [],
        status: "ACTIVE",
        expireAt: new Date(Date.now() + CART_TTL_MS),
      });
      break;
    } catch (error) {
      if (error?.code !== 11000) throw error;
      const existingCart = await findCart(req);
      if (existingCart) return existingCart;

      const expiredCart = await Cart.findOne({
        userId: req.user.id,
        status: "ACTIVE",
      }).select("userId items status expireAt");
      if (expiredCart) {
        expiredCart.items = [];
        expiredCart.expireAt = new Date(Date.now() + CART_TTL_MS);
        await expiredCart.save();
        return expiredCart;
      }
    }
  }
  if (!cart) throw serviceError(500, "Không thể tạo giỏ hàng");
  return cart;
}

async function formatCart(cart) {
  if (!cart || cart.items.length === 0) {
    return { items: [], subtotal: 0, itemCount: 0 };
  }

  const productIds = cart.items.map((item) => item.productId);
  const products = await Product.find({ _id: { $in: productIds } })
    .select("name slug brand listPrice salePrice stock status categoryId images")
    .populate("categoryId", "isActive")
    .lean();
  const productMap = new Map(products.map((product) => [product._id.toString(), product]));

  const formatted = [];
  let subtotal = 0;
  let itemCount = 0;
  for (const item of cart.items) {
    const product = productMap.get(item.productId.toString());
    let invalidReason = null;
    if (!product) invalidReason = "Sản phẩm không còn tồn tại";
    else if (product.status !== "ACTIVE") invalidReason = "Sản phẩm không đang kinh doanh";
    else if (!product.categoryId?.isActive) invalidReason = "Danh mục sản phẩm không đang hoạt động";
    else if (item.quantity > product.stock) invalidReason = "Số lượng vượt tồn kho hiện tại";

    const quantity = item.quantity;
    const effectivePrice = product?.salePrice ?? product?.listPrice ?? 0;
    const lineSubtotal = invalidReason || !product ? 0 : effectivePrice * quantity;
    if (!invalidReason && product) {
      subtotal += lineSubtotal;
      itemCount += quantity;
    }

    formatted.push({
      productId: item.productId,
      name: product?.name || null,
      slug: product?.slug || null,
      brand: product?.brand || null,
      image: product?.images?.find((image) => image.isPrimary)?.url || product?.images?.[0]?.url || null,
      quantity,
      unitPrice: product ? effectivePrice : null,
      subtotal: lineSubtotal,
      valid: !invalidReason && Boolean(product),
      invalidReason,
    });
  }

  return {
    items: formatted,
    subtotal,
    itemCount,
  };
}

async function refreshCart(cart) {
  cart.expireAt = new Date(Date.now() + CART_TTL_MS);
  await cart.save();
}

export async function getCart(req) {
  const cart = await findCart(req);
  return formatCart(cart);
}

export async function addCartItem(req, payload) {
  if (!mongoose.isObjectIdOrHexString(payload.productId)) throw serviceError(422, "productId không hợp lệ");
  const product = await Product.findById(payload.productId).populate("categoryId", "isActive");
  if (!product) throw serviceError(404, "Sản phẩm không tồn tại");
  if (product.status !== "ACTIVE" || !product.categoryId?.isActive) throw serviceError(422, "Sản phẩm không đủ điều kiện đặt mua");

  let cart = await findCart(req);
  if (!cart) cart = await createCart(req);

  const currentItem = cart.items.find((item) => item.productId.toString() === product._id.toString());
  const nextQuantity = (currentItem?.quantity || 0) + payload.quantity;
  if (!Number.isInteger(nextQuantity) || nextQuantity > MAX_QUANTITY) throw serviceError(422, "Số lượng mỗi sản phẩm tối đa là 10");
  if (nextQuantity > product.stock) throw serviceError(422, "Tồn kho không đủ cho số lượng yêu cầu");
  if (!currentItem && cart.items.length >= MAX_ITEMS) throw serviceError(422, "Giỏ hàng tối đa 20 dòng sản phẩm");

  if (currentItem) currentItem.quantity = nextQuantity;
  else cart.items.push({ productId: product._id, quantity: payload.quantity });
  await refreshCart(cart);
  return formatCart(cart);
}

export async function updateCartItem(req, payload, productId) {
  if (!mongoose.isObjectIdOrHexString(productId)) throw serviceError(422, "productId không hợp lệ");
  const cart = await findCart(req);
  if (!cart) throw serviceError(404, "Giỏ hàng không tồn tại");

  const item = cart.items.find((entry) => entry.productId.toString() === productId);
  if (!item) return formatCart(cart);
  if (payload.quantity === 0) {
    cart.items = cart.items.filter((entry) => entry.productId.toString() !== productId);
  } else {
    const product = await Product.findById(productId).populate("categoryId", "isActive");
    if (!product || product.status !== "ACTIVE" || !product.categoryId?.isActive) throw serviceError(422, "Sản phẩm không đủ điều kiện đặt mua");
    if (payload.quantity > product.stock) throw serviceError(422, "Tồn kho không đủ cho số lượng yêu cầu");
    item.quantity = payload.quantity;
  }
  await refreshCart(cart);
  return formatCart(cart);
}

export async function deleteCartItem(req, productId) {
  if (!mongoose.isObjectIdOrHexString(productId)) throw serviceError(422, "productId không hợp lệ");
  const cart = await findCart(req);
  if (!cart) throw serviceError(404, "Giỏ hàng không tồn tại");
  cart.items = cart.items.filter((entry) => entry.productId.toString() !== productId);
  await refreshCart(cart);
  return formatCart(cart);
}

export async function clearCart(req) {
  const cart = await findCart(req);
  if (!cart) return { items: [], subtotal: 0, itemCount: 0 };
  cart.items = [];
  await refreshCart(cart);
  return { items: [], subtotal: 0, itemCount: 0 };
}
