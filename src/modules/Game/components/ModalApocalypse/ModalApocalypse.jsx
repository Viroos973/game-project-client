import Modal from "../../../../components/Modal/Modal.jsx";

const ModalApocalypse = ({ show, onClose, title, description }) => (
    <Modal show={show} onClose={onClose}>
        <h1 className="modal-title">
            {title}
        </h1>
        <h1 className="modal-info">
            {description}
        </h1>
    </Modal>
)

export default ModalApocalypse;