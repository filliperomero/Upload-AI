import { FFmpeg } from '@ffmpeg/ffmpeg'
import { toBlobURL } from '@ffmpeg/util'

// const coreURL = new URL(
//   '/ffmpeg-dist/ffmpeg-core.js',
//   process.env.NEXT_PUBLIC_VERCEL_URL,
// ).href
// const wasmURL = new URL(
//   '/ffmpeg-dist/ffmpeg-core.wasm',
//   process.env.NEXT_PUBLIC_VERCEL_URL,
// ).href
// const workerURL = new URL(
//   '/ffmpeg-dist/ffmpeg-worker.js',
//   process.env.NEXT_PUBLIC_VERCEL_URL,
// ).href

const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.2/dist/umd'

let ffmpeg: FFmpeg | null

export async function getFFmpeg() {
  if (ffmpeg) return ffmpeg

  ffmpeg = new FFmpeg()

  if (!ffmpeg.loaded) {
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(
        `${baseURL}/ffmpeg-core.wasm`,
        'application/wasm',
      ),
    })
  }

  return ffmpeg
}
