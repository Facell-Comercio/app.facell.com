import { Column, createColumnHelper, ExpandedState, flexRender, getCoreRowModel, getExpandedRowModel, Row, useReactTable, VisibilityState } from "@tanstack/react-table";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CSSProperties, useMemo, useState } from "react";
import { ChevronDown, ChevronRight, List } from "lucide-react";
import { normalizeCurrency } from "@/helpers/mask";
import { formatDate } from "date-fns";
import { useParcialStore } from "./context";
import { api } from "@/lib/axios";

export type RowTableParcial = {
    uf: string;
    tipo:  'total' | 'agrupamento' | 'uf' | 'filial' | 'vendedor';
    nome: string;

    controle: number;
    pos: number;
    upgrade: number;
    receita: number;

    residenciais: number;
    live: number;
    portab: number;

    qtdeAparelho: number;
    aparelho: number;
    qtdeAcessorio: number;
    acessorio: number;
    qtdePitzi: number;
    pitzi: number;

    subRows: RowTableParcial[]
}

type ParcialTableProps = {
    data?: RowTableParcial[]
}

const ParcialTable = ({ data }: ParcialTableProps) => {
    
    const columnHelper = createColumnHelper<RowTableParcial>()

    const handleDetailClick = async (row: Row<RowTableParcial>)=>{
        try {
            const result = await api.get(`comercial/dashboard/parcial/detalhe`, { params: {range_data, tipo: row.original.tipo, chave: row.original.nome}});
            console.log(result.data);
            
        } catch (error) {
            
        }
        
    }

    const columns = useMemo(() => [
        columnHelper.accessor('nome', {
            header: ({ table }) => (
                <>
                    <button
                        {...{
                            onClick: table.getToggleAllRowsExpandedHandler(),
                        }}
                    >
                        {table.getIsAllRowsExpanded() ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                    </button>{' '}
                    LOJA/VENDEDOR
                </>
            ),
            cell: ({ row, getValue }) => (
                <div
                    style={{
                        // Since rows are flattened by default,
                        // we can use the row.depth property
                        // and paddingLeft to visually indicate the depth
                        // of the row
                        paddingLeft: `${row.depth * 1.5}rem`,
                    }}
                    className="whitespace-nowrap"
                >
                    <div className="flex  items-center">
                        {row.getCanExpand() ? (
                            <button
                                {...{
                                    onClick: row.getToggleExpandedHandler(),
                                    style: { cursor: 'pointer' },
                                }}
                            >
                                {row.getIsExpanded() ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                            </button>
                        ) : (
                            ''
                        )}{' '}
                        <span className="truncate max-w-32 sm:max-w-60 pe-10">{getValue<string>()}</span>
                        {' '}
                        <div className="ms-auto me-1 flex gap-1 absolute end-0 bg-background text-primary cursor-pointer">
                            <List 
                                size={18} 
                                onClick={(e)=>{
                                    e.stopPropagation();
                                    handleDetailClick(row)
                                }}
                            />
                        </div>
                    </div>
                </div>
            ),
        }),
        columnHelper.group({
            id: 'servicos',
            header: 'SERVIÇOS',
            columns: [
                columnHelper.accessor('controle', {
                    header: 'CONTROLE',
                    cell: info => info.getValue(),

                }),
                columnHelper.accessor('pos', {
                    header: 'VOZ',
                    cell: info => info.getValue(),
                }),
                columnHelper.accessor('upgrade', {
                    header: 'UPGRADE',
                    cell: info => info.getValue(),
                }),
                columnHelper.accessor('receita', {
                    header: 'RECEITA',
                    cell: info => normalizeCurrency(info.getValue()),
                }),
            ],

        }),
        columnHelper.group({
            id: 'outros_servicos',
            header: 'MULTI SERVIÇOS',
            columns: [
                columnHelper.accessor('residenciais', {
                    header: 'RESIDENCIAIS',
                    cell: info => info.getValue(),

                }),
                columnHelper.accessor('live', {
                    header: 'LIVE',
                    cell: info => info.getValue(),
                }),
                columnHelper.accessor('portab', {
                    header: 'PORTAB',
                    cell: info => info.getValue(),
                }),
            ],
        }),
        columnHelper.group({
            id: 'produtos',
            header: 'PRODUTOS',
            columns: [
                columnHelper.accessor('qtdeAparelho', {
                    header: 'QTD.APA',
                    cell: info => info.getValue(),

                }),
                columnHelper.accessor('aparelho', {
                    header: 'APARELHO',
                    cell: info => normalizeCurrency(info.getValue()),
                }),
                columnHelper.accessor('qtdeAcessorio', {
                    header: 'QTD.ACE',
                    cell: info => info.getValue(),
                }),
                columnHelper.accessor('acessorio', {
                    header: 'ACESSORIO',
                    cell: info => normalizeCurrency(info.getValue()),
                }),
                columnHelper.accessor('qtdePitzi', {
                    header: 'QTD.PITZI',
                    cell: info => info.getValue(),
                }),
                columnHelper.accessor('pitzi', {
                    header: 'PITZI',
                    cell: info => normalizeCurrency(info.getValue()),
                }),
            ],
        })
    ], [data])


    // Importante para o congelamento da primeira coluna:
    const [expanded, setExpanded] = useState<ExpandedState>({});

    const getCommonPinningStyles = (column: Column<RowTableParcial>): CSSProperties => {
        
        const isPinned = column.getIsPinned()
        const isLastLeftPinnedColumn =
            isPinned === 'left' && column.getIsLastColumn('left')
        const isFirstRightPinnedColumn =
            isPinned === 'right' && column.getIsFirstColumn('right')

        return {
            boxShadow: isLastLeftPinnedColumn
                ? '-4px 0 4px -4px gray inset'
                : isFirstRightPinnedColumn
                    ? '4px 0 4px -4px gray inset'
                    : undefined,
            left: isPinned === 'left' ? `${column.getStart('left')}px` : undefined,
            right: isPinned === 'right' ? `${column.getAfter('right')}px` : undefined,
            opacity: 1,
            position: isPinned ? 'sticky' : 'relative',
            // backgroundColor: isPinned ? ' hsl(var(--background)) ' : '',
            width: column.getSize(),
            zIndex: isPinned ? 1 : 0,
            textAlign: isPinned ? 'left' : 'center',
        }
    }
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})

    const table = useReactTable({
        data: data || [],
        columns,
        state: {
            expanded,
            columnVisibility,
            columnPinning: {
                left: [
                    'nome'
                ]
            },
        },
        columnResizeMode: 'onChange',
        columnResizeDirection: 'ltr',
        onColumnVisibilityChange: setColumnVisibility,
        onExpandedChange: setExpanded,
        getSubRows: useMemo(() => (row: RowTableParcial) => row.subRows || [], []),
        getCoreRowModel: getCoreRowModel(),
        getExpandedRowModel: getExpandedRowModel(),
    })

    // Geração de feedback de período selecionado:
    const range_data = useParcialStore(state => state.range_data)
    const { from, to } = range_data || {};
    let periodo = ''
    if (from && to && formatDate(from, 'dMyy') == formatDate(to, 'dMyy')) {
        if (formatDate(from, 'dMyy') == formatDate(new Date(), 'dMyy')) {
            periodo = formatDate(new Date(), 'dd/MM/yyyy HH:mm')
        } else {
            periodo = formatDate(from, 'dd/MM/yyyy')
        }
    } else if (from && to) {
        periodo = `DE ${formatDate(from, 'dd/MM/yyyy')} ATÉ ${formatDate(to, 'dd/MM/yyyy')}`
    } else if (from) {
        if (formatDate(from, 'dMyy') == formatDate(new Date(), 'dMyy')) {
            periodo = formatDate(new Date(), 'dd/MM/yyyy HH:mm')
        } else {
            periodo = formatDate(from, 'dd/MM/yyyy')
        }
    } else if (to) {
        periodo = formatDate(to, 'dd/MM/yyyy')
    } else {
        periodo = formatDate(new Date(), 'dd/MM/yyyy HH:mm')
    }

    return (
        <Card>
            <CardContent className="py-3 flex flex-col gap-3">
                <div className="flex gap-2 items-center">
                    <h2 className="text-lg font-bold">Parcial de vendas</h2>
                    <h5 className="text-xs text-muted-foreground">{periodo}</h5>
                </div>

                {/* Toggle Columns */}
                <div className="flex gap-2 border shadow rounded p-2 overflow-auto scroll-thin text-xs text-muted-foreground">
                    {table.getAllLeafColumns().map((column, idx) => {
                        if (idx === 0) {
                            return null;
                        }
                        return (
                            <div key={column.id} className="px-1 whitespace-nowrap">
                                <label>
                                    <input
                                        {...{
                                            type: 'checkbox',
                                            checked: column.getIsVisible(),
                                            onChange: column.getToggleVisibilityHandler(),
                                        }}
                                    />{' '}
                                    {typeof column.columnDef.header !== 'string' ? column.id.toUpperCase() : column.columnDef.header}
                                </label>
                            </div>
                        )
                    })}
                </div>

                <Table className="text-xs ">
                    <TableHeader
                        className={`sticky z-[3] top-0 bg-background`}
                    >
                        {table.getHeaderGroups().map(headerGroup => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead
                                        scope="col"
                                        key={header.id}
                                        colSpan={header.colSpan}
                                        style={{ ...getCommonPinningStyles(header.column) }}
                                        className="bg-background"
                                    >
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows.map(row => (
                            <TableRow key={row.id}>
                                {row.getVisibleCells().map(cell => (
                                    <TableCell
                                        key={cell.id}
                                        // * Importante para o sticky column:
                                        style={{ ...getCommonPinningStyles(cell.column) }}
                                        className={`whitespace-nowrap ${cell.row.original.tipo == 'total' ? ' bg-secondary ' : ' bg-background '} `}

                                    >
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

            </CardContent>
        </Card>
    );
}

export default ParcialTable;