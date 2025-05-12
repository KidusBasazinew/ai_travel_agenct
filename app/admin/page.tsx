"use client";
import Header from "@/components/Header";
import StatsCard from "@/components/StatsCard";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getAllUsers } from "@/appwrite/auth";
import { getAllTrips } from "@/appwrite/trips";
// import { Users, Globe, ArrowUpRight } from "lucide-react";

interface AdminStats {
  totalUsers: number;
  totalTrips: number;
  currentMonthUsers: number;
  lastMonthUsers: number;
  currentMonthTrips: number;
  lastMonthTrips: number;
}

const AdminDashboardPage = () => {
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalTrips: 0,
    currentMonthUsers: 0,
    lastMonthUsers: 0,
    currentMonthTrips: 0,
    lastMonthTrips: 0,
  });

  const [loading, setLoading] = useState(true);

  const getMonthCounts = (entries: any[], dateField: string) => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    return entries.reduce(
      (acc, entry) => {
        const date = new Date(entry[dateField]);
        const entryMonth = date.getMonth();
        const entryYear = date.getFullYear();

        if (entryMonth === currentMonth && entryYear === currentYear) {
          acc.current++;
        } else if (entryMonth === lastMonth && entryYear === lastYear) {
          acc.last++;
        }
        return acc;
      },
      { current: 0, last: 0 }
    );
  };

  const fetchStats = async () => {
    try {
      setLoading(true);

      const [usersResponse, tripsResponse] = await Promise.all([
        getAllUsers(1000, 0),
        getAllTrips(1000, 0),
      ]);

      const userMonthCounts = getMonthCounts(usersResponse.users, "joinedAt");
      const tripMonthCounts = getMonthCounts(
        tripsResponse.allTrips,
        "$createdAt"
      );

      setStats({
        totalUsers: usersResponse.total,
        totalTrips: tripsResponse.total,
        currentMonthUsers: userMonthCounts.current,
        lastMonthUsers: userMonthCounts.last,
        currentMonthTrips: tripMonthCounts.current,
        lastMonthTrips: tripMonthCounts.last,
      });

      setLoading(false);
    } catch (error) {
      console.error("Error fetching stats:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <main className="admin-dashboard wrapper">
      <Header
        title="Admin Dashboard"
        description="Manage platform content and user activities"
      />

      {loading ? (
        <p>loading...</p>
      ):(<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <StatsCard
          headerTitle="Total Users"
          total={stats.totalUsers}
          currentMonthCount={stats.currentMonthUsers}
          lastMonthCount={stats.lastMonthUsers}
        />

        <StatsCard
          headerTitle="Total Trips"
          total={stats.totalTrips}
          currentMonthCount={stats.currentMonthTrips}
          lastMonthCount={stats.lastMonthTrips}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Quick Actions</h3>
            {/* <ArrowUpRight className="w-5 h-5 text-gray-400" /> */}
          </div>
          <div className="space-y-4">
            <Button className="w-full justify-start gap-2">
              <Link href="/admin/users">
                {/* <Users className="w-4 h-4" /> */}
                Manage Users
              </Link>
            </Button>
            <Button className="w-full justify-start gap-2">
              <Link href="/admin/trips">
                {/* <Globe className="w-4 h-4" /> */}
                Manage Trips
              </Link>
            </Button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Monthly Growth</h3>
          <div className="space-y-4 text-gray-600">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span>{stats.currentMonthUsers} new users this month</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full" />
              <span>{stats.currentMonthTrips} new trips created</span>
            </div>
          </div>
        </div>
      </div>)}
    </main>
  );
};

export default AdminDashboardPage;
