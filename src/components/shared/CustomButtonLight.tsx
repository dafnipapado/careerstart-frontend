import type {ButtonProps} from "./componentTypes.ts";
import {Button} from "@base-ui/react";

const CustomButton = ({label, addClasses="", disabled=false, onClick, type}: ButtonProps) => {

    return (
        <>
            <Button
                className={`bg-primary-light hover:bg-primary-light-hover border border-primary-light-border text-text-light rounded-sm px-4 py-2 cursor-pointer ` + addClasses}
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