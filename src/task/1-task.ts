import { namespaceWrapper } from "@_koii/namespace-wrapper";
import { scrapeGoogleScholar } from "./scraper"; // Assuming scraper code is in scraper.ts
import { extractKeywords } from "./nlp"; // Assuming NLP code is in nlp.ts

// In-memory storage for problems and solutions
const problemStatements: { id: number; statement: string }[] = [];
let problemCounter = 0;
export let solution: string = ''; 
export async function task(roundNumber: number): Promise<void> {
  try {
    console.log(`EXECUTE TASK FOR ROUND ${roundNumber}`);

    // Choose user category
    const userCategory = await getUserCategory();

    if (userCategory === "problemDefiner") {
      // Problem definer flow
      const problem = await getUserInput("Enter the problem statement:");
      problemCounter++;
      problemStatements.push({ id: problemCounter, statement: problem });
      console.log("Problem statement submitted successfully!");

    } else if (userCategory === "solutionProvider") {
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
      const solution = await getUserInput("Enter the solution details:");
      const abstract = await getUserInput("Enter the abstract for proof of uniqueness:");

      const userKeywords = extractKeywords(title, abstract);
      console.log("Keywords extracted from user input:", userKeywords);

      const scrapedArticles = await scrapeGoogleScholar(title);
      const scrapedKeywords = scrapedArticles.flatMap((article) => article.keywords);
      console.log("Keywords extracted from scraped articles:", scrapedKeywords);

      const matchPercentage = calculateKeywordMatch(userKeywords, scrapedKeywords);
      
      if (matchPercentage <= 20) {
        console.log("Solution accepted. Match percentage:", matchPercentage, solution);
        //solution = solution;
      } else {
        console.log("Solution rejected. Match percentage:", matchPercentage, "%");
      }
    }

    await namespaceWrapper.storeSet("value", "Task executed successfully!");
  } catch (error) {
    console.error("EXECUTE TASK ERROR:", error);
  }
}

// Helper function to simulate user input
async function getUserInput(promptText: string): Promise<string> {
  // Replace this with actual input mechanism (e.g., readline, UI, etc.)
  console.log(promptText);
  return "Mock user input"; // Placeholder
}

// Helper function to get user category
async function getUserCategory(): Promise<string> {
  const category = await getUserInput("Are you a problem definer or solution provider? (Type 'problemDefiner' or 'solutionProvider')");
  return category.toLowerCase();
}

// Helper function to calculate keyword match percentage
function calculateKeywordMatch(userKeywords: string[], scrapedKeywords: string[]): number {
  const userKeywordSet = new Set(userKeywords);
  const matchedKeywords = scrapedKeywords.filter((keyword) => userKeywordSet.has(keyword));
  return (matchedKeywords.length / userKeywordSet.size) * 100;
}
