import { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Navigate, useNavigate } from "react-router-dom";

const AddBook = () => {
	const baseUrl = import.meta.env.VITE_API_BASE_URL;
	const navigate = useNavigate();

	const [formData, setFormData] = useState({
		title: "",
		author: "",
		genre: "",
		city: "",
		state: "",
		coverImage: null,
	});
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState("");

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const handleImageChange = (e) => {
		setFormData({ ...formData, coverImage: e.target.files[0] });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setMessage("");

		try {
			const data = new FormData();
			data.append("title", formData.title);
			data.append("author", formData.author);
			data.append("genre", formData.genre);
			data.append("location[city]", formData.city);
			data.append("location[state]", formData.state);
			if (formData.coverImage) {
				data.append("coverImage", formData.coverImage);
			}

			const res = await axios.post(`${baseUrl}/books/list`, data, {
				headers: {
					"Content-Type": "multipart/form-data",
					Authorization: `Bearer ${Cookies.get("accessToken")}`,
				},
			});

			setMessage("✅ Book listed successfully!");
			console.log(res.data);
			setFormData({
				title: "",
				author: "",
				genre: "",
				city: "",
				state: "",
				coverImage: null,
			});

			setTimeout(() => {
				navigate("/home");
			}, 2000);
		} catch (err) {
			console.error("Error listing book", err);
			setMessage("❌ Failed to list book. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow mt-8">
			<h2 className="text-2xl font-bold mb-4 text-center">
				📘 Add New Book
			</h2>
			<form onSubmit={handleSubmit} className="space-y-4">
				<input
					type="text"
					name="title"
					placeholder="Book Title"
					value={formData.title}
					onChange={handleChange}
					className="w-full p-2 border rounded"
					required
				/>
				<input
					type="text"
					name="author"
					placeholder="Author"
					value={formData.author}
					onChange={handleChange}
					className="w-full p-2 border rounded"
					required
				/>
				<input
					type="text"
					name="genre"
					placeholder="Genre"
					value={formData.genre}
					onChange={handleChange}
					className="w-full p-2 border rounded"
					required
				/>
				<div className="flex gap-4">
					<input
						type="text"
						name="city"
						placeholder="City"
						value={formData.city}
						onChange={handleChange}
						className="w-full p-2 border rounded"
						required
					/>
					<input
						type="text"
						name="state"
						placeholder="State"
						value={formData.state}
						onChange={handleChange}
						className="w-full p-2 border rounded"
						required
					/>
				</div>
				<input
					type="file"
					name="coverImage"
					accept="image/*"
					onChange={handleImageChange}
					className="w-full"
				/>

				<button
					type="submit"
					disabled={loading}
					className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
				>
					{loading ? "Listing..." : "Add Book"}
				</button>
			</form>

			{message && (
				<p className="mt-4 text-center font-medium text-sm text-gray-700">
					{message}
				</p>
			)}
		</div>
	);
};

export default AddBook;
