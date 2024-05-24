import { DataTable } from "@/components/custom/DataTable";
import { usePainel } from "@/hooks/financeiro/usePainel";
import ModalTituloPagar from "../titulos/titulo/Modal";
import { ItemPainel } from "./components/ItemPainel";
import { BlocoRecorrenciasPendentes } from "./recorrencias-pendentes/BlocoRecorrenciasPendentes";
import { columnsTableNegadas, columnsTableSemNota } from "./table/columns";
import { useStoreTablePainel } from "./table/store-table";

export const PainelContasPagar = () => {
  const [
    paginationNegadas,
    paginationSemNota,
    paginationRecorrencia,
    setPaginationNegadas,
    setPaginationSemNota,
    setPaginationRecorrencia,
  ] = useStoreTablePainel((state) => [
    state.paginationNegadas,
    state.paginationSemNota,
    state.paginationRecorrencia,
    state.setPaginationNegadas,
    state.setPaginationSemNota,
    state.setPaginationRecorrencia,
  ]);

  const { data: dataSemNota, isLoading: isLoadingSemNota } =
    usePainel().getAllNotasFiscaisPendentes({
      pagination: paginationSemNota,
    });

  const rowsSemNota = dataSemNota?.data?.rows || [];
  const rowCountSemNota = dataSemNota?.data?.rowCount || 0;

  const { data: dataNegadas, isLoading: isLoadingNegadas } =
    usePainel().getAllSolicitacoesNegadas({
      pagination: paginationNegadas,
    });

  const rowsNegadas = dataNegadas?.data?.rows || [];
  const rowCountNegadas = dataNegadas?.data?.rowCount || 0;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
      <ItemPainel title="Solicitações Negadas" qtde={rowCountNegadas}>
        <DataTable
          pagination={paginationNegadas}
          setPagination={setPaginationNegadas}
          data={rowsNegadas}
          rowCount={rowCountNegadas}
          columns={columnsTableNegadas}
          isLoading={isLoadingNegadas}
        />
      </ItemPainel>
      <ItemPainel title="Notas Fiscais Pendentes" qtde={rowCountSemNota}>
        <DataTable
          pagination={paginationSemNota}
          setPagination={setPaginationSemNota}
          data={rowsSemNota}
          rowCount={rowCountSemNota}
          columns={columnsTableSemNota}
          isLoading={isLoadingSemNota}
        />
      </ItemPainel>
      <BlocoRecorrenciasPendentes />
      <ModalTituloPagar />
    </div>
  );
};
