let cart = []; // Inicializa el carrito

// Referencias a los elementos HTML
const productList = document.getElementById('product-list');
const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const cartCount = document.getElementById('cart-count');
const searchBar = document.getElementById('search-bar');

// Categoría a mostrar (puedes cambiar el valor dinámicamente si es necesario)
const categoryContainer = document.querySelector('.category-container');
const categoriaSeleccionada = categoryContainer.id;

let products = []; // Almacenar productos cargados
let categoryProducts = []; // Productos de la categoría seleccionada

// Cargar productos desde el archivo JSON
fetch('./json/productos_index.json')
    .then(response => response.json())
    .then(data => {
        products = data; // Guardar productos cargados

        // Filtrar productos por categoría 
        if (categoriaSeleccionada !== "all") {
            categoryProducts = products.filter(product => product.categoria.includes(categoriaSeleccionada));
        } else {
            categoryProducts = products; // Si es "all" muestra todos los productos
        }
        displayProducts(categoryProducts); // Mostrar productos de la categoria
    })
    .catch(error => console.error('Error al cargar los productos:', error));

// Mostrar productos filtrados o todos los productos
function displayProducts(filteredProducts) {
    productList.innerHTML = ''; // Limpiar el contenedor de productos
    filteredProducts.forEach(product => createProductCard(product)); // Crear tarjetas de productos
}

// Escuchar cambios en la barra de búsqueda
searchBar.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase(); // Convertir entrada a minúsculas
    const filteredProducts = categoryProducts.filter(product =>
        product.nombre.toLowerCase().includes(searchTerm)
    );
    displayProducts(filteredProducts); // Mostrar solo los productos filtrados
});

// Crear tarjetas de productos dinámicamente
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'card';

    card.innerHTML = `
        <img src="${product.imagen}" alt="${product.nombre}">
        <h4>${product.nombre}</h4>
        <p>Precio contado: $${product.contado.toFixed(2)}</p>
    `;

    const addButton = document.createElement('button');
    addButton.textContent = 'Agregar al carrito';
    addButton.onclick = () => addToCart(product);
    card.appendChild(addButton);

    productList.appendChild(card);
}

// Acción de agregar al carrito
function addToCart(product) {
    alert(`Producto agregado al carrito: ${product.nombre}`);
    const existingProduct = cart.find(item => item.id === product.id);

    if (existingProduct) {
        existingProduct.cantidad += 1; // Incrementar la cantidad
    } else {
        cart.push({ ...product, cantidad: 1 }); // Agregar nuevo producto
    }

    updateCart(); // Actualizar carrito
}

// Actualizar carrito
function updateCart() {
    cartItems.innerHTML = '';
    let total = 0;
    let count = 0;

    cart.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${item.nombre} - $${item.contado.toFixed(2)} x ${item.cantidad}`;
        cartItems.appendChild(li);

        total += item.contado * item.cantidad; // Sumar el total
        count += item.cantidad; // Sumar la cantidad de productos
    });

    cartTotal.textContent = total.toFixed(2); // Mostrar total
    cartCount.textContent = count; // Mostrar cantidad de productos en el carrito
}

// Guardar el carrito en sessionStorage y redirigir a checkout.html
document.getElementById('checkout-button').addEventListener('click', () => {
    sessionStorage.setItem('cart', JSON.stringify(cart));
    window.location.href = './pages/checkout.html'; // Redirigir al checkout
});

//Slider de imagenes

const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');
const sliderContainer = document.querySelector('.slider-container');

let currentSlide = 0;
let autoSlideInterval;
let startX = 0;
let isDragging = false;

// Función para mostrar un slide específico
function showSlide(index) {
    // Ajustar el índice para que siempre esté dentro del rango
    currentSlide = (index + slides.length) % slides.length;

    // Mueve el contenedor del slider al slide correspondiente
    const offset = currentSlide * -100; // Usamos el 100vw para el desplazamiento
    sliderContainer.style.transform = `translateX(${offset}vw)`;

    // Actualiza los dots
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentSlide);
    });
}

// Función para avanzar al siguiente slide
function nextSlide() {
    showSlide(currentSlide + 1);
}

// Función para retroceder al slide anterior
function prevSlide() {
    showSlide(currentSlide - 1);
}

// Manejo de los dots
dots.forEach(dot => {
    dot.addEventListener('click', () => {
        currentSlide = parseInt(dot.dataset.index);
        showSlide(currentSlide);
        resetAutoSlide();
    });
});

// Botones de navegación
nextBtn.addEventListener('click', () => {
    nextSlide();
    resetAutoSlide();
});

prevBtn.addEventListener('click', () => {
    prevSlide();
    resetAutoSlide();
});

// Pase automático cada 5 segundos
function startAutoSlide() {
    autoSlideInterval = setInterval(nextSlide, 5000);
}

// Reinicia el pase automático después de una interacción manual
function resetAutoSlide() {
    clearInterval(autoSlideInterval);
    startAutoSlide();
}

// Inicializa el slider
showSlide(currentSlide);
startAutoSlide();
