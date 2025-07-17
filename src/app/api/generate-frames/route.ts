import { NextRequest, NextResponse } from "next/server";
import { generateVideoFromImage } from "@/app/api/services/integration";
import { downloadVideo } from "@/app/api/services/downloadVideo";
import { extractFrame } from "@/app/api/services/framesExtraction";

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
        const frame = await extractFrame(reqId + ".mp4");

        return NextResponse.json({ frames: [frame] });
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}
