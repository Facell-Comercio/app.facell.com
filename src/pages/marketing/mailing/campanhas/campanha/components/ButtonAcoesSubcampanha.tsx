import ButtonMotivation from "@/components/custom/ButtonMotivation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowDownUp, Menu, Smartphone, Trash, UserPen, X } from "lucide-react";
import { FaSpinner } from "react-icons/fa6";
import { useStoreCampanha } from "../store";
import ButtonExportSubcampanhas from "./ButtonExportarEvolux";

// @ts-ignore
const ButtonAcoesSubcampanha = ({
  canEdit,
  disabledSubcampanha,
  qtdeClientesSubcampanha,
  idSubcampanha,
  nomeSubcampanha,
  qtdeAllClientesSubcampanha,
  setIdSubcampanha,
  setCampanhaData,
  deleteSubcampanha,
  deleteClientesSubcampanhaLote,
  deleteClientesSubcampanhaLoteIsPending,
  deleteSubcampanhaIsPending,
}: {
  canEdit: boolean;
  disabledSubcampanha: boolean;
  qtdeClientesSubcampanha: string;
  idSubcampanha: string;
  nomeSubcampanha: string;
  qtdeAllClientesSubcampanha: string;
  setIdSubcampanha: (param: any) => void;
  setCampanhaData: (param: any) => void;
  deleteSubcampanha: (param: any) => void;
  deleteClientesSubcampanhaLote: (param: any) => void;
  deleteClientesSubcampanhaLoteIsPending: boolean;
  deleteSubcampanhaIsPending: boolean;
}) => {
  const [
    openModalNovaSubcampanha,
    openModalDefinirAparelho,
    openModalDefinirVendedores,
    filters_lote,
  ] = useStoreCampanha((state) => [
    state.openModalNovaSubcampanha,
    state.openModalDefinirAparelho,
    state.openModalDefinirVendedores,
    state.filters_lote,
  ]);

  return (
    <DropdownMenu modal>
      <DropdownMenuTrigger type="button" asChild>
        <Button disabled={disabledSubcampanha}>
          <Menu className="me-2" size={18} /> Ações
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="flex flex-col">
        {canEdit && (
          <>
            <DropdownMenuItem className="flex gap-2 p-1">
              <Button
                variant={"tertiary"}
                className="w-full"
                onClick={(e) => {
                  e.preventDefault();
                  openModalDefinirVendedores(qtdeClientesSubcampanha);
                }}
                disabled={disabledSubcampanha}
              >
                <UserPen className="me-2" size={18} /> Definir Vendedores
              </Button>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex gap-2 p-1">
              <Button
                variant={"warning"}
                className="w-full"
                onClick={(e) => {
                  e.preventDefault();
                  openModalDefinirAparelho(qtdeClientesSubcampanha);
                }}
                disabled={disabledSubcampanha}
              >
                <Smartphone className="me-2" size={18} /> Definir Aparelhos
              </Button>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex gap-2 p-1">
              <Button
                variant={"warning"}
                className="w-full"
                onClick={(e) => {
                  e.preventDefault();
                  openModalNovaSubcampanha(qtdeClientesSubcampanha, "subcampanha");
                }}
                disabled={disabledSubcampanha}
              >
                <ArrowDownUp className="me-2" size={18} /> Transferir Clientes
              </Button>
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuItem className="flex gap-2 p-1">
          <ButtonExportSubcampanhas disabled={disabledSubcampanha} />
        </DropdownMenuItem>
        {canEdit && (
          <>
            <DropdownMenuItem className="flex gap-2 p-1">
              <ButtonMotivation
                title="Retorna os clintes para fora da subcampanha..."
                variant={"destructive"}
                action={() => {
                  if (qtdeAllClientesSubcampanha === qtdeClientesSubcampanha) {
                    setIdSubcampanha("");
                  }
                  setCampanhaData({
                    qtde_clientes: qtdeClientesSubcampanha,
                    qtde_all_clientes: qtdeAllClientesSubcampanha,
                  });
                  deleteClientesSubcampanhaLote({
                    id_campanha: idSubcampanha || "",
                    filters: filters_lote,
                  });
                }}
                headerTitle="Remover Clientes"
                description={`Digite "${String(nomeSubcampanha)
                  .trim()
                  .toUpperCase()
                  .replaceAll("  ", " ")}" para poder remover os clientes desta subcampanha`}
                placeholder={nomeSubcampanha?.trim().toUpperCase()}
                disabled={disabledSubcampanha}
                equalText
                className="min-w-full"
                stopPropagation
              >
                {deleteClientesSubcampanhaLoteIsPending ? (
                  <>
                    <FaSpinner size={18} className="me-2 animate-spin" />
                    Removendo...
                  </>
                ) : (
                  <>
                    <X className="me-2" size={18} /> Remover Clientes
                  </>
                )}
              </ButtonMotivation>
            </DropdownMenuItem>

            <DropdownMenuItem className="flex gap-2 p-1">
              <ButtonMotivation
                title="Exclui a subcampanha e retorna os clintes para fora dela..."
                variant={"destructive"}
                action={() => {
                  setIdSubcampanha("");
                  deleteSubcampanha(idSubcampanha);
                }}
                headerTitle="Excluir subcampanha"
                description={`Digite "${String(nomeSubcampanha)
                  .trim()
                  .toUpperCase()}" para poder excluir a subcampanha`}
                placeholder={nomeSubcampanha?.trim().toUpperCase()}
                disabled={disabledSubcampanha}
                equalText
                className="w-full"
                stopPropagation
              >
                {deleteSubcampanhaIsPending ? (
                  <>
                    <FaSpinner size={18} className="me-2 animate-spin" />
                    Excluindo...
                  </>
                ) : (
                  <>
                    <Trash className="me-2" size={18} /> Excluir Subcampanha
                  </>
                )}
              </ButtonMotivation>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ButtonAcoesSubcampanha;
