
import fs from 'fs';
import path from 'path';

/*
crea una funcion con nombre addFileToRepository el cual recibirá como parametro una imagen en base64, debes guardar la imagen en un directorio accesible del servidor express, y retornar la ruta de la imagen. Validar que la imagen no pese mas de 5MB.
*/
export const addFileToRepository = (image) => {
    
    // Decode the base64 image data
    const imageData = Buffer.from(image, 'base64');

    // Check if the image size is less than or equal to 5MB
    if (imageData.length > 5 * 1024 * 1024) {
        throw new Error('Image size exceeds 5MB limit');
    }

    // Generate a unique filename for the image
    const filename = `${Date.now()}.jpg`;

    const path = `${__dirname}--${'../public/images'}`;
    // Define the directory where the image will be saved
    const directory = path.join(__dirname, '../public/images');

    // Create the directory if it doesn't exist
    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory);
    }

    // Save the image to the directory
    const imagePath = path.join(directory, filename);
    fs.writeFileSync(imagePath, imageData);

    // Return the image path
    return imagePath;


};
