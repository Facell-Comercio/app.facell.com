import UploadDialog from "@/components/custom/UploadDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/context/auth-store";
import { useUsers } from "@/hooks/useUsers";
import { api } from "@/lib/axios";
import { useQueryClient } from "@tanstack/react-query";
import { Camera, Crown, Key, User } from "lucide-react";
import { Navigate } from "react-router-dom";
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
  const queryClient = useQueryClient();
  const user = useAuthStore().user;
  if (!user?.id) {
    return <Navigate to={"/login"} />;
  }

  const { data } = useUsers().getOne(parseInt(user.id));
  const userData = data?.data;

  const [openModal, modalUploadOpen, openUploadModal, closeUploadModal] =
    useStorePerfil((state) => [
      state.openModal,
      state.modalUploadOpen,
      state.openUploadModal,
      state.closeUploadModal,
    ]);
  for (const key in userData) {
    if (typeof userData[key] === "number") {
      userData[key] = String(userData[key]);
    } else if (userData[key] === null) {
      userData[key] = "";
    } else {
      userData[key] = userData[key];
    }
  }

  async function updateImage(newUrl?: string | null) {
    await api.put(`user/update-img/${user?.id}`, { img_url: newUrl });
    queryClient.invalidateQueries({ queryKey: ["user"] });
    queryClient.invalidateQueries({ queryKey: ["user", user?.id || ""] });
  }

  return (
    <div className="flex flex-col gap-3 pt-10 items-center h-full w-full max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold self-center justify-self-center">
        Página de Perfil
      </h2>
      <div className="flex flex-col lg:flex-row gap-6  w-full justify-between p-4">
        <div className="flex flex-col items-center gap-5">
          <span className="flex items-center justify-center w-40 h-40  border border-secondary rounded-full relative">
            {userData?.img_url ? (
              <img
                src={userData?.img_url || ""}
                alt="Imagem de Perfil"
                className="w-36 h-36 rounded-full object-cover"
              />
            ) : (
              <div className="w-36 h-36 flex items-center justify-center rounded-full text-gray-400 bg-gray-200 dark:text-gray-200 dark:bg-gray-800">
                <User size={80} className="opacity-35" />
              </div>
            )}
            <span
              onClick={() => openUploadModal()}
              className="flex items-center justify-center bg-primary text-primary-foreground hover:bg-blue-500 rounded-full w-10 h-10 b-1 absolute bottom-0 right-0"
            >
              <Camera size={20} />
            </span>
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
                {userData?.permissoes?.map(({ id, nome }: PermissoesProps) => (
                  <Badge key={id + nome} className={`capitalize text-nowrap`}>
                    {nome}
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
                  ({ id, nome, gestor }: DepartamentosProps) => (
                    <Badge
                      key={id + nome}
                      className={`capitalize text-nowrap`}
                    >
                      <div className="relative">
                        {gestor ? <div className="rounded-full p-1 absolute -top-4 -end-2 bg-secondary"><Crown size={10} className=" text-yellow-600"/></div> : null}
                        {nome}
                      </div>
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
                {userData?.filiais?.map(
                  ({ id, nome, gestor }: FiliaisProps) => (
                    <Badge
                      key={id + nome}
                      className={`capitalize text-nowrap`}
                    >
                      <div className="relative">
                        {gestor ? <div className="rounded-full p-1 absolute -top-4 -end-2 bg-secondary"><Crown size={10} className=" text-yellow-600"/></div> : null}
                        {nome}
                      </div>
                    </Badge>
                  )
                )}
              </span>
            </div>
          )}
          {userData?.centros_custo?.length > 0 && (
            <div className="flex gap-2 flex-col">
              <h3 className="font-medium ">Centros de custo</h3>
              <span className="flex gap-1.5 flex-wrap">
                {userData?.centros_custo?.map(
                  ({ id, nome, gestor }: CentroCustoProps) => (
                    <Badge
                      key={id + nome}
                      className={`capitalize text-nowrap`}
                    >
                      <div className="relative">
                        {gestor ? <div className="rounded-full p-1 absolute -top-4 -end-2 bg-secondary"><Crown size={10} className=" text-yellow-600"/></div> : null}
                        {nome}
                      </div>
                    </Badge>
                  )
                )}
              </span>
            </div>
          )}
        </section>
      </div>
      <ModalUpdateSenha id={userData?.id} />
      <UploadDialog
        open={modalUploadOpen}
        folderName="pessoal"
        closeAction={closeUploadModal}
        mediatype="img"
        action={updateImage}
        title={"Selecione uma imagem"}
      />
    </div>
  );
};

export default Perfil;
