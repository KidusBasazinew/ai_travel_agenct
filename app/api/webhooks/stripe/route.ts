import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { getTripById } from "@/appwrite/trips";
import { Stripe } from "stripe";

type PaymentIntentWithMetadata = Stripe.PaymentIntent & {
  metadata: {
    tripId: string;
    userId?: string;
  };
};

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("stripe-signature")!;

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    switch (event.type) {
      case "payment_intent.succeeded":
        await handlePaymentSuccess(
          event.data.object as PaymentIntentWithMetadata
        );
        break;
      case "payment_intent.payment_failed":
        await handlePaymentFailure(
          event.data.object as PaymentIntentWithMetadata
        );
        break;
    }

    return new Response(null, { status: 200 });
  } catch (err) {
    console.error(
      "Webhook error:",
      err instanceof Error ? err.message : "Unknown error"
    );
    return new Response(
      `Webhook Error: ${err instanceof Error ? err.message : "Unknown error"}`,
      { status: 400 }
    );
  }
}

async function handlePaymentSuccess(paymentIntent: PaymentIntentWithMetadata) {
  try {
    const { tripId } = paymentIntent.metadata;

    // Update trip status
    const trip = await getTripById(tripId);
    if (trip) {
      // Add your trip status update logic here
      console.log(`Payment successful for trip ${tripId}`);
    }

    // You could also send a confirmation email here
  } catch (error) {
    console.error("Error handling successful payment:", error);
  }
}

async function handlePaymentFailure(paymentIntent: PaymentIntentWithMetadata) {
  try {
    const { tripId } = paymentIntent.metadata;

    // Update trip status
    const trip = await getTripById(tripId);
    if (trip) {
      // Add your trip status update logic here
      console.log(`Payment failed for trip ${tripId}`);
    }

    // You could also send a notification email here
  } catch (error) {
    console.error("Error handling failed payment:", error);
  }
}
