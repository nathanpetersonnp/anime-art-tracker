import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect, notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import EvaluateButton from '@/components/EvaluateButton'
import AssessmentDisplay from '@/components/AssessmentDisplay'

interface Props {
  params: Promise<{ id: string }>
}

export default async function ArtworkPage({ params }: Props) {
  const { id } = await params
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect('/login')
  }

  const artwork = await prisma.artwork.findUnique({
    where: { id },
    include: { assessment: true }
  })

  if (!artwork || artwork.userId !== session.user.id) {
    notFound()
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <Link
        href="/gallery"
        className="inline-flex items-center text-indigo-600 hover:text-indigo-700 mb-6"
      >
        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Gallery
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="relative aspect-square">
            <Image
              src={artwork.imagePath}
              alt={artwork.title}
              fill
              className="object-contain bg-gray-100"
              priority
            />
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{artwork.title}</h1>
            <p className="text-gray-500 mt-1">
              Uploaded on {new Date(artwork.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>

          {artwork.assessment ? (
            <AssessmentDisplay assessment={artwork.assessment} />
          ) : (
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">No Assessment Yet</h2>
              <p className="text-gray-600 mb-4">
                Get AI-powered feedback on your artwork to understand your skill level and areas for improvement.
              </p>
              <EvaluateButton artworkId={artwork.id} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
