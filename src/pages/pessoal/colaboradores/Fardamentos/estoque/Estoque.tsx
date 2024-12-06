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
import { Shirt, Upload, Download, Handshake, HandCoins } from "lucide-react";
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
      <div className="flex justify-between space-x-2 p-3">
        <div className="flex justify-start gap-3 ">
          <Button variant={"success"}><Download size={16} className="mr-2"/>Exportar</Button>
          <Button variant={"default"}><Upload size={16} className="mr-2"/>Importar</Button>
        </div>
        <div className="flex justify-end gap-3 ">
          <Button variant={"default"}><Shirt size={16} className="mr-2"/>Abastecer</Button>
          <Button variant={"destructive"}><Handshake size={16} className="mr-2"/>Conceder</Button>
          <Button variant={"success"}><HandCoins size={16} className="mr-2"/>Vender</Button>
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