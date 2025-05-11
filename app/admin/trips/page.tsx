// app/admin/trips/page.tsx
import { Suspense } from "react";
import dynamic from "next/dynamic";

const TripsContent = dynamic(() => import("./TripContent"), {
  ssr: false,
  loading: () => <div>Loading trips...</div>,
});

export default function TripsPage() {
  return (
    <main className="all-users wrapper">
      <Suspense fallback={<div>Loading trip data...</div>}>
        <TripsContent />
      </Suspense>
    </main>
  );
}
