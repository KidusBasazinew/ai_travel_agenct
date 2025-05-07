"use client";
import Header from "@/components/Header";
import React, { useEffect, useState } from "react";
import "../../../components/syncfusion-license";
import StatsCard from "@/components/StatsCard";
import TripCard from "@/components/TripCard";
import { getAllUsers, getExistingUser } from "@/appwrite/auth";
import { account } from "@/appwrite/client";
import { getAllTrips } from "@/appwrite/trips";
import { parseTripData } from "@/lib/utils";
import { Models } from "appwrite";
import {
  getTripsByTravelStyle,
  getUserGrowthPerDay,
  getUsersAndTripsStats,
} from "@/appwrite/dashboard";

const DashboardPage = () => {
  const [user, setUser] = useState<BaseUser | null>(null);
  //@ts-ignore
  const [allTrips, setAllTrips] = useState<any[]>([]);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    totalUsers: 0,
    usersJoined: { currentMonth: 0, lastMonth: 0 },
    totalTrips: 0,
    tripsCreated: { currentMonth: 0, lastMonth: 0 },
    userRole: { total: 0, currentMonth: 0, lastMonth: 0 },
  });
  const [userGrowth, setUserGrowth] = useState<any[]>([]);
  const [tripsByTravelStyle, setTripsByTravelStyle] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch current user
        const currentUser = await account.get();
        const userData = await getExistingUser(currentUser.$id);
        if (userData) {
          setUser({
            id: userData.$id,
            name: userData.name,
            email: userData.email,
            imageUrl: userData.imageUrl || "",
            dateJoined: userData.joinedAt,
          });
        }

        // Fetch all dashboard data in parallel
        const [statsData, growthData, travelStyleData, usersData, tripsData] =
          await Promise.all([
            getUsersAndTripsStats(),
            getUserGrowthPerDay(),
            getTripsByTravelStyle(),
            getAllUsers(4, 0),
            getAllTrips(4, 0),
          ]);

        // Set dashboard stats
        setDashboardStats({
          totalUsers: statsData.totalUsers,
          usersJoined: statsData.usersJoined,
          totalTrips: statsData.totalTrips,
          tripsCreated: statsData.tripsCreated,
          userRole: statsData.userRole,
        });

        // Set user growth data
        setUserGrowth(growthData);

        // Set trips by travel style
        setTripsByTravelStyle(travelStyleData);

        // Set mapped users
        const mappedUsers = usersData.users.map((user: any) => ({
          imageUrl: user.imageUrl,
          name: user.name,
          count: user.itineraryCount ?? Math.floor(Math.random() * 10),
        }));
        setAllUsers(mappedUsers);

        // Process and set trips
        const parsedTrips = tripsData.allTrips.map((trip: any) => ({
          id: trip.$id,
          ...parseTripData(trip.tripDetails),
          imageUrls: trip.imageUrls ?? [],
        }));
        setAllTrips(parsedTrips);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
  return (
    <main className="dashboard wrapper">
      <Header
        title={`Welcome ${user?.name ?? "Gust"} 👋`}
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
            headerTitle="Active Users"
            total={dashboardStats.userRole.total}
            currentMonthCount={dashboardStats.userRole.currentMonth}
            lastMonthCount={dashboardStats.userRole.lastMonth}
          />
        </div>
      </section>
      <section className="container">
        <h1 className="text-xl font-semibold text-dark-100">Created Trips</h1>
        <div className="trip-grid">
          {allTrips.map((trip) => (
            <TripCard
              key={trip.id}
              id={trip.id}
              name={trip.name || ""} // Use already parsed data
              imageUrl={trip.imageUrls[0]}
              location={trip.itinerary?.[0]?.location ?? ""}
              tags={[trip.interests || "", trip.travelStyle || ""]}
              price={trip.estimatedPrice || ""}
            />
          ))}
        </div>
      </section>
    </main>
  );
};

export default DashboardPage;
