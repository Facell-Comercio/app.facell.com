export const getDaysArray = (year: number, month: number) => {
    
    const daysInMonth = new Date(year, month, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => new Date(year, month - 1, i + 1).toISOString());
}

type Data = {
    data_transacao: string
}
type mergeDataWithDaysProps = {
    days: string[],
    data: Data[],
    defaultProps: Record<string, any>
}
export const mergeDataWithDays = ({days, data, defaultProps}: mergeDataWithDaysProps) => {
    const dataMap = new Map(data.map(item => [item.data_transacao, item]));

    return days.map(day => {
        if (dataMap.has(day)) {
            return dataMap.get(day);
        } else {
            return {
                ...defaultProps,
                data_transacao: day,
            };
        }
    });
}