import { generateVideoFromImage } from "@/app/api/integration";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        console.log("Post request received in generate-video/route.ts");

        const formData = await request.formData();
        console.log(formData);
        const image = formData.get("image") as File;
        const prompt = formData.get("prompt") as string;

        if (!image || !prompt) {
            return NextResponse.json({ error: "Missing image or prompt" }, { status: 400 });
        }

        // Convert image (which is a File or Blob) to a buffer and then to a buffer URI (base64 data URL)
        const arrayBuffer = await image.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const mimeType = image.type || "image/png";
        const bufferUri = `data:${mimeType};base64,${buffer.toString("base64")}`;
        
        // Call your function (adjust arguments as needed)
        const result = await generateVideoFromImage(bufferUri, prompt);

        return NextResponse.json({ result });
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}