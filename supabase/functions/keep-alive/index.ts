// supabase/functions/keep-alive/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

serve(async (req) => {
  console.log("Keep-alive function triggered!")
  
  return new Response(
    JSON.stringify({ message: "Supabase is awake!" }),
    { headers: { "Content-Type": "application/json" } }
  )
})