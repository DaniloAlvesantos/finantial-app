import Image from "next/image";

export const Header = () => {
  return (
    <header className="flex items-center justify-between p-4 ">
      <Image
        src="/LOGO.png"
        alt="carteira pro logo"
        decoding="auto"
        loading="eager"
        className="size-28"
        width={100}
        height={100}
      />
    </header>
  );
};
