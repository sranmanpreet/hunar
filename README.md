# Hunar
Hunar is a MEAN stack web application for Artists to sell their Art Work and to receive On Demand orders online.

# Features!
  - Product Management
  - Cart Management
  - Order Management
  - On Demand Orders with Image Uploads
  - User Session Management
  - Responsive Design
  - Support for MongoDB
  - Password Reset Emails
  - OAUTH2.0 and Passport Authentication


### Tech

Hunar uses a number of open source projects to work properly:

* [Angular] - A Javascript Framework by Google!
* [Twitter Bootstrap] - great UI boilerplate for modern web apps
* [node.js] - evented I/O for the backend
* [Express] - fast node.js network app framework
* [MongoDB] - A NoSQL database

### Installation

Hunar requires [Node.js](https://nodejs.org/) v4+ to run.

Setup database and provide database configuration in ``hunar_app/config/config.json``
```sh
        "MONGODB_URI": "mongodb://localhost:27017/hunar?authSource=hunar",
        "MONGODB_USER": "hunarAdmin",
        "MONGODB_PASS": "password"
```
Install the dependencies and devDependencies and start the server.

```sh
$ cd hunar_app
$ npm install -d
$ node app
```

For production environments...

```sh
$ npm install --production
$ NODE_ENV=production node app
```

Install the dependencies and devDependencies and start the client.

```sh
$ cd hunar_app/public/frontend
$ npm install
$ ng serve -o
```

For production environments...

```sh
$ cd hunar_app/public/frontend
$ npm install --production
$ NODE_ENV=production node app
```

### Todos

 - Write MORE Tests
 - Add Night Mode

License
----

MIT


**Free Software, Hell Yeah!** 
**Suggestions/Improvements are welcome. Want to develop together? You are most welcome. **

[//]: # (These are reference links used in the body of this note and get stripped out when the markdown processor does its job. There is no need to format nicely because it shouldn't be seen. Thanks SO - http://stackoverflow.com/questions/4823468/store-comments-in-markdown-syntax)


   [dill]: <https://github.com/joemccann/dillinger>
   [git-repo-url]: <https://github.com/joemccann/dillinger.git>
   [john gruber]: <http://daringfireball.net>
   [df1]: <http://daringfireball.net/projects/markdown/>
   [markdown-it]: <https://github.com/markdown-it/markdown-it>
   [Ace Editor]: <http://ace.ajax.org>
   [node.js]: <http://nodejs.org>
   [Twitter Bootstrap]: <http://twitter.github.com/bootstrap/>
   [jQuery]: <http://jquery.com>
   [@tjholowaychuk]: <http://twitter.com/tjholowaychuk>
   [express]: <http://expressjs.com>
   [Angular]: <https://angular.io/>
   [MongoDB]: <https://www.mongodb.com/>

   [PlDb]: <https://github.com/joemccann/dillinger/tree/master/plugins/dropbox/README.md>
   [PlGh]: <https://github.com/joemccann/dillinger/tree/master/plugins/github/README.md>
   [PlGd]: <https://github.com/joemccann/dillinger/tree/master/plugins/googledrive/README.md>
   [PlOd]: <https://github.com/joemccann/dillinger/tree/master/plugins/onedrive/README.md>
   [PlMe]: <https://github.com/joemccann/dillinger/tree/master/plugins/medium/README.md>
   [PlGa]: <https://github.com/RahulHP/dillinger/blob/master/plugins/googleanalytics/README.md>
