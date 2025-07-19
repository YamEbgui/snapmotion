export type Frame = {
    url: string;
    score?: number; // Quality score from 0 to 1 from OpenAI comparison
    reasoning?: string; // AI explanation for the score
}

export type FramesResponse = {
    frames: Frame[];
}