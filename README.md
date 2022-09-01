Contact list - Demo Application
===============================

This application is a combination of:
* REST API backend written in Symfony and [API Platform](https://api-platform.com/)
* MVC frontend client written in [Angular](https://angular.io/)
* [Angular Universal](https://angular.io/guide/universal) for Server-side rendering

Installation
------------
1. If not already done, [install Docker Compose](https://docs.docker.com/compose/install/)
2. Run `docker-compose build`
3. Run `docker-compose run webapp composer install`
4. Run `docker-compose run node npm install`
5. Run `docker-compose up -d`
6. Run `docker-compose exec webapp bin/console doctrine:migrations:migrate`
7. Run `docker-compose exec webapp bin/console hautelook:fixtures:load`
8. Open `http://localhost` in your favorite web browser