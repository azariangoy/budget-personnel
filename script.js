let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

function getMonnaie() {
  return document.getElementById("monnaie").value;
}

function ajouterTransaction() {
  const description = document.getElementById("description").value.trim();
  const montant = parseFloat(document.getElementById("montant").value);
  const categorie = document.getElementById("categorie").value;
  const date = document.getElementById("dateInput").value;

  if (!description || isNaN(montant) || montant <= 0 || !categorie || !date) {
    alert("Veuillez remplir tous les champs correctement.");
    return;
  }

  let type = "depense";
   if (categorie.toLowerCase().includes("salaire") || categorie.toLowerCase().includes("revenu")) {
    type = "revenu";
}

  const transaction = {
    description,
    montant,
    categorie,
    date,
    type,
    monnaie: getMonnaie(),
  };

  transactions.push(transaction);
  localStorage.setItem("transactions", JSON.stringify(transactions));

  afficherTransactions();
  calculerSolde();

  
  document.getElementById("description").value = "";
  document.getElementById("montant").value = "";
  document.getElementById("categorie").value = "loyer";
  document.getElementById("dateInput").value = "";
}

function afficherTransactions() {
  const tbody = document.querySelector("#liste-transactions tbody");
  if (!tbody) {
    console.error("Le tableau est introuvable !");
    return;
  }

  tbody.innerHTML = "";

  transactions.forEach(t => {
    const tr = document.createElement("tr");
    const couleur = getCouleurCategorie(t.categorie);

    tr.innerHTML = `
      <td>${t.date}</td>
      <td style="color: ${couleur}">${t.categorie}</td>
      <td class="${t.type === 'revenu' ? 'revenu' : 'depense'}">
        ${t.type === 'revenu' ? '+' : '-'}${t.montant} ${t.monnaie}
      </td>
      <td>${t.description}</td>
    `;

    tbody.appendChild(tr);
  });
}

function calculerSolde() {
  let totalFC = 0;
  let totalDollar = 0;

  transactions.forEach(t => {
    const montant = t.type === "revenu" ? t.montant : -t.montant;

    if (t.monnaie === "FC") {
      totalFC += montant;
    } else if (t.monnaie === "$") {
      totalDollar += montant;
    }
  });

  document.getElementById("solde-fc").textContent = totalFC.toFixed(2);
  document.getElementById("solde-dollar").textContent = totalDollar.toFixed(2);
}

function getCouleurCategorie(categorie) {
  const couleurs = {
    salaire: "green",
    vente: "green",
    autre: "green",
    loyer: "red",
    courses: "orange",
    transport: "brown",
    santé: "black",
    divertissement: "purple",
  };
  return couleurs[categorie] || "gray";
}

document.addEventListener("DOMContentLoaded", () => {
  afficherTransactions();
  calculerSolde();
});