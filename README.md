# Grada.me

Вижте официалния сайт [www.grada.me](http://www.grada.me) за описание на проекта

## Инсталация (за програмисти)
Проектът е написан с технологии изцяло използващи JavaScript. Причина за това е всички процеси
(frontend, backend и работа база данни) да имат общ език и популярността му да увеличава
надеждността за продължителна разработка.

Backend частта от проекта е написана на [Node.js](http://nodejs.org/)
и [Express.js](https://github.com/visionmedia/express),
и използва [MongoDB](http://www.mongodb.org/).
Frontend частта от проекта е написана на [Angular js](https://angularjs.org/).

### Автоматична настройка
Нужни са ви единствено:

 - [Vagrant](http://www.vagrantup.com/), ако нямате – [сваляте и инсталирате](
https://www.vagrantup.com/downloads.html)
 - [VirtualBox](https://www.virtualbox.org/), ако нямате – [сваляте и инсталирате](https://www.virtualbox.org/wiki/Downloads)

В директорията на проекта пускате 1 команда:

```sh
vagrant up
```

С `vagrant ssh` се логвате във виртуалната машина, а в ~/.pm2/logs се намират логовете.

Това може да отнеме няколко минути, след което имате работещ сайта на адрес:  [http://10.3.3.3:3000/](http://10.3.3.3:3000/)

#### Ако има проблеми при автоматичната настройка

Може би `vagrant` не може да намери основата, на която базираме автоматичната инсталация (*hashicorp/precise32 VM*). В този случай изпълнете:

```
vagrant box add hashicorp/precise32 https://vagrantcloud.com/hashicorp/precise32/version/1/provider/virtualbox.box
```

При проблем с NFS файлова система (Vagrant казва, че машината не може да намери `nfsd`), трябва да се инсталират следните неща:

```sh
sudo apt-get install nfs-kernel-server nfs-common
```

След това нещата ще тръгнат.

#### Детайли какво се случва при автоматичната настройка
Автоматичната настройка създава виртуална машина заемаща 384MB RAM памет и 2GB на диска. Може да я спирате и пускате с команди от директорията на проекта:

```sh
vagrant halt # изключва
vagrant up # включва
```

За още детайли [вижте какво се инсталира в нея](bootstrap_vagrant.sh).

### Детайли по имплементацията

Имплементация е базирана на шаблони/boilerplates:
- [mean.js](https://github.com/meanjs/mean)
- [passport-api-tokens](https://github.com/roblevintennis/passport-api-tokens)
- [angularjs-token-auth](http://stackoverflow.com/questions/11176330/angularjs-how-to-send-auth-token-with-resource-requests) (stackoverflow)

## Структура
- app/
 - routes/
 - controllers/
 - models/
 - views/
- config/
 - env/
 - strategies/
- public/
 - css/
 - img/
 - js/
    - controllers/
    - services/
 - lib/
 - views/

