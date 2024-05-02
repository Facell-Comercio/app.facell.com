import { AxiosResponse } from "axios";

export function downloadResponse(response:AxiosResponse){
    const fileData = response.data;
    const fileName =  response.headers["content-disposition"].split("=")[1]               
    const url = window.URL.createObjectURL(fileData);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

}