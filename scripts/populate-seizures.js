const { initializeApp, applicationDefault } = require("firebase-admin/app");
const { getFirestore, Timestamp } = require("firebase-admin/firestore");
const fs = require('fs');
const path = require('path');

/*
 * Populates the 'seizures' collection in Firestore with random data for the last year.
 *
 * Usage:
 * export FIRESTORE_EMULATOR_HOST="localhost:8080" # Run on emulator instead of production
 * node scripts/populate-seizures.js "2025-07-01"
 */

initializeApp({
  credential: applicationDefault(),
  projectId: "lime-tracker-com"
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
  // Assign a random hour, minute, and second to the date
  const randomHour = getRandomInt(7, 22);
  const randomMinute = getRandomInt(0, 59);
  const randomSecond = getRandomInt(0, 59);
  const seizureDate = new Date(date);
  seizureDate.setHours(randomHour, randomMinute, randomSecond, 0);
  return {
    occurred: Timestamp.fromDate(seizureDate),
    duration: getRandomInt(1, 15), // minutes
    type: SEIZURE_TYPES[getRandomInt(0, SEIZURE_TYPES.length - 1)],
    triggers: getRandomTriggers(),
  };
}

async function populateSeizures() {
  const now = new Date();
  let startDate;
  if (process.argv[2]) {
    const parsedDate = new Date(process.argv[2]);
    if (!isNaN(parsedDate.getTime())) {
      startDate = parsedDate;
      console.log(`Populating seizures starting from: ${startDate.toISOString().split('T')[0]}`);
    } else {
      console.warn(`Invalid date argument provided: ${process.argv[2]}. Falling back to one year ago.`);
      startDate = new Date(now);
      startDate.setFullYear(now.getFullYear() - 1);
    }
  } else {
    startDate = new Date(now);
    startDate.setFullYear(now.getFullYear() - 1);
  }

  let batch = db.batch();
  let batchCount = 0;
  let total = 0;

  for (let d = new Date(startDate); d <= now; d.setDate(d.getDate() + 1)) {
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
