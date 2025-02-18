import { Button } from "@/components/ui";
import { useBackTestStore } from "@/stores/backTest";
import { encodeValues } from "@/utils/encodeValues";
import { File } from "lucide-react";
import { useReward } from "react-rewards";

interface ShareBackTestButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const ShareBackTestButton = ({ ...props }: ShareBackTestButtonProps) => {
  const { formState } = useBackTestStore();
  const { isAnimating, reward } = useReward("confettiReward", "confetti", {
    position: "absolute",
    lifetime: 150,
    decay: 0.9,
    spread: 60,
    elementCount: 100,
    fps: 60,
  });

  const handleEncode = () => {
    const encodeValue = encodeValues({ value: formState });
    console.log(encodeValue);
    reward();
  };

  return (
    <Button
      {...props}
      disabled={isAnimating}
      variant="link"
      className="text-app-green"
      onClick={handleEncode}
      id="confettiReward"
    >
      Link
    </Button>
  );
};

export const GenerateBackTestPDFButton = () => {
  return (
    <Button variant="link" className="group text-app-green gap-0">
      <File className="size-4" />
      <p>PDF</p>
    </Button>
  );
};
