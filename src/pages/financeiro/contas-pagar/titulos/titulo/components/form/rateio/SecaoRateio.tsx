import SelectTipoRateio from "@/components/custom/SelectTipoRateio";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/axios";
import { Divide, Download, Pen, Trash, Upload } from "lucide-react";
import { useMemo, useRef } from "react";
import { UseFormReturn, useFieldArray } from "react-hook-form";
import { TituloSchemaProps } from "../../../form-data";
import { ItemRateioTitulo } from "../../../store";
import { toast } from "@/components/ui/use-toast";
import { exportToExcel, importFromExcel } from "@/helpers/importExportXLS";
import { Button } from "@/components/ui/button";
import { ModalItemRateio } from "./ModalItemRateio";
import { BtnNovoItemRateio } from "./BtnNovoItemRateio";
import { DataVirtualTableHeaderFixed } from "@/components/custom/DataVirtualTableHeaderFixed";
import { ColumnDef } from "@tanstack/react-table";
import AlertPopUp from "@/components/custom/AlertPopUp";
import { useStoreRateio } from "./context";
import { normalizeCurrency } from "@/helpers/mask";
import RemoverItensRateio from "./BtnRemoverItensRateio";
import { BtnPadronizarAlocacao } from "./BtnPadronizarAlocacao";
import { Filial } from "@/types/filial-type";

type SecaoRateioProps = {
    id?: string | null,
    form: UseFormReturn<TituloSchemaProps>,
    disabled: boolean,
    canEdit: boolean,
    modalEditing: boolean,
}

const SecaoRateio = ({
    id,
    form,
    disabled,
    canEdit,
    modalEditing,

}: SecaoRateioProps) => {

    //^ WATCHES
    const valorTotalTitulo = form.watch("valor");
    const nome_filial = form.watch('filial')
    const id_filial = form.watch('id_filial')
    const id_grupo_economico = form.watch('id_grupo_economico')

    const { setValue, formState: { errors } } = form;

    // * [ RATEIO ]
    const rateio_manual = !!+form.watch("rateio_manual");
    const canEditRateio = canEdit && modalEditing;
    const canEditItensRateio = canEdit && modalEditing && rateio_manual;

    const fileImportRateioRef = useRef<HTMLInputElement | null>(null);

    const {
        append: addItemRateio,
        remove: removeItemRateio,
    } = useFieldArray({
        control: form.control,
        name: "itens_rateio",
    });

    const witens_rateio = form.watch('itens_rateio')

    const updateItemRateio = useStoreRateio().updateItemRateio

    const columns = useMemo<ColumnDef<ItemRateioTitulo>[]>(
        () => [
            {
                accessorKey: 'id',
                header: 'AÇÃO',
                cell: (info) => {
                    const index = info.row.index
                    return (
                        <div className="w-full flex items-center justify-center gap-2">
                            {rateio_manual && canEditRateio && (
                                <>
                                    <Button onClick={() => {
                                        // @ts-ignore
                                        updateItemRateio({ index, itemRateio: witens_rateio[index] })
                                    }} type="button" variant="warning" size={'xs'}><Pen size={18} /></Button>

                                    <AlertPopUp
                                        title="Deseja realmente remover o item do rateio?"
                                        description=""
                                        action={() => handleRemoveItemRateio(index)}
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
                                </>
                            )}
                        </div>
                    )
                },
                size: 80,
            },
            {
                accessorKey: 'filial',
                header: 'FILIAL',
                size: 200,
            },
            {
                accessorKey: 'centro_custo',
                header: 'CENTRO DE CUSTOS',
                size: 120,
            },
            {
                accessorKey: 'plano_conta',
                header: 'PLANO DE CONTAS',
                cell: (info) => {
                    let text = info.getValue<string>()
                    return <span>{text?.substring(0, 50)}</span>
                },
                size: 150,
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
                accessorKey: 'percentual',
                header: 'PERCENTUAL',
                size: 80,
                cell: (info) => {
                    let valor = (parseFloat(info.getValue<string>())).toFixed(4) + '%'

                    return <div className={`w-full  px-2 text-center`}>{valor}</div>
                }
            },
        ],
        [witens_rateio, rateio_manual, canEdit],
    )

    async function handleChangeRateio(novo_id_rateio: string) {
        if (novo_id_rateio) {
            setValue("update_rateio", true);
            api
                .get(`financeiro/rateios/${novo_id_rateio}`, {
                    params: { id_grupo_economico: id_grupo_economico },
                })
                .then(async (data) => {
                    const novoRateio = data.data;
                    const itensNovoRateio = novoRateio.itens;

                    await new Promise((resolve) => {
                        // @ts-ignore
                        form.resetField("itens_rateio", { defaultValue: [] });
                        resolve("success");
                    });
                    const novos_itens: ItemRateioTitulo[] = []

                    if (novoRateio.manual) {
                        novos_itens.push({
                            id: new Date().getTime().toString(),
                            id_filial: `${id_filial}`,
                            filial: nome_filial,
                            id_centro_custo: '',
                            centro_custo: '',
                            id_plano_conta: '',
                            plano_conta: '',
                            percentual: "1",
                            valor: valorTotalTitulo,
                        });

                    } else {
                        itensNovoRateio.forEach((item: ItemRateioTitulo) => {
                            let percent = parseFloat(item.percentual) / 100
                            novos_itens.push({
                                id: new Date().getTime().toString(),
                                id_filial: `${item.id_filial || ""}`,
                                filial: item.filial,
                                percentual: `${percent || "0.00"}`,
                                valor: `${parseFloat(valorTotalTitulo) * percent || '0'}`,
                                id_centro_custo: '',
                                centro_custo: '',
                                id_plano_conta: '',
                                plano_conta: '',
                            });
                        });

                    }

                    // @ts-ignore
                    setValue('itens_rateio', novos_itens)
                    setValue("rateio_manual", !!novoRateio.manual);
                })
                .catch(() => {
                    toast({
                        variant: "destructive",
                        title: "Erro!",
                        description: "Não foi possível receber os dados do novo rateio",
                    });
                });
        }
    }

    function handleRemoveItemRateio(index: number) {
        setValue("update_rateio", true);
        removeItemRateio(index);
    }

    function handleClickExportarRateio() {
        const json: any = [];
        witens_rateio?.forEach((item: ItemRateioTitulo) => {
            const obj: any = { ...item };
            obj.percentual = parseFloat(item.percentual);
            obj.valor = parseFloat(item.valor);
            json.push(obj);
        });
        exportToExcel(json, `rateio-${id ? "titulo-" + id : "novo-titulo"}`);
    }

    function handleClickImportarRateio() {
        fileImportRateioRef?.current?.click();
    }

    async function handleChangeImportarRateio() {
        try {
            if (fileImportRateioRef?.current) {
                const file =
                    fileImportRateioRef.current.files &&
                    fileImportRateioRef.current.files[0];
                if (file) {

                    const dataFiliais = await api.get('/filial', { params: {} })
                    console.log('Filiais query', dataFiliais)
                    // @ts-ignore
                    const filiais = dataFiliais?.data?.rows || []
                    if (filiais.length === 0) {
                        throw new Error('Não foi possível obter a relação de filiais')
                    }

                    const reader = new FileReader();
                    reader.readAsArrayBuffer(file);
                    reader.onload = async (e) => {
                        try {


                            const importedData = e.target?.result;

                            // @ts-ignore
                            const rows: ItemRateioTitulo[] = 
                            importFromExcel(importedData) || [];

                            setValue("update_rateio", true);
                            console.log(rows)
                            for (const row of rows) {
                                if (!row.id_filial && !row.filial) {
                                    throw new Error('Você precisa identificar o campo filial ou id_filial!')
                                }

                                let novoItem_id_filial = ''
                                let novoItem_filial = ''
                                let novoItem_id_centro_custo = ''
                                let novoItem_centro_custo = ''
                                let novoItem_id_plano_conta = ''
                                let novoItem_plano_conta = ''

                                let novoItem_valor = 0;
                                let novoItem_percentual = 0;
                                if (!row.valor && !row.percentual) {
                                    throw new Error('O valor ou percentual precisam ser definidos na planilha. Não pode deixar os dois zerados...')
                                }
                                if (row.valor) {
                                    const valor = parseFloat(row.valor)
                                    novoItem_percentual = valor / parseFloat(valorTotalTitulo) * 100
                                    novoItem_valor = valor;

                                } else {
                                    const percent = parseFloat(row.percentual)
                                    novoItem_percentual = percent
                                    novoItem_valor = percent * parseFloat(valorTotalTitulo);
                                }

                                if (parseFloat(row.id_filial) > 0 && row.filial) {
                                    let filterFilial = filiais.find((f: Filial) => f.id == row.id_filial)
                                    novoItem_filial = filterFilial.nome || 'NÃO IDENTIFICADA'
                                    novoItem_id_filial = filterFilial.id

                                } else if (parseFloat(row.id_filial) > 0) {
                                    let filterFilial = filiais.find((f: Filial) => f.id == row.id_filial)
                                    const filial = filterFilial
                                    novoItem_filial = filial.nome || 'NÃO IDENTIFICADA'
                                    novoItem_id_filial = row.id_filial
                                } else {
                                    let filterFilial = filiais.find((f: Filial) => f.nome == row.filial)
                                    const filial = filterFilial
                                    novoItem_filial = filial.nome || 'NÃO IDENTIFICADA'
                                    novoItem_id_filial = filial.id
                                }

                                addItemRateio({
                                    id_filial: String(novoItem_id_filial),
                                    filial: novoItem_filial,
                                    id_centro_custo: String(novoItem_id_centro_custo),
                                    centro_custo: novoItem_centro_custo,
                                    id_plano_conta: String(novoItem_id_plano_conta),
                                    plano_conta: novoItem_plano_conta,
                                    valor: novoItem_valor.toFixed(2),
                                    percentual: novoItem_percentual.toFixed(4),
                                });
                            };
                        } catch (error) {
                            toast({
                                variant: 'destructive', title: 'Erro ao tentar importar',
                                // @ts-ignore
                                description: error?.response?.data?.message || error?.message || 'Erro desconhecido'
                            })
                            return
                        }
                    };

                }
            }
        } catch (error) {
            toast({
                variant: 'destructive', title: 'Erro ao tentar importar',
                // @ts-ignore
                description: error?.response?.data?.message || error?.message || 'Erro desconhecido'
            })
        }
    }

    return (
        <div className="p-3 bg-slate-200 dark:bg-blue-950 rounded-lg">
            <ModalItemRateio control={form.control} canEdit={canEditRateio} />
            <div className="flex gap-2 mb-3 items-center">
                <Divide />
                <span className="text-lg font-bold ">
                    Definição do rateio
                </span>
                <div className="ms-auto flex gap-3">
                    <BtnPadronizarAlocacao form={form} canEdit={canEditRateio} />
                    <RemoverItensRateio form={form} canEditItensRateio={canEditItensRateio} />
                    <BtnNovoItemRateio control={form.control} canEdit={canEditRateio} />
                </div>

            </div>

            {/* Ações do rateio */}
            <div className="flex gap-3 flex-wrap items-end">
                <SelectTipoRateio
                    label="Tipo de rateio"
                    name="id_rateio"
                    disabled={disabled}
                    id_grupo_economico={id_grupo_economico}
                    control={form.control}
                    onChange={handleChangeRateio}
                />

                <div className="flex items-center gap-3">
                    <Button
                        onClick={handleClickExportarRateio}
                        type="button"
                        variant={"success"}
                    >
                        <Download size={18} className="me-2" /> Exportar</Button>

                    <input
                        className="hidden"
                        type="file"
                        ref={fileImportRateioRef}
                        onChange={handleChangeImportarRateio}
                    />
                    {canEditRateio && rateio_manual && (
                        <Button
                            onClick={handleClickImportarRateio}
                            variant={"tertiary"}
                        >
                            <Upload size={18} className="me-2" /> Importar</Button>
                    )}
                </div>
            </div>

            <div className="flex justify-between items-baseline mt-3">
                <span className="text-md font-medium">
                    Itens do rateio
                </span>
            </div>
            <div className="flex flex-col w-full gap-3 mt-3 max-w-screen-md">
                <DataVirtualTableHeaderFixed
                    data={witens_rateio}
                    // @ts-ignore
                    columns={columns}
                />

                <div className="flex items-center gap-3">
                    <div className="mt-2 text-muted-foreground">
                        <span>Total: R$ </span>
                        {witens_rateio
                            ?.reduce((acc, curr) => {
                                return acc + parseFloat(curr.valor);
                            }, 0)
                            .toFixed(2)
                            .replace(".", ",")}
                    </div>
                    <div className="mt-2 text-muted-foreground">
                        <span>Percentual: </span>
                        {witens_rateio
                            ?.reduce((acc, curr) => {
                                let val = parseFloat(curr.percentual);
                                return acc + val;
                            }, 0)
                            .toFixed(2)
                            .replace(".", ",")}
                        %
                    </div>
                </div>
            </div>
        </div>);
}

export default SecaoRateio;