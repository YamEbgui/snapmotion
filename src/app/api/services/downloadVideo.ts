import { tmpdir } from 'os';
import { join as pathJoin }   from 'path';
import { createWriteStream } from 'fs';
import { pipeline } from 'stream/promises';
import { request as httpsRequest } from 'https';
import { request as httpRequest } from 'http';
import { URL } from 'url';

const tmpDir = tmpdir();

export async function downloadVideo(url: string, destPath: string): Promise<void> {
    const parsedUrl = new URL(url);
    const protocol = parsedUrl.protocol === 'https:' ? httpsRequest : httpRequest;

    const desiredPath = pathJoin(tmpDir, destPath);
    
    await new Promise<void>((resolve, reject) => {
        const req = protocol(parsedUrl, (res) => {
            if (res.statusCode !== 200) {
                reject(new Error(`Failed to download video. Status: ${res.statusCode}`));
                return;
            }

            const writeStream = createWriteStream(desiredPath);
            pipeline(res, writeStream)
                .then(resolve)
                .catch(reject);
        });

        req.on('error', reject);
        req.end();
    });
}
