import {Button, Card} from "../../../../ui/index.js";
import socket from "../../../../utils/socket/socket.js";
import {ACTIONS} from "../../../../utils/socket/actions.js";

const RoomCard = ({ name, isOpen, usersNum, id }) => {
    const handleSetRoom = () => {
        socket.emit(ACTIONS.SET_ROOM, id)
    }

    return (
        <Card className={"big-card"}>
            <div className={"card-info"}>
                <p>{name}</p>
                <div className={"flex align-center gap-10px"}>
                    <p>{usersNum}</p>
                    <Button className={"btn-success"} onClick={handleSetRoom}>
                        {"Перейти"}
                    </Button>
                    <Button className={"btn-success"}>
                        {isOpen ? "Закрыть" : "Открыть"}
                    </Button>
                </div>
            </div>
        </Card>
    )
}

export default RoomCard;