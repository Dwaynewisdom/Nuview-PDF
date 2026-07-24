import React from 'react'
import { useAuth0 } from '@auth0/auth0-react'

export default function Loginandsign() {
  const { loginWithRedirect, logout, user, isAuthenticated, isLoading } = useAuth0()
  if (error) {
    return <div>Authentication Error: {error.message}</div>
  } 

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100 p-4 font-sans text-slate-900">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-2 bg-linear-to-r from-blue-500 to-indigo-600" />
        <div className="p-8 sm:p-10">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">
              {isAuthenticated ? 'Welcome back' : 'Secure login with Auth0'}
            </h1>
            <p className="text-slate-500">
              {isAuthenticated
                ? 'You are signed in. Manage your session below.'
                : 'Use Auth0 to sign in securely and access your PDF tools.'}
            </p>
          </div>

          {isLoading ? (
            <div className="rounded-3xl border border-slate-200 p-8 text-center text-slate-700">
              Checking authentication...
            </div>
          ) : isAuthenticated ? (
            <div className="space-y-6">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                <p className="text-sm text-slate-500">Signed in as</p>
                <p className="text-lg font-semibold text-slate-900">{user?.name ?? user?.email}</p>
                <p className="text-sm text-slate-600 mt-1">{user?.email}</p>
              </div>
              <button
                type="button"
                onClick={() => logout({ returnTo: window.location.origin })}
                className="w-full bg-red-600 hover:bg-red-500 text-white py-3 rounded-2xl font-semibold transition-transform transform hover:scale-[1.01]"
              >
                Log out
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              <button
                type="button"
                onClick={() => loginWithRedirect()}
                className="w-full bg-orange-700 hover:bg-orange-600 text-white py-3 rounded-2xl font-semibold transition-transform transform hover:scale-[1.01]"
              >
                Login with Auth0
              </button>
              <p className="text-sm text-slate-500 text-center">
                After login, you will be redirected back to the app automatically.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
