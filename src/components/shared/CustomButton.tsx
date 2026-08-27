import type {ButtonProps} from "./componentTypes.ts";
import {Button} from "@base-ui/react";

const CustomButton = ({label, addClasses="", disabled=false, onClick}: ButtonProps) => {

    return (
        <>
            <Button
                className={`bg-cf-dark-gray opacity-90 hover:opacity-100 
                text-white px-4 py-2 rounded cursor-pointer ` + addClasses}
                disabled={disabled}
                onClick={onClick}
            >
                {label}
            </Button>
        </>
    )
}

export default CustomButton;