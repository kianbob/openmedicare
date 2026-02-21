import type { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import SourceCitation from '@/components/SourceCitation'
import ShareButtons from '@/components/ShareButtons'
import { formatCurrency, formatNumber } from '@/lib/format'
import ArticleJsonLd from '@/components/ArticleJsonLd'

export const metadata: Metadata = {
  title: 'The Billion-Dollar Eye Care Industry',
  description: 'Aflibercept alone costs Medicare $19.7 billion. Combined with cataracts and other procedures, eye care is one of the costliest corners of Medicare.',
}

const eyeCareProcedures = [
  { code: 'J0178', description: 'Aflibercept injection (1 mg)', payments: 19714688991, services: 26766935, isDrug: true },
  { code: '66984', description: 'Cataract removal with lens insertion', payments: 16342507783, services: 74167539, isDrug: false },
  { code: '92014', description: 'Eye exam, established patient (comprehensive)', payments: 9271944542, services: 111239226, isDrug: false },
  { code: 'J2778', description: 'Ranibizumab injection (0.1 mg)', payments: 7822070221, services: 28442671, isDrug: true },
  { code: '92012', description: 'Eye exam, established patient (intermediate)', payments: 3445048944, services: 55843100, isDrug: false },
  { code: '67028', description: 'Intravitreal injection (drug into eye)', payments: 2712187293, services: 31786102, isDrug: false },
  { code: '92134', description: 'Retinal imaging (OCT)', payments: 2073199087, services: 67977630, isDrug: false },
  { code: '92004', description: 'Eye exam, new patient (comprehensive)', payments: 1934411282, services: 20083591, isDrug: false },
  { code: '66821', description: 'YAG laser capsulotomy (secondary cataract)', payments: 1932491560, services: 10500692, isDrug: false },
  { code: '66982', description: 'Complex cataract removal with lens', payments: 1416360359, services: 2648637, isDrug: false },
  { code: '92083', description: 'Visual field testing', payments: 1213100133, services: 27421419, isDrug: false },
  { code: 'J2777', description: 'Faricimab injection (0.1 mg)', payments: 1083565833, services: 37377562, isDrug: true },
  { code: '92250', description: 'Retinal photography', payments: 1264141496, services: 31530629, isDrug: false },
  { code: '92133', description: 'Optic nerve imaging', payments: 678553421, services: 25448341, isDrug: false },
  { code: '92136', description: 'Corneal topography/biometry', payments: 645299686, services: 17333951, isDrug: false },
  { code: '92235', description: 'Fluorescein angiography', payments: 477379055, services: 5719659, isDrug: false },
  { code: '68761', description: 'Punctal plug insertion', payments: 363086298, services: 3375358, isDrug: false },
  { code: '67042', description: 'Vitrectomy (membrane removal)', payments: 355937720, services: 339069, isDrug: false },
  { code: '65855', description: 'Laser trabeculoplasty (glaucoma)', payments: 265225560, services: 1452190, isDrug: false },
  { code: 'J7312', description: 'Dexamethasone intravitreal implant', payments: 229081906, services: 1471417, isDrug: true },
]

export default function EyeCareBillionsPage() {
  const totalEyeCare = eyeCareProcedures.reduce((s, p) => s + p.payments, 0)
  const drugTotal = eyeCareProcedures.filter(p => p.isDrug).reduce((s, p) => s + p.payments, 0)
  const procedureTotal = eyeCareProcedures.filter(p => !p.isDrug).reduce((s, p) => s + p.payments, 0)
  const afliberceptPayments = 19714688991

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Breadcrumbs items={[
          { name: 'Investigations', href: '/investigations' },
          { name: 'The Billion-Dollar Eye Care Industry' },
        ]} />

        <article className="prose prose-lg max-w-none">
          <span className="inline-block bg-cyan-100 text-cyan-800 px-3 py-1 rounded-full text-sm font-medium mb-4">
            Investigation
          </span>
          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">
            The Billion-Dollar Eye Care Industry
          </h1>
          <p className="text-gray-500 text-sm mb-8">Published February 2026 · 15 min read</p>

          <div className="bg-cyan-50 border-l-4 border-cyan-500 p-6 rounded-r-lg mb-8 not-prose">
            <p className="text-cyan-900 font-medium text-lg">Key Finding</p>
            <p className="text-cyan-800 mt-2">
              Eye care is one of Medicare&apos;s costliest categories. Aflibercept (J0178) alone
              accounts for <strong>{formatCurrency(afliberceptPayments)}</strong> — the single
              most expensive drug in Medicare. Combined with cataracts, eye exams, and retinal
              procedures, the top 20 eye care codes total
              <strong> {formatCurrency(totalEyeCare)}</strong>.
            </p>
          </div>

          <p className="text-gray-700 mb-4">
            Ophthalmology is the second-largest Medicare specialty by total payments, with
            {formatCurrency(66253395294)} in cumulative spending across {formatNumber(172656)} providers.
            Only Internal Medicine, with nearly a million providers, receives more.
          </p>
          <p className="text-gray-700 mb-4">
            What makes eye care unique is its combination of extremely expensive drugs, high-volume
            surgical procedures, and a patient population that virtually guarantees demand: nearly
            every Medicare beneficiary will need eye care at some point, and conditions like
            cataracts, macular degeneration, and glaucoma are age-related inevitabilities.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            Aflibercept: The $19.7 Billion Drug
          </h2>
          <p className="text-gray-700 mb-4">
            The most expensive single item in all of Medicare isn&apos;t a surgery, a hospital stay,
            or a piece of equipment — it&apos;s an injection. <strong>Aflibercept</strong> (brand name
            Eylea), billed under code J0178, has cost Medicare {formatCurrency(afliberceptPayments)} over
            10 years across {formatNumber(26766935)} injections.
          </p>
          <p className="text-gray-700 mb-4">
            At an average of {formatCurrency(741)} per injection, aflibercept treats wet age-related
            macular degeneration (AMD) and diabetic macular edema — conditions that can cause
            blindness if untreated. Patients typically need injections every 4–8 weeks, often
            indefinitely, making it a recurring cost that compounds over time.
          </p>

          <div className="bg-cyan-50 rounded-lg p-6 not-prose mb-6">
            <h4 className="font-semibold text-cyan-900 mb-3">The Retinal Drug Trifecta</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg border">
                <p className="font-semibold text-gray-900">Aflibercept (Eylea)</p>
                <p className="text-2xl font-bold text-cyan-600">{formatCurrency(afliberceptPayments)}</p>
                <p className="text-sm text-gray-500">{formatNumber(26766935)} injections · {formatCurrency(741)}/each</p>
              </div>
              <div className="bg-white p-4 rounded-lg border">
                <p className="font-semibold text-gray-900">Ranibizumab (Lucentis)</p>
                <p className="text-2xl font-bold text-blue-600">{formatCurrency(7822070221)}</p>
                <p className="text-sm text-gray-500">{formatNumber(28442671)} injections · {formatCurrency(270)}/each</p>
              </div>
              <div className="bg-white p-4 rounded-lg border">
                <p className="font-semibold text-gray-900">Faricimab (Vabysmo)</p>
                <p className="text-2xl font-bold text-purple-600">{formatCurrency(1083565833)}</p>
                <p className="text-sm text-gray-500">{formatNumber(37377562)} injections · Launched 2022</p>
              </div>
            </div>
            <p className="text-sm text-cyan-700 mt-3">
              Combined retinal drug spending: <strong>{formatCurrency(afliberceptPayments + 7822070221 + 1083565833)}</strong>
            </p>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            Cataracts: The $16.3 Billion Surgery
          </h2>
          <p className="text-gray-700 mb-4">
            Cataract removal (code 66984) is the most commonly performed surgery in Medicare,
            with {formatNumber(74167539)} procedures over the analysis period — roughly 7.4 million
            per year. At {formatCurrency(16342507783)} in total payments, it&apos;s the sixth most
            expensive code in the entire Medicare system.
          </p>
          <p className="text-gray-700 mb-4">
            The average cataract surgery costs Medicare about {formatCurrency(350)} — remarkably
            affordable for a procedure that restores vision. But the sheer volume makes it one of
            Medicare&apos;s largest line items. When you add complex cataracts (66982,
            {formatCurrency(1416360359)}) and YAG laser capsulotomy for secondary cataracts (66821,
            {formatCurrency(1932491560)}), the total cataract-related spend exceeds
            <strong> {formatCurrency(16342507783 + 1416360359 + 1932491560)}</strong>.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            The Complete Eye Care Spending Picture
          </h2>
        </article>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mt-6 mb-8">
          <div className="px-6 py-4 bg-gray-50 border-b">
            <h3 className="text-lg font-semibold text-gray-900">Top 20 Eye Care Codes by Medicare Payments</h3>
            <p className="text-sm text-gray-500">2014–2023 cumulative</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Code</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Description</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Type</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Payments</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Services</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {eyeCareProcedures.map((p) => (
                  <tr key={p.code} className={`hover:bg-blue-50 ${p.isDrug ? 'bg-orange-50' : ''}`}>
                    <td className="px-4 py-3">
                      <Link href={`/procedures/${p.code}`} className="text-blue-600 hover:text-blue-800 font-mono font-medium">
                        {p.code}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-gray-600 text-sm">{p.description}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${p.isDrug ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>
                        {p.isDrug ? 'Drug' : 'Procedure'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-medium">{formatCurrency(p.payments)}</td>
                    <td className="px-4 py-3 text-right text-gray-600">{formatNumber(p.services)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50 border-t-2">
                <tr>
                  <td className="px-4 py-3 font-bold" colSpan={3}>Total (Top 20 Eye Care Codes)</td>
                  <td className="px-4 py-3 text-right font-bold">{formatCurrency(totalEyeCare)}</td>
                  <td className="px-4 py-3"></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        <article className="prose prose-lg max-w-none">
          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            Why Eye Care Costs Are Exploding
          </h2>
          <p className="text-gray-700 mb-4">
            Several factors converge to make eye care one of Medicare&apos;s fastest-growing
            cost centers:
          </p>

          <div className="not-prose space-y-3 mb-6">
            <div className="bg-white border rounded-lg p-4">
              <h4 className="font-semibold text-gray-900">1. Demographics Are Destiny</h4>
              <p className="text-sm text-gray-600">
                The baby boomer generation is now squarely in the age range for cataracts (65+)
                and macular degeneration (75+). As this cohort ages, demand for eye procedures
                will only increase.
              </p>
            </div>
            <div className="bg-white border rounded-lg p-4">
              <h4 className="font-semibold text-gray-900">2. Expensive Biologics Replaced Cheap Alternatives</h4>
              <p className="text-sm text-gray-600">
                Before aflibercept and ranibizumab, many ophthalmologists used off-label
                bevacizumab (Avastin) — equally effective but costing ~$50 per injection vs. $741
                for aflibercept. Market forces and FDA approvals shifted utilization toward
                the more expensive options.
              </p>
            </div>
            <div className="bg-white border rounded-lg p-4">
              <h4 className="font-semibold text-gray-900">3. Chronic Treatment Models</h4>
              <p className="text-sm text-gray-600">
                Retinal injections are not one-time treatments — patients need repeated injections
                for years or decades. A single AMD patient may receive 50+ injections at {formatCurrency(741)} each,
                costing Medicare over {formatCurrency(37000)} per patient.
              </p>
            </div>
            <div className="bg-white border rounded-lg p-4">
              <h4 className="font-semibold text-gray-900">4. New Technologies, New Costs</h4>
              <p className="text-sm text-gray-600">
                Faricimab (Vabysmo), launched in 2022, already generated {formatCurrency(1083565833)} in
                two years. Premium IOLs, minimally invasive glaucoma surgeries, and advanced
                retinal imaging add new cost layers to eye care.
              </p>
            </div>
          </div>

          <div className="bg-amber-50 rounded-lg p-6 not-prose mb-6">
            <h4 className="font-semibold text-amber-900 mb-3">Eye Care Spending Breakdown</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-3xl font-bold text-orange-600">{formatCurrency(drugTotal)}</p>
                <p className="text-sm text-orange-700">Retinal drugs</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-blue-600">{formatCurrency(procedureTotal)}</p>
                <p className="text-sm text-blue-700">Surgeries & diagnostics</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-800">{formatCurrency(66253395294)}</p>
                <p className="text-sm text-gray-600">Total ophthalmology specialty</p>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
            The Bevacizumab Question
          </h2>
          <p className="text-gray-700 mb-4">
            The most controversial aspect of retinal drug spending is the underuse of
            <strong> bevacizumab (Avastin)</strong>. Multiple large clinical trials — including
            the NIH-funded CATT trial — have shown bevacizumab to be clinically equivalent to
            ranibizumab for wet AMD treatment, at roughly 1/40th the cost.
          </p>
          <p className="text-gray-700 mb-4">
            If all aflibercept and ranibizumab injections had been replaced with bevacizumab,
            Medicare could have saved an estimated <strong>{formatCurrency(25000000000)}</strong> over
            the analysis period. The reasons this hasn&apos;t happened include: bevacizumab isn&apos;t
            FDA-approved for eye use (it&apos;s a cancer drug used off-label), it requires compounding
            pharmacy preparation, and ophthalmologists receive higher reimbursement for
            administering more expensive drugs under Medicare&apos;s &quot;buy and bill&quot; system.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Why This Matters</h2>
          <p className="text-gray-700 mb-4">
            Eye care spending illustrates a central tension in Medicare: between providing
            effective treatments and controlling costs. Aflibercept genuinely prevents blindness.
            Cataract surgery genuinely restores vision. These are among Medicare&apos;s most
            successful investments in quality of life.
          </p>
          <p className="text-gray-700 mb-4">
            But the scale — {formatCurrency(totalEyeCare)} for just the top 20 codes — demands
            scrutiny. When cheaper alternatives exist and market incentives push toward more
            expensive options, taxpayers bear the cost. With the aging population ensuring
            growing demand, the eye care spending trajectory will only steepen without
            policy intervention.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Related Investigations</h2>
          <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <Link href="/investigations/drug-pipeline" className="block bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
              <h4 className="font-semibold text-blue-600">The Drug Pipeline</h4>
              <p className="text-sm text-gray-500 mt-1">Medicare&apos;s most expensive drugs and where the money flows</p>
            </Link>
            <Link href="/investigations/medicare-biggest-spenders" className="block bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
              <h4 className="font-semibold text-blue-600">Medicare&apos;s Most Expensive Doctors</h4>
              <p className="text-sm text-gray-500 mt-1">Why ophthalmologists dominate the top earners list</p>
            </Link>
            <Link href="/investigations/where-medicare-dollar-goes" className="block bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
              <h4 className="font-semibold text-blue-600">Where Your Medicare Dollar Goes</h4>
              <p className="text-sm text-gray-500 mt-1">The full breakdown of $854.8B in spending</p>
            </Link>
            <Link href="/investigations/anesthesia-markup" className="block bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
              <h4 className="font-semibold text-blue-600">The Anesthesia Markup Scandal</h4>
              <p className="text-sm text-gray-500 mt-1">The specialty with the highest charge-to-payment ratio</p>
            </Link>
            <Link href="/drug-spending" className="block bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
              <h4 className="font-semibold text-blue-600">💊 Drug Spending Analysis</h4>
              <p className="text-sm text-gray-500 mt-1">Explore Medicare Part B drug spending trends and top drugs by cost</p>
            </Link>
          </div>
        </article>

        <ShareButtons
          url="https://www.openmedicare.org/investigations/eye-care-billions"
          title="The Billion-Dollar Eye Care Industry"
        />
        <SourceCitation />
      </div>
    </main>
  )
}
