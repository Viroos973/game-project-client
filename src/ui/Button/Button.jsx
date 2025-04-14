import "./Button.scss"

export const Button = ({ children, className, onClick, type = "button" }) => {
    return (
        <button className={`btn ${className}`} onClick={onClick} type={type}>{children}</button>
    )
}