import { isBetweenDate } from "@/helpers/validator";
import { api } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { isEqual } from "date-fns";
import { useMemo } from "react";
import Transacoes from "./components/Transacoes";
import { useExtratoStore } from "./components/context";

import ChartTransacoes from "./components/ChartTransacoes";
import ChartImportacao from "./components/ChartImportacao";
import ButtonImport from "./components/ButtonImport";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";
import { useExtratosStore } from "../context";

const ExtratoTab = () => {
  const mes = useExtratosStore().mes;
  const ano = useExtratosStore().ano;
  const contaBancaria = useExtratosStore().contaBancaria;
  // O único seletor que é pego do contexto da Tab Extratos:
  const periodo = useExtratoStore().periodo;

  const { data, isLoading, isFetching, isError, refetch } = useQuery({
    enabled: !!mes && !!ano && !!contaBancaria,
    staleTime: 1000 * 60 * 5,
    refetchOnMount: false,
    queryKey: [
      "financeiro",
      "extrato_bancario",
      "transacao",
      "lista",
      { mes, ano, contaBancaria },
    ],
    queryFn: async () => {
      const result = await api.get("financeiro/conciliacao-bancaria/extratos-bancarios/", {
        params: {
          filters: {
            id_conta_bancaria: contaBancaria?.id,
            mes: mes,
            ano: ano,
          },
        },
      })
      return result.data;
    }
  });

  const rows = data?.rows;
  const dataChartTransacoes = data?.dataChartTransacoes;

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
    [rows, periodo]
  );

  return (
    <div>
      <div className=" overflow-auto pb-3 flex gap-3 justify-end">

        <Button
          disabled={isFetching || !contaBancaria}
          onClick={() => refetch()}
        >
          <RefreshCcw
            size={20}
            className={`${isFetching ? "animate-spin" : ""} me-2`}
          /> Atualizar
        </Button>

        <ButtonImport />
      </div>
      <div className="mb-3 flex flex-col gap-3">
        <ChartImportacao data={dataChartTransacoes} isLoading={isLoading || isFetching} />
        <ChartTransacoes data={dataChartTransacoes} isLoading={isLoading || isFetching} />

      </div>
      <div className="mb-3">
        <Transacoes
          data={filteredRows}
          isLoading={isLoading || isFetching}
          isError={isError}
        />
      </div>
    </div>
  );
};

export default ExtratoTab;
