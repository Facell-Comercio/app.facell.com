import SearchComponent from "@/components/custom/SearchComponent";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useCadastros } from "@/hooks/marketing/useCadastros";
import { useState } from "react";

interface IModalVendedores {
  open: boolean;
  handleSelection: (item: ItemVendedor) => void;
  onOpenChange: () => void;
  closeOnSelection?: boolean;
}

export type ItemVendedor = {
  nome: string;
  id: string;
};

const ModalVendedores = ({
  open,
  handleSelection,
  onOpenChange,
  closeOnSelection,
}: IModalVendedores) => {
  const [search, setSearch] = useState<string>("");

  const { data, isError, refetch } = useCadastros().getAllVendedores({
    filters: { termo: search, active: 1 },
  });

  async function handleSearch(searchText: string) {
    await new Promise((resolve) => {
      setSearch(searchText);
      resolve(true);
    });
    refetch();
  }

  function pushSelection(item: ItemVendedor) {
    handleSelection(item);

    if (closeOnSelection) {
      onOpenChange();
    }
  }

  if (isError) return null;
  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[1000px]">
        <DialogHeader>
          <DialogTitle>Vendedores</DialogTitle>
          <DialogDescription>Selecione um ao clicar no botão à direita.</DialogDescription>

          <SearchComponent handleSearch={handleSearch} />
        </DialogHeader>

        <div className="grid gap-1 w-full max-h-[50vh] overflow-auto scroll-thin">
          {data &&
            data.rows.map((data: any, index: number) => (
              <div
                key={`${index} - ${data.nome}`}
                className="flex justify-between odd:bg-secondary/60 even:bg-secondary/40 rounded-sm px-2 py-1"
              >
                <span className="uppercase">{data.nome}</span>
                <span>
                  <Button size={"xs"} onClick={() => pushSelection(data)}>
                    Selecionar
                  </Button>
                </span>
              </div>
            ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ModalVendedores;
