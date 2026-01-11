import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
})

interface EvaluationResult {
  overallLevel: 'beginner' | 'intermediate' | 'advanced'
  lineQuality: number
  proportions: number
  shading: number
  composition: number
  styleConsistency: number
  feedback: string
  suggestions: string
}

export async function evaluateArtwork(imageBase64: string, mediaType: string): Promise<EvaluationResult> {
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 2000,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image',
            source: {
              type: 'base64',
              media_type: mediaType as 'image/jpeg' | 'image/png' | 'image/webp' | 'image/gif',
              data: imageBase64
            }
          },
          {
            type: 'text',
            text: `You are an expert anime art teacher and critic. Analyze this anime-style artwork and provide a detailed skill assessment.

Evaluate the following aspects on a scale of 1-10:
1. Line Quality - Cleanliness, confidence, and consistency of lines
2. Proportions - Accuracy of anime-style proportions and anatomy
3. Shading - Use of light, shadow, and value to create depth
4. Composition - Overall arrangement and visual balance
5. Style Consistency - How well the piece maintains a cohesive anime style

Based on the scores, determine the overall skill level:
- Beginner (average score 1-4): Learning fundamentals
- Intermediate (average score 5-7): Solid foundation, refining skills
- Advanced (average score 8-10): Strong technical ability

Provide your response in the following JSON format ONLY (no additional text):
{
  "overallLevel": "beginner" | "intermediate" | "advanced",
  "lineQuality": <number 1-10>,
  "proportions": <number 1-10>,
  "shading": <number 1-10>,
  "composition": <number 1-10>,
  "styleConsistency": <number 1-10>,
  "feedback": "<2-3 paragraphs of constructive feedback about what the artist does well and areas of strength>",
  "suggestions": "<2-3 specific, actionable suggestions for improvement with examples of what to practice>"
}`
          }
        ]
      }
    ]
  })

  const textContent = response.content.find(block => block.type === 'text')
  if (!textContent || textContent.type !== 'text') {
    throw new Error('No text response from Claude')
  }

  const jsonMatch = textContent.text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) {
    throw new Error('Could not parse JSON from response')
  }

  const result = JSON.parse(jsonMatch[0]) as EvaluationResult
  return result
}
