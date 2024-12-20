import { Button } from "@/components/ui/button";
import { Ellipsis } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Shirt, Handshake, HandCoins, ArrowRightLeft } from "lucide-react";
import { useStoreEstoque } from "./Store";
import { RowEstoque } from "../table/columns-estoque";
import { useStoreConcederVenderFardamento } from "./conceder-fardamento/Store";

const openModal = useStoreEstoque.getState().openModal;
const  addItem  = useStoreConcederVenderFardamento.getState().addItem;
interface DropdownProps {
  data: RowEstoque; // A propriedade 'id' recebida do componente pai
}

export const Dropdown = ({ data }: DropdownProps) => {
  const handleOpenModal = () => {
    openModal(data.id);
  };
  const handleConceder = () => {
    addItem({ ...data, qtde: 0 });
    console.log('foi');
  };

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger>
        <span>
          {" "}
          <Ellipsis />{" "}
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>
          <Button
            className="mx-auto w-full"
            variant={"default"}
            size={"sm"}
            onClick={handleOpenModal}
          >
            <Shirt size={12} className="mr-2" />
            Abastecer
          </Button>
        </DropdownMenuItem>
        {!!data.permite_concessao && (
          <DropdownMenuItem>
            <Button
              className="mx-auto w-full"
              variant={"destructive"}
              size={"sm"}
              onClick={handleConceder}
            >
              <Handshake size={12} className="mr-2" />
              Conceder
            </Button>
          </DropdownMenuItem>
        )}
        {data.preco > 0 && (
          <DropdownMenuItem>
            <Button className="mx-auto w-full" variant={"success"} size={"sm"}>
              <HandCoins size={12} className="mr-2" />
              Vender
            </Button>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem>
          <Button className="mx-auto w-full" variant={"secondary"} size={"sm"}>
            <ArrowRightLeft size={12} className="mr-2" />
            Remanejar
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
