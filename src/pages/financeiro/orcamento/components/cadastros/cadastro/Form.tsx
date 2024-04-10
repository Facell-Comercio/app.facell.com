import FormInput from "@/components/custom/FormInput";
import FormSwitch from "@/components/custom/FormSwitch";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import AlertPopUp from "@/components/custom/AlertPopUp";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/components/ui/use-toast";
import { useOrcamento } from "@/hooks/useOrcamento";
import ModalCentrosCustos from "@/pages/admin/components/ModalCentrosCustos";
import ModalPlanoContas, {
  ItemPlanoContas,
} from "@/pages/financeiro/components/ModalPlanoContas";
import { CentroCustos } from "@/types/financeiro/centro-custos-type";
import { Download, Trash, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { dataFormatada } from "./Modal";
import { cadastroSchemaProps, useFormCadastroData } from "./form-data";
import { useStoreCadastro } from "./store";

const FormCadastro = ({
  id,
  data,
  formRef,
}: {
  id: string | null | undefined;
  data: cadastroSchemaProps;
  formRef: React.MutableRefObject<HTMLFormElement | null>;
}) => {
  console.log("RENDER - Cadastro:", id);
  // const { mutate: insertOne } = useContas().insertOne();
  const { mutate: update } = useOrcamento().update();
  const { mutate: deleteBudget } = useOrcamento().deleteBudget();
  const closeModal = useStoreCadastro().closeModal;
  const { form, contas, appendConta, removeConta } = useFormCadastroData(data);
  const [modalPlanoContasOpen, setModalPlanoContasOpen] = useState(false);
  const [modalCentrosCustoOpen, setModalCentrosCustoOpen] = useState(false);
  const [insertContaIsOpen, setInsertContaIsOpen] = useState(false);
  const [filter, setFilter] = useState("");
  const [newConta, setNewConta] = useState({
    centro_custo: "",
    plano_contas: "",
    id_centro_custo: "",
    id_plano_contas: "",
    valor: "",
  });

  function onSubmitData(data: cadastroSchemaProps) {
    // if (!id) insertOne(data);

    const filteredData: cadastroSchemaProps = {
      id: data.id,
      active: data.active,
      id_filial: data.id_filial,
      id_grupo_economico: data.id_grupo_economico,
      ref: data.ref,
      contas: data.contas?.filter((conta) => {
        const hasId = conta.id_conta;
        const sameValue = conta.valor === conta.valor_inicial;
        if (!hasId || !sameValue) return conta;
      }),
    };

    update(filteredData);

    closeModal();
  }

  function addNewConta() {
    const hasIds = newConta.id_centro_custo && newConta.id_plano_contas;
    const isDuplicated =
      contas.findIndex((conta) => {
        const hasCentroCustos =
          conta.id_centro_custo === newConta.id_centro_custo;
        const hasPlanoContas =
          conta.id_plano_contas === newConta.id_plano_contas;

        return hasCentroCustos && hasPlanoContas;
      }) !== -1;

    if (!hasIds) {
      toast({
        title: "Atenção",
        description:
          "É necessário selecionar um centro de custos e um plano de contas",
        duration: 5000,
      });
    } else if (isDuplicated) {
      toast({
        title: "Conta duplicada",
        description: "Centro de custos e plano de contas já existentes",
        duration: 5000,
      });
    } else {
      appendConta({
        centro_custo: newConta.centro_custo,
        plano_contas: newConta.plano_contas,
        id_centro_custo: newConta.id_centro_custo,
        id_plano_contas: newConta.id_plano_contas,
        valor: newConta.valor,
      });

      setInsertContaIsOpen(false);
      setNewConta({
        centro_custo: "",
        plano_contas: "",
        id_centro_custo: "",
        id_plano_contas: "",
        valor: "",
      });
    }
  }
  function removeItemConta(index: number, id?: string) {
    if (id) deleteBudget(id);
    removeConta(index);
  }

  const ref = data.ref;
  const partesData = ref?.split("-") || dataFormatada.split("-");

  const mes = partesData[1];
  const ano = partesData[0];

  function handleSelectionCentroCustos(item: CentroCustos) {
    setNewConta({
      ...newConta,
      centro_custo: item.nome,
      id_centro_custo: item.id,
    });
    setModalCentrosCustoOpen(false);
  }

  function handleSelectionPlanoContas(item: ItemPlanoContas) {
    setNewConta({
      ...newConta,
      plano_contas: item.codigo + " - " + item.descricao,
      id_plano_contas: item.id,
    });
    setModalPlanoContasOpen(false);
  }

  const searchRef = useRef<HTMLInputElement | null>(null);

  // console.log(form.formState.errors);

  return (
    <div className="flex flex-col gap-4 max-w-full overflow-x-hidden p-2">
      <Form {...form}>
        <div className="flex justify-between text-lg font-medium">
          <span>
            {ref
              ? `Budget: ${mes}/${ano} - ${data.grupo_economico}`
              : "Novo Budget"}
          </span>
          <FormSwitch name="active" label="Ativo" control={form.control} />
        </div>
        <div className="flex justify-between">
          <div className="flex gap-2">
            <Button variant={"outline"}>
              <Upload className="me-2" size={20} />
              Exportar
            </Button>
            <Button variant={"outline"}>
              <Download className="me-2" size={20} />
              Importar
            </Button>
          </div>
          <Button type="button" onClick={() => setInsertContaIsOpen(true)}>
            Novo Item
          </Button>
        </div>
        <div className="flex gap-3">
          <Input
            ref={searchRef}
            type="search"
            placeholder="Pesquisar..."
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setFilter(searchRef.current?.value || "");
              }
            }}
          />
          <Button
            className="dark:bg-purple-500"
            onClick={() => setFilter(searchRef.current?.value || "")}
          >
            Procurar
          </Button>
        </div>
        <div
          className={`flex gap-3 ${
            !insertContaIsOpen
              ? "opacity-0 transition-all -translate-x-1 duration-500 ease-in-out hidden"
              : "opacity-100"
          }`}
        >
          <span
            className="flex-1"
            onClick={() => setModalCentrosCustoOpen(true)}
          >
            <Input
              placeholder="Centro de Custos"
              defaultValue={newConta.centro_custo && newConta.centro_custo}
            />
          </span>
          <ModalCentrosCustos
            handleSelecion={handleSelectionCentroCustos}
            // @ts-expect-error 'Ignore, vai funcionar...'
            onOpenChange={setModalCentrosCustoOpen}
            open={modalCentrosCustoOpen}
            id_filial={data.id_filial}
            closeOnSelection={true}
          />

          <span
            className="flex-1"
            onClick={() => setModalPlanoContasOpen(true)}
          >
            <Input
              placeholder="Plano de contas"
              defaultValue={newConta.plano_contas && newConta.plano_contas}
            />
          </span>
          <ModalPlanoContas
            open={modalPlanoContasOpen}
            id_filial={data.id_filial}
            tipo="Despesa"
            onOpenChange={() =>
              setModalPlanoContasOpen((prev: boolean) => !prev)
            }
            handleSelecion={handleSelectionPlanoContas}
          />
          <Input
            className="flex-1"
            type="number"
            placeholder="Valor"
            value={newConta.valor}
            step={"0.01"}
            onChange={(e) =>
              setNewConta({ ...newConta, valor: e.target.value })
            }
          />
          <Button className="dark:bg-purple-500" onClick={() => addNewConta()}>
            Inserir
          </Button>
        </div>
        <form ref={formRef} onSubmit={form.handleSubmit(onSubmitData)}>
          <div className="w-full flex flex-col gap-2">
            <header className="flex gap-2 w-[98%] mx-auto pr-3 font-medium">
              <span className="flex-1 pr-6">Centro de Custos</span>
              <span className="px-3 w-5/12">Plano de Contas</span>
              <span className="flex-1 px-3">Valor</span>
              <span className="w-1/12"></span>
            </header>
            <ScrollArea className="flex flex-col w-[98%] mx-auto max-h-72 pr-3">
              {contas
                .filter((conta) => {
                  if (filter) {
                    return (
                      conta.centro_custo?.includes(filter.toUpperCase()) ||
                      conta.plano_contas?.includes(filter.toUpperCase())
                    );
                  } else {
                    return conta;
                  }
                })
                .map((item, index) => {
                  return (
                    <div className="flex gap-2 py-1 pl-1" key={item.id}>
                      <Input
                        className="flex-1"
                        value={item.centro_custo}
                        readOnly={true}
                      />
                      <Input
                        className="w-5/12"
                        value={item.plano_contas}
                        readOnly={true}
                      />
                      <FormInput
                        type="number"
                        className="flex-1"
                        name={`contas.${index}.valor`}
                        control={form.control}
                      />
                      <AlertPopUp
                        title="Deseja realmente excluir?"
                        description="Essa ação não pode ser desfeita. A conta será excluída definitivamente do servidor, podendo ser enviada novamente."
                        action={() => removeItemConta(index, item.id_conta)}
                      >
                        <Button
                          type="button"
                          className="w-1/12"
                          variant={"destructive"}
                        >
                          <Trash />
                        </Button>
                      </AlertPopUp>
                    </div>
                  );
                })}
            </ScrollArea>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default FormCadastro;
