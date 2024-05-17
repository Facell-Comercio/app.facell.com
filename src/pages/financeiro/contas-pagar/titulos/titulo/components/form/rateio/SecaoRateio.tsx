import SelectTipoRateio from "@/components/custom/SelectTipoRateio";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/axios";
import { Divide, Download, Pen, Trash, Upload } from "lucide-react";
import { useMemo, useRef } from "react";
import { UseFormReturn, useFieldArray } from "react-hook-form";
import { TituloSchemaProps } from "../../../form-data";
import { ItemRateioTitulo } from "../../../store";
import { toast } from "@/components/ui/use-toast";
import { useFilial } from "@/hooks/useFilial";
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

    const { data } = useFilial().getAll()
    //^ WATCHES
    const valorTotalTitulo = form.watch("valor");
    const nome_filial = form.watch('filial')
    const filiais = data?.data
    const id_filial = form.watch('id_filial')
    const id_grupo_economico = form.watch('id_grupo_economico')

    const { setValue, formState: { errors } } = form;

    // * [ RATEIO ]
    const rateio_manual = !!+form.watch("rateio_manual");
    const canEditRateio = canEdit && modalEditing;
    const canEditItensRateio = canEdit && modalEditing && rateio_manual;
    console.log({ canEditItensRateio, canEdit, modalEditing, rateio_manual })
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
                            <Button onClick={() => {
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
                    return <div className={`w-full  px-2 text-end`}>{text?.substring(0, 50)}</div>
                },
                size: 250,
            },
            {
                accessorKey: 'valor',
                header: 'VALOR',
                size: 100,
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
                    let valor = (parseFloat(info.getValue<string>()) * 100).toFixed(4) + '%'

                    return <div className={`w-full  px-2 text-center`}>{valor}</div>
                }
            },
        ],
        [witens_rateio],
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
        witens_rateio.forEach((item: ItemRateioTitulo) => {
            const obj: any = {};
            obj.filial =
                filiais?.find(
                    (f: { id: string; nome: string }) => f.id == item.id_filial
                )?.nome || "Não identificada";
            obj.percentual = parseFloat(item.percentual);
            // @ts-ignore
            obj.valor = (parseFloat(item.percentual) / 100) * parseFloat(valor || 0);
            json.push(obj);
        });
        exportToExcel(json, `rateio-${id ? "titulo-" + id : "novo-titulo"}`);
    }

    function handleClickImportarRateio() {
        fileImportRateioRef?.current?.click();
    }

    function handleChangeImportarRateio() {
        if (fileImportRateioRef?.current) {
            const file =
                fileImportRateioRef.current.files &&
                fileImportRateioRef.current.files[0];
            if (file) {
                const reader = new FileReader();
                reader.readAsArrayBuffer(file);
                reader.onload = async (e) => {
                    const importedData = e.target?.result;

                    const result = importFromExcel(importedData);

                    // @ts-ignore
                    const valorTotalRateio: number = result?.reduce((acc, cur) => {
                        // @ts-ignore
                        return acc + cur.valor;
                    }, 0) || 0;

                    setValue("update_rateio", true);
                    // @ts-ignore
                    form.resetField("itens_rateio", { defaultValue: [] });
                    // @ts-ignore
                    result?.forEach((item: ItemRateioTitulo) => {
                        const id_filial_rateio_item = filiais.find(
                            // @ts-ignore
                            (f: Filial) => f.nome === item?.filial
                        )?.id;

                        const percentual_rateio_item = (
                            // @ts-ignore
                            (item?.valor / valorTotalRateio) *
                            100
                        ).toFixed(4);
                        // console.log(item.filial, id_filial_rateio_item,  item.valor, valorTotalRateio,percentual_rateio_item )

                        addItemRateio({
                            id_filial: String(id_filial_rateio_item),
                            percentual: String(percentual_rateio_item),
                            id_centro_custo: item.id_centro_custo,
                            id_plano_conta: item.id_plano_conta,
                            valor: String(item.valor)
                        });
                    });
                };
            }
        }
    }

    return (
        <div className="p-3 bg-slate-200 dark:bg-blue-950 rounded-lg">
            <ModalItemRateio control={form.control} canEdit={canEdit} />
            <div className="flex gap-2 mb-3 items-center">
                <Divide />
                <span className="text-lg font-bold ">
                    Definição do rateio
                </span>
                <div className="ms-auto flex gap-3">
                    <BtnPadronizarAlocacao form={form} canEditItensRateio={canEditItensRateio} />
                    <RemoverItensRateio form={form} canEditItensRateio={canEditItensRateio} />
                    <BtnNovoItemRateio control={form.control} />
                </div>

            </div>
            <div>
                {errors.itens_rateio?.message && (
                    <Badge variant={"destructive"}>
                        <>{errors.itens_rateio?.message}</>
                    </Badge>
                )}
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
                        variant={"success"}
                    >
                        <Download size={18} className="me-2" /> Exportar
                        Padrão
                    </Button>

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
                            <Upload size={18} className="me-2" /> Importar
                            Rateio
                        </Button>
                    )}
                </div>
            </div>

            <div className="flex justify-between items-baseline mt-3">
                <span className="text-md font-medium">
                    Itens do rateio
                </span>
            </div>
            <div className="flex flex-col gap-3 mt-3 max-w-screen-md">
                <DataVirtualTableHeaderFixed
                    data={witens_rateio}
                    // @ts-ignore
                    columns={columns}
                />

                <div className="flex items-center gap-3">
                    <div className="mt-2 text-muted-foreground">
                        <span>Total: R$ </span>
                        {witens_rateio
                            .reduce((acc, curr) => {
                                return acc + parseFloat(curr.valor);
                            }, 0)
                            .toFixed(2)
                            .replace(".", ",")}
                    </div>
                    <div className="mt-2 text-muted-foreground">
                        <span>Percentual: </span>
                        {witens_rateio
                            .reduce((acc, curr) => {
                                let val = parseFloat(curr.percentual) * 100;
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