import { fal } from "@fal-ai/client"
import { FAL_AI_PROMPT } from "../prompts";
import { logger } from "../lib/logger";

fal.config({
    credentials: process.env.FAL_API_KEY,
})

// generate 5 seconds video from image
export async function generateVideoFromImage(imageUrl: string) {
    const startTime = Date.now();

    try {
        const model = process.env.FAL_VIDEO_GENERATION_MODEL || '';
        if (model === "") {
            logger.error("Fal generation model environment variable is not set");
            throw new Error("FAL_VIDEO_GENERATION_MODEL is not undefined");
        }

        logger.info("Starting AI video generation", {
            model,
            imageUrlLength: imageUrl.length
        });

        const result = await fal.subscribe(model, {
            input: {
                prompt: FAL_AI_PROMPT,
                image_url: imageUrl,
            },
            logs: true,
        })

        const processingTime = Date.now() - startTime;

        // Ensure if response has video url
        if (result.data?.video?.url) {
            logger.info("AI video generation successful", {
                requestId: result.requestId,
                processingTimeMs: processingTime,
                videoUrl: result.data.video.url ? "generated" : "missing"
            });
        } else {
            logger.warn("AI video generation completed but no video URL", {
                requestId: result.requestId,
                processingTimeMs: processingTime,
                result: JSON.stringify(result)
            });
        }
        
        return result;
    } catch (err) {
        const processingTime = Date.now() - startTime;
        logger.error("AI video generation failed", {
            error: err,
            processingTimeMs: processingTime
        });
        throw err;
    }

}