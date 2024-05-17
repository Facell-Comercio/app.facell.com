import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UseFormReturn } from "react-hook-form";
import { TituloSchemaProps } from "../../../form-data";
import { ArrowsUpFromLine } from "lucide-react";
import ModalPlanoContas from "@/pages/financeiro/components/ModalPlanoContas";
import ModalCentrosCustos from "@/pages/admin/components/ModalCentrosCustos";


type PadronizarAlocacaoProps = {
  form: UseFormReturn<TituloSchemaProps>,
  canEdit?: boolean,
  disabled?: boolean,
  canEditItensRateio: boolean,
}

export function BtnPadronizarAlocacao({ form, canEditItensRateio }: PadronizarAlocacaoProps) {

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="tertiary" size={'sm'} className="group">
          <ArrowsUpFromLine size={18} className="me-2 group-hover:rotate-180 transition-all" />
          Padronizar Alocação
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Padronizar Alocação</DialogTitle>
          <DialogDescription>
            Iguala o centro de custo e plano de contas para todos os itens do rateio.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          
          <ModalPlanoContas
            open={canEdit && modalPlanoContasOpen && !!id_matriz}
            id_matriz={id_matriz}
            tipo="Despesa"
            onOpenChange={setModalPlanoContasOpen}
            handleSelection={handleSelectionPlanoContas}
          />

          <ModalCentrosCustos
            handleSelection={handleSelectionCentroCusto}
            id_matriz={id_matriz}
            // @ts-expect-error 'Vai funcionar'
            onOpenChange={setModalCentrosCustosOpen}
            open={canEdit && modalCentrosCustosOpen && !!id_matriz}
            closeOnSelection={true}
          />


        </div>
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
