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
import { toast } from "@/components/ui/use-toast";
import { useMailing } from "@/hooks/marketing/useMailing";
import ModalVendedores, {
  ItemVendedor,
} from "@/pages/marketing/mailing/components/ModalVendedores";
import { DialogDescription } from "@radix-ui/react-dialog";
import { Ban, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa6";
import { FiltersCampanha, useStoreCampanha } from "../../store";

type Vendedor = {
  index: string;
  nome: string;
  qtde_clientes: string;
};

export type DefinirVendedoresProps = {
  id_campanha?: string;
  vendedores?: Vendedor[];
  filters: FiltersCampanha;
};

const ModalDefinirVendedores = () => {
  const [qtde_clientes, modalOpen, closeModal, isPending, setIsPending, filters] = useStoreCampanha(
    (state) => [
      state.qtde_clientes,
      state.modalDefinirVendedoresOpen,
      state.closeModalDefinirVendedores,

      state.isPending,
      state.setIsPending,
      state.filters_lote,
    ]
  );

  const [vendedores, setVendedores] = useState<Vendedor[]>([]);
  const [qntdVendedores, setQntdVendedores] = useState<string>("1");
  const [modalVendedoresOpen, setModalVendedoresOpen] = useState(false);
  const [index, setIndex] = useState("");

  // Função para distribuir clientes igualmente entre os vendedores
  const distribuirClientes = (totalClientes: number, numVendedores: number) => {
    const baseClientesPorVendedor = Math.floor(totalClientes / numVendedores);
    const sobra = totalClientes % numVendedores;

    return Array.from({ length: numVendedores }, (_, index) => ({
      index: String(index),
      nome: "",
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

  const {
    mutate: definirVendedores,
    isPending: definirVendedoresIsPending,
    isError: definirVendedoresIsError,
    isSuccess: definirVendedoresIsSuccess,
  } = useMailing().definirVendedores();

  useEffect(() => {
    if (definirVendedoresIsPending) {
      setIsPending(true);
    }
    if (definirVendedoresIsSuccess) {
      closeModal();
      setIsPending(false);
    }
    if (definirVendedoresIsError) {
      setIsPending(false);
    }
  }, [definirVendedoresIsPending]);

  function handleSubmit() {
    const totalClientesComVendedores = vendedores.reduce(
      (acc, vendedor) => acc + parseInt(vendedor.qtde_clientes),
      0
    );
    const vendedoresInvalidos = vendedores.filter((vendedor) => !vendedor.nome);
    if (vendedoresInvalidos.length > 0) {
      toast({
        title: "Atenção!",
        description: "Há vendedores sem nome",
        variant: "warning",
      });
      return;
    }

    if (totalClientesComVendedores !== parseInt(qtde_clientes || "0")) {
      const divergencia = totalClientesComVendedores - parseInt(qtde_clientes || "0");
      const description =
        divergencia > 0
          ? `Há ${Math.abs(divergencia)} cliente(s) a mais distribuidos entre os vendedores`
          : `Ainda resta distribuir ${Math.abs(divergencia)} cliente(s) entre os vendedores`;
      toast({
        title: "Atenção!",
        description,
        variant: "warning",
      });
      return;
    }

    definirVendedores({ vendedores, id_campanha: filters.id_campanha, filters });
  }
  function handleSelection(vendedor: ItemVendedor) {
    atualizarVendedor(index, "nome", String(vendedor.nome).toUpperCase());
    setIndex("");
  }
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
                        readOnly
                        onClick={() => {
                          setModalVendedoresOpen(true);
                          setIndex(vendedor.index);
                        }}
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
        <ModalVendedores
          open={modalVendedoresOpen}
          onOpenChange={() => setModalVendedoresOpen(false)}
          handleSelection={handleSelection}
          closeOnSelection
        />

        <DialogFooter className="flex gap-1 items-end justify-end flex-wrap w-full flex-row">
          <Button variant={"secondary"} onClick={handleClickCancel} disabled={isPending}>
            <Ban size={18} className="me-2" />
            Fechar
          </Button>
          <Button onClick={handleSubmit} disabled={isPending}>
            {isPending ? (
              <>
                <FaSpinner size={16} className="animate-spin me-2" /> Salvando...
              </>
            ) : (
              <>
                <Save size={18} className="me-2" />
                Salvar
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalDefinirVendedores;
