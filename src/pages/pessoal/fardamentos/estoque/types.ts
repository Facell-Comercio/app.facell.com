export type ItemEstoqueFardamento = {
  id: number | null | string;
  grupo_economico: string;
  uf: string;
  modelo: string;
  tamanho: string;
  sexo: string;
  permite_concessao: boolean;
  preco: number;
  saldo: number;  
};