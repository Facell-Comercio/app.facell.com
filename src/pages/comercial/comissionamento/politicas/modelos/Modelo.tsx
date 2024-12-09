import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { hasPermission } from "@/helpers/checkAuthorization";
import { normalizeCurrency, normalizePercentual } from "@/helpers/mask";
import { Pen, Plus } from "lucide-react";
import { useMemo } from "react";
import { EscalonamentoCargoProps, useStoreComissionamentoPoliticas } from "../store";

export interface ModeloPoliticaProps {
  id_modelo?: string;
  descricao?: string;
  id_cargo_politica?: string;
  itens?: ModeloItemPoliticaProps[];
}

interface ModeloItemPoliticaProps {
  id_item?: string;
  id_cargo_politica?: string;
  id_modelo?: string | null;
  id_segmento?: 2;
  tipo?: string;
  tipo_premiacao?: string;
  categoria?: string;
  segmento?: string;
  empresa?: string;
  detalhe?: string;
  active?: string | number;
  id_comissao_segmento?: string;
  descricao?: string;
  escalonamento_itens?: ItemEscalonamentoProps[];
}

type ItemEscalonamentoProps = {
  id?: string;
  id_item_politica?: string;
  percentual?: string;
  valor?: string;
  id_item_escalonamento?: string;
};

const Modelo = ({
  data,
  escalonamentoCargo,
}: {
  data: ModeloPoliticaProps;
  escalonamentoCargo: EscalonamentoCargoProps;
}) => {
  const [openModalModelo, openModalModeloItem] = useStoreComissionamentoPoliticas((state) => [
    state.openModalModelo,
    state.openModalModeloItem,
  ]);
  const id_modelo = useMemo(() => data?.id_modelo, [data.id_modelo]);
  const id_cargo_politica = useMemo(() => data.id_cargo_politica, [data.id_cargo_politica]);

  return (
    <section className="p-2 border bg-slate-200 dark:bg-blue-950 rounded-lg ">
      <div className="flex gap-3 justify-between items-center flex-wrap">
        <h4 className="text-base font-medium">Modelo: {String(data.descricao).toUpperCase()}</h4>
        <span className="flex gap-2 items-center">
          {hasPermission(["MASTER", "COMISSOES:ESPELHOS_EDITAR"]) && data.id_modelo && (
            <Button
              size={"sm"}
              variant={"warning"}
              onClick={() =>
                openModalModelo({
                  id: data.id_modelo || "",
                })
              }
            >
              <Pen className="me-2" size={18} />
              Editar Modelo
            </Button>
          )}
          {hasPermission(["MASTER", "COMISSOES:POLITICAS_EDITAR"]) && (
            <Button
              size={"sm"}
              onClick={() => {
                openModalModeloItem({
                  id: "",
                  id_modelo,
                  escalonamento: escalonamentoCargo,
                  id_cargo_politica,
                });
              }}
            >
              <Plus className="me-2" size={18} /> Add Item
            </Button>
          )}
        </span>
        <Table
          className="rounded-md border-border w-full h-10 overflow-clip relative"
          divClassname="overflow-auto scroll-thin max-h-[40vh] border rounded-md"
        >
          <TableHeader className="sticky w-full top-0 h-10 border-b-2 border-border rounded-t-md bg-secondary">
            <TableRow className="text-nowrap">
              {hasPermission(["MASTER", "COMISSOES:ESPELHOS_EDITAR"]) && (
                <TableHead>Ação</TableHead>
              )}
              <TableHead>Tipo</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Tipo Cálculo</TableHead>
              <TableHead>Premiação</TableHead>
              {escalonamentoCargo.itens.map((item, index) => (
                <TableHead key={`${index} ${item}`}>{normalizePercentual(item)}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody className="bg-background">
            {data?.itens?.map((item, index) => (
              <TableRow className="uppercase text-nowrap" key={`${index} ${item.id_item}`}>
                {hasPermission(["MASTER", "COMISSOES:POLITICAS_EDITAR"]) && (
                  <TableCell>
                    <Button
                      size={"xs"}
                      variant={"warning"}
                      onClick={() =>
                        openModalModeloItem({
                          id: item.id_item || "",
                        })
                      }
                    >
                      <Pen size={16} />
                    </Button>
                  </TableCell>
                )}
                <TableCell>{item.tipo}</TableCell>
                <TableCell className="max-w-[15ch] truncate" title={item.categoria}>
                  {item.categoria}
                </TableCell>
                <TableCell>{item.segmento}</TableCell>
                <TableCell>{item.tipo_premiacao}</TableCell>
                {escalonamentoCargo.itens.map((escala, index) => {
                  const value =
                    item.escalonamento_itens?.find((e) => e.percentual === escala)?.valor || "0";
                  return (
                    <TableCell key={`${index} ${escala}`}>
                      {item.tipo_premiacao == "percentual"
                        ? normalizePercentual(value)
                        : normalizeCurrency(value)}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  );
};

export default Modelo;
