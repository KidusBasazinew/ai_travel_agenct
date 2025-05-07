"use client";
import { getTripById } from "@/appwrite/trips";
import { StripeForm } from "@/components/StripeForm";
import { parseTripData } from "@/lib/utils";
import { Models } from "appwrite";
import Image from "next/image";
import React, { useEffect, useState } from "react";

interface Trip extends Models.Document {
  tripDetails: string;
  imageUrls: string[];
  status: string;
}

export default function PaymentPage({ params }: { params: { id: string } }) {
  const [trip, setTrip] = useState<Trip | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tripData = await getTripById(params.id);
        if (!tripData) throw new Error("Trip not found");
        setTrip(tripData as Trip);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch trip");
      }
    };

    fetchData();
  }, [params.id]);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  let tripData;
  try {
    tripData = parseTripData(trip.tripDetails);
    if (!tripData) throw new Error("Failed to parse trip details");
  } catch (err) {
    console.error(err);
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">Failed to parse trip details</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen px-4 md:px-16 py-8 gap-10">
      {/* Trip Info Section */}
      <section className="w-full md:w-1/2 flex flex-col justify-center items-start gap-6">
        <div className="flex items-center gap-x-3">
          <Image
            src="/assets/icons/logo.svg"
            width={40}
            height={40}
            alt="logo"
            className="size-10"
          />
          <h1 className="text-2xl font-semibold text-gray-800">Tourvisto</h1>
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl md:text-3xl text-gray-600">
            Enjoy Your Trip at {tripData.name}
          </h2>
          <h3 className="text-3xl md:text-4xl font-bold text-gray-800">
            ${tripData.estimatedPrice}
          </h3>

          <Image
            src={trip.imageUrls[0]}
            width={700}
            height={700}
            alt={tripData.name}
            className="w-full max-w-md h-64 md:h-72 rounded-lg object-cover"
          />

          <div>
            <h4 className="text-lg font-semibold">{tripData.name}</h4>
            <p className="text-gray-600 text-sm md:text-base">
              {tripData.interests}, {tripData.travelStyle}
            </p>
          </div>
        </div>
      </section>

      {/* Stripe Payment Form Section */}
      <section className="w-full md:w-1/2 flex justify-center items-center">
        <div className="w-full max-w-md bg-white p-6 shadow-md rounded-lg">
          <StripeForm
            tripId={params.id}
            price={Number(tripData.estimatedPrice)}
          />
        </div>
      </section>
    </div>
  );
}
