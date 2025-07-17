import { tmpdir } from "os";
import { getPresignedUrl, uploadImageToS3 } from "../lib/s3Service";


export async function uploadImageAndReturnPresignedUrl(fileBuffer: Buffer, fileName: string) {
    try {
        console.log("Uploading image to S3");
        console.log("File name: " + fileName);
        await uploadImageToS3(fileBuffer, fileName);
        return await getPresignedUrl(fileName);
    } catch (error) {
        console.error("Error while uploading image to S3:", error);
        throw error;
    }
}