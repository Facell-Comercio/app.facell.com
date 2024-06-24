import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye } from "lucide-react";
import { ReactNode } from "react";

export const ItemPainel = ({
  title,
  children,
  className,
  qtde,
  fn,
}: {
  title: string;
  children: ReactNode;
  className?: string;
  qtde: number;
  fn?: () => void;
}) => {
  return (
    <Card className={`flex-grow-1 xl:last:odd:col-span-2 ${!qtde && "hidden"}`}>
      <CardHeader className="px-3 py-1.5">
        <CardTitle className="text-lg flex items-center justify-between">
          <span className="flex gap-4">
            {title}
            {fn && (
              <Button
                size={"xs"}
                variant={"secondary"}
                onClick={fn}
                className="text-slate-500 dark:text-white"
              >
                <Eye size={16} />
              </Button>
            )}
          </span>
          <Badge variant={"destructive"} className="text-sm">
            {qtde}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className={`px-3  ${className}`}>{children}</CardContent>
    </Card>
  );
};
