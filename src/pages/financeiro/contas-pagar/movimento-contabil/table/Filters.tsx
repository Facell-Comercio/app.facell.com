import SelectGrupoEconomico from "@/components/custom/SelectGrupoEconomico";
import { Button } from "@/components/ui/button";
import { DatePickerWithRange } from "@/components/ui/date-range";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import ModalContasBancarias, {
  ItemContaBancariaProps,
} from "@/pages/financeiro/components/ModalContasBancarias";
import { useState } from "react";
import { useStoreTableMovimentoContabil } from "./store-table";

const FiltersMovimentoContabiluseStoreTableMovimentoContabil = ({
  refetch,
}: {
  refetch: () => void;
}) => {
  const filters = useStoreTableMovimentoContabil((state) => state.filters);
  const setFilters = useStoreTableMovimentoContabil(
    (state) => state.setFilters
  );
  const [modalContaBancariaOpen, setModalContaBancariaOpen] =
    useState<boolean>(false);
  const [contaBancaria, setContaBancaria] = useState("");

  async function handleSelectionContaBancaria(item: ItemContaBancariaProps) {
    setContaBancaria(item.descricao);
    setFilters({ id_conta_bancaria: item.id.toString() });
    setTimeout(() => {
      refetch();
      setModalContaBancariaOpen(false);
    }, 50);
  }

  async function getRelatorio() {
    if (!filters.id_grupo_economico) {
      toast({
        title: "Dados insuficientes!",
        description: "Para poder gerar o relatório selecione o grupo econômico",
        variant: "destructive",
      });
      return;
    }
    if (!filters.range_data?.from) {
      toast({
        title: "Dados insuficientes!",
        description:
          "Para poder gerar o relatório selecione o período de pagamento",
        variant: "destructive",
      });
      return;
    }
    console.log(filters);
  }

  return (
    <section className="flex flex-wrap items-end justify-start gap-2 mt-4">
      <div className="flex flex-col flex-1">
        <label className="text-sm font-medium mb-2">Grupo Econômico</label>
        <SelectGrupoEconomico
          className="min-w-full"
          value={filters.id_grupo_economico}
          onChange={(grupo_economico) => {
            const data = JSON.parse(grupo_economico || "");
            setFilters({
              id_grupo_economico: data.id_grupo_economico,
              id_matriz: data.id_matriz,
              id_conta_bancaria: "",
            });
            setContaBancaria("");
            setTimeout(() => {
              refetch();
            }, 50);
          }}
          getIdMatriz
        />
      </div>
      <div className="flex flex-col flex-1">
        <label className="text-sm font-medium mb-2">Conta Bancária</label>
        <Input
          value={contaBancaria}
          className="flex-1 min-h-10 min-w-[20ch]"
          readOnly
          placeholder="Selecione a conta..."
          onClick={() => setModalContaBancariaOpen(true)}
          disabled={!filters.id_grupo_economico}
        />
      </div>
      <div className="flex flex-col">
        <label className="text-sm font-medium mb-2">Período de Pagamento</label>
        <DatePickerWithRange
          date={filters.range_data}
          setDate={async (range_data) => {
            setFilters({ range_data: range_data });
          }}
        />
      </div>
      <Button onClick={() => getRelatorio()}>Gerar Relatório</Button>
      <ModalContasBancarias
        open={modalContaBancariaOpen}
        handleSelecion={handleSelectionContaBancaria}
        onOpenChange={() => setModalContaBancariaOpen((prev) => !prev)}
        id_matriz={filters.id_matriz}
      />
    </section>
  );
};

export default FiltersMovimentoContabiluseStoreTableMovimentoContabil;
