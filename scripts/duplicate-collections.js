const { initializeApp, applicationDefault } = require("firebase-admin/app");
const { getFirestore, Timestamp, FieldValue } = require("firebase-admin/firestore");

/**
 * The goal of a script is to duplicate all collections from one use to another
 *
 * Usage:
 * export GOOGLE_APPLICATION_CREDENTIALS="$HOME/Documents/Lime-Tracker/lime-tracker-com-firebase-adminsdk-yl1p9-61eb6f401c.json"
 * export FIRESTORE_EMULATOR_HOST="localhost:8080" # Run on emulator instead of production URL above
 * node scripts/duplicate-collections.js
 */

initializeApp({
  credential: applicationDefault(),
});

const main = async () => {
  const db = getFirestore();
  const batch = db.batch();

  const userIdSrc = "NmHL2bHEJKXyPUMMS0F726Kjgk3c";
  const userIdDst = "Xb5DPhZxT5LiQslGZKO1SvHP6MlO";

  const collectionNames = ["events", "medications", "seizures"];
  for (const collectionName of collectionNames) {
    console.log(`Copying ${collectionName}`)
    const srcSnapshot = await db.collection(`/users/${userIdSrc}/${collectionName}`).get();
    const srcData = [];
    srcSnapshot.forEach((srcSnap) => {
      srcData.push({ id: srcSnap.id, data: srcSnap.data() });
    });

    for (const srcDoc of srcData) {
      const destId = await srcDoc.id;
      const destData = await srcDoc.data;
      console.log(`  Copying ${collectionName}: ${destId}`);
      batch.set(db.collection(`/users/${userIdDst}/${collectionName}`).doc(), { ...destData });
    }
  }
  console.log('Commit changes')
  await batch.commit();
};

main().then(() => {
  console.log("Done");
  process.exit();
});
