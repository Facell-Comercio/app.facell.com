import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { GetAllParams } from "@/types/query-params-type";
import { UserFormData } from "@/pages/admin/users/user/form-data";
import { toast } from "@/components/ui/use-toast";

export const useUsers = () => {
    const queryClient = useQueryClient()
    return {
        getAll: (params: GetAllParams) => {
            return useQuery({
                queryKey: [`users`, params],
                placeholderData: keepPreviousData,
                queryFn: async () => {
                    const result = await api.get('/user', { params })
                    return result;
                }
            })
        },
        getOne: (id: string | undefined) => useQuery({
            enabled: !!id,
            queryKey: [`user`, id],
            queryFn: async () => {
                return await api.get(`user/${id}`)
            },
        }),

        insertOne: () => useMutation({
            mutationFn: (data: UserFormData) => {
                return api.post("user", data).then((response) => response.data)
            },
            onSuccess() {
                toast({title: 'Sucesso!', description: 'Usuário inserido com sucesso.'})
                queryClient.invalidateQueries({ queryKey: ['users'] })
            },
            onError(error) {
                toast({title: 'Ocorreu o seguinte erro', description: error.message})
                console.log(error);
            },
        }),

        update: () => useMutation({
            mutationFn: ({ id, ...rest }: UserFormData) => {
                return api.put("user", { id, ...rest }).then((response) => response.data)
            },
            onSuccess() {
                toast({title: 'Sucesso!', description: 'Usuário atualizado com sucesso.'})
                queryClient.invalidateQueries({ queryKey: ['users'] })
                queryClient.invalidateQueries({ queryKey: ['user'] })
            },
            onError(error) {
                toast({title: 'Ocorreu o seguinte erro', description: error.message})
                console.log(error);
            },
        })
    }
}