import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import mongoose from "mongoose";
import path from "node:path";
import { fileURLToPath } from "node:url";
import adminAuthRoutes from "./routes/adminAuth.routes.js";
import adminProductRoutes from "./routes/adminProduct.routes.js";
import adminCategoryBannerRoutes from "./routes/adminCategoryBanner.routes.js";
import publicRoutes from "./routes/public/public.routes.js";
import cartRoutes from "./routes/cart/cart.routes.js";
import orderRoutes from "./routes/orders/order.routes.js";
import adminInventoryRoutes from "./routes/adminInventory.routes.js";
import adminOrderRoutes from "./routes/adminOrder.routes.js";
import adminDashboardRoutes from "./routes/adminDashboard.routes.js";
import adminUploadRoutes from "./routes/adminUpload.routes.js";
import { configureCloudinary } from "./config/cloudinary.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({
	path: path.resolve(__dirname, ".env"),
	override: true,
});

const app = express();
const PORT = process.env.PORT || 5000;
const allowedOrigins = (
	process.env.CLIENT_ORIGINS ||
	process.env.CLIENT_URL ||
	"http://localhost:5173"
)
	.split(",")
	.map((origin) => origin.trim())
	.filter(Boolean);

app.disable("x-powered-by");
app.set("trust proxy", 1);
app.use(helmet());
app.use(
	cors({
		origin(origin, callback) {
			if (!origin || allowedOrigins.includes(origin)) {
				callback(null, true);
				return;
			}
			callback(new Error("Origin not allowed by CORS"));
		},
		credentials: true,
	}),
);
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: false, limit: "1mb" }));
app.use(cookieParser());
configureCloudinary();

app.use(
	"/api",
	rateLimit({
		windowMs: 60 * 1000,
		limit: 100,
		standardHeaders: "draft-7",
		legacyHeaders: false,
		message: {
			success: false,
			message: "Quá nhiều yêu cầu, vui lòng thử lại sau.",
			data: {},
			errors: [],
		},
	}),
);

app.use("/api/admin", adminAuthRoutes);
app.use("/api/admin", adminProductRoutes);
app.use("/api/admin", adminCategoryBannerRoutes);
app.use("/api/admin", adminInventoryRoutes);
app.use("/api/admin", adminOrderRoutes);
app.use("/api/admin", adminDashboardRoutes);
app.use("/api/admin", adminUploadRoutes);
app.use("/api", cartRoutes);
app.use("/api", orderRoutes);
app.use("/api", publicRoutes);

app.get("/api/health", (_req, res) => {
	res.status(200).json({
		success: true,
		message: "TechGear Shop API is running",
		data: { status: "ok" },
		errors: [],
	});
});

app.use((_req, res) => {
	res.status(404).json({
		success: false,
		message: "API route not found",
		data: {},
		errors: [],
	});
});

app.use((error, _req, res, _next) => {
	const status =
		error.status ||
		(error.message === "Origin not allowed by CORS" ? 403 : 500);
	res.status(status).json({
		success: false,
		message: status === 500 ? "Internal server error" : error.message,
		data: error.data && typeof error.data === "object" ? error.data : {},
		errors: status === 500 ? [] : (error.errors?.length ? error.errors : [{ message: error.message }]),
	});
});

async function startServer() {
	if (!process.env.JWT_SECRET) {
		console.warn(
			"JWT_SECRET chưa được cấu hình; API đăng nhập Admin sẽ không hoạt động",
		);
	}

	if (process.env.MONGODB_URI) {
		await mongoose.connect(process.env.MONGODB_URI);
		console.log("Đã kết nối MongoDB");
	} else {
		console.warn(
			"MONGODB_URI chưa được cấu hình; các API database sẽ không hoạt động",
		);
	}

	app.listen(PORT, () => {
		console.log(`TechGear Shop API listening on port ${PORT}`);
	});
}

if (process.env.NODE_ENV !== "test") {
	startServer().catch((error) => {
		console.error("Không thể khởi động API:", error.message);
		process.exit(1);
	});
}

export default app;
