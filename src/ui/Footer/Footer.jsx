import "./Footer.scss"

export const Footer = ({ className, children }) => {
    return (
        <div className={`footer ${className}`}>{children}</div>
    )
}