import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReactNode } from "react";

export const ItemPainel = ({
  title,
  children,
  className,
  qtde,
}: {
  title: string;
  children: ReactNode;
  className?: string;
  qtde: number;
}) => {
  return (
    <Card className={`${!qtde && "hidden"}`}>
      <CardHeader className="px-3 py-1.5">
        <CardTitle className="text-lg flex items-center justify-between">
          <span>{title}</span>{" "}
          <Badge variant={"destructive"} className="text-sm">
            {qtde}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className={`px-3 ${className}`}>{children}</CardContent>
    </Card>
  );
};
