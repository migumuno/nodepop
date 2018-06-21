# Documentación de la aplicación Nodepop

Nodepop es una aplicación de compra/venta de artículos desarrollada con NodeJS.

## Inicialización de la aplicación
Para iniciar la aplicación no olvides ejecutar primero de todo *npm install*. Una vez hecho estó podrás ejecutar la aplicación de los siguientes modos:
- *npm run dev* : ejecuta en modo desarrollo.
- *npm start* : ejecuta en modo producción

Para la inicialización de la base de datos y tener algunos artículos de testing, se ha generado un script de instalación inicial. Para ejecutarlo, será necesario correr el comando en terminal *npm run installDB*. Este script borrará todos los registros existentes en la base de datos y añadirá los existentes en el JSON ads.json que se encuentra en la carpeta **init**.