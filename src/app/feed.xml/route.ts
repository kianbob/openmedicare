import { NextResponse } from 'next/server'

const investigations = [
  {
    title: 'The Medicare Markup Machine',
    description: 'How doctors charge $100 billion more than Medicare actually pays them — and why the system incentivizes overbilling',
    slug: 'markup-machine',
    publishedAt: '2024-02-15T00:00:00.000Z',
    excerpt: 'Our analysis of 10 years of Medicare data reveals a systematic pattern of inflated charges across healthcare specialties. While Medicare caps actual payments, providers continue submitting charges 2-3 times higher than reimbursement rates.'
  },
  {
    title: 'Medicare\'s Biggest Billers',
    description: 'The 100 providers who received the most Medicare payments in 2023',
    slug: 'biggest-billers',
    publishedAt: '2024-02-10T00:00:00.000Z',
    excerpt: 'A deep dive into Medicare\'s top-earning providers reveals patterns in specialty care, geographic concentration, and billing practices that raise questions about healthcare resource allocation.'
  },
  {
    title: 'The Drug Money Pipeline',
    description: 'How Medicare Part B became a $40 billion drug spending program',
    slug: 'drug-pipeline',
    publishedAt: '2024-02-05T00:00:00.000Z',
    excerpt: 'Medicare Part B drug spending has exploded over the past decade, with oncology and rheumatology driving unprecedented growth in physician-administered drug costs.'
  },
  {
    title: 'COVID\'s Impact on Medicare',
    description: 'How the pandemic shifted $50 billion in Medicare spending patterns',
    slug: 'covid-impact',
    publishedAt: '2024-01-28T00:00:00.000Z',
    excerpt: 'The COVID-19 pandemic dramatically altered Medicare spending, with telehealth surging and elective procedures plummeting. Our analysis reveals the lasting impacts on healthcare delivery.'
  },
  {
    title: 'Rural Healthcare\'s Price Tag',
    description: 'Why Medicare pays more for the same services in rural America',
    slug: 'rural-price-tag',
    publishedAt: '2024-01-20T00:00:00.000Z',
    excerpt: 'Rural healthcare providers receive higher Medicare reimbursements, but patients still face access challenges. We examine the geography of Medicare payments and healthcare equity.'
  }
]

export async function GET() {
  const baseUrl = 'https://www.openmedicare.org'
  
  const rssXml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>OpenMedicare Investigations</title>
    <description>Data-driven investigative reporting on Medicare spending patterns, healthcare fraud, and transparency</description>
    <link>${baseUrl}</link>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml" />
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <ttl>60</ttl>
    <image>
      <url>${baseUrl}/logo.png</url>
      <title>OpenMedicare</title>
      <link>${baseUrl}</link>
    </image>
    ${investigations.map(post => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <description><![CDATA[${post.description}]]></description>
      <link>${baseUrl}/investigations/${post.slug}</link>
      <guid isPermaLink="true">${baseUrl}/investigations/${post.slug}</guid>
      <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>
      <category>Investigation</category>
      <content:encoded><![CDATA[
        <p>${post.excerpt}</p>
        <p><a href="${baseUrl}/investigations/${post.slug}">Read the full investigation →</a></p>
      ]]></content:encoded>
    </item>
    `).join('')}
  </channel>
</rss>`

  return new NextResponse(rssXml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600'
    }
  })
}