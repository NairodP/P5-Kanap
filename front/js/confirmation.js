//...............CONFIRMATION PAGE.....................

// ..........RECUP ID DANS L'URL................
function getConsumerId() {
  idCommande = new URL(location.href).searchParams.get("id");
  return idCommande;
}

targetIdConsumer = document.getElementById("orderId");
console.log(targetIdConsumer);

targetIdConsumer.textContent = idCommande;
//.............................................
