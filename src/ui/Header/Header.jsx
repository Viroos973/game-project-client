import "./Header.scss"

export const Header = ({ className, children }) => {
    return (
        <div className={`header ${className}`}>{children}</div>
    )
}