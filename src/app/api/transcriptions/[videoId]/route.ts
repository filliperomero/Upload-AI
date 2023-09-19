import { NextResponse } from 'next/server'
import { createReadStream } from 'node:fs'

import { prisma } from '@/lib/prisma'
import { openai } from '@/lib/openai'

interface GetBatchParams {
  params: {
    videoId: string
  }
}

export async function POST(request: Request, { params }: GetBatchParams) {
  const videoId = params.videoId
  const { prompt } = await request.json()

  const video = await prisma.video.findUniqueOrThrow({
    where: { id: videoId },
  })

  const videoPath = video.path

  try {
    const audioReadStream = createReadStream(videoPath)

    const response = await openai.audio.transcriptions.create({
      file: audioReadStream,
      model: 'whisper-1',
      language: 'en',
      response_format: 'json',
      temperature: 0,
      prompt,
    })
    const transcription = response.text

    await prisma.video.update({
      where: { id: videoId },
      data: { transcription },
    })

    return NextResponse.json({ transcription })
  } catch (err) {
    console.log(err)
  }
}
