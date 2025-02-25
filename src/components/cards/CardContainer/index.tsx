import { Card, CardTitle, CardHeader, CardContent } from "@/components";
import { ReactNode } from "react";

interface CardContainerProps {
  children: ReactNode;
  title: string;
}

export const CardContainer = ({ children, title }: CardContainerProps) => {
  return (
    <Card className="my-4">
      <CardHeader className="py-4 -mb-4">
        <CardTitle className="font-poppins font-bold text-lg">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
};
