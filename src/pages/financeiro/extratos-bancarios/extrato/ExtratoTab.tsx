import { isBetweenDate } from "@/helpers/validator";
import { api } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { isEqual } from "date-fns";
import { useMemo } from "react";
import Chart from "./components/Chart";
import Filters from "./components/Filters";
import Transacoes from "./components/Transacoes";
import { useExtratoStore } from "./components/context";

const ExtratoTab = () => {
  const mes = useExtratoStore().mes;
  const ano = useExtratoStore().ano;
  const periodo = useExtratoStore().periodo;
  const contaBancaria = useExtratoStore().contaBancaria;

  const { data, isLoading, isFetching, isError, refetch } = useQuery({
    enabled: !!mes && !!ano && !!contaBancaria,
    staleTime: 0,
    queryKey: [
      "financeiro",
      "extrato_bancario",
      "transacao",
      "lista",
      { contaBancaria },
    ],
    queryFn: () =>
      api.get("financeiro/conciliacao-bancaria/extratos-bancarios/", {
        params: {
          filters: {
            id_conta_bancaria: contaBancaria?.id,
            mes: mes,
            ano: ano,
          },
        },
      }),
  });
  const rows = data?.data?.rows;
  const chartData = data?.data?.chartData;

  const filteredRows = useMemo(
    () =>
      rows &&
      rows.length > 0 &&
      rows.filter(
        (row: any) =>
          isBetweenDate(
            row.data_transacao,
            periodo?.from || row.data_transacao,
            periodo?.to || row.data_transacao
          ) ||
          isEqual(periodo?.from || row.data_transacao, row.data_transacao) ||
          isEqual(periodo?.to || row.data_transacao, row.data_transacao)
      ),
    [periodo]
  );

  return (
    <div>
      <div className="mb-3 overflow-auto pb-3">
        <Filters refetch={refetch} isFetching={isFetching} />
      </div>
      <div className="mb-3">
        <Chart data={chartData} isLoading={isLoading} />
      </div>
      <div className="mb-3">
        <Transacoes
          data={filteredRows}
          isLoading={isLoading}
          isError={isError}
        />
      </div>
    </div>
  );
};

export default ExtratoTab;
