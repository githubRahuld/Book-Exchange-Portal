import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Home = () => {
	const navigate = useNavigate();
	const baseUrl = import.meta.env.VITE_API_BASE_URL;

	const [books, setBooks] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalBooks, setTotalBooks] = useState(0);
	const [limit] = useState(6);
	const [loading, setLoading] = useState(true);
	const currentUser = useSelector((state) => state.auth.user);
	const ownerId = currentUser?.user?._id;

	const [filters, setFilters] = useState({
		title: "",
		city: "",
		state: "",
	});

	const totalPages = Math.ceil(totalBooks / limit);

	const fetchBooks = async () => {
		try {
			setLoading(true);
			const params = new URLSearchParams({
				page: currentPage,
				limit,
				...filters,
			});
			const res = await axios.get(`${baseUrl}/books?${params}`);
			setBooks(res.data.data.books);
			setTotalBooks(res.data.data.TotalBooks);
		} catch (err) {
			console.error("Error fetching books", err);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchBooks();
	}, [currentPage]);

	const handleFilterChange = (e) => {
		const { name, value } = e.target;
		setFilters((prev) => ({ ...prev, [name]: value }));
	};

	const handleFilterSubmit = (e) => {
		e.preventDefault();
		setCurrentPage(1); // Reset to first page
		fetchBooks(); // Trigger API call
	};

	const handlePrev = () => {
		if (currentPage > 1) setCurrentPage((prev) => prev - 1);
	};

	const handleNext = () => {
		if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
	};

	return (
		<div className="max-w-7xl mx-auto px-4 py-8">
			<h1 className="text-3xl font-bold mb-6 text-center">
				📚 Available Books
			</h1>

			{/* Filter Form */}
			<form
				onSubmit={handleFilterSubmit}
				className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6"
			>
				<input
					type="text"
					name="title"
					value={filters.title}
					onChange={handleFilterChange}
					placeholder="Filter by Title"
					className="border rounded px-3 py-2"
				/>
				<input
					type="text"
					name="city"
					value={filters.city}
					onChange={handleFilterChange}
					placeholder="Filter by City"
					className="border rounded px-3 py-2"
				/>
				<input
					type="text"
					name="state"
					value={filters.state}
					onChange={handleFilterChange}
					placeholder="Filter by State"
					className="border rounded px-3 py-2"
				/>
				<button
					type="submit"
					className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700 transition"
				>
					Search
				</button>
			</form>

			{/* Book List */}
			{loading ? (
				<p className="text-center">Loading books...</p>
			) : (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
					{books.map((book) => (
						<div
							key={book._id}
							className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition"
						>
							<img
								src={book.coverImage}
								alt={book.title}
								className="h-[22rem] w-full object-contain bg-gray-100"
							/>

							<div className="p-4 space-y-1 ">
								<h2 className="text-xl font-semibold">
									{book.title}
								</h2>

								<p className="text-sm text-gray-600">
									by {book.author}
								</p>
								<p className="text-sm text-gray-500 italic">
									{book.genre}
								</p>
								<p className="text-sm">
									📍 {book.location.city},{" "}
									{book.location.state}
								</p>
								{book.owner._id === ownerId && (
									<div className=" gap-2 mt-1">
										<label className="text-sm font-medium ">
											Status:{" "}
										</label>
										<select
											value={book.status}
											onChange={async (e) => {
												const newStatus =
													e.target.value;
												try {
													await axios.patch(
														`${baseUrl}/books/status/${book._id}`,
														{ status: newStatus },
														{
															headers: {
																Authorization: `Bearer ${Cookies.get(
																	"accessToken"
																)}`,
															},
														}
													);

													setBooks((prevBooks) =>
														prevBooks.map((b) =>
															b._id === book._id
																? {
																		...b,
																		status: newStatus,
																  }
																: b
														)
													);
												} catch (err) {
													console.error(
														"Failed to update book status",
														err
													);
													alert(
														"Failed to update status. Try again."
													);
												}
											}}
											className={`text-sm p-1 border rounded bg-white ${
												book.status === "available"
													? "text-green-600"
													: book.status ===
													  "requested"
													? "text-yellow-600"
													: "text-red-600"
											}`}
										>
											<option value="available">
												Available
											</option>
											<option value="requested">
												Requested
											</option>
											<option value="exchanged">
												Exchanged
											</option>
										</select>

										<button
											onClick={() =>
												navigate(
													`/edit-book/${book._id}`
												)
											}
											className="text-sm text-blue-600 hover:bg-green-400 hover:text-white ml-2 border-1 px-2 py-1 rounded-lg"
										>
											Edit Book
										</button>
									</div>
								)}
							</div>
						</div>
					))}
				</div>
			)}

			{/* Pagination */}
			{totalPages > 1 && (
				<div className="mt-8 flex justify-center items-center space-x-4">
					<button
						onClick={handlePrev}
						disabled={currentPage === 1}
						className="px-4 py-2 bg-blue-500 text-gray-300 rounded-lg disabled:bg-gray-300"
					>
						Prev
					</button>
					<span className="text-lg font-medium">
						Page {currentPage} of {totalPages}
					</span>
					<button
						onClick={handleNext}
						disabled={currentPage === totalPages}
						className="px-4 py-2 bg-blue-500 text-gray-300 rounded-lg disabled:bg-gray-300"
					>
						Next
					</button>
				</div>
			)}
		</div>
	);
};

export default Home;
