import { fal } from "@fal-ai/client"
import { FAL_AI_PROMPT } from "../prompts";
import { randomUUID } from "crypto";
fal.config({
    credentials: process.env.FAL_API_KEY,
})

// generate 5 seconds video from image
export async function generateVideoFromImage(imageUrl: string) {
    try {
        const model = process.env.FAL_VIDEO_GENERATION_MODEL || '';
        if (model === "") {
            throw new Error("FAL_VIDEO_GENERATION_MODEL is not undefined");
        }
        const result = await fal.subscribe(model, {
            input: {
                prompt: FAL_AI_PROMPT,
                image_url: imageUrl,
            },
            logs: true,
        })
        console.log(result);

        return result;
    } catch (err) {
        console.error(err);
        throw err;
    }

}