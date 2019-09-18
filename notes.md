- DAY 1

* npm init --y to make pacakge.json
* npm install --save-dev nodemon as dev dep
* npm install knex -g
* npm install knex --save
* knex migrate:make users
* knex migrate:latest creates the tables after you write them in migrations
  then it creates the users.db3 file
* knex migrate:rollback (if you forgot some fields and have to write them in)
* then you can do knex migrate:latest again
* npx knex seed:make login/whatever to make seed file one by one
* npx knex seed:run then run the seed file and you will see the data under data in sql app

- DAY 2 

* npm i express-session
  OR in this case, yarn add express-session bc npm isn't working
* const session = require("express-session) in index.js
* remember to send login credentials in the json body not headers in insomnia
* change restricted middleware file
* add library: npm i connect-session-knex
