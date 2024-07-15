import { cn } from "@/lib/utils";
import { FaSpinner } from "react-icons/fa6";

type SpinnerProps = {
    className?: string,
    size?: number,
}
export const Spinner = ({className, size=18}: SpinnerProps) => {
    return ( <FaSpinner size={size} className={cn(className, 'animate-spin me-2')}/> );
}