import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { logger } from "./logger";

// Initialize S3 client (credentials set automatically)
const s3Client = new S3Client({
    region: process.env.AWS_REGION,

});

const bucketName = process.env.AWS_BUCKET_NAME;

// This function is used to upload an image to S3
export async function uploadImageToS3(fileBuffer: Buffer, fileName: string) {
    const startTime = Date.now();

    try {
        logger.debug("Preparing S3 upload", {
            fileName,
            bucketName,
            fileSize: fileBuffer.length
        });

        const command = new PutObjectCommand({
            Bucket: bucketName,
            Key: fileName,
            Body: fileBuffer,
            ContentType: "image/png",
        });

        await s3Client.send(command);

        const uploadTime = Date.now() - startTime;
        logger.info("S3 upload completed", {
            fileName,
            bucketName,
            uploadTimeMs: uploadTime
        });

        return fileName;
    } catch (error) {
        const uploadTime = Date.now() - startTime;
        logger.error("S3 upload failed", {
            fileName,
            bucketName,
            error,
            uploadTimeMs: uploadTime
        });
        throw error;
    }
}

// function to get presigned URL for fileName
export async function getPresignedUrl(fileName: string) {
    const startTime = Date.now();

    try {
        logger.debug("Generating presigned URL", { fileName, bucketName });

        const command = new GetObjectCommand({
            Bucket: bucketName,
            Key: fileName,
        });

        const url = await getSignedUrl(s3Client, command, {
            expiresIn: 60 * 60 * 24, // 1 days
        });

        const generationTime = Date.now() - startTime;
        logger.info("Presigned URL generated successfully", {
            fileName,
            bucketName,
            generationTimeMs: generationTime,
            expiresInSeconds: 60 * 60 * 24
        });

        return url;
    } catch (error) {
        const generationTime = Date.now() - startTime;
        logger.error("Presigned URL generation failed", {
            fileName,
            bucketName,
            error,
            generationTimeMs: generationTime
        });
        throw error;
    }
}