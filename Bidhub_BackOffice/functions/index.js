const functions = require("firebase-functions");
const {onRequest} = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
const serviceAccount = require("./bidhub-56b3f-35c24cbf2f19.json");
const cors = require("cors")({origin: true});

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const auth = admin.auth();
const db = admin.firestore();
const storage = admin.storage();
const messaging = admin.messaging();

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
        image: article.data().img_list[0],
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
    console.log("enchere", enchere);
    const article = await db
      .collection("Articles")
      .doc(enchere.id_article)
      .get();

    const enchereSnapshot = await db
      .collection("Encheres")
      .where("id_article", "==", enchere.id_article)
      .where("id_user", "!=", enchere.id_user)
      .get();

    let TokenList = [];
    const tokenPromises = enchereSnapshot.docs.map(async (doc) => {
      const enchereData = doc.data();
      const user = await db
        .collection("Utilisateurs")
        .doc(enchereData.id_user)
        .get();
      if (
        user.data().fcmToken != "" &&
        !TokenList.includes(user.data().fcmToken) &&
        user.data().fcmToken != undefined
      ) {
        TokenList.push(user.data().fcmToken);
      }
    });
    await Promise.all(tokenPromises).then(async () => {
      const message = {
        notification: {
          title: "Nouvelle enchère sur un article que tu voulais !!",
          body: `Nouvelle enchère de ${enchere.montant}€ sur l'article : ${
            article.data().title
          } VIENS VITE SURENCHÉRIR !`,
          image: article.data().img_list[0],
        },
        tokens: TokenList,
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
  });

exports.sendDeleteArticleNotif = functions.firestore
  .document("/Articles/{articleId}")
  .onDelete(async (snapshot, context) => {
    const article = snapshot.data();
    console.log("id_article", snapshot.id);

    const enchereSnapshot = await db
      .collection("Encheres")
      .where("id_article", "==", snapshot.id)
      .get();

    let TokenList = [];
    const tokenPromises = enchereSnapshot.docs.map(async (doc) => {
      const enchereData = doc.data();
      const enchereRef = db.collection("Encheres").doc(doc.id);
      await enchereRef.delete();
      const user = await db
        .collection("Utilisateurs")
        .doc(enchereData.id_user)
        .get();
      if (
        user.data().fcmToken != "" &&
        !TokenList.includes(user.data().fcmToken) &&
        user.data().fcmToken != undefined
      ) {
        TokenList.push(user.data().fcmToken);
      }
    });
    await Promise.all(tokenPromises).then(async () => {
      const message = {
        notification: {
          title: `${article.title} a été supprimé !`,
          body: `Toutes les enchères sur ${article.title} ont été annulée !`,
          image: article.img_list[0],
        },
        tokens: TokenList,
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
  });

//api user function related

exports.createUser = onRequest({cors: true}, async (req, res) => {
  const user = req.body;
  try {
    const userauth = await auth.createUser({
      email: user.email,
      emailVerified: false,
      password: user.password,
      displayName: user.username,
      disabled: false,
    });
    const userdb = await db.collection("Utilisateurs").doc(userauth.uid).set({
      username: user.username,
      email: user.email,
      photoURL: "",
      status: user.status,
      favoris: [],
      fcmToken: "",
    });

    res.status(200).send({message: "User created successfully."});
    console.log("Successfully created new user");
  } catch (error) {
    res.status(500).send({message: "Error creating new user. " + error});
    console.log("Error creating new user:", error);
  }
});

exports.updateUser = onRequest({cors: true}, async (req, res) => {
  const uid = req.body.uid;
  const user = req.body.user;
  try {
    const userdb = await db.collection("Utilisateurs").doc(uid).update(user);
    const userauth = await auth.updateUser(uid, {
      email: user.email,
      displayName: user.username,
    });
    res.status(200).send({message: "User updated successfully."});
    console.log("Successfully updated user");
  } catch (error) {
    res.status(500).send({message: "Error updating the user. " + error});
    console.log("Error updating user:", error);
  }
});

exports.deleteUser = onRequest({cors: true}, async (req, res) => {
  const uid = req.body.uid;
  try {
    try {
      const articles = await db
        .collection("Articles")
        .where("id_user", "==", uid)
        .get();

      if (!articles.empty) {
        await articles.forEach(async (doc) => {
          const article = doc.data();
          if (article.img_list != []) {
            await article.img_list.forEach(async (img) => {
              await deleteObject(ref(storage, img))
                .then(() => {
                  console.log("Article deleted successfully from storage");
                })
                .catch((error) => {
                  console.error("Error deleting Article:", error);
                });
            });
          }
          await Promise.all(
            articles.docs.map(async (doc) => {
              try {
                await doc.ref.delete();
                console.log("Enchere deleted successfully from database");
              } catch (error) {
                console.error("Error deleting Enchere from database:", error);
              }
            })
          );
        });
      }
    } catch (error) {
      console.error("Error deleting Article from database:", error);
    }
    try {
      const encheres = await db
        .collection("Encheres")
        .where("id_user", "==", uid)
        .get();

      if (!encheres.empty) {
        await Promise.all(
          encheres.docs.map(async (doc) => {
            try {
              await doc.ref.delete();
              console.log("Enchere deleted successfully from database");
            } catch (error) {
              console.error("Error deleting Enchere from database:", error);
            }
          })
        );
      }
    } catch (error) {
      console.error("Error deleting Enchere from database :", error);
    }
    try {
      const userdb = await db.collection("Utilisateurs").doc(uid).delete();
    } catch (error) {
      console.log("Error deleting user in database:", error);
    }
    await admin
      .auth()
      .deleteUser(uid)
      .then(() => {
        console.log("Successfully deleted user");
      })
      .catch((error) => {
        console.log("Error deleting user:", error);
      });
    res.status(200).send({message: "User deleted successfully."});
    console.log("Successfully updated user");
  } catch (error) {
    res.status(500).send({message: "Error deleting the user. " + error});
    console.log("Error deleting user:", error);
  }
});

//watcher sur la table Articles pour envoyer une notification à l'utilisateur qui a posté l'article et les enchérisseurs lorsque l'enchere arrive a son terme
exports.startWatchers = functions.pubsub
  .schedule("every 10 minutes")
  .onRun(async (context) => {
    const now = admin.firestore.Timestamp.now();
    const nowDate = now.toDate();
    const fifteenMinutesAgo = new Date(nowDate.getTime() - 10 * 60 * 1000); // 15 minutes ago

    const auctionsRef = db.collection("Articles");
    const query = auctionsRef
      .where(
        "date_heure_fin",
        ">",
        admin.firestore.Timestamp.fromDate(fifteenMinutesAgo)
      )
      .where("date_heure_fin", "<=", nowDate);

    try {
      const snapshot = await query.get();
      const promises = snapshot.docs.map(async (doc) => {
        const data = doc.data();
        if (data.date_heure_fin.toDate() <= nowDate) {
          console.log(`Auction ${doc.id} has expired.`);
          await handleExpiredAuction(doc);
        }
      });

      await Promise.all(promises);
    } catch (error) {
      console.error("Error checking auctions:", error);
    }

    return null;
  });

async function handleExpiredAuction(doc) {
  const data = doc.data();
  const articleId = doc.id;
  const userId = data.id_user; // Assuming 'id_user' is the ID of the user who created the article

  try {
    // Get the user document
    const userDoc = await db.collection("Utilisateurs").doc(userId).get();
    const userFCMToken = userDoc.data().fcmToken;

    // Send notification to the article creator
    if (userFCMToken) {
      await sendNotification(
        userFCMToken,
        `Fin de la vente de ${data.title}`,
        `Le temps est écoulé pour la vente de l'article ${data.title}.`
      );
    }

    // Get the highest bidder
    const bidsSnapshot = await db
      .collection("Encheres")
      .where("id_article", "==", articleId)
      .orderBy("montant", "desc")
      .get();

    if (!bidsSnapshot.empty) {
      const highestBid = bidsSnapshot.docs[0].data();
      const highestBidderId = highestBid.id_user;

      // Get the highest bidder's FCM token
      const highestBidderDoc = await db
        .collection("Utilisateurs")
        .doc(highestBidderId)
        .get();
      const highestBidderFCMToken = highestBidderDoc.data().fcmToken;

      // Send notification to the highest bidder
      if (highestBidderFCMToken) {
        await sendNotification(
          highestBidderFCMToken,
          "Félicitations !",
          `Tu es le grand gagnant de l'article : ${data.title}.`
        );
      }

      // Send notification to other bidders
      const otherBidders = bidsSnapshot.docs
        .slice(1)
        .map((doc) => doc.data().id_user);
      var biddersFCMToken = [];
      const otherBiddersPromises = otherBidders.map(async (bidderId) => {
        const bidderDoc = await db
          .collection("Utilisateurs")
          .doc(bidderId)
          .get();
        if (
          bidderDoc.data().fcmToken != "" &&
          !biddersFCMToken.includes(bidderDoc.data().fcmToken) &&
          bidderDoc.data().fcmToken != undefined
        ) {
          biddersFCMToken.push(bidderDoc.data().fcmToken);
        }
      });

      await Promise.all(otherBiddersPromises).then(async () => {
        const message = {
          notification: {
            title: "Désolé ! La prochaine fois peut-être",
            body: `Tu as perdu l'enchère pour l'article : ${data.title}.`,
          },
          tokens: biddersFCMToken,
        };

        await admin
          .messaging()
          .sendEachForMulticast(message)
          .then((response) => {
            console.log("Successfully sent message:", response);
          });
      });
    }
  } catch (error) {
    console.error(`Error handling expired auction ${articleId}:`, error);
  }
}

async function sendNotification(token, title, body) {
  const message = {
    notification: {
      title: title,
      body: body,
    },
    token: token,
  };

  try {
    const response = await admin.messaging().send(message);
    console.log("Successfully sent message:", response);
  } catch (error) {
    console.error("Error sending message:", error);
  }
}

// Envoi de l'email de réinitialisation de mot de passe
// await admin
//   .auth()
//   .generatePasswordResetLink(user.email)
//   .then((link) => {
//     const mailOptions = {
//       from: '"Administrateur" <noreply@bidhub.com>', // Remplacez par votre adresse email
//       to: user.email,
//       subject: "Réinitialisation de mot de passe",
//       text: `Bonjour ${user.username},\n\nVous avez demandé la réinitialisation de votre mot de passe. Cliquez sur le lien suivant pour procéder à la réinitialisation : ${link}`,
//       html: `<!DOCTYPE html>
// <html>
// <head>
//   <meta charset="UTF-8">
//   <title>Réinitialisation de mot de passe</title>
// </head>
// <body>
//   <h1>Réinitialisation de mot de passe</h1>
//   <p>Bonjour ${user.username},</p>
//   <p>Vous avez demandé la réinitialisation de votre mot de passe. Cliquez sur le lien suivant pour procéder à la réinitialisation :</p>
//   <a href="${link}">Réinitialiser le mot de passe</a>
// </body>
// </html>`,
//     };
//     return admin.auth().sendPasswordResetEmail(userauth.uid, mailOptions); // Envoi de l'email de réinitialisation
//   })
//   .then(() => {
//     console.log("Email de réinitialisation envoyé avec succès");
//   })
//   .catch((error) => {
//     console.error(
//       "Erreur lors de l'envoi de l'email de réinitialisation:",
//       error
//     );
//   });

// Envoi de l'email de confirmation
//     await admin.auth().generateEmailVerificationLink(user.email)
//       .then(link => {
//         const mailOptions = {
//           from: '"Administrateur" <noreply@bidhub.com>', // Remplacez par votre adresse email
//           to: user.email,
//           subject: 'Confirmation de création de compte',
//           text: `Bonjour ${user.username},\n\nVotre compte a été créé avec succès. Voici vos informations de connexion : \n\nEmail : ${user.email}\nMot de passe : ${user.password}\n\nMerci de bien vouloir confirmer votre inscription en cliquant sur le lien suivant : ${link}`,
//           html: `<!DOCTYPE html>
// <html>
// <head>
//   <meta charset="UTF-8">
//   <title>Confirmation de création de compte</title>
// </head>
// <body>
//   <h1>Confirmation de création de compte</h1>
//   <p>Bonjour ${user.username},</p>
//   <p>Votre compte a été créé avec succès. Voici vos informations de connexion :</p>
//   <ul>
//     <li>Email : ${user.email}</li>
//     <li>Mot de passe : ${user.password}</li>
//   </ul>
//   <p>Merci de bien vouloir confirmer votre inscription en cliquant sur le lien suivant :</p>
//   <a href="${link}">Confirmer l'inscription</a>
// </body>
// </html>`,
//         };
//         return admin.auth().sendEmailVerification(userauth.uid, mailOptions); // Envoi de l'email de confirmation
//       })
//       .then(() => {
//         console.log('Email de confirmation envoyé avec succès');
//       })
//       .catch(error => {
//         console.error('Erreur lors de l'envoi de l'email de confirmation:', error);
//       });
