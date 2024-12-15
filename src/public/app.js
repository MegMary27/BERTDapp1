let userCategory = '';
let problemStatements = [];
let problemCounter = 0;

function selectCategory(category) {
  userCategory = category;
  document.getElementById("category-selection").style.display = "none";

  if (category === 'problemDefiner') {
    document.getElementById("problem-definer").style.display = "block";
  } else if (category === 'solutionProvider') {
    document.getElementById("solution-provider").style.display = "block";
  }
}

function submitProblem() {
  const problemInput = document.getElementById("problem-input").value;
  problemCounter++;
  problemStatements.push({ id: problemCounter, statement: problemInput });

  document.getElementById("problem-input").value = '';
  showResult("Problem statement submitted successfully!");
}

function submitSolution() {
  const problemId = parseInt(document.getElementById("problem-id").value);
  const title = document.getElementById("solution-title").value;
  const solutionDetails = document.getElementById("solution-details").value;
  const abstract = document.getElementById("solution-abstract").value;

  const selectedProblem = problemStatements.find(p => p.id === problemId);

  if (!selectedProblem) {
    showResult("Invalid problem ID selected.");
    return;
  }

  const userKeywords = extractKeywords(title, abstract);
  const scrapedArticles = scrapeGoogleScholar(title);
  const scrapedKeywords = scrapedArticles.flatMap(article => article.keywords);
  const matchPercentage = calculateKeywordMatch(userKeywords, scrapedKeywords);

  if (matchPercentage <= 20) {
    showResult(`Solution accepted. Match percentage: ${matchPercentage}%\nSolution: ${solutionDetails}`);
  } else {
    showResult(`Solution rejected. Match percentage: ${matchPercentage}%`);
  }
}

function showResult(message) {
  document.getElementById("result").innerText = message;
}

// Mock external functions for extraction, scraping, and match calculation
function extractKeywords(title, abstract) {
  return [title.split(" ")[0], abstract.split(" ")[0]]; // Placeholder logic
}

function scrapeGoogleScholar(title) {
  return [{ keywords: ["AI", "Machine Learning", "Problem Solving"] }]; // Placeholder logic
}

function calculateKeywordMatch(userKeywords, scrapedKeywords) {
  const userKeywordSet = new Set(userKeywords);
  const matchedKeywords = scrapedKeywords.filter(keyword => userKeywordSet.has(keyword));
  return (matchedKeywords.length / userKeywordSet.size) * 100;
}
