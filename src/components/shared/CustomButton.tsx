import type {ButtonProps} from "./componentTypes.ts";
import {Button} from "@base-ui/react";

const CustomButton = ({label, addClasses="", disabled=false, onClick}: ButtonProps) => {

    return (
        <>
            <Button
                className={`text-white px-4 py-2 rounded-sm bg-font-dark-purple hover:bg-hover-dark-purple cursor-pointer ` + addClasses}
                disabled={disabled}
                onClick={onClick}
            >
                {label}
            </Button>
        </>
    )
}

export default CustomButton;