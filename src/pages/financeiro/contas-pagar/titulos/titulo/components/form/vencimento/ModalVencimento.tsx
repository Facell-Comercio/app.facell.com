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
import { UseFormReturn, useFieldArray, useForm, useWatch } from "react-hook-form"

import z from 'zod'
import { calcularDataPrevisaoPagamento } from "../../../helpers/helper"
import FormInput from "@/components/custom/FormInput"
import FormDateInput from "@/components/custom/FormDate"
import { useEffect } from "react"
import { TituloSchemaProps, vencimentoSchema } from "../../../form-data"
import { initialStateVencimento, useStoreVencimento } from "./context"
import { Plus, Save } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { normalizeCurrency } from "@/helpers/mask"
import { Form } from "@/components/ui/form"

export function ModalVencimento({ form: formTitulo }: { form: UseFormReturn<TituloSchemaProps> }) {
    const vencimento = useStoreVencimento().vencimento
    const indexFieldArray = useStoreVencimento().indexFieldArray

    const modalOpen = useStoreVencimento().modalOpen
    const toggleModal = useStoreVencimento().toggleModal

    const form = useForm({
        resolver: zodResolver(vencimentoSchema),
        values: { ...vencimento } || { ...initialStateVencimento.vencimento },
        defaultValues: { ...initialStateVencimento.vencimento }
    })

    const {
        append: addVencimento,
        update: updateVencimento,
    } = useFieldArray({
        control: formTitulo.control,
        name: "vencimentos",
    });

    const valorTotalTitulo = useWatch({
        name: 'valor',
        control: formTitulo.control,
    })
    const vencimentos = useWatch({
        name: 'vencimentos',
        control: formTitulo.control,
    })

    // const { formState: { errors } } = form;

    const data_vencimento = form.watch('data_vencimento')

    useEffect(() => {
        form.setValue('data_prevista', String(calcularDataPrevisaoPagamento(data_vencimento)))
    }, [data_vencimento])
    const isUpdate = !!vencimento.id

    const onSubmit = (data: z.infer<typeof vencimentoSchema>) => {
        if (isUpdate) {
            if (indexFieldArray === undefined) {
                toast({ title: 'Vencimento não identificado, feche e abra novamente o popup', variant: 'destructive' })
            } else {

                const totalPrevisto = (vencimentos
                    ?.filter((_: any, index: number) => index != indexFieldArray)
                    .reduce((acc: number, curr: { valor: string }) => { return acc + parseFloat(curr.valor) }, 0) || 0) + parseFloat(data.valor)
                const dif = totalPrevisto - parseFloat(valorTotalTitulo)
                console.log(indexFieldArray, totalPrevisto, dif, data.valor)
                if (dif > 0) {
                    const difFormatada = normalizeCurrency(dif);
                    toast({
                        variant: 'destructive', title: `O valor do vencimento excede o valor total em ${difFormatada}.`
                    })
                    return
                }
                updateVencimento(indexFieldArray, { ...data })
            }
        } else {
            const totalPrevisto = (vencimentos?.reduce((acc: number, curr: { valor: string }) => { return acc + parseFloat(curr.valor) }, 0) || 0) + parseFloat(data.valor)
            const dif = totalPrevisto - parseFloat(valorTotalTitulo)
            if (dif > 0) {
                const difFormatada = normalizeCurrency(dif);
                toast({
                    variant: 'destructive', title: `O valor do vencimento excede o valor total em ${difFormatada}.`
                })
                return
            }
            addVencimento({
                id: new Date().getTime().toString(),
                data_vencimento: String(data.data_vencimento),
                data_prevista: String(data.data_prevista),
                valor: data.valor,
                linha_digitavel: data.linha_digitavel,
            })
        }
        formTitulo.setValue('update_vencimentos', true)
        form.reset()
        toggleModal()
    }

    return (
        <Dialog open={modalOpen} onOpenChange={toggleModal}>
            <DialogContent className="sm:max-w-[50vw]">
                <Form {...form}>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            // @ts-ignore
                            form.handleSubmit(onSubmit)()
                        }}
                    >
                        <DialogHeader>
                            <DialogTitle>{isUpdate ? 'Editar Vencimento' : 'Adicionar Vencimento'}</DialogTitle>
                            <DialogDescription>
                                Você precisa informar uma data de vencimento e um valor
                            </DialogDescription>
                        </DialogHeader>

                        <div className="flex flex-col gap-3 p-3 max-w-full mb-3">
                            <div className="flex gap-3">
                                <FormDateInput
                                    name="data_vencimento"
                                    label="Vencimento"
                                    control={form.control}
                                />
                                <FormDateInput
                                    name="data_prevista"
                                    label="Prevista"
                                    control={form.control}
                                    disabled={true}
                                />

                                <FormInput
                                    name="valor"
                                    type="number"
                                    label="Valor"
                                    inputClass="w-[20ch]"
                                    control={form.control}
                                />
                            </div>

                            <FormInput
                                name="linha_digitavel"
                                label="Linha digitável"
                                control={form.control}
                            />
                        </div>

                        <DialogFooter>
                            <Button variant={isUpdate ? 'success' : 'default'} type="submit" >
                                {
                                    isUpdate ?
                                        <span className="flex gap-2"><Save size={18} />Salvar</span> :
                                        <span className="flex gap-2"><Plus size={18} />Adicionar</span>
                                }
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog >
    )
}
