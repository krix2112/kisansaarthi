export interface KnowledgeRecord {
  id: string;
  content: string;
  metadata?: Record<string, unknown>;
  similarityScore?: number;
}

export interface KnowledgeRetrieverOptions {
  query: string;
  matchThreshold?: number;
  matchCount?: number;
}

/**
 * Knowledge Retriever Stub for Supabase PostgreSQL + pgvector.
 * Future RAG flow:
 * farmer question -> embedding generation -> pgvector similarity search via Supabase -> Groq/Voice Agent.
 */
export async function retrieveKnowledge(
  options: KnowledgeRetrieverOptions
): Promise<KnowledgeRecord[]> {
  // TODO: Implement embedding generation & pgvector similarity search via Supabase RPC / client
  console.log(`[PGVECTOR STUB] Querying knowledge base for query: "${options.query}"`);
  return [];
}
