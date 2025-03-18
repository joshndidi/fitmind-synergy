
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

// Set up CORS headers for the function
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
}

interface PaymentIntent {
  plan: string
  amount: number
  currency: string
  customer_email: string
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    })
  }

  // Verify the request method
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  try {
    // Parse the request body
    const { plan, amount, currency, customer_email } = await req.json() as PaymentIntent
    
    // In a real implementation, you'd process the payment with Stripe
    // Here we'll just simulate a successful payment
    console.log(`Processing payment for ${plan} plan: ${amount} ${currency} from ${customer_email}`)
    
    // Add a small delay to simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Return a successful response
    return new Response(
      JSON.stringify({
        success: true,
        data: {
          id: `pi_${Date.now()}`,
          plan,
          amount,
          currency,
          status: 'succeeded',
          created_at: new Date().toISOString()
        }
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  } catch (error) {
    console.error('Error processing payment:', error)
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
