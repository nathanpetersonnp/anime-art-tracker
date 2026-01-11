import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { evaluateArtwork } from '@/lib/claude'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: 'AI evaluation is not configured. Please add your Anthropic API key.' },
        { status: 503 }
      )
    }

    const { artworkId } = await request.json()

    if (!artworkId) {
      return NextResponse.json({ error: 'Artwork ID is required' }, { status: 400 })
    }

    const artwork = await prisma.artwork.findUnique({
      where: { id: artworkId },
      include: { assessment: true }
    })

    if (!artwork) {
      return NextResponse.json({ error: 'Artwork not found' }, { status: 404 })
    }

    if (artwork.userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (artwork.assessment) {
      return NextResponse.json({ error: 'This artwork has already been evaluated' }, { status: 400 })
    }

    // Fetch image from URL (Vercel Blob or any URL)
    const imageResponse = await fetch(artwork.imagePath)
    if (!imageResponse.ok) {
      return NextResponse.json({ error: 'Failed to fetch artwork image' }, { status: 500 })
    }

    const imageBuffer = await imageResponse.arrayBuffer()
    const imageBase64 = Buffer.from(imageBuffer).toString('base64')

    // Determine media type from URL or content-type header
    const contentType = imageResponse.headers.get('content-type') || 'image/jpeg'
    const mediaType = contentType.startsWith('image/') ? contentType : 'image/jpeg'

    const evaluation = await evaluateArtwork(imageBase64, mediaType)

    const assessment = await prisma.assessment.create({
      data: {
        artworkId: artwork.id,
        overallLevel: evaluation.overallLevel,
        lineQuality: evaluation.lineQuality,
        proportions: evaluation.proportions,
        shading: evaluation.shading,
        composition: evaluation.composition,
        styleConsistency: evaluation.styleConsistency,
        feedback: evaluation.feedback,
        suggestions: evaluation.suggestions
      }
    })

    return NextResponse.json({ assessment })
  } catch (error) {
    console.error('Evaluation error:', error)
    return NextResponse.json(
      { error: 'Failed to evaluate artwork' },
      { status: 500 }
    )
  }
}
