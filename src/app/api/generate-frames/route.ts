import { NextRequest, NextResponse } from "next/server";
import { generateFrames } from "./service";
import { logger } from "../lib/logger";

export async function POST(request: NextRequest) {
    const startTime = Date.now();
    try {
        logger.info("POST request received for frame generation");

        const formData = await request.formData();
        const image = formData.get("image") as File;

        if (!image) {
            logger.warn("Request missing image file");
            return NextResponse.json({ error: "Missing image" }, { status: 400 });
        }

        logger.info("Image received for processing", {
            size: image.size,
            type: image.type,
            name: image.name
        });

        const frames = await generateFrames(image);

        const processingTime = Date.now() - startTime;
        logger.info("Frame generation completed successfully", {
            framesGenerated: frames.length,
            processingTimeMs: processingTime
        });

        return NextResponse.json({ frames });
    } catch (error) {
        const processingTime = Date.now() - startTime;
        logger.error("Error while generating frames", {
            error: error instanceof Error ? error.message : error,
            processingTimeMs: processingTime
        });
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}
