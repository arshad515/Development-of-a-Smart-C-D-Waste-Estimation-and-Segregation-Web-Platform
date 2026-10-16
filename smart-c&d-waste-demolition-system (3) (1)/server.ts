/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { createClient } from "@supabase/supabase-js";
import { calculateDemolitionWaste, DEFAULT_CITY_RATES } from "./src/utils/formulas.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory City Rates with the fallback defaults
let sessionCityRates = [...DEFAULT_CITY_RATES];

// Lazy-initialize Supabase client to prevent app failure if keys are missing
let supabaseClient: any = null;
function getSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error("SUPABASE_URL and SUPABASE_ANON_KEY environment variables are not configured in your Secrets panel.");
  }
  if (!supabaseClient) {
    supabaseClient = createClient(url, key);
  }
  return supabaseClient;
}

// Lazy-initialize Groq key getter
function getGroqApiKey(): string {
  const key = process.env.GROQ_API_KEY;
  if (!key) {
    throw new Error("GROQ_API_KEY environment variable is required for AI features. Please configure it in your Secrets panel.");
  }
  return key;
}

// REST API Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// GET currently configured rates
app.get("/api/rates", (req, res) => {
  res.json({ rates: sessionCityRates });
});

// POST update rate sheet
app.post("/api/rates", (req, res) => {
  const updated = req.body;
  if (Array.isArray(updated)) {
    sessionCityRates = updated;
    return res.json({ success: true, message: "City rates sheet updated successfully.", rates: sessionCityRates });
  }
  res.status(400).json({ success: false, error: "Invalid data format. Expected an array of CityRates." });
});

// POST estimate waste based on engineering inputs
app.post("/api/estimate", (req, res) => {
  const { meta, inputs, rates } = req.body;
  
  if (!meta || !inputs || !rates) {
    return res.status(400).json({ error: "Missing required estimation elements (meta, inputs, or rates)." });
  }

  try {
    const result = calculateDemolitionWaste(meta, inputs, rates);
    res.json({ success: true, estimation: result });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed during engineering calculations." });
  }
});

// GET Supabase status
app.get("/api/supabase/status", (req, res) => {
  const isUrl = !!process.env.SUPABASE_URL;
  const isKey = !!process.env.SUPABASE_ANON_KEY;
  res.json({
    configured: isUrl && isKey,
    url: isUrl ? process.env.SUPABASE_URL : null,
  });
});

// GET all stored estimations
app.get("/api/supabase/estimations", async (req, res) => {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("demolition_estimations")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }
    res.json({ success: true, count: data?.length || 0, data });
  } catch (err: any) {
    console.error("Supabase GET Error:", err);
    res.status(500).json({ 
      success: false, 
      error: err.message, 
      code: err.code || "DB_ERROR",
      tip: err.message?.includes("relation") && err.message?.includes("does not exist")
        ? "The 'demolition_estimations' table does not exist in your Supabase database schema yet. Please copy the SQL code below and execute it in your Supabase SQL Editor."
        : "Failed to fetch saved estimations. Please verify your Supabase database credentials or status."
    });
  }
});

// POST save a new estimation or update an existing one if ID provided
app.post("/api/supabase/estimations", async (req, res) => {
  const { id, project_name, metadata, inputs, output } = req.body;
  if (!project_name || !metadata || !inputs || !output) {
    return res.status(400).json({ success: false, error: "Missing required fields (project_name, metadata, inputs, or output)." });
  }

  try {
    const supabase = getSupabase();
    let response;

    if (id) {
      // Update
      response = await supabase
        .from("demolition_estimations")
        .update({
          project_name,
          metadata,
          inputs,
          output,
        })
        .eq("id", id)
        .select();
    } else {
      // Insert
      response = await supabase
        .from("demolition_estimations")
        .insert([{
          project_name,
          metadata,
          inputs,
          output,
        }])
        .select();
    }

    if (response.error) {
      throw response.error;
    }

    res.json({ success: true, data: response.data?.[0] });
  } catch (err: any) {
    console.error("Supabase SAVE Error:", err);
    res.status(500).json({ 
      success: false, 
      error: err.message, 
      code: err.code || "DB_ERROR",
      tip: err.message?.includes("relation") && err.message?.includes("does not exist")
        ? "The 'demolition_estimations' table does not exist in your Supabase database schema yet. Please copy the SQL code below and execute it in your Supabase SQL Editor."
        : "Failed to persist project in your Supabase database. Verify secrets or schemas."
    });
  }
});

// DELETE a stored estimation
app.delete("/api/supabase/estimations/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const supabase = getSupabase();
    const { error } = await supabase
      .from("demolition_estimations")
      .delete()
      .eq("id", id);

    if (error) {
      throw error;
    }
    res.json({ success: true, message: `Estimation deleted successfully.` });
  } catch (err: any) {
    console.error("Supabase DELETE Error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST Smart Groq-powered specialist chat adviser
app.post("/api/assistant", async (req, res) => {
  const { messages, context } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Messages array is required." });
  }

  try {
    const apiKey = getGroqApiKey();
    
    // Construct rich system prompt with structural context from calculation
    const systemPrompt = `You are "Smart C&D Consultant", a leading Senior Civil Engineer and Sustainable Demolition Specialist certified under LEED and Swachh Bharat C&D guidelines.
Your goal is to assist students, site engineers, and project owners in estimating demolition waste, planning source-segregation, selecting proper bin arrangements, optimizing recovery values, and recommending concrete recycling processes.

Under no circumstances explain internal directory paths or self-praise.
Provide practical, formula-grounded, humble, structural engineering advice. Keep responses clear and concise.

${context ? `CURRENT ACTIVE PROJECT DATA AND ANALYSIS:
- Project Name: ${context.meta?.projectName || "Unnamed Project"}
- Building Type: ${context.meta?.buildingType || "General Structure"}
- Selected City: ${context.meta?.city || "Pune"}
- Built-up Area: ${context.meta?.builtUpArea || 0} sq m, Floors: ${context.meta?.floorsCount || 1}
- Total Estimated Waste Mass: ${(context.output?.totalWasteMass || 0).toFixed(1)} kg
- Recovered/Recycled Mass: ${(context.output?.totalRecoverableMass || 0).toFixed(1)} kg
- Materials Breakdown Mass:
${(context.output?.materialBreakdown || []).map((m: any) => `  * ${m.material}: ${m.totalMass.toFixed(0)} kg (Diversion Rate: ${Math.round((m.reusableMass + m.recyclableMass) * 100 / (m.totalMass || 1))}%)`).join("\n")}
- Transport Expenses: ₹ ${(context.output?.transportCost || 0).toFixed(2)}
- Landfill Damages: ₹ ${(context.output?.landfillCost || 0).toFixed(2)}
- Total Realizable Reclaim Value: ₹ ${(context.output?.recoveryValue || 0).toFixed(2)}
- Net Economic Benefit/Cost: ₹ ${(context.output?.netCost || 0).toFixed(2)}` : ""}

Utilize default values from the standard Construction & Demolition Waste Management rules, 2016. Standardize recommendations using the color-coded bin classification:
- White/Grey bin: Concrete, bricks, tiles
- Blue bin: Structural steel and metals
- Green bin: Timber and wood panels
- Yellow bin: Gypsum boards
- Orange bin: Plastics and packaging pvc
- Red bin: Hazardous leftovers
- Black bin: Unsorted mixed residue`;

    // Map conversation array to OpenAI/Groq standard chat format
    const formattedMessages = [
      { role: "system", content: systemPrompt },
      ...messages.map((m: any) => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: m.content
      }))
    ];

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: formattedMessages,
        temperature: 0.7,
        max_tokens: 1024
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Groq API Error (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "I was unable to assess the materials. Please double check parameters.";
    res.json({ reply });
  } catch (err: any) {
    console.error("Groq Error:", err);
    res.status(500).json({ error: err.message || "Consultant module is currently offline." });
  }
});

// Setup dev and production static rendering
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    // Use Vite middleware
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Smart Demolition Fullstack running on http://localhost:${PORT}`);
  });
}

startServer();
