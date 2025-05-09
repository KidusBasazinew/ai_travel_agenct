"use client";
import { ButtonComponent } from "@syncfusion/ej2-react-buttons";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

interface Props {
  title: string;
  description: string;
  ctaText?: string;
  ctaUrl?: string;
}

const Header = ({ title, description, ctaText, ctaUrl }: Props) => {
  const currentPath = usePathname();
  return (
    <header className="header">
      <article>
        <h1
          className={cn(
            "text-dark-100",
            currentPath === "/admin"
              ? "text-2xl md:text-4xl font-bold"
              : "text-xl md:text-2xl font-semibold"
          )}
        >
          {title}
        </h1>
        <p
          className={cn(
            "text-gray-600 font-normal",
            currentPath === "/" ? "text-base md:text-lg" : "text-sm md:text-lg"
          )}
        >
          {description}
        </p>
      </article>

      {ctaText && ctaUrl && (
        <Link href={ctaUrl}>
          <ButtonComponent
            type="button"
            className="button-class !h-11 !w-full md:w-[240px]"
          >
            <Image
              src="/assets/icons/plus.svg"
              alt="plus"
              className="size-5"
              width={100}
              height={100}
            />
            <span className="p-16-semibold text-white">{ctaText}</span>
          </ButtonComponent>
        </Link>
      )}
    </header>
  );
};
export default Header;
