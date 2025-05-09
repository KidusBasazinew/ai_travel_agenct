"use client";
import { ButtonComponent } from "@syncfusion/ej2-react-buttons";
import { loginWithGoogle } from "@/appwrite/auth";
import { account } from "@/appwrite/client";
import Link from "next/link";
import Image from "next/image";

import "../../components/syncfusion-license";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const SignIn = () => {
  const router = useRouter();

  //ensures the check happens on the client.
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await account.get();
        if (user?.$id) {
          router.push("/");
        }
      } catch (e) {
        console.log("No user logged in", e);
      }
    };
    checkAuth();
  }, [router]);

  return (
    <main className="auth">
      <section className="size-full glassmorphism flex-center px-6">
        <div className="sign-in-card">
          <header className="header">
            <Link href="/">
              <Image
                src="/assets/icons/logo.svg"
                alt="logo"
                width={100}
                height={100}
                className="size-[30px]"
              />
            </Link>
            <h1 className="p-28-bold text-dark-100">Tourvisto</h1>
          </header>

          <article>
            <h2 className="p-28-semibold text-dark-100 text-center">
              Start Your Travel Journey
            </h2>

            <p className="p-18-regular text-center text-gray-600 !leading-7">
              Sign in with Google to manage destinations, itineraries, and user
              activity with ease.
            </p>
          </article>

          <ButtonComponent
            type="button"
            iconCss="e-search-icon"
            className="button-class !h-11 !w-full"
            onClick={loginWithGoogle}
          >
            <Image
              src="/assets/icons/google.svg"
              className="size-5"
              width={100}
              height={100}
              alt="google"
            />
            <span className="p-18-semibold text-white">
              Sign in with Google
            </span>
          </ButtonComponent>
        </div>
      </section>
    </main>
  );
};
export default SignIn;
