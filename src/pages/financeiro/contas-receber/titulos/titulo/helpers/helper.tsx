import { Fragment } from "react/jsx-runtime";

export const formatarHistorico = (descricao: string) => {
  if (!descricao) return descricao;
  let iniciais = descricao.substring(0, 2).toUpperCase();
  let cor = "";
  switch (iniciais) {
    case "EM":
      // EMITIDO
      cor = "text-green-500";
      break;
    case "CA":
      // CANCELADO
      cor = "text-red-500";
      break;
    case "RE":
      // RETORNADO PARA CRIADO
      cor = "";
      break;
    case "ED":
      // EDITADO
      cor = "text-orange-500";
      break;
    case "PA":
      // PAGO
      cor = "text-blue-500";
      break;
    default:
      break;
  }

  return (
    <span className={`${cor}`}>
      {descricao?.split("\n").map((trecho, index) => (
        <Fragment key={`trecho.${index}.${trecho}`}>
          <span className={`${trecho.includes("\t") ? "ms-3" : ""}`}>{trecho}</span>
          <br />
        </Fragment>
      ))}
    </span>
  );
};

export const copyToClipboard = async (texto: string) => {
  let success = true;
  try {
    await navigator.clipboard.writeText(texto);
  } catch (err) {
    success = false;
  }
  return success;
};
