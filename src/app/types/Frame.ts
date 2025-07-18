export type Frame = {
    url: string;
    id?: string;
    timestamp?: number;
    filename?: string;
    score?: number; // Quality score from 0 to 1 from OpenAI comparison
    reasoning?: string; // AI explanation for the score
}

export type FramesResponse = {
    frames: Frame[];
}