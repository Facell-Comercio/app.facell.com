import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { DatePickerWithRange } from '@/components/ui/date-range';
import { Input } from '@/components/ui/input';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { toast } from '@/components/ui/use-toast';
import { useMovimentoContabil } from '@/hooks/financeiro/useMovimentoContabil';
import ModalGruposEconomicos, {
  ItemGrupoEconomicoProps,
} from '@/pages/admin/components/ModalGrupoEconomico';
import ModalContasBancarias, {
  ItemContaBancariaProps,
} from '@/pages/financeiro/components/ModalContasBancarias';
import { Download, EraserIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { FaSpinner } from 'react-icons/fa6';
import { useStoreTableMovimentoContabil } from './store-table';

const FiltersMovimentoContabiluseStoreTableMovimentoContabil = ({
  refetch,
}: {
  refetch: () => void;
}) => {
  const [filters, setFilters, resetFilters] = useStoreTableMovimentoContabil(
    (state) => [state.filters, state.setFilters, state.resetFilters]
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
        title: 'Dados insuficientes!',
        description: 'Para poder gerar o relatório selecione o grupo econômico',
        variant: 'destructive',
      });
      return;
    }
    if (!filters.range_data?.from && !filters.range_data?.to) {
      toast({
        title: 'Dados insuficientes!',
        description:
          'Para poder gerar o relatório selecione o período de pagamento',
        variant: 'destructive',
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

  // const handleClickFilter = (e: React.MouseEvent<HTMLButtonElement>) => {
  //   e.stopPropagation();
  //   // console.log(filters);

  //   refetch();
  // };
  const handleResetFilter = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    await new Promise((resolve) => resolve(resetFilters()));

    refetch();
  };

  const [itemOpen, setItemOpen] = useState<string>('item-1');

  return (
    <Accordion
      type="single"
      collapsible
      value={itemOpen}
      onValueChange={(e) => setItemOpen(e)}
      className="p-2 border dark:border-slate-800 rounded-lg "
    >
      <AccordionItem value="item-1" className="relative border-0">
        <div className="flex gap-3 items-center absolute start-16 top-1">
          {isLoading ? (
            <Button size={'xs'} disabled>
              <span className="flex gap-2 w-full items-center justify-center">
                <FaSpinner size={12} className="ms-2 animate-spin" /> Gerando
                Relatório...
              </span>
            </Button>
          ) : (
            <Button size={'xs'} onClick={() => getRelatorio()}>
              Gerar Relatório
              <Download size={12} className="ms-2" />
            </Button>
          )}
          {/* <Button size={'xs'} onClick={handleClickFilter}>
            Aplicar <FilterIcon size={12} className="ms-2" />
          </Button> */}
          <Button size={'xs'} variant="secondary" onClick={handleResetFilter}>
            Limpar <EraserIcon size={12} className="ms-2" />
          </Button>
        </div>
        <AccordionTrigger className={`py-1 hover:no-underline`}>
          <span className="">Filtros</span>
        </AccordionTrigger>
        <AccordionContent className="p-0 pt-3">
          <ScrollArea className="w-fill whitespace-nowrap rounded-md pb-2.5">
            <div className="flex w-max space-x-3 items-end">
              <div className="flex flex-col">
                <label className="text-sm font-medium mb-2">
                  Grupo Econômico
                </label>
                <Input
                  value={filters.grupo_economico}
                  className="flex-1 min-h-10 min-w-[20ch]"
                  readOnly
                  placeholder="Selecione o grupo..."
                  onClick={() => setModalGrupoEconomicoOpen(true)}
                />
              </div>
              <div className="flex flex-col ">
                <label className="text-sm font-medium mb-2">
                  Conta Bancária
                </label>
                <Input
                  value={filters.conta_bancaria}
                  className="flex-1 min-h-10 min-w-[20ch]"
                  readOnly
                  placeholder="Selecione a conta..."
                  onClick={() => setModalContaBancariaOpen(true)}
                  disabled={!filters.id_grupo_economico}
                />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium mb-2">Período</label>
                <DatePickerWithRange
                  description="Período de pagamento"
                  date={filters.range_data}
                  setDate={(range_data) => {
                    setFilters({ range_data: range_data });
                  }}
                />
              </div>
              {/* {isLoading ? (
                <Button disabled>
                  <span className="flex gap-2 w-full items-center justify-center">
                    <FaSpinner size={18} className="me-2 animate-spin" />{' '}
                    Gerando Relatório...
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
                    id_conta_bancaria: '',
                    id_grupo_economico: '',
                    id_matriz: '',
                    grupo_economico: '',
                    conta_bancaria: '',
                    mes: '',
                    ano: '',
                  });
                }}
                variant={'secondary'}
              >
                Limpar <EraserIcon size={16} className="ms-2" />
              </Button> */}

              <ScrollBar orientation="horizontal" />
            </div>
          </ScrollArea>
        </AccordionContent>
      </AccordionItem>
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
    </Accordion>
  );
};

export default FiltersMovimentoContabiluseStoreTableMovimentoContabil;
