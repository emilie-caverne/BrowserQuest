# Projet BrowserQuest

[![Node.js CI](https://github.com/nenuadrian/BrowserQuest/actions/workflows/node.js.yml/badge.svg)](https://github.com/nenuadrian/BrowserQuest/actions/workflows/node.js.yml)

![alt tag](https://raw.github.com/nenuadrian/BrowserQuest/master/screens/1.png)

## Membres du groupe

- Kelly Goncalves Gama
- Arthur Guillemin
- Émilie Caverne

---
# Pour lancer le projet 

## En solo

Basculez sur la branche 'localhost'
### Avec docker 
A la racine du projet : 

`docker build -t browserquest .`

Puis 

`docker run -p 8000:8000 -p 8080:8080 browserquest`

## En multijoueurs

Basculez sur la branche 'Deploy'

Lancer le index.html , You might want to host a webserver and open index.html in that (e.g. 127.0.0.1/index.html). (live server)

pas besoin de lancer le backend , il est deployé sur aws ici http://13.49.228.238:8000/ 

[![Node.js CI](https://github.com/nenuadrian/BrowserQuest/actions/workflows/node.js.yml/badge.svg)](https://github.com/nenuadrian/BrowserQuest/actions/workflows/node.js.yml)
![alt tag](https://raw.github.com/nenuadrian/BrowserQuest/master/screens/5.png)


## Étapes réalisées



### Étape 1 – Déploiement Docker

Mise en place d’un conteneur Docker pour standardiser l’environnement de développement et faciliter le déploiement.

- Dockerfile : définition de l’image Node.js, copie des fichiers du projet, installation des dépendances via npm install.Lancement du front avec http-server.
- Commandes de build et de run :
    - `docker build -t browserquest .`
    - `docker run -p 8000:8000 -p 8080:8080 browserquest`
---

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

 ### Étape 6 – Sécurisation de l'Application

Mise en place de plusieurs mécanismes pour protéger l'application :

- Pare-feu EC2
    - Ouverture uniquement des ports nécessaires : `22` (SSH), `80` (HTTP) et `443` (HTTPS).
    - Configuration réalisée via la console AWS dans les paramètres du groupe de sécurité associé à l'instance EC2. 
- Fail2Ban : surveillance des connexions SSH et bannissement automatique des adresses IP après plusieurs échecs de connexion. Configuration dans /etc/fail2ban/jail.local.

- Pare-feu système (UFW)
- Activation du pare-feu local sur l'instance Ubuntu avec UFW.
- Autorisation uniquement des ports nécessaires

---
