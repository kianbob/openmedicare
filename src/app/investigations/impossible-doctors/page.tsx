'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CalendarDaysIcon, ClockIcon } from '@heroicons/react/24/outline'
import Breadcrumbs from '@/components/Breadcrumbs'
import ShareButtons from '@/components/ShareButtons'
import SourceCitation from '@/components/SourceCitation'
import { formatNumber } from '@/lib/format'

const WORKING_DAYS = 250
const HOURS_PER_DAY = 8

function Calculator() {
  const [totalServices, setTotalServices] = useState(1032955)
  const [years, setYears] = useState(10)

  const servicesPerYear = totalServices / years
  const servicesPerDay = servicesPerYear / WORKING_DAYS
  const servicesPerHour = servicesPerDay / HOURS_PER_DAY
  const minutesPerPatient = 60 / servicesPerHour

  return (
    <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6 my-8">
      <h3 className="text-lg font-semibold text-indigo-900 mb-4">🧮 Impossibility Calculator</h3>
      <p className="text-sm text-indigo-800 mb-4">
        Enter a provider&apos;s total services and time period to see if the numbers add up.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-indigo-900 mb-1">Total Services</label>
          <input
            type="number"
            value={totalServices}
            onChange={(e) => setTotalServices(Number(e.target.value) || 0)}
            className="w-full px-3 py-2 border border-indigo-300 rounded-md text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-indigo-900 mb-1">Over How Many Years</label>
          <input
            type="number"
            value={years}
            onChange={(e) => setYears(Number(e.target.value) || 1)}
            className="w-full px-3 py-2 border border-indigo-300 rounded-md text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-indigo-700">{formatNumber(Math.round(servicesPerYear))}</div>
          <div className="text-xs text-gray-600">Services/Year</div>
        </div>
        <div className="bg-white rounded-lg p-3 text-center">
          <div className={`text-2xl font-bold ${servicesPerDay > 100 ? 'text-red-700' : 'text-indigo-700'}`}>
            {Math.round(servicesPerDay)}
          </div>
          <div className="text-xs text-gray-600">Services/Day</div>
        </div>
        <div className="bg-white rounded-lg p-3 text-center">
          <div className={`text-2xl font-bold ${servicesPerHour > 20 ? 'text-red-700' : 'text-indigo-700'}`}>
            {servicesPerHour.toFixed(1)}
          </div>
          <div className="text-xs text-gray-600">Per Hour (8h day)</div>
        </div>
        <div className="bg-white rounded-lg p-3 text-center">
          <div className={`text-2xl font-bold ${minutesPerPatient < 5 ? 'text-red-700' : 'text-indigo-700'}`}>
            {minutesPerPatient.toFixed(1)}
          </div>
          <div className="text-xs text-gray-600">Minutes/Service</div>
        </div>
      </div>
      {servicesPerDay > 100 && (
        <p className="text-sm text-red-800 mt-4 font-medium">
          ⚠️ At {Math.round(servicesPerDay)} services per working day, this provider would need to complete
          a service every {minutesPerPatient.toFixed(1)} minutes for 8 hours straight — with no breaks, no
          charting, no phone calls.
        </p>
      )}
    </div>
  )
}

export default function ImpossibleDoctorsPage() {
  const publishedDate = '2026-02-18'
  const readTime = '12 min read'

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs
          items={[
            { name: 'Investigations', href: '/investigations' },
            { name: 'The Impossible Doctors' },
          ]}
          className="mb-8"
        />

        <article className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-8 lg:p-12">
            {/* Header */}
            <div className="mb-8">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 mb-4">
                Investigation
              </span>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 font-serif mb-4">
                The Impossible Doctors
              </h1>
              <p className="text-2xl text-gray-600 font-light">
                When the Math Doesn&apos;t Add Up
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-8 pb-8 border-b border-gray-200">
              <div className="flex items-center">
                <CalendarDaysIcon className="h-4 w-4 mr-1" />
                {new Date(publishedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
              <div className="flex items-center">
                <ClockIcon className="h-4 w-4 mr-1" />
                {readTime}
              </div>
              <span>By OpenMedicare Investigative Team</span>
            </div>

            {/* Content */}
            <div className="prose prose-lg max-w-none">
              <p className="text-xl text-gray-700 leading-relaxed mb-8">
                Some Medicare providers bill for more than <strong>400 services per working day</strong>. That&apos;s
                a new patient every 1.2 minutes, for 8 hours straight, with no breaks. Either these are the
                fastest doctors in America, or something else is going on.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">The Math</h2>
              <p>
                Let&apos;s start with simple arithmetic. There are roughly <strong>250 working days</strong> in a year
                (52 weeks × 5 days, minus holidays). An 8-hour clinical day gives you <strong>480 minutes</strong>.
              </p>
              <p>
                For a provider billing 400 services per working day:
              </p>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 my-6 font-mono text-sm">
                <div className="space-y-2">
                  <div>400 services ÷ 8 hours = <strong>50 services per hour</strong></div>
                  <div>60 minutes ÷ 50 services = <strong>1.2 minutes per service</strong></div>
                  <div className="pt-2 border-t border-gray-300 text-red-800">
                    That&apos;s 72 seconds per patient — including greeting, examination, documentation, and billing.
                  </div>
                </div>
              </div>

              <p>
                Even the most efficient clinical operation — say, a flu shot clinic — would struggle to process
                patients at this rate. For complex medical services, it&apos;s physically impossible.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">100+ Unique Beneficiaries Per Day</h2>
              <p>
                Service volume alone isn&apos;t the only red flag. Some of these providers also billed for
                over <strong>100 unique Medicare beneficiaries per working day</strong>. That means they weren&apos;t
                just billing multiple services per patient — they were allegedly seeing a new person every
                few minutes, all day long.
              </p>
              <p>
                Consider what a real patient encounter involves: checking in, reviewing history, performing
                an examination, discussing treatment, documenting findings, and processing billing. Even
                for a routine visit, 10-15 minutes is the bare minimum. At 100+ unique patients per day,
                you&apos;re looking at 4-5 minutes per person — assuming zero downtime.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Walking Through a Day</h2>
              <p>
                Let&apos;s imagine the day of a provider billing 400 services:
              </p>

              <div className="bg-red-50 border border-red-200 rounded-lg p-6 my-6">
                <div className="space-y-3 text-sm text-red-900">
                  <div className="flex justify-between"><span>8:00 AM</span><span>Start seeing patients</span></div>
                  <div className="flex justify-between"><span>8:01:12</span><span>Patient #1 done</span></div>
                  <div className="flex justify-between"><span>8:02:24</span><span>Patient #2 done</span></div>
                  <div className="flex justify-between"><span>8:03:36</span><span>Patient #3 done</span></div>
                  <div className="text-gray-500 italic">... continue every 72 seconds ...</div>
                  <div className="flex justify-between"><span>12:00 PM</span><span>Patient #200 done (no lunch break)</span></div>
                  <div className="text-gray-500 italic">... continue every 72 seconds ...</div>
                  <div className="flex justify-between"><span>4:00 PM</span><span>Patient #400 done</span></div>
                  <div className="pt-2 border-t border-red-300 font-medium">
                    No breaks. No charting. No phone calls. No bathroom. For 8 hours straight.
                  </div>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Try It Yourself</h2>
              <p>
                Enter any provider&apos;s total services and time period to see if their numbers are physically possible:
              </p>
            </div>

            <Calculator />

            <div className="prose prose-lg max-w-none">
              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">&quot;But What About...&quot;</h2>
              <p>
                There are legitimate explanations for some high-volume billing:
              </p>
              <ul className="list-disc pl-6 space-y-3">
                <li>
                  <strong>Group practices billing under one NPI</strong> — Multiple practitioners sometimes bill
                  under a single provider number. This inflates the apparent volume for one person.
                </li>
                <li>
                  <strong>Lab-like operations</strong> — Some individual NPIs function more like laboratories,
                  processing high volumes of simple tests.
                </li>
                <li>
                  <strong>Supply distribution</strong> — Providers shipping supplies (like COVID test kits) can
                  generate high service counts without individual patient encounters.
                </li>
              </ul>
              <p>
                These explanations are valid for some providers. But when an individual practitioner — listed as
                a solo nurse practitioner or a single physician — bills for 400+ services per day, the burden
                of explanation shifts. Something needs to account for those numbers.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">What the Data Reveals</h2>
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 my-6">
                <h3 className="text-lg font-semibold text-red-900 mb-3">Impossible Numbers: The Full Picture</h3>
                <ul className="space-y-2 text-red-800">
                  <li>• <strong>{formatNumber(1139881)} providers</strong> analyzed across our fraud detection system</li>
                  <li>• <strong>{formatNumber(4636)} providers</strong> flagged with impossible billing volumes</li>
                  <li>• <strong>#1: Madhavi Rayapudi</strong> — {formatNumber(9862)} services per working day</li>
                </ul>
                <div className="mt-3">
                  <Link href="/fraud/impossible-numbers" className="text-red-700 hover:underline text-sm font-medium">
                    See the full impossible numbers list →
                  </Link>
                </div>
              </div>
              <p>
                Our analysis of {formatNumber(1139881)} Medicare providers identified <strong>{formatNumber(4636)}</strong> individual
                providers (not organizations) whose billing volumes defy physical constraints. The most extreme
                case: <strong>Madhavi Rayapudi</strong>, who averaged {formatNumber(9862)} services per working day.
                These providers share common characteristics:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>200+ services per working day averaged over multiple years</li>
                <li>Billing under individual (not organizational) NPIs</li>
                <li>High risk scores across multiple fraud detection dimensions</li>
                <li>Often concentrated in a few geographic areas</li>
                <li>Frequently billing codes associated with known fraud schemes (K1034, Q4xxx)</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">The Question We Should Be Asking</h2>
              <p>
                The question isn&apos;t whether these providers are committing fraud — that&apos;s for investigators
                and courts to determine. The question is: <strong>why does the system allow it?</strong>
              </p>
              <p>
                Medicare processes billions of claims per year. A simple automated check — flagging any individual
                provider billing more than, say, 100 services per working day — would catch the most extreme
                anomalies in real time. The fact that providers can bill at impossible rates for years without
                automated intervention suggests a system that isn&apos;t designed for prevention.
              </p>
              <p>
                CMS has the data. The math is simple. The flags are obvious. The question is whether
                anyone is looking.
              </p>
            </div>

            {/* Disclaimer */}
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-8 mb-6">
              <p className="text-sm text-yellow-800">
                <strong>Disclaimer:</strong> High service volumes can have legitimate explanations (group billing
                under one NPI, lab-like operations, supply distribution). These are statistical flags based on
                publicly available CMS data, not accusations of fraud. Named providers have not been charged
                with any crime unless otherwise stated.
              </p>
            </div>

            {/* Related */}
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Related Investigations</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <Link href="/fraud/impossible-numbers" className="text-medicare-primary hover:underline text-sm">🧮 Impossible Numbers — Full Provider List</Link>
                <Link href="/investigations/covid-test-scheme" className="text-medicare-primary hover:underline text-sm">📰 The COVID Test Gold Rush</Link>
                <Link href="/fraud/watchlist" className="text-medicare-primary hover:underline text-sm">🚨 Enhanced Watchlist</Link>
                <Link href="/fraud" className="text-medicare-primary hover:underline text-sm">🏠 Fraud Analysis Hub</Link>
              </div>
            </div>

            <ShareButtons
              url="https://openmedicare.vercel.app/investigations/impossible-doctors"
              title="The Impossible Doctors"
            />

            <div className="mt-6">
              <SourceCitation
                sources={[
                  'Centers for Medicare & Medicaid Services (CMS) — Medicare Provider Utilization and Payment Data (2014-2023)',
                ]}
                lastUpdated="February 2026"
              />
            </div>
          </div>
        </article>
      </div>
    </div>
  )
}
