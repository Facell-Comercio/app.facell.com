import { Skeleton } from '@/components/ui/skeleton';
import { Bar, BarChart, XAxis } from 'recharts';

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import { formatDate } from 'date-fns';
import { useExtratosStore } from '../../../context';
import { getDaysArray, mergeDataWithDays } from '../../../helper';

const chartConfig = {
    pendente: {
        label: "Pendente",
        color: "hsl(var(--destructive))",
    },
    conciliado: {
        label: "Conciliado",
        color: "hsl(var(--primary))",
    },
} satisfies ChartConfig

type DataChart = {
    data_transacao: string,
    conciliado: number,
    pendente: number
}
type ChartConciliacaoPagamentosProps = {
    data: DataChart[],
    isLoading: boolean
}

const ChartConciliacaoPagamentos = ({ data }: ChartConciliacaoPagamentosProps) => {
    if (!data || data.length === 0) {
        return (
            <div className="flex flex-col gap-2">
                <Skeleton className="w-100" />
                <Skeleton className="h-32" />
            </div>
        )
    }

    const mes = useExtratosStore().mes
    const ano = useExtratosStore().ano
    
    const daysArray = getDaysArray(parseInt(ano), parseInt(mes));
    
    const chartData = mergeDataWithDays({days: daysArray, data, defaultProps: {'Conciliado': 0, 'Pendente': 0}});

    return (
        <Card>
            <CardHeader>
                <CardTitle>Conciliação de pagamentos</CardTitle>
            </CardHeader>
            <CardContent>
                <div className='flex h-40 w-full'>
                    <ChartContainer config={chartConfig} className='w-full' >
                        <BarChart accessibilityLayer data={chartData}>
                            <XAxis
                                dataKey="data_transacao"
                                tickLine={false}
                                tickMargin={10}
                                axisLine={false}
                                tickFormatter={(value) => {
                                    let diaSemana = formatDate(value, 'i')
                                    if(diaSemana == '6'){
                                        return 'Sáb'
                                    }
                                    if(diaSemana == '7'){
                                        return 'Dom'
                                    }
                                    return formatDate(value, 'dd')
                                }}
                            />
                            <Bar
                                dataKey="conciliado"
                                stackId="a"
                                fill="var(--color-conciliado)"
                                radius={[0, 0, 4, 4]}
                            />
                            <Bar
                                dataKey="pendente"
                                stackId="a"
                                fill="var(--color-pendente)"
                                radius={[4, 4, 0, 0]}
                            />

                            <ChartTooltip
                                content={
                                <ChartTooltipContent 
                                labelFormatter={(value) => {
                                    return formatDate(value, 'dd/MM/yyyy')
                                  }}
                                />}
                                cursor={false}
                               
                            />
                        </BarChart>
                    </ChartContainer>
                </div>
            </CardContent>
        </Card>
    )
}

export default ChartConciliacaoPagamentos;