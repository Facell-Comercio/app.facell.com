import { Badge } from "@/components/ui/badge";
import { DollarSign, Pen, Trash } from "lucide-react";
import { UseFormReturn, useFieldArray } from "react-hook-form";
import { TituloSchemaProps } from "../../../form-data";
import { Button } from "@/components/ui/button";

import { BtnNovoVencimento } from "./NovoVencimento";

import { useMemo } from "react";
import { VencimentoTitulo } from "../../../store";
import { ColumnDef } from "@tanstack/react-table";
import { formatDate } from "date-fns";
import { DataVirtualTableHeaderFixed } from "@/components/custom/DataVirtualTableHeaderFixed";
import { normalizeCurrency } from "@/helpers/mask";
import AlertPopUp from "@/components/custom/AlertPopUp";
import { ModalVencimento } from "./ModalVencimento";
import { useStoreVencimento } from "./context";
import { ModalGerarVencimentos } from "./GerarVencimentos";
import RemoverVencimentos from "./RemoverVencimentos";

type SecaoVencimentosProps = {
    id?: string | null,
    form: UseFormReturn<TituloSchemaProps>,
    canEdit: boolean,
    disabled: boolean,
    modalEditing: boolean,
    readOnly: boolean,
}

const SecaoVencimentos = ({
    id,
    form,
    disabled,
    canEdit,
    modalEditing,
    readOnly,

}: SecaoVencimentosProps) => {

    const {
        remove: removeVencimento,
    } = useFieldArray({
        control: form.control,
        name: "vencimentos",
    });

    const wvencimentos = form.watch('vencimentos')

    const { setValue, formState: { errors } } = form;

    function handleRemoveVencimento(index: number) {
        setValue("update_vencimentos", true);
        removeVencimento(index);
    }
    function handleChangeVencimento() {
        setValue("update_vencimentos", true);
    }

    const updateVencimento = useStoreVencimento().updateVencimento

    const columns = useMemo<ColumnDef<VencimentoTitulo>[]>(
        () => [
            {
                accessorKey: 'id',
                header: 'AÇÃO',
                cell: (info) => {
                    const index = info.row.index
                    return (
                        <div className="w-full flex items-center justify-center gap-2">
                            <Button onClick={()=>{
                                updateVencimento({index, vencimento: wvencimentos[index]})
                            }} type="button" variant="warning" size={'xs'}><Pen size={18}/></Button>

                            <AlertPopUp
                                title="Deseja realmente remover o vencimento?"
                                description=""
                                action={() => handleRemoveVencimento(index)}
                                children={
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size={'xs'}
                                    >
                                        <Trash size={18} />
                                    </Button>
                                }
                            />

                        </div>
                    )
                },
                size: 80,
            },
            {
                accessorKey: 'data_vencimento',
                header: 'VENCIMENTO',
                cell: (info) => {
                    console.log(info.getValue())
                    let value = formatDate(info.getValue<Date>(), 'dd/MM/yyyy')
                    return <div className="w-full text-center">{value}</div>
                },
                size: 80,
            },
            {
                accessorKey: 'data_prevista',
                header: 'PREVISÃO',
                size: 80,
                cell: (info) => {
                    let value = formatDate(info.getValue<Date>(), 'dd/MM/yyyy')
                    return <div className="w-full text-center">{value}</div>
                },
            },
            {
                accessorKey: 'valor',
                header: 'VALOR',
                size: 120,
                cell: (info) => {
                    let valor = parseFloat(info.getValue<string>())
                    let currency = normalizeCurrency(valor)
                    return <div className={`w-full  px-2 text-end`}>{currency}</div>
                }
            },
            {
                accessorKey: 'linha_digitavel',
                header: 'LINHA DIGITÁVEL',
                size: 400,
            },
        ],
        [wvencimentos],
    )

    const valor_total = wvencimentos.reduce((acc, curr) => {
        return acc + parseFloat(curr.valor)
    }, 0)

    return (
        <div className="p-3 bg-slate-200 dark:bg-blue-950 rounded-lg">
            <ModalVencimento control={form.control} />
            <div className="flex gap-2 mb-3 items-center">
                <DollarSign />
                <span className="text-lg font-bold ">
                    Vencimentos
                </span>
                {errors.vencimentos?.message && (
                    <Badge variant={"destructive"}>
                        {errors.vencimentos?.message}
                    </Badge>
                )}
                {canEdit && modalEditing && (
                    <div className="ms-auto flex gap-3 items-center">
                        <RemoverVencimentos form={form}/>
                        <ModalGerarVencimentos control={form.control}/>
                        <BtnNovoVencimento />
                    </div>
                )}
            </div>
            <div className="flex gap-3">
                <DataVirtualTableHeaderFixed
                    data={wvencimentos}
                    // @ts-ignore
                    columns={columns}
                />
            </div>
            <div className="flex gap-3 mt-2 text-sm">
                <span>Total Vencimentos: </span><span>{normalizeCurrency(valor_total)}</span>
            </div>
        </div>

    );
}

export default SecaoVencimentos;