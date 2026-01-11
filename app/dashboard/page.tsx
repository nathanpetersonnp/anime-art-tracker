import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import SkillChart from '@/components/SkillChart'
import ProgressChart from '@/components/ProgressChart'
import ReferenceGrid from '@/components/ReferenceGrid'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect('/login')
  }

  const artworks = await prisma.artwork.findMany({
    where: { userId: session.user.id },
    include: { assessment: true },
    orderBy: { createdAt: 'asc' }
  })

  const assessedArtworks = artworks.filter(a => a.assessment)
  const latestAssessment = assessedArtworks[assessedArtworks.length - 1]?.assessment

  const averageScores = assessedArtworks.length > 0 ? {
    lineQuality: Math.round(assessedArtworks.reduce((sum, a) => sum + (a.assessment?.lineQuality || 0), 0) / assessedArtworks.length * 10) / 10,
    proportions: Math.round(assessedArtworks.reduce((sum, a) => sum + (a.assessment?.proportions || 0), 0) / assessedArtworks.length * 10) / 10,
    shading: Math.round(assessedArtworks.reduce((sum, a) => sum + (a.assessment?.shading || 0), 0) / assessedArtworks.length * 10) / 10,
    composition: Math.round(assessedArtworks.reduce((sum, a) => sum + (a.assessment?.composition || 0), 0) / assessedArtworks.length * 10) / 10,
    styleConsistency: Math.round(assessedArtworks.reduce((sum, a) => sum + (a.assessment?.styleConsistency || 0), 0) / assessedArtworks.length * 10) / 10
  } : null

  const progressData = assessedArtworks.map(artwork => ({
    date: artwork.createdAt.toISOString().split('T')[0],
    title: artwork.title,
    lineQuality: artwork.assessment?.lineQuality || 0,
    proportions: artwork.assessment?.proportions || 0,
    shading: artwork.assessment?.shading || 0,
    composition: artwork.assessment?.composition || 0,
    styleConsistency: artwork.assessment?.styleConsistency || 0,
    average: Math.round(
      ((artwork.assessment?.lineQuality || 0) +
        (artwork.assessment?.proportions || 0) +
        (artwork.assessment?.shading || 0) +
        (artwork.assessment?.composition || 0) +
        (artwork.assessment?.styleConsistency || 0)) / 5 * 10
    ) / 10
  }))

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {session.user?.name || 'Artist'}!
        </h1>
        <p className="mt-2 text-gray-600">
          Track your anime art progress and see how your skills are improving.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-4xl font-bold text-indigo-600">{artworks.length}</div>
          <div className="text-gray-600">Total Artworks</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-4xl font-bold text-green-600">{assessedArtworks.length}</div>
          <div className="text-gray-600">Evaluated</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className={`text-4xl font-bold ${
            latestAssessment?.overallLevel === 'advanced' ? 'text-green-600' :
            latestAssessment?.overallLevel === 'intermediate' ? 'text-yellow-600' :
            'text-blue-600'
          }`}>
            {latestAssessment?.overallLevel
              ? latestAssessment.overallLevel.charAt(0).toUpperCase() + latestAssessment.overallLevel.slice(1)
              : 'N/A'}
          </div>
          <div className="text-gray-600">Current Level</div>
        </div>
      </div>

      {assessedArtworks.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">No Progress Data Yet</h3>
          <p className="mt-2 text-gray-500 max-w-md mx-auto">
            Upload your artwork and get AI evaluations to start tracking your progress.
          </p>
          <Link
            href="/upload"
            className="mt-4 inline-block px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Upload Artwork
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Average Skill Scores</h2>
            {averageScores && <SkillChart scores={averageScores} />}
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Progress Over Time</h2>
            <ProgressChart data={progressData} />
          </div>
        </div>
      )}

      {assessedArtworks.length > 0 && latestAssessment && (
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Latest Suggestions</h2>
          <p className="text-gray-600 whitespace-pre-wrap">{latestAssessment.suggestions}</p>
        </div>
      )}

      <div className="mt-8">
        <ReferenceGrid />
      </div>
    </div>
  )
}
