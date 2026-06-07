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

    synchroniserColonne(0);
    synchroniserColonne(1);
    synchroniserColonne(2);
    synchroniserColonne(3);
    synchroniserColonne(4);
    synchroniserColonne(5);
});

document.addEventListener("DOMContentLoaded", function () {

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
            let annees = aujourdHui.getFullYear() - dateEntree.getFullYear();

            if (
                aujourdHui.getMonth() < mois ||
                (aujourdHui.getMonth() === mois && aujourdHui.getDate() < jour)
            ) {
                annees--;
            }

            if (annees < 0) annees = 0;

            champAnnees.value = annees;

            // =========================
            // CLASSE + ECHELON
            // =========================
            let classe = "";
            let echelon = "";

            if (annees <= 1) {
                classe = "2e classe"; echelon = "1er échelon";
            } else if (annees <= 3) {
                classe = "2e classe"; echelon = "2e échelon";
            } else if (annees <= 5) {
                classe = "2e classe"; echelon = "3e échelon";
            } else if (annees <= 7) {
                classe = "2e classe"; echelon = "4e échelon";
            } else if (annees <= 9) {
                classe = "1re classe"; echelon = "1er échelon";
            } else if (annees <= 11) {
                classe = "1re classe"; echelon = "2e échelon";
            } else if (annees <= 13) {
                classe = "1re classe"; echelon = "3e échelon";
            } else if (annees <= 15) {
                classe = "Classe principale"; echelon = "1er échelon";
            } else if (annees <= 17) {
                classe = "Classe principale"; echelon = "2e échelon";
            } else if (annees <= 19) {
                classe = "Classe principale"; echelon = "3e échelon";
            } else if (annees <= 21) {
                classe = "Classe exceptionnelle"; echelon = "1er échelon";
            } else if (annees <= 23) {
                classe = "Classe exceptionnelle"; echelon = "2e échelon";
            } else {
                classe = "Classe exceptionnelle"; echelon = "3e échelon";
            }

            champClasse.value = classe;
            champEchelon.value = echelon;
        }

        dateService.addEventListener("input", calculerTout);
        calculerTout();

    });

});

document.addEventListener("DOMContentLoaded", function () {

    const lignes = document.querySelectorAll("tbody tr");

    lignes.forEach(ligne => {

        const dateNaissance = ligne.querySelectorAll('td.cell-blanc input[placeholder="JJ/MM/AAAA"]')[0];
        const dateRetraite = ligne.querySelector(".date-retraite");
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
            const anneeRetraite = annee + 60;

            dateRetraite.value =
                String(jour).padStart(2, "0") + "/" +
                String(mois).padStart(2, "0") + "/" +
                anneeRetraite;

            const aujourdHui = new Date();
            let reste = anneeRetraite - aujourdHui.getFullYear();
            if (reste < 0) reste = 0;
            anneesRestantes.value = reste;
        }

        dateNaissance.addEventListener("input", calculerRetraiteEtReste);
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

        effGiInputs.forEach(input => {
            input.value = total;
        });

    }

    effTiInputs.forEach(input => {
        input.addEventListener("input", calculerTotalGeneral);
    });

    setInterval(calculerTotalGeneral, 300);
    calculerTotalGeneral();

});

document.querySelectorAll(".contact").forEach(input => {

    input.addEventListener("input", function () {
        this.value = this.value.replace(/\D/g, "");
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

            const effGar  = parseInt(row.querySelector(".eff-gar")?.value  || 0);
            const effFill = parseInt(row.querySelector(".eff-fill")?.value || 0);
            const effTI   = effGar + effFill;

            const cp1 = row.querySelector(".cp1");
            const cp2 = row.querySelector(".cp2");
            const ce1 = row.querySelector(".ce1");
            const ce2 = row.querySelector(".ce2");
            const cm1 = row.querySelector(".cm1");
            const cm2 = row.querySelector(".cm2");
            const mps = row.querySelector(".mps");
            const mms = row.querySelector(".mms");
            const mgs = row.querySelector(".mgs");

            [cp1, cp2, ce1, ce2, cm1, cm2, mps, mms, mgs].forEach(el => {
                if (el) el.value = "";
            });

            if (!cours) return;

            if (["CP1", "CP1A", "CP1B"].includes(cours)) cp1.value = effTI;
            if (["CP2", "CP2A", "CP2B"].includes(cours)) cp2.value = effTI;
            if (["CE1", "CE1A", "CE1B"].includes(cours)) ce1.value = effTI;
            if (["CE2", "CE2A", "CE2B"].includes(cours)) ce2.value = effTI;
            if (["CM1", "CM1A", "CM1B"].includes(cours)) cm1.value = effTI;
            if (["CM2", "CM2A", "CM2B"].includes(cours)) cm2.value = effTI;
            if (["PS",  "PSA",  "PSB" ].includes(cours)) mps.value = effTI;
            if (["MS",  "MSA",  "MSB" ].includes(cours)) mms.value = effTI;
            if (["GS",  "GSA",  "GSB" ].includes(cours)) mgs.value = effTI;

        });
    }

    document.addEventListener("input", function (e) {
        if (
            e.target.classList.contains("eff-gar")  ||
            e.target.classList.contains("eff-fill") ||
            e.target.classList.contains("eff-ti")   ||
            e.target.classList.contains("cours")
        ) {
            calculerTotaux();
        }
    });

    document.addEventListener("change", function (e) {
        if (
            e.target.classList.contains("eff-gar")  ||
            e.target.classList.contains("eff-fill") ||
            e.target.classList.contains("eff-ti")   ||
            e.target.classList.contains("cours")
        ) {
            calculerTotaux();
        }
    });

    calculerTotaux();
});

document.addEventListener("input", function (e) {
    if (e.target.classList.contains("cours")) {
        calculerNombreCours();
    }
});

function calculerNombreCours() {
    let total = 0;
    document.querySelectorAll("select.cours").forEach(sel => {
        if (sel.value !== "") total++;
    });
    document.querySelectorAll("td.nb-cours input").forEach(cell => {
        cell.value = total;
    });
}

// ===============================
// SAUVEGARDE AUTOMATIQUE
// ===============================

let timerSave;

document.addEventListener("input", function () {
    clearTimeout(timerSave);
    timerSave = setTimeout(() => { sauvegardeAuto(); }, 1000);
});

document.addEventListener("change", function () {
    sauvegardeAuto();
});

function sauvegardeAuto() {

    let data = [];

    document.querySelectorAll("tbody tr").forEach(row => {

        let ligne = {};

        row.querySelectorAll("input").forEach((input, index) => {
            ligne["input_" + index] = input.value;
        });

        row.querySelectorAll("select").forEach((select, index) => {
            ligne["select_" + index] = select.value;
        });

        data.push(ligne);
    });

    localStorage.setItem("tableau_drena_v2", JSON.stringify(data));
    console.log("Sauvegarde OK");
}

// ===============================
// RESTAURATION AUTOMATIQUE
// ===============================

window.addEventListener("load", function () {

    localStorage.removeItem("tableau_drena");

    let data = JSON.parse(localStorage.getItem("tableau_drena_v2") || "[]");

    document.querySelectorAll("tbody tr").forEach((row, i) => {

        if (!data[i]) return;

        row.querySelectorAll("input").forEach((input, index) => {
            if (data[i]["input_" + index] !== undefined) {
                input.value = data[i]["input_" + index];
            }
        });

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

function verifierMatricule() {

    const loginPage = document.getElementById("login-page");
    const tableContainer = document.querySelector(".table-container");
    const messageErreur = document.getElementById("message-erreur");

    let valeur = document.getElementById("matricule").value.trim().toUpperCase();

    if (matricules.includes(valeur)) {
        loginPage.style.display = "none";
        tableContainer.style.display = "block";
        messageErreur.innerHTML = "";
    } else {
        messageErreur.innerHTML = "MATRICULE INCORRECT";
    }

}

document.addEventListener("keydown", function(e){
    if(e.key === "Enter") {
        const champ = document.getElementById("matricule");
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

        const ligne = {
            secteur:          inputs[0]?.value  || "",
            commune:          inputs[1]?.value  || "",
            conseiller:       inputs[2]?.value  || "",
            ecole:            inputs[3]?.value  || "",
            milieu:           inputs[4]?.value  || "",
            code_ecole:       inputs[5]?.value  || "",
            numero:           inputs[6]?.value  || "",
            nom:              inputs[7]?.value  || "",
            situation:        selects[0]?.value || "",
            nbre_enfants:     inputs[8]?.value  || "",
            genre:            selects[1]?.value || "",
            matricule:        inputs[9]?.value  || "",
            date_naissance:   inputs[10]?.value || "",
            lieu_naissance:   inputs[11]?.value || "",
            emploi:           selects[2]?.value || "",
            fonction:         selects[3]?.value || "",
            prise_service:    inputs[12]?.value || "",
            date_drena:       inputs[13]?.value || "",
            date_iepp:        inputs[14]?.value || "",
            date_poste:       inputs[15]?.value || "",
            grade:            inputs[16]?.value || "",
            annees_service:   inputs[17]?.value || "",
            classe:           inputs[18]?.value || "",
            echelon:          inputs[19]?.value || "",
            date_retraite:    inputs[20]?.value || "",
            annees_restantes: inputs[21]?.value || "",
            nb_cours:         inputs[22]?.value || "",
            cours:            cours,
            eff_gar:          inputs[23]?.value || "",
            eff_fill:         inputs[24]?.value || "",
            eff_ti:           inputs[25]?.value || "",
            eff_gi:           inputs[26]?.value || "",
            contact:          inputs[27]?.value || "",
            email:            inputs[28]?.value || "",
            mps:              inputs[29]?.value || "",
            mms:              inputs[30]?.value || "",
            mgs:              inputs[31]?.value || "",
            cpu:              inputs[32]?.value || "",
            cpp:              inputs[33]?.value || "",
            cp1:              inputs[34]?.value || "",
            cp2:              inputs[35]?.value || "",
            ce1:              inputs[36]?.value || "",
            ce2:              inputs[37]?.value || "",
            cm1:              inputs[38]?.value || "",
            cm2:              inputs[39]?.value || ""
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

// =======================================
// BOUTON RÉINITIALISER
// =======================================
document.addEventListener("DOMContentLoaded", function () {
    const btnReinit = document.getElementById("btn-reinitialiser");
    if (btnReinit) {
        btnReinit.addEventListener("click", function () {
            if (confirm("Voulez-vous vraiment effacer toutes les données du formulaire ?")) {
                localStorage.removeItem("tableau_drena_v2");
                location.reload();
            }
        });
    }
});
