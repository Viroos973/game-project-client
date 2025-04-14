import { useFormContext } from 'react-hook-form';
import "./SelectField.scss"

export const SelectField = ({ name, options, validation }) => {
    const { register, formState: { errors } } = useFormContext();

    return (
        <div className="select-wrapper">
            <select {...register(name, validation)} defaultValue={options[0]?.value} className={"select-field"}>
                {options.map((option, index) => (
                    <option key={index} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {errors[name] && <p className="error-message">{errors[name].message}</p>}
        </div>
    );
}