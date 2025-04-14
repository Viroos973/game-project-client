import { useFormContext } from 'react-hook-form';
import "./InputField.scss"

export const InputField = ({ name, type, placeholder, validation, defaultValue, className, max = 10000000 }) => {
    const { register, formState: { errors } } = useFormContext();

    return (
        <div className="input-wrapper">
            <input
                className={`input-field ${className}`}
                type={type}
                placeholder={placeholder}
                {...register(name, {...validation,
                    validate:  value => {
                        if (type === 'number') {
                            return value <= max || `Это слишком много. Максимум ${max}`;
                        }
                        return true
                    }
                })}
                defaultValue={defaultValue}
                min={0}
            />
            {errors[name] && <p className="error-message">{errors[name]?.message}</p>}
        </div>
    );
};