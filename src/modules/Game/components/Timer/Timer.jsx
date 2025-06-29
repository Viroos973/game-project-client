import './Timer.scss'
import {useEffect, useState} from "react";
import socket from "../../../../utils/socket/socket.js";
import {ACTIONS} from "../../../../utils/socket/actions.js";

const CustomTimer = ({setIsRestartTimer}) => {
    const [timer, setTimer] = useState('5:00')

    useEffect(() => {
        const startTime = (numberOfMin, isRestart) => {
            setIsRestartTimer(isRestart)

            const start_time = new Date();
            const stop_time = start_time.setMinutes(start_time.getMinutes() + numberOfMin);

            const countdown = setInterval(() => {
                const now = new Date().getTime();
                const remain = stop_time - now;

                const min = Math.floor( (remain % (1000 * 60 * 60)) / (1000 * 60) );
                let sec = Math.floor( (remain % (1000 * 60)) / 1000 );

                sec = sec < 10 ? "0" + sec : sec;
                setTimer(min + ":" + sec);

                if (remain < 0) {
                    clearInterval(countdown);

                    if (isRestart) {
                        setTimer("0:00");
                    } else {
                        setTimer("2:00");
                        socket.emit(ACTIONS.ACTIVATE_VOTING)
                    }
                }
            }, 1000);
        }

        socket.on(ACTIONS.RESTART_TIMER, startTime)

        startTime(5, false)

        return () => {
            socket.off(ACTIONS.RESTART_TIMER, startTime)
        }
    }, [])

    return (
        <div id='timer'>
            <p>{timer}</p>
        </div>
    )
}

export default CustomTimer