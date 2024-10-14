// import { ScrollArea } from "@radix-ui/react-scroll-area";
import { InputWithLabel } from "@/components/custom/FormInput";
import MultiSelectWithLabel from "@/components/custom/MultiSelectWithLabel";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DatePickerWithRange } from "@/components/ui/date-range";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { subDays } from "date-fns";
import { EraserIcon, FilterIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { TbCurrencyReal } from "react-icons/tb";
import { useStoreTableClientes } from "./store-table";

const FilterClientes = ({
  refetch,
  defaultFiltersFetched,
}: {
  refetch: () => void;
  defaultFiltersFetched?: any;
}) => {
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

  const defaultFilters = useMemo(() => defaultFiltersFetched, [defaultFiltersFetched]);

  //* Outros Filtros
  const produtos_cliente = filters.produtos_cliente || [];
  const comAparelho = useMemo(
    () => produtos_cliente?.includes("com_aparelho"),
    [produtos_cliente?.includes("com_aparelho")]
  );
  const comAcessorio = useMemo(
    () => produtos_cliente?.includes("com_acessorio"),
    [produtos_cliente?.includes("com_acessorio")]
  );
  const comPlano = useMemo(
    () => produtos_cliente?.includes("com_plano"),
    [produtos_cliente?.includes("com_plano")]
  );

  const status_plano = filters.status_plano || [];
  const statusAtivo = useMemo(
    () => status_plano?.includes("Ativo"),
    [status_plano?.includes("Ativo")]
  );
  const statusDesativado = useMemo(
    () => status_plano?.includes("Desativado"),
    [status_plano?.includes("Desativado")]
  );
  const statusSuspenso = useMemo(
    () => status_plano?.includes("Suspenso"),
    [status_plano?.includes("Suspenso")]
  );
  const statusAnalisePendente = useMemo(
    () => status_plano?.includes("Analise pendente"),
    [status_plano?.includes("Analise pendente")]
  );

  function toggleList(list: string[], key: string) {
    if (list.includes(key)) list = list.filter((item) => item !== key);
    else list.push(key);

    return list;
  }

  const [itemOpen, setItemOpen] = useState<string>("valor_caixa");
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
          {defaultFilters?.grupo_estoque_list && (
            <MultiSelectWithLabel
              label="Grupos Estoque"
              options={defaultFilters.grupo_estoque_list.map((grupo_estoque: any) => ({
                value: grupo_estoque.value,
                label: grupo_estoque.value,
              }))}
              onValueChange={(grupo_estoque_list) => {
                setFilters({ grupo_estoque_list: grupo_estoque_list });
              }}
              defaultValue={filters.grupo_estoque_list || []}
              placeholder="Grupo estoque"
              variant="secondary"
              animation={4}
              maxCount={1}
              className={`bg-background hover:bg-background`}
            />
          )}

          {defaultFilters?.subgrupo_list && (
            <MultiSelectWithLabel
              label="Subgrupos"
              options={defaultFilters.subgrupo_list.map((subgrupo: any) => ({
                value: subgrupo.value,
                label: subgrupo.value,
              }))}
              onValueChange={(subgrupo_list) => {
                setFilters({ subgrupo_list: subgrupo_list });
              }}
              defaultValue={filters.subgrupo_list || []}
              placeholder="Subgrupo"
              variant="secondary"
              animation={4}
              maxCount={1}
              className={`bg-background hover:bg-background`}
            />
          )}

          {defaultFilters?.uf_list && (
            <MultiSelectWithLabel
              label="Área/Estado"
              options={defaultFilters.uf_list.map((uf: any) => ({
                value: uf.value,
                label: uf.value,
              }))}
              onValueChange={(ufs) => {
                setFilters({ uf_list: ufs });
              }}
              defaultValue={filters.uf_list || []}
              placeholder="UF"
              variant="secondary"
              animation={4}
              maxCount={1}
              className={`bg-background hover:bg-background`}
            />
          )}

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Data da Compra</label>
            <DatePickerWithRange
              date={filters.range_data_pedido}
              setDate={(date) => {
                setFilters({ range_data_pedido: date });
              }}
              max={subDays(new Date(), 1)}
              className="w-full"
            />
          </div>

          <Accordion
            type="single"
            collapsible
            value={itemOpen}
            onValueChange={(e) => setItemOpen(e)}
            className="border rounded-md"
          >
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

          {defaultFilters?.filiais_list && (
            <MultiSelectWithLabel
              label="Filiais"
              options={defaultFilters.filiais_list.map((filial: any) => ({
                value: filial.value,
                label: filial.value,
              }))}
              onValueChange={(filiais) => {
                setFilters({ filiais_list: filiais });
              }}
              defaultValue={filters.filiais_list || []}
              placeholder="Filial"
              variant="secondary"
              animation={4}
              maxCount={1}
              className={`bg-background hover:bg-background`}
            />
          )}
          {defaultFilters?.plano_habilitado_list && (
            <MultiSelectWithLabel
              label="Planos Habilitados"
              options={defaultFilters.plano_habilitado_list.map((plano_habilitado: any) => ({
                value: plano_habilitado.value,
                label: plano_habilitado.value,
              }))}
              onValueChange={(ufs) => {
                setFilters({ plano_habilitado_list: ufs });
              }}
              defaultValue={filters.plano_habilitado_list || []}
              placeholder="Plano Habilitado"
              variant="secondary"
              animation={4}
              maxCount={1}
              className={`bg-background hover:bg-background`}
            />
          )}
          {defaultFilters?.modalidade_venda_list && (
            <MultiSelectWithLabel
              label="Modalidades de Venda"
              options={defaultFilters.modalidade_venda_list.map((modalidade_venda: any) => ({
                value: modalidade_venda.value,
                label: modalidade_venda.value,
              }))}
              onValueChange={(ufs) => {
                setFilters({ modalidade_venda_list: ufs });
              }}
              defaultValue={filters.modalidade_venda_list || []}
              placeholder="Modalidade Venda"
              variant="secondary"
              animation={4}
              maxCount={1}
              className={`bg-background hover:bg-background`}
            />
          )}
          {defaultFilters?.fabricante_list && (
            <MultiSelectWithLabel
              label="Fabricantes"
              options={defaultFilters.fabricante_list.map((fabricante: any) => ({
                value: fabricante.value,
                label: fabricante.value,
              }))}
              onValueChange={(ufs) => {
                setFilters({ fabricante_list: ufs });
              }}
              defaultValue={filters.fabricante_list || []}
              placeholder="Fabricante"
              variant="secondary"
              animation={4}
              maxCount={1}
              className={`bg-background hover:bg-background`}
            />
          )}
          {defaultFilters?.tipo_pedido_list && (
            <MultiSelectWithLabel
              label="Tipos de Pedido"
              options={defaultFilters.tipo_pedido_list.map((tipo_pedido: any) => ({
                value: tipo_pedido.value,
                label: tipo_pedido.value,
              }))}
              onValueChange={(ufs) => {
                setFilters({ tipo_pedido_list: ufs });
              }}
              defaultValue={filters.tipo_pedido_list || []}
              placeholder="Tipo Pedido"
              variant="secondary"
              animation={4}
              maxCount={1}
              className={`bg-background hover:bg-background`}
            />
          )}
          <InputWithLabel
            label="Descrição Produto"
            value={filters.descricao || ""}
            onChange={(e) => setFilters({ descricao: e.target.value })}
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
          <div className="flex flex-col w-full gap-2">
            <label className="text-sm font-medium">Tipos de Clientes:</label>
            <div className="flex flex-col gap-2 border rounded-md p-2 bg-background">
              <span className="flex gap-2 items-center">
                <Checkbox
                  checked={comAparelho}
                  onCheckedChange={() =>
                    setFilters({ produtos_cliente: toggleList(produtos_cliente, "com_aparelho") })
                  }
                />
                <p className="text-sm font-medium">Com Aparelho</p>
              </span>
              <span className="flex gap-2 items-center">
                <Checkbox
                  checked={comAcessorio}
                  onCheckedChange={() =>
                    setFilters({ produtos_cliente: toggleList(produtos_cliente, "com_acessorio") })
                  }
                />
                <p className="text-sm font-medium">Com Acessório</p>
              </span>
              <span className="flex gap-2 items-center">
                <Checkbox
                  checked={comPlano}
                  onCheckedChange={() =>
                    setFilters({ produtos_cliente: toggleList(produtos_cliente, "com_plano") })
                  }
                />
                <p className="text-sm font-medium">Com Plano</p>
              </span>
            </div>
          </div>
          <div className="flex flex-col w-full gap-2">
            <label className="text-sm font-medium">Status Plano:</label>
            <div className="flex flex-col gap-2 border rounded-md p-2 bg-background">
              <span className="flex gap-2 items-center">
                <Checkbox
                  checked={statusAtivo}
                  onCheckedChange={() =>
                    setFilters({ status_plano: toggleList(status_plano, "Ativo") })
                  }
                />
                <p className="text-sm font-medium">Ativo</p>
              </span>
              <span className="flex gap-2 items-center">
                <Checkbox
                  checked={statusDesativado}
                  onCheckedChange={() =>
                    setFilters({ status_plano: toggleList(status_plano, "Desativado") })
                  }
                />
                <p className="text-sm font-medium">Desativado</p>
              </span>
              <span className="flex gap-2 items-center">
                <Checkbox
                  checked={statusSuspenso}
                  onCheckedChange={() =>
                    setFilters({ status_plano: toggleList(status_plano, "Suspenso") })
                  }
                />
                <p className="text-sm font-medium">Suspenso</p>
              </span>
              <span className="flex gap-2 items-center">
                <Checkbox
                  checked={statusAnalisePendente}
                  onCheckedChange={() =>
                    setFilters({ status_plano: toggleList(status_plano, "Analise pendente") })
                  }
                />
                <p className="text-sm font-medium">Análise Pendente</p>
              </span>
            </div>
          </div>
        </div>
      </ScrollArea>
    </aside>
  );
};

export default FilterClientes;
