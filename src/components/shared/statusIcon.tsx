import {Check, Clock, X} from "lucide-react";

export const statusIcon = (status: string | undefined) => {
    if (status === 'ACCEPTED') return <Check size={22} />
    if (status === 'PENDING') return <Clock size={20} />
    if (status === 'REJECTED') return <X size={22} />
}