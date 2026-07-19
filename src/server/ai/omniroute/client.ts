import OpenAI from "openai";
import { env } from "@/env";

// OmniRoute client acts identically to the Official OpenAI SDK 
// but is hardcoded to funnel strictly via the configured OmniRoute gateway.
export const omnirouteClient = new OpenAI({
  apiKey: env.OMNIROUTE_API_KEY,
  baseURL: env.OMNIROUTE_API_URL,
});
