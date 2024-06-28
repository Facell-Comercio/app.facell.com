import { format } from "date-fns";

export function checkFeriado(date: Date) {
  // Aqui você pode implementar a lógica para verificar se a data é um feriado
  // Por exemplo, verificar em uma lista de feriados
  // Este é um exemplo simples que considera apenas os feriados fixos no ano
  const feriadosFixos = [
    "01-01",
    "04-21",
    "05-01",
    "09-07",
    "10-12",
    "11-02",
    "11-15",
    "12-25",
  ];
  const formattedDate = format(date, "MM-dd");
  return feriadosFixos.includes(formattedDate);
}
