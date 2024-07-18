import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from '@/components/ui/use-toast';
import { exportToExcel } from '@/helpers/importExportXLS';
import { useBordero } from '@/hooks/financeiro/useBordero';
import { api } from '@/lib/axios';
import { useQueryClient } from '@tanstack/react-query';
import { Download, FileText, Upload } from 'lucide-react';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { FaSpinner } from 'react-icons/fa6';

export type ExportAnexosProps = {
  type: string;
  idSelection: number[];
};
type OptionsRemessaProps = {
  id: string;
};
const BtnOptionsRemessa = ({ id }: OptionsRemessaProps) => {
  const queryClient = useQueryClient();
  const { mutate: exportRemessa, isPending: isLoadingDownload } =
    useBordero().exportRemessa();
  const [processing, setProcessing] = useState({
    import: false,
    remessaPix: false,
  });
  useEffect(() => {
    if (!isLoadingDownload) {
      setProcessing((prev) => ({ ...prev, remessaPix: false }));
    }
  }, [isLoadingDownload]);

  //* Funçao Importação
  function importRemessa(files: FileList | null) {
    return new Promise(async (resolve, reject) => {
      try {
        const form = new FormData();
        if (files) {
          for (let i = 0; i < files.length; i++) {
            form.append('files', files[i]);
          }
        }
        const result = await api.postForm(
          `/financeiro/contas-a-pagar/bordero/${id}/import-retorno-remessa`,
          form
        );
        queryClient.invalidateQueries({
          queryKey: ['financeiro', 'contas_pagar'],
        });
        resolve(result.data);
      } catch (error) {
        reject(error);
      }
    });
  }

  // * Importação
  const fileRef = useRef<HTMLInputElement | null>(null);
  const handleFileImportClick = () => {
    if (fileRef.current) {
      fileRef.current.click();
    }
  };
  const handleFileImportChange = async (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setProcessing((prev) => ({ ...prev, import: true }));
    const target = event.target;
    try {
      if (!target.files) {
        return;
      }
      const result = await importRemessa(target.files);
      exportToExcel(result, 'RESULTADO IMPORTAÇÃO DE REMESSA');

      toast({
        variant: 'success',
        title: 'Importação concluída!',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro ao tentar importar a remessa',
        // @ts-ignore
        description: error?.response?.data?.message || error?.message,
      });
      console.log(error);
    } finally {
      setProcessing((prev) => ({ ...prev, import: false }));
      target.value = '';
    }
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

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button type="button" variant={'outline'}>
            <FileText size={18} className="me-2" />
            Remessa
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent hideWhenDetached>
          <DropdownMenuGroup>
            <DropdownMenuItem className="p-1">
              <Button
                disabled={isLoadingDownload && !processing.remessaPix}
                className="w-full"
                variant={'outline'}
                type={'button'}
                onClick={(e) => {
                  e.preventDefault();
                  exportRemessa({ id });
                }}
              >
                {isLoadingDownload && !processing.remessaPix ? (
                  <FaSpinner size={18} className="me-2 animate-spin" />
                ) : (
                  <Download className="me-2" size={20} />
                )}{' '}
                Outros Tipos
              </Button>
            </DropdownMenuItem>
            <DropdownMenuItem className="p-1">
              <Button
                disabled={isLoadingDownload && processing.remessaPix}
                className="w-full"
                variant={'outline'}
                type={'button'}
                onClick={(e) => {
                  e.preventDefault();
                  setProcessing((prev) => ({ ...prev, remessaPix: true }));
                  exportRemessa({ id, isPix: true });
                }}
              >
                {isLoadingDownload && processing.remessaPix ? (
                  <FaSpinner size={18} className="me-2 animate-spin" />
                ) : (
                  <Download className="me-2" size={20} />
                )}{' '}
                PIX
              </Button>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem className="p-1">
              <Button
                disabled={processing.import}
                className="w-full"
                size={'sm'}
                variant={'outline'}
                onClick={handleFileImportClick}
              >
                {processing.import ? (
                  <FaSpinner size={18} className="animate-spin me-2" />
                ) : (
                  <Upload size={18} className="me-2" />
                )}{' '}
                Importar Retorno
              </Button>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default BtnOptionsRemessa;
