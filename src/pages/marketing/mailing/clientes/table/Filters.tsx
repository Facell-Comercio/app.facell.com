// import { ScrollArea } from "@radix-ui/react-scroll-area";
import { CustomCombobox } from "@/components/custom/CustomCombobox";
import { InputWithLabel } from "@/components/custom/FormInput";
import { InputDate } from "@/components/custom/InputDate";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { MultiSelect } from "@/components/ui/multi-select";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EraserIcon, FilterIcon } from "lucide-react";
import { TbCurrencyReal } from "react-icons/tb";
import { useStoreTableClientes } from "./store-table";

const defaultValuesGrupoEstoque = [
  {
    value: "APARELHO",
    label: "APARELHO",
  },
  {
    value: "ACESSORIO",
    label: "ACESSORIO",
  },
];

const ufs = ["RN", "CE", "BA"];

const FilterClientes = ({ refetch }: { refetch: () => void }) => {
  const filters = useStoreTableClientes((state) => state.filters);
  const setFilters = useStoreTableClientes((state) => state.setFilters);
  const resetFilters = useStoreTableClientes((state) => state.resetFilters);

  const handleClickFilter = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    refetch();
  };
  const handleResetFilter = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    await new Promise((resolve) => resolve(resetFilters()));
    refetch();
  };

  return (
    <aside className="flex flex-col gap-2 border rounded-md p-2 pt-3 h-fit max-h-[75vh] bg-secondary/40">
      <div className="flex gap-2 justify-between">
        <h3 className="font-medium">Filtros:</h3>
        <span className="flex gap-2">
          <Button size={"xs"} onClick={handleClickFilter}>
            Aplicar <FilterIcon size={12} className="ms-2" />
          </Button>
          <Button size={"xs"} variant="secondary" onClick={handleResetFilter}>
            Limpar <EraserIcon size={12} className="ms-2" />
          </Button>
        </span>
      </div>
      <ScrollArea className="flex flex-col">
        <div className="flex flex-col w-full gap-2 pb-1">
          <span className="flex flex-col gap-2 w-full">
            <label className="text-sm font-medium">Grupo Estoque</label>
            <CustomCombobox
              value={filters.grupo_estoque || ""}
              onChange={(value) => setFilters({ grupo_estoque: value })}
              defaultValues={defaultValuesGrupoEstoque}
              placeholder="Selecione a o grupo"
              className="min-w-full"
            />
          </span>
          <InputWithLabel
            label="Subgrupo"
            value={filters.subgrupo || ""}
            onChange={(e) => setFilters({ subgrupo: e.target.value })}
          />

          <div className="flex flex-col gap-2 w-full">
            <label className="text-sm font-medium">Área/Estado</label>
            <MultiSelect
              options={ufs.map((uf: any) => ({
                value: uf,
                label: uf,
              }))}
              onValueChange={(uf) => {
                setFilters({ areas: uf });
              }}
              defaultValue={filters.areas || []}
              placeholder="UF"
              variant="secondary"
              animation={4}
              maxCount={1}
              className={`bg-background hover:bg-background`}
            />
          </div>

          <div className="w-full gap-2">
            <label className="text-sm font-medium">Data da Compra</label>
            <InputDate
              className="mt-2 w-full"
              value={filters.data_pedido || ""}
              onChange={(e: Date) => setFilters({ data_pedido: e })}
            />
          </div>

          <Accordion type="single" collapsible className="border rounded-md">
            <AccordionItem value="valor_caixa" className="border-0">
              <AccordionTrigger className="p-3 border-0 rounded-md py-1 hover:no-underline">
                Valor do Caixa
              </AccordionTrigger>
              <AccordionContent className="flex gap-2 flex-col p-2">
                <InputWithLabel
                  iconLeft
                  iconClass="bg-secondary"
                  icon={TbCurrencyReal}
                  label="Valo Mínimo"
                  value={filters.valor_minimo || ""}
                  onChange={(e) => setFilters({ valor_minimo: e.target.value })}
                  labelClass="text-xs"
                  type="number"
                  step="0.01"
                  min={0}
                />
                <InputWithLabel
                  iconLeft
                  iconClass="bg-secondary"
                  icon={TbCurrencyReal}
                  label="Valor Máximo"
                  min={parseFloat(filters.valor_minimo || "0")}
                  value={filters.valor_maximo || ""}
                  onChange={(e) => setFilters({ valor_maximo: e.target.value })}
                  labelClass="text-xs"
                  type="number"
                  step="0.01"
                />
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <InputWithLabel
            label="Filial"
            value={filters.filial || ""}
            onChange={(e) => setFilters({ filial: e.target.value })}
          />
          <InputWithLabel
            label="Descrição Produto"
            value={filters.descricao || ""}
            onChange={(e) => setFilters({ descricao: e.target.value })}
          />
          <InputWithLabel
            label="Plano Habilitado"
            value={filters.plano_habilitacao || ""}
            onChange={(e) => setFilters({ plano_habilitacao: e.target.value })}
          />
          <InputWithLabel
            label="Modalidade Venda"
            value={filters.modalidade_venda || ""}
            onChange={(e) => setFilters({ modalidade_venda: e.target.value })}
          />
          <InputWithLabel
            label="Fabricante"
            value={filters.fabricante || ""}
            onChange={(e) => setFilters({ fabricante: e.target.value })}
          />
          <InputWithLabel
            label="Tipo de Pedido"
            value={filters.tipo_pedido || ""}
            onChange={(e) => setFilters({ tipo_pedido: e.target.value })}
          />
          <div className="flex flex-col w-full gap-2">
            <label className="text-sm font-medium">Fidelização Aparelho</label>
            <Select
              value={filters.fidelizacao_aparelho || ""}
              onValueChange={(e) => setFilters({ fidelizacao_aparelho: e })}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="SIM/NÃO" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">SIM/NÃO</SelectItem>
                <SelectItem value="SIM">SIM</SelectItem>
                <SelectItem value="NÃO">NÃO</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col w-full gap-2">
            <label className="text-sm font-medium">Fidelização Plano</label>
            <Select
              value={filters.fidelizacao_plano || ""}
              onValueChange={(e) => setFilters({ fidelizacao_plano: e })}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="SIM/NÃO" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">SIM/NÃO</SelectItem>
                <SelectItem value="SIM">SIM</SelectItem>
                <SelectItem value="NÃO">NÃO</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </ScrollArea>
    </aside>
  );
};

export default FilterClientes;
