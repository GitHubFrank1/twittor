//Este sera un archivo auxiliar del SW que permitira trasladar cierta logica de aqui al SW.

//Esta funcion se va a encargar de guardar en el cache dinamico.
function actualizaCacheDinamico(dynamicCache, req, res) { //Almacenaremos la dynamic, la request y la response.

    //Si hace la respuesta significa que tiene data y la tenemos que almacenar en el cache. 
    if (res.ok) {
        // La función actualizaCacheDinamico returna esta promesa de abajo
        return caches.open(dynamicCache).then(cache => {
            //Almacenamos en el cache la request y clonamos la respuesta.
            cache.put(req, res.clone()); //Esta es otra promesa.

            //Retornamos otro clon de la respuesta.
            return res.clone();

        });

    } else { //Si no viene nada significa que fallo el cache y la red, entonces solo mandaremos el error.

        return res;

    }

}