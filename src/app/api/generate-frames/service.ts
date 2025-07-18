import { generateVideoFromImage } from "@/app/api/services/integration";
import { downloadVideo } from "@/app/api/services/downloadVideo";
import { extractFrame } from "@/app/api/services/framesExtraction";
import { uploadImageAndReturnPresignedUrl } from "../services/uploadImage";
import { tmpdir } from 'os';
import { join as pathJoin } from 'path';
import { unlink } from 'fs/promises';


export async function generateFrames(image: File) {
    try {
        console.log("Generating frames [generateFrames]");
        // Convert image (which is a File or Blob) to a buffer and then to a buffer URI (base64 data URL)
        const arrayBuffer = await image.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const mimeType = image.type || "image/png";
        const bufferUri = `data:${mimeType};base64,${buffer.toString("base64")}`;

        const frames = await Promise.all(generateFramesListOfPromises(bufferUri));
        const result = frames.map((frame) => {
            return { url: frame };
        });
        return result;
    } catch (error) {
        console.error("Error while generating frames [generateFrames]:", error);
        throw error;
    }
}

async function generateFrame(bufferUri: string) {
    const tmpDir = tmpdir();
    let reqId: string | undefined;
    let frame: string | undefined;
    try {
        // Call your function (adjust arguments as needed)
        const result = await generateVideoFromImage(bufferUri);
        reqId = result.requestId;//Using requestId to identify the video

        // Ensure Url for video exist 
        if (result.data.video.url !== null) {
            await downloadVideo(result.data.video.url, reqId + ".mp4");
        } else {
            throw new Error("Video generation failed");
        }

        // Get Frame from video
        const videoPath = reqId + ".mp4";
        frame = await extractFrame(videoPath);

        console.log("Frame: " + frame);

        // Upload frame to S3
        const presignedUrl = await uploadImageAndReturnPresignedUrl(frame);

        return presignedUrl
    } catch (error) {
        console.error("Error while getFrame:", error);
        throw error;
    } finally {
        // Cleanup temp files
        if (reqId) {
            const videoFile = pathJoin(tmpDir, reqId + ".mp4");
            try {
                await unlink(videoFile);
                console.log(`Deleted temp video: ${videoFile}`);
            } catch (err) {
                console.warn(`Failed to delete temp video: ${videoFile}`, err);
            }
        }
        if (frame) {
            const frameFile = pathJoin(tmpDir, frame);
            try {
                await unlink(frameFile);
                console.log(`Deleted temp frame: ${frameFile}`);
            } catch (err) {
                console.warn(`Failed to delete temp frame: ${frameFile}`, err);
            }
        }
    }
}

function generateFramesListOfPromises(bufferUri: string) {
    const frame1 = generateFrame(bufferUri);
    const frame2 = generateFrame(bufferUri);
    const frame3 = generateFrame(bufferUri);
    const frame4 = generateFrame(bufferUri);
    const frame5 = generateFrame(bufferUri);

    return [frame1, frame2, frame3, frame4, frame5];
}

