"use client";
import Header from "@/components/Header";
import React from "react";
import "../../../components/syncfusion-license";
const page = () => {
  const user = {
    name: "Kidus",
  };
  return (
    <main className="dashboard wrapper">
      <Header
        title={`Welcome ${user.name ?? "Gust"} 👋`}
        description="Track activitys,trends and popular destination in real time"
      ></Header>
    </main>
  );
};

export default page;
