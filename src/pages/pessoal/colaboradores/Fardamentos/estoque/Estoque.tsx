import { DataTable } from "@/components/custom/DataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ModalComponent } from "@/components/custom/ModalComponent";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // diferença entre importar daqui e do @radix-ui
import { Table } from "@/components/ui/table";
import {
  Accordion,
  AccordionItem,
  AccordionContent,
  AccordionTrigger,
} from "@radix-ui/react-accordion";
import {} from "@radix-ui/react-select";
import { EraserIcon, FilterIcon } from "lucide-react";
import { useEstoque } from "./table/fetch-estoque";
import { useStoreEstoque } from "./table/store-table";
import { columnsTableEstoques } from "./table/columns-estoque";




const Estoque = () => {
  const { data, refetch } = useEstoque().getAll();
  const [pagination, setPagination] = useStoreEstoque((state) => [
    state.pagination,
    state.setPagination,
  ]);
  const rows = data?.data?.rows || 0;
  const rowCount = data?.data?.rowCount || 0;

  return (
    <div className="flex-col p-4 rounded-lg">
      <nav className="flex-row p-3">
        <ul className="flex space-x-8">
          <li>
            <button>Estoque</button>
          </li>
          <li>
            <button>Movimentação</button>
          </li>
          <li>
            <button>configuração</button>
          </li>
        </ul>
      </nav>
      <div className="flex justify-between space-x-2 p-3">
        <div className="flex justify-start gap-3 ">
          <Button variant={"success"}>Exportar</Button>
          <Button variant={"default"}>Importar</Button>
        </div>
        <div className="flex justify-end gap-3 ">
          <Button variant={"default"}>Abastecer</Button>
          <Button variant={"destructive"}>Conceder</Button>
          <Button variant={"success"}>Vender</Button>
        </div>
      </div>
      <div>
        <Accordion
          type="single"
          collapsible
          // value={itemOpen}
          // onValueChange={(e)=> setItemOpen(e)}
          className="p-2 border-2 dark:border-slate-800 rounded-lg "
        >
          <AccordionItem value="item-1" className="relative border-0 ">
            <div className="flex gap-3 items-center absolute start-16 top-1">
              <Button size={"xs"}>
                Aplicar <FilterIcon size={12} className="ms-2" />
              </Button>
              <Button size={"xs"} variant="secondary">
                Limpar <EraserIcon size={12} className="ms-2" />
              </Button>
            </div>

            <AccordionTrigger className={`py-1 hover:no-underline`}>
              <span className="">Filtros</span>
            </AccordionTrigger>
            <AccordionContent className="p-0 pt-3">
              <ScrollArea className=" w-full whitespace-nowrap rounded-md sm:pb-3">
                <div className="flex w-max space-x-3">
                  <Select>
                    <SelectTrigger className="max-w-[24ch]">
                      <SelectValue placeholder="Grupo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">FACELL</SelectItem>
                      <SelectItem value="9">FORTTELECOM</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder="UF"
                    className="w-[6ch]"
                    // value={}
                    // onChange={}
                  />
                  <Input
                    placeholder="Modelo"
                    className="max-w-[200ch]"
                    // value={}
                    // onChange={}
                  />
                  <Input placeholder="Tamanho" className="w-[11ch]" />
                  <Select>
                    {/* value={} */}
                    {/* onValueChange={} */}
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Sexo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="M">M</SelectItem>
                      <SelectItem value="F">F</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <DataTable
        pagination={pagination}
        setPagination={setPagination}
        data={rows} rowCount={rowCount} columns={columnsTableEstoques} />
      </div>
    </div>
  );
};

export default Estoque;