import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useApi } from "@/hooks/use-api";
import { useQuery } from "@tanstack/react-query";
import FormTituloPagar from "./form-titulo";
import { useTituloStore } from "./store-titulo";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

const TituloPagarModal = () => {
  const { id_titulo, modalTituloOpen, setModalTituloOpen } = useTituloStore((state) => ({
    id_titulo: state.id_titulo,
    modalTituloOpen: state.modalTituloOpen,
    setModalTituloOpen: state.setModalTituloOpen,
  }));
  // Buscar os dados do titulo e passar para o form

  useEffect(() => {
    if (id_titulo !== "Novo") {
      // Buscar os dados do título quando o componente for montado
      refetchTitulo();
    }
  }, [id_titulo]);

  const {
    data,
    isLoading,
    refetch: refetchTitulo,
  } = useQuery({
    queryKey: [`fin_cp_titulos:${id_titulo}`],
    queryFn: () => useApi().financeiro.contasPagar.fetchTitulo({ id: id_titulo }),
    enabled: id_titulo !== "Novo",
  });

  return (
    <Dialog open={modalTituloOpen} onOpenChange={() => setModalTituloOpen({ open: false })} modal="true">
      <DialogContent className="w-full lg:w-[80vw] xl:max-w-[80vw] p-2 sm:p-5 h-screen overflow-hidden backdrop-blur-sm">
        <DialogHeader>
          <DialogTitle>{id_titulo === "Novo" ? "Novo titulo" : `Titulo: ${id_titulo}`}</DialogTitle>
        </DialogHeader>

        <FormTituloPagar data={data} />
      <DialogFooter>
        <Button type="submit" size="lg">
          <Save className="me-2" />
          Salvar
        </Button>
      </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TituloPagarModal;
