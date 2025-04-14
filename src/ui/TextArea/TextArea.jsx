import { useFormContext } from 'react-hook-form';
import "../InputField/InputField.scss"

export const TextArea = ({ name, rows = 4, placeholder, validation, defaultValue, className }) => {
    const { register, formState: { errors } } = useFormContext();

    return (
        <div className="input-wrapper">
            <textarea
                className={`input-field ${className}`}
                rows={rows}
                placeholder={placeholder}
                {...register(name, validation)}
                defaultValue={defaultValue}
            />
            {errors[name] && <p className="error-message">{errors[name]?.message}</p>}
        </div>
    );
};