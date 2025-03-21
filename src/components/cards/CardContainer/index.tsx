import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardFooter,
  CardDescription,
} from "@/components";
import { ReactNode } from "react";

interface CardContainerProps {
  children: ReactNode;
  title: string;
  footer?: ReactNode;
  description?: string;
}

export const CardContainer = ({
  children,
  title,
  footer,
  description,
}: CardContainerProps) => {
  return (
    <Card>
      <CardHeader className="py-4 -mb-4">
        <CardTitle className="font-poppins font-bold text-lg">
          {title}
        </CardTitle>
        {description ? (
          <CardDescription className="font-montserrat font-medium">
            {description}
          </CardDescription>
        ) : null}
      </CardHeader>
      <CardContent>{children}</CardContent>
      {footer ? <CardFooter>{footer}</CardFooter> : null}
    </Card>
  );
};
