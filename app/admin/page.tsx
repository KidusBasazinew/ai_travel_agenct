"use client";
import Header from "@/components/Header";
import React, { useEffect, useState } from "react";
import { getAllTrips } from "@/appwrite/trips";
import { Models } from "appwrite";

const Page = () => {
  const [trips, setTrips] = useState<Models.Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const { allTrips } = await getAllTrips(10, 0); // Fetch first 10 trips
        setTrips(allTrips);
      } catch (err) {
        setError("Failed to fetch trips");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

  return (
    <div>
      <Header
        title={`Welcome ${"Gust"} 👋`}
        description="Track activitys,trends and popular destination in real time"
      />

      <div className="mt-8">
        {loading ? (
          <p>Loading trips...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div>
            <h2 className="text-2xl font-bold mb-4">All Trips</h2>
            {trips.length === 0 ? (
              <p>No trips found</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {trips.map((trip) => (
                  <div key={trip.$id} className="border p-4 rounded-lg">
                    <h3 className="font-semibold">{trip.title}</h3>
                    <p className="text-gray-600">{trip.description}</p>
                    <p className="text-sm text-gray-500">
                      Created: {new Date(trip.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
