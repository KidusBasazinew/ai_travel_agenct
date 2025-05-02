"use client";
import React from "react";
import Link from "next/link";
import { sidebarItems } from "@/constants";
import { usePathname } from "next/navigation";
import Image from "next/image";

const NavItems = () => {
  const user = {
    name: "Kidus",
    email: "kidusbw@gmail.com",
    imageUrl: "/assets/images/david.webp",
  };

  const currentPath = usePathname();

  const handleClick = () => {};

  const handleLogout = async () => {
    // await logoutUser();
    // navigate('/sign-in')
    console.log("Log out");
  };
  return (
    <section className="nav-items">
      <Link href="/" className="link-logo">
        <img src="/assets/icons/logo.svg" alt="logo" className="size-[30px]" />
        <h1>Tourvisto</h1>
      </Link>

      <div className="container">
        <nav>
          {sidebarItems.map(({ id, href, icon, label }) => (
            <Link href={href} key={id}>
              <div
                className={`group nav-item ${
                  currentPath === href ? "bg-primary-100 !text-white" : ""
                }`}
                onClick={handleClick}
              >
                <img
                  src={icon}
                  alt={label}
                  className={`group-hover:brightness-0 size-0 group-hover:invert ${
                    currentPath === href
                      ? "brightness-0 invert"
                      : "text-dark-200"
                  }`}
                />
                {label}
              </div>
            </Link>
          ))}
        </nav>

        <footer className="nav-footer">
          <Image
            src={user?.imageUrl || "/assets/images/david.webp"}
            alt={user?.name || "David"}
            referrerPolicy="no-referrer"
            width={100}
            height={100}
          />

          <article>
            <h2>{user?.name}</h2>
            <p>{user?.email}</p>
          </article>

          <button onClick={handleLogout} className="cursor-pointer">
            <Image
              src="/assets/icons/logout.svg"
              alt="logout"
              className="size-6"
              width={100}
              height={100}
            />
          </button>
        </footer>
      </div>
    </section>
  );
};

export default NavItems;
