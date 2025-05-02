"use client";
// /app/admin/layout.tsx
import React from "react";
import NavItems from "@/components/NavItems";
import { SidebarComponent } from "@syncfusion/ej2-react-navigations";
// In your main layout or any client component

import "../../components/syncfusion-license";
import MobileSidebar from "@/components/MobileSidebar";

const AdminLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
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
