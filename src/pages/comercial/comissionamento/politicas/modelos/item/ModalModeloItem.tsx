import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import AlertPopUp from "@/components/custom/AlertPopUp";
import FormInput, {
  Input,
} from "@/components/custom/FormInput";
import FormSelect from "@/components/custom/FormSelect";
import ModalButtons from "@/components/custom/ModalButtons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SegmentoProps } from "@/hooks/comercial/useConfiguracoes";
import { usePoliticas } from "@/hooks/comercial/usePoliticas";
import { Percent, Trash } from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
} from "react";
import { TbCurrencyReal } from "react-icons/tb";
import ModalSegmentos from "../../components/ModalSegmentos";
import { useStoreComissionamentoPoliticas } from "../../store";
import {
  ModeloItemFormData,
  useFormModeloItemData,
} from "./form-data";

const ModalModeloItem = () => {
  const [
    id,
    id_modelo,
    id_cargo_politica,
    modalOpen,
    closeModal,
    modalEditing,
    editModal,
    isPending,
    setModeloIsPending,
    escalonamento_cargo,
  ] = useStoreComissionamentoPoliticas(
    (state) => [
      state.id_modelo_item,
      state.id_modelo,
      state.id_cargo_politica,
      state.modalModeloItemOpen,
      state.closeModalModeloItem,
      state.modalModeloItemEditing,
      state.editModalModeloItem,
      state.modeloIsPending,
      state.setModeloIsPending,
      state.escalonamento_cargo,
    ]
  );

  const [
    modalSegmentosOpen,
    setModalSegmentosOpen,
  ] = useState(false);
  const formRef = useRef<HTMLFormElement | null>(
    null
  );

  const { data, isLoading } =
    usePoliticas().getOneModeloItem(id);

  const itens_escalonamento_default =
    escalonamento_cargo?.itens.map((item) => ({
      percentual: item,
      valor: "0",
    }));

  const { form } = useFormModeloItemData(
    id
      ? data
      : {
          id,
          tipo: "",
          segmento: "",
          premiacao: "",
          id_modelo,
          escalonamento:
            escalonamento_cargo?.descricao,
          id_cargo_politica,
          itens_escalonamento:
            itens_escalonamento_default,
        }
  );

  const {
    mutate: updateModeloItem,
    isSuccess: updateModeloItemIsSuccess,
    isPending: updateModeloItemIsPending,
  } = usePoliticas().updateModeloItem();
  const {
    mutate: insertModeloItem,
    isSuccess: insertModeloItemIsSuccess,
    isPending: insertModeloItemIsPending,
  } = usePoliticas().insertModeloItem();

  function handleClickCancel() {
    closeModal();
  }

  function handleSelectionSegmento(
    segmento: SegmentoProps
  ) {
    form.setValue(
      "id_segmento",
      segmento.id || ""
    );
    form.setValue(
      "segmento",
      segmento.segmento || ""
    );
  }

  function onSubmitData(
    data: ModeloItemFormData
  ) {
    if (id) updateModeloItem(data);
    if (!id) insertModeloItem(data);
  }

  useEffect(() => {
    (updateModeloItemIsSuccess ||
      insertModeloItemIsSuccess) &&
      handleClickCancel();
  }, [
    updateModeloItemIsSuccess,
    insertModeloItemIsSuccess,
  ]);
  useEffect(() => {
    if (updateModeloItemIsPending) {
      setModeloIsPending(true);
    } else {
      setModeloIsPending(false);
    }
  }, [updateModeloItemIsPending]);
  useEffect(() => {
    if (insertModeloItemIsPending) {
      setModeloIsPending(true);
    } else {
      setModeloIsPending(false);
    }
  }, [insertModeloItemIsPending]);

  const itens_escalonamento = form.watch(
    "itens_escalonamento"
  );
  const tipo_premiacao = form.watch(
    "tipo_premiacao"
  );
  const errors = form.formState.errors;

  useEffect(() => {
    if (!id) {
      editModal(true);
    }
  }, [id]);

  return (
    <Dialog
      open={modalOpen}
      onOpenChange={handleClickCancel}
    >
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {id
              ? `Editar Item: ${id}`
              : "Novo Item"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            ref={formRef}
            onSubmit={form.handleSubmit(
              onSubmitData
            )}
            className="flex flex-wrap gap-3 "
          >
            <FormSelect
              name={"tipo"}
              label="Tipo"
              control={form.control}
              options={[
                {
                  value: "comissao",
                  label: "COMISSÃO",
                },
                {
                  value: "bonus",
                  label: "BÔNUS",
                },
              ]}
              disabled={!modalEditing}
              className="flex-1"
            />
            <FormSelect
              name="tipo_premiacao"
              label="Premiação"
              control={form.control}
              options={[
                {
                  value: "percentual",
                  label: "PERCENTUAL (%)",
                },
                {
                  value: "unitario",
                  label: "UNITÁRIO (R$)",
                },
                {
                  value: "integral",
                  label: "INTEGRAL (R$)",
                },
              ]}
              disabled={!modalEditing}
              className="flex-1"
            />

            <FormInput
              name="segmento"
              label="Segmento"
              inputClass="uppercase"
              className="flex-1 min-w-full"
              control={form.control}
              disabled={!modalEditing}
              readOnly
              onClick={() =>
                setModalSegmentosOpen(true)
              }
            />
            <div
              className={`overflow-auto scroll-thin w-full max-h-[40vh] rounded-md border ${
                !modalEditing ||
                (isPending && "opacity-80")
              }`}
            >
              <Table>
                <TableHeader className="bg-secondary">
                  <TableRow className="text-nowrap uppercase">
                    <TableHead>
                      Escalonamento
                    </TableHead>
                    <TableHead className="flex itens-center justify-between">
                      <span className="flex items-center">
                        Valor
                      </span>
                      {errors?.itens_escalonamento
                        ?.message && (
                        <Popover>
                          <PopoverTrigger>
                            <Badge
                              variant={
                                "destructive"
                              }
                            >
                              Atenção
                            </Badge>
                          </PopoverTrigger>
                          <PopoverContent className="bg-destructive text-destructive-foreground text-wrap normal-case">
                            {
                              errors
                                .itens_escalonamento
                                .message
                            }
                          </PopoverContent>
                        </Popover>
                      )}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {itens_escalonamento?.map(
                    (item, index) => (
                      <TableRow
                        key={`${index} ${item.percentual}`}
                      >
                        <TableCell>
                          {`${
                            parseFloat(
                              item.percentual
                            ) * 100
                          }%`}
                        </TableCell>
                        <TableCell className="flex">
                          <Button
                            type={"button"}
                            variant={"secondary"}
                            disabled={true}
                            className={`flex items-center justify-center rounded-none rounded-l-md p-2 `}
                          >
                            {tipo_premiacao ===
                            "percentual" ? (
                              <Percent
                                size={18}
                              />
                            ) : (
                              <TbCurrencyReal
                                size={18}
                              />
                            )}
                          </Button>
                          <Input
                            className="rounded-none rounded-r-md"
                            value={item.valor}
                            onChange={(e) =>
                              form.setValue(
                                `itens_escalonamento.${index}.valor`,
                                e.target.value
                              )
                            }
                            disabled={
                              !modalEditing
                            }
                            type="number"
                            min={0.0}
                            step={"0.01"}
                          />
                        </TableCell>
                      </TableRow>
                    )
                  )}
                </TableBody>
              </Table>
            </div>
          </form>
          <ModalSegmentos
            open={modalSegmentosOpen}
            onOpenChange={() =>
              setModalSegmentosOpen(false)
            }
            handleSelection={
              handleSelectionSegmento
            }
            closeOnSelection
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
              description="Essa ação não pode ser desfeita. O item será excluído definitivamente do servidor."
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
                Excluir Item
              </Button>
            </AlertPopUp>
          </ModalButtons>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalModeloItem;
