import { randomUUID } from "crypto";
import { execa } from 'execa';
import { tmpdir } from 'os';
import { join as pathJoin } from 'path';
import { logger } from "../lib/logger";

const tmpDir = tmpdir();
const TAKE_AT_SECONDS = '4'
const FILE_EXTENSION = '.png'

// This function is used to extract a frame from a video using ffmpeg
export async function extractFrame(videoUrl: string): Promise<string> {
const startTime = Date.now();

    try {
        const frameId = randomUUID();
        const fileName = frameId + FILE_EXTENSION;
        const videoPath = pathJoin(tmpDir, videoUrl);
        const outputPath = pathJoin(tmpDir, fileName);

        logger.info("Starting frame extraction with ffmpeg", {
            videoUrl,
            videoPath,
            outputPath,
            extractAtSeconds: TAKE_AT_SECONDS
        });

        // Extract frame from video using ffmpeg (installed on the server)
        await execa('ffmpeg', [
            '-i', videoPath,
            '-ss', TAKE_AT_SECONDS,
            '-vframes', '1',
            outputPath
        ]);

        const extractionTime = Date.now() - startTime;
        logger.info("Frame extraction completed successfully", {
            fileName,
            extractionTimeMs: extractionTime
        });

        return fileName;
    } catch (err) {
        const extractionTime = Date.now() - startTime;
        logger.error("Frame extraction failed", {
            videoUrl,
            error: err,
            extractionTimeMs: extractionTime
        });
        throw err;
    }
}