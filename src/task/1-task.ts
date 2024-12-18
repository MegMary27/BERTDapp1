import { namespaceWrapper } from "@_koii/namespace-wrapper";
import { scrapeGoogleScholar } from "./scraper"; // Assuming scraper code is in scraper.ts
import { getSBertEmbeddings } from "./sbert"; // A new function to get SBERT embeddings
import cosineSimilarity from "cosine-similarity";

// In-memory storage for problems and solutions
const problemStatements: { id: number; statement: string }[] = [];
let problemCounter = 0;
export let solution: string = '';

export async function task(roundNumber: number): Promise<void> {
  try {
    console.log(`EXECUTE TASK FOR ROUND ${roundNumber}`);

    // Choose user category
    const userCategory = await getUserCategory();

    if (userCategory === "problemdefiner") {
      // Problem definer flow
      const problem = await getUserInput("Enter the problem statement:");
      problemCounter++;
      problemStatements.push({ id: problemCounter, statement: problem });
      console.log("Problem statement submitted successfully!");

    } else if (userCategory === "solutionprovider") {
      // Solution provider flow
      console.log("Available problem statements:");
      problemStatements.forEach((p) => console.log(`${p.id}: ${p.statement}`));

      const problemId = parseInt(await getUserInput("Enter the ID of the problem you want to solve:"));
      const selectedProblem = problemStatements.find((p) => p.id === problemId);

      if (!selectedProblem) {
        console.log("Invalid problem ID selected.");
        return;
      }

      const title = await getUserInput("Enter the solution title:");
      const solutionDetails = await getUserInput("Enter the solution details:");
      const abstract = await getUserInput("Enter the abstract for proof of uniqueness:");

      // Get SBERT embeddings for the user's abstract
      const userEmbedding = await getSBertEmbeddings(abstract);
      console.log("SBERT embedding for user abstract obtained.");

      // Scrape Google Scholar for related articles
      const scrapedArticles = await scrapeGoogleScholar(title);
      console.log("Scraped articles from Google Scholar.");

      // Get embeddings for the scraped abstracts
      const scrapedEmbeddings = await Promise.all(
        scrapedArticles.map((article) => getSBertEmbeddings(article.abstract))
      );
      console.log("SBERT embeddings for scraped articles obtained.");

      // Calculate cosine similarity with each scraped abstract
      const similarities = scrapedEmbeddings.map((embedding) => cosineSimilarity(userEmbedding, embedding));

      // Find the maximum similarity score
      const maxSimilarity = Math.max(...similarities);

      console.log(`Maximum similarity score: ${(maxSimilarity * 100).toFixed(2)}%`);

      if (maxSimilarity <= 0.2) {
        console.log("Solution accepted. Similarity score:", (maxSimilarity * 100).toFixed(2), "%");
        solution = solutionDetails;
      } else {
        console.log("Solution rejected. Similarity score:", (maxSimilarity * 100).toFixed(2), "%");
      }
    }

    await namespaceWrapper.storeSet("value", "Task executed successfully!");
  } catch (error) {
    console.error("EXECUTE TASK ERROR:", error);
  }
}

// Helper function to simulate user input
async function getUserInput(promptText: string): Promise<string> {
  console.log(promptText);
  return "Mock user input"; // Placeholder
}

// Helper function to get user category
async function getUserCategory(): Promise<string> {
  const category = await getUserInput("Are you a problem definer or solution provider? (Type 'problemDefiner' or 'solutionProvider')");
  return category.toLowerCase();
}
