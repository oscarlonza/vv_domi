
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
        required: true,
        maxlength: 100,
    },
    description: {
        type: String,
        maxlength: 200,
    },
    price: {
        type: Number,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    image: {
        type: String,
        //validate: {
        //    validator: function(url) {
        //        return /.*\.(jpg|png)$/.test(url);
        //    },
        //    message: props => `${props.value} no es un formato de imagen válido.`
        //},
        //maxlength: 5 * 1024 * 1024,
    }
}, { timestamps: true });

export const Product = model('Product', productSchema);
