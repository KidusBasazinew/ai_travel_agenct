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
    <div className="flex flex-col md:flex-row min-h-screen px-4 md:px-16 py-8 gap-10 bg-white">
      {/* Trip Info Section */}
      <section className="w-full md:w-1/2 flex flex-col justify-center items-start px-6 md:px-12 lg:px-20 py-8 bg-white gap-6">
        {/* Back Link + Logo */}
        <div className="flex items-center gap-3">
          <Image
            src="/assets/icons/logo.svg"
            width={32}
            height={32}
            alt="logo"
            className="size-8"
          />
          <h1 className="text-xl font-semibold text-gray-800">Tourvisto</h1>
        </div>

        {/* Trip Title & Price */}
        <div className="space-y-2">
          <p className="text-sm text-gray-500">
            Pay {tripData.name}: {tripData.interests}, {tripData.travelStyle}
          </p>
          <h2 className="text-3xl font-bold text-gray-900">
            {tripData.estimatedPrice}
          </h2>
        </div>

        {/* Trip Image */}
        <Image
          src={trip.imageUrls[0]}
          width={500}
          height={300}
          alt={tripData.name}
          className="rounded-lg object-cover w-full max-w-sm h-48"
        />

        {/* Trip Description */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            {tripData.name}
          </h3>
          <p className="text-sm text-gray-500">
            {tripData.interests}, {tripData.travelStyle}
          </p>
        </div>

        {/* Footer */}
        <div className="mt-10 flex gap-4 items-center text-xs text-gray-400">
          <span>
            Powered by <strong className="text-gray-600">Stripe</strong>
          </span>
          <span className="h-4 border-l border-gray-300" />
          <a href="#" className="hover:underline">
            Terms
          </a>
          <a href="#" className="hover:underline">
            Privacy
          </a>
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
