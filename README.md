# Projet BrowserQuest

[![Node.js CI](https://github.com/nenuadrian/BrowserQuest/actions/workflows/node.js.yml/badge.svg)](https://github.com/nenuadrian/BrowserQuest/actions/workflows/node.js.yml)

![alt tag](https://raw.github.com/nenuadrian/BrowserQuest/master/screens/1.png)

## Membres du groupe

- Kelly Goncalves Gama
- Arthur Guillemin
- Émilie Caverne

---

## Étapes réalisées

### Étape 1 – Déploiement Docker

Mise en place d’un conteneur Docker pour standardiser l’environnement de développement et faciliter le déploiement.

- Création d’un Dockerfile : définition de l’image Node.js, copie des fichiers du projet, installation des dépendances via npm install.
- Exposition des ports : configuration du port 8000 pour permettre l’accès au serveur.
- Commandes de build et de run :
    - docker build -t browserquest .
    - docker run -p 8000:8000 browserquest

### Étape 3 – Mise en place d’un Load Balancer

Utilisation de **NGINX** pour répartir la charge entre plusieurs instances du serveur :

- Deux instances du serveur BrowserQuest ont été lancées sur les ports `8000` et `8001`
- Un fichier de configuration `browserquest.conf` a été ajouté dans `/opt/homebrew/etc/nginx/servers/`
- Le trafic HTTP entrant sur `localhost:8080` est redirigé de manière équilibrée vers l’une des deux instances actives

---

### Étape 5 – Optimisation des performances

Optimisations effectuées côté client et serveur :

1. **Réduction de la latence WebSocket** : implémentation d’un système `ping/pong` pour mesurer et suivre la latence.
2. **Rendu graphique** : optimisation du `canvas`, avec désactivation de l'anti-aliasing sur certains navigateurs.
3. **Gestion des ressources** : vérification de la consommation CPU/mémoire du client ; réflexion autour du nettoyage des objets inutilisés.

---
