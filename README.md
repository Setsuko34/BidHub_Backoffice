# BidHub Backoffice - Application de Ventes aux Enchères
## Présentation

BidHub est une application mobile « Marketplace » destinée à la vente aux enchères de produits numériques tels que des PDF et des images. Les membres peuvent acheter et  vendre leurs produits, chaque produit ayant un prix de départ et une date de fin d'enchère. L'application intègre un système de notifications push pour alerter les utilisateurs sur leur smartphone.

L'interface web, destinée aux administrateurs, permet de gérer les offres mises aux enchères ainsi que les utilisateurs.

## API / Back-end

Le back-end utilise Google Firebase pour la gestion des données et des événements via les Cloud Functions. Une API en Node.js est également implémentée pour la gestion de l'authentification des utilisateurs.

### Application Web

Le front-end du back-office est développé avec React, offrant une interface utilisateur moderne et réactive pour les administrateurs.
#### Pages Obligatoires

    Page de connexion : Authentification des administrateurs.
    Tableau de bord : Affiche des statistiques sur les activités de la plateforme.
    Page des articles : Liste des articles publiées.
    Page d'une article : Affiche les informations d'une article et les enchères associées.

## Pré-requis

Pour configurer et développer sur le projet BidHub, les connaissances et technologies suivantes sont nécessaires :

    Framework Web
    Framework d’application mobile
    Base de données (MySQL, MongoDB…)
    Programmation Orientée Objet (POO)
    Serveur Web (Apache, Nginx)
    HTML/CSS
    JavaScript
    Langage Web (PHP, NodeJS, Python, Ruby...)
    GIT
    UML
    Gestionnaire de dépendances (composer, npm, pip…)
    ORM
    API

## Compétences Visées

Le projet BidHub permet de développer et d'évaluer les compétences suivantes :
### Développement d’Application Mobile

    Développer une application mobile
    Maîtriser les outils de React Native

### Développement d’un Site Web

    Maîtriser les outils de React
    Mettre en place la persistance de données via un ORM
    Organiser son projet en respectant l’arborescence des fichiers du Framework
    Traiter des formulaires web (CRUD)
    Construire un système d’authentification des utilisateurs via l’API

### API

    Construire ou utiliser une API
    S’authentifier via l’API
    Récupérer des données sur l’API

Ce projet est sous licence MIT. Consultez le fichier LICENSE pour plus d’informations.
