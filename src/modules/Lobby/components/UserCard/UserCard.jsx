import {FormProvider, useForm} from "react-hook-form";
import {Button, Card, CustomForm, InputField} from "../../../../ui/index.js";
import {useState} from "react";
import socket from "../../../../utils/socket/socket.js";
import {ACTIONS} from "../../../../utils/socket/actions.js";

const UserCard = ({ username, isMe }) => {
    const methods = useForm();
    const [isEdit, setIsEdit] = useState(false);

    const handleEdit = () => setIsEdit(true)
    const handleNotEdit = () => setIsEdit(false);

    const onSubmit = (data) => {
        socket.emit(ACTIONS.SET_USERNAME, data.username)
        setIsEdit(false)
    }

    return (
        <Card className={"big-card"}>
            {isEdit ? (
                <FormProvider {...methods}>
                    <CustomForm onSubmit={methods.handleSubmit(onSubmit)} className={"card-info"}>
                        <InputField name={"username"} type={"text"} defaultValue={username}
                                    validation={{
                                        required: 'Поле должно быть заполнено',
                                    }}/>
                        <div>
                            <Button className={"btn-cancel"} onClick={handleNotEdit}>
                                {"Отмена"}
                            </Button>
                            <Button className={"btn-success"} type={"submit"}>
                                {"Сменить"}
                            </Button>
                        </div>
                    </CustomForm>
                </FormProvider>
            ) : (
                <div className={"card-info"}>
                    <p>{username}</p>
                    {isMe && (
                        <Button className={"btn-success"} onClick={handleEdit}>
                            {"Сменить имя"}
                        </Button>
                    )}
                </div>
            )}
        </Card>
    )
}

export default UserCard;