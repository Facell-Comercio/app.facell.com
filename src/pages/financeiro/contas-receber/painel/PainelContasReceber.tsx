import { DataTable } from "@/components/custom/DataTable";
import { useTituloReceber } from "@/hooks/financeiro/useTituloReceber";
import ModalTituloReceber from "../titulos/titulo/ModalTituloReceber";
import { ItemPainel } from "./components/ItemPainel";
import { columnsTableCanceladas } from "./table/columns";
import { useStoreTablePainel } from "./table/store-table";

export const PainelContasReceber = () => {
  const [paginationCanceladas, setPaginationCanceladas] = useStoreTablePainel((state) => [
    state.paginationCanceladas,
    state.setPaginationCanceladas,
  ]);

  const { data: dataCanceladas, isLoading: isLoadingCanceladas } = useTituloReceber().getAll({
    pagination: paginationCanceladas,
    filters: {
      id_status: "20",
    },
  });

  const rowsCanceladas = dataCanceladas?.rows || [];
  const rowCountCanceladas = dataCanceladas?.rowCount || 0;

  return rowCountCanceladas ? (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 ">
      {rowCountCanceladas ? (
        <ItemPainel title="Solicitações Canceladas" qtde={rowCountCanceladas} endpoint="negada">
          <DataTable
            pagination={paginationCanceladas}
            setPagination={setPaginationCanceladas}
            data={rowsCanceladas}
            rowCount={rowCountCanceladas}
            columns={columnsTableCanceladas}
            isLoading={isLoadingCanceladas}
          />
        </ItemPainel>
      ) : (
        ""
      )}
      <ModalTituloReceber />
    </div>
  ) : (
    <div className="mt-36 h-full col-span-2 w-full flex items-center justify-center text-xs">
      Sem Pendências
    </div>
  );
};
