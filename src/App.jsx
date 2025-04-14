import { RouterProvider } from 'react-router-dom';
import {router} from "./router.jsx";
import {useEffect} from "react";
import socket from "./utils/socket/socket.js";
import {ACTIONS} from "./utils/socket/actions.js";

function App() {
    useEffect(() => {
        const handlerSetToken = (token) => {
            localStorage.setItem("token", token);
        }

        socket.on(ACTIONS.SET_TOKEN, handlerSetToken)

        return () => {
            socket.off(ACTIONS.SET_TOKEN, handlerSetToken)
        }
    }, [])

    return (
        <>
            <RouterProvider router={router}/>
        </>
    )
}

export default App
