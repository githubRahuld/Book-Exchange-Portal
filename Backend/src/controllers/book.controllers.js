import { Book } from "../models/book.models.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const listing = asyncHandler(async (req, res) => {
	const {
		title,
		author,
		genre,
		"location[city]": city,
		"location[state]": state,
	} = req.body;

	if ([title, author, genre, city, state].some((field) => !field?.trim())) {
		throw new ApiError(400, "All fields are required");
	}

	// if owner provided Cover of Book then upload it to cloudinary
	const imageFile = req.files?.coverImage;

	let coverImage = null;

	if (imageFile) {
		coverImage = await uploadOnCloudinary(
			imageFile.data,
			"book_exchange/coverImage"
		);

		if (!coverImage) {
			throw new ApiError(
				501,
				"Something went wrong while uploading mainImage"
			);
		}
	}

	const location = {
		city: city,
		state: state,
	};

	const bookListed = await Book.create({
		title,
		author,
		coverImage: coverImage?.secure_url || null,
		location,
		genre: genre || null,
		owner: req.user._id,
	});

	if (!bookListed) {
		throw new ApiError(500, "Something went wrong with listing your book!");
	}
	const book = await Book.findById(bookListed._id).populate(
		"owner",
		"email mobileNumber"
	);

	return res
		.status(201)
		.json(new ApiResponse(201, book, "Book listed successfully"));
});

const updateList = asyncHandler(async (req, res) => {
	const {
		title,
		author,
		genre,
		"location[city]": city,
		"location[state]": state,
	} = req.body;
	const { id } = req.params;

	const oldBook = await Book.findById(id);
	if (!oldBook) {
		return res.status(200).json(new ApiResponse(200, {}, "Book not found"));
	}

	const location = {
		city: city,
		state: state,
	};

	const imageFile = req.files?.coverImage;
	let newCoverImage = null;

	if (imageFile) {
		newCoverImage = await uploadOnCloudinary(
			imageFile.data,
			"book_exchange/coverImage"
		);

		if (!newCoverImage) {
			throw new ApiError(
				501,
				"Something went wrong while uploading mainImage"
			);
		}
	}

	const updatedBook = await Book.findByIdAndUpdate(
		id,
		{
			title: title || oldBook.title,
			author: author || oldBook.author,
			coverImage: newCoverImage?.secure_url || oldBook.coverImage,
			location: location || oldBook.location,
			genre: genre || oldBook.genre,
			owner: req.user._id,
		},
		{ new: true }
	);

	if (!updatedBook) {
		throw new ApiError(
			500,
			"Something went wrong with updating your book!"
		);
	}
	const book = await Book.findById(updatedBook._id).populate(
		"owner",
		"email mobileNumber"
	);

	return res
		.status(201)
		.json(new ApiResponse(201, book, "Book updated successfully"));
});

const updateBookStatus = asyncHandler(async (req, res) => {
	const { id } = req.params;
	const { status } = req.body;

	if (!["available", "requested", "exchanged"].includes(status)) {
		return res.status(400).json({ message: "Invalid status value" });
	}

	const book = await Book.findByIdAndUpdate(id, { status }, { new: true });

	return res
		.status(200)
		.json(new ApiResponse(200, book, "Book status updated successfully"));
});

const getBooks = asyncHandler(async (req, res) => {
	const { page = 1, limit = 10, title, city, state } = req.query;

	const pageNumber = parseInt(page, 10);
	const limitNumber = parseInt(limit, 10);

	// Construct filter object based on query
	const filter = {};

	if (title) {
		filter.title = { $regex: title, $options: "i" };
	}

	if (city) {
		filter["location.city"] = { $regex: city, $options: "i" };
	}

	if (state) {
		filter["location.state"] = { $regex: state, $options: "i" };
	}

	// Get total filtered book count
	const totalBooks = await Book.countDocuments(filter);

	// Fetch paginated and filtered books
	const books = await Book.find(filter)
		.populate("owner", "email mobileNumber")
		.skip((pageNumber - 1) * limitNumber)
		.limit(limitNumber);

	return res
		.status(200)
		.json(
			new ApiResponse(
				200,
				{ books, totalBooks },
				"Books fetched successfully"
			)
		);
});
const getBooksById = asyncHandler(async (req, res) => {
	const { id } = req.params;
	if (!id) {
		return res.status(400).json(new ApiResponse(400, {}, "Id is required"));
	}

	const book = await Book.findById(id).populate(
		"owner",
		"email mobileNumber"
	);

	if (!book) {
		return res.status(404).json(new ApiResponse(404, {}, "Book not found"));
	}

	return res
		.status(200)
		.json(new ApiResponse(200, { book }, "Books fetched successfully"));
});

export { listing, updateBookStatus, getBooks, updateList, getBooksById };
