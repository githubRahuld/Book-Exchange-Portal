import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginUser } from "../store/authSlice";
import Cookies from "js-cookie";

const Login = () => {
	const baseUrl = import.meta.env.VITE_API_BASE_URL;

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [msg, setMsg] = useState("");
	const [loading, setLoading] = useState("");

	const navigate = useNavigate();
	const dispatch = useDispatch();

	const handleLogin = (e) => {
		e.preventDefault();
		setLoading(true);

		axios
			.post(`${baseUrl}/users/login`, { email, password })
			.then((res) => {
				setLoading(false);
				setError("");
				setMsg(res.data.message || "Login successful!");
				console.log(res.data.data);

				const refreshToken = res.data.data.refreshToken;
				const accessToken = res.data.data.accessToken;
				const userData = res.data.data;

				Cookies.set("accessToken", accessToken, {
					secure: true,
					sameSite: "strict",
				});
				Cookies.set("refreshToken", refreshToken, {
					secure: true,
					sameSite: "strict",
				});

				dispatch(loginUser({ userData }));
				console.log("userData: ", userData);

				navigate("/home");
			})
			.catch((error) => {
				setLoading(false);
				setMsg("");

				if (error.response && error.response.data) {
					setError(error.response.data.message);
				} else {
					setError("Something went wrong. Please try again.");
				}
			});
	};

	if (loading) return <div>Loging...</div>;
	return (
		<div className="bg-gray-100 pt-12 pb-12">
			<div className=" bg-white max-w-md mx-auto p-6 rounded-lg shadow-md">
				<h2 className="text-2xl font-semibold text-center mb-4">
					Login
				</h2>
				{error && (
					<div className="bg-red-100 text-red-700 p-2 rounded mb-4">
						{error}
					</div>
				)}
				{msg && <h2 className="text-blue-500">{msg}</h2>}
				<form onSubmit={handleLogin}>
					<div className="mb-4 ">
						<label
							htmlFor="email"
							className="block text-sm font-medium text-gray-700"
						>
							Email
						</label>
						<input
							type="email"
							name="email"
							id="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className="w-full px-3 py-2 border border-gray-300 rounded-md"
						/>
					</div>
					<div className="mb-4">
						<label
							htmlFor="password"
							className="block text-sm font-medium text-gray-700"
						>
							Password
						</label>
						<input
							type="password"
							id="password"
							name="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="w-full px-3 py-2 border border-gray-300 rounded-md"
						/>
					</div>
					<button
						type="submit"
						className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md font-medium hover:bg-indigo-700"
					>
						Login
					</button>
				</form>

				{/* Demo Credentials Section */}
				<div className="mt-6 text-center text-sm text-gray-500 bg-gray-100 p-4 rounded-lg shadow-md">
					<p className="font-semibold text-gray-700">
						Demo credentials:
					</p>
					<div className="mt-2">
						<p className="text-gray-600">
							<span className="font-medium text-gray-800">
								Email:
							</span>{" "}
							<strong className="text-indigo-600">
								prashant@gmail.com
							</strong>
						</p>
						<p className="text-gray-600">
							<span className="font-medium text-gray-800">
								Password:
							</span>{" "}
							<strong className="text-indigo-600">demo123</strong>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Login;
