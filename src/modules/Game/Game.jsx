import {useEffect, useState} from "react";
import socket from "../../utils/socket/socket.js";
import {ACTIONS} from "../../utils/socket/actions.js";
import RoomCard from "./components/RoomCard/RoomCard.jsx";

const Game = ({ isStartGame }) => {
    const [gameState, setGameState] = useState(null)

    useEffect(() => {
        const handleStateColony = (state) => {
            setGameState(state)
        }

        socket.on(ACTIONS.SET_STATE_COLONY, handleStateColony)

        return () => {
            socket.off(ACTIONS.SET_STATE_COLONY, handleStateColony)
        }
    }, [])

    return isStartGame && (
        <>
            {!gameState ? (
                <h1>{"ЗАГРУЗКА"}</h1>
            ) : (
                <>
                    <h1>{"КОМНАТЫ"}</h1>
                    {gameState.rooms.map((room) => (
                        <RoomCard {...room} key={room.id} />
                    ))}
                </>
            )}
        </>
    )
}

export default Game