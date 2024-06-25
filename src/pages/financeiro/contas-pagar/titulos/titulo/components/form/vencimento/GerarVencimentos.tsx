import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { zodResolver } from "@hookform/resolvers/zod"
import { UseFormReturn, useFieldArray, useForm, useWatch } from "react-hook-form"

import z from 'zod'
import { calcularDataPrevisaoPagamento, proximoDiaUtil } from "../../../helpers/helper"
import FormInput from "@/components/custom/FormInput"
import FormDateInput from "@/components/custom/FormDate"
import { useState } from "react"
import { TituloSchemaProps } from "../../../form-data"
import { ListPlus, Play } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { normalizeCurrency } from "@/helpers/mask"
import { Form } from "@/components/ui/form"
import { VencimentoTitulo } from "../../../store"
import { addMonths } from "date-fns"

export function ModalGerarVencimentos({ form: formTitulo }: { form: UseFormReturn<TituloSchemaProps> }) {
    // WATCH TÍTULO:
    const valorTotalTitulo = useWatch({
        name: 'valor',
        control: formTitulo.control,
    })
    const vencimentos = useWatch({
        name: 'vencimentos',
        control: formTitulo.control,
    })

    const [modalOpen, setModalOpen] = useState<boolean>(false);

    const schema = z.object({
        data_vencimento: z.coerce.date(),
        parcelas: z.coerce.number().min(1, 'Parcela precisa ser >= 1'),
        valor: z.coerce.number().min(0.01, 'Valor precisa ser >= R$ 0,01'),
    })

    const initialValues =
    {
        data_vencimento: new Date().toISOString(),
        parcelas: '1',
        valor: '0'
    }

    // * FORM GERAÇÃO DE VENCIMENTOS
    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues: { ...initialValues },
    })

    const {
        append: addVencimento,
    } = useFieldArray({
        control: formTitulo.control,
        name: "vencimentos",
    });

    // const { formState: { errors } } = form;
    // console.log({
    //     erros_gerar_vencimentos: errors
    // })

    type GeradorVencimentos = {
        data_vencimento: string,
        parcelas: string,
        valor: string,
    }

    const onSubmit = (data: GeradorVencimentos) => {
        let dataVencimento = data.data_vencimento || new Date();
        let valorParcela = parseFloat(data.valor) || 0
        let qtdeParcelas = parseFloat(data.parcelas) || 0

        const valorTotalParcelas = valorParcela * qtdeParcelas;
        const totalVencimentos = (vencimentos?.reduce((acc: number, curr: VencimentoTitulo) => { return acc + parseFloat(curr.valor) }, 0) || 0);
        const totalTitulo = parseFloat(valorTotalTitulo)

        const excesso = (totalVencimentos + valorTotalParcelas) - totalTitulo;
        if (excesso > 0) {
            toast({
                variant: 'destructive',
                title: `Impedimento`,
                description: `O valor total seria excedido em ${normalizeCurrency(excesso)}`
            })
            return
        }
        for (let p = 0; p < qtdeParcelas; p++) {
            let obj = {
                id: new Date().getTime().toString(),
                data_vencimento: '',
                data_prevista: '',
                valor: valorParcela.toString(),
                cod_barras: '',
                qr_code: '',
            }

            // gerar uma data de vencimento e previsão
            if(p == 0){
                obj.data_vencimento = data.data_vencimento,
                obj.data_prevista = calcularDataPrevisaoPagamento(data.data_vencimento).toISOString()
            }else{
                obj.data_vencimento = proximoDiaUtil(addMonths(dataVencimento, p)).toString()
                obj.data_prevista = calcularDataPrevisaoPagamento(obj.data_vencimento).toISOString()
            }

            // incluir um item ao fieldArray
            addVencimento(obj)
        }
        formTitulo.setValue('update_vencimentos', true)
        setModalOpen(false)
        toast({
            variant: 'success',
            title: `Geração realizada`,
        })
        setModalOpen(false)
        form.reset()
    }

    return (
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
            <DialogTrigger asChild>
                <Button variant="tertiary" size={'sm'} ><ListPlus size={18} className="me-2"/> Gerar Vencimentos</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[50vw]">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <DialogHeader>
                            <DialogTitle>Gerar Vencimentos</DialogTitle>
                            <DialogDescription>
                                Defina o primeiro vencimento, quantidade de parcelas e valor da parcela e os vencimentos serão gerados automaticamente. <br />Caso o valor de uma das parcelas seja diferente, você pode gerar essa parcela diferente manualmente.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="flex gap-3 p-3 flex-wrap max-w-full mb-3">
                            <FormDateInput
                                name="data_vencimento"
                                label="Primeiro Vencimento"
                                control={form.control}
                            />

                            <FormInput
                                name="parcelas"
                                type="number"
                                label="Quantidade de Parcelas"
                                step="1"
                                min={1}
                                max={9999}
                                control={form.control}
                            />
                            <FormInput
                                name="valor"
                                type="number"
                                label="Valor da parcela"
                                inputClass="w-[20ch]"
                                control={form.control}
                            />
                        </div>

                        <DialogFooter>
                            <Button variant={'tertiary'} type="submit" ><Play size={18} className="me-2" /> Gerar</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog >
    )
}
