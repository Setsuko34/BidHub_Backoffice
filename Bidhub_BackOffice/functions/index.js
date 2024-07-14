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

//TODO : fix la notifications de nouvelles encheres pour les Acquereurs
//TODO : notification lors de la suppression d'un article à toute les personnes aillant encheries dessus, voir si c'est possible avec un declencheur sur la table article
//TODO : notification lors de l'atteinte de la date de fin de l'enchère à la personne ayant la meilleure enchère pour lui signalez sa victoire et donc qu'il peut télécharger l'article et payer
//TODO : Fixer la création d'un article (voir pourquoi le imd_list n'est pas bien enregistré)
//TODO : Fixer la mis à jour d'un article (voir pourquoi les images sont supprimées si l'on en renseigne pas de nouvelles)

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
