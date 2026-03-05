let fields = [
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null
]

let currentPlayer = "circle";

let gameOver = false;

window.onload = function(){
    render();
    renderPlayerStatus();
}

function render() {
    let container = document.getElementById("content");
    let html = "<table>";

    for (let i = 0; i < 3; i++) {
        html += "<tr>";

        for (let j = 0; j < 3; j++) {

            let index = i * 3 + j;
            let symbol = "";

            if (fields[index] === "circle") {
                symbol = circle();
            }

            if (fields[index] === "cross") {
                symbol = cross();
            }

            html += `<td id="field-${index}" onclick="handleClick(this, ${index})">${symbol}</td>`;
        }

        html += "</tr>";
    }

    html += "</table>";

    container.innerHTML = html;
}

function previewSymbol(index){

    if(fields[index] !== null || gameOver) return "";

    if(currentPlayer === "circle"){
        return `<div class="preview">${circle()}</div>`;
    }else{
        return `<div class="preview">${cross()}</div>`;
    }
}

function circle() {
    const svgCircle = `
    <svg width="80" height="80" viewBox="0 0 100 100">
            <circle 
                cx="50" 
                cy="50" 
                r="40"
                fill="none"
                stroke="#00B0EF"
                stroke-width="15"
                stroke-linecap="round"
                class="circle-animation"
            />
        </svg>
        `;
    return svgCircle;
}

function cross() {
    const svgCross = `
    <svg width="90" height="90" viewBox="0 0 100 100">
        <line 
            x1="20" y1="20" 
            x2="80" y2="80"
            stroke="#FFC000"
            stroke-width="15"
            stroke-linecap="round"
            class="cross-line-1"
        />
        <line 
            x1="80" y1="20" 
            x2="20" y2="80"
            stroke="#FFC000"
            stroke-width="15"
            stroke-linecap="round"
            class="cross-line-2"
        />
    </svg>
    `;
    return svgCross;
}

function handleClick(element, index) {

    if (fields[index] !== null || gameOver) return;

    if (currentPlayer === "circle") {
        fields[index] = "circle";
        element.innerHTML = circle();
        currentPlayer = "cross";
    } else {
        fields[index] = "cross";
        element.innerHTML = cross();
        currentPlayer = "circle";
    }

    element.onclick = null;

    updatePlayerStatus();
    checkWinner();
    checkDraw();
}

function renderPlayerStatus() {
    let playerStatus = document.getElementById("player-status");

    playerStatus.innerHTML = `
        <div id="player-circle" class="player">
            ${circle()}
        </div>
        <div id="player-cross" class="player">
            ${cross()}
        </div>
    `;

    updatePlayerStatus();
}

function updatePlayerStatus() {

    let circlePlayer = document.getElementById("player-circle");
    let crossPlayer = document.getElementById("player-cross");
    let table = document.querySelector("#content table");

    if (!circlePlayer || !crossPlayer || !table) return;

    // Spieleranzeige aktualisieren
    if (currentPlayer === "circle") {
        circlePlayer.classList.remove("inactive");
        crossPlayer.classList.add("inactive");
    } else {
        crossPlayer.classList.remove("inactive");
        circlePlayer.classList.add("inactive");
    }

    // Vorschauklasse aktualisieren
    table.classList.remove("preview-circle", "preview-cross");

    if (currentPlayer === "circle") {
        table.classList.add("preview-circle");
    } else {
        table.classList.add("preview-cross");
    }
}

function checkWinner() {

    const winPatterns = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    for (let pattern of winPatterns) {

        let a = pattern[0];
        let b = pattern[1];
        let c = pattern[2];

        if (fields[a] && fields[a] === fields[b] && fields[a] === fields[c]) {
            gameOver = true;
            drawWinLine(pattern);
            return;
        }
    }
}

function drawWinLine(pattern) {

    const lines = {
        "0,1,2": [250, 10, 250, 290],   // horizontal oben
        "3,4,5": [150, 10, 150, 290], // horizontal mitte
        "6,7,8": [50, 10, 50, 290], // horizontal unten

        "0,3,6": [10, 50, 290, 50],   // vertikal links
        "1,4,7": [10, 150, 290, 150], // vertikal mitte
        "2,5,8": [10, 250, 290, 250], // vertikal rechts

        "0,4,8": [290, 10, 10, 290],  // diagonal ↘
        "2,4,6": [10, 10, 290, 290]   // diagonal ↙
    };

    let key = pattern.join(",");
    let coords = lines[key];

    const svg = `
        <svg class="win-line" viewBox="0 0 300 300">
            <line 
                x1="${coords[0]}"
                y1="${coords[1]}"
                x2="${coords[2]}"
                y2="${coords[3]}"
                stroke="white"
                stroke-width="10"
                stroke-linecap="round"
            />
        </svg>
    `;

    const table = document.querySelector("#content table");
    table.insertAdjacentHTML("beforeend", svg);

    showRestartButton();
}

function showRestartButton(text = "Gewonnen!") {

    const overlay = `
        <div class="restart-overlay">
            <h2 style="color:white">${text}</h2>
            <button onclick="restartGame()" class="restart-btn">
                Neues Spiel
            </button>
        </div>
    `;

    document.getElementById("content").insertAdjacentHTML("beforeend", overlay);
}

function restartGame(){

    fields = Array(9).fill(null);

    currentPlayer = "circle";
    gameOver = false;

    document.querySelector(".restart-overlay")?.remove();

    render();
}

function checkDraw() {

    if (gameOver) return;

    let allFilled = fields.every(field => field !== null);

    if (allFilled) {
        gameOver = true;
        showRestartButton("Unentschieden!");
    }
}