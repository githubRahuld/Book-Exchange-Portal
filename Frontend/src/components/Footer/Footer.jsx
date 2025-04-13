import { Link } from "react-router-dom";

const Footer = () => {
	return (
		<footer className="bg-gray-800 text-white py-8 shadow-md">
			<div className="max-w-screen-xl mx-auto px-6">
				{/* Footer Links Section */}
				<div className="grid md:grid-cols-3 gap-8">
					{/* About Section */}
					<div>
						<h3 className="text-lg font-semibold mb-4">About Us</h3>
						<p className="text-sm text-gray-400">
							BookExchange is a peer-to-peer platform for
							exchanging books easily. Join our community and help
							make knowledge more accessible!
						</p>
					</div>

					{/* Quick Links */}
					<div>
						<h3 className="text-lg font-semibold mb-4">
							Quick Links
						</h3>
						<ul>
							<li>
								<Link
									to="/"
									className="text-gray-400 hover:text-white"
								>
									Home
								</Link>
							</li>
							<li>
								<Link
									to="/about"
									className="text-gray-400 hover:text-white"
								>
									About
								</Link>
							</li>
							<li>
								<Link
									to="/contact"
									className="text-gray-400 hover:text-white"
								>
									Contact Us
								</Link>
							</li>
						</ul>
					</div>

					{/* Social Media Links */}
					<div>
						<h3 className="text-lg font-semibold mb-4">
							Follow Us
						</h3>
						<div className="flex space-x-4">
							<a
								href="https://facebook.com"
								className="text-gray-400 hover:text-white"
							>
								<i className="fab fa-facebook-square text-2xl"></i>
							</a>
							<a
								href="https://twitter.com"
								className="text-gray-400 hover:text-white"
							>
								<i className="fab fa-twitter text-2xl"></i>
							</a>
							<a
								href="https://instagram.com"
								className="text-gray-400 hover:text-white"
							>
								<i className="fab fa-instagram text-2xl"></i>
							</a>
						</div>
					</div>
				</div>

				{/* Footer Bottom Section */}
				<div className="mt-12 border-t border-gray-700 pt-4 text-center text-sm text-gray-400">
					<p>&copy; 2025 BookExchange. All Rights Reserved.</p>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
