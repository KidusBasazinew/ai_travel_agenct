// components/StripeForm.tsx
"use client";

import {
  CardElement,
  Elements,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useEffect, useState } from "react";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: "16px",
      color: "#424770",
      "::placeholder": {
        color: "#aab7c4",
      },
    },
    invalid: {
      color: "#9e2146",
    },
  },
};

const CheckoutForm = ({ tripId, price }: { tripId: string; price: number }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    if (!stripe || !elements) {
      setError("Payment system not initialized");
      setLoading(false);
      return;
    }

    try {
      setProcessing(true);
      const { error: pmError, paymentMethod } =
        await stripe.createPaymentMethod({
          type: "card",
          card: elements.getElement(CardElement)!,
        });

      if (pmError) {
        switch (pmError.type) {
          case "card_error":
            throw new Error(pmError.message);
          case "validation_error":
            throw new Error("Please check your card details");
          default:
            throw new Error("An unexpected error occurred");
        }
      }

      const response = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: price * 100,
          currency: "usd",
          tripId,
          paymentMethodId: paymentMethod!.id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Payment failed");
      }

      const { clientSecret } = await response.json();
      const { error: confirmError } = await stripe.confirmCardPayment(
        clientSecret
      );

      if (confirmError) {
        throw confirmError;
      }

      // Payment successful
      window.location.href = `/payment/${tripId}/success`;
    } catch (err) {
      console.log(err, "Payment failed. Please try again.");
    } finally {
      setLoading(false);
      setProcessing(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Card Details
          </label>
          <div className="p-4 border rounded-lg">
            <CardElement options={CARD_ELEMENT_OPTIONS} />
          </div>
        </div>

        <button
          type="submit"
          disabled={!stripe || loading || processing}
          className={`w-full py-3 px-4 rounded-md text-white font-medium ${
            !stripe || loading || processing
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {processing ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Processing...
            </span>
          ) : loading ? (
            "Loading..."
          ) : (
            `Pay $${price}`
          )}
        </button>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}
      </form>
    </div>
  );
};

export function StripeForm({
  tripId,
  price,
}: {
  tripId: string;
  price: number;
}) {
  const [stripeReady, setStripeReady] = useState(false);

  useEffect(() => {
    stripePromise.then(() => setStripeReady(true));
  }, []);

  if (!stripeReady) {
    return (
      <div className="w-full flex items-center justify-center p-6">
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm tripId={tripId} price={price} />
    </Elements>
  );
}
