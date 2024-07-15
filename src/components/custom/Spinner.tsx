import { cn } from "@/lib/utils";
import { FaSpinner } from "react-icons/fa6";

type SpinnerProps = {
    className?: string,
}
export const Spinner = ({className}: SpinnerProps) => {
    return ( <FaSpinner className={cn(className, 'animate-spin me-2')}/> );
}