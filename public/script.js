const textAuxBtn = document.getElementById("text-aux-btn");
const imageAuxBtn = document.getElementById("image-aux-btn");
const textAuxField = document.getElementById("text-aux-field");
const imageAuxField = document.getElementById("image-aux-field");

const banca = document.getElementById("banca");
const instituicao = document.getElementById("instituicao");
const prova = document.getElementById("prova");
const nivel = document.getElementById("nivel");
const disciplina = document.getElementById("disciplina");
const assunto = document.getElementById("assunto");
const pergunta = document.getElementById("pergunta");
const textoAux = document.getElementById("textoAux");
const alternativesSection = document.getElementById("alternatives-section");
const addAlternativeBtn = document.getElementById("add-alternative-btn");
const correctAnswerSelect = document.getElementById("correct-answer");
const viewCorrectAnswer = document.getElementById("view-correct-answer");

const viewTitle = document.getElementById("view-title");
const viewAuxText = document.getElementById("view-aux-text");
const viewPergunta = document.getElementById("view-pergunta");
const viewAlternatives = document.getElementById("view-alternatives");

textAuxBtn.addEventListener("click", () => {
    textAuxField.style.display = textAuxField.style.display === "none" ? "block" : "none";
    updateViewSection();
});

imageAuxBtn.addEventListener("click", () => {
    imageAuxField.style.display = imageAuxField.style.display === "none" ? "block" : "none";
    updateViewSection();
});

function updateCorrectAnswerOptions() {
    correctAnswerSelect.innerHTML = `<option value="">Escolha uma opção</option>`;
    const alternatives = alternativesSection.querySelectorAll(".alternative");
    alternatives.forEach(alternative => {
        const optionLabel = alternative.getAttribute("data-option");
        const option = document.createElement("option");
        option.value = optionLabel;
        option.textContent = optionLabel;
        correctAnswerSelect.appendChild(option);
    });
}
updateCorrectAnswerOptions();

function updateViewSection() {
    viewTitle.textContent = `${disciplina.value} | ${assunto.value} | ${banca.value} | ${instituicao.value} | ${nivel.value}`;
    viewAuxText.textContent = textoAux.value || "";
    viewPergunta.textContent = pergunta.value;

    viewAlternatives.innerHTML = "";
    const alternatives = alternativesSection.querySelectorAll(".alternative");
    alternatives.forEach(alternative => {
        const optionLabel = alternative.getAttribute("data-option");
        const alternativeText = alternative.querySelector(".alternative-input").value || `Opção ${optionLabel}`;

        const alternativeLabel = document.createElement("label");
        alternativeLabel.className = "d-flex align-items-center mb-3";

        const optionCircle = document.createElement("div");
        optionCircle.className = "option-circle";
        const radioInput = document.createElement("input");
        radioInput.className = "form-check-input";
        radioInput.type = "radio";
        radioInput.name = "options";
        radioInput.value = optionLabel;

        const optionItem = document.createElement("span");
        optionItem.className = "q-option-item";
        optionItem.textContent = optionLabel;

        const optionText = document.createElement("span");
        optionText.className = "option-text ms-2";
        optionText.textContent = alternativeText;

        optionCircle.appendChild(radioInput);
        optionCircle.appendChild(optionItem);
        alternativeLabel.appendChild(optionCircle);
        alternativeLabel.appendChild(optionText);

        viewAlternatives.appendChild(alternativeLabel);
    });

    const selectedCorrectAnswer = correctAnswerSelect.value || "Nenhuma selecionada";
    viewCorrectAnswer.textContent = selectedCorrectAnswer;
}

[banca, instituicao, prova, nivel, disciplina, assunto, pergunta, textoAux].forEach(input => {
    input.addEventListener("input", updateViewSection);
});

alternativesSection.querySelectorAll(".alternative-input").forEach(input => {
    input.addEventListener("input", updateViewSection);
});

function addAlternative() {
    const optionLabel = String.fromCharCode(65 + alternativesSection.children.length);

    const alternativeDiv = document.createElement("div");
    alternativeDiv.className = "alternative mb-3";
    alternativeDiv.setAttribute("data-option", optionLabel);

    const labelSpan = document.createElement("span");
    labelSpan.className = "option-label";
    labelSpan.textContent = optionLabel;

    const inputField = document.createElement("input");
    inputField.type = "text";
    inputField.className = "form-control alternative-input";
    inputField.placeholder = `Alternativa ${optionLabel}`;

    inputField.addEventListener("input", updateViewSection);

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "btn btn-danger btn-sm ms-2";
    deleteBtn.textContent = "Excluir";
    deleteBtn.addEventListener("click", () => {
        alternativeDiv.remove();
        updateCorrectAnswerOptions();
        updateViewSection();
    });

    alternativeDiv.appendChild(labelSpan);
    alternativeDiv.appendChild(inputField);
    alternativeDiv.appendChild(deleteBtn);

    alternativesSection.appendChild(alternativeDiv);
    updateCorrectAnswerOptions();
    updateViewSection();
}

document.getElementById("create-question-btn").addEventListener("click", async () => {
    await sendToDatabase();

    textoAux.value = "";
    document.getElementById("imagemAux").value = "";
    pergunta.value = "";
    alternativesSection.querySelectorAll(".alternative-input").forEach(input => {
        input.value = "";
    });
    document.getElementById("explanation").value = "";
    updateViewSection();
});


addAlternativeBtn.addEventListener("click", addAlternative);

correctAnswerSelect.addEventListener("change", updateViewSection);

updateViewSection();

async function sendToDatabase() {
    const dadosPergunta = {
        banca: banca.value,
        instituicao: instituicao.value,
        prova: prova.value,
        nivel: nivel.value,
        disciplina: disciplina.value,
        assunto: assunto.value,
        pergunta: pergunta.value,
        textoAux: textoAux.value,
        imagemAux: imageAuxField ? imageAuxField.value : null, 
        alternatives: Array.from(alternativesSection.querySelectorAll('.alternative')).map(alt => ({
            label: alt.getAttribute("data-option"),
            text: alt.querySelector(".alternative-input").value
        })),
        correctAnswer: correctAnswerSelect.value,
        explanation: document.getElementById("explanation").value
    };

    try {
        const response = await fetch('/api/questions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dadosPergunta)
        });

        if (!response.ok) {
            throw new Error('Erro ao salvar a pergunta');
        }

        const result = await response.json();
        console.log('Pergunta salva com sucesso:', result);
    } catch (error) {
        console.error('Erro ao enviar dados:', error);
    }
}

