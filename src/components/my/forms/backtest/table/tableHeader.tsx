import * as table from "@/components/ui/table";
import * as menu from "@/components/ui/dropdown-menu";
import { memo, ReactNode, useCallback } from "react";
import { ChevronDown } from "lucide-react";
import { useFormContext } from "react-hook-form";

type Teste = {
  ticket: string;
  wallet1: number | null;
  wallet2: number | null;
  wallet3: number | null;
};

const DropDownMenu = memo(
  ({ children, walletNum }: { children: ReactNode; walletNum: number }) => {
    const { setValue, control } = useFormContext();

    const EqualAloc = useCallback(() => {
      if (!control._fields.tickets) {
        return;
      }

      let len = 0;
      let keys: number[] = [];

      Array.from(control._formValues.tickets as Teste[]).forEach(
        (item, idx) => {
          if (item.ticket) {
            len += 1;
            keys.push(idx);
          }
        }
      );

      if (len === 0) {
        return;
      }

      const baseValue = Math.floor(100 / len);
      const remainder = 100 % len;

      keys.forEach((_, i) => {
        const value = i < remainder ? baseValue + 1 : baseValue;
        setValue(`tickets.${i}.wallet${walletNum}`, value);
      });
    }, []);

    return (
      <menu.DropdownMenu>
        <menu.DropdownMenuTrigger>{children}</menu.DropdownMenuTrigger>
        <menu.DropdownMenuContent>
          <menu.DropdownMenuItem onClick={EqualAloc}>
            Equalizar alocações
          </menu.DropdownMenuItem>
          <menu.DropdownMenuItem>Normalizar alocações</menu.DropdownMenuItem>
        </menu.DropdownMenuContent>
      </menu.DropdownMenu>
    );
  }
);

export const TableFormHeader = () => {
  return (
    <table.TableHeader>
      <table.TableRow>
        <table.TableHead className="w-16 sm:w-[6.25rem]">
          Ticket
        </table.TableHead>
        <table.TableHead className="w-16 relative text-ellipsis">
          Carteira-1
          <DropDownMenu walletNum={1}>
            <ChevronDown className="sm:absolute sm:top-2 sm:mx-2 transition-colors ease duration-300 text-app-green hover:bg-app-green/40 rounded-full" />
          </DropDownMenu>
        </table.TableHead>
        <table.TableHead className="w-16 relative text-ellipsis">
          Carteira-2
          <DropDownMenu walletNum={2}>
            <ChevronDown className="sm:absolute sm:top-2 sm:mx-2 transition-colors ease duration-300 text-app-green hover:bg-app-green/40 rounded-full" />
          </DropDownMenu>
        </table.TableHead>
        <table.TableHead className="w-16 relative text-ellipsis">
          Carteira-3
          <DropDownMenu walletNum={3}>
            <ChevronDown className="sm:absolute sm:top-2 sm:mx-2 transition-colors ease duration-300 text-app-green hover:bg-app-green/40 rounded-full" />
          </DropDownMenu>
        </table.TableHead>
      </table.TableRow>
    </table.TableHeader>
  );
};
