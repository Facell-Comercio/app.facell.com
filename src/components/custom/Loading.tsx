import { Badge, BadgeProps } from "../ui/badge";

type DotsLoadingProps = {
    index?: number,
    size?: number,
    qtde?: number,
    variant?: BadgeProps['variant'],
}
const Dot = ({ size = 3, variant = 'default', index }: DotsLoadingProps) => {
    const delay = (index || 0) * 100;
    return (<Badge variant={variant} className={`px-0 py-0 h-${size} w-${size} animate-bounce delay-${delay} opacity-75`} />)
};

export const DotsLoading = (props: DotsLoadingProps) => {
    return (
        <div className="flex gap-2">
            {Array.from({ length: props.qtde || 3 }, (_, index) => (
                <Dot key={index} index={index} {...props}/>
            ))}
        </div>
    );
}