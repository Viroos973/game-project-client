import './UserCard.scss'
import {Button} from "../../../../ui/index.js";
import {switchTypeCharacteristic} from "./helper/switchTypeCharacteristic.js";
import {switchRole} from "./helper/switchRole.js";

const UserCard = ({ id, name, role, characteristics, myState }) => {
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
                <Button className='big-btn btn-success'>
                    {myState?.role === 'LEADER' ? "Пригласить/Изгнать из Сената" : "Проголосовать"}
                </Button>
            )}
        </div>
    )
}

export default UserCard;