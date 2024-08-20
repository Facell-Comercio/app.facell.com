// import { useAuthStore } from "@/context/auth-store";

import { SelectMultiFilial } from "@/components/custom/SelectFilial";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useConferenciasCaixa } from "@/hooks/financeiro/useConferenciasCaixa";
import { FileSearch } from "lucide-react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useStoreConferenciaCaixa } from "./store";

const ConferenciaCaixa = () => {
  const uri = `/financeiro/controle-de-caixa/conferencia-de-caixa`;
  const uriCaixas =
    "/financeiro/controle-de-caixa/conferencia-de-caixa/filiais";
  const location = useLocation();

  const [filters, setFilters] = useStoreConferenciaCaixa((state) => [
    state.filters,
    state.setFilters,
  ]);

  const { data, refetch, isLoading } = useConferenciasCaixa().getFiliais({
    filters,
  });

  return location.pathname === uriCaixas ? (
    <Outlet />
  ) : (
    <section className="flex flex-col gap-3 max-w-full">
      <SelectMultiFilial
        className="max-w-full w-full"
        value={filters.filiais_list || []}
        onChange={(value) => {
          setFilters({ filiais_list: value });
          refetch();
        }}
        maxCount={3}
      />
      {!isLoading && (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow className="uppercase text-nowrap">
                <TableHead>ID</TableHead>
                <TableHead>Filial</TableHead>
                <TableHead>A Conferir</TableHead>
                <TableHead>Baixa Pendente</TableHead>
                <TableHead>B. Datasys Pendente</TableHead>
                <TableHead>Ocorrências</TableHead>
                <TableHead>Caixas Divergentes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.map((item: any, index: number) => (
                <TableRow
                  className="text-nowrap"
                  key={`${index} - filial ${item.id_filial}`}
                >
                  <TableCell className="text-primary hover:text-primary/90">
                    <Link to={`${uri}/filiais?id=${item.id_filial}`}>
                      <FileSearch />
                    </Link>
                  </TableCell>
                  <TableCell>{item.filial}</TableCell>
                  <TableCell>
                    <Badge
                      className="w-full flex justify-center"
                      variant={"secondary"}
                    >
                      {item.a_conferir || 0}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className="w-full flex justify-center"
                      variant={"success"}
                    >
                      {item.baixa_pendente || 0}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className="w-full flex justify-center">
                      {item.baixa_datasys_pendente || 0}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className="w-full flex justify-center"
                      variant={"destructive"}
                    >
                      {item.ocorrencias || 0}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className="w-full flex justify-center"
                      variant={"warning"}
                    >
                      {item.divergentes || 0}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </section>
  );
};

export default ConferenciaCaixa;
