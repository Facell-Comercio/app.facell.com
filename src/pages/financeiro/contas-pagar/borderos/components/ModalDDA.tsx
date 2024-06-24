import {
  ModalComponent,
  ModalComponentRow,
} from "@/components/custom/ModalComponent";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { normalizeCnpjNumber, normalizeCurrency } from "@/helpers/mask";
import { useEffect, useState } from "react";
import { useStoreDDA } from "./storeDDA";
import { VinculoDDAparams, useDDA } from "@/hooks/financeiro/useDDA";
import { DDA } from "@/types/financeiro/dda-type";
import { formatDate } from "date-fns";
import { DatePickerWithRange } from "@/components/ui/date-range";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import SelectFilial from "@/components/custom/SelectFilial";
import { Input } from "@/components/ui/input";
import { Eraser, Filter } from "lucide-react";
import AlertPopUp from "@/components/custom/AlertPopUp";
import { toast } from "@/components/ui/use-toast";

type DataProps = {
  description: string;
  item: any;
};

type PaginationProps = {
  pageSize: number;
  pageIndex: number;
};

type ModalDDAprops = {
  id_vencimento?: number,
  vinculados?: boolean,
  naoVinculados?: boolean,
}

export const ModalDDA = ({ id_vencimento, vinculados, naoVinculados }: ModalDDAprops) => {
  const modalOpen = useStoreDDA().modalOpen
  const toggleModal = useStoreDDA().toggleModal
  const filters = useStoreDDA().filters
  const setFilters = useStoreDDA().setFilters
  const clearFilters = useStoreDDA().clearFilters

  const initialFilters = {
    tipo_data: 'data_vencimento', id_vencimento, vinculados, naoVinculados
  }
  useEffect(() => {
    setFilters(initialFilters)
  }, [])

  const resetFilters = () => {
    clearFilters()
    setFilters({ ...initialFilters })
    setTimeout(()=>{
      refetch()
    }, 300)
  }

  const [pagination, setPagination] = useState<PaginationProps>({
    pageSize: 15,
    pageIndex: 0,
  });

  const { data, isLoading, isError, refetch } = useDDA().getAllDDA({ pagination, filters })

  const dataRows = data?.data?.rows.map((item: DDA) => ({
    description: `${normalizeCnpjNumber(item.cnpj_filial)
      } - ${normalizeCnpjNumber(item.cnpj_fornecedor)} - ${formatDate(item.data_vencimento, 'dd/MM/yyyy')} - ${normalizeCurrency(item.valor)} - ${item.nome_fornecedor} - ${item.cod_barras}`,
    item,
  }));

  const vincularDDA = async ({id_dda, id_vencimento}: VinculoDDAparams)=>{
    try {
      await useDDA().vincularDDA({id_dda, id_vencimento})
      toast({
        variant: 'success',
        title: 'Vínculo do DDA com o Vencimento realizado!',
      })
      toggleModal(false)
      return true
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro ao tentar vincular',
        // @ts-ignore
        description: error?.response?.data?.message || error.message 
      })
      return false
    }
  }

  const handleClickVincular = async ({id_dda, id_vencimento}: VinculoDDAparams)=>{
    await vincularDDA({id_dda, id_vencimento})
    refetch()
  }
  const handleClickBuscarVencimento = ()=>{
    
  }



  const pageCount = (data && data.data.pageCount) || 0;
  // if (isLoading) return null;
  // if (isError) return null;
  if (!modalOpen) return null;

  return (
    <Dialog open={modalOpen} onOpenChange={toggleModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>DDA - Lista de boletos</DialogTitle>
          <DialogDescription>
            {id_vencimento ?
              `Escolha um  boleto para vincular com o vencimento ${id_vencimento}.`
              : 'Clique em vincular para conectar um boleto a um vencimento a pagar.'}
          </DialogDescription>

          <div className="flex gap-3">
            <div className="flex gap-2">
              <Button size={'sm'} onClick={() => { refetch() }}><Filter size={18} className="me-2"/> Filtrar</Button>
              <Button size={'sm'} variant={'secondary'} onClick={resetFilters}><Eraser size={18} className="me-2"/> Resetar</Button>
            </div>
            <div className="flex gap-3 max-w-[960px] overflow-auto scroll-thin">
              <SelectFilial className="min-w-[240px]"
                value={filters?.id_filial || ''}
                onChange={(val) => {
                  setFilters({ id_filial: val })
                }}
              />

              <Select value={filters?.tipo_data || 'data_vencimento'} onValueChange={(val) => { console.log(val);
              ; setFilters({ tipo_data: val }) }}>
                <SelectTrigger>
                  <SelectValue></SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="data_vencimento">Vencimento</SelectItem>
                  <SelectItem value="data_emissao">Emissão</SelectItem>
                </SelectContent>
              </Select>

              <DatePickerWithRange
                date={filters.range_data}
                setDate={(range_data) => {
                  setFilters({ range_data: range_data });
                }}
              />

              <Input value={filters.nome_fornecedor || ''} onChange={(e)=>setFilters({ nome_fornecedor: e.target.value})} placeholder="NOME FORNECEDOR" className="min-w-[23ch]" />

              <Input value={filters.cod_barras || ''} onChange={(e)=>setFilters({ cod_barras: e.target.value})} placeholder="CÓD. BARRAS" className="min-w-[44ch]" />

            </div>
          </div>
        </DialogHeader>
        <ModalComponent
          pageCount={pageCount}
          refetch={refetch}
          pagination={pagination}
          setPagination={setPagination}
        >
          {dataRows &&
            dataRows.map((row: DataProps, index: number) => (
              <ModalComponentRow
                key={"modal_dda_item_row:" + index + row.item}
              >
                <>
                  <span className="flex items-center text-sm" title={row.item.id_vencimento && 'Vinculado com vencimento: ' + String(row.item.id_vencimento)}>
                    {row.description}
                  </span>
                  {row.item.id_vencimento ?
                    (
                      <Button variant={'success'} size={'xs'} disabled title={String(row.item.id_vencimento)}>Vinculado</Button>
                    ) : (
                      id_vencimento ?
                        (
                          // Esse botão vinculará o DDA escolhido com o id_vencimento recebido no parâmetro:
                          <AlertPopUp
                            title="Deseja realmente vincular o boleto com o vencimento?"
                            description="A ação não poderá ser desfeita!"
                            action={()=>{handleClickVincular({id_dda: row.item.id, id_vencimento: id_vencimento})}}
                          >
                          <Button
                            size={"xs"}
                            variant={"warning"}
                          >
                            Vincular
                          </Button>
                          </AlertPopUp>


                        ) :
                        (
                          // Esse botão abrirá um modal de vencimentos para seleção e vinculação:
                          <Button
                            variant={'warning'}
                            size={'xs'}
                          >Vincular</Button>
                        )
                    )
                  }
                </>
              </ModalComponentRow>
            ))}
        </ModalComponent>
      </DialogContent>
    </Dialog>
  );
}; 