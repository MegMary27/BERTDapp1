import puppeteer from "puppeteer";
import { extractKeywords } from "./nlp";

/**
 * Scrapes Google Scholar for research papers based on a given title.
 * @param query - The search query (title) inputted by the user.
 * @returns A list of objects containing titles, abstracts, and keywords of the research papers.
 */
export async function scrapeGoogleScholar(query: string): Promise<
  { title: string; abstract: string; keywords: string[] }[]
> {
  const browser = await puppeteer.launch({ headless: true }); // Launch Puppeteer browser
  const page = await browser.newPage();

  try {
    // Navigate to Google Scholar and search for the query
    const searchUrl = `https://scholar.google.com/scholar?q=${encodeURIComponent(query)}`;
    await page.goto(searchUrl, { waitUntil: "domcontentloaded" });

    // Wait for the results to load
    await page.waitForSelector(".gs_ri");

    // Scrape titles and abstracts
    const articles = await page.evaluate(() => {
      const results: { title: string; abstract: string }[] = [];
      const articleNodes = document.querySelectorAll(".gs_ri");

      articleNodes.forEach((node) => {
        const titleNode = node.querySelector(".gs_rt a");
        const abstractNode = node.querySelector(".gs_rs");
        const title = titleNode ? titleNode.textContent?.trim() || "" : "";
        const abstract = abstractNode ? abstractNode.textContent?.trim() || "" : "";

        if (title && abstract) {
          results.push({ title, abstract });
        }
      });

      return results;
    });

    // Extract keywords from each article using NLP
    const processedArticles = articles.map((article) => ({
      title: article.title,
      abstract: article.abstract,
      keywords: extractKeywords(article.title, article.abstract),
    }));

    return processedArticles;
  } catch (error) {
    console.error("Error during scraping:", error);
    return [];
  } finally {
    await browser.close(); // Close the browser
  }
}
