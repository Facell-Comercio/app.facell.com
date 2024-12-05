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
import FiltersEstoque from "./table/FiltersEstoque";





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
        <FiltersEstoque refetch={refetch}/>
        <DataTable
        pagination={pagination}
        setPagination={setPagination}
        data={rows} rowCount={rowCount} columns={columnsTableEstoques} />
      </div>
    </div>
  );
};

export default Estoque;