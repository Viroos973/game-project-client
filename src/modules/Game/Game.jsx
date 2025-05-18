import {useEffect, useState} from "react";
import socket from "../../utils/socket/socket.js";
import {ACTIONS} from "../../utils/socket/actions.js";
import RoomCard from "./components/RoomCard/RoomCard.jsx";

const Game = ({ isStartGame }) => {
    const [gameState, setGameState] = useState(null)
    const [selectedRoom, setSelectedRoom] = useState(null);

    useEffect(() => {
        const handleStateColony = (state) => {
            setGameState(state)
        }

        socket.on(ACTIONS.SET_STATE_COLONY, handleStateColony)

        return () => {
            socket.off(ACTIONS.SET_STATE_COLONY, handleStateColony)
        }
    }, [])

    useEffect(() => {
        if (!gameState || selectedRoom) return

        setSelectedRoom(gameState.rooms[0].id)
    }, [gameState, selectedRoom])

    return isStartGame && (
        <>
            {!gameState ? (
                <h1 className={"text-center"}>{"ЗАГРУЗКА"}</h1>
            ) : (
                <>
                    <h1 className={"text-center"}>{"КОМНАТЫ"}</h1>
                    <div className={"flex flex-column gap-10px"}>
                        {gameState.rooms.map((room) => (
                            <RoomCard {...room} key={room.id} selectedRoom={selectedRoom} setSelectedRoom={setSelectedRoom}/>
                        ))}
                    </div>
                </>
            )}
        </>
    )
}

export default Game