import {useEffect, useState} from "react";
import socket from "../../utils/socket/socket.js";
import {ACTIONS} from "../../utils/socket/actions.js";
import RoomCard from "./components/RoomCard/RoomCard.jsx";
import {Button, Header} from "../../ui/index.js";
import ModalApocalypse from "./components/ModalApocalypse/ModalApocalypse.jsx";
import Slider from "react-slick";
import UserCard from "./components/UserCard/UserCard.jsx";
import {parserToken} from "../../utils/func/parserToken.js";

const Game = ({ isStartGame, isMap, setIsLoadingGame, isRestartTimer }) => {
    const socketId = parserToken(localStorage.getItem("token"))?.userId;

    const [gameState, setGameState] = useState(null)
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [showApocalypse, setShowApocalypse] = useState(false);
    const [myState, setMyState] = useState(null)

    const handleShowApocalypse = () => setShowApocalypse(true)
    const handleCloseApocalypse = () => setShowApocalypse(false)

    const getSettings = () => {
        let initialSlide = 0;

        if (gameState?.users) {
            const index = gameState.users.findIndex(user => user.id === socketId);
            if (index !== -1) initialSlide = index;
        }

        return {
            dots: false,
            arrows: false,
            infinite: true,
            speed: 500,
            slidesToShow: 1,
            slidesToScroll: 1,
            initialSlide
        };
    };

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
        setIsLoadingGame(!gameState)

        if (!gameState || selectedRoom) return

        const socketId = parserToken(localStorage.getItem("token"))?.userId;
        setMyState(gameState.users.find(user => user.id === socketId))

        setSelectedRoom(gameState.rooms[0].id)
    }, [gameState, selectedRoom])

    useEffect(() => {
        if (!isRestartTimer || !gameState) return

        setSelectedRoom(gameState.rooms[0].id)
    }, [isRestartTimer, gameState])

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
                    {!isMap ? (
                        <div className="slider-container">
                            <Slider {...getSettings()}>
                                {gameState.users.map((user) => (
                                    <UserCard {...user} key={user.id} myState={myState}/>
                                ))}
                            </Slider>
                        </div>
                    ) : (
                        <>
                            <h1 className={"text-center"}>{"КОМНАТЫ"}</h1>
                            <div className={"flex flex-column gap-10px"}>
                                {gameState.rooms.map((room) => (
                                    <RoomCard {...room} key={room.id} selectedRoom={selectedRoom}
                                              setSelectedRoom={setSelectedRoom} isRestartTimer={isRestartTimer}/>
                                ))}
                            </div>
                        </>
                    )}
                    <ModalApocalypse show={showApocalypse} onClose={handleCloseApocalypse}
                                     title={gameState.apocalypse} description={gameState.descriptionApocalypse}/>
                </div>
            )}
        </>
    )
}

export default Game