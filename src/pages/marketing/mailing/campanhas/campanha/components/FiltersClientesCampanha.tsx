import MultiSelectWithLabel from "@/components/custom/MultiSelectWithLabel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { EraserIcon, FilterIcon, SlidersHorizontal } from "lucide-react";
import { FaSpinner } from "react-icons/fa6";
import { FiltersCampanha } from "../store";

type FiltersClientesCampanha = {
  filters: FiltersCampanha;
  defaultFilters: FiltersCampanha;
  refetch: () => void;
  setFilters: (filters: FiltersCampanha) => void;
  resetFilters: () => void;
  qtde_clientes: number;
  isPending: boolean;
  isSubcampanha?: boolean;
  disabled?: boolean;
};

export const FiltersClientesCampanha = ({
  filters,
  defaultFilters,
  refetch,
  setFilters,
  resetFilters,
  qtde_clientes,
  isPending,
  isSubcampanha,
  disabled,
}: FiltersClientesCampanha) => {
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
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="secondary" disabled={disabled}>
          <SlidersHorizontal className="me-2" size={18} />
          Filtros
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            Filtros Cliente
            <Badge variant={"secondary"}>Qtde. Clientes: {qtde_clientes}</Badge>
          </SheetTitle>
          <SheetDescription className="hidden"></SheetDescription>
        </SheetHeader>
        <div className="grid gap-3 py-4">
          {defaultFilters?.plano_atual_list && (
            <MultiSelectWithLabel
              label="Planos"
              options={defaultFilters.plano_atual_list.map((plano_atual: any) => ({
                value: plano_atual.value,
                label: plano_atual.value || "NULL",
              }))}
              onValueChange={(plano_atual_list) => {
                setFilters({ plano_atual_list: plano_atual_list });
              }}
              defaultValue={filters.plano_atual_list || []}
              placeholder="Planos"
              variant="secondary"
              animation={4}
              maxCount={2}
              maxCharacters={25}
              className={`bg-background hover:bg-background`}
              disabled={isPending}
            />
          )}
          {defaultFilters?.produto_list && (
            <MultiSelectWithLabel
              label="Produtos"
              options={defaultFilters.produto_list.map((plano_atual: any) => ({
                value: plano_atual.value,
                label: plano_atual.value || "NULL",
              }))}
              onValueChange={(produto_list) => {
                setFilters({ produto_list: produto_list });
              }}
              defaultValue={filters.produto_list || []}
              placeholder="Produtos"
              variant="secondary"
              animation={4}
              maxCount={2}
              maxCharacters={25}
              className={`bg-background hover:bg-background`}
              disabled={isPending}
            />
          )}
          {defaultFilters?.status_plano_list && (
            <MultiSelectWithLabel
              label="Status"
              options={defaultFilters.status_plano_list.map((plano_atual: any) => ({
                value: plano_atual.value,
                label: plano_atual.value || "NULL",
              }))}
              onValueChange={(status_plano_list) => {
                setFilters({ status_plano_list: status_plano_list });
              }}
              defaultValue={filters.status_plano_list || []}
              placeholder="Status"
              variant="secondary"
              animation={4}
              maxCount={2}
              maxCharacters={25}
              className={`bg-background hover:bg-background`}
              disabled={isPending}
            />
          )}
          {defaultFilters?.vendedores_list && isSubcampanha && (
            <MultiSelectWithLabel
              label="Vendedores"
              options={defaultFilters.vendedores_list.map((plano_atual: any) => ({
                value: plano_atual.value,
                label: plano_atual.value || "SEM VENDEDOR",
              }))}
              onValueChange={(vendedores_list) => {
                setFilters({ vendedores_list: vendedores_list });
              }}
              defaultValue={filters.vendedores_list || []}
              placeholder="Vendedores"
              variant="secondary"
              animation={4}
              maxCount={2}
              maxCharacters={25}
              className={`bg-background hover:bg-background`}
              disabled={isPending}
            />
          )}
          <div className="flex flex-col w-full gap-2">
            <label className="text-sm font-medium">Produto Fidelizado</label>
            <Select
              value={filters.produto_fidelizado || ""}
              onValueChange={(e) => setFilters({ produto_fidelizado: e })}
              disabled={isPending}
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
          {isSubcampanha && (
            <div className="flex flex-col w-full gap-2">
              <label className="text-sm font-medium">Sem Contato</label>
              <Select
                value={filters.sem_contato || ""}
                onValueChange={(e) => setFilters({ sem_contato: e })}
                disabled={isPending}
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
          )}
        </div>
        <SheetFooter>
          <Button onClick={handleClickFilter} disabled={isPending}>
            {isPending ? (
              <>
                <FaSpinner size={18} className="me-2 animate-spin" />
                Filtrando...
              </>
            ) : (
              <>
                <FilterIcon size={18} className="me-2" />
                Filtrar
              </>
            )}
          </Button>
          <Button variant={"secondary"} onClick={handleResetFilter} disabled={isPending}>
            <EraserIcon size={18} className="me-2" />
            Limpar
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};