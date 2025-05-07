//@ts-nocheck
"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { account } from "@/appwrite/client";
import { logoutUser, getExistingUser } from "@/appwrite/auth";
import { cn } from "@/lib/utils";
import Image from "next/image";

const Navbar = () => {
  const params = useParams();
  const [user, setUser] = useState<BaseUser | null>(null);
  const router = useRouter();
  const location = usePathname();
  const [isScrolled, setIsScrolled] = useState(false); // Track if the page has been scrolled

  const isTravelPage = location.startsWith("/travel/");

  useEffect(() => {
    // Fetch user data
    const fetchUser = async () => {
      try {
        const currentUser = await account.get();
        const userData = await getExistingUser(currentUser.$id);

        if (userData) {
          const user = {
            id: userData.$id,
            name: userData.name,
            email: userData.email,
            imageUrl: userData.imageUrl || "",
            status: userData.status,
            dateJoined: userData.dateJoined,
          };
          setUser(user);
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
    await logoutUser();
    router.push("/sign-in");
  };
  if (
    location === "/sign-in" ||
    location.startsWith("/admin") ||
    location.startsWith("/payment")
  ) {
    return null;
  }

  return (
    <nav
      className={cn(
        isScrolled || isTravelPage
          ? "bg-white shadow-gray-100 shadow-md"
          : "glassmorphism",
        "w-full fixed z-50"
      )}
    >
      <header className="root-nav wrapper">
        <Link href="/" className="link-logo">
          <img
            src="/assets/icons/logo.svg"
            alt="logo"
            className="size-[30px]"
          />
          <h1>Tourvisto</h1>
        </Link>

        <aside>
          {user?.status === "admin" ? (
            <Link
              href="/admin"
              className={cn("text-base font-normal text-white", {
                "text-dark-100": location.startsWith("/travel"),
              })}
            >
              Admin Panel
            </Link>
          ) : (
            <Link
              href="/"
              className={cn("text-base font-normal", {
                "text-white": !isScrolled, // If not scrolled, text is white
                "text-black": isScrolled, // If scrolled, text turns black
                "text-dark-100": location.startsWith("/travel"),
              })}
            >
              {user?.name || "Guest"}
            </Link>
          )}

          <img
            src={user?.imageUrl || "/assets/images/david.wepb"}
            alt="user"
            referrerPolicy="no-referrer"
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
              className="size-2 rotate-180"
            />
          </button>
        </aside>
      </header>
    </nav>
  );
};
export default Navbar;
