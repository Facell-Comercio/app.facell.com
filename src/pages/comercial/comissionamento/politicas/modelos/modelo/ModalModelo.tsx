import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import AlertPopUp from "@/components/custom/AlertPopUp";
import FormInput from "@/components/custom/FormInput";
import ModalButtons from "@/components/custom/ModalButtons";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { usePoliticas } from "@/hooks/comercial/usePoliticas";
import ModalFiliais from "@/pages/admin/components/ModalFiliais";
import { Filial } from "@/types/filial-type";
import { Plus, Trash } from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
} from "react";
import { useFieldArray } from "react-hook-form";
import { useStoreComissionamentoPoliticas } from "../../store";
import {
  ModeloFormData,
  useFormModeloData,
} from "./form-data";

const ModalModelo = () => {
  const [
    id,
    id_cargo_politica,
    modalOpen,
    closeModal,
    modalEditing,
    editModal,
    isPending,
    setModeloIsPending,
  ] = useStoreComissionamentoPoliticas(
    (state) => [
      state.id_modelo,
      state.id_cargo_politica,
      state.modalModeloOpen,
      state.closeModalModelo,
      state.modalModeloEditing,
      state.editModalModelo,
      state.modeloIsPending,
      state.setModeloIsPending,
    ]
  );

  const [modalFilialOpen, setModalFilialOpen] =
    useState(false);
  const formRef = useRef<HTMLFormElement | null>(
    null
  );

  const { data, isLoading } =
    usePoliticas().getOneModelo(id);

  const { form } = useFormModeloData(
    id
      ? data
      : {
          id_cargo_politica,
          descricao: "",
          filiais: [],
        }
  );

  const { remove: removeFilial } = useFieldArray({
    control: form.control,
    name: "filiais",
  });
  const {
    mutate: updateModelo,
    isSuccess: updateModeloIsSuccess,
    isPending: updateModeloIsPending,
  } = usePoliticas().updateModelo();
  const {
    mutate: insertModelo,
    isSuccess: insertModeloIsSuccess,
    isPending: insertModeloIsPending,
  } = usePoliticas().insertModelo();

  function handleClickCancel() {
    closeModal();
  }

  const filiais = form.watch("filiais");

  function onSubmitData(data: ModeloFormData) {
    if (id) updateModelo(data);
    if (!id) insertModelo(data);
  }

  function handleSelectionFilial(
    filiais: Filial[]
  ) {
    //@ts-ignore Funciona
    form.setValue("filiais", filiais);
    setModalFilialOpen(false);
  }

  useEffect(() => {
    (updateModeloIsSuccess ||
      insertModeloIsSuccess) &&
      handleClickCancel();
  }, [
    updateModeloIsSuccess,
    insertModeloIsSuccess,
  ]);
  useEffect(() => {
    if (updateModeloIsPending) {
      setModeloIsPending(true);
    } else {
      setModeloIsPending(false);
    }
  }, [updateModeloIsPending]);
  useEffect(() => {
    if (insertModeloIsPending) {
      setModeloIsPending(true);
    } else {
      setModeloIsPending(false);
    }
  }, [insertModeloIsPending]);

  useEffect(() => {
    if (!id) {
      editModal(true);
    }
  }, [id]);

  //! Verifica se há erros no formulário
  // console.log(form.formState.errors);

  return (
    <Dialog
      open={modalOpen}
      onOpenChange={handleClickCancel}
    >
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {id ? `Modelo: ${id}` : "Novo Modelo"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            ref={formRef}
            onSubmit={form.handleSubmit(
              onSubmitData
            )}
            className="flex flex-col gap-3 "
          >
            <FormInput
              name="descricao"
              label="Descrição"
              inputClass="uppercase"
              control={form.control}
              disabled={!modalEditing}
            />
            <span className="flex justify-end">
              <Button
                disabled={!modalEditing}
                onClick={() =>
                  setModalFilialOpen(true)
                }
              >
                <Plus
                  className="me-2"
                  size={"sm"}
                />
                Add Filial
              </Button>
            </span>
            <div
              className={`overflow-auto scroll-thin max-h-[40vh] rounded-md border ${
                !modalEditing ||
                (isPending && "opacity-80")
              }`}
            >
              <Table>
                <TableHeader className="bg-secondary">
                  <TableRow className="text-nowrap uppercase">
                    <TableHead>Ação</TableHead>
                    <TableHead>UF</TableHead>
                    <TableHead>Filial</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filiais?.map(
                    (filial, index) => (
                      <TableRow
                        key={`${index} ${filial.id}`}
                        className="uppercase text-nowrap"
                      >
                        <TableCell>
                          <Button
                            size={"xs"}
                            variant={
                              "destructive"
                            }
                            onClick={() =>
                              removeFilial(index)
                            }
                            disabled={
                              !modalEditing ||
                              isPending
                            }
                          >
                            <Trash size={16} />
                          </Button>
                        </TableCell>
                        <TableCell>
                          {filial.uf}
                        </TableCell>
                        <TableCell>
                          {filial.nome}
                        </TableCell>
                      </TableRow>
                    )
                  )}
                </TableBody>
              </Table>
            </div>
          </form>
          <ModalFiliais
            open={modalFilialOpen}
            multiSelection
            closeOnSelection
            onOpenChange={setModalFilialOpen}
            handleMultiSelection={
              handleSelectionFilial
            }
            initialIds={filiais.map((filial) =>
              String(filial.id)
            )}
            //@ts-ignore Vai funcionar
            initialData={filiais}
          />
        </Form>
        <DialogFooter>
          <ModalButtons
            id={id}
            modalEditing={modalEditing}
            edit={() => editModal(true)}
            cancel={handleClickCancel}
            formRef={formRef}
            isLoading={isLoading || isPending}
          >
            <AlertPopUp
              title={"Deseja realmente excluir"}
              description="Essa ação não pode ser desfeita. O modelo será excluído definitivamente do servidor."
              action={() => {
                // deleteVale(id);
              }}
            >
              <Button
                type={"button"}
                size="lg"
                variant={"destructive"}
                className={`text-white justify-self-start ${
                  !modalEditing && "hidden"
                }`}
              >
                <Trash className="me-2" />
                Excluir Modelo
              </Button>
            </AlertPopUp>
          </ModalButtons>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalModelo;
