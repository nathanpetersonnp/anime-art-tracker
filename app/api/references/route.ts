import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getRecommendedSearchQueries } from '@/lib/search'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const latestArtwork = await prisma.artwork.findFirst({
      where: {
        userId: session.user.id,
        assessment: { isNot: null }
      },
      include: { assessment: true },
      orderBy: { createdAt: 'desc' }
    })

    if (!latestArtwork?.assessment) {
      return NextResponse.json({
        queries: [
          'beginner anime drawing tutorial',
          'anime character basics',
          'how to draw anime faces'
        ],
        message: 'Get your artwork evaluated to receive personalized suggestions!'
      })
    }

    const assessment = latestArtwork.assessment
    const queries = getRecommendedSearchQueries(assessment.overallLevel, {
      lineQuality: assessment.lineQuality,
      proportions: assessment.proportions,
      shading: assessment.shading,
      composition: assessment.composition,
      styleConsistency: assessment.styleConsistency
    })

    const resources = [
      {
        name: 'Pinterest',
        baseUrl: 'https://www.pinterest.com/search/pins/?q=',
        icon: 'pinterest'
      },
      {
        name: 'DeviantArt',
        baseUrl: 'https://www.deviantart.com/search?q=',
        icon: 'deviantart'
      },
      {
        name: 'YouTube',
        baseUrl: 'https://www.youtube.com/results?search_query=',
        icon: 'youtube'
      },
      {
        name: 'ArtStation',
        baseUrl: 'https://www.artstation.com/search?q=',
        icon: 'artstation'
      }
    ]

    const suggestions = queries.map(query => ({
      query,
      links: resources.map(resource => ({
        name: resource.name,
        url: resource.baseUrl + encodeURIComponent(query),
        icon: resource.icon
      }))
    }))

    return NextResponse.json({
      skillLevel: assessment.overallLevel,
      suggestions,
      weakestAreas: getWeakestAreas(assessment)
    })
  } catch (error) {
    console.error('References error:', error)
    return NextResponse.json(
      { error: 'Failed to get references' },
      { status: 500 }
    )
  }
}

function getWeakestAreas(assessment: {
  lineQuality: number
  proportions: number
  shading: number
  composition: number
  styleConsistency: number
}) {
  const skills = [
    { name: 'Line Quality', score: assessment.lineQuality },
    { name: 'Proportions', score: assessment.proportions },
    { name: 'Shading', score: assessment.shading },
    { name: 'Composition', score: assessment.composition },
    { name: 'Style Consistency', score: assessment.styleConsistency }
  ]

  return skills
    .sort((a, b) => a.score - b.score)
    .slice(0, 3)
    .map(s => s.name)
}
