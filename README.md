# DI_WP_SITE_Tracker

Track site theme and plugin updates and vulnerabilities

# Steps to install

### - Git clone https://github.com/rresnic/DI_WP_SITE_Tracker

### - npm install

### - create .env file

### - define PGSTRINGURI and ACCESS_TOKEN_SECRET in the .env file.

### - npx knex migrate:latest

### - npx knex seed:run

### - cd into client and npm install

### - add an env file to the src with VITE_API_BASE_URL defined if you plan to run it on development, shouldn't be needed for real deployment

### - npm run build

### - cd out of client

### - node server.js
