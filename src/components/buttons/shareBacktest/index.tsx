import { Button, Dialog, Label, Input } from "@/components/ui";
import { useBackTestStore } from "@/stores/backTest";
import { encodeValues } from "@/utils/encodeValues";
import { File, Link, Copy } from "lucide-react";
import { useMemo } from "react";
import { useReward } from "react-rewards";

const DialogContent = () => {
  const { formState } = useBackTestStore();
  const { isAnimating, reward } = useReward("confettiReward", "confetti", {
    position: "absolute",
    lifetime: 150,
    decay: 0.9,
    spread: 60,
    elementCount: 100,
    fps: 60,
    zIndex: 100,
  });

  const encodedValue = useMemo(
    () => encodeValues({ value: formState }),
    [formState]
  );
  const shareLink = `${location.origin}/share/${encodedValue}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareLink);
    navigator.vibrate(150);
    reward();
  };

  return (
    <Dialog.DialogContent>
      <Dialog.DialogHeader>
        <Dialog.DialogTitle className="font-poppins">
          Copiar Link
        </Dialog.DialogTitle>
        <Dialog.DialogDescription className="font-montserrat text-xs">
          Clique no botão "Copiar", para copiar o link de compartilhamento.
        </Dialog.DialogDescription>
      </Dialog.DialogHeader>
      <div className="flex items-center space-x-2">
        <div className="grid flex-1 gap-2">
          <Label htmlFor="link" className="sr-only">
            Link
          </Label>
          <Input
            id="link"
            value={shareLink}
            readOnly
            className="font-montserrat"
          />
        </div>
        <Button
          type="button"
          size="sm"
          className="px-3 relative bg-app-green hover:bg-app-green/60"
          onClick={handleCopy}
          disabled={isAnimating}
          id="confettiReward"
        >
          <span className="sr-only">Copy</span>
          <Copy />
        </Button>
      </div>
      <Dialog.DialogFooter>
        <Dialog.DialogClose asChild>
          <Button
            type="button"
            className="bg-red-600 hover:bg-red-500 font-montserrat"
          >
            Fechar
          </Button>
        </Dialog.DialogClose>
      </Dialog.DialogFooter>
    </Dialog.DialogContent>
  );
};

interface ShareBackTestButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const ShareBackTestButton = ({ ...props }: ShareBackTestButtonProps) => {
  return (
    <Dialog.Dialog>
      <Dialog.DialogTrigger asChild>
        <Button
          {...props}
          className="text-app-pale bg-app-green hover:bg-app-green/70"
        >
          <Link />
          Link
        </Button>
      </Dialog.DialogTrigger>
      <DialogContent />
    </Dialog.Dialog>
  );
};

export const GenerateBackTestPDFButton = () => {
  return (
    <Button className="text-app-pale bg-app-green hover:bg-app-green/70">
      <File className="size-4" />
      <p>PDF</p>
    </Button>
  );
};
