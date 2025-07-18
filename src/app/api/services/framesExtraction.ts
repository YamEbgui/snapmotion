import { randomUUID } from "crypto";
import { execa } from 'execa';
import { tmpdir } from 'os';
import { join as pathJoin } from 'path';

const tmpDir = tmpdir();
const TAKE_AT_SECONDS = '4'
const FILE_EXTENSION = '.png'

export async function extractFrame(videoUrl: string): Promise<string> {
    try {
        const frameId = randomUUID();
        const fileName = frameId + FILE_EXTENSION;
        const videoPath = pathJoin(tmpDir, videoUrl);
        const outputPath = pathJoin(tmpDir, fileName);

        await execa('ffmpeg', [
            '-i', videoPath,
            '-ss', TAKE_AT_SECONDS,
            '-vframes', '1',
            outputPath
        ]);

        return fileName;
    } catch (err) {
        console.error(err);
        throw err;
    }
}