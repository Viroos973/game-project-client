import "./Modal.scss"
import {useState} from "react";
import {Button} from "../../ui/index.js";
import { X } from 'lucide-react';

const Modal = ({ show, onClose, children, className }) => {
    const [isExiting, setIsExiting] = useState(false)

    const closeModal = () => {
        setIsExiting(true)

        setTimeout(() => {
            onClose();
            setIsExiting(false)
        }, 100);
    }

    return (
        show && (
            <div className={`modal ${className}`}>
                <div className={`modal-wrapper ${isExiting ? 'modal-exit' : ''}`}>
                    <div className='modal-content'>
                        <Button className='close-icon btn-link' onClick={closeModal}>
                            <X />
                        </Button>
                        <div className='modal-body'>{children}</div>
                    </div>
                </div>
            </div>
        )
    )
}

export default Modal