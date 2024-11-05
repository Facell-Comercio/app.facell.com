import AlertPopUp from "@/components/custom/AlertPopUp";
import { ModalComponent } from "@/components/custom/ModalComponent";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { normalizeCurrency, normalizeDate } from "@/helpers/mask";
import { useConferenciasCaixa } from "@/hooks/financeiro/useConferenciasCaixa";
import { api } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { Ban, Minus, Plus } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";

export type TransacoesCreditProps = {
  id: string;
  id_conta_bancaria: string;
  conta_bancaria: string;
  valor: string;
  documento: string;
  data_transacao: string;
  descricao: string;
  tipo_data: string;
  id_deposito_caixa?: string;
};

interface IModalTransacoesCredit {
  open: boolean;
  handleSelection?: (item: TransacoesCreditProps) => void;
  handleMultiSelection?: (item: TransacoesCreditProps[]) => void;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  id_matriz: string;
  id_caixa: string | number;
  data_transacao: string | Date;
  multiSelection?: boolean;
  closeOnSelection?: boolean;
}

type PaginationProps = {
  pageSize: number;
  pageIndex: number;
};

const ModalTransacoesCredit = ({
  open,
  handleSelection,
  handleMultiSelection,
  onOpenChange,
  closeOnSelection,
  id_matriz,
  id_caixa,
  data_transacao,
  multiSelection,
}: IModalTransacoesCredit) => {
  const [ids, setIds] = useState<string[]>([]);
  const [transacoes, setTransacoes] = useState<TransacoesCreditProps[]>([]);
  const [pagination, setPagination] = useState<PaginationProps>({
    pageSize: 15,
    pageIndex: 0,
  });

  const { data, isError, isLoading, refetch } = useQuery({
    queryKey: [
      "financeiro",
      "conferencia_de_caixa",
      "caixas",
      "depositos_credit",
      { id_matriz, data_transacao, id_caixa },
    ],
    staleTime: 0,
    queryFn: async () =>
      await api
        .get(
          "/financeiro/controle-de-caixa/conferencia-de-caixa/transacoes-credit",
          {
            params: {
              filters: { id_matriz, data_transacao },
              pagination,
            },
          }
        )
        .then((response) => response.data),
    enabled: open,
  });
  const { mutate: deleteDeposito } = useConferenciasCaixa().deleteDeposito();

  const idDepositos = useMemo(
    () =>
      data?.rows
        ?.filter(
          (deposito: TransacoesCreditProps) => deposito.id_deposito_caixa
        )
        ?.map(
          (deposito: TransacoesCreditProps) =>
            `${deposito.id_conta_bancaria}-${deposito.documento}`
        ) || [],
    [id_caixa, data]
  );

  useEffect(() => {
    setTransacoes([]);
    setIds(idDepositos);
  }, [open, data]);

  function handleRemoveAll() {
    setTransacoes([]);
    setIds(idDepositos);
  }
  function handleSelectAll() {
    data?.rows.forEach((item: TransacoesCreditProps) => {
      const isAlreadyInTransacoesCredit = ids.some(
        (id) => id === `${item.id_conta_bancaria}-${item.documento}`
      );

      if (!isAlreadyInTransacoesCredit) {
        setTransacoes((prevTransacoesCredit) => [
          ...prevTransacoesCredit,
          {
            ...item,
          },
        ]);

        setIds((prevIds) => [
          ...prevIds,
          `${item.id_conta_bancaria}-${item.documento}`,
        ]);
      }
    });
  }

  function pushSelection(item: TransacoesCreditProps) {
    if (multiSelection) {
      const isAlreadyInTransacoesCredit = ids.some(
        (id) => id === `${item.id_conta_bancaria}-${item.documento}`
      );

      if (!isAlreadyInTransacoesCredit) {
        setTransacoes((prevTransacoes) => [
          ...prevTransacoes,
          {
            ...item,
          },
        ]);

        setIds([...ids, `${item.id_conta_bancaria}-${item.documento}`]);
      } else {
        setTransacoes((prevTransacoes) =>
          prevTransacoes.filter(
            (transacao) =>
              !(
                transacao.id_conta_bancaria === item.id_conta_bancaria &&
                transacao.documento === item.documento
              )
          )
        );

        setIds((prevId) =>
          prevId.filter((id) => {
            return id !== `${item.id_conta_bancaria}-${item.documento}`;
          })
        );
      }
    } else {
      handleSelection && handleSelection(item);
      if (onOpenChange !== undefined && closeOnSelection) {
        onOpenChange(false);
      }
    }
  }

  if (isError) return <p>Ocorreu um erro ao tentar buscar os depósitos</p>;

  const pageCount = (data && data.pageCount) || 0;

  const ButtonSaveSelection = () => {
    return (
      <Button
        onClick={() => handleMultiSelection && handleMultiSelection(transacoes)}
      >
        Salvar seleção
      </Button>
    );
  };

  const buttonAction = (
    isSelected: boolean,
    isDeposit: boolean,
    item: TransacoesCreditProps
  ) => {
    if (!isSelected || (isSelected && !isDeposit)) {
      return (
        <Button
          size={"xs"}
          className={`p-1 ${
            isSelected && "bg-secondary hover:bg-background hover:opacity-90"
          } hover:bg-background hover:opacity-80`}
          variant={"outline"}
          onClick={() => pushSelection(item)}
        >
          {isSelected ? (
            <Minus className="text-red-500" />
          ) : (
            <Plus className="text-green-500" />
          )}
        </Button>
      );
    }

    if (isSelected && isDeposit) {
      const deposito = data.rows?.filter(
        (deposit: TransacoesCreditProps) =>
          deposit.id_conta_bancaria == item.id_conta_bancaria &&
          deposit.documento == item.documento &&
          deposit.id_deposito_caixa
      )[0];

      return id_caixa == deposito.id_caixa ? (
        <AlertPopUp
          title={"Deseja realmente remover?"}
          description="O depósito será definitivamente removido deste caixa."
          action={() => {
            deleteDeposito(String(deposito?.id_deposito_caixa));
            setIds((prevId) =>
              prevId.filter((id) => {
                return id !== `${item.id_conta_bancaria}-${item.documento}`;
              })
            );
          }}
        >
          <Button
            size={"xs"}
            className={`p-1 bg-secondary hover:bg-background hover:opacity-90hover:bg-background hover:opacity-80`}
            variant={"outline"}
            title={"Depósito já incluso nesse caixa"}
          >
            <Minus className="text-orange-500" />
          </Button>
        </AlertPopUp>
      ) : (
        <span title={"Depósito já incluso em outro caixa"}>
          <Button
            size={"xs"}
            className={`p-1 bg-secondary hover:bg-background hover:opacity-90hover:bg-background hover:opacity-80`}
            variant={"outline"}
            disabled
          >
            <Ban />
          </Button>
        </span>
      );
    }
  };

  // const [itemOpen, setItemOpen] = useState<string>("item-1");

  if (isError) return null;
  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex flex-col sm:max-w-[1000px]">
        <DialogHeader>
          <DialogTitle>Depósitos Bancários</DialogTitle>
          <DialogDescription>
            Algumas transações listadas podem não ser depósitos realizados,
            analise com base na descrição.
          </DialogDescription>
          {/* <Accordion
            type="single"
            collapsible
            value={itemOpen}
            onValueChange={(e) => setItemOpen(e)}
            className="p-2 border dark:border-slate-800 rounded-lg flex-1"
          >
            <AccordionItem value="item-1" className="relative border-0">
              <div className="flex gap-3 items-center absolute start-16 top-1">
                <Button size={"xs"} onClick={() => handleClickFilter()}>
                  Aplicar <FilterIcon size={12} className="ms-2" />
                </Button>
                <Button
                  size={"xs"}
                  variant="secondary"
                  onClick={() => handleClickResetFilters()}
                >
                  Limpar <EraserIcon size={12} className="ms-2" />
                </Button>
              </div>

              <AccordionTrigger className={`py-1 hover:no-underline`}>
                <span className="">Filtros</span>
              </AccordionTrigger>
              <AccordionContent className="p-0 pt-3">
                <ScrollArea className="whitespace-nowrap rounded-md pb-1 flex flex-wrap w-max max-w-full  ">
                  <div className="flex gap-2 sm:gap-3 w-max">
                    <Input
                      placeholder="ID"
                      className="w-[10ch]"
                      ref={(el) => setInputRef("id_vencimento", el)}
                    />
                    <Input
                      placeholder="ID Título"
                      className="w-[20ch]"
                      ref={(el) => setInputRef("id_titulo", el)}
                    />
                    <Input
                      placeholder="Fornecedor"
                      className="max-w-[200px]"
                      ref={(el) => setInputRef("fornecedor", el)}
                    />
                    <Input
                      placeholder="Descrição"
                      className="w-[20ch]"
                      ref={(el) => setInputRef("descricao", el)}
                    />
                    <Input
                      placeholder="Nº Doc"
                      className="w-[20ch]"
                      ref={(el) => setInputRef("num_doc", el)}
                    />
                    <Input
                      placeholder="Filial"
                      className="w-[30ch]"
                      readOnly
                      value={filial}
                      onClick={() => setModalFilialOpen(true)}
                    />
                  </div>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              </AccordionContent>
            </AccordionItem>
          </Accordion> */}
        </DialogHeader>
        <ModalComponent
          isLoading={isLoading}
          pageCount={pageCount}
          refetch={refetch}
          pagination={pagination}
          setPagination={setPagination}
          multiSelection={multiSelection}
          buttonSaveSelection={ButtonSaveSelection}
          handleRemoveAll={handleRemoveAll}
          handleSelectAll={handleSelectAll}
        >
          <table className="w-full border p-1">
            <thead>
              <tr className="text-sm">
                <th className="p-1 max-w-9">ID</th>
                <th className="p-1">Conta Bancária</th>
                <th className="p-1">Valor</th>
                <th className="p-1">Doc</th>
                <th className="p-1">Data</th>
                <th className="p-1">Descrição</th>
              </tr>
            </thead>
            <tbody>
              {data?.rows?.map((item: TransacoesCreditProps, index: number) => {
                const isSelected = ids.includes(
                  `${item.id_conta_bancaria}-${item.documento}`
                );
                const isDeposit = idDepositos.includes(
                  `${item.id_conta_bancaria}-${item.documento}`
                );

                return (
                  <tr
                    key={"transacoes:" + item.id + index}
                    className={`bg-secondary odd:bg-secondary/70 text-secondary-foreground justify-between mb-1 border rounded-md p-1 px-2 ${
                      isSelected &&
                      "bg-secondary/50 text-secondary-foreground/40"
                    }`}
                  >
                    <td className="text-center p-1 max-w-9">
                      {buttonAction(isSelected, isDeposit, item)}
                    </td>
                    <td className="text-xs text-nowrap p-1 text-center">
                      {item.conta_bancaria}
                    </td>
                    <td className="text-xs text-nowrap p-1">
                      {normalizeCurrency(item.valor)}
                    </td>
                    <td className="text-xs text-nowrap p-1">
                      {item.documento}
                    </td>
                    <td className="text-xs text-nowrap p-1 text-center">
                      {normalizeDate(item.data_transacao)}
                    </td>
                    <td className="text-xs text-nowrap p-1 text-center">
                      {item.descricao}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </ModalComponent>
      </DialogContent>
    </Dialog>
  );
};

export default ModalTransacoesCredit;
