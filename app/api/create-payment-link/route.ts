import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function POST(req: Request) {
  try {
    const { name, description, images, price, tripId } = await req.json();

    const paymentLink = await stripe.paymentLinks.create({
      line_items: [
        {
          price: (
            await stripe.prices.create({
              product: (
                await stripe.products.create({
                  name,
                  description,
                  images,
                })
              ).id,
              unit_amount: price * 100,
              currency: "usd",
            })
          ).id,
          quantity: 1,
        },
      ],
      metadata: { tripId },
      after_completion: {
        type: "redirect",
        redirect: {
          url: `${process.env.NEXT_PUBLIC_BASE_URL}/travel/${tripId}/success`,
        },
      },
    });

    return NextResponse.json({ url: paymentLink.url });
  } catch (error) {
    console.log("Error creating payment link:", error);
    return NextResponse.json(
      { error: "Failed to create payment link" },
      { status: 500 }
    );
  }
}
