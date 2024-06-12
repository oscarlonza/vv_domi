# Server project for Domi Store


## Mongo db Docker configuration

1. Donwload Mongo image
    > docker pull mongo

2. Create container with mongo image
    > docker run -d -p 27017:27017 --name domi-mongodb -v data-vol:/data/db -e MONGODB_INITDB_ROOT_USERNAME=db-user -e MONGODB_INITDB_ROOT_PASSWORD=123456 mongo

3. Validate connection
    > docker exec -it domi-mongodb bash
        >> mongosh

    Examples of string connection 
    - mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.2.6
    - mongodb://localhost:27017

## Ejecución en ambiente de desarrollo

1. Instalar dependencias
    > npm install

2. Configurar variables de entorno
    - Crear archivo .env
    - Agregar las variables teniendo en encuenta la estructura de .example.env 

3. Ejecutar script dev
    > npm run dev