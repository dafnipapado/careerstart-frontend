export type ButtonProps = {
    label: string;
    addClasses?: string;
    disabled?: boolean;
    onClick?: () => void;
    type?: "button" | "submit" | "reset"
}