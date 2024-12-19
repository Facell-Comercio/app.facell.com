import SearchComponent from "@/components/custom/SearchComponent";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

interface IModalAparelhos {
  open: boolean;
  handleSelection: (item: ItemAparelho) => void;
  onOpenChange: () => void;
  closeOnSelection?: boolean;
}

type EstoqueProps = {
  uf: string;
  qtde: string;
};

export type ItemAparelho = {
  descricao_comercial: string;
  descricao: string;
  estoques: EstoqueProps[];
};

const ModalAparelhos = ({
  open,
  handleSelection,
  onOpenChange,
  closeOnSelection,
}: IModalAparelhos) => {
  const [search, setSearch] = useState<string>("");

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["marketing", "aparelhos", "lista", { termo: search }],
    queryFn: async () =>
      await fetchApi.marketing.mailing.getAparelhos({ filters: { termo: search } }),
    enabled: open,
  });

  async function handleSearch(searchText: string) {
    await new Promise((resolve) => {
      setSearch(searchText);
      resolve(true);
    });
    refetch();
  }

  function pushSelection(item: ItemAparelho) {
    handleSelection(item);
    if (closeOnSelection) {
      onOpenChange();
    }
  }

  if (isError) return null;
  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[1000px]">
        <DialogHeader>
          <DialogTitle>Aparelhos</DialogTitle>
          <DialogDescription>Selecione um ao clicar no botão à direita.</DialogDescription>

          <SearchComponent handleSearch={handleSearch} />
        </DialogHeader>
        {isLoading ? (
          <Skeleton className="h-[400px] w-full" />
        ) : (
          <RowVirtualizerFixed data={data?.rows || []} pushSelection={pushSelection} />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ModalAparelhos;

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export function PopoverEstoque({ title }: { title: string }) {
  const [open, setOpen] = useState(false);
  const { data } = useQuery({
    queryKey: ["marketing", "aparelhos", "estoques", "lista", { descricao_comercial: title }],
    queryFn: async () =>
      await fetchApi.marketing.mailing.getEstoquesAparelho({
        filters: { descricao_comercial: title },
      }),
    enabled: open,
  });

  return (
    <Popover onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="cursor-pointer">{title}</div>
      </PopoverTrigger>
      <PopoverContent>
        <div className="flex gap-2 flex-col bg-background">
          <h3 className="font-medium">{title}</h3>
          <Table divClassname="rounded-md border">
            <TableHeader className="bg-secondary">
              <TableRow>
                <TableHead>UF</TableHead>
                <TableHead>Estoque</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data && data.length > 0 ? (
                data.map((data: any, index: number) => (
                  <TableRow key={`${index} - ${title}`}>
                    <TableCell>{data.uf}</TableCell>
                    <TableCell>{data.qtde}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={2} className="text-center">
                    <span className="flex w-full items-center justify-center text-sm">
                      Sem dados de estoque
                    </span>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </PopoverContent>
    </Popover>
  );
}

import * as React from "react";

import fetchApi from "@/api/fetchApi";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useVirtualizer } from "@tanstack/react-virtual";

interface RowVirtualizerFixedProps {
  data: ItemAparelho[];
  pushSelection: (item: ItemAparelho) => void;
}

const RowVirtualizerFixed: React.FC<RowVirtualizerFixedProps> = ({ data, pushSelection }) => {
  const parentElement = React.useRef(null);

  const count = data.length;

  const virtualizer = useVirtualizer({
    count,
    getScrollElement: () => parentElement.current,
    estimateSize: () => 36,
    overscan: 10,
  });

  return (
    <section
      ref={parentElement}
      className="md:pe-2 h-[400px] w-full overflow-auto scroll-thin rounded-md"
      // style={{
      //   height: `300px`,
      //   width: `100%`,
      //   overflow: 'auto',
      // }}
    >
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: "100%",
          position: "relative",
        }}
      >
        {virtualizer.getVirtualItems().map((item, index) => {
          return (
            <div
              // ref={virtualizer.measureElement}
              key={item.index}
              data-index={index}
              className={`grid w-full gap-1 py-1 px-1 items-center bg-secondary/40 odd:bg-secondary/60 text-xs  ${
                virtualizer.getVirtualItems().length == 0 && "hidden"
              }`}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: `${item.size}px`,
                transform: `translateY(${item.start}px)`,
              }}
            >
              <div className="grid grid-cols-[1fr_100px] justify-between items-center p-1 w-full">
                <div className="uppercase">
                  <PopoverEstoque title={data[item.index].descricao_comercial} />
                  {/*{data[item.index].descricao_comercial}*/}
                </div>
                <Button size={"xs"} onClick={() => pushSelection(data[item.index])}>
                  Selecionar
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
