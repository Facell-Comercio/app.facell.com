import { Skeleton } from '@/components/ui/skeleton';
import { LineChart, Line, CartesianGrid, XAxis } from 'recharts';
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
import { getDaysArray, mergeDataWithDays } from '../../helper';
import { useExtratosStore } from '../../context';


type ChartData = {
    'Crédito': string,
    'Débito': string,
    data_transacao: string,
    'Transações': number,
}

const chartConfig = {
    desktop: {
        label: "Desktop",
        color: "hsl(var(--chart-1))",
    },
    mobile: {
        label: "Mobile",
        color: "hsl(var(--chart-2))",
    },
} satisfies ChartConfig


const ChartTransacoes = ({ data, isLoading }: { data: ChartData[], isLoading: boolean }) => {
    const mes = useExtratosStore().mes
    const ano = useExtratosStore().ano

    if (!data) {
        return null
    }

    if (isLoading) {
        return (
            <div className="flex flex-col gap-2">
                <Skeleton className="w-100" />
                <Skeleton className="h-32" />
            </div>
        )
    }

    const daysArray = getDaysArray(parseInt(ano), parseInt(mes));

    const dataFormatted = data?.map((tr: ChartData) => ({
        ...tr,
        'data_transacao': tr.data_transacao,
        'Crédito': parseFloat(tr['Crédito']),
        'Débito': parseFloat(tr['Débito']),
    })) || []

    // @ts-ignore
    const chartData = mergeDataWithDays({days: daysArray, data: dataFormatted, defaultProps: {'Crédito': 0, 'Débito': 0, 'Transações': 0}});

    if (!chartData || chartData?.length === 0) {
        return null
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Transações</CardTitle>
            </CardHeader>
            <CardContent>
                <div className='flex h-40 w-full'>
                    <ChartContainer config={chartConfig} className='w-full'>
                        <LineChart
                            accessibilityLayer
                            data={chartData}
                            margin={{
                                left: 12,
                                right: 12,
                            }}

                        >
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="data_transacao"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
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
                            <ChartTooltip cursor={false} content={<ChartTooltipContent
                                labelFormatter={(value) => {
                                    return formatDate(value, 'dd/MM/yyyy')
                                }}
                            />}
                            />
                            <Line type="monotone" format={'currency'} dataKey="Crédito" stroke="#059669" strokeWidth={2} />
                            <Line type="monotone" format={'currency'} dataKey="Débito" stroke="#ef4444" strokeWidth={2} />
                            <Line type="monotone" format={'integer'} dataKey="Transações" stroke="#71717a" strokeWidth={2}  />

                        </LineChart>
                    </ChartContainer>
                </div>
            </CardContent>
        </Card>
    )
}

export default ChartTransacoes;