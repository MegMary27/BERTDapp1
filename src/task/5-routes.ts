import { namespaceWrapper, app } from "@_koii/namespace-wrapper";
import express from "express"; // Required to serve static files
import path from "path"; // Helps resolve the public directory path

/**
 * Define all your custom routes and integrate the UI here
 */
export async function routes() {
  // Serve static files from the `public` folder
  const publicDir = "C:\task-template-ui\task-template\src\public"; // Adjust path if needed
  app.use(express.static(publicDir)); // Use the public folder for static assets

  // Define the root route to serve the frontend
  app.get("/", (_req, res) => {
    res.sendFile(path.join(publicDir, "index.html")); // Serve the main HTML file
  });

  // Example API route to get a value
  app.get("/value", async (_req, res) => {
    try {
      const value = await namespaceWrapper.storeGet("value");
      console.log("Fetched value from namespaceWrapper:", value);
      res.status(200).json({ value: value });
    } catch (error) {
      console.error("Error fetching value:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  console.log("[INFO] Routes initialized and UI integrated!");
}
