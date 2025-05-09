import Image from "next/image";
const InfoPill = ({ text, image }: InfoPillProps) => {
  return (
    <figure className="info-pill">
      <Image src={image} alt={text} width={100} height={100} />

      <figcaption>{text}</figcaption>
    </figure>
  );
};
export default InfoPill;
