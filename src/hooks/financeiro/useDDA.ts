import { api } from "@/lib/axios";
import {
  keepPreviousData,
  useQuery,
} from "@tanstack/react-query";

export interface GetDDAProps {
  pagination?: {
    pageIndex?: number;
    pageLength?: number;
  };
  filters: any;
}

export type VinculoDDAparams = {
  id_vencimento: number | string,
  id_dda: number | string,
} 

export const useDDA = () => {

  const getAllDDA = ({ pagination, filters }: GetDDAProps) =>
    useQuery({
      queryKey: ["fin_dda", pagination, filters],
      staleTime: 0,
      retry: false,
      queryFn: async () => {
        return await api.get(`/financeiro/contas-a-pagar/dda/`, {
          params: { pagination, filters },
        });
      },
      placeholderData: keepPreviousData,
    });

    const importDDA = (files: FileList | null)=>{
      return new Promise(async(resolve, reject)=>{
        try {
          const form = new FormData()
          if(files){
            for (let i = 0; i < files.length; i++) {
              form.append('files', files[i])
            }
          }
          const result = await api.postForm('/financeiro/contas-a-pagar/dda/import', form)
          resolve(result.data)
          
        } catch (error) {
          reject(error)
        }
      })
    }

    const exportDDA = (filters: any)=>{
      return new Promise(async(resolve, reject)=>{
        try {
          const result = await api.post('/financeiro/contas-a-pagar/dda/export', { filters })
          resolve(result.data)
          
        } catch (error) {
          reject(error)
        }
      })
    }

    const limparDDA = ()=>{
      return new Promise(async(resolve, reject)=>{
        try {
          const result = await api.post('/financeiro/contas-a-pagar/dda/limpar')
          resolve(result.data)
          
        } catch (error) {
          reject(error)
        }
      })
    }

    const autoVincularDDA = ()=>{
      return new Promise(async(resolve, reject)=>{
        try {
          const result = await api.post('/financeiro/contas-a-pagar/dda/auto-vincular')
          resolve(result.data)
          
        } catch (error) {
          reject(error)
        }
      })
    }

    const vincularDDA = (params: VinculoDDAparams)=>{
      return new Promise(async(resolve, reject)=>{
        try {
          const result = await api.post('/financeiro/contas-a-pagar/dda/vincular', {...params})
          resolve(result.data)
          
        } catch (error) {
          reject(error)
        }
      })
    }


  return {
    getAllDDA,
    importDDA,
    exportDDA,
    limparDDA,
    autoVincularDDA,
    vincularDDA,
  };
};
