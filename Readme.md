# Documentación de la aplicación Nodepop

Nodepop es una aplicación de compra/venta de artículos desarrollada con NodeJS.

## Inicialización de la aplicación
Para iniciar la aplicación no olvides ejecutar primero de todo *npm install*. Una vez hecho estó podrás ejecutar la aplicación de los siguientes modos:
- *npm run dev* : ejecuta en modo desarrollo.
- *npm start* : ejecuta en modo producción

Para la inicialización de la base de datos y tener algunos artículos de testing, se ha generado un script de instalación inicial. Para ejecutarlo, será necesario correr el comando en terminal *npm run installDB*. Este script borrará todos los registros existentes en la base de datos y añadirá los existentes en el JSON ads.json que se encuentra en la carpeta **init**.

## Filtros ##
Tanto la aplicación como la API disponen de filtros para poder seleccionar anuncios en función de algunos criterios.

### Paginación ###
La aplicación tiene definido por defecto en los middlewares de obtención de los anuncios, un límite de 12. Por tanto cada página tiene 12 elementos.

### Filtros posibles ###
- *page=[INT]* : los resultados se devuelven paginados con 12 elementos por página por defecto. La primera página corresponde a 0 y así en adelante. Ej.: *page=1* mostrará la segunda página.
- *price=[INT]-[INT]* : se puede filtrar por precio mínimo y máximo indicando ambos separados por un guión, siendo el primero el mínimo y el segundo el máximo. Si únicamente se quiere filtrar por abajo o por arriba se mantiene el guión sin poner el INT que no se quiera filtrar. Ej.: *price=300-* filtraría como precio mínimo 300 y no filtraría por precio máximo. Si no se añade el guión y únicamente se pone un precio, se realizará una búsqueda para encotrar el mismo valor. Ej.: *price=500* buscará los anuncios con ese precio concreto.
- *tags=lifestyle,work* : se pueden filtrar los anuncios por tags (lifestyle, work, mobile, motor). Para ello separarlas por comas o espacios.
- *sale=true* : para filtrar los anuncios por se busca / se vende, hay que añadir sale (true: se vende, false: se busca).
- *name=string* : filtra los anuncios que empiecen por el string indicado.
- *sort=[field]* : ordena los anuncios por el campo indicado. Ej.: *sort=price*

### API ###
La API es accesible desde */apiv1/anuncios/* y tiene las mismas opciones de filtrado. Algunos ejemplos:
- */apiv1/anuncios?price=1600*
- */apiv1/anuncios?tags=work,mobile*
- */apiv1/anuncios?name=ip*