const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

exports.listUsers = functions.https.onCall(async () => {
  try {
    const users = await listAllUsers();
    return {users};
  } catch (error) {
    console.error("Error listing users:", error);
    throw new functions.https.HttpsError("internal", "Unable to list users");
  }
});

/**
 * Lists all users from Firebase Auth.
 *
 * @param {string} nextPageToken - The token for the next page of users.
 * @returns {Promise<Array>} A promise that resolves with an array of users.
 */
async function listAllUsers(nextPageToken) {
  const listUsersResult = await admin.auth().listUsers(1000, nextPageToken);
  const users = listUsersResult.users.map((user) => ({
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
  }));
  // ...
}
