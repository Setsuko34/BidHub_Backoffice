import {onValueCreated} from "firebase-functions/v2/database";

const functions = require("firebase-functions");
const admin = require("firebase-admin");
const serviceAccount = require("./bidhub-56b3f-35c24cbf2f19.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const auth = admin.getAuth();
const db = admin.firestore();
const storage = admin.storage();
const messaging = admin.messaging();

export async function sendPushNotification(deviceToken, message) {
  try {
    const message = {
      notification: {
        title: message.title,
        body: message.body,
      },
      token: deviceToken,
    };
    await admin.messaging.send(message);
    console.log("Notification sent successfully:", message);
  } catch (error) {
    console.error("Error sending notification:", error);
  }
}

export const sendNewEnchereNotification = onValueCreated(
  db.ref("/encheres/{enchereId}").onCreate(async (snapshot, context) => {
    const enchere = snapshot.val();
    const article = await db
      .collection("articles")
      .doc(enchere.idArticle)
      .get();
    const user = await auth.getUser(article.data().id_user);
    const message = {
      notification: {
        title: "Nouvelle enchère",
        body: `Nouvelle enchère sur ${article.data().title}`,
        image: article.data().img_list[0],
      },
      token: user.tokens,
    };
    await messaging.send(message);
  })
);

// exports.listUsers = functions.https.onCall(async () => {
//   try {
//     const users = await listAllUsers();
//     return {users};
//   } catch (error) {
//     console.error("Error listing users:", error);
//     throw new functions.https.HttpsError("internal", "Unable to list users");
//   }
// });

// /**
//  * Lists all users from Firebase Auth.
//  *
//  * @param {string} nextPageToken - The token for the next page of users.
//  * @returns {Promise<Array>} A promise that resolves with an array of users.
//  */
// async function listAllUsers(nextPageToken) {
//   const listUsersResult = await admin.auth().listUsers(1000, nextPageToken);
//   const users = listUsersResult.users.map((user) => ({
//     uid: user.uid,
//     email: user.email,
//     displayName: user.displayName,
//     photoURL: user.photoURL,
//   }));
//   // ...
// }
