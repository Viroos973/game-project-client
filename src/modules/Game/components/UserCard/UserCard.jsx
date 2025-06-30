import './UserCard.scss'
import {Button} from "../../../../ui/index.js";
import {switchTypeCharacteristic} from "./helper/switchTypeCharacteristic.js";
import {switchRole} from "./helper/switchRole.js";
import socket from "../../../../utils/socket/socket.js";
import {ACTIONS} from "../../../../utils/socket/actions.js";

const UserCard = ({ id, name, role, characteristics, isVoted, myState, isActive }) => {
    const handleClick = () => {
        if (myState?.role === 'LEADER' && !isActive) {
            console.log("Изгнать игрока")
        } else if (myState?.role === 'LEADER') {
            console.log("Пригласить/Изгнать из Сената")
        } else {
            socket.emit(ACTIONS.VOTE, id);
        }
    }

    return (
        <div className='userCard'>
            <div className='flex gap-10px'>
                <div className='internalCard flex-1'>
                    {name}
                </div>
                <div className='internalCard flex-1'>
                    {switchRole(role)}
                </div>
            </div>
            <div className='content internalCard'>
                {characteristics.map((characteristic) => (
                    <p key={characteristic} style={{color: characteristic.isOpen ? "#242424" : "#92140C"}}>
                        {`${switchTypeCharacteristic(characteristic.type)}: ${characteristic.name}`}
                    </p>
                ))}
            </div>
            {id !== myState?.id && (
                <Button className='big-btn btn-success' onClick={handleClick}
                        disabled={isVoted && myState?.role !== 'LEADER'}>
                    {myState?.role === 'LEADER' && !isActive
                        ? "Изгнать игрока"
                        : myState?.role === 'LEADER'
                            ? "Пригласить/Изгнать из Сената"
                            : "Проголосовать"}
                </Button>
            )}
        </div>
    )
}

export default UserCard;