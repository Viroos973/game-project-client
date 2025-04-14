import "./Badge.scss"

export const Badge = ({ title, isSuccess = true }) => {
    return (
        <div className={`badge ${isSuccess ? 'success' : 'cancel'}`}>
            <p>{title}</p>
        </div>
    )
}