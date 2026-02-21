'use client'

export default function NewsletterCTA() {
  return (
    <div className="rounded-xl overflow-hidden shadow-lg" style={{ background: 'linear-gradient(135deg, #1a73e8 0%, #0d47a1 100%)' }}>
      <div className="px-6 py-10 sm:px-12 sm:py-14 text-center">
        <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-3">
          Get Medicare Data Updates
        </h3>
        <p className="text-blue-100 mb-6 max-w-lg mx-auto">
          New investigations, fraud alerts, and spending analysis — coming to your inbox soon.
        </p>
        <p className="text-sm text-blue-200">
          Newsletter launching soon. Follow our{' '}
          <a
            href="https://github.com/kianbob/openmedicare"
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-white hover:text-blue-100"
          >
            GitHub
          </a>{' '}
          for updates in the meantime.
        </p>
      </div>
    </div>
  )
}
