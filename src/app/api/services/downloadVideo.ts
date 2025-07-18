import { tmpdir } from 'os';
import { join as pathJoin } from 'path';
import { createWriteStream } from 'fs';
import { pipeline } from 'stream/promises';
import { request as httpsRequest } from 'https';
import { request as httpRequest } from 'http';
import { URL } from 'url';
import { logger } from "../lib/logger";

const tmpDir = tmpdir();

// This function is used to download a video from a url and save it to a temporary directory
export async function downloadVideo(url: string, destPath: string): Promise<void> {
    const startTime = Date.now();

    try {
        const parsedUrl = new URL(url);
        const protocol = parsedUrl.protocol === 'https:' ? httpsRequest : httpRequest;
        const desiredPath = pathJoin(tmpDir, destPath);

        logger.info("Starting video download", {
            url,
            destPath,
            desiredPath,
            protocol: parsedUrl.protocol
        });

        await new Promise<void>((resolve, reject) => {
            const req = protocol(parsedUrl, (res) => {
                if (res.statusCode !== 200) {
                    const error = new Error(`Failed to download video. Status: ${res.statusCode}`);
                    logger.error("Video download failed - HTTP error", {
                        url,
                        statusCode: res.statusCode,
                        statusMessage: res.statusMessage
                    });
                    reject(error);
                    return;
                }

                logger.debug("Video download response received", {
                    statusCode: res.statusCode,
                    contentLength: res.headers['content-length'],
                    contentType: res.headers['content-type']
                });

                const writeStream = createWriteStream(desiredPath);
                pipeline(res, writeStream)
                    .then(resolve)
                    .catch(reject);
            });

            req.on('error', (error) => {
                logger.error("Video download request failed", { url, error });
                reject(error);
            });

            req.end();
        });

        const downloadTime = Date.now() - startTime;
        logger.info("Video download completed successfully", {
            url,
            destPath,
            downloadTimeMs: downloadTime
        });

    } catch (error) {
        const downloadTime = Date.now() - startTime;
        logger.error("Video download failed", {
            url,
            destPath,
            error,
            downloadTimeMs: downloadTime
        });
        throw error;
    }
}
