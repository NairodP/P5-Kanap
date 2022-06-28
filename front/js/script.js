//............Index Page..............;


let kanapData = [];

const kanapDisplay = async () => {
  fetch(`http://localhost:3000/api/products`)
    .then((response) => response.json())
    .then((kanapData) => {
      document.getElementById("items").innerHTML = kanapData
        .map(
          (kanap) => `<a href="product.html?id=${kanap._id}">
        <article>
          <img src="${kanap.imageUrl}" alt="${kanap.altTxt}">
          <h3 class="${kanap.name}">${kanap.name}</h3>
          <p class="${kanap.description}">${kanap.description}</p>
        </article>
      </a>`
        )
        .join("");
      console.log(kanapData);
    });
};

kanapDisplay();