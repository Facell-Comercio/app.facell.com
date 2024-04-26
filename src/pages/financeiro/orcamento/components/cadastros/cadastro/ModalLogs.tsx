import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
// import { useStoreTitulo } from "./store-titulo";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useOrcamento } from "@/hooks/useOrcamento";
import { Search } from "lucide-react";
import { useRef, useState } from "react";
import RowVirtualizerLogs from "./RowVirtualizedLogs";
import { useStoreCadastro } from "./store";

const data = new Date();

const ano = data.getFullYear();
const mes = String(data.getMonth() + 1).padStart(2, "0"); // Adiciona um zero à esquerda se o mês for menor que 10
const dia = String(data.getDate()).padStart(2, "0"); // Adiciona um zero à esquerda se o dia for menor que 10

export const dataFormatada = `${ano}-${mes}-${dia}`;

export type LogsProps = {
  nome: string;
  descricao: string;
  created_at: string;
};

const ModalLogs = () => {
  const [filter, setFilter] = useState("");
  const modalLogsOpen = useStoreCadastro().modalLogsOpen;
  const closeLogsModal = useStoreCadastro().closeLogsModal;

  const id = useStoreCadastro().id;

  const searchRef = useRef<HTMLInputElement | null>(null);
  const { data, isLoading } = useOrcamento().getLogs(id);
  const newData = data?.data.rows
    .map((data: LogsProps) => data)
    .filter(
      (data: LogsProps) =>
        data.nome.includes(filter.toUpperCase()) ||
        data.descricao.includes(filter.toUpperCase())
    );
  function handleClickCancel() {
    closeLogsModal();
  }

  return (
    <div>
      <Dialog open={modalLogsOpen} onOpenChange={closeLogsModal}>
        <DialogContent>
          <section className="flex flex-col gap-3 max-h-[80vh]">
            <span className="text-lg font-medium">{`Histórico de alterações: ${id}`}</span>
            <div className="flex gap-3">
              <Input
                ref={searchRef}
                type="search"
                placeholder="Pesquisar..."
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setFilter(searchRef.current?.value || "");
                  }
                }}
              />
              <Button
                variant={"tertiary"}
                onClick={() => setFilter(searchRef.current?.value || "")}
              >
                <Search className="me-2" />
                Procurar
              </Button>
            </div>
            {modalLogsOpen && !isLoading ? (
              <RowVirtualizerLogs data={newData} />
            ) : (
              <p>Carregando...</p>
            )}
          </section>
          <DialogFooter className="flex w-full gap-2 items-end flex-wrap">
            <Button variant={"outline"} onClick={() => handleClickCancel()}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ModalLogs;
