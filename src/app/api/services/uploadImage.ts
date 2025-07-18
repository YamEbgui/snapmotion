import { tmpdir } from "os";
import { getPresignedUrl, uploadImageToS3 } from "../lib/s3Service";
import { join as pathJoin } from 'path';
import { readFileSync } from "fs";

const tmpDir = tmpdir();

export async function uploadImageAndReturnPresignedUrl(frameName: string) {
    try {
        console.log("Uploading image to S3");
        console.log("File name: " + frameName);
        const framePath = pathJoin(tmpDir, frameName);
        const frameBuffer = await readFileSync(framePath);
        await uploadImageToS3(frameBuffer, frameName);
        return await getPresignedUrl(frameName);
    } catch (error) {
        console.error("Error while uploading image to S3:", error);
        throw error;
    }
}