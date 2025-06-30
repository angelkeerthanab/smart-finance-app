import { serve } from "https://deno.land/std@0.192.0/http/server.ts";

serve(async (req: Request) => {
  // Always set CORS headers
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*", // or "http://localhost:3000" for stricter security
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };

  // Handle preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Parse the JSON request body
    const { description } = await req.json();

    if (!description) {
      return new Response(JSON.stringify({ error: "Description is required" }), {
        status: 400,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      });
    }

    // Keyword-to-category mapping
    const categoryMap: Record<string, string> = {
      zomato: "food",
      swiggy: "food",
      dinner: "food",
      lunch: "food",
      grocery: "groceries",
      bus: "transport",
      uber: "transport",
      ola: "transport",
      electricity: "bills",
      amazon: "shopping",
      medicine: "health",
      movie: "entertainment",
      flight: "travel",
      train: "travel",
    };

    // Match keywords in the description
    const matchedKey = Object.keys(categoryMap).find((keyword) =>
      description.toLowerCase().includes(keyword)
    );

    const category = matchedKey ? categoryMap[matchedKey] : "other";

    return new Response(JSON.stringify({ category }), {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  }
});