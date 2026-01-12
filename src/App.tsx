import { RouterProvider } from "react-router-dom";
import { dataRouter } from "./routing/dataRoutes";
import { useEffect } from "react";
import { twMerge } from "tailwind-merge";
import { AppColours } from "./types/constants";

/** Renders the react app */
export default function App() {

    useEffect(() => {
        document.body.className = twMerge(
            AppColours.BACKGROUND,
            "w-screen h-screen"
        );
    }, []);

    return (
        <RouterProvider router={dataRouter} />
    )
}
