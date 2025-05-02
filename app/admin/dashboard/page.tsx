"use client";
import Header from "@/components/Header";
import React from "react";
import "../../../components/syncfusion-license";
import StatsCard from "@/components/StatsCard";
import { allTrips, dashboardStats, user } from "@/constants";
import TripCard from "@/components/TripCard";
const page = () => {
  return (
    <main className="dashboard wrapper">
      <Header
        title={`Welcome ${user.name ?? "Gust"} 👋`}
        description="Track activitys,trends and popular destination in real time"
      ></Header>
      <section className="flex flex-col gap-6">
        <div className="grid grid-col-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatsCard
            headerTitle="Total Users"
            total={dashboardStats.totalUsers}
            currentMonthCount={dashboardStats.usersJoined.currentMonth}
            lastMonthCount={dashboardStats.usersJoined.lastMonth}
          />
          <StatsCard
            headerTitle="Total Trips"
            total={dashboardStats.totalTrips}
            currentMonthCount={dashboardStats.tripsCreated.currentMonth}
            lastMonthCount={dashboardStats.tripsCreated.lastMonth}
          />
          <StatsCard
            headerTitle="Total Users"
            total={dashboardStats.userRole.total}
            currentMonthCount={dashboardStats.userRole.currentMonth}
            lastMonthCount={dashboardStats.userRole.lastMonth}
          />
        </div>
      </section>
      <section className="container">
        <h1 className="text-xl font-semibold text-dark-100">Created Trips</h1>
        <div className="trip-grid">
          {allTrips.slice(0, 4).map((trip) => (
            <TripCard
              key={trip.id}
              id={trip.id}
              name={trip.name}
              location={trip.itinerary?.[0]?.location ?? ""}
              imageUrl={trip.imageUrls[0]}
              tags={trip.tags}
              price={trip.estimatedPrice}
            />
          ))}
        </div>
      </section>
    </main>
  );
};

export default page;
