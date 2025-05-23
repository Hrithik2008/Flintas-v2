import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { OpenAI } from "https://esm.sh/openai@4.20.0";

interface UserContext {
  interest?: string;
  goal?: string;
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { interest, goal }: UserContext = await req.json();
    const openAIKey = Deno.env.get("OPENAI_API_KEY");

    if (!openAIKey) {
      console.error("OPENAI_API_KEY is not set in environment variables.");
      return new Response(
        JSON.stringify({ error: "OpenAI API key not configured." }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        }
      );
    }

    const openai = new OpenAI({ apiKey: openAIKey });

    let promptContent = "Suggest one short, actionable daily task.";
    if (interest && goal) {
      promptContent = `Suggest one short, actionable daily task for someone interested in "${interest}" and working towards the goal: "${goal}".`;
    } else if (interest) {
      promptContent = `Suggest one short, actionable daily task for someone interested in "${interest}".`;
    } else if (goal) {
      promptContent = `Suggest one short, actionable daily task for someone working towards the goal: "${goal}".`;
    }
    
    promptContent += " The task should be something that can be completed in 5-15 minutes. Be concise."

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful assistant that suggests daily tasks." },
        { role: "user", content: promptContent },
      ],
      max_tokens: 50,
      temperature: 0.7,
    });

    const taskText = completion.choices[0]?.message?.content?.trim();

    if (!taskText) {
      console.error("LLM did not return a valid task.", completion);
      return new Response(
        JSON.stringify({ error: "Failed to generate task from LLM." }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        }
      );
    }

    return new Response(JSON.stringify({ task: taskText }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error in Edge Function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});