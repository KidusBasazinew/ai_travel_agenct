"use client";
import { getAllTrips, getTripById } from "@/appwrite/trips";
import { parseTripData } from "@/lib/utils";
import { Models } from "appwrite";
import Image from "next/image";
import React, { use, useEffect, useState } from "react";

interface Trip extends Models.Document {
  tripDetails: string;
  imageUrls: string[];
  status: string;
}

export default function page({ params }: { params: { id: string } }) {
  const [trip, setTrip] = useState<Trip | null>(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tripData] = await Promise.all([getTripById(params.id)]);

        if (!tripData) {
          throw new Error("Trip not found");
        }

        setTrip(tripData as Trip);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [params.id]);

  if (!trip) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">{"Trip not found"}</p>
      </div>
    );
  }
  const tripData = parseTripData(trip?.tripDetails);

  return (
    <div className="w-full flex">
      <section className="w-1/2 mx-auto h-screen flex flex-col  items-center justify-center gap-4">
        <div className="flex flex-col justify-center items-start">
          <div className="flex justify-start items-center py-10">
            <Image
              src="/assets/icons/logo.svg"
              width={100}
              height={100}
              alt="logo"
              className="size-10"
            />
            <h1>Tourvisto</h1>
          </div>
          <div className="flex flex-col justify-center items-start gap-2">
            <h1>{tripData?.name}</h1>
            <h1 className="text-2xl font-semibold">
              {tripData?.estimatedPrice}
            </h1>
            <Image
              src={trip?.imageUrls[0]}
              width={100}
              height={100}
              alt="logo"
              className="w-48 h-48 rounded-lg object-cover py-2"
            />
            <h1>{tripData?.name}</h1>
            <p className="text-sm text-gray-600">
              {parseTripData(trip.tripDetails)?.interests},
              {parseTripData(trip.tripDetails)?.travelStyle}
            </p>
          </div>
        </div>
      </section>
      <section className="w-1/2"></section>
    </div>
  );
}
