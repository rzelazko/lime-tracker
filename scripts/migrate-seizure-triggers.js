const { initializeApp, applicationDefault } = require("firebase-admin/app");
const { getFirestore, Timestamp, FieldValue } = require("firebase-admin/firestore");

/**
 * The goal of a script is to change seizure trigger: string into seizure triggers: string[]
 *
 * Usage:
 * export GOOGLE_APPLICATION_CREDENTIALS="$HOME/Documents/Lime-Tracker/lime-tracker-com-firebase-adminsdk-yl1p9-61eb6f401c.json"
 * export FIRESTORE_EMULATOR_HOST="localhost:8080" # Run on emulator instead of production URL above
 * node scripts/migrate-seizure-triggers.js
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

    const seizuresSnapshot = await db.collection(`/users/${userId}/seizures`).get();
    const seizuresData = [];
    seizuresSnapshot.forEach((seizure) => {
      seizuresData.push({ id: seizure.id, data: seizure.data() });
    });

    for (const seizure of seizuresData) {
      const seizureId = await seizure.id;
      const seizureData = await seizure.data;
      if (seizureData.trigger && !Array.isArray(seizureData.trigger)) {
        console.log(`  Adjusting seizure: ${seizureId} trigger: ${seizureData.trigger}`);
        const migratedData = { ...seizureData, triggers: [seizureData.trigger] };
        delete migratedData.trigger;
        batch.set(db.collection(`/users/${userId}/seizures`).doc(seizureId), migratedData);
      } else {
        console.log(`  Ignoring seizure: ${seizureId} trigger`);
      }
    }

    await batch.commit();
  }
};

main().then(() => {
  console.log("Exiting");
  process.exit();
});
