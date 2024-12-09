import Image from "next/image";

export const Header = () => {
    return (
        <header className="p-4">
            <Image src="/LOGO.png" alt="Logo" width={100} height={100} quality={100} />
        </header>
    )
}