import mongoose from "mongoose";
import InventoryLog from "../models/InventoryLog.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";

const HELD_STATUSES = ["PENDING", "CONFIRMED", "PROCESSING"];
const MAX_STOCK_ADJUSTMENT = 10000;

function serviceError(status, message, errors = [], data = {}) {
	const error = new Error(message);
	error.status = status;
	error.errors = errors;
	error.data = data;
	return error;
}

function normalizeInventoryType(value) {
	if (typeof value !== "string") return null;
	const key = value
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.toLowerCase()
		.replace(/[\s_-]+/g, "");

	if (["add", "increase", "increasestock", "import", "nhapthem", "adminadd"].includes(key)) return "admin_add";
	if (["subtract", "decrease", "decreasestock", "export", "giam", "adminsubtract"].includes(key)) return "admin_subtract";
	if (["count", "reset", "set", "inventorycount", "datlai", "admincount"].includes(key)) return "admin_count";
	return null;
}

function escapeRegex(value) {
	return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function asObjectId(value) {
	if (!mongoose.isObjectIdOrHexString(value)) return null;
	return new mongoose.Types.ObjectId(value);
}

async function getHeldOrders(productId, session = null) {
	const objectId = asObjectId(productId);
	if (!objectId) return { heldStock: 0, heldOrders: [] };

	let query = Order.find({
		status: { $in: HELD_STATUSES },
		"items.productId": objectId,
	}).select("_id orderCode status items");
	if (session) query = query.session(session);
	const orders = await query.lean();

	let heldStock = 0;
	const heldOrders = [];

	for (const order of orders) {
		const matchingItems = (order.items || []).filter((item) =>
			item.productId?.toString() === objectId.toString(),
		);
		const quantity = matchingItems.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
		if (quantity <= 0) continue;
		heldStock += quantity;
		heldOrders.push({
			orderId: order._id.toString(),
			orderCode: order.orderCode,
			status: order.status,
			quantity,
		});
	}

	return { heldStock, heldOrders };
}

async function resolveReference(payload, session = null) {
	const referenceId = payload.referenceId || payload.orderId;
	let order = null;

	if (referenceId) {
		if (!mongoose.isObjectIdOrHexString(referenceId)) {
			throw serviceError(422, "Mã đơn liên quan không hợp lệ");
		}
		let query = Order.findById(referenceId).select("_id orderCode");
		if (session) query = query.session(session);
		order = await query.lean();
	}
	else if (payload.orderCode) {
		let query = Order.findOne({ orderCode: payload.orderCode.trim().toUpperCase() }).select("_id orderCode");
		if (session) query = query.session(session);
		order = await query.lean();
	}

	if ((referenceId || payload.orderCode) && !order) {
		throw serviceError(404, "Đơn hàng liên quan không tồn tại");
	}
	return order?._id?.toString() || null;
}

async function findProduct(productId, session = null, fields = "_id name slug brand stock status categoryId") {
	let query = Product.findById(productId).select(fields);
	if (session) query = query.session(session);
	return query;
}

function formatLog(log) {
	const object = typeof log?.toObject === "function" ? log.toObject() : log;
	return {
		id: object?._id?.toString(),
		productId: object?.productId?.toString(),
		type: object?.type,
		change: object?.change,
		stockBefore: object?.stockBefore,
		stockAfter: object?.stockAfter,
		reason: object?.reason,
		referenceId: object?.referenceId?.toString() || null,
		actor: object?.actor,
		actorId: object?.actorId?.toString() || null,
		actorName: object?.actorName || null,
		actorEmail: object?.actorEmail || null,
		createdAt: object?.createdAt,
	};
}

async function saveInventoryLog(document, session = null) {
	const log = new InventoryLog(document);
	if (session) {
		await log.save({ session });
	}
	else {
		await log.save();
	}
	return log;
}

function buildActor(admin) {
	const name = typeof admin?.name === "string" && admin.name.trim()
		? admin.name.trim().slice(0, 100)
		: typeof admin?.email === "string" && admin.email.trim()
			? admin.email.trim().slice(0, 100)
			: "Admin";
	const email = typeof admin?.email === "string" ? admin.email.trim().slice(0, 254) : null;
	const id = mongoose.isObjectIdOrHexString(admin?.id) ? new mongoose.Types.ObjectId(admin.id) : null;
	return {
		actor: name,
		actorName: name,
		actorEmail: email || null,
		...(id ? { actorId: id } : {}),
	};
}

async function compensateStock(type, productId, stockBefore, stockAfter, session = null) {
	let compensated = null;
	if (type === "admin_add") {
		compensated = await Product.findOneAndUpdate(
			{ _id: productId, stock: stockAfter },
			{ $inc: { stock: -(stockAfter - stockBefore) } },
			session ? { session } : {},
		);
	}
	else if (type === "admin_subtract") {
		compensated = await Product.findOneAndUpdate(
			{ _id: productId, stock: stockAfter },
			{ $inc: { stock: stockBefore - stockAfter } },
			session ? { session } : {},
		);
	}
	else {
		compensated = await Product.findOneAndUpdate(
			{ _id: productId, stock: stockAfter },
			{ $set: { stock: stockBefore } },
			session ? { session } : {},
		);
	}
	if (!compensated) {
		throw serviceError(500, "Không thể hoàn tác tồn kho sau lỗi ghi lịch sử điều chỉnh", [], {
			productId: productId.toString(),
			stockBefore,
			stockAfter,
			requiresManualReview: true,
		});
	}
}

function isTransactionUnsupportedError(error) {
	const text = `${error?.message || ""} ${error?.codeName || ""}`.toLowerCase();
	return text.includes("transaction numbers are only allowed")
		|| text.includes("transactions are not supported")
		|| text.includes("does not support transactions")
		|| text.includes("does not support sessions")
		|| text.includes("standalone server")
		|| text.includes("standalone mongodb");
}

async function executeWithOptionalTransaction(operation) {
	let session = null;
	try {
		session = await mongoose.startSession();
		let result = null;
		await session.withTransaction(async () => {
			result = await operation(session);
		});
		return result;
	}
	catch (error) {
		if (error?.status) throw error;
		if (isTransactionUnsupportedError(error)) {
			return operation(null);
		}
		throw error;
	}
	finally {
		if (session) await session.endSession();
	}
}

export async function listInventory(query = {}) {
	query = query && typeof query === "object" && !Array.isArray(query) ? query : {};
	const parsedPage = Number.parseInt(query.page || "1", 10);
	const parsedLimit = Number.parseInt(query.limit || "20", 10);
	const page = Number.isInteger(parsedPage) && parsedPage >= 1 ? parsedPage : 1;
	const limit = Number.isInteger(parsedLimit) ? Math.min(Math.max(parsedLimit, 1), 100) : 20;

	const filter = {};
	if (typeof query.search === "string" && query.search.trim()) {
		const search = escapeRegex(query.search.trim().slice(0, 100));
		filter.$or = [
			{ name: { $regex: search, $options: "i" } },
			{ slug: { $regex: search, $options: "i" } },
			{ brand: { $regex: search, $options: "i" } },
		];
	}
	if (query.outOfStock === true || query.outOfStock === "true" || query.outOfStock === "1") {
		filter.stock = 0;
	}

	const [products, total] = await Promise.all([
		Product.find(filter)
			.populate("categoryId", "name slug isActive")
			.sort({ stock: 1, name: 1 })
			.skip((page - 1) * limit)
			.limit(limit),
		Product.countDocuments(filter),
	]);

	const productIds = products.map((product) => product._id);
	let heldMap = new Map();
	if (productIds.length > 0) {
		const heldRows = await Order.aggregate([
			{
				$match: {
					status: { $in: HELD_STATUSES },
					"items.productId": { $in: productIds },
				},
			},
			{ $unwind: "$items" },
			{ $match: { "items.productId": { $in: productIds } } },
			{ $group: { _id: "$items.productId", heldStock: { $sum: "$items.quantity" } } },
		]);
		heldMap = new Map(heldRows.map((row) => [row._id.toString(), row.heldStock]));
	}

	const items = products.map((product) => {
		const productId = product._id.toString();
		const heldStock = Number(heldMap.get(productId) || 0);
		const availableStock = Number(product.stock);
		const category = product.categoryId && typeof product.categoryId === "object"
			? {
				id: product.categoryId._id?.toString(),
				name: product.categoryId.name,
				slug: product.categoryId.slug,
				isActive: product.categoryId.isActive,
			}
			: null;

		return {
			_id: productId,
			id: productId,
			productId,
			name: product.name,
			slug: product.slug,
			brand: product.brand,
			status: product.status,
			categoryId: category?.id || (product.categoryId?.toString() || null),
			category,
			stock: availableStock,
			availableStock,
			heldStock,
			heldQuantity: heldStock,
			physicalStock: availableStock + heldStock,
			isOutOfStock: availableStock === 0,
		};
	});

	return {
		items,
		pagination: {
			page,
			limit,
			total,
			totalPages: Math.ceil(total / limit),
	},
	};
}

export async function adjustInventory(payload, admin) {
	if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
		throw serviceError(422, "Body điều chỉnh tồn kho không hợp lệ");
	}
	const allowedFields = new Set(["productId", "type", "quantity", "reason", "currentSeenStock", "referenceId", "orderId", "orderCode"]);
	const unknownFields = Object.keys(payload).filter((field) => !allowedFields.has(field));
	if (unknownFields.length > 0) {
		throw serviceError(422, "Trường dữ liệu không hợp lệ", unknownFields.map((field) => ({
			field,
			message: "Trường không được phép",
		})));
	}
	for (const field of ["productId", "type", "reason"]) {
		if (typeof payload[field] !== "string") {
			throw serviceError(422, `${field} không hợp lệ`);
		}
	}
	for (const field of ["referenceId", "orderId", "orderCode"]) {
		if (payload[field] !== undefined && typeof payload[field] !== "string") {
			throw serviceError(422, `${field} không hợp lệ`);
		}
	}
	if (payload.referenceId && payload.orderId && payload.referenceId !== payload.orderId) {
		throw serviceError(422, "referenceId và orderId không được chỉ định hai đơn hàng khác nhau");
	}
	const type = normalizeInventoryType(payload.type);
	if (!type) throw serviceError(422, "type không hợp lệ");
	if (!Number.isInteger(payload.quantity)) throw serviceError(422, "quantity phải là số nguyên");
	if (type === "admin_count") {
		if (payload.quantity < 0 || payload.quantity > MAX_STOCK_ADJUSTMENT) {
			throw serviceError(422, `quantity phải từ 0 đến ${MAX_STOCK_ADJUSTMENT}`);
		}
		if (!Number.isInteger(payload.currentSeenStock) || payload.currentSeenStock < 0) {
			throw serviceError(422, "currentSeenStock không hợp lệ");
		}
	}
	else if (payload.quantity < 1 || payload.quantity > MAX_STOCK_ADJUSTMENT) {
		throw serviceError(422, `quantity phải từ 1 đến ${MAX_STOCK_ADJUSTMENT}`);
	}

	const reason = typeof payload.reason === "string" ? payload.reason.trim() : "";
	if (!reason || reason.length > 500 || /[<>]/.test(reason)) {
		throw serviceError(422, "reason không hợp lệ");
	}

	const productId = asObjectId(payload.productId);
	if (!productId) throw serviceError(422, "productId không hợp lệ");

	const result = await executeWithOptionalTransaction(async (session) => {
		const referenceId = await resolveReference(payload, session);
		const product = await findProduct(productId, session);
		if (!product) throw serviceError(404, "Sản phẩm không tồn tại");

		const actor = buildActor(admin);
		let updated = null;
		let stockBefore = 0;
		let stockAfter = 0;
		let change = 0;
		let heldStock = 0;
		let heldOrders = [];

		if (type === "admin_add") {
			updated = await Product.findOneAndUpdate(
				{
					_id: productId,
					stock: { $lte: MAX_STOCK_ADJUSTMENT - payload.quantity },
				},
				{ $inc: { stock: payload.quantity } },
				session
					? { new: true, runValidators: false, session }
					: { new: true, runValidators: false },
			).select("_id stock");

			if (!updated) {
				const current = await findProduct(productId, session, "_id name stock");
				if (!current) throw serviceError(404, "Sản phẩm không tồn tại");
				throw serviceError(422, "Tồn kho sau điều chỉnh vượt giới hạn cho phép", [], {
					productId: productId.toString(),
					currentStock: current.stock,
					maxAdjustment: MAX_STOCK_ADJUSTMENT,
				});
			}

			stockAfter = updated.stock;
			stockBefore = stockAfter - payload.quantity;
			change = payload.quantity;
		}
		else if (type === "admin_subtract") {
			updated = await Product.findOneAndUpdate(
				{
					_id: productId,
					stock: { $gte: payload.quantity },
				},
				{ $inc: { stock: -payload.quantity } },
				session
					? { new: true, runValidators: false, session }
					: { new: true, runValidators: false },
			).select("_id stock");

			if (!updated) {
				const current = await findProduct(productId, session, "_id name stock");
				if (!current) throw serviceError(404, "Sản phẩm không tồn tại");
				throw serviceError(409, "Số lượng giảm vượt quá tồn kho hiện tại", [], {
					productId: productId.toString(),
					currentStock: current.stock,
					requestedQuantity: payload.quantity,
				});
			}

			stockAfter = updated.stock;
			stockBefore = stockAfter + payload.quantity;
			change = -payload.quantity;
		}
		else {
			if (product.stock !== payload.currentSeenStock) {
				throw serviceError(409, "Tồn khả dụng đã thay đổi, vui lòng xem lại trước khi kiểm kê", [], {
					productId: productId.toString(),
					currentSeenStock: payload.currentSeenStock,
					currentStock: product.stock,
				});
			}

			const held = await getHeldOrders(productId, session);
			heldStock = held.heldStock;
			heldOrders = held.heldOrders;
			const newStock = payload.quantity - heldStock;
			if (newStock < 0) {
				throw serviceError(409, "Số đếm thực tế nhỏ hơn số lượng đang giữ", [], {
					productId: productId.toString(),
					countedQuantity: payload.quantity,
					heldStock,
					heldOrders,
				});
			}

			updated = await Product.findOneAndUpdate(
				{
					_id: productId,
					stock: payload.currentSeenStock,
				},
				{ $set: { stock: newStock } },
				session
					? { new: true, runValidators: false, session }
					: { new: true, runValidators: false },
			).select("_id stock");

			if (!updated) {
				const current = await findProduct(productId, session, "_id name stock");
				if (!current) throw serviceError(404, "Sản phẩm không tồn tại");
				throw serviceError(409, "Tồn khả dụng đã thay đổi, vui lòng xem lại trước khi kiểm kê", [], {
					productId: productId.toString(),
					currentSeenStock: payload.currentSeenStock,
					currentStock: current.stock,
				});
			}

			stockBefore = payload.currentSeenStock;
			stockAfter = updated.stock;
			change = stockAfter - stockBefore;
		}

		if (heldStock === 0 && heldOrders.length === 0 && type !== "admin_count") {
			const held = await getHeldOrders(productId, session);
			heldStock = held.heldStock;
			heldOrders = held.heldOrders;
		}

		const logDocument = {
			productId,
			type,
			change,
			stockBefore,
			stockAfter,
			reason,
			...actor,
			...(referenceId ? { referenceId } : {}),
		};

		let log = null;
		try {
			log = await saveInventoryLog(logDocument, session);
		}
		catch (error) {
			if (!session) {
				await compensateStock(type, productId, stockBefore, stockAfter);
			}
			throw error;
		}

		return {
			productId: productId.toString(),
			type,
			quantity: payload.quantity,
			currentSeenStock: payload.currentSeenStock ?? null,
			change,
			stockBefore,
			stockAfter,
			stock: stockAfter,
			availableStock: stockAfter,
			heldStock,
			heldOrders,
			physicalStock: stockAfter + heldStock,
			reason,
			referenceId: referenceId || null,
			...actor,
			logId: log._id.toString(),
			log: formatLog(log),
			inventoryLog: formatLog(log),
		};
	});

	return result;
}
