import { Spinner } from "@/components/custom/Spinner";
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { DatePickerWithRange } from "@/components/ui/date-range";
import { toast } from "@/components/ui/use-toast";
import { api } from "@/lib/axios";
import { ImportIcon, TriangleAlert } from "lucide-react";
import { useState } from "react";
import { DateRange } from "react-day-picker";

export default function ImportacaoCaixaLote() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const handleClickImportar = async () => {
    if (!dateRange) {
      toast({
        variant: 'destructive', title: 'Preencha o período de importação!'
      })
      return
    }
    try {
      setIsLoading(true)
      await api.post(`/financeiro/controle-de-caixa/conferencia-de-caixa/import-por-periodo`, { range_datas: dateRange })
      toast({
        variant: 'success', title: 'Caixas importados com sucesso!'
      })
    } catch (error) {
      toast({
        variant: 'destructive', title: 'Ops!',
        // @ts-ignore 
        description: error?.response?.data?.message || error.message
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AccordionItem value={'importacao-lote'} className="border rounded-lg overflow-hidden no-underline">
      <AccordionTrigger className="hover:bg-secondary px-2 hover:no-underline">
        <div>
          <div className="flex gap-2 text-destructive ">{<TriangleAlert />}{'Importação de Caixas em Lote'}</div>
          <p className="font-normal text-warning">Os caixas de todas as lojas no período serão importados/reimportados para o sistema</p>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <div className="flex p-2 gap-3">
          <DatePickerWithRange date={dateRange} setDate={setDateRange} />
          <Button onClick={handleClickImportar} disabled={isLoading} >{isLoading ? <span className="flex gap-2"><Spinner /> Importando</span> : <span className="flex gap-2 items-center"><ImportIcon size={18} /> Importar</span>}</Button>
        </div>
      </AccordionContent>
    </AccordionItem>
  )
}
