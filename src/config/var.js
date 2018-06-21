const expando = 'jQuery' + ('' + Math.random()).replace(/\D/g, '');
export function getExpando() {
  return expando;
}
