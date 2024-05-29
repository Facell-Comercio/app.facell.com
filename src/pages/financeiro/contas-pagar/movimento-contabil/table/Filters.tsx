import SelectMes from "@/components/custom/SelectMes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { useMovimentoContabil } from "@/hooks/financeiro/useMovimentoContabil";
import ModalContasBancarias, {
  ItemContaBancariaProps,
} from "@/pages/financeiro/components/ModalContasBancarias";
import ModalGruposEconomicos, {
  ItemGrupoEconomicoProps,
} from "@/pages/financeiro/components/ModalGrupoEconomico";
import { Download, EraserIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa6";
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
  const { mutate: downloadZip, isPending: isLoading } =
    useMovimentoContabil().downloadZip();
  const [modalContaBancariaOpen, setModalContaBancariaOpen] =
    useState<boolean>(false);
  const [modalGrupoEconomicoOpen, setModalGrupoEconomicoOpen] =
    useState<boolean>(false);

  async function handleSelectionContaBancaria(item: ItemContaBancariaProps) {
    setFilters({
      id_conta_bancaria: item.id.toString(),
      conta_bancaria: item.descricao,
    });
    setModalContaBancariaOpen(false);
  }

  async function handleSelectionGrupoEconomico(item: ItemGrupoEconomicoProps) {
    setFilters({
      id_grupo_economico: item.id.toString(),
      id_matriz: item.id_matriz.toString(),
      grupo_economico: item.nome,
    });
    setModalGrupoEconomicoOpen(false);
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
    if (!filters.mes || !filters.ano) {
      toast({
        title: "Dados insuficientes!",
        description:
          "Para poder gerar o relatório selecione o período de pagamento",
        variant: "destructive",
      });
      return;
    }

    downloadZip({ filters });
  }

  useEffect(() => {
    setTimeout(() => {
      refetch();
    }, 50);
  }, [filters.id_conta_bancaria, filters.id_grupo_economico]);

  return (
    <section className="flex flex-wrap items-end justify-start gap-2 mt-4">
      <div className="flex flex-col">
        <label className="text-sm font-medium mb-2">Grupo Econômico</label>
        <Input
          value={filters.grupo_economico}
          className="flex-1 min-h-10 min-w-[20ch]"
          readOnly
          placeholder="Selecione o grupo..."
          onClick={() => setModalGrupoEconomicoOpen(true)}
        />
      </div>
      <div className="flex flex-col ">
        <label className="text-sm font-medium mb-2">Conta Bancária</label>
        <Input
          value={filters.conta_bancaria}
          className="flex-1 min-h-10 min-w-[20ch]"
          readOnly
          placeholder="Selecione a conta..."
          onClick={() => setModalContaBancariaOpen(true)}
          disabled={!filters.id_grupo_economico}
        />
      </div>
      <div>
        <label className="text-sm font-medium">Mês</label>
        <SelectMes
          value={filters.mes}
          onValueChange={(e) => {
            setFilters({ mes: e });
          }}
        />
      </div>
      <div>
        <label className="text-sm font-medium">Ano</label>
        <Input
          type="number"
          min={2020}
          max={new Date().getFullYear() + 1}
          step={"1"}
          placeholder="Ano"
          className="w-[80px]"
          value={filters.ano}
          onChange={(e) => {
            setFilters({ ano: e.target.value });
          }}
        />
      </div>
      {isLoading ? (
        <Button disabled>
          <span className="flex gap-2 w-full items-center justify-center">
            <FaSpinner size={18} className="me-2 animate-spin" /> Gerando
            Relatório...
          </span>
        </Button>
      ) : (
        <Button onClick={() => getRelatorio()}>
          <Download size={16} className="me-2" />
          Gerar Relatório
        </Button>
      )}
      <Button
        onClick={async () => {
          setFilters({
            id_conta_bancaria: "",
            id_grupo_economico: "",
            id_matriz: "",
            grupo_economico: "",
            conta_bancaria: "",
            mes: "",
            ano: "",
          });
        }}
        variant={"secondary"}
      >
        Limpar <EraserIcon size={16} className="ms-2" />
      </Button>
      <ModalContasBancarias
        open={modalContaBancariaOpen}
        handleSelection={handleSelectionContaBancaria}
        onOpenChange={() => setModalContaBancariaOpen((prev) => !prev)}
        id_matriz={filters.id_matriz}
        id_grupo_economico={filters.id_grupo_economico}
      />
      <ModalGruposEconomicos
        open={modalGrupoEconomicoOpen}
        handleSelection={handleSelectionGrupoEconomico}
        onOpenChange={() => setModalGrupoEconomicoOpen((prev) => !prev)}
      />
    </section>
  );
};

export default FiltersMovimentoContabiluseStoreTableMovimentoContabil;
