import {createBrowserRouter} from "react-router-dom";
import Root from "./root";
import ErrorPage from "../pages/error-page";
import Projects from "../pages/projects";
import About from "../pages/about";
import React from "react";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Root />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: "/projects",
                element: <Projects />,
            },
            {
                path: "/about",
                element: <About />,
            },
        ],
    },
]);

export default router;