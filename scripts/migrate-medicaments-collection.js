const { initializeApp, applicationDefault } = require("firebase-admin/app");
const { getFirestore, Timestamp, FieldValue } = require("firebase-admin/firestore");

/**
 * The goal of a script is to rename collection /users/{userId}/medicaments to /users/{userId}/medications.
 *
 * Usage:
 * export GOOGLE_APPLICATION_CREDENTIALS="$HOME/Documents/Lime-Tracker/lime-tracker-com-firebase-adminsdk-yl1p9-61eb6f401c.json"
 * export FIRESTORE_EMULATOR_HOST="localhost:8080" # Run on emulator instead of production URL above
 * node scripts/migrate-medicaments-collection.js
 */

initializeApp({
  credential: applicationDefault(),
});

const main = async () => {
  const db = getFirestore();
  const batch = db.batch();

  const usersSnapshot = await db.collection("users").get();
  const users = [];
  usersSnapshot.forEach((user) => {
    users.push(user.id);
  });

  for (user of users) {
    const userId = await user;
    console.log(`User: ${userId}`);

    const oldMedsSnapshot = await db.collection(`/users/${userId}/medicaments`).get();
    const medsData = [];
    oldMedsSnapshot.forEach((oldMed) => {
      medsData.push({ id: oldMed.id, data: oldMed.data() });
    });

    for (const med of medsData) {
      const medId = await med.id;
      const medData = await med.data;
      console.log(`  Moving medicament: ${medId} - ${medData.name} to medications`);
      batch.set(db.collection(`/users/${userId}/medications`).doc(), { ...medData });
      batch.delete(db.collection(`/users/${userId}/medicaments`).doc(medId));
    }

    await batch.commit();
  }
};

main().then(() => {
  console.log("Exiting");
  process.exit();
});
