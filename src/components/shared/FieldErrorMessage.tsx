import type {FieldError} from "react-hook-form";

const FieldErrorMessage = ({error}: {error?: FieldError}) => {
    return (
        <>
            <div className="h-1 text-sm mt-1 text-start text-error-dark-red">
                {error && ( <div>{error.message}</div>)}
            </div>
        </>
    )
}

export default FieldErrorMessage;