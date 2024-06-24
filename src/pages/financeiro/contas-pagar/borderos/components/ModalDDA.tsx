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
import { useQueryClient } from "@tanstack/react-query";
import ModalVencimentos from "@/pages/financeiro/components/ModalVencimentos";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

type DataProps = {
  description: string;
  item: any;
};

type PaginationProps = {
  pageSize: number;
  pageIndex: number;
};

export const ModalDDA = () => {
  const queryClient = useQueryClient()
  const id_vencimento = useStoreDDA().id_vencimento
  const modalOpen = useStoreDDA().modalOpen
  const filters = useStoreDDA().filters

  const toggleModal = useStoreDDA().toggleModal
  const setFilters = useStoreDDA().setFilters
  const clearFilters = useStoreDDA().clearFilters

  const resetFilters = () => {
    clearFilters()
    setTimeout(() => {
      refetch()
    }, 300)
  }

  useEffect(() => {

  }, [filters])

  const [pagination, setPagination] = useState<PaginationProps>({
    pageSize: 15,
    pageIndex: 0,
  });

  const { data, isLoading, isError, refetch } = useDDA().getAllDDA({ pagination, filters })

  const dataRows = data?.data?.rows.map((item: DDA) => ({
    description: `${item.id} - ${normalizeCnpjNumber(item.cnpj_filial)
      } - ${normalizeCnpjNumber(item.cnpj_fornecedor)} - ${formatDate(item.data_vencimento, 'dd/MM/yyyy')} - ${normalizeCurrency(item.valor)} - ${item.nome_fornecedor} - ${item.cod_barras}`,
    item,
  }));

  const vincularDDA = async ({ id_dda, id_vencimento: idVencimento }: VinculoDDA) => {
    try {
      if (!id_dda) {
        throw new Error('ID DDA não informado!')
      }
      if (!idVencimento) {
        throw new Error('ID Vencimento não informado!')
      }
      await useDDA().vincularDDA({ id_dda, id_vencimento: idVencimento })
      toast({
        variant: 'success',
        title: 'Vínculo do DDA com o Vencimento realizado!',
      })
      if (id_vencimento) {
        toggleModal(false)
        queryClient.invalidateQueries({ queryKey: ['fin_borderos'] })
      }

      queryClient.invalidateQueries({ queryKey: ['fin_dda'] })

      refetch()
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

  const handleClickVincular = async ({ id_dda, id_vencimento }: VinculoDDA) => {
    const result = await vincularDDA({ id_dda, id_vencimento })
  }

  const [modalVencimentosOpen, setModalVencimentosOpen] = useState<boolean>(false);
  const [dialogDDAopen, setDialogDDAopen] = useState<boolean>(false);
  type VinculoDDA = {
    id_vencimento: number | null;
    id_dda: number | null;
  }
  const [preVinculoDDA, setPreVinculoDDA] = useState<VinculoDDA>({ id_vencimento: null, id_dda: null })

  const handleClickBuscarVencimento = ({ id_dda }: { id_dda: number }) => {
    setPreVinculoDDA(prev => ({ ...prev, id_dda: id_dda }))
    setModalVencimentosOpen(true)
  }
  const handleSelectVencimento = (vencimento: any) => {
    setPreVinculoDDA(prev => ({ ...prev, id_vencimento: vencimento.id_vencimento }))
    setDialogDDAopen(true)
  }


  const pageCount = (data && data.data.pageCount) || 0;
  // if (isLoading) return null;
  // if (isError) return null;
  if (!modalOpen) return null;

  return (
    <Dialog open={modalOpen} onOpenChange={toggleModal}>
      <DialogContent>

        <ModalVencimentos
          multiSelection={false}
          handleSelection={handleSelectVencimento}
          open={modalVencimentosOpen}
          // @ts-ignore
          onOpenChange={setModalVencimentosOpen}
        />

        <AlertDialog open={dialogDDAopen} onOpenChange={setDialogDDAopen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Deseja realmente vincular?</AlertDialogTitle>
              <AlertDialogDescription>
                Você está prestes a vincular o DDA ID: {preVinculoDDA.id_dda} com o Vencimento ID: {preVinculoDDA.id_vencimento}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => { vincularDDA(preVinculoDDA) }}>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <DialogHeader>
          <DialogTitle>DDA - Lista de boletos</DialogTitle>
          <DialogDescription>
            {id_vencimento ?
              `Escolha um  boleto para vincular com o vencimento ${id_vencimento}.`
              : 'Clique em vincular para conectar um boleto a um vencimento a pagar.'}
          </DialogDescription>

          <div className="flex gap-3">
            <div className="flex gap-2">
              <Button size={'sm'} onClick={() => { refetch() }}><Filter size={18} className="me-2" /> Filtrar</Button>
              <Button size={'sm'} variant={'secondary'} onClick={resetFilters}><Eraser size={18} className="me-2" /> Resetar</Button>
            </div>
            <div className="flex gap-3 max-w-[960px] overflow-auto scroll-thin">
              <SelectFilial className="min-w-[240px]"
                value={filters?.id_filial || ''}
                onChange={(val) => {
                  setFilters({ id_filial: val })
                }}
              />

              <Select value={filters?.tipo_data || 'data_vencimento'} onValueChange={(val) => {
                setFilters({ tipo_data: val })
              }}>
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

              <Input value={filters.nome_fornecedor || ''} onChange={(e) => setFilters({ nome_fornecedor: e.target.value })} placeholder="NOME FORNECEDOR" className="min-w-[23ch]" />

              <Input value={filters.cod_barras || ''} onChange={(e) => setFilters({ cod_barras: e.target.value })} placeholder="CÓD. BARRAS" className="min-w-[44ch]" />

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
                            action={() => { handleClickVincular({ id_dda: row.item.id, id_vencimento: parseInt(id_vencimento) }) }}
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
                            onClick={() => { handleClickBuscarVencimento({ id_dda: row.item.id }) }}
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