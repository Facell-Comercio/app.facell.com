import { Input } from "@/components/custom/FormInput";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
} from "@/components/ui/popover";
import {
  ScrollArea,
  ScrollBar,
} from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  SegmentoProps,
  useConfiguracoes,
} from "@/hooks/comercial/useConfiguracoes";
import { PopoverTrigger } from "@radix-ui/react-popover";
import {
  EraserIcon,
  FilterIcon,
  Info,
} from "lucide-react";
import { useState } from "react";

interface IModalSegmentos {
  open: boolean;
  handleSelection: (item: SegmentoProps) => void;
  onOpenChange: (value: boolean) => void;
  closeOnSelection?: boolean;
}

const defaultFilters = {
  categoria: "",
  segmento: "",
};

const ModalSegmentos = ({
  open,
  handleSelection,
  onOpenChange,
  closeOnSelection,
}: IModalSegmentos) => {
  const [filters, setFilters] = useState(
    defaultFilters
  );

  const { data, isLoading, isError, refetch } =
    useConfiguracoes().getSegmentos({
      filters,
    });

  async function handleClickFilter() {
    await new Promise((resolve) => {
      resolve(true);
    });
    refetch();
  }

  async function handleClickResetFilters() {
    await new Promise((resolve) => {
      setFilters((prev) => ({
        ...prev,
        ...defaultFilters,
      }));
      resolve(true);
    });
    refetch();
  }

  function pushSelection(item: SegmentoProps) {
    if (closeOnSelection) {
      // @ts-expect-error 'vai funcionar...'
      onOpenChange((prev) => !prev);
    }
    handleSelection(item);
  }
  const [itemOpen, setItemOpen] =
    useState<string>("item-1");

  if (isError) return null;
  if (!open) return null;

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-[1000px]">
        <DialogHeader>
          <DialogTitle>
            Lista de Segmentos
          </DialogTitle>
          <DialogDescription>
            Selecione uma ao clicar no botão à
            direita.
          </DialogDescription>

          <Accordion
            type="single"
            collapsible
            value={itemOpen}
            onValueChange={(e) => setItemOpen(e)}
            className="p-2 border dark:border-slate-800 rounded-lg flex-1"
          >
            <AccordionItem
              value="item-1"
              className="relative border-0"
            >
              <div className="flex gap-3 items-center absolute start-16 topy-1 px-1.">
                <Button
                  size={"xs"}
                  onClick={() =>
                    handleClickFilter()
                  }
                >
                  Aplicar
                  <FilterIcon
                    size={12}
                    className="ms-2"
                  />
                </Button>
                <Button
                  size={"xs"}
                  variant="secondary"
                  onClick={() =>
                    handleClickResetFilters()
                  }
                >
                  Limpar
                  <EraserIcon
                    size={12}
                    className="ms-2"
                  />
                </Button>
              </div>

              <AccordionTrigger
                className={`py-1 hover:no-underline`}
              >
                <span className="">Filtros</span>
              </AccordionTrigger>
              <AccordionContent className="p-0 pt-3">
                <ScrollArea className="whitespace-nowrap rounded-md pb-1 flex flex-wrap w-max max-w-full  ">
                  <div className="flex gap-2 sm:gap-3 w-max">
                    <Input
                      placeholder="Segmento"
                      className="max-w-[200px]"
                      value={
                        filters?.categoria || ""
                      }
                      onChange={(e) => {
                        setFilters((prev) => ({
                          ...prev,
                          categoria:
                            e.target.value,
                        }));
                      }}
                    />
                    <Input
                      placeholder="Descrição"
                      className="max-w-[200px]"
                      value={
                        filters?.segmento || ""
                      }
                      onChange={(e) => {
                        setFilters((prev) => ({
                          ...prev,
                          segmento:
                            e.target.value,
                        }));
                      }}
                    />
                  </div>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </DialogHeader>
        <Table
          className="rounded-md border-border w-full h-10 overflow-clip relative"
          divClassname="overflow-auto scroll-thin max-h-[60vh] border rounded-md"
        >
          <TableHeader className="sticky w-full top-0 h-10 border-b-2 border-border rounded-t-md bg-secondary">
            <TableRow>
              <TableHead>Ação</TableHead>
              <TableHead>Segmento</TableHead>
              <TableHead>Descrição</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.map((item: SegmentoProps) => (
              <TableRow
                key={`segmentosRow.${item.id}`}
                className="bg-slate-800/90 odd:bg-slate-800/70"
              >
                <TableCell>
                  <Button
                    size={"xs"}
                    className="p-1"
                    variant={"outline"}
                    onClick={() => {
                      pushSelection(item);
                    }}
                  >
                    Selecionar
                  </Button>
                </TableCell>
                <TableCell
                  className="max-w-[15ch] truncate text-xs text-wrap "
                  title={item.categoria}
                >
                  {item.categoria}
                </TableCell>
                <TableCell className="text-nowrap text-xs">
                  {item.segmento}
                  <Popover>
                    <PopoverTrigger>
                      <Badge
                        variant={"outline"}
                        className="ml-2 border-none"
                      >
                        <Info size={14} />
                      </Badge>
                    </PopoverTrigger>
                    <PopoverContent className="w-fit bg-background text-destructive-foreground whitespace-pre-wrap text-wrap normal-case">
                      {item.obs}
                    </PopoverContent>
                  </Popover>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  );
};

export default ModalSegmentos;
