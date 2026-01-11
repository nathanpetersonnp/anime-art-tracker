import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

export default async function GalleryPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect('/login')
  }

  const artworks = await prisma.artwork.findMany({
    where: { userId: session.user.id },
    include: { assessment: true },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Gallery</h1>
        <Link
          href="/upload"
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
        >
          Upload New
        </Link>
      </div>

      {artworks.length === 0 ? (
        <div className="text-center py-20">
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
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">No artwork yet</h3>
          <p className="mt-2 text-gray-500">Get started by uploading your first artwork.</p>
          <Link
            href="/upload"
            className="mt-4 inline-block px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Upload Artwork
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {artworks.map((artwork) => (
            <Link
              key={artwork.id}
              href={`/artwork/${artwork.id}`}
              className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="relative aspect-square">
                <Image
                  src={artwork.imagePath}
                  alt={artwork.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-200"
                />
              </div>
              <div className="p-4">
                <h3 className="font-medium text-gray-900 truncate">{artwork.title}</h3>
                <p className="text-sm text-gray-500">
                  {new Date(artwork.createdAt).toLocaleDateString()}
                </p>
                {artwork.assessment && (
                  <span className={`mt-2 inline-block px-2 py-1 text-xs rounded-full ${
                    artwork.assessment.overallLevel === 'advanced'
                      ? 'bg-green-100 text-green-800'
                      : artwork.assessment.overallLevel === 'intermediate'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {artwork.assessment.overallLevel}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
