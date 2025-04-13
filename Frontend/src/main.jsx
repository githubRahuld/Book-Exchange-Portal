import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import "./index.css";
import store from "./store/store.js";
import { Provider } from "react-redux";
import Register from "./Pages/Register.jsx";
import Login from "./Pages/Login.jsx";
import Home from "./Pages/Home.jsx";
import AddBook from "./Pages/AddBook.jsx";
import EditBook from "./Pages/EditBook.jsx";

const router = createBrowserRouter([
	{
		path: "/",
		element: <App />,
		children: [
			{
				path: "/",
				element: <Login />,
			},
			{
				path: "/auth/login",
				element: <Login />,
			},
			{
				path: "/auth/register",
				element: <Register />,
			},
			{
				path: "/home",
				element: <Home />,
			},
			{
				path: "/add-book",
				element: <AddBook />,
			},
			{
				path: "/edit-book/:id",
				element: <EditBook />,
			},
		],
	},
]);

ReactDOM.createRoot(document.getElementById("root")).render(
	<Provider store={store}>
		<main>
			<RouterProvider router={router} />
		</main>
	</Provider>
);
