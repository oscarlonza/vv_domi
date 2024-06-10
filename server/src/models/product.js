
/*
Los campos obligatorios deben estar claramente identificados.

Se deben validar los formatos adecuados para los campos (por ejemplo, texto, números).

Debo poder editar el campo Nombre del producto, el campo es alfanumérico y de un tamaño máximo de 100 caracteres. Campo obligatorio.

Debo poder ingresar el campo Descripción, el campo es alfanumérico y de un tamaño máximo de 200 caracteres. Campo opcional.

Debo poder editar el campo precio, el campo es numérico y su formato debe ser el de moneda en COP. Campo obligatorio.

Debo poder editar el campo Cantidad, el campo es numérico entero. Campo obligatorio.

Debo poder ingresar el campo Imagen, debe permitirme el cargue de archivos solo en formato JPG o PNG y de un tamaño máximo de 5MB. Campo opcional.

Si no se carga imagen de producto se debe asignar la imagen genérica definida.
 */
import { model, Schema } from 'mongoose';

const productSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Nombre requerido'],
        maxlength: [100, 'El nombre debe tener máximo 100 caracteres'],
    },
    description: {
        type: String,
        maxlength: [200, 'La descripción debe tener máximo 200 caracteres'],
    },
    price: {
        type: Number,
        required: [true, 'Precio requerido'],
        min: [0, 'El precio no puede ser negativo'],
    },
    quantity: {
        type: Number,
        required: [true, 'Cantidad requerida'],
    },
    image: {
        type: String,
    },
    comments: [],
}, { timestamps: true });

productSchema.methods.toJSON = function () {
    const { __v, status, createdAt, updatedAt, comments, _id: id, ...data } = this.toObject();
    const totalComments = comments.length;
    return {
        id, ...data,
        comments: totalComments,
        rating: totalComments > 0 ?
            comments.reduce((acc, rating) => acc + rating, 0) / totalComments : 0
    };
}

export const Product = model('Product', productSchema);
