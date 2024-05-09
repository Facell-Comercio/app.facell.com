import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
// import { useStoreTitulo } from "./store-titulo";

import AlertPopUp from "@/components/custom/AlertPopUp";
import ModalButtons from "@/components/custom/ModalButtons";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { checkUserPermission } from "@/helpers/checkAuthorization";
import { useConciliacaoCP } from "@/hooks/financeiro/useConciliacaoCP";
// import { useStoreConciliacaoCP } from "@/pages/financeiro/extratos-bancarios/conciliacao/conciliacaocp/store";
import { Trash } from "lucide-react";
import { useEffect, useRef } from "react";
import FormConciliacaoCP from "./Form";
import { useStoreConciliacaoCP } from "./store";

export type TitulosPropsConciliacao = {
  id_titulo: string;
  num_doc?: string;
  valor: string;
  nome_fornecedor?: string;
  descricao?: string;
  filial?: string;
  checked?: boolean;
};

export type ConciliacaoCPSchemaProps = {
  id: string;
  descricao?: string;
  conta_bancaria?: string;
  id_transacao?: string;
  documento?: string;
  data_transacao?: string;
  valor?: string;
  conciliado?: string;
  usuario?: string;
  id_matriz?: string;
  titulos: TitulosPropsConciliacao[];
};

const initialPropsConciliacaoCP: ConciliacaoCPSchemaProps = {
  id: "",
  descricao: "",
  conta_bancaria: "",
  id_transacao: "",
  documento: "",
  data_transacao: "",
  valor: "",
  conciliado: "",
  usuario: "",
  id_matriz: "",
  titulos: [],
};

const ModalConciliacaoCP = () => {
  const modalOpen = useStoreConciliacaoCP().modalOpen;

  const toggleModal = useStoreConciliacaoCP().toggleModal;

  const editModal = useStoreConciliacaoCP().editModal;
  const modalEditing = useStoreConciliacaoCP().modalEditing;
  const id = useStoreConciliacaoCP().id;
  const formRef = useRef(null);
  const isMaster = checkUserPermission("MASTER");

  const { data, isLoading } = useConciliacaoCP().getOne(id);
  const { mutate: deleteConciliacaoCP } =
    useConciliacaoCP().deleteConciliacaoCP();
  const newData: ConciliacaoCPSchemaProps & Record<string, any> =
    {} as ConciliacaoCPSchemaProps & Record<string, any>;

  for (const key in data?.data) {
    if (typeof data?.data[key] === "number") {
      newData[key] = String(data?.data[key]);
    } else if (data?.data[key] === null) {
      newData[key] = "";
    } else {
      newData[key] = data?.data[key];
    }
  }

  // ^ Observar se não ocorrerá nenhum erro com essa "gambiarra"
  if (newData.titulos && newData.titulos.length > 0) {
    const newTitulos = newData.titulos.map(
      (titulo: TitulosPropsConciliacao) => {
        return {
          id_titulo: titulo.id_titulo,
          num_doc: titulo.num_doc || "",
          valor: titulo.valor,
          nome_fornecedor: titulo.nome_fornecedor,
          descricao: titulo.descricao,
          filial: titulo.filial,
          checked: titulo.checked,
        };
      }
    );

    if (newTitulos[0].id_titulo) {
      newData.titulos = newTitulos;
    } else {
      newData.titulos = [];
    }
  }

  // function handleSelectionConciliacaoCPs(item: ConciliacaoCPProps) {
  //   if (checkedTitulos.length) {
  //     const transferredData = {
  //       new_id: item.id,
  //       titulos: checkedTitulos,
  //     };
  //     transferTitulos(transferredData);
  //     toggleModal();
  //   } else {
  //     toast({
  //       title: "Nenhum título foi selecionado",
  //       duration: 3000,
  //       description:
  //         "Para realizar a tranferência de títulos é necessário selecionar alguns",
  //     });
  //   }
  //   // toggleGetTitulo(false);
  //   toggleModalConciliacaoCPs();
  // }

  function handleClickCancel() {
    editModal(false);
  }

  function excluirConciliacaoCP() {
    deleteConciliacaoCP({ id, titulos: data?.data.titulos });
    toggleModal();
  }

  const isConciliado = !!parseInt(newData?.conciliado || "");
  useEffect(() => {
    console.log("TESTANDO", !isConciliado, isMaster);

    if (!isConciliado && isMaster) {
      editModal(true);
      console.log("Editando");
    }
  }, [newData?.conciliado]);

  console.log("Modal editando", modalEditing);

  return (
    <Dialog open={modalOpen} onOpenChange={toggleModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{id ? `Borderô: ${id}` : "Novo Borderô"}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh]">
          {modalOpen && !isLoading ? (
            <FormConciliacaoCP
              id={id}
              data={newData.id ? newData : initialPropsConciliacaoCP}
              formRef={formRef}
            />
          ) : (
            <div className="w-full min-h-full p-2 grid grid-rows-4 gap-3">
              <Skeleton className="w-full row-span-1" />
              <Skeleton className="w-full row-span-3" />
            </div>
          )}
        </ScrollArea>
        <DialogFooter>
          <ModalButtons
            id={id}
            modalEditing={isMaster ? modalEditing : !isConciliado}
            edit={() => editModal(true)}
            cancel={handleClickCancel}
            formRef={formRef}
            blockEdit={isMaster ? false : isConciliado}
            blockCancel={isMaster && !isConciliado}
          >
            {isMaster && (
              <div className="flex gap-2">
                <AlertPopUp
                  title={"Deseja realmente excluir"}
                  description="Essa ação não pode ser desfeita. O borderô será excluído definitivamente do servidor."
                  action={() => {
                    excluirConciliacaoCP();
                  }}
                >
                  <Button
                    type={"button"}
                    size="lg"
                    variant={"destructive"}
                    className={`text-white justify-self-start ${
                      !modalEditing && "hidden"
                    }`}
                  >
                    <Trash className="me-2" />
                    Excluir Borderô
                  </Button>
                </AlertPopUp>
              </div>
            )}
          </ModalButtons>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalConciliacaoCP;
