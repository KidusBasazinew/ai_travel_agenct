import {
  ChipDirective,
  ChipListComponent,
  ChipsDirective,
} from "@syncfusion/ej2-react-buttons";
import { cn, getFirstWord } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

const TripCard = ({
  id,
  name,
  location,
  imageUrl,
  tags,
  price,
}: TripCardProps) => {
  const currentPath = usePathname();

  return (
    <Link
      href={
        currentPath === "/" || currentPath.startsWith("/travel")
          ? `/travel/${id}`
          : `/trips/${id}`
      }
      className="trip-card"
    >
      <img src={imageUrl} alt={name} />

      <article>
        <h2>{name}</h2>
        <figure>
          <Image
            src="/assets/icons/location-mark.svg"
            alt="location"
            className="size-4 !w-3 !h-3"
            width={20}
            height={20}
          />
          <figcaption className="!text-gray-600">{location}</figcaption>
        </figure>
      </article>

      <div className="mt-2 pl-[18px] pr-3.5 pb-5">
        <ChipListComponent id="travel-chip">
          <ChipsDirective>
            {tags?.map((tag, index) => (
              <ChipDirective
                key={index}
                text={getFirstWord(tag)}
                cssClass={cn(
                  index === 1
                    ? "!bg-pink-50 !text-pink-500"
                    : "!bg-success-50 !text-success-700"
                )}
              />
            ))}
          </ChipsDirective>
        </ChipListComponent>
      </div>

      <article className="tripCard-pill">{price}</article>
    </Link>
  );
};
export default TripCard;
