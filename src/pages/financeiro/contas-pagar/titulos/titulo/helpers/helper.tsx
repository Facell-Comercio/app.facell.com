import { checkFeriado } from "@/helpers/checkFeriado";
import {
  addDays,
  isMonday,
  isSaturday,
  isSunday,
  isThursday,
  isWeekend,
  startOfDay,
  subDays,
} from "date-fns";
import { Fragment } from "react/jsx-runtime";

export const getVencimentoMinimo = (isMaster: boolean) => {
  if (isMaster) return undefined;
  const dataAtual = new Date();
  dataAtual.setDate(dataAtual.getDate());
  return dataAtual;
};

export const proximoDiaUtil = (data: Date | string) => {
  let proximoDiaUtil = data;
  while (isWeekend(proximoDiaUtil)) {
    proximoDiaUtil = addDays(proximoDiaUtil, 1);
  }
  return proximoDiaUtil;
};

export const calcularDataPrevisaoPagamento = (
  data_venc: Date | string,
  formaPagamento: string
) => {
  let dataVencimento = startOfDay(data_venc); // Inicia com o próximo dia

  const dataAtual = startOfDay(new Date());
  let dataMinima = addDays(dataAtual, 2);

  while (
    (!isMonday(dataMinima) && !isThursday(dataMinima)) ||
    checkFeriado(dataMinima)
  ) {
    dataMinima = addDays(dataMinima, 1); // Avança para o próximo dia até encontrar uma segunda ou quinta-feira que não seja feriado
  }
  let dataPagamento = dataMinima;

  // 27-04 <= 26-04
  if (dataVencimento <= dataMinima) {
    // A data de vencimento é inferior a data atual,
    //então vou buscar a partir da data atual + 1 a próxima data de pagamento
    while (
      dataPagamento < dataMinima ||
      (!isMonday(dataPagamento) && !isThursday(dataPagamento)) ||
      checkFeriado(dataPagamento)
    ) {
      dataPagamento = addDays(dataPagamento, 1); // Avança para o próximo dia até encontrar uma segunda ou quinta-feira que não seja feriado
    }
  } else {
    dataPagamento = dataVencimento;
    if (isSaturday(dataPagamento)) {
      dataPagamento = addDays(dataPagamento, 2);
    }
    if (isSunday(dataPagamento)) {
      dataPagamento = addDays(dataPagamento, 1);
    }
    while (
      (!isMonday(dataPagamento) && !isThursday(dataPagamento)) ||
      checkFeriado(dataPagamento)
    ) {
      dataPagamento = subDays(dataPagamento, 1); // Avança para o próximo dia até encontrar uma segunda ou quinta-feira que não seja feriado
    }
  }

  return dataPagamento;
};

export const checkIsTransferenciaBancaria = (id_forma_pagamento: string) => {
  const formasPagamentoQueExigemAgenciaConta = ["4", 4, "5", 5];
  return formasPagamentoQueExigemAgenciaConta.includes(id_forma_pagamento);
};

export const checkIsPIX = (id_forma_pagamento: string) => {
  return id_forma_pagamento == "4";
};

export const formatarHistorico = (descricao: string) => {
  if (!descricao) return descricao;
  let iniciais = descricao.substring(0, 2).toUpperCase();
  let cor = "";
  switch (iniciais) {
    case "AP":
      // APROVADO
      cor = "text-green-500";
      break;
    case "NE":
      // NEGADO
      cor = "text-red-500";
      break;
    case "RE":
      // RETORNADO PARA SOLICITADO
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
          <span className={`${trecho.includes("\t") ? "ms-3" : ""}`}>
            {trecho}
          </span>
          <br />
        </Fragment>
      ))}
    </span>
  );
};

type ContaOrcamento = {
  grupoValidaOrcamento: boolean;
  orcamentoAtivo?: boolean;
  active?: boolean;
};
export const checkIfValidateBudget = ({
  grupoValidaOrcamento,
  orcamentoAtivo,
  active,
}: ContaOrcamento) => {
  if (!grupoValidaOrcamento) {
    return false;
  }
  if (orcamentoAtivo === undefined) {
    return true;
  }
  if (!orcamentoAtivo) {
    return false;
  }
  if (active === undefined) {
    return true;
  }
  if (!active) {
    return false;
  }
  return true;
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
