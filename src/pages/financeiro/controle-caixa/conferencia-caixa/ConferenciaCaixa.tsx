// import { useAuthStore } from "@/context/auth-store";

import { SelectMultiFilial } from "@/components/custom/SelectFilial";
import { SelectMultiUF } from "@/components/custom/SelectUF";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { checkUserDepartments, hasPermission } from "@/helpers/checkAuthorization";
import { useConferenciasCaixa } from "@/hooks/financeiro/useConferenciasCaixa";
import { FileSearch, Settings2 } from "lucide-react";
import { Link, Outlet, useLocation } from "react-router-dom";
import ModalAjustes from "./caixas/caixa/ajustes/ModalAjustes";
import { useStoreCaixa } from "./caixas/caixa/store";
import { useStoreConferenciaCaixa } from "./store";

const ConferenciaCaixa = () => {
  const uri = `/financeiro/controle-de-caixa/conferencia-de-caixa`;
  const uriCaixas = "/financeiro/controle-de-caixa/conferencia-de-caixa/filiais";
  const location = useLocation();

  const [filters, setFilters] = useStoreConferenciaCaixa((state) => [
    state.filters,
    state.setFilters,
  ]);

  const [openModalAjustes] = useStoreCaixa((state) => [state.openModalAjustes]);

  const { data, refetch, isLoading } = useConferenciasCaixa().getFiliais({
    filters,
  });

  const filiais = data?.filiais;
  const ajustes = data?.totalAjustes || 0;

  return location.pathname === uriCaixas ? (
    <Outlet />
  ) : (
    <section className="flex flex-col gap-3 max-w-full">
      <span className="flex gap-2">
        <SelectMultiFilial
          className="max-w-full flex-1"
          value={filters.filiais_list || []}
          onChange={(value) => {
            setFilters({ filiais_list: value });
            refetch();
          }}
          maxCount={2}
          uf_list={filters.uf_list}
        />
        <SelectMultiUF
          value={filters.uf_list || []}
          onChange={(ufs) => {
            setFilters({ filiais_list: [], uf_list: ufs });
            refetch();
          }}
          className="w-fit"
        />
        {/* Botão renderizado somente quando gestor do financeiro ou master */}
        {(checkUserDepartments("FINANCEIRO", true) || hasPermission("MASTER")) && (
          <Button
            variant={"destructive"}
            className="flex gap-1.5 justify-center items-center"
            onClick={() => openModalAjustes({ id: data.id || "", aprovado: 0 })}
            disabled={isLoading}
            title={ajustes > 0 ? `Há ${ajustes} ${ajustes > 1 ? "ajustes" : "ajuste"}` : ""}
          >
            <Settings2 size={22} />
            Ajustes: ({ajustes})
          </Button>
        )}
      </span>
      {!isLoading && (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow className="uppercase text-nowrap">
                <TableHead>ID</TableHead>
                <TableHead>Filial</TableHead>
                <TableHead>
                  <Badge className="w-full flex justify-center" variant={"secondary"}>
                    A Conferir
                  </Badge>
                </TableHead>
                <TableHead>
                  <Badge className="w-full flex justify-center" variant={"success"}>
                    Conferidos
                  </Badge>
                </TableHead>
                <TableHead>
                  <Badge className="w-full flex justify-center" variant={"warning"}>
                    Divergentes
                  </Badge>
                </TableHead>
                <TableHead>
                  <Badge className="w-full flex justify-center" variant={"destructive"}>
                    Ocorrências
                  </Badge>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filiais?.map((filial: any, index: number) => (
                <TableRow className="text-nowrap" key={`${index} - filial ${filial.id_filial}`}>
                  <TableCell className="text-primary hover:text-primary/90">
                    <Link to={`${uri}/filiais?id=${filial.id_filial}`}>
                      <FileSearch />
                    </Link>
                  </TableCell>
                  <TableCell>{filial.filial}</TableCell>
                  <TableCell>
                    <span className="flex text-center justify-center">
                      {filial.a_conferir || 0}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="flex text-center justify-center">
                      {filial.baixa_pendente || 0}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="flex text-center justify-center">
                      {filial.divergentes || 0}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="flex text-center justify-center">
                      {filial.ocorrencias || 0}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      <ModalAjustes />
    </section>
  );
};

export default ConferenciaCaixa;
