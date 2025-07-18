import { generateVideoFromImage } from "@/app/api/services/falIntegration";
import { downloadVideo } from "@/app/api/services/downloadVideo";
import { extractFrame } from "@/app/api/services/framesExtraction";
import { uploadImageAndReturnPresignedUrl } from "@/app/api/services/uploadImage";
import { tmpdir } from 'os';
import { join as pathJoin } from 'path';
import { unlink } from 'fs/promises';
import { logger } from "../lib/logger";
import { compareImages } from "../services/openAIService";
import { readFileSync } from "fs";
import { Frame } from "@/app/types/Frame";

const tmpDir = tmpdir();

// This function is used to generate frames from an image
export async function generateFrames(image: File): Promise<Frame[]> {
    try {
        logger.info("Starting frames  generation process");

        // Convert image (which is a File or Blob) to a buffer and then to a buffer URI (base64 data URL)
        const arrayBuffer = await image.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const mimeType = image.type || "image/png";
        const bufferUri = `data:${mimeType};base64,${buffer.toString("base64")}`;

        // Generate frames
        logger.info("Image converted to base64, generating frames concurrently");
        const frames = await Promise.all(generateFramesListOfPromises(buffer, bufferUri));

        logger.info("All frames generated successfully", { totalFrames: frames.length });

        return frames;
    } catch (error) {
        logger.error("Error in generateFrames function", error);
        throw error;
    }
}

// This function is used to generate a single frame from an image
async function generateFrame(buffer: Buffer, bufferUri: string) {
    let reqId: string | undefined;
    let frame: string | undefined;
    const frameStartTime = Date.now();

    try {
        logger.debug("Starting individual frame generation");

        // Call your function (adjust arguments as needed)
        const videoResult = await generateVideoFromImage(bufferUri);
        reqId = videoResult.requestId;//Using requestId to identify the video

        logger.info("Video generated from image", { requestId: reqId });

        // Ensure Url for video exist 
        if (videoResult.data.video.url !== null) {
            logger.debug("Downloading video", { requestId: reqId, videoUrl: videoResult.data.video.url });
            await downloadVideo(videoResult.data.video.url, reqId + ".mp4");
            logger.info("Video downloaded successfully", { requestId: reqId });
        } else {
            logger.error("Video generation failed - no video URL returned", { requestId: reqId });
            throw new Error("Video generation failed");
        }

        // Get Frame from video
        const videoPath = reqId + ".mp4";
        logger.debug("Extracting frame from video", { videoPath });
        frame = await extractFrame(videoPath);

        logger.info("Frame extracted successfully", { frame, requestId: reqId });

        // Compare original image with generated frame 
        const imageComparisonResult = await compareFrames(buffer, frame);

        // Upload frame to S3
        logger.debug("Uploading frame to S3", { frame });
        const presignedUrl = await uploadImageAndReturnPresignedUrl(frame);

        const frameProcessingTime = Date.now() - frameStartTime;
        logger.info("Frame processing completed", {
            requestId: reqId,
            frame,
            processingTimeMs: frameProcessingTime,
            presignedUrl: presignedUrl ? "generated" : "failed"
        });

        const result = {
            url: presignedUrl,
            score: imageComparisonResult.score,
            reasoning: imageComparisonResult.reasoning,
        } as Frame;

        return result;
    } catch (error) {
        const frameProcessingTime = Date.now() - frameStartTime;
        logger.error("Error while generating individual frame", {
            error,
            requestId: reqId,
            processingTimeMs: frameProcessingTime
        });
        throw error;
    } finally {
        // Cleanup temp files
        if (reqId) {
            const videoFile = pathJoin(tmpDir, reqId + ".mp4");
            try {
                await unlink(videoFile);
                logger.debug("Cleaned up temp video file", { videoFile });
            } catch (err) {
                logger.warn("Failed to delete temp video file", { videoFile, error: err });
            }
        }
        if (frame) {
            const frameFile = pathJoin(tmpDir, frame);
            try {
                await unlink(frameFile);
                logger.debug("Cleaned up temp frame file", { frameFile });
            } catch (err) {
                logger.warn("Failed to delete temp frame file", { frameFile, error: err });
            }
        }
    }
}

// This function is used to generate a list of promises for the frames generation
function generateFramesListOfPromises(buffer: Buffer, bufferUri: string) {
    const frame1 = generateFrame(buffer, bufferUri);
    const frame2 = generateFrame(buffer, bufferUri);
    const frame3 = generateFrame(buffer, bufferUri);

    return [frame1, frame2, frame3];
}

// This function is used to compare the original image with the generated frame
async function compareFrames(originalImageBuffer: Buffer, frame: string) {
    try {
        // Read frame from tmp directory
        const framePath = pathJoin(tmpDir, frame);
        const frameBuffer = await readFileSync(framePath);

        // Compare original image with generated frame
        const score = await compareImages(originalImageBuffer, frameBuffer);
        logger.info("Frame compared successfully", { score });

        return score;
    } catch (error) {
        logger.error("Error while comparing frames", error);
        throw error;
    }
}