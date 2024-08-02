import {
  ModalComponent,
  ModalComponentRow,
} from "@/components/custom/ModalComponent";
import SearchComponent from "@/components/custom/SearchComponent";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { api } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useReducer, useState } from "react";
import { TbCurrencyReal } from "react-icons/tb";
import { newContasProps } from "./ModalMultiInsert";

export type ItemPlanoContas = {
  id: string;
  codigo: string;
  descricao: string;
  tipo: string;
  valor: string;
};

type PaginationProps = {
  pageSize: number;
  pageIndex: number;
};

type State = {
  map: Map<string, newContasProps>;
};

const initialState: State = {
  map: new Map(),
};

type Action =
  | { type: "add"; key: string; value: newContasProps }
  | { type: "remove"; key: string }
  | { type: "reset" };

const mapReducer = (state: State, action: Action) => {
  switch (action.type) {
    case "add":
      state.map.set(action.key, action.value);
      return { ...state };
    case "remove":
      state.map.delete(action.key);
      return { ...state };
    case "reset":
      state.map.clear();
      return { ...state };
    default:
      throw new Error("Unknown action type");
  }
};

// Hook personalizado para manipulação do Map
const useMap = () => {
  const [state, dispatch] = useReducer(mapReducer, initialState);

  const addToMap = useCallback((key: string, value: newContasProps) => {
    dispatch({ type: "add", key, value });
  }, []);

  const removeFromMap = useCallback((key: string) => {
    dispatch({ type: "remove", key });
  }, []);

  const getFromMap = useCallback(
    (key: string) => {
      return state.map.get(key);
    },
    [state.map]
  );

  const resetMap = useCallback(() => {
    dispatch({ type: "reset" });
  }, []);

  return {
    addToMap,
    removeFromMap,
    getFromMap,
    resetMap,
    map: state.map,
  };
};

interface IModalMultiPlanosContas {
  open: boolean;
  id_centro_custo: string;
  centro_custo: string;
  addNewConta: (data: newContasProps) => void;
  onOpenChange: () => void;
  id_matriz?: string | null;
  id_grupo_economico?: string | null;
  tipo?: "Despesa" | "Receita";
  contas: newContasProps[];
}

const ModalMultiPlanosContas = ({
  open,
  id_centro_custo,
  centro_custo,
  addNewConta,
  onOpenChange,
  id_matriz,
  id_grupo_economico,
  tipo,
  contas,
}: IModalMultiPlanosContas) => {
  const [search, setSearch] = useState<string>("");
  const [pagination, setPagination] = useState<PaginationProps>({
    pageSize: 15,
    pageIndex: 0,
  });
  const { addToMap, removeFromMap, getFromMap, resetMap, map } = useMap();
  // const [ids, setIds] = useState<String[]>([]);

  useEffect(() => {
    if (open) {
      contas.forEach((conta) => {
        addToMap(conta.id_plano_contas, conta);
      });
    }
  }, [open]);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: [
      "financeiro",
      "plano_contas",
      "lista",
      { id_matriz, search, id_grupo_economico, tipo },
    ],
    queryFn: async () =>
      await api.get("financeiro/plano-contas", {
        params: {
          filters: { termo: search, id_matriz, id_grupo_economico, tipo },
          pagination,
        },
      }),
    enabled: open,
  });

  async function handleSearch(searchText: string) {
    await new Promise((resolve) => {
      setSearch(searchText);
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
      resolve(true);
    });
    refetch();
  }

  const ButtonSaveSelection = () => {
    return (
      <Button onClick={() => handleSelection()}>Salvar Planos de Contas</Button>
    );
  };

  function handleSelection() {
    const invalidValues = [];
    map.forEach((item) => {
      if (parseFloat(item.valor) < parseFloat(item.realizado)) {
        toast({
          variant: "warning",
          title: "Valor inválido!",
          description: `O plano de contas ${item.plano_contas.toUpperCase()} está com um valor inferior ao permitido`,
        });

        invalidValues.push(item);
        return false;
      }
    });
    if (!invalidValues.length) {
      map.forEach((item) => {
        addNewConta(item);
      });

      resetMap();
      onOpenChange();
    }
  }

  const pageCount = (data && data.data.pageCount) || 0;

  if (isError) return null;
  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[1000px]">
        <DialogHeader>
          <DialogTitle>Lista de plano de contas</DialogTitle>
          <DialogDescription>
            Defina o valor dos planos de contas desejados.
          </DialogDescription>

          <SearchComponent handleSearch={handleSearch} />
        </DialogHeader>

        <ModalComponent
          isLoading={isLoading}
          pageCount={pageCount}
          refetch={refetch}
          pagination={pagination}
          setPagination={setPagination}
          buttonSaveSelection={ButtonSaveSelection}
          multiSelection
        >
          {data?.data?.rows.map((item: ItemPlanoContas, index: number) => {
            // var minValue = 0;
            // if (getFromMap(item.id)?.realizado !== undefined) {
            //   minValue = Number(getFromMap(item.id)?.realizado);
            // }

            const error =
              parseFloat(getFromMap(item.id)?.valor || "0") <
              parseFloat(getFromMap(item.id)?.realizado || "0");
            return (
              <ModalComponentRow
                key={`plano_contas_row: ${item.id} ${index} ${id_centro_custo}`}
              >
                <>
                  <span>
                    {item.codigo} - {item.descricao}
                  </span>
                  <div className={`flex rounded-md `}>
                    <Button
                      variant={"outline"}
                      size={"sm"}
                      disabled
                      className={`rounded-none rounded-l-md border-none ${
                        error && "bg-red-500"
                      }`}
                    >
                      <TbCurrencyReal />
                    </Button>
                    <Input
                      className={`h-9 max-w-24 rounded-none rounded-r-md border-none ${
                        error && "text-red-400"
                      }`}
                      value={getFromMap(item.id)?.valor || ""}
                      type="number"
                      min={getFromMap(item.id)?.realizado || "0"}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (+value > 0) {
                          addToMap(item.id, {
                            id_centro_custo: id_centro_custo,
                            centro_custo: centro_custo,
                            plano_contas: item.codigo + " - " + item.descricao,
                            id_plano_contas: item.id,
                            valor: value,
                            saldo: value,
                            realizado: getFromMap(item.id)?.realizado || "0",
                          });
                        } else {
                          removeFromMap(item.id);
                        }
                      }}
                    />
                  </div>
                </>
              </ModalComponentRow>
            );
          })}
        </ModalComponent>
      </DialogContent>
    </Dialog>
  );
};

export default ModalMultiPlanosContas;
