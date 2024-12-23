import { useAuthStore } from "@/context/auth-store";
import { UserDepartamento } from "@/types/user-type";

export const hasPermission = (permission: string | number | string[]) => {
  const user = useAuthStore.getState().user;
  const tipo = typeof permission;

  if (!user) return false;
  if (tipo !== "string" && tipo !== "number" && !(permission instanceof Array)) return false;
  if (!user.permissoes || user.permissoes?.length === 0) {
    return false;
  }
  if (tipo === "number") {
    const index = user.permissoes.findIndex((perm) => perm.id_permissao === permission);
    return index >= 0;
  }
  if (tipo === "string") {
    const index = user.permissoes.findIndex((perm) => perm.nome === permission);
    return index >= 0;
  }
  if (permission instanceof Array) {
    const index = user.permissoes.findIndex((perm) => {
      return permission.includes(perm.nome);
    });
    return index >= 0;
  }
  return false;
};

export const hasModuleAccess = (permission: string) => {
  const user = useAuthStore.getState().user;
  const tipo = typeof permission;

  if (!user) return false;

  if (tipo === "string") {
    return user.permissoes.some((perm) => perm.modulo === permission);
  }

  return false;
};

export const checkUserDepartments = (depart: string | number, gestor?: boolean) => {
  const user = useAuthStore.getState().user;
  const tipo = typeof depart;

  if (!user) return false;
  if (tipo !== "string" && tipo !== "number") return false;
  if (!user.departamentos || user.departamentos?.length === 0) {
    return false;
  }
  if (tipo === "number") {
    if (gestor !== undefined) {
      return (
        user.departamentos.findIndex(
          // @ts-ignore "Vai funcionar"
          (userDepart: UserDepartamento) =>
            userDepart.id_departamento === depart && !!userDepart.gestor === gestor
        ) >= 0
      );
    }
    return (
      user.departamentos.findIndex(
        (userDepart: UserDepartamento) => userDepart.id_departamento === depart
      ) >= 0
    );
  }
  if (tipo === "string") {
    if (gestor !== undefined) {
      return (
        user.departamentos.findIndex(
          // @ts-ignore "Vai funcionar"
          (userDepart: UserDepartamento) =>
            userDepart.nome === depart && !!userDepart.gestor === gestor
        ) >= 0
      );
    }
    return user.departamentos.findIndex((userDepart) => userDepart.nome === depart) >= 0;
  }
  return false;
};
