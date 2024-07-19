import AlertPopUp from '@/components/custom/AlertPopUp';
import FormInput from '@/components/custom/FormInput';
import FormSelectGrupoEconomico from '@/components/custom/FormSelectGrupoEconomico';
import ModalButtons from '@/components/custom/ModalButtons';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { TarifaProps, useTarifas } from '@/hooks/financeiro/useTarifas';
import ModalCentrosCustos from '@/pages/financeiro/components/ModalCentrosCustos';
import ModalPlanosContas, {
  ItemPlanoContas,
} from '@/pages/financeiro/components/ModalPlanosContas';
import { CentroCustos } from '@/types/financeiro/centro-custos-type';
import { Trash } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useStoreTableTarifas } from '../table/store-table';
import useFormTarifasPadrao from './form-data';

const ModalTarifas = () => {
  const [id, modalOpen, closeModal, modalEditing, editModal] =
    useStoreTableTarifas((state) => [
      state.id,
      state.modalOpen,
      state.closeModal,
      state.modalEditing,
      state.editModal,
    ]);

  const [openModalCentrosCusto, setOpenModalCentrosCusto] =
    useState<boolean>(false);
  const [openModalPlanoContas, setOpenModalPlanoContas] =
    useState<boolean>(false);
  const formRef = useRef(null);

  const { data, isSuccess, isLoading } = useTarifas().getOne(id);
  const newData: TarifaProps & Record<string, any> = {} as TarifaProps &
    Record<string, any>;

  for (const key in data?.data) {
    if (typeof data?.data[key] === 'number') {
      newData[key] = String(data?.data[key]);
    } else if (data?.data[key] === null) {
      newData[key] = '';
    } else {
      newData[key] = data?.data[key];
    }
  }

  const { form } = useFormTarifasPadrao(newData);
  // const {errors} = form.formState;
  // console.log({errors})

  const {
    mutate: insert,
    isPending: insertIsPending,
    isSuccess: insertIsSuccess,
  } = useTarifas().insertOne();
  const {
    mutate: update,
    isPending: updateIsPending,
    isSuccess: updateIsSuccess,
  } = useTarifas().update();
  const { mutate: deleteOne } = useTarifas().deleteOne();

  function onSubmitData(data: TarifaProps) {
    !id && insert(data);
    id && update(data);
  }
  function handleClickCancel() {
    closeModal();
  }
  const handleSelectCentroCusto = (centro_custo: CentroCustos) => {
    form.setValue('centro_custo', centro_custo.nome);
    form.setValue('id_centro_custo', centro_custo.id);
  };
  function handleSelectionPlanoContas(plano_contas: ItemPlanoContas) {
    form.setValue('plano_contas', plano_contas.descricao);
    form.setValue('id_plano_contas', plano_contas.id);
  }

  const id_grupo_economico = form.watch('id_grupo_economico');

  useEffect(() => {
    if (insertIsSuccess || updateIsSuccess) {
      closeModal();
    }
  }, [insertIsSuccess, updateIsSuccess]);

  return (
    <Dialog open={modalOpen} onOpenChange={closeModal}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{id ? `Tarifa: ${id}` : 'Nova Tarifa'}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh] w-full">
          {modalOpen && !isLoading && (!id || isSuccess) ? (
            <Form {...form}>
              <form
                action=""
                ref={formRef}
                onSubmit={form.handleSubmit(onSubmitData)}
                className="flex gap-3 flex-col"
              >
                <section className="flex w-full gap-3">
                  <FormSelectGrupoEconomico
                    control={form.control}
                    name="id_grupo_economico"
                    label="Grupo Econômico"
                    className="flex-1 min-w-44 sm:min-w-96"
                    disabled={!modalEditing}
                  />
                  <FormInput
                    control={form.control}
                    label="Descrição"
                    name="descricao"
                    disabled={!modalEditing}
                  />
                </section>
                <section className="flex w-full gap-3">
                  <FormInput
                    title={
                      !id_grupo_economico
                        ? 'Primeiro selecione o grupo econômico'
                        : ''
                    }
                    name="centro_custo"
                    label="Centro de Custos"
                    control={form.control}
                    placeholder="SELECIONE O CENTRO DE CUSTO"
                    onClick={() => setOpenModalCentrosCusto(true)}
                    readOnly
                    disabled={!id_grupo_economico || !modalEditing}
                  />
                  <FormInput
                    title={
                      !id_grupo_economico
                        ? 'Primeiro selecione o grupo econômico'
                        : ''
                    }
                    name="plano_contas"
                    label="Plano de Contas"
                    control={form.control}
                    placeholder="SELECIONE O PLANO DE CONTAS"
                    onClick={() => setOpenModalPlanoContas(true)}
                    readOnly
                    disabled={!id_grupo_economico || !modalEditing}
                  />
                </section>
              </form>
            </Form>
          ) : (
            <div className="w-full min-h-full p-2 grid grid-rows-4 gap-3">
              <Skeleton className="w-full row-span-1" />
              <Skeleton className="w-full row-span-3" />
            </div>
          )}
        </ScrollArea>
        <ModalCentrosCustos
          handleSelection={handleSelectCentroCusto}
          id_grupo_economico={id_grupo_economico}
          // @ts-expect-error 'Ignore, vai funcionar...'
          onOpenChange={setOpenModalCentrosCusto}
          open={openModalCentrosCusto}
          closeOnSelection
        />
        <ModalPlanosContas
          open={openModalPlanoContas && !!id_grupo_economico}
          id_grupo_economico={id_grupo_economico}
          tipo="Despesa"
          //@ts-ignore
          onOpenChange={() => setOpenModalPlanoContas(false)}
          handleSelection={handleSelectionPlanoContas}
          closeOnSelection
        />
        <DialogFooter>
          <ModalButtons
            id={id}
            modalEditing={modalEditing}
            edit={() => editModal(true)}
            cancel={handleClickCancel}
            formRef={formRef}
            isLoading={insertIsPending || updateIsPending}
          >
            {id && (
              <AlertPopUp
                title={'Deseja realmente excluir'}
                description="Essa ação não pode ser desfeita. A tarifa será excluída definitivamente do servidor."
                action={() => {
                  deleteOne(id);
                  closeModal();
                }}
              >
                <Button
                  type={'button'}
                  size="lg"
                  variant={'destructive'}
                  className={`text-white justify-self-start ${
                    !modalEditing && 'hidden'
                  }`}
                >
                  <Trash className="me-2" />
                  Excluir
                </Button>
              </AlertPopUp>
            )}
          </ModalButtons>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalTarifas;
