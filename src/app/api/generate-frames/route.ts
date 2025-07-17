import { NextRequest, NextResponse } from "next/server";
import { generateVideoFromImage } from "@/app/api/services/integration";
import { downloadVideo } from "@/app/api/services/downloadVideo";
import { extractFrame } from "@/app/api/services/framesExtraction";
import { readFileSync } from "fs";
import { uploadImageAndReturnPresignedUrl } from "../services/uploadImage";
import { readFile } from 'fs/promises'
import { join as pathJoin } from 'path';
import { tmpdir } from "os";

const tmpDir = tmpdir();

export async function POST(request: NextRequest) {
    try {
        console.log("Post request received in generate-video/route.ts");

        const formData = await request.formData();
        console.log(formData);
        const image = formData.get("image") as File;

        if (!image) {
            return NextResponse.json({ error: "Missing image" }, { status: 400 });
        }

        // Convert image (which is a File or Blob) to a buffer and then to a buffer URI (base64 data URL)
        const arrayBuffer = await image.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const mimeType = image.type || "image/png";
        const bufferUri = `data:${mimeType};base64,${buffer.toString("base64")}`;

        // Call your function (adjust arguments as needed)
        const result = await generateVideoFromImage(bufferUri);
        const reqId = result.requestId;


        // Ensure Url for video exist 
        if (result.data.video.url !== null) {
            await downloadVideo(result.data.video.url, reqId + ".mp4");
        } else {
            throw new Error("Video generation failed");
        }

        // Get Frame from video
        const videoPath = reqId + ".mp4";
        const frame = await extractFrame(videoPath);

        console.log("Frame: " + frame);

        // Upload frame to S3
        const framePath = pathJoin(tmpDir, frame);
        const frameBuffer = await readFileSync(framePath);
        const presignedUrl = await uploadImageAndReturnPresignedUrl(frameBuffer, frame);

        return NextResponse.json({ frames: [{ url: presignedUrl }] });
    } catch (error) {
        console.error("Error while generating frames:", error);
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}
