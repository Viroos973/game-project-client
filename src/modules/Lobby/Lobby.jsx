import {useEffect, useState} from "react";
import socket from "../../utils/socket/socket.js";
import {ACTIONS} from "../../utils/socket/actions.js";
import UserCard from "./components/UserCard/UserCard.jsx";
import {useParams} from "react-router-dom";
import {parserToken} from "../../utils/func/parserToken.js";
import {Button} from "../../ui/index.js";

const Lobby = ({ setIsStartGame }) => {
    const [users, setUsers] = useState([]);
    const { id: roomID } = useParams();
    const socketId = parserToken(localStorage.getItem("token"))?.userId;

    const createGame = () => {
        socket.emit(ACTIONS.CREATE_GAME)
    }

    useEffect(() => {
        const handlerGetClient = (usersArray) => {
            setUsers(usersArray);
        }

        socket.on(ACTIONS.GET_CLIENTS, handlerGetClient)

        return () => {
            socket.off(ACTIONS.GET_CLIENTS, handlerGetClient)
        }
    }, [])

    useEffect(() => {
        const handlerStartGame = () => {
            setIsStartGame(true)
        }

        socket.on(ACTIONS.START_GAME, handlerStartGame)

        return () => {
            socket.off(ACTIONS.START_GAME, handlerStartGame)
        }
    }, [])

    return (
        <div className={"flex flex-column gap-10px"}>
            <h4 className={"text-center mb-0"}>{roomID}</h4>
            {users[0]?.socketId === socketId && (
                <Button className={"btn-success btn-w-100"} onClick={createGame}>
                    {"Начать игру"}
                </Button>
            )}
            {
                users.map((user, index) => (
                    <UserCard key={index} {...user} isMe={user.socketId === socketId}/>
                ))
            }
        </div>
    )
}

export default Lobby;