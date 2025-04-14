import "./Card.scss"

export const Card = ({ className, children }) => {
    return (
        <div className={`card ${className}`}>{children}</div>
    )
}