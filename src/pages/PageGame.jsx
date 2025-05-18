import {useParams} from "react-router-dom";
import {useEffect, useRef, useState} from "react";
import socket from "../utils/socket/socket.js";
import useWebRTC from "../hooks/useWebRTC.js";
import {Button} from "../ui/index.js";
import Lobby from "../modules/Lobby/Lobby.jsx";
import Game from "../modules/Game/Game.jsx";
import {ACTIONS} from "../utils/socket/actions.js";
import {Mic, MicOff} from "lucide-react"
import {Footer} from "../ui/Footer/Footer.jsx";

const PageGame = () => {
    const { id: roomID } = useParams();
    const hasEmitted = useRef(false);
    const { clients, provideMediaRef, toggleMute } = useWebRTC();
    const [isMuted, setIsMuted] = useState(false);
    const [isStartGame, setIsStartGame] = useState(false);
    const [isStartWithoutYou, setIsStartWithoutYou] = useState(false);

    useEffect(() => {
        if (!roomID) return

        const tgApp = window.Telegram.WebApp;

        if (!hasEmitted.current) {
            socket.emit("validation-and-join", tgApp.initData, roomID);
            hasEmitted.current = true;
        }

        const handleAlreadyStarted = () => {
            console.log('+')
            setIsStartWithoutYou(true)
        }

        socket.on(ACTIONS.ALREADY_GAME_STARTED, handleAlreadyStarted)

        return () => {
            socket.off(ACTIONS.ALREADY_GAME_STARTED, handleAlreadyStarted)
        }
    }, [roomID])

    return !isStartWithoutYou ? (
        <div className={"mb-80px"}>
            {
                clients.map((client) => (
                    <audio className={"remote-audio"} key={client}
                           ref={instance => {
                               provideMediaRef(client, instance);
                           }}
                           autoPlay muted={client === 'LOCAL_AUDIO'}
                    />
                ))
            }
            {!isStartGame && (
                <Lobby setIsStartGame={setIsStartGame}/>
            )}
            <Game isStartGame={isStartGame}/>
            <Footer className={"flex align-center justify-around"}>
                <Button className={"btn-success"} onClick={() => toggleMute(setIsMuted)}>
                    {isMuted ? <MicOff width={20} height={20}/> : <Mic width={20} height={20}/>}
                </Button>
            </Footer>
        </div>
    ) : (
        <h1 className={"text-center"}>{"Игра уже началась"}</h1>
    )
}

export default PageGame;