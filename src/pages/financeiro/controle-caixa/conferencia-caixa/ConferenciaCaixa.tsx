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
                <TableHead><Badge
                  className="w-full flex justify-center"
                  variant={"secondary"}
                >A Conferir</Badge></TableHead>
                <TableHead><Badge
                  className="w-full flex justify-center"
                  variant={"success"}
                >Conferidos</Badge></TableHead>
                <TableHead>
                  <Badge
                    className="w-full flex justify-center"
                    variant={"warning"}
                  >Divergentes</Badge>
                </TableHead>
                <TableHead>
                  <Badge
                    className="w-full flex justify-center"
                    variant={"destructive"}
                  >Ocorrências
                  </Badge>
                </TableHead>

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
                    <span className="flex text-center justify-center">
                      {item.a_conferir || 0}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="flex text-center justify-center">
                      {item.baixa_pendente || 0}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="flex text-center justify-center">
                      {item.divergentes || 0}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="flex text-center justify-center">
                      {item.ocorrencias || 0}
                    </span>
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
