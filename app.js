//parte 1
const titulo = document.querySelector('#titulo');
const items = document.querySelectorAll('li');

console.log(titulo.textContent);
items.forEach(li => console.log(li.textContent));

titulo.textContent='¡Hola DOM!';
titulo.classList.add('destacado');
titulo.setAttribute('title','Encabezado');
titulo.dataset.estado = 'activo';
titulo.style.color = 'steelblue';
/*
const lista = document.querySelector('#lista');
const lenguajes =['HTML','CSS','JavaScript'];

for (const nombre of lenguajes){
    const li = document.createElement('li');
    li.textContent= nombre;
    lista.append(li);
}
lista.lastElementChild.remove();
*/
//Parte 2 
const boton = document.querySelector('#saludar');

boton.addEventListener('click', (event)=>{
    console.log(event.type);
    console.log(event.target);
});

document.addEventListener('keydown', (e) =>{
    if (e.key === 'Escape')console.log('Cerrar modal');
});

const lista = document.querySelector('#tareas');

lista.addEventListener('click', (e) => {
  const borrar = e.target.closest('.borrar');
  if (borrar) {
    borrar.closest('li').remove();
    return;
  }
  const texto = e.target.closest('.texto');
  if (texto) texto.closest('li').classList.toggle('hecha');
});

const form1= document.querySelector('#formTarea');
form1.addEventListener('submit', (e) => {
  e.preventDefault();                         // no recargar
  const datos = new FormData(form1);
  const texto = datos.get('tarea').trim();    // leer el input

  if (texto === '') return;                   // ignorar vacío

  
  const li = document.createElement('li');

  const span = document.createElement('span');
  span.className = 'texto';
  span.textContent = texto;                   

  const btn = document.createElement('button');
  btn.className = 'borrar';
  btn.textContent = '✖';

  li.append(span, btn);                       // <li><span/><button/></li>
  lista.appendChild(li);                      // añadir al <ul>

  form.reset();                               // limpiar input
  form.querySelector('input').focus();        // listo para la siguiente
});

//parte 3
//Capa 2: API de validación del navegador
const correo = document.querySelector('#correo');

correo.checkValidity();          // true / false
correo.validity.valueMissing;     // true si required y está vacío
correo.validity.typeMismatch;     // true si no parece un correo
correo.validity.patternMismatch;  // true si no cumple pattern
correo.validity.tooShort;         // true si no llega a minlength

correo.setCustomValidity('Ese correo ya está registrado'); 

//Capa 3: reglas propias, reutilizables
const reglas = {
  nombre: v => v.trim().length >= 3 || 'Escribe al menos 3 caracteres.',
  correo: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Usa un correo como nombre@dominio.com.',
  cedula: v => /^([1-9]|1[0-3]|PE|E|N)-\d{1,4}-\d{1,6}$/.test(v) || 'Formato: 8-123-4567.',
  clave:  v => (v.length >= 8 && /[A-Z]/.test(v) && /\d/.test(v))
               || 'Mínimo 8 caracteres, una mayúscula y un número.',
  clave2: v => v === form.clave.value || 'Las contraseñas no coinciden.',
};

function validarCampo(input) {
  const resultado = reglas[input.name](input.value);
  const valido = resultado === true;
  const error = document.getElementById(`${input.name}-error`);

  input.setAttribute('aria-invalid', String(!valido));
  error.textContent = valido ? '' : resultado;
  return valido;
}
//Cuándo mostrar los errores
const form = document.querySelector('#registro');
const tocados = new Set();

form.addEventListener('blur', (e) => {
  if (!reglas[e.target.name]) return;
  tocados.add(e.target.name);
  validarCampo(e.target);
}, true);   // true = fase de captura (blur no burbujea)

form.addEventListener('input', (e) => {
  if (tocados.has(e.target.name)) validarCampo(e.target);
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const campos = [...form.elements].filter(el => reglas[el.name]);
  const invalidos = campos.filter(el => !validarCampo(el));
  if (invalidos.length) { invalidos[0].focus(); return; }
  mostrarResumen(new FormData(form));
  form.reset();
});
function mostrarResumen(datos) {
    const resumen = document.querySelector('#resumen');
    resumen.textContent = '✅ Enviado:\n' +
      JSON.stringify(Object.fromEntries(datos), null, 2);
  }