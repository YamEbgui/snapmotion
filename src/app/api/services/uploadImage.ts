import { tmpdir } from "os";
import { getPresignedUrl, uploadImageToS3 } from "../lib/s3Service";
import { join as pathJoin } from 'path';
import { readFileSync } from "fs";
import { logger } from "../lib/logger";

const tmpDir = tmpdir();

// This function is used to upload an image to S3 and return a presigned url for the frame
export async function uploadImageAndReturnPresignedUrl(frameName: string) {
    const startTime = Date.now();

    try {
        logger.info("Starting S3 upload process", { frameName });

        // Read frame from tmp directory
        const framePath = pathJoin(tmpDir, frameName);
        const frameBuffer = await readFileSync(framePath);

        logger.debug("Frame file read from disk", {
            frameName,
            framePath,
            bufferSize: frameBuffer.length
        });

        // Upload Image to S3
        await uploadImageToS3(frameBuffer, frameName);
        logger.info("Frame uploaded to S3 successfully", { frameName });

        // Generate Presigned URL for the frame
        const presignedUrl = await getPresignedUrl(frameName);

        const processingTime = Date.now() - startTime;
        logger.info("Presigned URL generated", {
            frameName,
            processingTimeMs: processingTime,
            urlGenerated: presignedUrl ? "success" : "failed"
        });

        return presignedUrl;
    } catch (error) {
        const processingTime = Date.now() - startTime;
        logger.error("Error in S3 upload process", {
            frameName,
            error,
            processingTimeMs: processingTime
        });
        throw error;
    }
}