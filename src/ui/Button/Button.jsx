import "./Button.scss"

export const Button = ({ children, className, onClick, type = "button", disabled }) => {
    return (
        <button className={`btn ${className}`} onClick={onClick} type={type} disabled={disabled}>{children}</button>
    )
}