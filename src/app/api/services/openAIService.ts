import OpenAI from 'openai';
import { logger } from '../lib/logger';
import { randomUUID } from 'crypto';
import { OPENAI_PROMPT } from '../prompts';

// Initialize OpenAI client
let openai: OpenAI
try {
    openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY || ''
    });
} catch (error) {
    openai = {} as OpenAI; // Fallback for build
}


// Response interface for image comparison
export interface ImageComparisonResult {
    score: number; // 0 to 1 decimal score
    reasoning: string;
    operationId: string;
    processingTimeMs: number;
}

// Helper function to convert buffer to base64 data URL
const bufferToDataUrl = (buffer: Buffer, mimeType: string = 'image/png'): string => {
    const base64 = buffer.toString('base64');
    return `data:${mimeType};base64,${base64}`;
};

// Compare original image buffer with generated frame buffer and return score 0-1
export const compareImages = async (
    originalImageBuffer: Buffer,
    generatedFrameBuffer: Buffer,
    originalMimeType: string = 'image/png',
    generatedMimeType: string = 'image/png'
): Promise<ImageComparisonResult> => {
    const operationId = randomUUID();
    const startTime = Date.now();

    try {
        logger.info('Starting image comparison analysis', {
            operationId,
            originalImageSize: originalImageBuffer.length,
            generatedFrameSize: generatedFrameBuffer.length,
            originalMimeType,
            generatedMimeType
        });

        // Convert buffers to base64 data URLs for OpenAI API
        const originalDataUrl = bufferToDataUrl(originalImageBuffer, originalMimeType);
        const generatedDataUrl = bufferToDataUrl(generatedFrameBuffer, generatedMimeType);

        const completion = await openai.chat.completions.create({
            model: 'gpt-4.1',
            messages: [
                {
                    role: 'user',
                    content: [
                        { type: 'text', text: OPENAI_PROMPT },
                        {
                            type: 'image_url',
                            image_url: {
                                url: originalDataUrl,
                                detail: 'high'
                            }
                        },
                        {
                            type: 'image_url',
                            image_url: {
                                url: generatedDataUrl,
                                detail: 'high'
                            }
                        }
                    ] as any
                }
            ],
            temperature: 0.1, // Low temperature for consistent scoring
            max_tokens: 300,
        });

        const responseContent = completion.choices[0]?.message?.content || '';
        const processingTime = Date.now() - startTime;

        // Parse the response to extract score and reasoning
        const result = parseComparisonResponse(responseContent, operationId, processingTime);

        logger.info('Image comparison completed successfully', {
            operationId,
            score: result.score,
            processingTimeMs: processingTime,
            tokenUsage: completion.usage?.total_tokens || 0
        });

        return result;

    } catch (error) {
        const processingTime = Date.now() - startTime;
        logger.error('Image comparison failed', {
            operationId,
            error,
            processingTimeMs: processingTime
        });
        throw error;
    }
};

// Parse OpenAI response to extract score and reasoning
const parseComparisonResponse = (
    responseContent: string,
    operationId: string,
    processingTimeMs: number
): ImageComparisonResult => {
    try {
        // Extract score using regex
        const scoreMatch = responseContent.match(/SCORE:\s*([0-9]*\.?[0-9]+)/i);
        const reasoningMatch = responseContent.match(/REASONING:\s*(.+)/i);

        let score = 0.5; // Default fallback score
        let reasoning = 'Unable to parse AI response';

        if (scoreMatch && scoreMatch[1]) {
            const parsedScore = parseFloat(scoreMatch[1]);
            // Ensure score is between 0 and 1
            score = Math.max(0, Math.min(1, parsedScore));
        } else {
            logger.warn('Could not parse score from AI response', {
                operationId,
                responseContent
            });
        }

        if (reasoningMatch && reasoningMatch[1]) {
            reasoning = reasoningMatch[1].trim();
        } else {
            logger.warn('Could not parse reasoning from AI response', {
                operationId,
                responseContent
            });
            reasoning = responseContent.substring(0, 200); // Use first 200 chars as fallback
        }

        return {
            score,
            reasoning,
            operationId,
            processingTimeMs
        };

    } catch (error) {
        logger.error('Error parsing comparison response', {
            operationId,
            error,
            responseContent
        });

        return {
            score: 0.5,
            reasoning: 'Error parsing AI response',
            operationId,
            processingTimeMs
        };
    }
}; 