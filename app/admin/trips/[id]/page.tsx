"use client";
import { parseTripData, getFirstWord, cn } from "@/lib/utils";
import {
  ChipDirective,
  ChipListComponent,
  ChipsDirective,
} from "@syncfusion/ej2-react-buttons";
import Header from "@/components/Header";
import InfoPill from "@/components/InfoPill";
import TripCard from "@/components/TripCard";
import { useEffect, useState } from "react";
import { getTripById, getAllTrips } from "@/appwrite/trips";
import { Models } from "appwrite";
import Image from "next/image";

interface DayPlan {
  day: number;
  location: string;
  activities: Array<{
    time: string;
    description: string;
  }>;
}

interface Trip extends Models.Document {
  tripDetails: string;
  imageUrls: string[];
  status: string;
}

export default function TripDetailPage({ params }: { params: { id: string } }) {
  const [trip, setTrip] = useState<Trip | null>(null);
  const [allTrips, setAllTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!params.id) {
      setError("Invalid trip ID");
      return;
    }
    const fetchData = async () => {
      try {
        const [tripData, allTripsData] = await Promise.all([
          getTripById(params.id),
          getAllTrips(4, 0),
        ]);

        if (!tripData) {
          throw new Error("Trip not found");
        }

        setTrip(tripData as Trip);
        setAllTrips(allTripsData.allTrips as Trip[]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load trip");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
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

  const imageUrls = trip?.imageUrls || [];
  const tripData = parseTripData(trip?.tripDetails);

  if (!tripData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">Failed to parse trip data</p>
      </div>
    );
  }

  const {
    name,
    duration,
    itinerary,
    travelStyle,
    groupType,
    budget,
    interests,
    estimatedPrice,
    description,
    bestTimeToVisit,
    weatherInfo,
    country,
  } = tripData;

  const pillItems = [
    { text: travelStyle, bg: "!bg-pink-50 !text-pink-500" },
    { text: groupType, bg: "!bg-primary-50 !text-primary-500" },
    { text: budget, bg: "!bg-success-50 !text-success-700" },
    { text: interests, bg: "!bg-navy-50 !text-navy-500" },
  ];

  const visitTimeAndWeatherInfo = [
    { title: "Best Time to Visit:", items: bestTimeToVisit },
    { title: "Weather:", items: weatherInfo },
  ];

  return (
    <main className="travel-detail wrapper">
      <Header
        title="Trip Details"
        description="View and edit AI-generated travel plans"
      />
      <section className="container wrapper-md">
        <header>
          <h1 className="p-40-semibold text-dark-100">{name}</h1>
          <div className="flex items-center gap-5">
            <InfoPill
              text={`${duration} day plan`}
              image="/assets/icons/calendar.svg"
            />
            <InfoPill
              text={
                itinerary
                  ?.slice(0, 4)
                  .map((item) => item.location)
                  .join(", ") || ""
              }
              image="/assets/icons/location-mark.svg"
            />
          </div>
        </header>

        <section className="gallery">
          {imageUrls.map((url: string, i: number) => (
            <Image
              width={700}
              height={700}
              src={url}
              key={i}
              alt={`Trip image ${i + 1}`}
              className={cn(
                "w-full rounded-xl object-cover",
                i === 0
                  ? "md:col-span-2 md:row-span-2 h-[330px]"
                  : "md:row-span-1 h-[150px]"
              )}
            />
          ))}
        </section>

        <section className="flex flex-col gap-4">
          <ChipListComponent id="travel-chip">
            <ChipsDirective>
              {pillItems.map((pill, i) => (
                <ChipDirective
                  key={i}
                  text={getFirstWord(pill.text)}
                  cssClass={`${pill.bg} !text-base !font-medium !px-4`}
                />
              ))}
            </ChipsDirective>
          </ChipListComponent>

          <ul className="flex gap-1 items-center">
            {Array(5)
              .fill("null")
              .map((_, index) => (
                <li key={index}>
                  <Image
                    width={100}
                    height={100}
                    src="/assets/icons/star.svg"
                    alt="star"
                    className="size-[18px]"
                  />
                </li>
              ))}

            <li className="ml-1">
              <ChipListComponent>
                <ChipsDirective>
                  <ChipDirective
                    text="4.9/5"
                    cssClass="!bg-yellow-50 !text-yellow-700"
                  />
                </ChipsDirective>
              </ChipListComponent>
            </li>
          </ul>
        </section>

        <section className="title">
          <article>
            <h3>
              {duration}-Day {country} {travelStyle} Trip
            </h3>
            <p>
              {budget}, {groupType} and {interests}
            </p>
          </article>

          <h2>{estimatedPrice}</h2>
        </section>

        <p className="text-sm md:text-lg font-normal text-dark-400">
          {description}
        </p>

        <ul className="itinerary">
          {itinerary?.map((dayPlan: DayPlan, index: number) => (
            <li key={index}>
              <h3>
                Day {dayPlan.day}: {dayPlan.location}
              </h3>
              <ul>
                {dayPlan.activities.map((activity, index: number) => (
                  <li key={index}>
                    <span className="flex-shring-0 p-18-semibold">
                      {activity.time}
                    </span>
                    <p className="flex-grow">{activity.description}</p>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>

        {visitTimeAndWeatherInfo.map((section) => (
          <section key={section.title} className="visit">
            <div>
              <h3>{section.title}</h3>
              <ul>
                {section.items?.map((item) => (
                  <li key={item}>
                    <p className="flex-grow">{item}</p>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        ))}
      </section>
      <section className="flex flex-col gap-6">
        <h2 className="p-24-semibold text-dark-100">Popular Trips</h2>
        <div className="trip-grid">
          {allTrips.map((trip) => (
            <TripCard
              key={trip.$id}
              id={trip.$id}
              name={parseTripData(trip.tripDetails)?.name || ""}
              imageUrl={trip.imageUrls[0]}
              location={
                parseTripData(trip.tripDetails)?.itinerary?.[0]?.location ?? ""
              }
              tags={[
                parseTripData(trip.tripDetails)?.interests || "",
                parseTripData(trip.tripDetails)?.travelStyle || "",
              ]}
              price={parseTripData(trip.tripDetails)?.estimatedPrice || ""}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
