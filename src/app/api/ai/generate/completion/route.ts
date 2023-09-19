import { NextResponse } from 'next/server'
import { z } from 'zod'
import { StreamingTextResponse, OpenAIStream } from 'ai'

import { prisma } from '@/lib/prisma'
import { openai } from '@/lib/openai'

const completionBodySchema = z.object({
  videoId: z.string().uuid(),
  prompt: z.string(),
  temperature: z.number().min(0).max(1).default(0.5),
})

export async function POST(request: Request) {
  const { videoId, prompt, temperature } = completionBodySchema.parse(
    await request.json(),
  )

  const video = await prisma.video.findUniqueOrThrow({
    where: { id: videoId },
  })

  if (!video.transcription)
    return NextResponse.json(
      {
        message: 'Video transcription was not generated yet.',
      },
      { status: 400 },
    )

  const promptMessage = prompt.replace('{transcription}', video.transcription)

  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo-16k',
    temperature,
    messages: [{ role: 'user', content: promptMessage }],
    stream: true,
  })

  const stream = OpenAIStream(response)

  return new StreamingTextResponse(stream)
}
