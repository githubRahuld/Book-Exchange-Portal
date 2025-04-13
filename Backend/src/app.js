import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";

const app = express();

dotenv.config({ path: "./.env" });

app.use(
	cors({
		origin: process.env.CORS_ORIGIN,
		methods: "GET,POST,PUT,DELETE,PATCH",
		credentials: true,
	})
);

app.use(express.json({ limit: "16kb" }));

app.use(express.urlencoded({ extended: true, limit: "16kb" }));

app.use(express.static("public"));

app.use(fileUpload());
app.use(cookieParser());

//import routes
import userRoutes from "./routes/user.routes.js";
import bookRoutes from "./routes/book.routes.js";

app.use("/api/users", userRoutes);
app.use("/api/books", bookRoutes);

export { app };
