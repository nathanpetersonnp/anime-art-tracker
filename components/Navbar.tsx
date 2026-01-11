'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'

export default function Navbar() {
  const { data: session, status } = useSession()

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-indigo-600">
              Anime Art Tracker
            </Link>
            {session && (
              <div className="hidden sm:ml-8 sm:flex sm:space-x-4">
                <Link
                  href="/dashboard"
                  className="px-3 py-2 text-gray-600 hover:text-gray-900"
                >
                  Dashboard
                </Link>
                <Link
                  href="/upload"
                  className="px-3 py-2 text-gray-600 hover:text-gray-900"
                >
                  Upload
                </Link>
                <Link
                  href="/gallery"
                  className="px-3 py-2 text-gray-600 hover:text-gray-900"
                >
                  Gallery
                </Link>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-4">
            {status === 'loading' ? (
              <span className="text-gray-500">Loading...</span>
            ) : session ? (
              <>
                <span className="text-gray-600">{session.user?.name || session.user?.email}</span>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
