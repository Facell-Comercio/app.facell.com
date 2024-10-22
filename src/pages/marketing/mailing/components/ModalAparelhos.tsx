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
  handleSelection: (item: ItemAparelhos) => void;
  onOpenChange: () => void;
  closeOnSelection?: boolean;
}

export type ItemAparelhos = {
  descricao_comercial: string;
  descricao: string;
};

const ModalAparelhos = ({
  open,
  handleSelection,
  onOpenChange,
  closeOnSelection,
}: IModalAparelhos) => {
  const [search, setSearch] = useState<string>("");

  const { data, isError, refetch } = useQuery({
    queryKey: ["financeiro", "banco", "lista", { termo: search }],
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

  function pushSelection(item: ItemAparelhos) {
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

        <RowVirtualizerFixed data={data?.rows || []} pushSelection={pushSelection} />
      </DialogContent>
    </Dialog>
  );
};

export default ModalAparelhos;

import * as React from "react";

import fetchApi from "@/api/fetchApi";
import { useVirtualizer } from "@tanstack/react-virtual";

interface RowVirtualizerFixedProps {
  data: ItemAparelhos[];
  pushSelection: (item: ItemAparelhos) => void;
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
              className={`flex w-full gap-1 py-1 px-1 items-center bg-secondary/40 odd:bg-secondary/60 text-xs  ${
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
              <div className="flex justify-between items-center p-1 w-full">
                <div className="uppercase">{data[index].descricao_comercial}</div>
                <Button size={"xs"} onClick={() => pushSelection(data[index])}>
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
