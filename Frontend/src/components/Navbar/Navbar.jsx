import { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../store/authSlice";

const Navbar = () => {
	const baseUrl = import.meta.env.VITE_API_BASE_URL;
	const currentUser = useSelector((state) => state.auth.user);
	const isOwner = currentUser?.user?.role === "owner";
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	const handleLogout = async () => {
		try {
			await axios.post(
				`${baseUrl}/users/logout`,
				{},
				{
					headers: {
						Authorization: `Bearer ${Cookies.get("accessToken")}`,
					},
				}
			);
			Cookies.remove("accessToken");
			Cookies.remove("refreshToken");
			dispatch(logoutUser());
			navigate("/auth/login");
		} catch (err) {
			if (err.response?.status === 411) {
				dispatch(logoutUser());
				navigate("/auth/login");
			}
			console.error(err);
		}
	};

	return (
		<header className="bg-gray-800 shadow-md relative z-50">
			<nav className="max-w-screen-xl mx-auto p-4 flex items-center justify-between">
				{/* Logo */}
				<div className="text-white text-2xl font-bold">
					<Link to={currentUser ? "/home" : "/auth/login"}>
						BookExchange
					</Link>
				</div>

				{/* Desktop Links */}
				<div className="space-x-6 hidden md:flex">
					{!currentUser && (
						<Link
							to="/auth/register"
							className="text-white hover:text-gray-300 transition"
						>
							Register
						</Link>
					)}
					{currentUser ? (
						<>
							<Link
								to="/home"
								className="text-white hover:text-gray-300 transition"
							>
								Home
							</Link>
							{isOwner && (
								<Link
									to="/add-book"
									className="text-white hover:text-gray-300 transition"
								>
									Add New Book
								</Link>
							)}
							<button
								onClick={handleLogout}
								className="text-white hover:text-gray-300 transition"
							>
								Logout
							</button>
						</>
					) : (
						<Link
							to="/auth/login"
							className="text-white hover:text-gray-300 transition"
						>
							Login
						</Link>
					)}
				</div>

				{/* Hamburger Icon */}
				<div className="md:hidden">
					<button
						onClick={() => setIsMobileMenuOpen(true)}
						className="text-white text-2xl focus:outline-none"
					>
						☰
					</button>
				</div>
			</nav>

			{/* Mobile Menu */}
			{isMobileMenuOpen && (
				<>
					{/* Backdrop */}
					<div
						onClick={() => setIsMobileMenuOpen(false)}
						className="fixed inset-0 bg-black bg-opacity-50 z-40"
					></div>

					{/* Slide-In Menu */}
					<div className="fixed top-0 right-0 w-3/4 sm:w-1/2 h-full bg-gray-900 p-6 z-50 transition-transform duration-300 ease-in-out shadow-lg">
						{/* Close Button */}
						<div className="flex justify-end mb-6">
							<button
								onClick={() => setIsMobileMenuOpen(false)}
								className="text-white text-2xl"
							>
								&times;
							</button>
						</div>

						{/* Menu Items */}
						<div className="space-y-4">
							{currentUser ? (
								<>
									<Link
										to="/home"
										onClick={() =>
											setIsMobileMenuOpen(false)
										}
										className="block text-white hover:text-gray-300 text-lg"
									>
										Home
									</Link>
									{isOwner && (
										<Link
											to="/add-book"
											onClick={() =>
												setIsMobileMenuOpen(false)
											}
											className="block text-white hover:text-gray-300 text-lg"
										>
											Add New Book
										</Link>
									)}
									<button
										onClick={() => {
											handleLogout();
											setIsMobileMenuOpen(false);
										}}
										className="block text-white hover:text-gray-300 text-lg"
									>
										Logout
									</button>
								</>
							) : (
								<>
									<Link
										to="/auth/login"
										onClick={() =>
											setIsMobileMenuOpen(false)
										}
										className="block text-white hover:text-gray-300 text-lg"
									>
										Login
									</Link>
									<Link
										to="/auth/register"
										onClick={() =>
											setIsMobileMenuOpen(false)
										}
										className="block text-white hover:text-gray-300 text-lg"
									>
										Register
									</Link>
								</>
							)}
						</div>
					</div>
				</>
			)}
		</header>
	);
};

export default Navbar;
