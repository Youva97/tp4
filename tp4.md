###  TP 4
# Réalisation d'une API

Nous allons réaliser une API. Cette API REST permettra de gérer le futur backoffice du site de vente (qui sera développé en VueJS). Elle devra permettre de gérer les produits, les catégories, les clients, les utilisateurs (qui se connectent au backoffice) et les commandes.


1. Dupliquer le dossier `/cours-david/tp4` avec son contenu sur `/david/tp4`

2. Ouvrir ce dossier `/david/tp4` dans VS Code (Fichier > Ouvrir le dossier). Corriger dans `package.json` le "name" en `tp4`.

3. Dans le terminal intégré de VS Code (bien vérifier que vous vous trouvez dans le bon dossier du projet) :
```bash
# remplacer [xxxxx] par votre identifiant sur gogs
git init
git remote add origin gogs@gogs.greta.wywiwyg.net:[xxxxx]/tp4.git
git add .
git commit -m "initialisation du projet"
git push -u origin master
```

4. Avec phpmyadmin, créer la database `tp4`. Créer le fichier `.env` à la racine du projet avec le contenu suivant :
```text
DB_HOST="localhost"
DB_NAME="tp4"
DB_LOGIN="root"
DB_PASSWORD=""
PORT=8000
SECRETE_KEY="3SqWYcNU05" # à changer
```

5. Installer les dépéndances avec `npm i` ; les dépendances sont déjà définies dans `package.json`. Lancer le serveur avec `npx nodemon index.js` pour vérifier que tout fonctionne.

6. STOP : Lire comment fonctionne le programme pendant 10mn ! Dans le fichier /index.js, il y a plusieurs fonctions "init()"
- `initDatabase()` : initialise la connexion à la base de données et importe les modèles. Le module `/models/index.js` réalise plusieurs choses :
  - importe le module `/models/db.js` pour se connecter à la base de données
  - importe les modèles Products et Types
  - réalise les associations entre les modèles
- appel la fonction `bootstrap()` qui permet de créer des données de test dans la base de données
- `initMiddlewares()` : un middleware est une fonction qui est appelé avant le controller. Ici, on initialise les middlewares body-parser et on définit le dossier des fichiers statiques. On re-définit également la méthode `res.render()` pour utiliser le moteur de template ETA (essayer de comprendre comment ça fonctionne !!!)
- `initControllers()` : importe les controllers. Remarquer que chaque controller renvoie une fonction et que l'on passe `app` en paramètre. Cela permet de définir les routes dans le controller.
- `initExpress()` : lance le serveur express

7. Vous allez avoir besoin de POSTMAN pour tester, alors ouvrez-le !

INFO 1 : Pour envoyer du JSON en POST avec POSTMAN, il faut sélectionner `raw` et `JSON` dans le menu déroulant à droite du champ de saisie.

INFO 2 : Pour envoyer du JSON avec Nodejs et Express, il faut utiliser `res.json()`. Par exemple `res.json({data:[{...}, {...}]})`.

8. Modifier le fichier `/controllers/products.controller.js` afin de réaliser les actions suivantes :
- `GET /v1/products` : renvoie la liste des produits en JSON
```js
app.get('/v1/products', async function (req, res) {
  const products = await Product.findAll({ include: ['type'] });
  res.json({ data: products, error: null });
});
```
- `GET /v1/products/:id` : renvoie le produit avec l'id correspondant en JSON
```js
app.get('/v1/products/:id', async function (req, res) {
  const product = await Product.findByPk(req.params.id, { include: ['type'] });
  if (!product) return res.json({  error: 'not_found' });
  res.json({ data: product });
});
```

- `POST /v1/products` : ajoute un produit à la base de données. Renvoie le produit ajouté en JSON
```js
app.post('/v1/products', async function (req, res) {
  const product = await Product.create(req.body);
  if (!product) return res.json({  error: 'not_created' });
  res.json({ data: product });
});
```
- `PUT /v1/products/:id` : modifie le produit avec l'id correspondant. Renvoie le produit modifié en JSON.
```js
app.put('/v1/products/:id', async function (req, res) {
  const product = await Product.findByPk(req.params.id);
  if (!product) return res.json({  error: 'not_found' });
  await product.update(req.body);
  res.json({ data: product, error });
});
```
- `DELETE /v1/products/:id` : supprime le produit avec l'id correspondant. Renvoie le produit supprimé en JSON.
```js
app.delete('/v1/products/:id', async function (req, res) {
  const product = await Product.findByPk(req.params.id);
  if (!product) return res.json({  error: 'not_found' });
  await product.destroy();
  res.json({ data: product, error });
});
```

... et tester avec POSTMAN :
- Tapez l'adresse `http://localhost:8000/v1/products` dans POSTMAN et sélectionnez `GET` dans le menu déroulant à gauche du champ de saisie. Cliquez sur `Send` pour envoyer la requête. Vous devriez voir la liste des produits en JSON. 
- Pour tester les routes POST et PUT, il faudra envoyer du JSON en POST avec POSTMAN : sélectionnez `POST` dans le menu déroulant à gauche du champ de saisie, puis sélectionnez `raw` et `JSON` dans le menu déroulant à droite du champ de saisie. Complétez le champ de saisie avec un objet JSON. Par exemple : 
```json
{
  "name": "Produit 1",
  "priceHt": 100,
  "description": "Description du produit 1",
  "typeId": 1
}
```

9. Créer un fichier `/controllers/types.controller.js` afin de réaliser une API CRUD pour les types de produits. Tester avec POSTMAN.

10. Nous allons rajouter un modèle et un controller pour les utilisateurs qui se connecteront à l'interface backoffice. Rajouter un modèle `/models/user.model.js` avec les champs : name, firstname, login, password et token (*Pour le moment le mot de passe sera "en clair" dans la base de données !*). Créer un fichier `/controllers/users.controller.js` afin de réaliser une API CRUD pour les utilisateurs du futur backoffice. 

11. Créer la route `POST /v1/signin` dans ce même fichier `/controllers/users.controller.js` qui permettra de se connecter à l'interface backoffice. Cette route prendra en paramètre POST un identifiant et un mot de passe. Si l'identifiant et le mot de passe correspondent à un utilisateur en base de données, alors on renverra la fiche utilisateur ET un token (une chaîne de caractères aléatoire). Pour générer ce token, vous pouvez utiliser la librairie `uuid` 

```js
const uuid = require('uuid');
const token = uuid.v4();
```

> **Important :** le token devra être stocké dans la base de données pour chaque utilisateur au moment du premier appel de la route `POST /v1/signin`. Si il y a déjà un token pour cet utilisateur, alors on ne le change pas ! On améliorera la sécurité du token dans un prochain TP.

12. Créer un modèle et un controller pour les clients. Le modèle `/models/customers.model.js` aura les champs suivants : id, name, firstname, adress1, adress2, zipCode, city, email, phone. Le controller `/controllers/customers.controller.js` permettra de réaliser une API CRUD pour les clients.

13. Créer 2 modèles (Invoice et InvoiceLine) et un controller pour les factures. 
- Le modèle `/models/invoice.model.js` aura les champs suivants : id, date (datetime), customerId, totalHt, totalTtc. **Les prix seront stockés en centimes dans un integer (Prix€ * 100)**.
- Le modèle `/models/invoiceline.model.js` aura les champs suivants : id, invoiceId, productId, quantity, priceHt, productName. (priceHt et productName permettront de garder une trace du prix et du nom du produit au moment de la facturation, car le prix et le nom du produit peuvent changer dans le temps dans la fiche produit).
- Rajouter dans `/models/index.js` les associations entre les modèles Invoice et InvoiceLine.
- Le controller `/controllers/invoices.controller.js` permettra de réaliser une API CRUD pour les factures. Lorsque l'on envoie une facture, on envoie également les lignes de facture dans un tableau. Par exemple on pourrait envoyer en POST (avec POSTMAN) une facture avec les lignes suivantes :

```json
{
  "date": "2024-01-01",
  "customerId": 1,
  "totalHt": 100,
  "totalTtc": 120,
  "lines": [
    {
      "productId": 1,
      "quantity": 2,
    },
    {
      "productId": 2,
      "quantity": 1,
    }
  ]
}
```

...et il va falloir gérer cela dans le controller. Pour cela créer la facture, puis créer les lignes de facture une par une. **Pour la modification d'une facture, il faudra supprimer toutes les lignes de la facture et les recréer.**

14. Avez vous remarquez que vous pouvez lister les factures (et les modifier) de votre voisin ? Amusons-nous. Trouver le numéro IP de la machine de votre voisin : dans Windows, demandez-lui d'ouvrir une invite de commande et demandez-lui de taper `ipconfig`. Notez l'adresse IPv4. Dans POSTMAN, changer `localhost` par l'adresse IP de votre voisin. Vous pouvez maintenant voir et modifier ses factures. C'est pas bien ça ! Nous allons régler ce problème pour que lui ne puisse pas modifier vos factures.

> INFO : un middleware est une fonction qui est appelé avant le controller et qui peut modifier la requête avant qu'elle n'arrive au controller. On peut aussi faire en sorte que le middleware arrête la requête avant qu'elle n'arrive au controller.



15. Nous allons rajouter un middleware qui vérifie que l'utilisateur est connecté. L'idée est de renvoyer le token que l'on obtient à la connexion, avec toutes les requêtes. Et le mieux est de l'envoyer en en-tête des requêtes. Créer un fichier `/middlewares/auth.middleware.js` qui contiendra une fonction qui vérifie que le token est présent dans le header `Authorization`. Si le token est présent, alors on vérifie que le token correspond à un utilisateur en base de données. Si c'est le cas, alors on passe à la suite. Sinon, on renvoie une erreur 401. Rajouter ce middleware dans le fichier `/index.js` pour toutes les routes qui commencent par `/v1/`.

Voici un exemple de middleware qui vérifie que le token est présent dans le header `Authorization` :

```js
const { User } = require('../models/index');

module.exports = async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ error: 'token_invalid' });
  }
  const user = await User.findOne({ where: { token } });
  if (!user) {
    return res.status(401).json({ error: 'token_invalid' });
  }
  // on stocke l'utilisateur dans la requête pour le récupérer dans le controller si besoin
  req.user = user;
  // on appel next() pour continuer le traitement de la requête dans le controller
  next();
};
```

Maintenant, modifier toutes (presque) les routes pour qu'elles utilisent ce middleware, de la façon suivante :

```js
const auth = require('../middlewares/auth.middleware');
app.use('/v1/invoices', auth, async function (req, res) => {
  ...
});
```

Pour tester avec POSTMAN, il faudra ajouter un header `Authorization` avec la valeur du token. Pour cela, cliquer sur l'onglet `Headers` dans POSTMAN et ajouter une ligne `Authorization` avec la valeur du token obtenu par la route `/v1/signin`.

---

### Conclusion

Nous avons vu ici la base de la réalisation d'une API REST. Nous avons vu comment réaliser des routes GET, POST, PUT et DELETE. Nous avons vu comment réaliser des associations entre les modèles. Nous avons vu comment réaliser des middlewares pour sécuriser les routes. Nous avons vu comment réaliser des tests avec POSTMAN. 

> **Bref, si vous avez compris ce que vous avez fait, vous êtes déjà des bons du backend ! Tout le reste qu'il vous reste à apprendre sera du détail !**

Il reste à apprendre à mieux encore sécuriser les tokens, à connaitre les JWT (Json Web Token) qui sont une autre façon de sécuriser une API, à utiliser un webservice, 
