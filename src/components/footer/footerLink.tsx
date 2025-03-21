import Link from "next/link";
import { ReactNode } from "react";

interface FooterLinkProps {
  href: string;
  children: string | ReactNode;
  style?: "small" | "extra small";
  target?: "_blank" | "_self";
}

export const FooterLink = ({ href, children, style, target="_self" }: FooterLinkProps) => {
  return (
    <Link
      href={href}
      className={`font-montserrat font-medium ${
        style === "extra small" ? "text-xs" : "text-sm"
      } transition-colors hover:text-app-green`}
      target={target}
    >
      {children}
    </Link>
  );
};
