"use client";
import { getAllTrips } from "@/appwrite/trips";
import Header from "@/components/Header";
import TripCard from "@/components/TripCard";
import { parseTripData } from "@/lib/utils";
import { ButtonComponent } from "@syncfusion/ej2-react-buttons";
import { PagerComponent } from "@syncfusion/ej2-react-grids";

import Link from "next/link";
import { useEffect, useState } from "react";
import "../components/syncfusion-license";

import FeaturedDestination from "@/components/FeaturedDestination";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
export default function Home() {
  const [allTrips, setAllTrips] = useState<Trip[]>([]);
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

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const tripsData = await getAllTrips(4, 0);
        //@ts-ignore
        const parsedTrips = tripsData.allTrips.map((trip: any) => ({
          id: trip.$id,
          ...parseTripData(trip.tripDetails),
          imageUrls: trip.imageUrls ?? [],
        }));
        setAllTrips(parsedTrips as Trip[]);
        return tripsData;
      } catch (error) {
        console.error("Error fetching trips:", error);
        return [];
      }
    };
    fetchTrips();
  }, []);

  return (
    <div>
      <main className="flex flex-col">
        <section className="travel-hero">
          <div>
            <section className="wrapper">
              <article>
                <h1 className="p-72-bold text-dark-100">
                  Plan Your Trip with Ease
                </h1>

                <p className="text-dark-100">
                  Customize your travel itinerary in minutes—pick your
                  destination, set your preferences, and explore with
                  confidence.
                </p>
              </article>

              <Link href="#trips">
                <ButtonComponent
                  type="button"
                  className="button-class !h-11 !w-full md:!w-[240px]"
                >
                  <span className="p-16-semibold text-white">Get Started</span>
                </ButtonComponent>
              </Link>
            </section>
          </div>
        </section>

        <section className="pt-20 wrapper flex flex-col gap-10 h-full">
          <Header
            title="Featured Travel Destinations"
            description="Check out some of the best places you visit around the world"
          />
          <div className="featured">
            <article>
              <FeaturedDestination
                bgImage="bg-card-1"
                containerClass="h-1/3 lg:h-1/2"
                bigCard
                title="Barcelona Tour"
                rating={4.2}
                activityCount={196}
              />

              <div className="travel-featured">
                <FeaturedDestination
                  bgImage="bg-card-2"
                  bigCard
                  title="London"
                  rating={4.5}
                  activityCount={512}
                />
                <FeaturedDestination
                  bgImage="bg-card-3"
                  bigCard
                  title="Australia Tour"
                  rating={3.5}
                  activityCount={250}
                />
              </div>
            </article>

            <div className="flex flex-col gap-[30px]">
              <FeaturedDestination
                containerClass="w-full h-[240px]"
                bgImage="bg-card-4"
                title="Spain Tour"
                rating={3.8}
                activityCount={150}
              />
              <FeaturedDestination
                containerClass="w-full h-[240px]"
                bgImage="bg-card-5"
                title="Japan"
                rating={5}
                activityCount={150}
              />
              <FeaturedDestination
                containerClass="w-full h-[240px]"
                bgImage="bg-card-6"
                title="Italy Tour"
                rating={4.2}
                activityCount={500}
              />
            </div>
          </div>
        </section>

        <section id="trips" className="py-20 wrapper flex flex-col gap-10">
          <Header
            title="Handpicked Trips"
            description="Browse well-planned trips designes for your travel style"
          />

          <div className="trip-grid">
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
            click={(args) => handlePageChange(args.currentPage)}
            cssClass="!mb-4"
          />
        </section>

        <footer className="h-28 bg-white">
          <div className="wrapper footer-container">
            <Link href="/">
              <Image
                width={30}
                height={30}
                src="/assets/icons/logo.svg"
                alt="logo"
                className="size-[30px]"
              />
              <h1>Tourvisto</h1>
            </Link>

            <div>
              {["Terms & Conditions", "Privacy Policy"].map((item) => (
                <Link href="/" key={item}>
                  {item}
                </Link>
              ))}
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
