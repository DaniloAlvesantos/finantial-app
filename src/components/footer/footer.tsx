import { Button } from "@/components/ui";
import { FooterLink } from "./footerLink";

export const Footer = () => {
  return (
    <footer className="w-full flex flex-col items-center text-center sm:text-start gap-4 border-t-2 p-8 relative">
      <main className="">
        <nav className="flex flex-col sm:flex-row sm:gap-4">
          <FooterLink style="small" href="">
            FAQs
          </FooterLink>
          <FooterLink style="small" href="">
            Sobre nos
          </FooterLink>
          <FooterLink
            target="_blank"
            style="small"
            href="https://docs.google.com/forms/d/e/1FAIpQLSdSiSMqfQxYEE7EKHn698mSCYqxun2tBfLhYFO4JZoDw87ozg/viewform?usp=header"
          >
            Relatar problema/sugestão
          </FooterLink>
        </nav>
      </main>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between sm:w-full gap-4">
        <nav>
          <ul className="flex flex-col sm:flex-row sm:gap-4">
            <li>
              <FooterLink href="">Termos legais</FooterLink>
            </li>
            <li>
              <FooterLink href="">Termos de privacidade</FooterLink>
            </li>
            <li>
              <FooterLink href="">Termos de cookies</FooterLink>
            </li>
          </ul>
        </nav>

        <p className="font-poppins text-sm">
          &copy;carteira-pro-{new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
};
