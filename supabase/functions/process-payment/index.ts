
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@12.8.0?target=deno";

console.log("Stripe payment processing function loaded");

// Initialize Stripe
const stripe = new Stripe(Deno.env.get("STRIPE_API_KEY") || "", {
  httpClient: Deno.createHttpClient(),
  apiVersion: "2023-10-16",
});

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
      status: 204,
    });
  }

  try {
    const { plan, redirect_url } = await req.json();

    // Validate input
    if (!plan || !redirect_url) {
      return new Response(
        JSON.stringify({ error: "Plan and redirect URL are required" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    // Set price based on the plan
    let priceId;
    let name;
    let price;

    switch (plan) {
      case "basic":
        priceId = "price_basic"; // Replace with actual Stripe price ID
        name = "Basic Plan";
        price = 9.99;
        break;
      case "premium":
        priceId = "price_premium"; // Replace with actual Stripe price ID
        name = "Premium Plan";
        price = 19.99;
        break;
      case "unlimited":
        priceId = "price_unlimited"; // Replace with actual Stripe price ID
        name = "Unlimited Plan";
        price = 29.99;
        break;
      default:
        return new Response(
          JSON.stringify({ error: "Invalid plan specified" }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 400,
          }
        );
    }

    // Create a checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: name,
              description: `${name} subscription`,
            },
            unit_amount: Math.round(price * 100),
          },
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${redirect_url}?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${redirect_url}?canceled=true`,
    });

    return new Response(JSON.stringify({ sessionId: session.id, url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
