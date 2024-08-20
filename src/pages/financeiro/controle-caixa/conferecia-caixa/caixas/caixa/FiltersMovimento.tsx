// import SelectMultiFormaPagamento from "@/components/custom/SelectMultiFormaPagamento";
import { Input } from "@/components/custom/FormInput";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { FilterMovimentoProps } from "./Form";

type FiltersMovimentosProps = {
  filters: FilterMovimentoProps;
  setFilters: (filters: FilterMovimentoProps) => void;
};

const FiltersMovimentos = ({ filters, setFilters }: FiltersMovimentosProps) => {
  return (
    <ScrollArea className="w-fill whitespace-nowrap border-1 border-background rounded-md py-3">
      <div className="flex w-full space-x-3">
        <span className="flex flex-1 gap-2 flex-col">
          <label className="text-sm font-medium">Tipo Operação</label>
          <Input
            value={filters.tipo_operacao}
            onChange={(e) =>
              setFilters({ ...filters, tipo_operacao: e.target.value })
            }
            placeholder="Digite o tipo de operação..."
          />
        </span>
        <span className="flex flex-1 gap-2 flex-col">
          <label className="text-sm font-medium">Forma de Pagamento</label>
          <Input
            value={filters.forma_pgto}
            onChange={(e) =>
              setFilters({ ...filters, forma_pgto: e.target.value })
            }
            placeholder="Digite a forma de pagamento..."
          />
        </span>
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};

export default FiltersMovimentos;
