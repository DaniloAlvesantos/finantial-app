import * as table from "@/components/ui/table";
import { ChevronDown } from "lucide-react";
import { DropDownMenu } from "./dropDownMenuHeader";


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
