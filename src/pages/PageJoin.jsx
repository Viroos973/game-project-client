import {Button, Card, CustomForm, InputField} from "../ui/index.js";
import {FormProvider, useForm} from "react-hook-form";
import socket from "../utils/socket/socket.js";
import {ACTIONS} from "../utils/socket/actions.js";
import {useEffect, useRef, useState} from "react";
import {useNavigate} from "react-router-dom";

const PageJoin = () => {
    const methods = useForm();
    const navigate = useNavigate();
    const [isError, setIsError] = useState(false);
    
    useEffect(() => {
        if (!navigate) return

        const handlerNavLink = (isKey, roomKey) => {
            if (isKey && roomKey) {
                setIsError(false);
                navigate(`/room/${roomKey}`)
            } else {
                setIsError(true);
            }
        }

        socket.on(ACTIONS.JOIN_WITH_KEY, handlerNavLink)

        return () => {
            socket.off(ACTIONS.JOIN_WITH_KEY, handlerNavLink)
        }
    }, [navigate])

    const onSubmit = (data) => {
        socket.emit(ACTIONS.SEND_KEY, data.roomKey)
    }

    return (
        <Card>
            <FormProvider {...methods}>
                <CustomForm onSubmit={methods.handleSubmit(onSubmit)} className={"card-info"}>
                    <InputField name={"roomKey"} type={"text"} placeholder={"Введите ключ комнаты"}
                                validation={{
                                    required: 'Поле должно быть заполнено',
                                }}/>
                    <Button className={"btn-cancel"} type="submit">
                        {"Присоединиться"}
                    </Button>
                    {isError && <p className="error-message">{"Комната переполнена или не существует"}</p>}
                </CustomForm>
            </FormProvider>
        </Card>
    )
}

export default PageJoin;