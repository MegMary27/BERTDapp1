import nlp from 'compromise';

/**
 * Extracts keywords from the given title and abstract.
 * @param title - The title provided by the user.
 * @param abstract - The abstract provided by the user.
 * @returns A list of keywords extracted from the title and abstract.
 */
export function extractKeywords(title: string, abstract: string): string[] {
    if (!title || !abstract) {
        console.error("Error: Both title and abstract are required to extract keywords.");
        return [];
    }

    // Combine the title and abstract for analysis
    const text = `${title} ${abstract}`;

    // Use compromise to tokenize and analyze the text
    const doc = nlp(text);

    // Extract nouns, verbs, and adjective-noun phrases
    const keywords = [
        ...doc.nouns().out('array'), // Extract nouns
        ...doc.verbs().out('array'), // Extract verbs
        ...doc.match('#Adjective #Noun').out('array') // Extract adjective-noun pairs
    ];

    // Remove duplicates, normalize to lowercase, and filter out non-empty strings
    const uniqueKeywords = [...new Set(keywords.map((word) => word.toLowerCase().trim()))].filter(Boolean);

    return uniqueKeywords;
}


