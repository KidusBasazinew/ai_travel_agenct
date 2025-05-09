"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { getExistingUser, useAuth } from "@/appwrite/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { account } from "@/appwrite/client";

export default function Navbar() {
  const pathname = usePathname();
  const { logout } = useAuth();
  const router = useRouter();
  const [user, setUser] = useState<BaseUser | null>(null);

  const [isScrolled, setIsScrolled] = useState(false);

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
    // Handle scrolling to update the background
    const handleScroll = () => {
      // Check if the page has been scrolled past the hero section
      setIsScrolled(window.scrollY > 600); // Change 100 to the value that works for your layout
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/sign-in");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  if (
    pathname.startsWith("/sign-in") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/payment/%5Bid%5D")
  ) {
    return null;
  }
  return (
    <nav
      className={cn(
        isScrolled || pathname.startsWith("/travel")
          ? "bg-white shadow-gray-100 shadow-md"
          : "glassmorphism",
        "flex py-2 justify-between w-full items-center fixed z-50"
      )}
    >
      <div className="flex items-center space-x-4 ml-10">
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src="/assets/icons/logo.svg"
            alt="Logo"
            width={32}
            height={32}
            className="size-8"
          />
          <span className="font-semibold text-lg">Tourvisto</span>
        </Link>
      </div>

      <div className="flex items-center space-x-4 mr-10">
        {true ? (
          <Link
            href="/admin"
            className={cn(
              isScrolled || pathname.startsWith("/travel")
                ? "text-gray-800"
                : "text-white",
              "font-base font-normal"
            )}
          >
            Admin Panel
          </Link>
        ) : (
          <Link
            href="/"
            className={cn("text-base font-normal", {
              "text-white": !isScrolled,
              "text-black": isScrolled,
              "text-dark-100": pathname.startsWith("/travel"),
            })}
          >
            {user?.name || "Guest"}
          </Link>
        )}
        <Link
          href="/"
          className={cn("text-base font-normal", {
            "text-white": !isScrolled,
            "text-black": isScrolled,
            "text-dark-100": pathname.startsWith("/travel"),
          })}
        />
        <Image
          src={user?.imageUrl || "/assets/images/david.wepb"}
          alt="user"
          referrerPolicy="no-referrer"
          width={100}
          height={100}
          className="w-10 h-10 rounded-full overflow-hidden"
        />

        <button
          onClick={handleLogout}
          className="cursor-pointer rounded-full bg-white opacity-70 p-1 transition-all duration-300 hover:opacity-100"
        >
          <Image
            width={100}
            height={100}
            src="/assets/icons/logout.svg"
            alt="logout"
            className="size-10 rotate-180 transition-all duration-300"
          />
        </button>
      </div>
    </nav>
  );
}
