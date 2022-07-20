//............HOME PAGE.....................

let productsData = [];

//....RECUP INFOS PRODUITS DEPUIS L'API.....
const productDisplay = async () => {
  fetch(`http://localhost:3000/api/products`)
    .then((response) => response.json())
    .then((productsData) => {
      document.getElementById("items").innerHTML = productsData
        .map(
          (product) => `<a href="product.html?id=${product._id}">
        <article>
          <img src="${product.imageUrl}" alt="${product.altTxt}">
          <h3 class="${product.name}">${product.name}</h3>
          <p class="${product.description}">${product.description}</p>
        </article>
      </a>`
        )
        .join("");
      console.log(productsData);
    });
};

productDisplay();
