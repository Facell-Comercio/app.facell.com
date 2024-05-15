import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { zodResolver } from "@hookform/resolvers/zod"
import { Control, useFieldArray, useForm, useWatch } from "react-hook-form"

import z from 'zod'
import FormInput from "@/components/custom/FormInput"
import { rateioSchema } from "../../../form-data"
import { initialStateRateio, useStoreRateio } from "./context"
import { AlertCircle, Percent, Plus, Save } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { normalizeCurrency } from "@/helpers/mask"
import ModalPlanoContas, { ItemPlanoContas } from "@/pages/financeiro/components/ModalPlanoContas"
import ModalCentrosCustos from "@/pages/admin/components/ModalCentrosCustos"
import { useState } from "react"
import { CentroCustos } from "@/types/financeiro/centro-custos-type"
import ModalFilial from "@/pages/financeiro/components/ModalFilial"
import { Filial } from "@/types/filial-type"
import { Form } from "@/components/ui/form"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

type ModalItemRateioProps = {
    control: Control<any>,
    canEdit: boolean,
}

export const ModalItemRateio = ({ control: controlTitulo, canEdit }: ModalItemRateioProps) => {
    const [modalFilialOpen, setModalFilialOpen] = useState<boolean>(false)
    const [modalPlanoContasOpen, setModalPlanoContasOpen] = useState<boolean>(false)
    const [modalCentrosCustosOpen, setModalCentrosCustosOpen] = useState<boolean>(false)

    // Dados obtidos do Título:
    const id_matriz = useWatch({
        name: 'id_matriz',
        control: controlTitulo,
    })
    const valorTotalTitulo = useWatch({
        name: 'valor',
        control: controlTitulo,
    })
    const itens_rateio = useWatch({
        name: 'itens_rateio',
        control: controlTitulo,
    })

    // -------------------

    const itemRateio = useStoreRateio().itemRateio
    const indexFieldArray = useStoreRateio().indexFieldArray

    const modalOpen = useStoreRateio().modalOpen
    const toggleModal = useStoreRateio().toggleModal


    const formItemRateio = useForm({
        resolver: zodResolver(rateioSchema),
        values: itemRateio || initialStateRateio.itemRateio,
    })

    const {
        append: addItemRateio,
        update: updateItemRateio,
    } = useFieldArray({
        control: controlTitulo,
        name: "itens_rateio",
    });

    const isUpdate = !!itemRateio.id

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


    const onSubmit = (data: z.infer<typeof rateioSchema>) => {
        try {
            const valor = parseFloat(data.valor)
            const percentual = parseFloat(data.percentual)

            if (valor <= 0) {
                throw new Error('Preencha o valor do Rateio')
            }
            if (percentual <= 0) {
                throw new Error('Percentual não pode ser zerado!')
            }
            if (isUpdate) {
                if (indexFieldArray === undefined) {
                    toast({ title: 'Vencimento não identificado, feche e abra novamente o popup', variant: 'destructive' })
                } else {

                    const totalPrevisto = itens_rateio.filter((_: any, index: number) => index != indexFieldArray).reduce((acc: number, curr: { valor: string }) => { return acc + parseFloat(curr.valor) }, 0) + parseFloat(data.valor)
                    const dif = totalPrevisto - parseFloat(valorTotalTitulo)

                    if (dif > 0) {
                        const difFormatada = normalizeCurrency(dif);
                        toast({
                            variant: 'destructive', title: `O valor do itemRateio excede o valor total em ${difFormatada}.`
                        })
                        return
                    }
                    updateItemRateio(indexFieldArray, { ...data })
                }
            } else {
                const totalPrevisto = itens_rateio.reduce((acc: number, curr: { valor: string }) => { return acc + parseFloat(curr.valor) }, 0) + parseFloat(data.valor)
                const dif = totalPrevisto - parseFloat(valorTotalTitulo)

                if (dif > 0) {
                    const difFormatada = normalizeCurrency(dif);
                    toast({
                        variant: 'destructive', title: `O valor do itemRateio excede o valor total em ${difFormatada}.`
                    })
                    return
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
                    percentual: String(data.percentual),
                })
            }
            formItemRateio.reset()
            toggleModal()
        } catch (error: any) {
            toast({
                variant: 'destructive', title: 'Ops!',
                description: error.message
            })

        }
    }

    return (
        <Dialog open={modalOpen} onOpenChange={toggleModal}>
            <DialogContent className="sm:max-w-[400px]">

                <ModalFilial
                    open={canEdit && modalFilialOpen && !!id_matriz}
                    id_matriz={id_matriz}
                    onOpenChange={setModalFilialOpen}
                    handleSelection={handleSelectionFilial}
                    closeOnSelection
                />

                <ModalPlanoContas
                    open={canEdit && modalPlanoContasOpen && !!id_matriz}
                    id_matriz={id_matriz}
                    tipo="Despesa"
                    onOpenChange={setModalPlanoContasOpen}
                    handleSelection={handleSelectionPlanoContas}
                />

                <ModalCentrosCustos
                    handleSelection={handleSelectionCentroCusto}
                    id_matriz={id_matriz}
                    // @ts-expect-error 'Vai funcionar'
                    onOpenChange={setModalCentrosCustosOpen}
                    open={canEdit && modalCentrosCustosOpen && !!id_matriz}
                    closeOnSelection={true}
                />

                <Form {...formItemRateio}>
                    <form onSubmit={formItemRateio.handleSubmit(onSubmit)}>
                        <DialogHeader>
                            <DialogTitle>{isUpdate ? 'Editar Item' : 'Adicionar Item'}</DialogTitle>
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

                            <div className="flex gap-3">
                                <Alert variant="destructive">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertTitle>Orçamento excedido</AlertTitle>
                                    <AlertDescription>
                                        Necessário R$ 130,00
                                    </AlertDescription>
                                </Alert>
                            </div>

                            <div className="flex gap-3">
                                <FormInput
                                    name="valor"
                                    type="number"
                                    label="Valor"
                                    inputClass=""
                                    control={formItemRateio.control}
                                />

                                <FormInput
                                    name="percentual"
                                    type="number"
                                    icon={Percent}
                                    label="Percentual"
                                    inputClass=""
                                    control={formItemRateio.control}
                                />
                            </div>
                        </div>

                        <DialogFooter>
                            <Button variant={isUpdate ? 'success' : 'default'} type="submit" >
                                {isUpdate ? <span className="flex gap-2"><Save size={18} />Salvar</span> : <span className="flex gap-2"><Plus size={18} />Adicionar</span>}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog >
    )
}