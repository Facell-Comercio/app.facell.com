import { format } from "date-fns";

export const formatarDataHora = (data: string) => {
  return format(new Date(data), "dd/MM/yyyy HH:mm");
};

export const formatarDataHoraBr = (data: string) => {
  return format(new Date(data), "dd/MM/yyyy HH:mm");
};

export const urlB64ToUint8Array = (base64String: string) => {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

export function objectToStringLine(object: any) {
  return Object.values(object).reduce((acc, value) => {
    if (value instanceof Date) {
      const dia = String(value.getDate()).padStart(2, "0");
      const mes = String(value.getMonth() + 1).padStart(2, "0");
      const ano = value.getFullYear();

      value = `${dia}${mes}${ano}`;
    }
    return acc + (value !== null && value !== undefined ? String(value) : "");
  }, "");
}
