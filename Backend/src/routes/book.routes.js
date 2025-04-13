import Router from "express";
import { verifyOwnerJWT } from "../middlewares/auth.middleware.js";
import {
	getBooks,
	getBooksById,
	listing,
	updateBookStatus,
	updateList,
} from "../controllers/book.controllers.js";

const router = Router();

router.route("/list").post(verifyOwnerJWT, listing);
router.route("/status/:id").patch(verifyOwnerJWT, updateBookStatus);
router.route("/update/:id").patch(verifyOwnerJWT, updateList);
router.route("/").get(getBooks);
router.route("/:id").get(getBooksById);

export default router;
