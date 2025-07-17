import { spawn } from 'child_process'
import { randomUUID } from "crypto";
import { tmpdir } from 'os';

const tmpDir = tmpdir();
const TAKE_AT_SECONDS = '4'
const FILE_EXTENSION = '.png'

export async function extractFrame(videoUrl: string): Promise<string> {
    try {
        const frameId = randomUUID();
        const fileName = frameId + FILE_EXTENSION;

        const ffmpeg = spawn('ffmpeg', [
            '-i', tmpDir + '/' + videoUrl,
            '-ss', TAKE_AT_SECONDS,
            '-vframes', '1',
            tmpDir + '/' + fileName
        ])

        ffmpeg.stderr.on('data', (data) => {
            console.log(data.toString());
        });

        ffmpeg.on('exit', () => {
            console.log(`Image generated successfully`);
        });

        return tmpDir + '/' + fileName;
    } catch (err) {
        console.error(err);
        throw err;
    }
}
