import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Input, InputWithLabel } from "@/components/custom/FormInput";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DialogDescription } from "@radix-ui/react-dialog";
import { Ban, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { useStoreCampanha } from "../store";

type Vendedor = {
  index: string;
  nome: string;
  qtde_clientes: string;
};

const ModalDefinirVendedores = () => {
  const [qtde_clientes, modalOpen, closeModal] = useStoreCampanha((state) => [
    state.qtde_clientes,
    state.modalDefinirVendedoresOpen,
    state.closeModalDefinirVendedores,
  ]);

  const [vendedores, setVendedores] = useState<Vendedor[]>([]);

  const [qntdVendedores, setQntdVendedores] = useState<string>("1");

  // Função para distribuir clientes igualmente entre os vendedores
  const distribuirClientes = (totalClientes: number, numVendedores: number) => {
    const baseClientesPorVendedor = Math.floor(totalClientes / numVendedores);
    const sobra = totalClientes % numVendedores;

    return Array.from({ length: numVendedores }, (_, index) => ({
      index: String(index),
      nome: `Vendedor ${index + 1}`,
      qtde_clientes: String(baseClientesPorVendedor + (index === numVendedores - 1 ? sobra : 0)),
    }));
  };

  // Efeito para recalcular a distribuição toda vez que numVendedores mudar
  useEffect(() => {
    const novaDistribuicao = distribuirClientes(
      parseInt(qtde_clientes || "0"),
      parseInt(qntdVendedores)
    );
    setVendedores(novaDistribuicao);
  }, [qntdVendedores, qtde_clientes]);

  useEffect(() => {
    if (!modalOpen) {
      setQntdVendedores("1");
    }
  }, [modalOpen]);

  // Função para atualizar nome e quantidade de clientes do vendedor
  const atualizarVendedor = (index: string, campo: string, valor: string) => {
    setVendedores((vendedores) =>
      vendedores.map((vendedor) =>
        vendedor.index === index ? { ...vendedor, [campo]: valor } : vendedor
      )
    );
  };

  function handleClickCancel() {
    closeModal();
  }
  return (
    <Dialog open={modalOpen} onOpenChange={() => handleClickCancel()}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Definir Vendedores:</DialogTitle>
          <DialogDescription className="hidden"></DialogDescription>
        </DialogHeader>
        <ScrollArea className="flex p-1 gap-2 max-h-[70vh]">
          <section className="flex gap-2 flex-col">
            <div className="flex gap-3 p-1 w-full">
              <InputWithLabel
                type="number"
                label="Quantidade de Vendedores:"
                value={qntdVendedores}
                onChange={(e) => setQntdVendedores(e.target.value)}
                step="1"
                min={1}
                className="flex-1"
              />
              <InputWithLabel
                label="Quantidade Total de Clientes:"
                value={qtde_clientes || ""}
                readOnly
                className="flex-1"
              />
            </div>
            <Table divClassname="bg-background rounded-md border">
              <TableHeader className="bg-secondary">
                <TableRow>
                  <TableHead className="text-foreground">Nome Vendedor</TableHead>
                  <TableHead className="text-foreground">Quantidade de Clientes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vendedores.map((vendedor, index) => (
                  <TableRow
                    key={`vendedor_${index}`}
                    className="border bg-secondary/40 odd:bg-secondary/60"
                  >
                    <TableCell>
                      <Input
                        value={vendedor.nome}
                        onChange={(e) => atualizarVendedor(vendedor.index, "nome", e.target.value)}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={vendedor.qtde_clientes}
                        onChange={(e) =>
                          atualizarVendedor(vendedor.index, "qtde_clientes", e.target.value)
                        }
                        type="number"
                        min={1}
                        step={"1"}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </section>
        </ScrollArea>
        <DialogFooter className="flex gap-1 items-end flex-wrap">
          <Button variant={"secondary"} onClick={handleClickCancel}>
            <Ban size={18} className="me-2" />
            Fechar
          </Button>
          <Button onClick={() => console.log("SALVANDO")}>
            <Save size={18} className="me-2" />
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalDefinirVendedores;
