'use client'

import { useState } from 'react'

export default function NewsletterCTA() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  return (
    <div className="rounded-xl overflow-hidden shadow-lg" style={{ background: 'linear-gradient(135deg, #1a73e8 0%, #0d47a1 100%)' }}>
      <div className="px-6 py-10 sm:px-12 sm:py-14 text-center">
        {submitted ? (
          <div>
            <div className="text-4xl mb-4">✉️</div>
            <h3 className="text-2xl font-serif font-bold text-white mb-2">Thanks! We&apos;ll be in touch.</h3>
            <p className="text-blue-100 text-sm">Keep an eye on your inbox for Medicare data updates.</p>
          </div>
        ) : (
          <>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-3">
              Get Medicare Data Updates
            </h3>
            <p className="text-blue-100 mb-8 max-w-lg mx-auto">
              New investigations, fraud alerts, and spending analysis — delivered to your inbox.
            </p>
            <div className="max-w-md mx-auto flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button
                onClick={() => { if (email.includes('@')) setSubmitted(true) }}
                className="px-6 py-3 bg-white text-[#1a73e8] font-semibold rounded-lg hover:bg-blue-50 transition-colors"
              >
                Subscribe
              </button>
            </div>
            <p className="text-xs text-blue-200 mt-3">No spam. Unsubscribe anytime.</p>
          </>
        )}
      </div>
    </div>
  )
}
