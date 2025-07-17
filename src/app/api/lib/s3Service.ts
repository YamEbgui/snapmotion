import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Initialize S3 client (credentials set automatically)
const s3Client = new S3Client({
    region: process.env.AWS_REGION,

});

const bucketName = process.env.AWS_BUCKET_NAME;

// function to upload image to S3
export async function uploadImageToS3(fileBuffer: Buffer, fileName: string) {
    try {
        const command = new PutObjectCommand({
            Bucket: bucketName,
            Key: fileName,
            Body: fileBuffer,
            ContentType: "image/png",
        });

        await s3Client.send(command);
        return fileName;
    } catch (error) {
        console.error("Error while uploading file to S3:", error);
        throw error;
    }
}

// function to get presigned URL for fileName
export async function getPresignedUrl(fileName: string) {
    try {
        const command = new GetObjectCommand({
            Bucket: bucketName,
            Key: fileName,
        });

        const url = await getSignedUrl(s3Client, command, {
            expiresIn: 60 * 60 * 24, // 1 days
        });
        return url;
    } catch (error) {
        console.error("Error while getting presigned URL:", error);
        throw error;
    }
}