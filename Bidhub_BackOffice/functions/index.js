const functions = require("firebase-functions");
const admin = require("firebase-admin");
const serviceAccount = require("./bidhub-56b3f-35c24cbf2f19.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const auth = admin.auth();
const db = admin.firestore();
const storage = admin.storage();
const messaging = admin.messaging();

// exports.sendNotification = functions.https.onRequest(async (req, res) => {
//   cors(req, res, async () => {
//     console.log("Request body:", req.body); // Log request body

//     // Message de notification
//     const deviceToken = req.body.deviceToken;
//     const message = {
//       notification: {
//         title: req.body.title,
//         body: req.body.body,
//       },
//       token: deviceToken,
//     };

//     // Envoyer la notification
//     try {
//       const response = await admin.messaging().send(message);
//       console.log("Notification sent successfully:", response); // Log success
//       res.status(200).send("Notification sent successfully!");
//     } catch (error) {
//       console.error("Error sending notification:", error);
//       res.status(500).send("Error sending notification");
//     }
//   });
// });
// TODO : voir dans l'app mobile dans handleMessage de firebase_api la redirection vers la page de l'article concerné par la notification
// TODO : voir pourquoi sendEachForMulticast ne fonctionne pas et surtout pourquoi TokenList est vide après le for.
exports.sendNewEnchereNotificationProprietaire = functions.firestore
  .document("/Encheres/{enchereId}")
  .onCreate(async (snapshot, context) => {
    const enchere = snapshot.data();
    const article = await db
      .collection("Articles")
      .doc(enchere.id_article)
      .get();
    const user = await db
      .collection("Utilisateurs")
      .doc(article.data().id_user)
      .get();
    const message = {
      notification: {
        title: "Tu as reçu une nouvelle enchère",
        body: `Nouvelle enchère de ${enchere.montant}€ sur ton article : ${
          article.data().title
        }`,
      },
      token: user.data().fcmToken,
    };

    // Envoyer la notification
    try {
      const response = await admin.messaging().send(message);
      console.log("Notification sent successfully:", response); // Log success
      return "Notification sent successfully!";
    } catch (error) {
      console.error("Error sending notification:", error);
      return "Error sending notification";
    }
  });

exports.sendNewEnchereNotificationAcquereur = functions.firestore
  .document("/Encheres/{enchereId}")
  .onCreate(async (snapshot, context) => {
    const enchere = snapshot.data();

    const article = await db
      .collection("Articles")
      .doc(enchere.id_article)
      .get();

    const enchereSnapshot = await db
      .collection("Encheres")
      .where("id_article", "==", enchere.id_article)
      .get();

    if (!enchereSnapshot.empty) {
      console.log("enchereSnapshot", enchereSnapshot.docs);
    }
    let TokenList = [];
    enchereSnapshot.docs.forEach(async (doc) => {
      const enchereData = doc.data();
      const user = await db
        .collection("Utilisateurs")
        .doc(enchereData.id_user)
        .get();

      TokenList.push(user.data().fcmToken);
    });
    const message = {
      notification: {
        title: "Nouvelle enchère sur un article que tu voulais !!",
        body: `Nouvelle enchère de ${enchere.montant}€ sur l'article : ${
          article.data().title
        } viens vite surenchérir !`,
      },
      token: TokenList,
    };

    // Envoyer la notification
    try {
      const response = await admin.messaging().sendEachForMulticast(message);
      console.log("Notification sent successfully:", response); // Log success
      return "Notification sent successfully!";
    } catch (error) {
      console.error("Error sending notification:", error);
      return "Error sending notification";
    }
  });
