"use client";
import { getTripById } from "@/appwrite/trips";
import { parseTripData } from "@/lib/utils";
import { Models } from "appwrite";
import Image from "next/image";
import { useEffect, useState } from "react";

interface Trip extends Models.Document {
  tripDetails: string;
  imageUrls: string[];
  status: string;
}

export default function PaymentSuccessPage({
  params,
}: {
  params: { id: string };
}) {
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const tripData = await getTripById(params.id);
        if (!tripData) {
          throw new Error("Trip not found");
        }
        setTrip(tripData as Trip);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch trip details"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTrip();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">{error || "Trip not found"}</p>
      </div>
    );
  }

  const tripData = parseTripData(trip.tripDetails);
  if (!tripData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">Failed to parse trip details</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="px-6 py-8">
            <div className="flex items-center justify-center mb-8">
              <div className="bg-green-100 rounded-full p-3">
                <svg
                  className="h-8 w-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-4">
              Payment Successful!
            </h2>
            <p className="text-center text-gray-600 mb-8">
              Thank you for your booking. Your payment has been processed
              successfully.
            </p>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Booking Details
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Trip Name:</span>
                  <span className="text-gray-900 font-medium">
                    {tripData.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount Paid:</span>
                  <span className="text-gray-900 font-medium">
                    ${tripData.estimatedPrice}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Booking Date:</span>
                  <span className="text-gray-900 font-medium">
                    {new Date().toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Booking ID:</span>
                  <span className="text-gray-900 font-medium">{trip.$id}</span>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <Image
                src={trip.imageUrls[0]}
                alt={tripData.name}
                width={400}
                height={300}
                className="rounded-lg object-cover w-full"
              />
            </div>

            <div className="mt-8 text-center">
              <a
                href="/travel"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                View All Trips
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
