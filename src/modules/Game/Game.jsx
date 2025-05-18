import {useEffect, useState} from "react";
import socket from "../../utils/socket/socket.js";
import {ACTIONS} from "../../utils/socket/actions.js";
import RoomCard from "./components/RoomCard/RoomCard.jsx";
import {Button, Header} from "../../ui/index.js";
import ModalApocalypse from "./components/ModalApocalypse/ModalApocalypse.jsx";

const Game = ({ isStartGame }) => {
    const [gameState, setGameState] = useState(null)
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [showApocalypse, setShowApocalypse] = useState(false);

    const handleShowApocalypse = () => setShowApocalypse(true)
    const handleCloseApocalypse = () => setShowApocalypse(false)

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
                <div className={"mt-70px"}>
                    <Header>
                        <Button className={"btn-w-100 btn-success"} onClick={handleShowApocalypse}>
                            {gameState.apocalypse}
                        </Button>
                    </Header>
                    <h1 className={"text-center"}>{"КОМНАТЫ"}</h1>
                    <div className={"flex flex-column gap-10px"}>
                        {gameState.rooms.map((room) => (
                            <RoomCard {...room} key={room.id} selectedRoom={selectedRoom} setSelectedRoom={setSelectedRoom}/>
                        ))}
                    </div>
                    <ModalApocalypse show={showApocalypse} onClose={handleCloseApocalypse}
                                     title={gameState.apocalypse} description={gameState.descriptionApocalypse} />
                </div>
            )}
        </>
    )
}

export default Game