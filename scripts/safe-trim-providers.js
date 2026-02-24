#!/usr/bin/env node
/**
 * Safe provider file trimmer.
 * ALWAYS preserves fraud-flagged and watchlist providers.
 * Only trims from the non-critical pool.
 * 
 * Usage: node scripts/safe-trim-providers.js [target_count]
 * Default target: 30000
 */

const fs = require('fs');
const path = require('path');

const TARGET = parseInt(process.argv[2]) || 30000;
const DATA_DIR = path.join(__dirname, '..', 'public', 'data');
const PROVIDERS_DIR = path.join(DATA_DIR, 'providers');

// Load protected NPI lists
function getProtectedNPIs() {
  const protected = new Set();
  
  // ML v2 flagged providers
  try {
    const ml = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'ml-v2-results.json'), 'utf-8'));
    (ml.still_out_there || []).forEach(p => protected.add(p.npi.toString()));
    console.log(`  ML v2 flagged: ${ml.still_out_there?.length || 0}`);
  } catch(e) { console.warn('  Warning: Could not load ml-v2-results.json'); }

  // Watchlist providers
  try {
    const wl = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'watchlist.json'), 'utf-8'));
    const providers = wl.providers || wl;
    providers.forEach(p => { if (p.npi) protected.add(p.npi.toString()); });
    console.log(`  Watchlist: ${providers.length}`);
  } catch(e) { console.warn('  Warning: Could not load watchlist.json'); }

  // Deep-dive providers (referenced in articles)
  try {
    const dd = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'deep-dives.json'), 'utf-8'));
    (dd.providers || dd || []).forEach(p => { if (p.npi) protected.add(p.npi.toString()); });
  } catch(e) { /* optional */ }

  console.log(`  Total protected NPIs: ${protected.size}`);
  return protected;
}

// Main
console.log('Loading protected NPI lists...');
const protectedNPIs = getProtectedNPIs();

const allFiles = fs.readdirSync(PROVIDERS_DIR).filter(f => f.endsWith('.json'));
console.log(`\nCurrent provider files: ${allFiles.length}`);
console.log(`Target: ${TARGET}`);

if (allFiles.length <= TARGET) {
  console.log('Already at or below target. Nothing to do.');
  process.exit(0);
}

// Separate into protected and trimmable
const protectedFiles = [];
const trimmableFiles = [];

for (const file of allFiles) {
  const npi = file.replace('.json', '');
  if (protectedNPIs.has(npi)) {
    protectedFiles.push(file);
  } else {
    trimmableFiles.push(file);
  }
}

console.log(`\nProtected (fraud/watchlist): ${protectedFiles.length} — WILL NOT DELETE`);
console.log(`Trimmable: ${trimmableFiles.length}`);

const toRemove = allFiles.length - TARGET;
if (toRemove > trimmableFiles.length) {
  console.error(`\n❌ ERROR: Need to remove ${toRemove} but only ${trimmableFiles.length} are trimmable.`);
  console.error(`Cannot reach target ${TARGET} without deleting protected fraud providers.`);
  console.error('Aborting. Increase target or accept current count.');
  process.exit(1);
}

// Sort trimmable by total_payments (ascending) — remove smallest first
const trimmableWithPayments = trimmableFiles.map(file => {
  try {
    const raw = JSON.parse(fs.readFileSync(path.join(PROVIDERS_DIR, file), 'utf-8'));
    const payments = raw.overall?.total_payments || raw.total_payments || 0;
    return { file, payments };
  } catch(e) {
    return { file, payments: 0 };
  }
});

trimmableWithPayments.sort((a, b) => a.payments - b.payments);
const toDelete = trimmableWithPayments.slice(0, toRemove).map(t => t.file);

console.log(`\nWill delete: ${toDelete.length} lowest-payment non-fraud providers`);
console.log(`Will keep: ${allFiles.length - toDelete.length} (${protectedFiles.length} protected + ${trimmableFiles.length - toDelete.length} top-payment)`);

// Safety confirmation
if (process.argv.includes('--dry-run')) {
  console.log('\n--dry-run flag set. No files deleted.');
  process.exit(0);
}

if (!process.argv.includes('--confirm')) {
  console.log('\nAdd --confirm to actually delete. Add --dry-run to preview only.');
  process.exit(0);
}

let deleted = 0;
for (const file of toDelete) {
  fs.unlinkSync(path.join(PROVIDERS_DIR, file));
  deleted++;
}

console.log(`\n✅ Deleted ${deleted} files. Remaining: ${allFiles.length - deleted}`);
console.log('Remember to rebuild all-providers.json after trimming!');
