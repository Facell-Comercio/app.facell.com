import { ColumnDef } from '@tanstack/react-table';
import { ReactNode } from 'react';

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type RowMovimentoContabil = {
  select: ReactNode;
  id: string;
  descricao: string;
  banco: string;
  tipo: string;
  grupo_economico: string;
  filial: string;
};

export const columnsTable: ColumnDef<RowMovimentoContabil>[] = [
  // {
  //   id: "select",
  //   header: ({ table }) => (
  //     <div className="px-1">
  //       <Checkbox
  //         checked={
  //           table.getIsAllPageRowsSelected() ||
  //           (table.getIsSomePageRowsSelected() && "indeterminate")
  //         }
  //         onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //       />
  //     </div>
  //   ),
  //   enableSorting: false,
  //   cell: ({ row }) => (
  //     <div className="flex items-center justify-center">
  //       <Checkbox
  //         {...{
  //           checked: row.getIsSelected(),
  //           disabled: !row.getCanSelect(),
  //           indeterminate: row.getIsSomeSelected().toString(),
  //           onCheckedChange: row.getToggleSelectedHandler(),
  //         }}
  //       />
  //     </div>
  //   ),
  // },
  {
    header: 'DESCRIÇÃO',
    accessorKey: 'descricao',
    cell: (info) => {
      const descricao = info.getValue<string>();
      return <span>{descricao && descricao.toUpperCase()}</span>;
    },
  },
  {
    header: 'BANCO',
    accessorKey: 'banco',
    cell: (info) => {
      const banco = info.getValue<string>() || 0;
      return <span>{banco && banco.toUpperCase()}</span>;
    },
  },
  {
    header: 'TIPO',
    accessorKey: 'tipo',
    cell: (info) => {
      const tipo = info.getValue<string>() || 0;
      return <span>{tipo}</span>;
    },
  },
  {
    header: 'GRUPO ECONÔMICO',
    accessorKey: 'grupo_economico',
    cell: (info) => {
      const grupo_economico = info.getValue<string>() || 0;
      return <span>{grupo_economico && grupo_economico.toUpperCase()}</span>;
    },
  },
  {
    header: 'FILIAL',
    accessorKey: 'filial',
    cell: (info) => {
      const filial = info.getValue<string>() || 0;
      return <span>{filial && filial.toUpperCase()}</span>;
    },
  },
];
