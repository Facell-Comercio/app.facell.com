
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/use-toast";
import { exportToExcel } from "@/helpers/importExportXLS";
import { useDDA } from "@/hooks/financeiro/useDDA";
import { useQueryClient } from "@tanstack/react-query";
import { Download, FileStack, Trash, Unplug, Upload } from "lucide-react";
import {  ChangeEvent, useRef, useState } from "react";
import { useStoreDDA } from "./storeDDA";
import { FaSpinner } from "react-icons/fa6";
import AlertPopUp from "@/components/custom/AlertPopUp";

export type ExportAnexosProps = {
  type: string;
  idSelection: number[];
};

const BtnOptionsDDA = () => {
  const queryClient = useQueryClient()
  const filters = useStoreDDA().filters
  const openModal = useStoreDDA().openModal

  const [processing, setProcessing] = useState({
    import: false, autovincular: false, export: false, limpeza: false,
  })
  const [alertLimpezaOpen, setAlertLimpezaOpen] = useState<boolean>(false)

  // * Acessar DDA
  const handleAcessarClick = (e: React.MouseEvent<HTMLButtonElement>)=>{
    e.stopPropagation()
    openModal({id_vencimento: null, filters: {vinculados: true, naoVinculados: true} })
  }

  // * Importação
  const fileRef = useRef<HTMLInputElement | null>(null)
  const handleFileImportClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    if (fileRef.current) {
      fileRef.current.click()
    }
  }
  const handleFileImportChange = async (event: ChangeEvent<HTMLInputElement>) => {
    setProcessing(prev => ({ ...prev, import: true }))
    const target = event.target
    try {
      if (!target.files) {
        return;
      }
      const result = await useDDA().importDDA(target.files)
      exportToExcel(result, 'RESULTADO IMPORTAÇÃO DDA')

      queryClient.invalidateQueries({ queryKey: ['fin_dda'] })
      toast({
        variant: 'success', title: 'Importação concluída!',
      })
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro ao tentar importar o DDA',
        // @ts-ignore
        description: error?.response?.data?.message || error?.message
      })
    } finally {
      setProcessing(prev => ({ ...prev, import: false }))
      target.value = ''
    }
  }

  // * Export
  const handleExportClick = async (e:React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    setProcessing(prev => ({ ...prev, export: true }))
    try {
      const result = await useDDA().exportDDA(filters)
      exportToExcel(result || [], 'EXPORTAÇÃO DDA')
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro ao tentar exportar o DDA',
        // @ts-ignore
        description: error?.response?.data?.message || error?.message
      })
    } finally {
      setProcessing(prev => ({ ...prev, export: false }))
    }
  }

  // * Limpeza de DDA
  const handleLimpezaClick = async (e:React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    setAlertLimpezaOpen(true)
  }
  const handleLimpezaAction = async () => {
    setProcessing(prev => ({ ...prev, limpeza: true }))
    try {
      await useDDA().limparDDA()
      toast({
        variant: 'success',
        title: 'Limpeza concluída!'
      })
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro ao tentar limpar o DDA',
        // @ts-ignore
        description: error?.response?.data?.message || error?.message
      })
    } finally {
      setProcessing(prev => ({ ...prev, limpeza: false }))
    }
  }

  // * Autovincular DDA
  const handleAutoVincularClick = async (e:React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    setProcessing(prev => ({ ...prev, autovincular: true }))
    try {
      const result = await useDDA().autoVincularDDA()
      exportToExcel(result || [], 'RESULTADO AUTOVINCULAÇÃO DDA')
      toast({
        variant: 'success',
        title: 'Autovinculação concluída!'
      })
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro ao tentar limpar o DDA',
        // @ts-ignore
        description: error?.response?.data?.message || error?.message
      })
    } finally {
      setProcessing(prev => ({ ...prev, autovincular: false }))
    }
  }

  return (
    <>
      <input onChange={handleFileImportChange} ref={fileRef} type="file" multiple accept=".ret" className="hidden" />
      <AlertPopUp
        open={alertLimpezaOpen}
        onOpenChange={setAlertLimpezaOpen}
        title="Deseja realmente excluir?"
        description="Todos os boletos do DDA que ainda não foram vinculados a vencimentos serão excluídos."
        action={() => { handleLimpezaAction() }}
      >
        {<></>}
      </AlertPopUp>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button type="button" variant={'outline'}>
            <FileStack size={18} className="me-2" />
            DDA
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>
            <Button className="w-full" size={'sm'} onClick={handleAcessarClick}>
              <FileStack size={18} className="me-2" /> Acessar
            </Button>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <Button
                disabled={processing.import}
                title="Após importar arquivo de varredura DDA .RET, a autovinculação será realizada automaticamente..."
                className="w-full" size={'sm'} variant={'tertiary'} onClick={handleFileImportClick}>
                {processing.import ? <FaSpinner size={18} className="animate-spin me-2" /> : <Upload size={18} className="me-2" />} Importar
              </Button>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Button
                title="Vincular os boletos aos vencimentos, isso já é feito automaticamente após a importação. Mas você pode utilizar a função para atualizar."
                disabled={processing.autovincular}
                className="w-full" size={'sm'} variant={'warning'} onClick={handleAutoVincularClick}>
                {processing.autovincular ? <FaSpinner size={18} className="animate-spin me-2" /> : <Unplug size={18} className="me-2" />} Autovincular
              </Button>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Button
                disabled={processing.export}
                className="w-full" size={'sm'} variant={'success'} onClick={handleExportClick}>
                {processing.export ? <FaSpinner size={18} className="animate-spin me-2" /> : <Download size={18} className="me-2" />} Exportar
              </Button>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Button
                type="button"
                size={"sm"}
                variant={"destructive"}
                disabled={processing.limpeza}
                title="Apaga todos os boletos do DDA que não estejam vinculados a Vencimentos e que sejam +30 dias inferior à data atual"
                onClick={handleLimpezaClick}
              >
                {processing.limpeza ? <FaSpinner size={18} className="animate-spin me-2" /> : <Trash size={18} />} Excluir não vinculados
              </Button>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default BtnOptionsDDA;
