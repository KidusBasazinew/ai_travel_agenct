"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { PagerComponent } from "@syncfusion/ej2-react-grids";

import Header from "@/components/Header";
import TripCard from "@/components/TripCard";
import { getAllTrips } from "@/appwrite/trips";
import { parseTripData } from "@/lib/utils";

export default function TripsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pageParam = searchParams.get("page");

  const [currentPage, setCurrentPage] = useState(Number(pageParam) || 1);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [total, setTotal] = useState(0);

  const fetchTrips = async (page: number) => {
    const limit = 8;
    const offset = (page - 1) * limit;
    const { allTrips, total } = await getAllTrips(limit, offset);

    const parsedTrips = allTrips.map(({ $id, tripDetails, imageUrls }) => ({
      id: $id,
      ...parseTripData(tripDetails),
      imageUrls: imageUrls ?? [],
    }));

    setTrips(parsedTrips as Trip[]);
    setTotal(total);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    router.push(`/trips?page=${page}`);
  };

  useEffect(() => {
    fetchTrips(currentPage);
  }, [currentPage]);

  return (
    <main className="all-users wrapper">
      <Header
        title="Trips"
        description="View and edit AI-generated travel plans"
        ctaText="Create a trip"
        ctaUrl="/admin/create-trip"
      />

      <section>
        <h1 className="p-24-semibold text-dark-100 mb-4">
          Manage Created Trips
        </h1>

        <div className="trip-grid mb-4">
          {trips.map((trip) => (
            <TripCard
              key={trip.id}
              id={trip.id}
              name={trip.name}
              imageUrl={trip.imageUrls[0]}
              location={trip.itinerary?.[0]?.location ?? ""}
              tags={[trip.interests, trip.travelStyle]}
              price={trip.estimatedPrice}
            />
          ))}
        </div>

        <PagerComponent
          totalRecordsCount={total}
          pageSize={8}
          currentPage={currentPage}
          //@ts-ignore
          click={(args: any) => handlePageChange(args.currentPage)}
          cssClass="!mb-4"
        />
      </section>
    </main>
  );
}
