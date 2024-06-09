/*
crea una funcion con nombre addFileToRepository el cual recibirá como parametro una imagen en base64, debes guardar la imagen en un directorio accesible del servidor express, y retornar la ruta de la imagen. Validar que la imagen no pese mas de 5MB.

*/

import {addFileToRepository} from '../libs/fileManager.js';

export const createDefaultImage = async (req, res) => {
    const image = '';    
    const imageUrl = addFileToRepository(image);
    return res.status(201).json(imageUrl);
};