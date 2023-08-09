import { NextApiRequest, NextApiResponse } from "next";
import withMethods from "@/lib/api-middlewares/with-methods";
import { z } from "zod";
import { db } from "@/lib/db";
import { openai } from "@/lib/openai";
import { cosineSimilarity } from "@/helpers/cosine-similarity";

const reqSchema = z.object({
  text1: z.string().max(1000),
  text2: z.string().max(1000),
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const body = req.body as unknown;

  const apiKey = req.headers.authorization;
  if (!apiKey) {
    res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const { text1, text2 } = reqSchema.parse(body);

    const validApiKey = await db.apiKey.findFirst({
      where: {
        key: apiKey,
        enabled: true,
      },
    });

    if (!validApiKey) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const start = new Date();

    //This wouldn't work because the open ai api key
    //is paid so I resorted to using the API of similarity that is already hosted

    // const embeddings = await Promise.all(
    //   [text1, text2].map(async (text) => {
    //     const res = await openai.createEmbedding({
    //       model: "text-embedding-ada-002",
    //       input: text,
    //     });
    //     return res.data.data[0].embedding;
    //   })
    // );

    // const similarity = cosineSimilarity(embeddings[0], embeddings[1]);

    const response = await fetch(
      "https://www.similarityapi.com/api/v1/similarity",
      {
        method: "POST",
        headers: {
          Authorization: process.env.OPENAI_API_KEY ?? "",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text1: text1,
          text2: text2,
        }),
      }
    );

    const responseData = await response.json();

    if (!responseData.success) {
      return res.status(response.status).json(responseData);
    }

    const similarity = responseData.similarity;

    const duration = new Date().getTime() - start.getTime();

    await db.apiReqeust.create({
      data: {
        duration,
        method: req.method as string,
        path: req.url as string,
        status: 200,
        apiKeyId: validApiKey.id,
        usedApiKey: validApiKey.key,
      },
    });

    return res.status(200).json({ success: true, text1, text2, similarity });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.issues });
    }

    return res.status(500).json({ error: "Internal server error" });
  }
};

export default withMethods(["POST"], handler);
