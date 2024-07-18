import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { exportToExcel } from '@/helpers/importExportXLS';
import { normalizeDate } from '@/helpers/mask';
import { api } from '@/lib/axios';
import { Download, Eye } from 'lucide-react';
import { ReactNode } from 'react';

export const ItemPainel = ({
  title,
  children,
  className,
  qtde,
  endpoint,
  fn,
  fnTitle,
}: {
  title: string;
  children: ReactNode;
  className?: string;
  qtde: number;
  endpoint?: string;
  fn?: () => void;
  fnTitle?: string;
}) => {
  async function exportItemPainel() {
    const response = await api.get(
      `/financeiro/contas-a-pagar/painel/${endpoint}`
    );
    const rows = response?.data?.rows || [];
    const data = rows.map((obj: any) => {
      const transformedObj: { [key: string]: any } = {};
      for (const key in obj) {
        let newKey = key.toUpperCase().replace('_', ' ');
        let newValue = obj[key];

        if (newKey === 'VALOR') {
          newValue = parseFloat(newValue);
        } else if (newKey.startsWith('DATA')) {
          newValue = normalizeDate(newValue || '');
        }

        transformedObj[newKey] = newValue;
      }
      return transformedObj;
    });

    exportToExcel(data, String(title).toUpperCase());
  }
  return (
    <Card className={`flex-grow-1 xl:last:odd:col-span-2`}>
      <CardHeader className="px-3 py-1.5">
        <CardTitle className="text-lg flex items-center justify-between">
          <span className="flex gap-2">
            {title}
            {fn && (
              <Button
                size={'xs'}
                variant={'secondary'}
                onClick={fn}
                className="text-slate-500 dark:text-white"
                title={fnTitle || ''}
              >
                <Eye size={16} />
              </Button>
            )}
            <Button
              size={'xs'}
              variant={'secondary'}
              className="text-slate-500 dark:text-white"
              title={'Exportação excel'}
              onClick={() => exportItemPainel()}
            >
              <Download size={16} />
            </Button>
          </span>
          <Badge variant={'destructive'} className="text-sm">
            {qtde}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className={`px-3  ${className}`}>{children}</CardContent>
    </Card>
  );
};
