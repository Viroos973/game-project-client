import {Button, Card} from "../../../../ui/index.js";
import socket from "../../../../utils/socket/socket.js";
import {ACTIONS} from "../../../../utils/socket/actions.js";
import {LockKeyhole, LockKeyholeOpen, MapPin, MapPinCheckInside} from "lucide-react"

const RoomCard = ({ name, isOpen, usersNum, id, selectedRoom, setSelectedRoom, isRestartTimer }) => {
    const handleSetRoom = () => {
        if (!isOpen) return

        socket.emit(ACTIONS.SET_ROOM, id)
        setSelectedRoom(id)
    }

    return (
        <Card className={"big-card"}>
            <div className={"card-info"}>
                <p>{name}</p>
                <div className={"flex align-center gap-10px"}>
                    <p>{usersNum}</p>
                    <Button className={selectedRoom === id ? "btn-select" : "btn-success"}
                            onClick={handleSetRoom} disabled={isRestartTimer}>
                        {selectedRoom === id ? <MapPinCheckInside width={20} height={20}/> : <MapPin width={20} height={20}/>}
                    </Button>
                    <Button className={"btn-success"}>
                        {isOpen ? <LockKeyholeOpen width={20} height={20}/> : <LockKeyhole width={20} height={20}/>}
                    </Button>
                </div>
            </div>
        </Card>
    )
}

export default RoomCard;