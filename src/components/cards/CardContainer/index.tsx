import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components";
import { ReactNode } from "react";

interface CardContainerProps {
  children: ReactNode;
  title: string;
  footer?: ReactNode;
}

export const CardContainer = ({
  children,
  title,
  footer,
}: CardContainerProps) => {
  return (
    <Card className="my-4">
      <CardHeader className="py-4 -mb-4">
        <CardTitle className="font-poppins font-bold text-lg">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
      {!!footer ? <CardFooter>{footer}</CardFooter> : null}
    </Card>
  );
};
