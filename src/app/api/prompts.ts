export const FAL_AI_PROMPT = `
Identify the primary object or figure in this image and render it in an alternate pose 
that appears natural and consistent with the original context. If the object contains facial
features, ensure they are preserved and remain undistorted in the new pose.
The pose must be noticeably different from the original — it may involve rotating the subject,
changing their orientation, shifting the camera angle, or expressing a new emotion such as a smile
- anything that presents the object in a more flattering or visually engaging scene.
 Maintain the background, lighting, and style of the original image.
`

export const OPENAI_PROMPT = ` You are a judge that decides how much a pose variation of an image retains the
 original identity of the subject and his outfit. You need to give a score between 0 and 1,
  where 0 is no identity retained at all and 1 is perfect identity preservation.
   You must be very strict as humans have very keen eye for facial details. 
   The first image is the original image and the second is the variation.
   You must respond in the following format exactly:
   SCORE: X.XX
   REASONING: [One clear sentence(max 150 chars) explaining the score, referencing specific facial or clothing details.]
`;