# Server project for Domi Store


## Mongo db Docker configuration

1. Donwload Mongo image
    > docker pull mongo

2. Launch docker compose
    > docker-compose -f .\mongodb-compose.yml up -d

4. Validate connection
    > docker exec -it server-domi-mongodb-1 bash
        >> mongosh

    Replace "server-domi-mongodb-1" with your container name.

5. Add the replicateSet=rs0 parameter to your string connection
    Examples of string connection 
    - mongodb://localhost:27017/?replicaSet=rs0
    
## Ejecución en ambiente de desarrollo

1. Instalar dependencias
    > npm install

2. Configurar variables de entorno
    - Crear archivo .env
    - Agregar las variables teniendo en encuenta la estructura de .example.env 

3. Ejecutar script dev
    > npm run dev