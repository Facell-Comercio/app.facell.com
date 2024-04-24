import { DataTable } from "@/components/custom/DataTable";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { exportToExcel } from "@/helpers/importExportXLS";
import { useOrcamento } from "@/hooks/useOrcamento";
import { api } from "@/lib/axios";
import { Download } from "lucide-react";
import ModalMeuOrcamento from "./orcamento/Modal";
import FilterMeuOrcamento from "./table/Filters";
import { columnsTable } from "./table/columns";
import { useStoreTableMeuOrcamento } from "./table/store-table";

const MeuOrcamento = () => {
  console.log("RENDER - Section-Titulos");
  const [pagination, setPagination, filters] = useStoreTableMeuOrcamento(
    (state) => [state.pagination, state.setPagination, state.filters]
  );
  const { data, refetch } = useOrcamento().getMyBudgets({
    pagination,
    filters,
  });

  const rows = data?.data?.rows || [];
  const rowCount = data?.data?.rowCount || 0;

  const arrayMes = [
    { id: "1", mes: "Janeiro" },
    { id: "2", mes: "Fevereiro" },
    { id: "3", mes: "Março" },
    { id: "4", mes: "Abril" },
    { id: "5", mes: "Maio" },
    { id: "6", mes: "Junho" },
    { id: "7", mes: "Julho" },
    { id: "8", mes: "Agosto" },
    { id: "9", mes: "Setembro" },
    { id: "10", mes: "Outubro" },
    { id: "11", mes: "Novembro" },
    { id: "12", mes: "Dezembro" },
  ];

  const mes =
    arrayMes[
      parseInt(data?.data?.mes || (new Date().getMonth() + 1).toString()) - 1
    ].mes;
  const ano = data?.data?.ano;

  async function exportedFilteredData() {
    try {
      const response = await api.get(`/financeiro/orcamento/my-budget`, {
        params: { filters },
      });
      const newArray: any[] = [];

      response.data.rows.forEach((item: any) =>
        newArray.push({
          grupo_economico: item.grupo_economico,
          centro_custo: item.centro_custos,
          plano_contas: item.plano_contas,
          previsto: parseFloat(item.valor_previsto),
          saldo: parseFloat(item.saldo),
          realizado_percentual:
            (parseFloat(item.realizado_percentual) * 100)
              .toFixed(2)
              .replace(".", ",") + "%",
        })
      );
      exportToExcel(newArray, `meu-orcamento-${mes.toLowerCase()}-${ano}`);
      return newArray;
    } catch (err) {
      console.log(err);
      toast({ title: "Erro na exportação", description: "Erro na exportação" });
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold">
          Orçamento: {mes}/{ano}
        </h3>
        <div className="flex gap-2">
          {/* <Button variant={"outline"}>
            <Download className="me-2" size={20} />
            Importar
          </Button> */}
          <Button
            variant={"outline"}
            type={"button"}
            onClick={() => exportedFilteredData()}
          >
            <Download className="me-2" size={20} />
            Exportar
          </Button>
        </div>
      </div>
      <FilterMeuOrcamento refetch={refetch} />
      <DataTable
        pagination={pagination}
        setPagination={setPagination}
        data={rows}
        rowCount={rowCount}
        columns={columnsTable}
      />{" "}
      <ModalMeuOrcamento />
    </div>
  );
};

export default MeuOrcamento;
