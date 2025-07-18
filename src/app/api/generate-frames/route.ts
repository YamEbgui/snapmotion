import { NextRequest, NextResponse } from "next/server";
import { generateVideoFromImage } from "@/app/api/services/integration";
import { downloadVideo } from "@/app/api/services/downloadVideo";
import { extractFrame } from "@/app/api/services/framesExtraction";
import { readFileSync } from "fs";
import { uploadImageAndReturnPresignedUrl } from "../services/uploadImage";
import { readFile } from 'fs/promises'
import { join as pathJoin } from 'path';
import { tmpdir } from "os";
import { generateFrames } from "./service";

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

        const frames = await generateFrames(image);

        return NextResponse.json({ frames });
    } catch (error) {
        console.error("Error while generating frames:", error);
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}
