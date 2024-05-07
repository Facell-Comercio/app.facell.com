import { Skeleton } from '@/components/ui/skeleton';
import { useTheme } from '@/providers/theme-provider';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

type ChartData = {
    'Crédito': string,
    'Débito': string,
    data_transacao: string,
    'Transações': number,
}
const Chart = ({data, isLoading}:{data: ChartData[], isLoading: boolean}) => {

    const chartData = data?.map((tr:ChartData)=>({
        ...tr, 
        'Crédito': parseFloat(tr['Crédito']),
        'Débito': parseFloat(tr['Débito']),
    })) || []

    if(!chartData){
        return null
    }
    const { theme } = useTheme()
    if(isLoading){
        return (
            <div className="flex flex-col gap-2">
                <Skeleton className="w-100"/>
                <Skeleton className="h-32"/>
            </div>
        )
    }
    
    if(!chartData || chartData?.length === 0){
        return null
    }

    return (
        <ResponsiveContainer width={"100%"} height={200} className={'p-1'}>
            <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <Line type="monotone" format={'currency'} dataKey="Crédito" stroke="#059669" strokeWidth={2} />
                <Line type="monotone" format={'currency'} dataKey="Débito" stroke="#ef4444" strokeWidth={2} />
                <Line type="monotone" format={'integer'} dataKey="Transações" stroke="#71717a" strokeWidth={2} />
                <CartesianGrid stroke={theme === 'dark' ? '#333' : '#ccc'} strokeDasharray="3 3" />
                <XAxis dataKey="data_transacao" />
                <YAxis />
                <Tooltip
                    formatter={(value, props) => {
                        // @ts-ignore
                        if (props?.format === 'currency') {
                            // @ts-ignore
                            return 'R$' + parseFloat(value).toLocaleString('pt-BR', {
                                minimumFractionDigits: 2, maximumFractionDigits: 2,
                            })
                        }
                        return value
                    }}
                    contentStyle={{
                        backgroundColor: theme == 'dark' ? '#111827' : '#f1f5f9',
                    }} />
            </LineChart>
        </ResponsiveContainer>);
}

export default Chart;