
// Función para obtener el carrito del localStorage
function getCart() {
  const cart = localStorage.getItem('cart');
  return cart ? JSON.parse(cart) : [];
}

// Función para guardar el carrito en localStorage
function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
}

// Función para agregar producto al carrito (llamada desde productos.html)
function addToCart(nombre, precio) {
  let cart = getCart();
  
  // Buscar si el producto ya existe en el carrito
  const existingProduct = cart.find(item => item.nombre === nombre);
  
  if (existingProduct) {
    // Si existe, aumentar la cantidad
    existingProduct.cantidad++;
  } else {
    // Si no existe, agregarlo con cantidad 1
    cart.push({
      nombre: nombre,
      precio: precio,
      cantidad: 1
    });
  }
  
  // Guardar en localStorage
  saveCart(cart);
  
  // Mostrar mensaje de confirmación
  alert(`${nombre} agregada al carrito`);
}

// Función para cargar y mostrar el carrito (llamada en carritodecompras.html)
function loadCart() {
  const cart = getCart();
  const cartBody = document.getElementById('cart-body');
  const cartTotal = document.getElementById('cart-total');
  
  if (!cartBody) return; // Si no estamos en la página del carrito, salir
  
  // Limpiar el contenido actual
  cartBody.innerHTML = '';
  
  let total = 0;
  
  if (cart.length === 0) {
    cartBody.innerHTML = `
      <tr>
        <td colspan="5" class="text-center py-4">
          <p class="mb-0">El carrito está vacío</p>
          <a href="./productos.html" class="btn btn-danger mt-2">Ver productos</a>
        </td>
      </tr>
    `;
    cartTotal.textContent = '0';
    return;
  }
  
  // Crear filas para cada producto
  cart.forEach((item, index) => {
    const subtotal = item.precio * item.cantidad;
    total += subtotal;
    
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${item.nombre}</td>
      <td>$${item.precio}</td>
      <td>
        <button class="btn btn-sm btn-outline-danger" onclick="decreaseQuantity(${index})">-</button>
        <span class="mx-2">${item.cantidad}</span>
        <button class="btn btn-sm btn-outline-danger" onclick="increaseQuantity(${index})">+</button>
      </td>
      <td>$${subtotal}</td>
      <td>
        <button class="btn btn-sm btn-danger" onclick="removeItem(${index})">Eliminar</button>
      </td>
    `;
    
    cartBody.appendChild(row);
  });
  
  // Actualizar el total
  cartTotal.textContent = total;
}

// Función para aumentar la cantidad de un producto
function increaseQuantity(index) {
  let cart = getCart();
  cart[index].cantidad++;
  saveCart(cart);
  loadCart();
}

// Función para disminuir la cantidad de un producto
function decreaseQuantity(index) {
  let cart = getCart();
  
  if (cart[index].cantidad > 1) {
    cart[index].cantidad--;
  } else {
    // Si la cantidad es 1, eliminar el producto
    cart.splice(index, 1);
  }
  
  saveCart(cart);
  loadCart();
}

// Función para eliminar un producto del carrito
function removeItem(index) {
  let cart = getCart();
  const productName = cart[index].nombre;
  
  if (confirm(`¿Estás seguro de eliminar ${productName} del carrito?`)) {
    cart.splice(index, 1);
    saveCart(cart);
    loadCart();
  }
}

// Función para vaciar todo el carrito
function clearCart() {
  if (confirm('¿Estás seguro de vaciar todo el carrito?')) {
    localStorage.removeItem('cart');
    loadCart();
  }
}

// Cargar el carrito cuando la página esté lista
document.addEventListener('DOMContentLoaded', function() {
  // Si estamos en la página del carrito, cargar los productos
  if (document.getElementById('cart-body')) {
    loadCart();
  }
});