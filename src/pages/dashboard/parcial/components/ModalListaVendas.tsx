import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ParcialData, RowParcial, VendaParcial } from "./context";
import { useMemo } from "react";
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type ModalListaVendasParcialProps = {
    title: string;
    hierarquia: 'filial' | 'vendedor',
    chave: string,
    data: ParcialData
}

const ModalListaVendasParcial = ({title, hierarquia, chave, data}: ModalListaVendasParcialProps) => {
    
    const columns = useMemo<ColumnDef<any>[]>(()=>[
        {
            accessorKey: 'uf',
            header: 'UF'
        },
        {
            accessorKey: 'filial',
            header: 'FILIAL'
        }
    ], [])

    const vendas: any = []
    // const vendas = data?.filter((venda:VendaParcial)=>{
    //     if(hierarquia == 'filial'){
    //         return venda.filial == chave
    //     }else{
    //         return venda.nomeVendedor == chave
    //     }
    // })

    const table = useReactTable({
        data: vendas || [],
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    return ( 
        <Dialog>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>
                <div>
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
                                        className="whitespace-nowrap"
                                    >
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                </div>
            </DialogContent>
        </Dialog>
     );
}
 
export default ModalListaVendasParcial;