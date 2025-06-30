import './Timer.scss'
import {useEffect, useRef, useState} from "react";
import socket from "../../../../utils/socket/socket.js";
import {ACTIONS} from "../../../../utils/socket/actions.js";

const CustomTimer = ({ setIsRestartTimer, isActive }) => {
    const [timer, setTimer] = useState('5:00')
    const countdownRef = useRef(null);

    useEffect(() => {
        const startTime = (numberOfMin, isRestart) => {
            setIsRestartTimer(isRestart)
            setTimer(numberOfMin + ':00')

            if (countdownRef.current) {
                clearInterval(countdownRef.current);
            }

            const start_time = new Date();
            const stop_time = start_time.setMinutes(start_time.getMinutes() + numberOfMin);

            countdownRef.current = setInterval(() => {
                if (!isActive) {
                    clearInterval(countdownRef.current);
                    setTimer("0:00");
                    return;
                }

                const now = new Date().getTime();
                const remain = stop_time - now;

                const min = Math.floor( (remain % (1000 * 60 * 60)) / (1000 * 60) );
                let sec = Math.floor( (remain % (1000 * 60)) / 1000 );

                sec = sec < 10 ? "0" + sec : sec;
                setTimer(min + ":" + sec);

                if (remain < 0) {
                    clearInterval(countdownRef.current);
                    socket.emit(ACTIONS.MOVE_ALL_TO_LOBBY)

                    if (isRestart) {
                        socket.emit(ACTIONS.END_VOTING)
                    } else {
                        socket.emit(ACTIONS.ACTIVATE_VOTING)
                    }

                    setTimer("0:00");
                }
            }, 1000);
        }

        socket.on(ACTIONS.RESTART_TIMER, startTime)

        startTime(5, false)

        return () => {
            socket.off(ACTIONS.RESTART_TIMER, startTime)
            if (countdownRef.current) {
                clearInterval(countdownRef.current);
            }
        }
    }, [isActive])

    return (
        <div id='timer'>
            <p>{timer}</p>
        </div>
    )
}

export default CustomTimer