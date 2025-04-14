import "./CustomForm.scss"

export const CustomForm = ({ onSubmit, className, children }) => {
    return (
        <form onSubmit={onSubmit} className={`form ${className}`}>
            {children}
        </form>
    )
}