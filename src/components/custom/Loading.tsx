import { Badge, BadgeProps } from "../ui/badge";

type DotsLoadingProps = {
    index?: number,
    size?: number,
    qtde?: number,
    variant?: BadgeProps['variant'],
}
const Dot = ({ size = 10, variant = 'default', index }: DotsLoadingProps) => {

    const delay = (index ?? 0) * 200;

    return (<Badge
        variant={variant}
        className={`me-1 aspect-square px-0 py-0 animate-bounce opacity-75`}
        style={{
            animationDelay: `${delay}ms`,
            height: `${size}px`,
            width: `${size}px`,
        }}
    />)
};

export const DotsLoading = (props: DotsLoadingProps) => {
    return (
        <div className="inline-block flex-nowrap flex-1 flex-shrink-0">
            {Array.from({ length: props.qtde || 3 }, (_, index) => (
                <Dot key={index} index={index} {...props} />
            ))}
        </div>
    );
}