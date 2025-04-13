import { Outlet } from "react-router-dom";
import { Navbar, Footer } from "./components";

import "./App.css";

function App() {
	return (
		<>
			<div className="flex flex-col min-h-screen">
				<Navbar />
				<main className="flex-grow">
					<Outlet />
				</main>
				<Footer />
			</div>
		</>
	);
}

export default App;
