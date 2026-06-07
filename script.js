const URL_SCRIPT ="https://script.google.com/macros/s/AKfycbz-8WIYaHjjOzPU_qDAiPhBty2IT5Xad0UgzWNFtcc5iN8sEc9TCsyDNpkPKEaDQv5_dg/exec";
// Vérification au chargement
function verifierConnexion() {

    if (!navigator.onLine) {

        document.body.innerHTML = `
            <div style="
                text-align:center;
                margin-top:100px;
                font-size:24px;
                color:red;
            ">
                ❌ Connexion Internet obligatoire.<br><br>
                Veuillez vous connecter à Internet puis actualiser la page.
            </div>
        `;

        return false;
    }

    return true;
}

window.onload = verifierConnexion;

document.addEventListener("DOMContentLoaded", function () {

    const lignes = document.querySelectorAll("tbody tr");

    // Fonction de synchronisation
    function synchroniserColonne(indexColonneBleue) {

        let champs = [];

        lignes.forEach(ligne => {

            const cellulesBleues = ligne.querySelectorAll("td.cell-bleu");

            if(cellulesBleues[indexColonneBleue]) {

                champs.push(
                    cellulesBleues[indexColonneBleue].querySelector("input")
                );

            }

        });

        champs.forEach(input => {

            input.addEventListener("input", function () {

                const valeur = this.value;

                champs.forEach(champ => {
                    champ.value = valeur;
                });

            });

        });

    }

    // 0 = secteur
    synchroniserColonne(0);

    // 1 = commune
    synchroniserColonne(1);

    // 2 = conseiller
    synchroniserColonne(2);

    // 3 = école
    synchroniserColonne(3);

    // 4 = milieu
    synchroniserColonne(4);
// 5 = code école
synchroniserColonne(5);
});

document.addEventListener("DOMContentLoaded", function () {

    // Sélectionne tous les champs date
    const champsDate = document.querySelectorAll('input[placeholder="JJ/MM/AAAA"]');

    champsDate.forEach(input => {

        input.setAttribute("maxlength", "10");

        input.addEventListener("input", function () {

            let valeur = this.value.replace(/\D/g, "");

            if (valeur.length > 2) {
                valeur = valeur.substring(0,2) + "/" + valeur.substring(2);
            }

            if (valeur.length > 5) {
                valeur = valeur.substring(0,5) + "/" + valeur.substring(5,9);
            }

            this.value = valeur;

        });

    });

});


document.addEventListener("DOMContentLoaded", function () {

    const lignes = document.querySelectorAll("tbody tr");

    lignes.forEach(ligne => {

        const emploi = ligne.querySelector(".emploi");
        const grade = ligne.querySelector(".grade");

        if (emploi && grade) {

            emploi.addEventListener("change", function () {

                if (this.value === "IA" || this.value === "IAS") {
                    grade.value = "C3";
                }
                else if (this.value === "IO") {
                    grade.value = "B3";
                }
                else {
                    grade.value = "";
                }

            });

        }

    });

});


document.addEventListener("DOMContentLoaded", function () {

    const lignes = document.querySelectorAll("tbody tr");

    lignes.forEach(ligne => {

        // 1ère PRISE DE SERVICE
        const dateService = ligne.querySelectorAll(".champ-date")[0];

        // Champ années de service
        const anneesService = ligne.querySelector(".annees-service");

        if (dateService && anneesService) {

            function calculerAnnees() {

                const valeur = dateService.value.trim();

                // Vérifie format JJ/MM/AAAA
                const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;

                if (!regex.test(valeur)) {
                    anneesService.value = "";
                    return;
                }

                const parties = valeur.split("/");

                const jour = parseInt(parties[0], 10);
                const mois = parseInt(parties[1], 10) - 1;
                const annee = parseInt(parties[2], 10);

                const dateEntree = new Date(annee, mois, jour);

                // Vérifie date valide
                if (
                    dateEntree.getDate() !== jour ||
                    dateEntree.getMonth() !== mois ||
                    dateEntree.getFullYear() !== annee
                ) {
                    anneesService.value = "";
                    return;
                }

                const aujourdHui = new Date();

                let annees =
                    aujourdHui.getFullYear() - dateEntree.getFullYear();

                // Ajustement anniversaire
                const moisActuel = aujourdHui.getMonth();
                const jourActuel = aujourdHui.getDate();

                if (
                    moisActuel < mois ||
                    (moisActuel === mois && jourActuel < jour)
                ) {
                    annees--;
                }

                anneesService.value = annees >= 0 ? annees : 0;
            }

            // Calcul automatique
            dateService.addEventListener("input", calculerAnnees);

            // Calcul au chargement
            calculerAnnees();
        }

    });

});


document.addEventListener("DOMContentLoaded", function () {

    const lignes = document.querySelectorAll("tbody tr");

    lignes.forEach(ligne => {

        const dateService = ligne.querySelectorAll(".champ-date")[0];

        const champAnnees = ligne.querySelector(".annees-service");
        const champClasse = ligne.querySelector(".classe-avancement");
        const champEchelon = ligne.querySelector(".echelon");

        function calculerTout() {

            const valeur = dateService.value.trim();

            const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;

            if (!regex.test(valeur)) {

                champAnnees.value = "";
                champClasse.value = "";
                champEchelon.value = "";
                return;
            }

            const parties = valeur.split("/");

            const jour = parseInt(parties[0], 10);
            const mois = parseInt(parties[1], 10) - 1;
            const annee = parseInt(parties[2], 10);

            const dateEntree = new Date(annee, mois, jour);

            if (
                dateEntree.getDate() !== jour ||
                dateEntree.getMonth() !== mois ||
                dateEntree.getFullYear() !== annee
            ) {

                champAnnees.value = "";
                champClasse.value = "";
                champEchelon.value = "";
                return;
            }

            const aujourdHui = new Date();

            let annees =
                aujourdHui.getFullYear() - dateEntree.getFullYear();

            if (
                aujourdHui.getMonth() < mois ||
                (
                    aujourdHui.getMonth() === mois &&
                    aujourdHui.getDate() < jour
                )
            ) {
                annees--;
            }

            if (annees < 0) annees = 0;

            // =========================
            // ANNEES SERVICE
            // =========================
            champAnnees.value = annees;

            // =========================
            // ECHELON
            // =========================
            let echelon = Math.floor(annees / 2) + 1;

            if (echelon > 12) {
                echelon = 12;
            }

            champEchelon.value = echelon;

            // =========================
            // CLASSE
            // =========================
            let classe = "";

            if (annees < 5) {
                classe = "2ème Classe";
            }
            else if (annees < 10) {
                classe = "1ère Classe";
            }
            else if (annees < 15) {
                classe = "Classe Principale";
            }
            else if (annees < 20) {
                classe = "Classe Exceptionnelle";
            }
            else {
                classe = "Hors Classe";
            }

            champClasse.value = classe;
        }

        dateService.addEventListener("input", calculerTout);

        calculerTout();

    });

});


document.addEventListener("DOMContentLoaded", function () {

    const lignes = document.querySelectorAll("tbody tr");

    lignes.forEach(ligne => {

        // DATE DE NAISSANCE
        const dateNaissance = ligne.querySelectorAll('input[placeholder="JJ/MM/AAAA"]')[0];

        // DATE RETRAITE
const dateRetraite = ligne.querySelector(".date-retraite");
        function calculerRetraite() {

            const valeur = dateNaissance.value.trim();

            const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;

            if (!regex.test(valeur)) {
                dateRetraite.value = "";
                return;
            }

            const parties = valeur.split("/");

            let jour = parseInt(parties[0], 10);
            let mois = parseInt(parties[1], 10);
            let annee = parseInt(parties[2], 10);

            // +60 ans
            annee += 60;

            // Reformate JJ/MM/AAAA
            const jourTxt = String(jour).padStart(2, "0");
            const moisTxt = String(mois).padStart(2, "0");

            dateRetraite.value = jourTxt + "/" + moisTxt + "/" + annee;
        }

        dateNaissance.addEventListener("input", calculerRetraite);

        calculerRetraite();

    });

});


document.addEventListener("DOMContentLoaded", function () {

    const lignes = document.querySelectorAll("tbody tr");

    lignes.forEach(ligne => {

        // DATE DE NAISSANCE = colonne DATE DE NAIS
        const dateNaissance =
            ligne.querySelectorAll('td.cell-blanc input[placeholder="JJ/MM/AAAA"]')[0];

        // DATE RETRAITE
        const dateRetraite = ligne.querySelector(".date-retraite");

        // ANNEES RESTANTES
        const anneesRestantes = ligne.querySelector(".annees-restantes");

        function calculerRetraiteEtReste() {

            const valeur = dateNaissance.value.trim();

            const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;

            if (!regex.test(valeur)) {

                dateRetraite.value = "";
                anneesRestantes.value = "";
                return;
            }

            const parties = valeur.split("/");

            const jour = parseInt(parties[0], 10);
            const mois = parseInt(parties[1], 10);
            const annee = parseInt(parties[2], 10);

            // =========================
            // DATE RETRAITE = +60 ANS
            // =========================

            const anneeRetraite = annee + 60;

            dateRetraite.value =
                String(jour).padStart(2, "0") + "/" +
                String(mois).padStart(2, "0") + "/" +
                anneeRetraite;

            // =========================
            // ANNEES RESTANTES
            // =========================

            const aujourdHui = new Date();

            let reste =
                anneeRetraite - aujourdHui.getFullYear();

            if (reste < 0) {
                reste = 0;
            }

            anneesRestantes.value = reste;
        }

        dateNaissance.addEventListener(
            "input",
            calculerRetraiteEtReste
        );

        calculerRetraiteEtReste();

    });

});


document.addEventListener("DOMContentLoaded", function () {

    const lignes = document.querySelectorAll("tbody tr");

    lignes.forEach(ligne => {

        const effGar = ligne.querySelector(".eff-gar");
        const effFill = ligne.querySelector(".eff-fill");
        const effTi = ligne.querySelector(".eff-ti");

        function calculerTotal() {

            const gar = parseInt(effGar.value) || 0;
            const fill = parseInt(effFill.value) || 0;

            effTi.value = gar + fill;
        }

        effGar.addEventListener("input", calculerTotal);
        effFill.addEventListener("input", calculerTotal);

        calculerTotal();

    });

});


document.addEventListener("DOMContentLoaded", function () {

    const effTiInputs = document.querySelectorAll(".eff-ti");
    const effGiInputs = document.querySelectorAll(".eff-gi");

    function calculerTotalGeneral() {

        let total = 0;

        effTiInputs.forEach(input => {

            total += parseInt(input.value) || 0;

        });

        // Affiche le total dans toutes les cellules EFF GI
        effGiInputs.forEach(input => {

            input.value = total;

        });

    }

    // Surveille toutes les colonnes EFF TI
    effTiInputs.forEach(input => {

        input.addEventListener("input", calculerTotalGeneral);

    });

    // Recalcul automatique toutes les 300 ms
    setInterval(calculerTotalGeneral, 300);

    calculerTotalGeneral();

});
document.querySelectorAll(".contact").forEach(input => {
    input.addEventListener("input", function () {
        // Supprime tout sauf chiffres
        this.value = this.value.replace(/\D/g, "");

        // Limite à 10 chiffres
        if (this.value.length > 10) {
            this.value = this.value.slice(0, 10);
        }
    });

    input.addEventListener("blur", function () {
        if (this.value.length !== 10) {
            alert("Le numéro de contact doit contenir exactement 10 chiffres !");
            this.value = "";
        }
    });
});
document.addEventListener("DOMContentLoaded", function () {

    function calculerTotaux() {

        const rows = document.querySelectorAll("tbody tr");

        rows.forEach(row => {

            const coursEl = row.querySelector(".cours");
            const cours = coursEl ? coursEl.value : "";

            const effTI = parseInt(row.querySelector(".eff-ti")?.value || 0);

            const cp1 = row.querySelector(".cp1");
            const cp2 = row.querySelector(".cp2");
            const ce1 = row.querySelector(".ce1");
            const ce2 = row.querySelector(".ce2");
            const cm1 = row.querySelector(".cm1");
            const cm2 = row.querySelector(".cm2");

            const mps = row.querySelector(".mps");
            const mms = row.querySelector(".mms");
            const mgs = row.querySelector(".mgs");

            // reset
            [cp1, cp2, ce1, ce2, cm1, cm2, mps, mms, mgs].forEach(el => {
                if (el) el.value = "";
            });

            if (!cours) return;

            // PRIMAIRE
            if (["CP1", "CP1A", "CP1B"].includes(cours)) cp1.value = effTI;
            if (["CP2", "CP2A", "CP2B"].includes(cours)) cp2.value = effTI;

            if (["CE1", "CE1A", "CE1B"].includes(cours)) ce1.value = effTI;
            if (["CE2", "CE2A", "CE2B"].includes(cours)) ce2.value = effTI;

            if (["CM1", "CM1A", "CM1B"].includes(cours)) cm1.value = effTI;
            if (["CM2", "CM2A", "CM2B"].includes(cours)) cm2.value = effTI;

            // MATERNELLE
            if (["PS", "PSA", "PSB"].includes(cours)) mps.value = effTI;
            if (["MS", "MSA", "MSB"].includes(cours)) mms.value = effTI;
            if (["GS", "GSA", "GSB"].includes(cours)) mgs.value = effTI;

        });
    }

    // 🔥 ULTRA IMPORTANT : déclenchement immédiat
    document.addEventListener("input", function (e) {
        if (
            e.target.classList.contains("eff-ti") ||
            e.target.classList.contains("cours")
        ) {
            calculerTotaux();
        }
    });

    document.addEventListener("change", function (e) {
        if (
            e.target.classList.contains("eff-ti") ||
            e.target.classList.contains("cours")
        ) {
            calculerTotaux();
        }
    });

    // 🔥 force recalcul initial
    calculerTotaux();
});
document.addEventListener("input", function (e) {
    if (e.target.classList.contains("cours")) {
        calculerNombreCours();
    }
});

function calculerNombreCours() {
    let total = 0;

    // compter tous les cours sélectionnés
    document.querySelectorAll("select.cours").forEach(sel => {
        if (sel.value !== "") total++;
    });

    // afficher dans toutes les cellules "NOMBRE DE COURS"
    document.querySelectorAll("td.nb-cours input").forEach(cell => {
        cell.value = total;
    });
}
// ===============================
// SAUVEGARDE AUTOMATIQUE COMPLETE
// ===============================

let timerSave;

document.addEventListener("input", function () {

    clearTimeout(timerSave);

    timerSave = setTimeout(() => {
        sauvegardeAuto();
    }, 1000);

});

document.addEventListener("change", function () {
    sauvegardeAuto();
});

function sauvegardeAuto() {

    let data = [];

    document.querySelectorAll("tbody tr").forEach(row => {
        const cours = row.querySelector(".cours")?.value || "";

        let ligne = {};

        // TOUS LES INPUTS
        row.querySelectorAll("input").forEach((input, index) => {
            ligne["input_" + index] = input.value;
        });

        // TOUS LES SELECTS
        row.querySelectorAll("select").forEach((select, index) => {
            ligne["select_" + index] = select.value;
        });

        data.push(ligne);

    });

    localStorage.setItem(
        "tableau_drena",
        JSON.stringify(data)
    );

    console.log("Sauvegarde OK");
}

// ===============================
// RESTAURATION AUTOMATIQUE
// ===============================

window.addEventListener("load", function () {

    let data = JSON.parse(
        localStorage.getItem("tableau_drena") || "[]"
    );

    document.querySelectorAll("tbody tr").forEach((row, i) => {

        if (!data[i]) return;

        // RESTAURE INPUTS
        row.querySelectorAll("input").forEach((input, index) => {

            if (data[i]["input_" + index] !== undefined) {
                input.value = data[i]["input_" + index];
            }

        });

        // RESTAURE SELECTS
        row.querySelectorAll("select").forEach((select, index) => {

            if (data[i]["select_" + index] !== undefined) {
                select.value = data[i]["select_" + index];
            }

        });

    });

    console.log("Données restaurées");

});
// =======================================
// MATRICULES AUTORISÉS
// =======================================

const matricules = [
"352067G","269497A","374294F","921950Z","430251G",
"310145D","307998F","344092S","308368F","289287C",
"375990E","390620N","480049C","404147T","806366H",
"298678U","391206H","845071T","342759Y","806393V",
"296160F","344803G","364734D","284255E","257954F",
"426547R","420010U","351675M","496140U","309477N",
"859281H","331044U","425541J","267466G","337446S",
"394619H","362109J","351164D","325899V","289009R",
"317887R","258556R","281128U","271860K","289780N",
"250228U","341324B","272524X","301972E","268758D",
"362184V","267690M","461546T","318968J","285156U",
"888753F","355227G","281783V","412029P","395908D",
"301316C","328234C","447187N","444890Y","486210Y",
"375957G","281785X","294644E","390805D","414198Q",
"428668L","414785L","280840M","802924M","861735Z",
"303030F","457856W","301697B","333722S","344150L",
"446064U","477214W","458651R"
];

// =======================================
// CHARGEMENT PAGE
// =======================================


function verifierMatricule() {

    const loginPage =
        document.getElementById("login-page");

    const tableContainer =
        document.querySelector(".table-container");

    const messageErreur =
        document.getElementById("message-erreur");

    let valeur =
        document.getElementById("matricule")
        .value
        .trim()
        .toUpperCase();

    if (matricules.includes(valeur)) {

        loginPage.style.display = "none";

        tableContainer.style.display = "block";

        messageErreur.innerHTML = "";

    } else {

        messageErreur.innerHTML =
            "MATRICULE INCORRECT";

    }

}

// =======================================
// TOUCHE ENTREE
// =======================================

document.addEventListener("keydown", function(e){

    if(e.key === "Enter") {

        const champ =
            document.getElementById("matricule");

        if(document.activeElement === champ) {

            verifierMatricule();

        }

    }

});


function aInternet() {
    return navigator.onLine;
}
document.addEventListener("DOMContentLoaded", function () {

    const btn = document.getElementById("btn-enregistrer");

    if (btn) {
        btn.addEventListener("click", function () {
            enregistrerEtExporter();
        });
    }

});
function enregistrerEtExporter() {

    let data = [];

    document.querySelectorAll("tbody tr").forEach(row => {

        const inputs  = row.querySelectorAll("input");
        const selects = row.querySelectorAll("select");

        const cours = row.querySelector(".cours")?.value || "";
        if (!cours) return;

        // Debug : affiche tous les inputs dans la console
        inputs.forEach((inp, i) => {
            console.log("input[" + i + "] = " + inp.value);
        });

        const ligne = {
    secteur:          inputs[0]?.value  || "",
    commune:          inputs[1]?.value  || "",
    conseiller:       inputs[2]?.value  || "",
    ecole:            inputs[3]?.value  || "",
    milieu:           inputs[4]?.value  || "",
    code_ecole:       inputs[5]?.value  || "",   // ← NOUVEAU
    numero:           inputs[6]?.value  || "",   // était [5]
    nom:              inputs[7]?.value  || "",   // était [6]
    situation:        selects[0]?.value || "",
    nbre_enfants:     inputs[8]?.value  || "",   // était [7]
    genre:            selects[1]?.value || "",
    matricule:        inputs[9]?.value  || "",   // était [8]
    date_naissance:   inputs[10]?.value || "",   // était [9]
    lieu_naissance:   inputs[11]?.value || "",   // était [10]
    emploi:           selects[2]?.value || "",
    fonction:         selects[3]?.value || "",
    prise_service:    inputs[12]?.value || "",   // était [11]
    date_drena:       inputs[13]?.value || "",   // était [12]
    date_iepp:        inputs[14]?.value || "",   // était [13]
    date_poste:       inputs[15]?.value || "",   // était [14]
    grade:            inputs[16]?.value || "",   // était [15]
    annees_service:   inputs[17]?.value || "",   // était [16]
    classe:           inputs[18]?.value || "",   // était [17]
    echelon:          inputs[19]?.value || "",   // était [18]
    date_retraite:    inputs[20]?.value || "",   // était [19]
    annees_restantes: inputs[21]?.value || "",   // était [20]
    nb_cours:         inputs[22]?.value || "",   // était [21]
    cours:            cours,
    eff_gar:          inputs[23]?.value || "",   // était [22]
    eff_fill:         inputs[24]?.value || "",   // était [23]
    eff_ti:           inputs[25]?.value || "",   // était [24]
    eff_gi:           inputs[26]?.value || "",   // était [25]
    contact:          inputs[27]?.value || "",   // était [26]
    email:            inputs[28]?.value || "",   // était [27]
    mps:              inputs[29]?.value || "",   // était [28]
    mms:              inputs[30]?.value || "",   // était [29]
    mgs:              inputs[31]?.value || "",   // était [30]
    cpu:              inputs[32]?.value || "",   // était [31]
    cpp:              inputs[33]?.value || "",   // était [32]
    cp1:              inputs[34]?.value || "",   // était [33]
    cp2:              inputs[35]?.value || "",   // était [34]
    ce1:              inputs[36]?.value || "",   // était [35]
    ce2:              inputs[37]?.value || "",   // était [36]
    cm1:              inputs[38]?.value || "",   // était [37]
    cm2:              inputs[39]?.value || ""    // était [38]
};

        data.push(ligne);
    });

    const formData = new FormData();
    formData.append("data", JSON.stringify(data));

    fetch(URL_SCRIPT, {
        method: "POST",
        body: formData
    })
   .then(response => response.text())
    .then(result => {
        alert("Données envoyées avec succès !");
        afficherResume();
    })
    .catch(error => {
        alert("Erreur : " + error);
        afficherResume();
    });
}

function afficherResume() {
    const container = document.getElementById("resume-container");
    const table = document.getElementById("tableResume");
    if (container) {
        container.style.cssText = "display:block !important; overflow-x:auto; width:100%;";
    }
    if (table) {
        table.style.cssText = "display:table !important; width:100%; min-width:unset; border-collapse:collapse; font-size:9px; white-space:nowrap;";
    }
}
