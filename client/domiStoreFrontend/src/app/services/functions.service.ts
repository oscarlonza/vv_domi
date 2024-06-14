import { ElementRef, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpErrorResponse } from '@angular/common/http';
import {
  isEmpty,
  isNotEmpty,
  isNotEmptyObject,
  isString,
} from 'class-validator';

export function getDomain(): string {
  return environment.apiUrl;
}

export function getErrorMessage(error: any, print: boolean = false): string {
  let result: string = '';
  if (error instanceof Error) {
    result = error.message;
  }
  if (error instanceof HttpErrorResponse) {
    //Algunos endpoints mandan parámetros de error en el response
    if (error.error) {
      //En específico la lambda basics retorna un response {success,message,error}, lo que haría que error.error tenga esa forma.
      if (error.error.error && isNotEmptyObject(error.error.error)) {
        const err = error.error.error;
        //Para validar si el error generado es del tipo de oracle.
        if (isString(err)) {
          result = err;
          if (err.match(/[(ORA)(OCIError)]/gi)) {
            result = getORAException(err);
          }
        }
      } else if (error.error.message) {
        result = error.error.message;
      }
    } else {
      result = error.message ? error.message : 'Error en la petición';
    }
  }
  print ? console.error(error) : '';
  return result;
}
export function getORAException(error: string): string {
  if (error.match(/(unique)|(constraint)/gi)) {
    return 'Ya existe un registro con datos similares a este';
  }
  if (error.match(/(too)|(large)/gi)) {
    return 'Uno de los campos es demasiado largo';
  }
  return error;
}
export function getBasicError(error: any, print: boolean = false): any {
  if (error instanceof Error) {
    return error;
  }
  if (error instanceof HttpErrorResponse) {
    return error.error;
  }
  print ? console.error(error) : '';
  return error;
}
/**
 * Muestra un Spinner (loading) y muestra el mensaje especificado
 * @param message
 */
export function showSpinner(message: string = 'Cargando...') {
  document.getElementById('coky-spinner-container')?.removeAttribute('hidden');
  const spinnerMessage = document.getElementById('coky-spinner-message');
  spinnerMessage ? (spinnerMessage.innerHTML = message) : '';
}

/**
 * Oculta el spinner si está visible
 */
export function hideSpinner() {
  document
    .getElementById('coky-spinner-container')
    ?.setAttribute('hidden', 'true');
}
export const orderStatusColors: { [key: string]: string } = {
  created: '1px solid #2196F3', // Azul
  preparing: '1px solid #FFC107', // Amarillo
  delivered: '1px solid #4CAF50', // Verde
  received: '1px solid #8BC34A', // Verde Claro
  canceled: '1px solid #F44336', // Rojo
  rejected: '1px solid #9E9E9E'  // Gris
};
export const orderStatusText: { [key: string]: string } = {
  created: 'Creado', // Azul
  preparing: 'Preparando', // Amarillo
  delivered: 'Enviado', // Verde
  received: 'Recibido', // Verde Claro
  canceled: 'Cancelado', // Rojo
  rejected: 'Rechazado'  // Gris
};

export function isScrollNearEnd(el: ElementRef, threshold: number = 120) {

  // height of whole window page
  const heightOfWholePage = window.document.documentElement.scrollHeight;

  // how big in pixels the element is
  const heightOfElement = el.nativeElement.scrollHeight;

  // currently scrolled Y position
  const currentScrolledY = window.scrollY;

  // height of opened window - shrinks if console is opened
  const innerHeight = window.innerHeight;

  /**
   * the area between the start of the page and when this element is visible
   * in the parent component
   */
  const spaceOfElementAndPage = heightOfWholePage - heightOfElement;

  // calculated whether we are near the end
  const scrollToBottom =
    heightOfElement - innerHeight - currentScrolledY + spaceOfElementAndPage;

  // if the user is near end
  return scrollToBottom < threshold;
}