
'use strict';

// Load product categories
async function loadCategories() {
    const select = document.getElementById('category');

    try {
        const response = await fetch('/api/catalog/categories');

        if (!response.ok) {
            throw new Error('Failed to load categories');
        }

        const result = await response.json();

        result.data.forEach(function(category) {
            const option = document.createElement('option');

            option.value = category.id;
            option.textContent = category.name;

            select.appendChild(option);
        });

    } catch (error) {
        console.log(error);
    }
}

// Load and search products
async function loadProducts() {
    const list = document.getElementById('product-list');
    const search = document.getElementById('search').value;
    const category = document.getElementById('category').value;

    let url = '/api/catalog/products';
    const params = [];

    if (search !== '') {
        params.push('q=' + encodeURIComponent(search));
    }

    if (category !== '') {
        params.push('category_id=' + encodeURIComponent(category));
    }

    if (params.length > 0) {
        url += '?' + params.join('&');
    }

    list.innerHTML = '';

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('Failed to load products');
        }

        const result = await response.json();

        if (result.data.length === 0) {
            list.textContent = 'No products found';
            return;
        }

        result.data.forEach(function(product) {
            const div = document.createElement('div');
            div.className = 'product';

            const name = document.createElement('h3');
            name.textContent = product.name;

            const price = document.createElement('p');
            price.textContent = 'Price: $' + product.price;

            const button = document.createElement('button');
            button.textContent = 'View Details';

            button.addEventListener('click', function() {
                loadProductDetails(product.id);
            });

            div.appendChild(name);
            div.appendChild(price);
            div.appendChild(button);

            list.appendChild(div);
        });

    } catch (error) {
        list.textContent = 'Unable to load products';
        console.log(error);
    }
}

// Display details of a selected product
async function loadProductDetails(id) {
    const details = document.getElementById('product-details');

    details.innerHTML = '';

    try {
        const response = await fetch('/api/catalog/products/' + id);

        if (!response.ok) {
            throw new Error('Product not found');
        }

        const product = await response.json();

        const name = document.createElement('h3');
        name.textContent = product.name;

        const price = document.createElement('p');
        price.textContent = 'Price: $' + product.price;

        const stock = document.createElement('p');
        stock.textContent = 'Stock: ' + product.stock;

        const category = document.createElement('p');
        category.textContent = 'Category ID: ' + product.category_id;

        details.appendChild(name);
        details.appendChild(price);
        details.appendChild(stock);
        details.appendChild(category);

    } catch (error) {
        details.textContent = 'Unable to load product details';
        console.log(error);
    }
}

// Search form event
document.getElementById('search-form').addEventListener('submit', function(event) {
    event.preventDefault();
    loadProducts();
});

// Load data when the page opens
loadCategories();
loadProducts();
