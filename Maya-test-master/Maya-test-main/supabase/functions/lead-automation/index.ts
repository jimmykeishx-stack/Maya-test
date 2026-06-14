import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

serve(async (request) => {
  const payload = await request.json().catch(() => null);

  return new Response(
    JSON.stringify({
      success: true,
      message: "Lead automation placeholder executed.",
      received: payload
    }),
    {
      headers: {
        "content-type": "application/json"
      }
    }
  );
});
