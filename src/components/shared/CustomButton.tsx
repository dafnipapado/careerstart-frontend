import type {ButtonProps} from "./componentTypes.ts";
import {Button} from "@base-ui/react";

const CustomButton = ({label, addClasses="", disabled=false, onClick, type}: ButtonProps) => {

    return (
        <>
            <Button
                className={`text-white px-4 py-2 rounded-sm bg-primary-dark-purple hover:bg-hover-dark-purple border-3 border-secondary-light-purple cursor-pointer ` + addClasses}
                disabled={disabled}
                onClick={onClick}
                type={type}
            >
                {label}
            </Button>
        </>
    )
}

export default CustomButton;