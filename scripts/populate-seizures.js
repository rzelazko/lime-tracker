const { initializeApp, applicationDefault } = require("firebase-admin/app");
const { getFirestore, Timestamp } = require("firebase-admin/firestore");
const fs = require('fs');
const path = require('path');

/*
 * Populates the 'seizures' collection in Firestore with random data for the last year.
 *
 * Usage:
 * export FIRESTORE_EMULATOR_HOST="localhost:8080" # Run on emulator instead of production
 * node scripts/populate-seizures.js
 */

if (!process.env.FIRESTORE_EMULATOR_HOST) {
  console.error('ERROR: FIRESTORE_EMULATOR_HOST is not set! Refusing to run against production DB.');
  process.exit(1);
}

// Set project ID from .firebaserc
try {
  const rcPath = path.join(__dirname, '..', '.firebaserc');
  const rc = JSON.parse(fs.readFileSync(rcPath, 'utf8'));
  const projectId = rc.projects && rc.projects.default;
  if (projectId) {
    process.env.GCLOUD_PROJECT = projectId;
    console.log(`Set GCLOUD_PROJECT from .firebaserc: ${projectId}`);
  } else {
    throw new Error('No default project found in .firebaserc');
  }
} catch (e) {
  console.error('ERROR: Could not determine project ID from .firebaserc!');
  process.exit(1);
}

initializeApp({
  credential: applicationDefault(),
});

const db = getFirestore();

const SEIZURE_TYPES = [
  'Simple focal seizure',
  'Complex focal seizure',
  'Absence seizure',
  'Clonic seizure',
  'Tonic seizure',
  'Tonic-clonic seizure',
  'Atonic seizure',
  'Aura only',
  'Secondary generalized seizure',
  'Other / unknown'
];

const SEIZURE_TRIGGERS = [
  'Lights',
  'Period',
  'Forgotten medication',
  'Stress',
  'Change of medication',
  'Sleepless night'
];

const USER_ID = "Xb5DPhZxT5LiQslGZKO1SvHP6MlO"; // janka@webperfekt.pl

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomTriggers() {
  // 0-2 random triggers
  const count = getRandomInt(0, 2);
  const shuffled = SEIZURE_TRIGGERS.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function getRandomSeizure(date) {
  return {
    occurred: Timestamp.fromDate(date),
    duration: getRandomInt(1, 15), // minutes
    type: SEIZURE_TYPES[getRandomInt(0, SEIZURE_TYPES.length - 1)],
    triggers: getRandomTriggers(),
  };
}

async function populateSeizures() {
  const now = new Date();
  const oneYearAgo = new Date(now);
  oneYearAgo.setFullYear(now.getFullYear() - 1);

  let batch = db.batch();
  let batchCount = 0;
  let total = 0;

  for (let d = new Date(oneYearAgo); d <= now; d.setDate(d.getDate() + 1)) {
    // 0-2 seizures per day
    const seizuresToday = getRandomInt(0, 2);
    for (let i = 0; i < seizuresToday; i++) {
      const seizure = getRandomSeizure(new Date(d));
      // Write to users/{USER_ID}/seizures
      const docRef = db.collection(`users/${USER_ID}/seizures`).doc();
      batch.set(docRef, seizure);
      batchCount++;
      total++;
      if (batchCount === 400) { // Firestore batch limit
        await batch.commit();
        batch = db.batch();
        batchCount = 0;
      }
    }
  }
  if (batchCount > 0) {
    await batch.commit();
  }
  console.log(`Inserted ${total} random seizures for the last year.`);
  process.exit(0);
}

populateSeizures().catch(err => {
  console.error(err);
  process.exit(1);
});
