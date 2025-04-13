import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

const EditBook = () => {
	const baseUrl = import.meta.env.VITE_API_BASE_URL;
	const { id } = useParams();

	const navigate = useNavigate();

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(false);
	const [formData, setFormData] = useState({
		title: "",
		author: "",
		genre: "",
		city: "",
		state: "",
	});
	const [coverImage, setCoverImage] = useState(null);

	useEffect(() => {
		const fetchBook = async () => {
			try {
				const res = await axios.get(`${baseUrl}/books/${id}`);

				const data = res.data.data.book;

				setFormData({
					title: data.title,
					author: data.author,
					genre: data.genre,
					city: data.location.city,
					state: data.location.state,
					coverImage: data.coverImage,
				});
			} catch (err) {
				console.error("Failed to fetch book", err);
			} finally {
				setLoading(false);
			}
		};

		fetchBook();
	}, [id]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleImageChange = (e) => {
		setCoverImage(e.target.files[0]);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);

		const form = new FormData();
		form.append("title", formData.title);
		form.append("author", formData.author);
		form.append("genre", formData.genre);
		form.append("location[city]", formData.city);
		form.append("location[state]", formData.state);
		if (coverImage) {
			form.append("coverImage", coverImage);
		} else {
			form.append("coverImage", formData.coverImage);
		}

		try {
			await axios.patch(`${baseUrl}/books/update/${id}`, form, {
				headers: {
					Authorization: `Bearer ${Cookies.get("accessToken")}`,
					"Content-Type": "multipart/form-data",
				},
			});
			alert("Book updated successfully!");
			navigate("/home");
		} catch (error) {
			setLoading(false);
			if (error.response && error.response.data) {
				setError(error.response.data.message);
			} else {
				setError("Something went wrong. Please try again.");
			}
		}
	};

	if (loading) return <p className="text-center">Loading book data...</p>;

	return (
		<div className="max-w-3xl mx-auto py-10 px-4">
			<h2 className="text-2xl font-bold mb-6 text-center">Edit Book</h2>
			{error && (
				<div className="bg-red-100 text-red-700 p-2 rounded mb-4">
					{error}
				</div>
			)}
			<form
				onSubmit={handleSubmit}
				className="bg-white p-6 rounded-xl shadow-md space-y-4"
				encType="multipart/form-data"
			>
				<label className="font-medium">Book Title</label>
				<input
					type="text"
					name="title"
					value={formData.title}
					onChange={handleChange}
					placeholder="Book Title"
					className="w-full border p-2 rounded"
					required
				/>
				<label className="font-medium">Author Name</label>
				<input
					type="text"
					name="author"
					value={formData.author}
					onChange={handleChange}
					placeholder="Author Name"
					className="w-full border p-2 rounded"
					required
				/>
				<label className="font-medium">Genre</label>
				<input
					type="text"
					name="genre"
					value={formData.genre}
					onChange={handleChange}
					placeholder="Genre"
					className="w-full border p-2 rounded"
					required
				/>
				<label className="font-medium">City</label>
				<input
					type="text"
					name="city"
					value={formData.city}
					onChange={handleChange}
					placeholder="City"
					className="w-full border p-2 rounded"
					required
				/>
				<label className="font-medium">State</label>
				<input
					type="text"
					name="state"
					value={formData.state}
					onChange={handleChange}
					placeholder="State"
					className="w-full border p-2 rounded"
					required
				/>

				<div className="flex flex-col gap-1">
					<label className="font-medium">
						Cover Image (optional)
					</label>
					<input
						type="file"
						accept="image/*"
						onChange={handleImageChange}
						className="border p-2 rounded"
					/>
				</div>

				{loading ? (
					<button
						type="submit"
						className="w-full bg-blue-500 text-white p-2 rounded disabled"
					>
						Updating...
					</button>
				) : (
					<button
						type="submit"
						className="w-full bg-blue-500 text-white p-2 rounded"
					>
						Update Book
					</button>
				)}
			</form>
		</div>
	);
};

export default EditBook;
