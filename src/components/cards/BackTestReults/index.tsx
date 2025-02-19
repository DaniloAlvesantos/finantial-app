import {
  GenerateBackTestPDFButton,
  ShareBackTestButton,
} from "@/components/buttons/shareBacktest";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components";

export const CardBackTestResults = () => {
  return (
    <Card className="w-[20rem]">
      <CardHeader className="border-b p-4">
        <CardTitle className="font-poppins font-bold text-lg">
          Resultados
        </CardTitle>
        <CardDescription className="font-montserrat font-medium text-sm ">
          Compartilhe seu portifolio
        </CardDescription>
      </CardHeader>

      <CardContent className="p-4 flex gap-4 items-center justify-center">
        <ShareBackTestButton />
        <GenerateBackTestPDFButton />
      </CardContent>
    </Card>
  );
};
