import { useMemo } from "react";

const columnsTitulos = useMemo(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <div className="px-1">
            <input
              type="checkbox"
              {...{
                checked: table.getIsAllRowsSelected(),
                indeterminate: table.getIsSomeRowsSelected().toString(),
                onChange: table.getToggleAllRowsSelectedHandler(),
              }}
            />
          </div>
        ),
        cell: ({ row }) => (
          <div className="px-1">
            <input
              type="checkbox"
              {...{
                checked: row.getIsSelected(),
                disabled: !row.getCanSelect(),
                indeterminate: row.getIsSomeSelected().toString(),
                onChange: row.getToggleSelectedHandler(),
              }}
            />
          </div>
        ),
      },
      {
        accessorKey: "id",
        header: "ID",
        cell: (info) => (<span className='font-semibold cursor-pointer text-blue-500' onClick={()=>setIdTitulo(info.getValue())}>{info.getValue()}</span>),
      },
      {
        header: "Status",
        accessorKey: "status",
        cell: (info) => {
          let status = info.getValue();
          let color = "";
          if (status === "Aprovado") {
            color = "text-green-500";
          } else if (status === "Pago") {
            color = "text-blue-500";
          } else if (status === "Negado") {
            color = "text-red-500";
          }
          return <span className={`${color}`}>{status}</span>;
        },
      },
      {
        header: "solicitação",
        accessorKey: "created_at",
        cell: (info) => {
          let data = info.getValue();
          return new Date(data).toLocaleString("pt-BR", { year: "numeric", month: "2-digit", day: "2-digit" });
        },
      },
      {
        header: "vencimento",
        accessorKey: "data_vencimento",
        cell: (info) => {
          let data = info.getValue();
          return new Date(data).toLocaleString("pt-BR", { year: "numeric", month: "2-digit", day: "2-digit" });
        },
      },
      {
        header: "Valor",
        accessorKey: "valor",
        cell: (info) => <span className="block text-right">{parseFloat(info.getValue()).toLocaleString("pt-BR", { useGrouping: true, minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>,
      },
      {
        accessorFn: (row) => row.descricao,
        id: "descricao",
        accessorKey: "descricao",
        cell: (info) => {
          let label = info.getValue();
          return (
            <div title={label} className="block truncate max-w-96">
              {label}
            </div>
          );
        },
        header: "Descrição",
        enableResizing: true,
        width: 1500,
      },
      {
        header: "Fornecedor",
        accessorKey: "fornecedor",
        cell: (info) => {
          let label = info.getValue();
          return (
            <div title={label} className="block truncate max-w-96">
              {label}
            </div>
          );
        },
      },
      {
        header: "solicitante",
        accessorKey: "solicitante",
        cell: (info) => {
          let label = info.getValue();
          return (
            <div title={label} className="block truncate max-w-96">
              {label}
            </div>
          );
        },
      },
    ],
    []
  );