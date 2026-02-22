export default function InvestigationDisclaimer() {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 my-6 text-sm text-amber-900">
      <p className="font-semibold mb-1">⚠️ Important Context</p>
      <p>
        All data on this page comes from publicly available CMS Medicare payment records. 
        Unusual billing patterns may reflect legitimate medical practices (such as high-volume drug 
        administration where each unit is counted as a separate service), data reporting differences, 
        or group practice billing. Inclusion on this page <strong>does not constitute an accusation 
        of fraud or wrongdoing</strong>. Only law enforcement and regulatory agencies can determine 
        whether billing patterns represent fraud. Providers flagged by our statistical model have 
        billing patterns similar to previously convicted providers, but many may have perfectly 
        legitimate explanations.
      </p>
    </div>
  )
}
