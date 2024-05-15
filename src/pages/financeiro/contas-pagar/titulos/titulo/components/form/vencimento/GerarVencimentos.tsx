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
import { Control, useFieldArray, useForm, useWatch } from "react-hook-form"

import z from 'zod'
import { calcularDataPrevisaoPagamento } from "../../../helpers/helper"
import FormInput from "@/components/custom/FormInput"
import FormDateInput from "@/components/custom/FormDate"
import { useEffect, useState } from "react"
import { TituloSchemaProps, vencimentoSchema } from "../../../form-data"
import { Play, Plus } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { normalizeCurrency } from "@/helpers/mask"
import { Form } from "@/components/ui/form"

export function ModalGerarVencimentos({ control: controlTitulo }: { control: Control<TituloSchemaProps> }) {
    // WATCH TÍTULO:
    const valorTotalTitulo = useWatch({
        name: 'valor',
        control: controlTitulo,
    })
    const vencimentos = useWatch({
        name: 'vencimentos',
        control: controlTitulo,
    })

    const [modalOpen, setModalOpen] = useState<boolean>(false);

    const schema = z.object({
        data_vencimento: z.string(),
        parcelas: z.string(),
        valor: z.string(),
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
        defaultValues: {...initialValues},
    })

    const {
        append: addVencimento,
        update: updateVencimento,
    } = useFieldArray({
        control: controlTitulo,
        name: "vencimentos",
    });

    const { formState: { errors } } = form;
    console.log({
        erros_gerar_vencimentos: errors
    })

    const onSubmit = (data: z.infer<typeof vencimentoSchema>) => {
        return;

        const totalPrevisto = vencimentos.reduce((acc: number, curr: { valor: string }) => { return acc + parseFloat(curr.valor) }, 0) + parseFloat(data.valor)
        const dif = totalPrevisto - parseFloat(valorTotalTitulo)
        console.log('DIF', dif)
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

        form.reset()
        setModalOpen(false)
    }

    return (
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
            <DialogTrigger asChild>
                <Button variant="tertiary"><Plus size={18} /><Plus size={18} /> Gerar Vencimentos</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[50vw]">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <DialogHeader>
                            <DialogTitle>Gerar Vencimentos</DialogTitle>
                            <DialogDescription>
                                Defina o primeiro vencimento, quantidade de parcelas e valor da parcela e os vencimentos serão gerados automaticamente. <br/>Caso o valor de uma das parcelas seja diferente, você pode gerar essa parcela diferente manualmente.
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
