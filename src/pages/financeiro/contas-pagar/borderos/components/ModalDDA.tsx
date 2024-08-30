import AlertPopUp from "@/components/custom/AlertPopUp";
import {
  ModalComponent,
  ModalComponentRow,
} from "@/components/custom/ModalComponent";
import { SelectMultiFilial } from "@/components/custom/SelectFilial";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DatePickerWithRange } from "@/components/ui/date-range";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { normalizeCurrency } from "@/helpers/mask";
import { useDDA } from "@/hooks/financeiro/useDDA";
import ModalFindItemsBordero from "@/pages/financeiro/components/ModalFindItemsBordero";
import { DDA } from "@/types/financeiro/dda-type";
import { formatDate } from "date-fns";
import { Eraser, Filter } from "lucide-react";
import { useEffect, useState } from "react";
import { copyToClipboard } from "../../titulos/titulo/helpers/helper";
import { useStoreDDA } from "./storeDDA";

type DataProps = {
  description: string;
  item: any;
};

type PaginationProps = {
  pageSize: number;
  pageIndex: number;
};

export const ModalDDA = () => {
  const [
    id_vencimento,
    id_forma_pagamento,
    modalOpen,
    filters,
    toggleModal,
    setFilters,
    clearFilters,
  ] = useStoreDDA((state) => [
    state.id_vencimento,
    state.id_forma_pagamento,
    state.modalOpen,
    state.filters,
    state.toggleModal,
    state.setFilters,
    state.clearFilters,
  ]);

  const resetFilters = () => {
    clearFilters();
    setTimeout(() => {
      refetch();
    }, 300);
  };

  useEffect(() => {}, [filters]);

  const [pagination, setPagination] =
    useState<PaginationProps>({
      pageSize: 15,
      pageIndex: 0,
    });

  const { data, isLoading, refetch } =
    useDDA().getAllDDA({
      pagination,
      filters,
    });

  const { mutate: mutateVincularDDA } =
    useDDA().vincularDDA();
  const { mutate: mutateDesvincularDDA } =
    useDDA().desvincularDDA();

  const vincularDDA = async ({
    id_dda,
    id_vencimento: idVencimento,
    id_forma_pagamento: idFormaPagamento,
  }: VinculoDDA) => {
    if (!id_dda) {
      throw new Error("ID DDA não informado!");
    }
    if (!idVencimento) {
      throw new Error(
        "ID Vencimento não informado!"
      );
    }
    if (!idFormaPagamento) {
      throw new Error(
        "ID Forma Pagamento não informado!"
      );
    }

    mutateVincularDDA({
      id_dda,
      id_vencimento: idVencimento,
      id_forma_pagamento: idFormaPagamento || "",
    });
    // toast({
    //   variant: "success",
    //   title: `Vínculo do DDA com ${
    //     idFormaPagamento === 6
    //       ? "a fatura"
    //       : "o vencimento"
    //   } realizado!`,
    // });
    if (
      id_dda &&
      idVencimento &&
      idFormaPagamento
    ) {
      toggleModal(false);
    }
  };

  const handleClickVincular = async ({
    id_dda,
    id_vencimento,
    id_forma_pagamento,
  }: VinculoDDA) => {
    await vincularDDA({
      id_dda,
      id_vencimento,
      id_forma_pagamento,
    });
  };

  const handleClickDesvincular = async ({
    id_dda,
  }: {
    id_dda: number;
  }) => {
    if (!id_dda) {
      throw new Error("ID DDA não informado!");
    }
    mutateDesvincularDDA({ id_dda });

    if (id_vencimento) {
      toggleModal(false);
    }
  };

  const [
    modalVencimentosOpen,
    setModalVencimentosOpen,
  ] = useState<boolean>(false);
  const [dialogDDAopen, setDialogDDAopen] =
    useState<boolean>(false);
  type VinculoDDA = {
    id_vencimento: number | null;
    id_dda: number | null;
    id_forma_pagamento: number | null;
  };
  const [preVinculoDDA, setPreVinculoDDA] =
    useState<VinculoDDA>({
      id_vencimento: null,
      id_dda: null,
      id_forma_pagamento: null,
    });

  const handleClickBuscarVencimento = ({
    id_dda,
  }: {
    id_dda: number;
  }) => {
    setPreVinculoDDA((prev) => ({
      ...prev,
      id_dda: id_dda,
    }));
    setModalVencimentosOpen(true);
  };
  const handleSelectVencimento = (
    vencimento: any
  ) => {
    setPreVinculoDDA((prev) => ({
      ...prev,
      id_forma_pagamento:
        vencimento.id_forma_pagamento,
      id_vencimento: vencimento.id_vencimento,
    }));
    setDialogDDAopen(true);
  };

  const [qrCode, setQrCode] = useState<
    string | null
  >(null);
  const handleCopyQrCode = async (
    qr_code: string
  ) => {
    const result = await copyToClipboard(qr_code);
    if (result) {
      setQrCode(qr_code);
      setTimeout(() => {
        setQrCode(null);
      }, 3000);
    }
  };
  const columns = [
    {
      id: "id",
      header: "ID",
      size: 40,
    },
    {
      id: "cnpj_filial",
      header: "CNPJ FILIAL",
      size: 115,
    },
    {
      id: "cnpj_fornecedor",
      header: "CNPJ FORNECEDOR",
      size: 115,
    },
    {
      id: "data_emissao",
      header: "DATA EMISSÃO",
      size: 80,
      cell: (val: string) =>
        formatDate(val, "dd/MM/yyyy"),
    },
    {
      id: "data_vencimento",
      header: "DATA VENCIMENTO",
      size: 80,
      cell: (val: string) =>
        formatDate(val, "dd/MM/yyyy"),
    },
    {
      id: "documento",
      header: "DOCUMENTO",
      size: 90,
    },
    {
      id: "valor",
      header: "VALOR",
      size: 90,
      cell: (val: any) => normalizeCurrency(val),
    },
    {
      id: "nome_fornecedor",
      header: "NOME FORNECEDOR",
      size: 200,
    },
    {
      id: "cod_barras",
      header: "CÓD. BARRAS",
      size: 320,
      cell: (val: any) => {
        if (qrCode === val) {
          return (
            <span className="text-green-600">
              Copiado!
            </span>
          );
        }
        return (
          <div
            onClick={() => handleCopyQrCode(val)}
            className="cursor-pointer overflow-auto scroll-thin"
          >
            {val}
          </div>
        );
      },
    },
  ];

  const header = (
    <div className="flex items-center text-xs py-2 rounded-md bg-secondary">
      {columns.map((col, index) => (
        <span
          key={`${col.id} ${index}`}
          className="text-center"
          style={{ width: col.size + "px" }}
        >
          {col.header}
        </span>
      ))}
    </div>
  );

  // const dataRows = data?.data?.rows.map((item: DDA) => ({
  //   description: `${item.id} - ${normalizeCnpjNumber(item.cnpj_filial)
  //     } - ${normalizeCnpjNumber(item.cnpj_fornecedor)} - ${formatDate(item.data_vencimento, 'dd/MM/yyyy')} - ${normalizeCurrency(item.valor)} - ${item.nome_fornecedor} - ${item.cod_barras}`,
  //   item,
  // }));
  const rows = data?.data?.rows || [];
  const valorTotal = rows.reduce(
    (acc: number, curr: { valor: string }) =>
      acc + parseFloat(curr.valor),
    0
  );

  const totalizador = (
    <div className="flex gap-3">
      <Badge variant={"secondary"}>
        Qtde: {rows.length}
      </Badge>
      <Badge variant={"secondary"}>
        Total: {normalizeCurrency(valorTotal)}
      </Badge>
    </div>
  );

  const dataRows = rows.map((item: DDA) => ({
    description: columns.map((col) => {
      // @ts-ignore
      let val = item[col.id];
      if (col.cell !== undefined) {
        val = col.cell(val);
      }
      return (
        <span style={{ width: col.size }}>
          {val}
        </span>
      );
    }),
    item: item,
  }));

  const pageCount =
    (data && data.data.pageCount) || 0;
  // if (isError) return null;
  if (!modalOpen) return null;

  return (
    <Dialog
      open={modalOpen}
      onOpenChange={toggleModal}
    >
      <DialogContent className="flex flex-col max-w-fit overflow-auto scroll-thin">
        {/* <ModalVencimentos
          multiSelection={false}
          initialFilters={{ dda: false }}
          handleSelection={handleSelectVencimento}
          open={modalVencimentosOpen}
          // @ts-ignore
          onOpenChange={setModalVencimentosOpen}
        /> */}
        <ModalFindItemsBordero
          open={modalVencimentosOpen}
          handleSelection={handleSelectVencimento}
          closeOnSelection
          onOpenChange={setModalVencimentosOpen}
          initialFilters={{ dda: false }}
        />

        <AlertDialog
          open={dialogDDAopen}
          onOpenChange={setDialogDDAopen}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Deseja realmente vincular?
              </AlertDialogTitle>
              <AlertDialogDescription>
                Você está prestes a vincular o DDA
                ID: {preVinculoDDA.id_dda} com o
                Vencimento ID:
                {preVinculoDDA.id_vencimento}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  vincularDDA(preVinculoDDA);
                }}
              >
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <DialogHeader>
          <DialogTitle>
            DDA - Lista de boletos
          </DialogTitle>
          <DialogDescription>
            {id_vencimento
              ? `Escolha um  boleto para vincular com o vencimento ${id_vencimento}.`
              : "Clique em vincular para conectar um boleto a um vencimento a pagar."}
          </DialogDescription>

          <div className="grid grid-cols-[200px_1fr] gap-3 border rounded-md dark:border-slate-800 p-2">
            <div className="flex gap-2 items-center">
              <Button
                size={"sm"}
                onClick={() => {
                  refetch();
                }}
              >
                <Filter
                  size={18}
                  className="me-2"
                />
                Filtrar
              </Button>
              <Button
                size={"sm"}
                variant={"secondary"}
                onClick={resetFilters}
              >
                <Eraser
                  size={18}
                  className="me-2"
                />
                Resetar
              </Button>
            </div>
            <div className="flex gap-3 overflow-auto scroll-thin">
              <SelectMultiFilial
                className="min-w-fit"
                value={
                  filters?.filiais_list || []
                }
                onChange={(filiais) => {
                  console.log(filiais);

                  setFilters({
                    filiais_list: [...filiais],
                  });
                }}
              />

              <Select
                value={
                  filters?.tipo_data ||
                  "data_vencimento"
                }
                onValueChange={(val) => {
                  setFilters({
                    tipo_data: val,
                  });
                }}
              >
                <SelectTrigger>
                  <SelectValue></SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="data_vencimento">
                    Vencimento
                  </SelectItem>
                  <SelectItem value="data_emissao">
                    Emissão
                  </SelectItem>
                </SelectContent>
              </Select>

              <DatePickerWithRange
                date={filters.range_data}
                setDate={(range_data) => {
                  setFilters({
                    range_data: range_data,
                  });
                }}
              />

              <Input
                value={
                  filters.nome_fornecedor || ""
                }
                onChange={(e) =>
                  setFilters({
                    nome_fornecedor:
                      e.target.value,
                  })
                }
                placeholder="NOME FORNECEDOR"
                className="min-w-[23ch]"
              />

              <Input
                value={filters.cod_barras || ""}
                onChange={(e) =>
                  setFilters({
                    cod_barras: e.target.value,
                  })
                }
                placeholder="CÓD. BARRAS"
                className="min-w-[44ch]"
              />
            </div>
          </div>
          {totalizador}
        </DialogHeader>
        <div className="flex flex-col gap-2">
          {header}
          <ModalComponent
            isLoading={isLoading}
            pageCount={pageCount}
            refetch={refetch}
            pagination={pagination}
            setPagination={setPagination}
            className="max-h-[45vh]"
          >
            <table className="w-full p-1">
              {dataRows &&
                dataRows.map(
                  (
                    row: DataProps,
                    index: number
                  ) => (
                    <ModalComponentRow
                      key={
                        "modal_dda_item_row:" +
                        index +
                        row.item
                      }
                    >
                      <div className="flex gap-2 w-full">
                        <div
                          className="flex items-center text-sm flex-1"
                          title={
                            row.item
                              .id_vencimento &&
                            "Vinculado com vencimento: " +
                              String(
                                row.item
                                  .id_vencimento
                              )
                          }
                        >
                          {row.description}
                        </div>
                        <div className="items-center flex">
                          {row.item
                            .id_vencimento ||
                          row.item.id_fatura ? (
                            row.item
                              .status_vencimento ==
                            "pago" ? (
                              <Button
                                variant={
                                  "success"
                                }
                                size={"xs"}
                                disabled
                                title={String(
                                  row.item
                                    .id_vencimento
                                )}
                              >
                                Vinculado
                              </Button>
                            ) : (
                              <AlertPopUp
                                title="Deseja realmente desvincular o boleto do vencimento?"
                                description="Você poderá vincular novamente..."
                                action={() =>
                                  handleClickDesvincular(
                                    {
                                      id_dda:
                                        row.item
                                          .id,
                                    }
                                  )
                                }
                              >
                                <Button
                                  size={"xs"}
                                  variant={
                                    "destructive"
                                  }
                                >
                                  Desvincular
                                </Button>
                              </AlertPopUp>
                            )
                          ) : id_vencimento ? (
                            // Esse botão vinculará o DDA escolhido com o id_vencimento recebido no parâmetro:
                            <AlertPopUp
                              title="Deseja realmente vincular o boleto com o vencimento?"
                              description="A ação não poderá ser desfeita!"
                              action={() => {
                                handleClickVincular(
                                  {
                                    id_dda:
                                      row.item.id,
                                    id_vencimento:
                                      parseInt(
                                        id_vencimento
                                      ),
                                    id_forma_pagamento:
                                      parseInt(
                                        id_forma_pagamento ||
                                          "0"
                                      ),
                                  }
                                );
                              }}
                            >
                              <Button
                                size={"xs"}
                                variant={
                                  "warning"
                                }
                              >
                                Vincular
                              </Button>
                            </AlertPopUp>
                          ) : (
                            // Esse botão abrirá um modal de vencimentos para seleção e vinculação:
                            <Button
                              variant={"warning"}
                              size={"xs"}
                              onClick={() => {
                                handleClickBuscarVencimento(
                                  {
                                    id_dda:
                                      row.item.id,
                                  }
                                );
                              }}
                            >
                              Vincular
                            </Button>
                          )}
                        </div>
                      </div>
                    </ModalComponentRow>
                  )
                )}
            </table>
          </ModalComponent>
        </div>
      </DialogContent>
    </Dialog>
  );
};
