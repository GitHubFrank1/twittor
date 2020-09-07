//Imports
importScripts('js/sw-utils.js');

const STATIC_CACHE = 'static-v3';
const DYNAMIC_CACHE = 'dynamic-v1';
const INMUTABLE_CACHE = 'inmutable-v1';

//El APP_SHELL va a contener todo los que es necesario para mi aplicación.
const APP_SHELL = [
    // '/',
    'index.html',
    'css/style.css',
    'img/favicon.ico',
    'img/avatars/hulk.jpg',
    'img/avatars/ironman.jpg',
    'img/avatars/spiderman.jpg',
    'img/avatars/thor.jpg',
    'img/avatars/wolverine.jpg',
    'js/app.js',
    'js/sw-utils.js'

];

//Hara lo mismo que el APP_SHELL pero contendra todo lo que no se va a modificar jamás.
const APP_SHELL_INMUTABLE = [
    'https://fonts.googleapis.com/css?family=Quicksand:300,400',
    'https://fonts.googleapis.com/css?family=Lato:400,300',
    'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
    'css/animate.css',
    'js/libs/jquery.js'

];

//Hacemos la instalación.
self.addEventListener('install', e => {
    //Almacenamos en el cache el APP_SHELL Y EL APP_SHELL_INMUTABLE. 
    //Creamos una constante o promesa llamada cacheStatic y abrimos el cache estatico y hacemos una referencia al cache.
    const cacheStatic = caches.open(STATIC_CACHE).then(cache =>
        cache.addAll(APP_SHELL));

    //Creamos una constante o promesa llamada cacheInmutable y abrimos el cache estatico y hacemos una referencia al cache.
    const cacheInmutable = caches.open(INMUTABLE_CACHE).then(cache =>
        cache.addAll(APP_SHELL_INMUTABLE));

    //En el e.waitUnitl manejamos las 2 promesas como Promise.all y mandamos un arreglo del las dos promesas la de cacheStatic y la de cacheInmutable
    e.waitUntil(Promise.all([cacheStatic, cacheInmutable]));
});


//Proceso para que cada vez que se cambie un SW se borren los caches anteriores que ya no van a servir.
self.addEventListener('activate', e => {
    //Verificamos si la versión del cache actual que se encuentra en este SW es la misma que la que....
    // ...se encuentra activo entonces no se tiene que hacer nada, pero si hay alguna diferencia...
    //... entonces se tiene que borrar el cache estatico

    //Borrar los caches que ya no me sirven. En teoria son los caches estaticos anteriores.

    //Primero verificamos en los caches si existen otros caches con el nombre de statics
    const respuesta = caches.keys().then(keys => { //Los keys son todos los nombres que tengan en el localhost ahorita o en el hosting donde se esta corriendo la aplicaciÃ³n.

        keys.forEach(key => {
            //Barremos cada key que encuentre
            //SI EL KEY ES DIFERENTE AL STATIC_CACHE (STATIC V5) ENTONCES LO TENDRIAMOS QUE ELIMINAR, 
            // pero tiene que ser diferente al STATIC_CACHE  (static v5) pero a la vez tiene que tener
            // incluido en su nombre algo llamado static
            if (key !== STATIC_CACHE && key.includes('static')) {
                return caches.delete(key);
            }
        });

    });
    e.waitUntil(respuesta);

});

//Estrategia Cache Only
self.addEventListener('fetch', e => {
    //Verificamos en el cache si existe la request
    const respuesta = caches.match(e.request).then(res => {
        //Si la respuesta existe entonces hare un return de la respuesta.
        if (res) {
            return res;
        } else { //Si no existe la respuesta
            //Implementamos parte de la estrategia cache con Network Fallback.
            //Hacemos un fetch al recurso nuevo
            return fetch(e.request).then(newRes => {

                //Llamamos la función actualizaCacheDinamico que esta en sw-utils.js
                return actualizaCacheDinamico(DYNAMIC_CACHE, e.request, newRes);
            });


        }


    });

    e.respondWith(respuesta);
});