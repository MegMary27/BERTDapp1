import axios from "axios";

// Your HuggingFace Inference API Token
const API_TOKEN = "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"; // Replace with your actual token
const SBERT_API_URL = "https://api-inference.huggingface.co/embeddings";

/**
 * Get SBERT embeddings for a given text.
 * @param text The input text to generate embeddings for.
 * @returns A Promise that resolves to the embedding vector (number array).
 */
export async function getSBertEmbeddings(text: string): Promise<number[]> {
  try {
    const response = await axios.post(
      SBERT_API_URL,
      { inputs: text },
      { headers: { Authorization: `Bearer ${API_TOKEN}` } }
    );

    return response.data[0];
  } catch (error) {
    console.error("Error fetching SBERT embeddings:", error);
    throw error;
  }
}
