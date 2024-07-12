const functions = require("firebase-functions");
const admin = require("firebase-admin");
const serviceAccount = require("./bidhub-56b3f-35c24cbf2f19.json");
const cors = require("cors")({origin: true}); // Import and configure CORS

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const auth = admin.auth();
const db = admin.firestore();
const storage = admin.storage();
const messaging = admin.messaging();

exports.sendTestNotification = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    console.log("Request body:", req.body); // Log request body

    // Message de notification
    const deviceToken =
      "fIr7r_4nSYKNcL2C02HxRT:APA91bH5z5Evaz_7RV6PJFVb1urjMBiAwlm07TPVy3luOYSwymiocXH5c-TcQJrTERfsuUqmXwbhvQ5hGw9PEdbfxgX-xRD-GL3PF9lFSjA_UZmAlYJkDnte_iAxymowxDgyh9mmuSRf";
    const message = {
      notification: {
        title: "Nouveau message",
        body: "Vous avez un nouveau message dans votre application.",
      },
      token: deviceToken,
    };

    // Envoyer la notification
    try {
      const response = await admin.messaging().send(message);
      console.log("Notification sent successfully:", response); // Log success
      res.status(200).send("Notification sent successfully!");
    } catch (error) {
      console.error("Error sending notification:", error);
      res.status(500).send("Error sending notification");
    }
  });
});

// export const sendNewEnchereNotification = onValueCreated(
//import {onValueCreated} from "firebase-functions/v2/database";
//   db.ref("/encheres/{enchereId}").onCreate(async (snapshot, context) => {
//     const enchere = snapshot.val();
//     const article = await db
//       .collection("articles")
//       .doc(enchere.idArticle)
//       .get();
//     const user = await auth.getUser(article.data().id_user);
//     const message = {
//       notification: {
//         title: "Nouvelle enchère",
//         body: `Nouvelle enchère sur ${article.data().title}`,
//         image: article.data().img_list[0],
//       },
//       token: user.tokens,
//     };
//     await messaging.send(message);
//   })
// );

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
