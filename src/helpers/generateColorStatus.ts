export const generateStatusColor = ({
  status,
  bg,
  text,
}: {
  status?: string;
  bg?: boolean;
  text?: boolean;
}) => {
  if (!status) return " ";
  var bgColor = "bg-gray-300 dark:bg-gray-800";
  var textColor = "text-slate-800 dark:text-slate-300";

  switch (status) {
    case "Pago":
      bgColor = `bg-blue-500`;
      textColor = `text-blue-500`;
      break;
    case "Pago Parcial":
      bgColor = `bg-blue-500`;
      textColor = `text-blue-500`;
      break;
    case "Aprovado":
      bgColor = `bg-green-500`;
      textColor = `text-green-500`;
      break;
    case "Negado":
      bgColor = `bg-red-500`;
      textColor = `text-red-500`;
      break;
    case "Cancelado":
      bgColor = ` `;
      textColor = ` `;
      break;
    default:
      break;
  }

  if (bg && text) {
    return ` ${bgColor} dark:text-white`;
  }
  if (bg) {
    return ` ${bgColor} `;
  }
  if (text) {
    return ` ${textColor} `;
  }
  return `${bgColor} ${textColor}`;
};
