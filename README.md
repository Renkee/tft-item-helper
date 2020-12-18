# TFT Item Helper
I created this application because I wanted to learn about Raw SQL / Database Design, this is why I'm not using Eloquent or any other ORM.

It's main features are:
- Create/update/delete builds with drag and drop system
- Ranking builds based on your selected items

Made with Laravel and VueJS.

## Installation with Laradock
First, install `docker` and `docker-compose`, then follow the instructions below:
```
mkdir tft-item-helper-app
cd tft-item-helper-app
git clone https://github.com/Renkee/tft-item-helper.git
git clone https://github.com/laradock/laradock.git
cd laradock
mv env-example .env
```
Now you need to edit the `.env` file. Use your favorite editor to do so.

Replace `APP_CODE_PATH_HOST=../` with `APP_CODE_PATH_HOST=../tft-item-helper`

Configure MySQL however you want, the only thing that matters is that the Laravel app's .env file is configured the same way.

Example:
```
MYSQL_VERSION=latest
MYSQL_DATABASE=tft_app
MYSQL_USER=Renkee
MYSQL_PASSWORD=supersecret
MYSQL_PORT=3306
MYSQL_ROOT_PASSWORD=supersupersecret
MYSQL_ENTRYPOINT_INITDB=./mysql/docker-entrypoint-initdb.d
```
All other examples will use the variables above.
```
cd ../tft-item-helper
mv .env.example .env
```
Once again, use your favorite editor to edit `.env`.

Need to match laradock's env variables for database access.

Example:
```
DB_CONNECTION=mysql
DB_HOST=mysql
DB_PORT=3306
DB_DATABASE=tft_app
DB_USERNAME=Renkee
DB_PASSWORD=supersecret
```
Now you need to start the docker build process.
```
cd ../laradock
docker-compose up -d mysql nginx workspace
```
This might take a while... After this, you need to import the DB dump `tft_app_dump.sql` into MySQL
```
docker-compose exec -T mysql mysql -uRenkee -psupersecret tft_app < ../tft-item-helper/tft_app_dump.sql
docker-compose exec workspace bash
composer install
php artisan key:generate
npm install
```
You can compile the Vue app with either of these commands: `npm run dev` or `npm run prod`.
