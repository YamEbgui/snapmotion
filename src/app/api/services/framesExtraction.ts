import { randomUUID } from "crypto";
import { tmpdir } from "os";
import { join as pathJoin } from "path";
import ffmpeg from "fluent-ffmpeg";

const tmpDir = tmpdir();
const TAKE_AT_SECONDS = "3";
const FILE_EXTENSION = ".png";

export async function extractFrame(videoUrl: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const frameId = randomUUID();
        const fileName = frameId + FILE_EXTENSION;
        const videoPath = pathJoin(tmpDir, videoUrl);

        ffmpeg(videoPath)
            .screenshots({
                timestamps: [TAKE_AT_SECONDS],
                filename: fileName,
                folder: tmpDir,
                size: '640x?'
            })
            .on('end', () => {
                resolve(fileName);
            })
            .on('error', (err) => {
                console.log("error while using ffmpeg", err);
                reject(err);
            });
    });
}
