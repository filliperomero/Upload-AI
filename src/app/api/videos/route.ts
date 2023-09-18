import { NextResponse } from 'next/server'
import path from 'node:path'
import { randomUUID } from 'node:crypto'
import { writeFile } from 'node:fs/promises'

import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  const formData = await request.formData()

  const file = formData.get('file') as Blob | null

  if (!file) {
    return NextResponse.json(
      {
        message: 'Missing file input',
      },
      { status: 400 },
    )
  }

  const extension = path.extname(file.name)

  if (extension !== '.mp3')
    return NextResponse.json(
      {
        message: 'Invalid input type, please upload a MP3',
      },
      { status: 400 },
    )

  const fileBaseName = path.basename(file.name, extension)
  const fileUploadName = `${fileBaseName}-${randomUUID()}${extension}`
  const uploadDestination = path.resolve(
    __dirname,
    '../../../../../tmp',
    fileUploadName,
  )

  const buffer = Buffer.from(await file.arrayBuffer())

  await writeFile(uploadDestination, buffer)

  const video = await prisma.video.create({
    data: {
      name: file.name,
      path: uploadDestination,
    },
  })

  return NextResponse.json({ video })
}

export const config = { runtime: 'experimental-edge' }
