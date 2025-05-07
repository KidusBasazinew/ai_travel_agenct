"use client";

export function PaymentButton({ trip }: { trip: Trip }) {
  const handlePayment = async () => {
    try {
      const response = await fetch("/api/create-payment-link", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: trip.name,
          description: trip.description,
          images: [trip.imageUrls[0]],
          price: trip.estimatedPrice,
          tripId: trip.id,
        }),
      });

      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error("Payment failed:", error);
    }
  };

  return <button onClick={handlePayment}>Book Now</button>;
}
