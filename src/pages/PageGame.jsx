import {useParams} from "react-router-dom";
import {useEffect, useRef, useState} from "react";
import socket from "../utils/socket/socket.js";
import useWebRTC from "../hooks/useWebRTC.js";
import {Button, Footer} from "../ui/index.js";
import Lobby from "../modules/Lobby/Lobby.jsx";
import Game from "../modules/Game/Game.jsx";
import {ACTIONS} from "../utils/socket/actions.js";
import {Map, Mic, MicOff, UsersRound} from "lucide-react";
import CustomTimer from "../modules/Game/components/Timer/Timer.jsx";

const PageGame = () => {
    const { id: roomID } = useParams();
    const hasEmitted = useRef(false);
    const { clients, provideMediaRef, toggleMute } = useWebRTC();
    const [isMap, setIsMap] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [isStartGame, setIsStartGame] = useState(false);
    const [isStartWithoutYou, setIsStartWithoutYou] = useState(false);
    const [isLoadingGame, setIsLoadingGame] = useState(true);
    const [isRestartTimer, setIsRestartTimer] = useState(false);
    const [isActive, setIsActive] = useState(true);

    useEffect(() => {
        if (!roomID) return

        const tgApp = window.Telegram.WebApp;

        if (!hasEmitted.current) {
            socket.emit("validation-and-join", tgApp.initData, roomID);
            hasEmitted.current = true;
        }

        const handleAlreadyStarted = () => {
            setIsStartWithoutYou(true)
        }

        const handleStopActivity = () => {
            setIsActive(false)
            socket.emit(ACTIONS.MOVE_ALL_TO_LOBBY)
        }

        socket.on(ACTIONS.ALREADY_GAME_STARTED, handleAlreadyStarted)
        socket.on(ACTIONS.STOP_ACTIVITY, handleStopActivity)

        return () => {
            socket.off(ACTIONS.ALREADY_GAME_STARTED, handleAlreadyStarted)
            socket.off(ACTIONS.STOP_ACTIVITY, handleStopActivity)
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
            <Game isStartGame={isStartGame} isMap={isMap} setIsLoadingGame={setIsLoadingGame}
                  isRestartTimer={isRestartTimer} isActive={isActive}/>
            <Footer className={"flex align-center justify-around"}>
                {!isLoadingGame && (
                    <>
                        <Button className={"btn-success"} onClick={() => setIsMap(prev => !prev)}>
                            {isMap ? <UsersRound width={20} height={20}/> : <Map width={20} height={20}/>}
                        </Button>
                        <CustomTimer setIsRestartTimer={setIsRestartTimer} isActive={isActive}/>
                    </>
                )}
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