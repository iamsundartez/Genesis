import fastify, { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import * as crypto from 'crypto';

const app: FastifyInstance = fastify({ logger: true });

// 1. Enforce strict typing on the inbound RAG request
const RagRequestSchema = z.object({
  query: z.string().min(5).max(2000),
  departmentContext: z.enum(['DOE_LAB', 'CISA_OPS', 'SUPPLY_CHAIN']),
  userId: z.string().uuid(),
});

type RagRequest = z.infer<typeof RagRequestSchema>;

// Mock logger
const secureAuditLogger = {
  log: (data: any) => app.log.info({ audit: true, ...data }),
  error: (data: any) => app.log.error({ audit: true, ...data })
};

// Mock DLP function for demonstration
function applyDataLossPrevention(text: string): string {
  // Regex to mask social security numbers
  return text.replace(/\b\d{3}-\d{2}-\d{4}\b/g, '[REDACTED-SSN]');
}

// Mock Milvus interaction
async function sendToMilvus(query: string) {
  return "Mock retrieved context for: " + query;
}

// Mock Granite interaction
const ibmGraniteClient = {
  generate: async (options: any) => {
    return {
      text: "Simulated response from IBM Granite model for context: " + options.departmentContext,
      usage: { totalTokens: 42 }
    };
  }
};

app.post('/api/rag', async (req: FastifyRequest, reply: FastifyReply) => {
  const traceId = crypto.randomUUID();
  const timestamp = new Date().toISOString();

  try {
    // 1. Schema Validation (Fails fast if malformed)
    const validatedBody = RagRequestSchema.parse(req.body);

    // 2. Pre-flight Sanitization (Redact PII or classified terms)
    const sanitizedQuery = applyDataLossPrevention(validatedBody.query);

    // 3. Immutable Pre-flight Audit
    secureAuditLogger.log({
      event: 'GRANITE_PROMPT_DISPATCHED',
      traceId,
      timestamp,
      userId: validatedBody.userId,
      department: validatedBody.departmentContext,
      payloadHash: crypto.createHash('sha256').update(sanitizedQuery).digest('hex'),
      rawPayload: sanitizedQuery 
    });

    // 4. Execute Vector Search (RAG Context)
    const milvusContext = await sendToMilvus(sanitizedQuery);

    // 5. Invoke IBM Granite
    const graniteResponse = await ibmGraniteClient.generate({
      prompt: sanitizedQuery,
      context: milvusContext,
      model: 'granite-13b-chat-v2' 
    });

    // 6. Post-flight Response Audit
    secureAuditLogger.log({
      event: 'GRANITE_RESPONSE_RECEIVED',
      traceId,
      timestamp: new Date().toISOString(),
      responseHash: crypto.createHash('sha256').update(graniteResponse.text).digest('hex'),
      tokensUsed: graniteResponse.usage.totalTokens
    });

    // 7. Deliver back to the React Mesh
    return reply.status(200).send({
      traceId,
      data: graniteResponse.text
    });

  } catch (error) {
    secureAuditLogger.error({
      event: 'GRANITE_INTERACTION_FAILED',
      traceId,
      error: error instanceof Error ? error.message : 'Unknown exception'
    });
    
    return reply.status(500).send({ error: 'Governance compliance check failed or internal error.' });
  }
});

const start = async () => {
  try {
    await app.listen({ port: 3000, host: '0.0.0.0' });
    app.log.info('Agent-Governance-Toolkit listening on port 3000');
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
