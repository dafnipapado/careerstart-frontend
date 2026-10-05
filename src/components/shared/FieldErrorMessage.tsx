import type {FieldError} from "react-hook-form";

const FieldErrorMessage = ({error}: {error?: FieldError}) => {
    return (
        <>
            <div className="h-1 text-sm text-start text-danger mt-1">
                {error && ( <div>{error.message}</div>)}
            </div>
        </>
    )
}

export default FieldErrorMessage;