import { api } from '@/lib/axios';
import { useQuery } from '@tanstack/react-query';
import { useStoreUsers } from './store-table';

export const useUsers = () => ({
  getAll: () => {
    const pagination = useStoreUsers().pagination;
    const filters = useStoreUsers().filters;

    return useQuery({
      queryKey: ['user', 'lista', pagination],
      queryFn: async () => {
        const result = await api.get('/users', {
          params: {
            filters: filters,
            pagination,
          },
        });
        return result;
      },
    });
  },
});
