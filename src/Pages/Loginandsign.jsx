import { createClient } from '@supabase/supabase-js'
import { useState } from 'react'

const rawSupabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

let resolvedSupabaseUrl = ''

if (rawSupabaseUrl) {
  try {
    const url = new URL(rawSupabaseUrl)
    if (url.protocol === 'http:' || url.protocol === 'https:') {
      resolvedSupabaseUrl = url.toString()
    }
  } catch {
    resolvedSupabaseUrl = ''
  }
}

const supabase = resolvedSupabaseUrl && supabaseAnonKey
  ? createClient(resolvedSupabaseUrl, supabaseAnonKey)
  : null

const Loginandsign = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!supabase) {
      setMessage({
        type: 'error',
        text: 'Supabase is not configured yet. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your environment.'
      })
      return
    }

    setIsSubmitting(true)
    setMessage({ type: '', text: '' })

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    setIsSubmitting(false)

    if (error) {
      setMessage({ type: 'error', text: error.message })
      return
    }

    if (data?.user && !data.session) {
      setMessage({
        type: 'success',
        text: 'Sign-up successful! Check your email for the confirmation link.'
      })
    } else {
      setMessage({
        type: 'success',
        text: 'Account created successfully.'
      })
    }

    setEmail('')
    setPassword('')
  }

  if (!supabase) {
    return (
      <div className="p-6 text-center text-gray-700">
        Supabase is not configured yet. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your environment.
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <h1 className="text-2xl font-bold mb-4">Sign Up</h1>

        <div>
          <label htmlFor="email" className="block mb-2 font-semibold">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label htmlFor="password" className="block mb-2 font-semibold">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            minLength={6}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-800 disabled:opacity-60"
        >
          {isSubmitting ? 'Signing up...' : 'Sign Up'}
        </button>
      </form>

      {message.text && (
        <p
          className={`mt-4 text-sm ${
            message.type === 'error' ? 'text-red-600' : 'text-green-600'
          }`}
        >
          {message.text}
        </p>
      )}
    </div>
  )
}

export default Loginandsign