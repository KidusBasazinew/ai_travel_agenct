"use client";
// /app/admin/layout.tsx
import React, { useEffect } from "react";
import NavItems from "@/components/NavItems";
import { SidebarComponent } from "@syncfusion/ej2-react-navigations";
// In your main layout or any client component

import "../../components/syncfusion-license";

import MobileSidebar from "@/components/MobileSidebar";
import { useRouter } from "next/navigation";
import { account } from "@/appwrite/client";
import { getExistingUser, storeUserData } from "@/appwrite/auth";

const AdminLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const router = useRouter();

  //ensures the check happens on the client.
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await account.get();
        if (!user?.$id) return router.push("/sign-in");

        const existingUser = await getExistingUser(user.$id);

        if (existingUser) {
          if (existingUser.status === "user") {
            return router.push("/");
          }

          // If admin, do nothing further
          return;
        }

        // ✅ User does not exist — create
        await storeUserData();
      } catch (e) {
        console.log("Error in client loader", e);
        return router.push("/sign-in");
      }
    };
    checkAuth();
  }, [router]);

  return (
    <div className="admin-layout flex">
      <MobileSidebar />
      <aside className="w-full max-w-[270px] hidden lg:block">
        <SidebarComponent width={270} enableGestures={false}>
          <NavItems />
        </SidebarComponent>
      </aside>
      <main className="flex-grow p-4">{children}</main>
    </div>
  );
};

export default AdminLayout;
