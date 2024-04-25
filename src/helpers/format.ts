import { format } from "date-fns";

export const formatarDataHora = (data:string)=>{
    return format(new Date(data), 'dd/MM/yyyy HH:mm')
}

export const formatarDataHoraBr = (data:string)=>{
    return format(new Date(data), 'dd/MM/yyyy HH:mm')
}