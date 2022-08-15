Contact list - Demo Application
===============================

This application is a combination of:
* REST API backend written in Symfony2 and [API Platform](https://api-platform.com/)
* MVC frontend client written in [Angular](https://angular.io/)
* [Angular Universal](https://angular.io/guide/universal) for Server-side rendering

Installation
------------
1. If not already done, [install Docker Compose](https://docs.docker.com/compose/install/)
2. Run `docker-compose build`
3. Run `docker-compose exec webapp composer install`
4. Run `docker-compose exec node npm install`
5. Run `docker-compose exec webapp bin/console hautelook:fixtures:load`
6. Run `docker-compose up`
7. Open `http://localhost` in your favorite web browser