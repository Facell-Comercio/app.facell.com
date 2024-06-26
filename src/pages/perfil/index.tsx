import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUsers } from "@/hooks/useUsers";
import { Camera, Key } from "lucide-react";
import ModalUpdateSenha from "./ModalUpdateSenha";
import { useStorePerfil } from "./store";

type PermissoesProps = {
  id: number;
  id_user: string;
  id_permissao: number;
  nome: string;
};
type DepartamentosProps = {
  id: number;
  id_user: string;
  id_departamento: number;
  gestor: number;
  nome: string;
};
type FiliaisProps = {
  id: number;
  id_user: string;
  id_filial: number;
  gestor: number;
  nome: string;
};
type CentroCustoProps = {
  id: number;
  id_user: string;
  id_centro_custo: number;
  gestor: number;
  nome: string;
};
const Perfil = () => {
  const { data, isLoading } = useUsers().getOne("user");
  const userData = data?.data;

  const openModal = useStorePerfil().openModal;
  for (const key in userData) {
    if (typeof userData[key] === "number") {
      userData[key] = String(userData[key]);
    } else if (userData[key] === null) {
      userData[key] = "";
    } else {
      userData[key] = userData[key];
    }
  }

  return (
    <div className="flex flex-col gap-3 pt-10 items-center h-full w-full max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold self-center justify-self-center">
        Página de Perfil
      </h2>
      <div className="flex flex-col lg:flex-row gap-6  w-full justify-between p-4">
        <div className="flex flex-col justify-between items-center gap-3">
          <span className="flex items-center justify-center w-40 h-40 border border-secondary rounded-full relative">
            <img src={userData?.img_url || ""} className="w-36 rounded-full" />
            <Button
              size={"sm"}
              className="rounded-full w-10 h-10 b-1 absolute bottom-0 right-0"
            >
              <Camera size={20} />
            </Button>
          </span>
          <Button
            variant={"secondary"}
            size={"sm"}
            className="flex gap-3"
            onClick={() => openModal()}
          >
            <Key size={18} />
            Mudar Senha
          </Button>
        </div>
        <section className="flex flex-col mx-auto md:mx-0 gap-3">
          <div className="flex w-full gap-3 flex-wrap">
            <div className="flex-1">
              <label className="font-medium text-md ">Nome</label>
              <Input
                value={userData?.nome || ""}
                className="capitalize min-w-[35ch]"
                readOnly={true}
              />
            </div>
            <div className="flex-1">
              <label className="font-medium text-md">Email</label>
              <Input
                value={userData?.email || ""}
                className="min-w-[35ch]"
                readOnly={true}
              />
            </div>
          </div>
          {userData?.permissoes?.length > 0 && (
            <div className="flex gap-2 flex-col">
              <h3 className="font-medium ">Permissões</h3>
              <span className="flex gap-1.5 flex-wrap">
                {userData?.permissoes?.map((permissao: PermissoesProps) => (
                  <Badge
                    key={permissao.id + permissao.nome}
                    className="capitalize text-nowrap"
                  >
                    {permissao.nome}
                  </Badge>
                ))}
              </span>
            </div>
          )}
          {userData?.departamentos?.length > 0 && (
            <div className="flex gap-2 flex-col">
              <h3 className="font-medium ">Departamentos</h3>
              <span className="flex gap-1.5 flex-wrap">
                {userData?.departamentos?.map(
                  (departamento: DepartamentosProps) => (
                    <Badge
                      key={departamento.id + departamento.nome}
                      className="capitalize text-nowrap"
                    >
                      {departamento.nome}
                    </Badge>
                  )
                )}
              </span>
            </div>
          )}
          {userData?.filiais?.length > 0 && (
            <div className="flex gap-2 flex-col">
              <h3 className="font-medium ">Filiais</h3>
              <span className="flex gap-1.5 flex-wrap">
                {userData?.filiais?.map((filial: FiliaisProps) => (
                  <Badge
                    key={filial.id + filial.nome}
                    className="capitalize text-nowrap"
                  >
                    {filial.nome}
                  </Badge>
                ))}
              </span>
            </div>
          )}
          {userData?.centros_custo?.length > 0 && (
            <div className="flex gap-2 flex-col">
              <h3 className="font-medium ">Centros de custo</h3>
              <span className="flex gap-1.5 flex-wrap">
                {userData?.centros_custo?.map(
                  (centro_custo: CentroCustoProps) => (
                    <Badge
                      key={centro_custo.id + centro_custo.nome}
                      className="capitalize text-nowrap"
                    >
                      {centro_custo.nome}
                    </Badge>
                  )
                )}
              </span>
            </div>
          )}
        </section>
      </div>
      <ModalUpdateSenha id={userData?.id} />
    </div>
  );
};

export default Perfil;
