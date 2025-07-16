import { fal } from "@fal-ai/client"

fal.config({
    credentials: process.env.FAL_API_KEY,
})

export async function generateVideoFromImage(imageUrl: string, prompt: string) {
    try {
        const model = process.env.FAL_VIDEO_GENERATION_MODEL || '';
        if (model === "") {
            throw new Error("FAL_VIDEO_GENERATION_MODEL is not undefined");
        }
        const result = await fal.subscribe(model, {
            input: {
                prompt,
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