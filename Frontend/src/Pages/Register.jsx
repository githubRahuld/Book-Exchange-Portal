import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
	const BASE_URL = import.meta.env.VITE_API_BASE_URL;
	const navigate = useNavigate();

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [formData, setFormData] = useState({
		fullName: "",
		email: "",
		password: "",
		mobileNumber: "",
		role: "seeker",
	});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({
			...formData, // copies old field values
			[name]: value, // updates field with new value
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		setLoading(true);
		await axios
			.post(`${BASE_URL}/users/register`, formData)
			.then(() => {
				setLoading(false);
				setError(null);
				navigate("/auth/login");
			})
			.catch((error) => {
				setLoading(false);
				if (error.response && error.response.data) {
					setError(error.response.data.message);
				} else {
					setError("Something went wrong. Please try again.");
				}
			});
	};

	if (loading) return <div>Registering...</div>;

	return (
		<div className="max-w-4xl mx-auto p-6 bg-gray-50 rounded-lg shadow-md pt-12 pb-12">
			<h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
				Sign Up
			</h2>

			{error && (
				<div className="mb-4 text-red-600 text-center">{error}</div>
			)}

			<form onSubmit={handleSubmit}>
				{/* Full Name */}
				<div className="mb-4">
					<label className="block text-sm font-medium text-gray-700">
						Full Name
					</label>
					<input
						type="text"
						name="fullName"
						value={formData.fullName}
						onChange={handleChange}
						required
						className="mt-1 block w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
					/>
				</div>

				{/* Email */}
				<div className="mb-4">
					<label className="block text-sm font-medium text-gray-700">
						Email
					</label>
					<input
						type="email"
						name="email"
						value={formData.email}
						onChange={handleChange}
						required
						className="mt-1 block w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
					/>
				</div>

				{/* Password */}
				<div className="mb-4">
					<label className="block text-sm font-medium text-gray-700">
						Password
					</label>
					<input
						type="password"
						name="password"
						value={formData.password}
						onChange={handleChange}
						required
						className="mt-1 block w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
					/>
				</div>

				{/* Mobile Number */}
				<div className="mb-4">
					<label className="block text-sm font-medium text-gray-700">
						Mobile Number
					</label>
					<input
						type="text"
						name="mobileNumber"
						value={formData.mobileNumber}
						onChange={handleChange}
						required
						className="mt-1 block w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
					/>
				</div>

				{/* Role */}
				<div className="mb-6">
					<label className="block text-sm font-medium text-gray-700">
						Role
					</label>
					<select
						name="role"
						value={formData.role}
						onChange={handleChange}
						className="mt-1 block w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
					>
						<option value="seeker">Seeker</option>
						<option value="owner">Owner</option>
					</select>
				</div>

				{/* Submit Button */}
				<div className="flex justify-center">
					<button
						type="submit"
						disabled={loading}
						className={`w-full px-6 py-3 text-white font-semibold rounded-md ${
							loading
								? "bg-gray-400 cursor-not-allowed"
								: "bg-blue-600 hover:bg-blue-700"
						} transition-colors`}
					>
						{loading ? "Registering..." : "Register"}
					</button>
				</div>
			</form>
		</div>
	);
};

export default Register;
