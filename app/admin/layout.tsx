// /app/admin/layout.tsx
import React from "react";

const AdminLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="admin-layout flex">
      <aside className="w-full max-w-[270px] hidden lg:block">Sidebar</aside>
      <main className="flex-grow p-4">{children}</main>
    </div>
  );
};

export default AdminLayout;
