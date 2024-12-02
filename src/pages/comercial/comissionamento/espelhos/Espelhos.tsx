import { DataTable } from "@/components/custom/DataTable";

import { hasPermission } from "@/helpers/checkAuthorization";
import { useEspelhos } from "@/hooks/comercial/useEspelhos";
import { useEffect } from "react";
import ButtonCalcularEspelho from "./components/ButtonCalculoComissionamento";
import ButtonContestacoes from "./components/ButtonContestacoes";
import ButtonExportEspelho from "./components/ButtonExportEspelho";
import ButtonItens from "./components/ButtonItens";
import ModalEspelho from "./espelho/Modal";
import ModalContestacao from "./espelho/ModalContestacao";
import ModalContestacoes from "./espelho/ModalContestacoes";
import ModalItens from "./espelho/ModalItens";
import { useStoreEspelho } from "./espelho/store";
import { columnsTable } from "./table/columns";
import FiltersEspelhos from "./table/Filters";
import { useStoreTableEspelhos } from "./table/store-table";

const Espelhos = () => {
  const [pagination, setPagination, filters] = useStoreTableEspelhos((state) => [
    state.pagination,
    state.setPagination,
    state.filters,
  ]);

  const { data, refetch, isLoading, isSuccess } = useEspelhos().getAll({
    pagination,
    filters,
  });

  const [editQtdeContestacoes, modalOpen, modalContestacoesOpen] = useStoreEspelho((state) => [
    state.editQtdeContestacoes,
    state.modalOpen,
    state.modalContestacoesOpen,
  ]);

  const rows = data?.rows || [];

  const rowCount = data?.rowCount || 0;
  const qtdeTotalContestacoes = data?.qtdeTotalContestacoes || 0;

  useEffect(() => {
    if (isSuccess && !modalOpen && !modalContestacoesOpen) {
      editQtdeContestacoes(qtdeTotalContestacoes);
    }
  }, [isLoading, modalOpen, modalContestacoesOpen, qtdeTotalContestacoes]);

  return (
    <div className="flex flex-col gap-3">
      <FiltersEspelhos refetch={refetch} />

      <div className="flex gap-2 justify-between">
        <span className="flex gap-2">
          {hasPermission(["MASTER", "COMISSOES:ESPELHOS_CALCULAR"]) && <ButtonCalcularEspelho />}
          <ButtonExportEspelho />
        </span>
        <span className="flex gap-2">
          {hasPermission(["MASTER", "COMISSOES:ESPELHOS_EDITAR"]) && <ButtonItens />}
          {hasPermission([
            "MASTER",
            "COMISSOES:ESPELHOS_EDITAR",
            "COMISSOES:ESPELHOS_CONTESTAR",
          ]) && <ButtonContestacoes />}
        </span>
      </div>

      <DataTable
        pagination={pagination}
        setPagination={setPagination}
        data={rows}
        rowCount={rowCount}
        columns={columnsTable}
        isLoading={isLoading}
      />

      <ModalEspelho />
      <ModalContestacoes />
      <ModalContestacao />
      <ModalItens />
    </div>
  );
};

export default Espelhos;
