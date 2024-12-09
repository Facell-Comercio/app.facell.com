import { DataTable } from "@/components/custom/DataTable";
import { Button } from "@/components/ui/button";
import {} from "@radix-ui/react-select";
import { Shirt, Upload, Download, Handshake, HandCoins } from "lucide-react";
import { useStoreEstoque } from "./table/store-table";
import { useFardamentos } from "@/hooks/useFardamentos";
import FiltersEstoque from "./table/FiltersEstoque";
import { columnsTableEstoques } from "./table/columns-estoque";
import FormEstoqueFardamento from "./components/Form";





const Estoque = () => {
  const { data, refetch } = useFardamentos().getAll();
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
      <FormEstoqueFardamento/>
    </div>
  );
};

export default Estoque;