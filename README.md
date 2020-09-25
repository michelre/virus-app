# Installation

## Code

```
git clone https://github.com/michelre/virus-app.git
```


## Backend

* Démarrer WAMP
* Exécuter les commandes ci-dessous:

```
cd virus-api
composer install
cp .env .env.local
```

* Completer les informations DATABASE_URL, JWT_KEY, API_KEY, API_HOST

* Migrer la base de données:

```
./bin/console doctrine:migrations:migrate
```

* Démarrer le serveur web:

```
symfony serve
```

Le serveur doit tourner sur http://localhost:8000

## Frontend

```
cd virus-app
npm install
npm start
```

## Services externes
On utilise un service d'envoi de mail qui s'appelle mailjet. 
Il faut créer un compte et se rendre dans "Account Settings > Master API & Sub key management"

![https://i.imgur.com/NOVkLLA.png](https://i.imgur.com/NOVkLLA.png)


Il faut récupérer les clés de connexion pour les renseigner dans le fichier .env.local

```
MAILJET_KEY=
MAILJET_SECRET=
SENDER_MAIL=
```

![https://imgur.com/Kbq4CUB.png](https://imgur.com/Kbq4CUB.png)

## Migration de base de données

Il faut jouer le script de migration en executant la commande de doctrine

```
./bin/console doctrine:migrations:migrate
```
