import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ColumnDef } from "@tanstack/react-table";
import { UserSearch } from "lucide-react";
import { ReactNode } from "react";
import { useStoreUser } from "../user/store";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type RowUsers = {
  select: ReactNode;
  id: string;
  img_url?: string;
  nome: string;
};

const openModal = useStoreUser.getState().openModal;

export const columnsTableUsers: ColumnDef<RowUsers>[] = [
  {
    accessorKey: "id",
    header: "AÇÃO",
    enableSorting: false,
    cell: (info) => (
      <span
        className="font-semibold cursor-pointer text-blue-500"
        onClick={() => openModal(info.getValue<number>())}
      >
        {<UserSearch />}
      </span>
    ),
    sortDescFirst: true,
  },
  {
    header: "IMAGEM",
    accessorKey: "img_url",
    enableSorting: false,
    cell: (info) => {
      return (
        <Avatar>
          <AvatarImage src={`${info.getValue() || ""}`} alt="Usuário" />
          <AvatarFallback></AvatarFallback>
        </Avatar>
      );
    },
  },
  {
    header: "NOME",
    accessorKey: "nome",
    cell: (info) => {
      const nome = info.getValue<string>();
      return <span>{nome}</span>;
    },
  },
];
