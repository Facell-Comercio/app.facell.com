import { format } from "date-fns";

export const formatarDataHora = (data:string)=>{
    return format(new Date(data), 'MM/dd/yyyy HH:mm')
}