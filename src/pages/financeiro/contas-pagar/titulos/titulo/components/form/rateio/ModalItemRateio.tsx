import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  UseFormReturn,
  useFieldArray,
  useForm,
  useWatch,
} from "react-hook-form";

import FormInput from "@/components/custom/FormInput";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Form } from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import { normalizeCurrency } from "@/helpers/mask";
import { api } from "@/lib/axios";
import ModalCentrosCustos from "@/pages/financeiro/components/ModalCentrosCustos";
import ModalFiliais from "@/pages/admin/components/ModalFiliais";
import ModalPlanosContas, {
  ItemPlanoContas,
} from "@/pages/financeiro/components/ModalPlanosContas";
import { Filial } from "@/types/filial-type";
import { CentroCustos } from "@/types/financeiro/centro-custos-type";
import { AlertCircle, Percent, Plus, Save } from "lucide-react";
import { ChangeEvent, useEffect, useState } from "react";
import z from "zod";
import { TituloSchemaProps, rateioSchema } from "../../../form-data";
import { ItemRateioTitulo } from "../../../store";
import { initialStateRateio, useStoreRateio } from "./context";
import { checkIfValidateBudget } from "../../../helpers/helper";
import { DotsLoading } from "@/components/custom/Loading";

type ModalItemRateioProps = {
  form: UseFormReturn<TituloSchemaProps>;
  canEdit: boolean;
};

export const ModalItemRateio = ({
  form: formTitulo,
  canEdit,
}: ModalItemRateioProps) => {
  const [modalFilialOpen, setModalFilialOpen] = useState<boolean>(false);
  const [modalPlanoContasOpen, setModalPlanoContasOpen] =
    useState<boolean>(false);
  const [modalCentrosCustosOpen, setModalCentrosCustosOpen] =
    useState<boolean>(false);
  const [valorOrcamento, setValorOrcamento] = useState<number>(0);

  type Feedback = {
    variant?: "success" | "warning" | "destructive" | "default" | null;
    title: string;
    description?: string;
  };
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [validarOrcamento, setValidarOrcamento] = useState<boolean>(true);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  // Dados obtidos do Título:
  const id_matriz = useWatch({
    name: "id_matriz",
    control: formTitulo.control,
  });
  const id_grupo_economico = useWatch({
    name: "id_grupo_economico",
    control: formTitulo.control,
  });
  const valorTotalTitulo = useWatch({
    name: "valor",
    control: formTitulo.control,
  });
  const itens_rateio = useWatch({
    name: "itens_rateio",
    control: formTitulo.control,
  });

  // -------------------

  const itemRateio = useStoreRateio().itemRateio;
  const indexFieldArray = useStoreRateio().indexFieldArray;

  const modalOpen = useStoreRateio().modalOpen;
  const toggleModal = useStoreRateio().toggleModal;

  const formItemRateio = useForm({
    resolver: zodResolver(rateioSchema),
    values: itemRateio || initialStateRateio.itemRateio,
  });

  const { append: addItemRateio, update: updateItemRateio } = useFieldArray({
    control: formTitulo.control,
    name: "itens_rateio",
  });

  const isUpdate = !!itemRateio.id;

  // * [ FILIAL ]
  function showModalFilial() {
    if (!id_matriz) {
      toast({
        variant: "destructive",
        title: "Erro!",
        description: "Selecione primeiro a filial no corpo da solicitação!",
      });
      return;
    }
    if (!canEdit) {
      return;
    }
    setModalFilialOpen(true);
  }
  function handleSelectionFilial(item: Filial) {
    formItemRateio.setValue("id_filial", `${item.id}`);
    formItemRateio.setValue("filial", item.nome);
    setModalFilialOpen(false);
  }

  // * [ CENTRO DE CUSTOS ]
  function showModalCentrosCustos() {
    if (!id_matriz) {
      toast({
        variant: "destructive",
        title: "Erro!",
        description: "Selecione primeiro a filial no corpo da solicitação!",
      });
      return;
    }
    if (!canEdit) {
      return;
    }
    setModalCentrosCustosOpen(true);
  }
  function handleSelectionCentroCusto(item: CentroCustos) {
    formItemRateio.setValue("id_centro_custo", `${item.id}`);
    formItemRateio.setValue("centro_custo", item.nome);
    setModalCentrosCustosOpen(false);
  }

  // * [ PLANO DE CONTAS ]
  // Controle de plano de contas
  function showModalPlanoContas() {
    if (!id_matriz) {
      toast({
        variant: "destructive",
        title: "Erro!",
        description: "Selecione primeiro a filial!",
      });
      return;
    }
    if (!canEdit) {
      return;
    }
    setModalPlanoContasOpen(true);
  }

  function handleSelectionPlanoContas(item: ItemPlanoContas) {
    const planoContas = `${item.codigo} - ${item.descricao}`;
    formItemRateio.setValue("id_plano_conta", `${item.id}`);
    formItemRateio.setValue("plano_conta", planoContas);
    setModalPlanoContasOpen(false);
  }

  // * WATCHES
  const valor = parseFloat(formItemRateio.watch("valor"));
  const percentual = parseFloat(formItemRateio.watch("percentual"));
  const id_centro_custo = formItemRateio.watch("id_centro_custo");
  const id_plano_conta = formItemRateio.watch("id_plano_conta");

  // * ORÇAMENTO
  type FetchOrcamento = {
    id_grupo_economico: number | string;
    id_centro_custo: number | string;
    id_plano_conta: number | string;
    data_titulo?: Date | string;
  };
  const fetchOrcamento = async (props: FetchOrcamento) => {
    try {
      setIsFetching(true)
      const result = await api.get("/financeiro/orcamento/find-account", {
        params: { ...props },
      });
      const contaOrcamento = result.data;

      const aplicarOrcamento = checkIfValidateBudget(contaOrcamento)
      setValidarOrcamento(aplicarOrcamento)

      const valOrcamento = parseFloat(contaOrcamento.saldo);
      setValorOrcamento(valOrcamento);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao buscar valor do orçamento",
        // @ts-ignore
        description: error?.response?.data?.message || error.message,
      });
      setValorOrcamento(0);
    } finally {
      setIsFetching(false)
    }
  };

  const data_titulo = formTitulo.watch("created_at");

  useEffect(() => {
    if (id_grupo_economico && id_centro_custo && id_plano_conta) {
      fetchOrcamento({
        id_grupo_economico,
        id_centro_custo,
        id_plano_conta,
        data_titulo: isUpdate ? data_titulo : undefined,
      });
    } else {
      setValorOrcamento(0);
    }
  }, [id_grupo_economico, id_centro_custo, id_plano_conta]);

  const valorTotalItens =
    itens_rateio
      ?.filter((_: any, index: number) =>
        isUpdate ? index != indexFieldArray : true
      )
      .reduce((acc: number, curr: { valor: string }) => {
        return acc + parseFloat(curr.valor);
      }, 0) || 0;

  const previsaoConsumoOrcamento =
    (itens_rateio
      ?.filter((i: ItemRateioTitulo, index: number) => {
        if (
          i.id_centro_custo == id_centro_custo &&
          i.id_plano_conta == id_plano_conta
        ) {
          if (isUpdate ? index != indexFieldArray : true) {
            return true;
          }
        }
        return false;
      })
      .reduce((acc: number, curr: { valor: string }) => {
        return acc + parseFloat(curr.valor);
      }, 0) || 0) + valor;

  const saldoFuturoOrcamento = valorOrcamento - previsaoConsumoOrcamento;
  const valorExcessoOrcamento = previsaoConsumoOrcamento - valorOrcamento;

  const excedeOrcamento = valorExcessoOrcamento > 0;

  const valorPrevisto = parseFloat((valor + valorTotalItens).toFixed(2))
  const valorExcessoTitulo = valorPrevisto - parseFloat(valorTotalTitulo);

  const excedeTotalTitulo = valorExcessoTitulo > 0;

  useEffect(() => {
    if (!valor || valor <= 0) {
      setFeedback({
        variant: "destructive",
        title: "Preencha o valor",
      });
      return;
    }
    if (!percentual || percentual <= 0) {
      setFeedback({
        variant: "destructive",
        title: "Preencha o percentual",
      });
      return;
    }
    if (validarOrcamento && excedeOrcamento) {
      setFeedback({
        variant: "destructive",
        title: "Orçamento excedido!",
        description: `O valor excede o orçamento em ${normalizeCurrency(
          valorExcessoOrcamento
        )}`,
      });
      return;
    }
    if (excedeTotalTitulo) {
      setFeedback({
        variant: "destructive",
        title: "Valor excedido!",
        description: `O valor excede o valor total da solicitação em ${
           parseFloat(valorExcessoTitulo.toFixed(2))
        }`,
      });
      return;
    }

    setFeedback({
      variant: "success",
      title: "Tudo certo",
    });
  }, [percentual, valor, valorOrcamento]);

  const btnDisabled = validarOrcamento &&
    (
      excedeOrcamento ||
      excedeTotalTitulo ||
      valorOrcamento <= 0 ||
      !valor ||
      valor <= 0 ||
      !percentual ||
      percentual <= 0
    );

  const onSubmit = (data: z.infer<typeof rateioSchema>) => {
    try {
      // verificar se já existe mesma filial + centro + plano
      if (!isUpdate) {
        const duplicatas =
          itens_rateio?.filter(
            (i: ItemRateioTitulo) =>
              i.id_centro_custo == id_centro_custo &&
              i.id_plano_conta == data.id_plano_conta &&
              i.id_filial == data.id_filial
          ) || [];
        if (duplicatas.length > 0) {
          setFeedback({
            variant: "destructive",
            title: "Item duplicado!",
            description: `Já existe um item com FILIAL: '${data.filial}', CENTRO DE CUSTO: '${data.centro_custo}' e PLANO DE CONTAS: '${data.plano_conta}'`,
          });
          return;
        }
      }

      const valor = parseFloat(data.valor);
      const percentual = parseFloat(data.percentual);

      if (valor <= 0) {
        throw new Error("Preencha o valor do Rateio");
      }
      if (percentual <= 0) {
        throw new Error("Percentual não pode ser zerado!");
      }
      if (isUpdate) {
        if (indexFieldArray === undefined) {
          toast({
            title:
              "Vencimento não identificado, feche e abra novamente o popup",
            variant: "destructive",
          });
        } else {
          const totalPrevisto =
            (itens_rateio
              ?.filter((_: any, index: number) => index != indexFieldArray)
              .reduce((acc: number, curr: { valor: string }) => {
                return acc + parseFloat(curr.valor);
              }, 0) || 0) + parseFloat(data.valor);
        
          const dif = totalPrevisto - parseFloat(valorTotalTitulo);
              
          if (dif > 0.01) {
            const difFormatada = dif;
            toast({
              variant: "destructive",
              title: `O valor do itemRateio excede o valor total em ${difFormatada}.`,
            });
            return;
          }
          updateItemRateio(indexFieldArray, {
            ...data,
            percentual: String(parseFloat(data.percentual) * 100),
          });
        }
      } else {
        const totalPrevisto =
          (itens_rateio?.reduce((acc: number, curr: { valor: string }) => {
            return acc + parseFloat(curr.valor);
          }, 0) || 0) + parseFloat(data.valor);
        const dif = totalPrevisto - parseFloat(valorTotalTitulo);

        if (dif > 0) {
          const difFormatada = normalizeCurrency(dif);
          toast({
            variant: "destructive",
            title: `O valor do itemRateio excede o valor total em ${difFormatada}.`,
          });
          return;
        }
        addItemRateio({
          id: new Date().getTime().toString(),
          id_filial: String(data.id_filial),
          filial: String(data.filial),
          id_centro_custo: String(data.id_centro_custo),
          centro_custo: String(data.centro_custo),
          id_plano_conta: String(data.id_plano_conta),
          plano_conta: String(data.plano_conta),
          valor: String(data.valor),
          percentual: String(parseFloat(data.percentual) * 100),
        });
      }
      formTitulo.setValue("update_rateio", true);
      formItemRateio.reset();
      toggleModal();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Ops!",
        description: error.message,
      });
    }
  };

  const handleChangeValor = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value || "0";
    const percent = (
      (parseFloat(val) / parseFloat(valorTotalTitulo)) *
      100
    ).toFixed(4);
    formItemRateio.setValue("percentual", percent);
  };
  const handleChangePercentual = (e: ChangeEvent<HTMLInputElement>) => {
    const percent = e.target.value || "0";
    const novoValor = (
      (parseFloat(percent) / 100) *
      parseFloat(valorTotalTitulo)
    ).toFixed(2);
    formItemRateio.setValue("valor", novoValor);
  };

  return (
    <Dialog open={modalOpen} onOpenChange={toggleModal}>
      <DialogContent className="sm:max-w-[400px]">
        <ModalFiliais
          open={canEdit && modalFilialOpen && !!id_grupo_economico}
          id_grupo_economico={id_grupo_economico}
          onOpenChange={setModalFilialOpen}
          handleSelection={handleSelectionFilial}
          closeOnSelection
        />

        <ModalCentrosCustos
          handleSelection={handleSelectionCentroCusto}
          id_grupo_economico={id_grupo_economico}
          // @ts-expect-error 'Vai funcionar'
          onOpenChange={setModalCentrosCustosOpen}
          open={canEdit && modalCentrosCustosOpen && !!id_grupo_economico}
          closeOnSelection={true}
        />

        <ModalPlanosContas
          open={canEdit && modalPlanoContasOpen && !!id_grupo_economico}
          id_grupo_economico={id_grupo_economico}
          tipo="Despesa"
          // @ts-ignore
          onOpenChange={setModalPlanoContasOpen}
          handleSelection={handleSelectionPlanoContas}
        />



        <Form {...formItemRateio}>
          <form
            onSubmit={(e) => {
              formItemRateio.handleSubmit(onSubmit)(e);
              e.stopPropagation();
            }}
          >
            <DialogHeader>
              <DialogTitle>
                {isUpdate ? "Editar Item" : "Adicionar Item"}
              </DialogTitle>
              <DialogDescription>
                Preencha todos os campos para prosseguir
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-3 py-4">
              <span onClick={showModalFilial}>
                <FormInput
                  name="filial"
                  label="Filial"
                  placeholder="SELECIONE"
                  readOnly
                  control={formItemRateio.control}
                />
              </span>
              <span onClick={showModalCentrosCustos}>
                <FormInput
                  name="centro_custo"
                  label="Centro de Custo"
                  placeholder="SELECIONE"
                  readOnly
                  control={formItemRateio.control}
                />
              </span>
              <span onClick={showModalPlanoContas}>
                <FormInput
                  name="plano_conta"
                  label="Plano de Contas"
                  placeholder="SELECIONE"
                  readOnly
                  control={formItemRateio.control}
                />
              </span>

              {isFetching ? <div className="w-full flex justify-center"><DotsLoading /></div> :
                validarOrcamento && (
                  <>
                    <div className="flex gap-3 text-muted-foreground">
                      <span>Saldo Orçamento</span>
                      <span>{normalizeCurrency(valorOrcamento)}</span>
                    </div>
                    <div className="flex gap-3 text-muted-foreground">
                      <span>Saldo Orçamento Futuro</span>
                      <span>{normalizeCurrency(saldoFuturoOrcamento)}</span>
                    </div>
                  </>
                )}

              <div className="flex gap-3">
                {feedback && (
                  <Alert variant={feedback.variant}>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>{feedback.title}</AlertTitle>
                    {feedback.description && (
                      <AlertDescription>
                        {feedback.description}
                      </AlertDescription>
                    )}
                  </Alert>
                )}
              </div>

              <div className="flex gap-3">
                <FormInput
                  name="valor"
                  type="number"
                  label="Valor"
                  onChange={handleChangeValor}
                  control={formItemRateio.control}
                />

                <FormInput
                  name="percentual"
                  type="number"
                  icon={Percent}
                  label="Percentual"
                  onChange={handleChangePercentual}
                  control={formItemRateio.control}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                disabled={btnDisabled}
                variant={isUpdate ? "success" : "default"}
                type="submit"
              >
                {isUpdate ? (
                  <span className="flex gap-2">
                    <Save size={18} />
                    Salvar
                  </span>
                ) : (
                  <span className="flex gap-2">
                    <Plus size={18} />
                    Adicionar
                  </span>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
