import {createBrowserRouter, Navigate} from "react-router-dom";
import { v4 as uuidV4 } from "uuid"
import {ROUTES} from "./utils/constant/routes.js";
import PageJoin from "./pages/PageJoin.jsx";
import PageGame from "./pages/PageGame.jsx";

export const router = createBrowserRouter([
    {
        path: ROUTES.ROOT,
        element: <Navigate to={`/room/${uuidV4()}`} replace/>
    },
    {
        path: ROUTES.JOIN_PAGE,
        element: <PageJoin/>
    },
    {
        path: ROUTES.GAME,
        element: <PageGame/>
    }
])