import Image from "next/image";
import React from "react";

const page = () => {
  return (
    <div className="w-full flex">
      <section className="w-1/2 mx-auto flex flex-col items-center justify-center gap-4">
        <div className="flex justify-start items-center">
          <Image
            src="/assets/icons/logo.svg"
            width={100}
            height={100}
            alt="logo"
          />
          <h1>Tourvisto</h1>
        </div>
      </section>
      <section className="w-1/2 mx-auto flex flex-col items-center justify-center gap-4">
        <div className="flex justify-start items-center">
          <Image
            src="/assets/icons/logo.svg"
            width={100}
            height={100}
            className="size-[30px]"
            alt="logo"
          />
          <h1>Tourvisto</h1>
        </div>
        <h1>Pay {name}</h1>
        <h1>${price}</h1>
        <Image src={imageUrl} width={400} height={400} alt={name} />
        <h1>{name}</h1>
        <p>{tags}</p>
      </section>
    </div>
  );
};

export default page;
