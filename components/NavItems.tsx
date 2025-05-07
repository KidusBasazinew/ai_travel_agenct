"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { sidebarItems } from "@/constants";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { logoutUser, getExistingUser } from "@/appwrite/auth";
import { account } from "@/appwrite/client";

const NavItems = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<BaseUser | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await account.get();
        // Assuming getExistingUser returns Models.Document | null
        const userData = await getExistingUser(currentUser.$id);

        // If userData is of type Models.Document, map it to a User type
        if (userData) {
          const user = {
            id: userData.$id,
            name: userData.name,
            email: userData.email,
            imageUrl: userData.imageUrl || "",
          };
          setUser(user as BaseUser);
        }
      } catch (error) {
        console.error("No user found", error);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    await logoutUser();
    router.push("/sign-in");
  };

  return (
    <section className="nav-items">
      <Link href="/" className="link-logo">
        <Image
          src="/assets/icons/logo.svg"
          alt="logo"
          className="size-[30px]"
          width={400}
          height={400}
        />
        <h1>Tourvisto</h1>
      </Link>

      <div className="container">
        <nav>
          {sidebarItems.map(({ id, href, icon, label }) => (
            <Link href={href} key={id}>
              <div
                className={`group nav-item ${
                  pathname === href ? "bg-primary-100 !text-white" : ""
                }`}
              >
                <Image
                  width={100}
                  height={100}
                  src={icon}
                  alt={label}
                  className={`group-hover:brightness-0 size-0 group-hover:invert ${
                    pathname === href ? "brightness-0 invert" : "text-dark-200"
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
            width={40}
            height={40}
            className="rounded-full"
          />
          <article>
            <h2>{user?.name || "Guest"}</h2>
            <p>{user?.email || "N/A"}</p>
          </article>

          <button onClick={handleLogout} className="cursor-pointer">
            <Image
              src="/assets/icons/logout.svg"
              alt="logout"
              width={24}
              height={24}
              className="size-6"
            />
          </button>
        </footer>
      </div>
    </section>
  );
};

export default NavItems;
