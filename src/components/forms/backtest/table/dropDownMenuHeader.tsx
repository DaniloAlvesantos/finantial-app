import * as menu from "@/components/ui/dropdown-menu";
import { memo, ReactNode, useCallback } from "react";
import { useFormContext } from "react-hook-form";
import { TicketFormValues } from "../type";

interface DropDownMenuProps {
  children: ReactNode;
  walletNum: number;
}

export const DropDownMenu = memo(
  ({ children, walletNum }: DropDownMenuProps) => {
    const { setValue, control } = useFormContext();

    const EqualAloc = useCallback(() => {
      if (!control._fields.tickets) {
        return;
      }

      let len = 0;
      let keys: number[] = [];

      Array.from(
        control._formValues.tickets as TicketFormValues["tickets"]
      ).forEach((item, idx) => {
        if (item.ticket) {
          len += 1;
          keys.push(idx);
        }
      });

      if (len === 0) {
        return;
      }

      const baseValue = Math.floor(100 / len);
      const remainder = 100 % len;

      keys.forEach((_, i) => {
        const value = i < remainder ? baseValue + 1 : baseValue;
        setValue(`tickets.${i}.wallet${walletNum}`, String(value));
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
