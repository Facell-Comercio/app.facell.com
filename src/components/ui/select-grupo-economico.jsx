import { useEffect, useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select'; // Assuming these are custom components
import { useQuery } from '@tanstack/react-query';
import { useApi } from '@/hooks/use-api';

const SelectGrupoEconomico = ({ value, onChange, showAll = false }) => {
  // Use a single state variable for fetching and storing data
  const [gruposEconomicos, setGruposEconomicos] = useState([]);

  const { data, isError, isLoading } = useQuery({
    queryKey: ['gruposEconomicos'],
    queryFn: async () => {
      const fetchedData = await useApi().grupo_economico.get();
      return fetchedData;
    },
    onError: (error) => {
      console.error('Error fetching grupos econômicos:', error);
      // Handle errors appropriately, e.g., display an error message or fallback UI
    },
  });

  useEffect(() => {
    if (data) {
      setGruposEconomicos(data);
    }
  }, [data]);

  if (isLoading) return <div>Carregando grupos econômicos...</div>; // Provide loading UI

  if (isError) return <div>Erro ao carregar grupos econômicos</div>; // Handle errors

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Grupo econômico" />
      </SelectTrigger>
      <SelectContent>
        {showAll && <SelectItem value={null}>Todos grupos</SelectItem>}
        {gruposEconomicos.map((item) => (
          <SelectItem className='text-left' key={item.id} value={item.id}>
            {item.nome}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default SelectGrupoEconomico;
