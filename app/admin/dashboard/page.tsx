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
import {
  getTripsByTravelStyle,
  getUserGrowthPerDay,
  getUsersAndTripsStats,
} from "@/appwrite/dashboard";
import { Models } from "appwrite";

interface BaseUser {
  id: string;
  name: string;
  email: string;
  imageUrl: string;
  dateJoined: string;
}

interface DashboardStats {
  totalUsers: number;
  usersJoined: {
    currentMonth: number;
    lastMonth: number;
  };
  totalTrips: number;
  tripsCreated: {
    currentMonth: number;
    lastMonth: number;
  };
  userRole: {
    total: number;
    currentMonth: number;
    lastMonth: number;
  };
}

interface TripData {
  id: string;
  name: string;
  imageUrls: string[];
  itinerary?: DayPlan[];
  interests?: string;
  travelStyle?: string;
  estimatedPrice?: string;
}

interface TripDocument extends Models.Document {
  tripDetails: string;
  imageUrls?: string[];
}

const DashboardPage = () => {
  const [user, setUser] = useState<BaseUser | null>(null);
  const [allTrips, setAllTrips] = useState<TripData[]>([]);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    totalUsers: 0,
    usersJoined: { currentMonth: 0, lastMonth: 0 },
    totalTrips: 0,
    tripsCreated: { currentMonth: 0, lastMonth: 0 },
    userRole: { total: 0, currentMonth: 0, lastMonth: 0 },
  });

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
        const [statsData, , , , tripsData] = await Promise.all([
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

        // Process and set trips
        const parsedTrips = tripsData.allTrips
          .filter((trip): trip is TripDocument => "tripDetails" in trip)
          .map((trip) => {
            const parsedData = parseTripData(trip.tripDetails);
            if (!parsedData) {
              return null;
            }
            return {
              id: trip.$id,
              name: parsedData.name || "",
              imageUrls: trip.imageUrls || [],
              itinerary: parsedData.itinerary,
              interests: parsedData.interests,
              travelStyle: parsedData.travelStyle,
              estimatedPrice: parsedData.estimatedPrice,
            };
          })
          .filter((trip): trip is NonNullable<typeof trip> => trip !== null);

        setAllTrips(parsedTrips as Trip[]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <main className="dashboard wrapper">
      <Header
        title={`Welcome ${user?.name ?? "Guest"} 👋`}
        description="Track activities, trends and popular destinations in real time"
      />
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
              name={trip.name}
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
