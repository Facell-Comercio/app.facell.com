import AlertPopUp from "@/components/custom/AlertPopUp";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDDA } from "@/hooks/financeiro/useDDA";
import { Download, FileStack, Trash, Unplug, Upload } from "lucide-react";
import { ChangeEvent, useRef, useState } from "react";
import { FaSpinner } from "react-icons/fa6";
import { useStoreDDA } from "./storeDDA";

export type ExportAnexosProps = {
  type: string;
  idSelection: number[];
};

const BtnOptionsDDA = () => {
  const openModal = useStoreDDA().openModal;

  const { mutate: importDDA, isPending: importDDAisPending } = useDDA().importDDA();
  const { mutate: exportDDA, isPending: exportDDAisPending } = useDDA().exportDDA();
  const { mutate: limparDDA, isPending: limparDDAisPending } = useDDA().limparDDA();
  const { mutate: autoVincularDDA, isPending: autoVincularDDAisPending } =
    useDDA().autoVincularDDA();

  const [alertLimpezaOpen, setAlertLimpezaOpen] = useState<boolean>(false);

  // * Acessar DDA
  const handleAcessarClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    openModal({
      id_vencimento: null,
      filters: {
        vinculados: true,
        naoVinculados: true,
      },
    });
  };

  // * Importação
  const fileRef = useRef<HTMLInputElement | null>(null);
  const handleFileImportClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (fileRef.current) {
      fileRef.current.click();
    }
  };
  const handleFileImportChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const target = event.target;
    if (!target.files) return;
    const files = target.files;
    const form = new FormData();
    if (files) {
      Array.from(files).forEach((file) => {
        form.append(`files`, file);
      });
    }
    importDDA(form);
    target.value = "";
  };

  // * Export
  const handleExportClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    exportDDA();
  };

  // * Limpeza de DDA
  const handleLimpezaClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setAlertLimpezaOpen(true);
  };
  const handleLimpezaAction = async () => {
    limparDDA();
  };

  // * Autovincular DDA
  const handleAutoVincularClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    autoVincularDDA();
  };

  return (
    <>
      <input
        onChange={handleFileImportChange}
        ref={fileRef}
        type="file"
        multiple
        accept=".ret"
        className="hidden"
      />
      <AlertPopUp
        open={alertLimpezaOpen}
        onOpenChange={setAlertLimpezaOpen}
        title="Deseja realmente excluir?"
        description="Todos os boletos do DDA que ainda não foram vinculados a vencimentos serão excluídos."
        action={() => {
          handleLimpezaAction();
        }}
      >
        {<></>}
      </AlertPopUp>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button type="button" variant={"outline"}>
            <FileStack size={18} className="me-2" />
            DDA
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>
            <Button className="w-full" size={"sm"} onClick={handleAcessarClick}>
              <FileStack size={18} className="me-2" /> Acessar
            </Button>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <Button
                disabled={importDDAisPending}
                title="Após importar arquivo de varredura DDA .RET, a autovinculação será realizada automaticamente..."
                className="w-full"
                size={"sm"}
                variant={"tertiary"}
                onClick={handleFileImportClick}
              >
                {importDDAisPending ? (
                  <FaSpinner size={18} className="animate-spin me-2" />
                ) : (
                  <Upload size={18} className="me-2" />
                )}{" "}
                Importar
              </Button>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Button
                title="Vincular os boletos aos vencimentos, isso já é feito automaticamente após a importação. Mas você pode utilizar a função para atualizar."
                disabled={autoVincularDDAisPending}
                className="w-full"
                size={"sm"}
                variant={"warning"}
                onClick={handleAutoVincularClick}
              >
                {autoVincularDDAisPending ? (
                  <FaSpinner size={18} className="animate-spin me-2" />
                ) : (
                  <Unplug size={18} className="me-2" />
                )}{" "}
                Autovincular
              </Button>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Button
                disabled={exportDDAisPending}
                className="w-full"
                size={"sm"}
                variant={"success"}
                onClick={handleExportClick}
              >
                {exportDDAisPending ? (
                  <FaSpinner size={18} className="animate-spin me-2" />
                ) : (
                  <Download size={18} className="me-2" />
                )}{" "}
                Exportar
              </Button>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Button
                type="button"
                size={"sm"}
                variant={"destructive"}
                disabled={limparDDAisPending}
                title="Apaga todos os boletos do DDA que não estejam vinculados a Vencimentos e que sejam +30 dias inferior à data atual"
                onClick={handleLimpezaClick}
              >
                {limparDDAisPending ? (
                  <FaSpinner size={18} className="animate-spin me-2" />
                ) : (
                  <Trash size={18} className="me-2" />
                )}{" "}
                Excluir não vinculados
              </Button>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default BtnOptionsDDA;
