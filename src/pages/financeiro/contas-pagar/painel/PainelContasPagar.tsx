import { DataTable } from "@/components/custom/DataTable";
import { usePainel } from "@/hooks/financeiro/usePainel";
import ModalTituloPagar from "../titulos/titulo/Modal";
import { ItemPainel } from "./components/ItemPainel";
import {
  columnsTableNegadas,
  columnsTableRecorrencias,
  columnsTableSemNota,
} from "./table/columns";
import { useStoreTablePainel } from "./table/store-table";

export const PainelContasPagar = () => {
  const [
    paginationNegadas,
    paginationSemNota,
    paginationRecorrencias,
    setPaginationNegadas,
    setPaginationSemNota,
    setPaginationRecorrencias,
  ] = useStoreTablePainel((state) => [
    state.paginationNegadas,
    state.paginationSemNota,
    state.paginationRecorrencias,
    state.setPaginationNegadas,
    state.setPaginationSemNota,
    state.setPaginationRecorrencias,
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

  const { data: dataRecorrencias, isLoading: isLoadingRecorrencias } =
    usePainel().getAllRecorrenciasPendentes({
      pagination: paginationRecorrencias,
    });

  const rowsRecorrencias = dataRecorrencias?.data?.rows || [];
  const rowCountRecorrencias = dataRecorrencias?.data?.rowCount || 0;

  return rowCountSemNota || rowCountNegadas || rowCountRecorrencias ? (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 ">
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
      <ItemPainel title="Recorrências Pendentes" qtde={rowCountRecorrencias}>
        <DataTable
          pagination={paginationRecorrencias}
          setPagination={setPaginationRecorrencias}
          data={rowsRecorrencias}
          rowCount={rowCountRecorrencias}
          columns={columnsTableRecorrencias}
          isLoading={isLoadingRecorrencias}
        />
      </ItemPainel>
      <ModalTituloPagar />
    </div>
  ) : (
    <div className="mt-36 h-full col-span-2 w-full flex items-center justify-center text-xs">
      Sem Pendências
    </div>
  );
};
