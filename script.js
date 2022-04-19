const
    buttonsElement = document.querySelectorAll(".fa-solid"),
    [up, left, right, down] = [...buttonsElement],
    buttons = [[up, 38], [left, 37], [right, 39], [down, 40]];
areaDoJogo = document.querySelector("#areaDoJogo"),
    contexto = areaDoJogo.getContext("2d"),
    resetButton = document.querySelector(".reset"),
    playPauseButton = document.querySelector(".play-pause");

function desenharCenario() {
    contexto.fillStyle = "black";
    contexto.strokeStyle = "#000";
    contexto.fillRect(0, 0, areaDoJogo.width, areaDoJogo.height);
    contexto.strokeRect(0, 0, areaDoJogo.width, areaDoJogo.height);
}
desenharCenario();

const cobra = [{ x: 100, y: 100 }, { x: 80, y: 100 }, { x: 60, y: 100 }, { x: 40, y: 100 }, { x: 20, y: 100 }];

function desenharParteDaCobra(parte) {
    contexto.fillStyle = "lightgreen";
    contexto.lineWidth = 1;
    contexto.strokeStyle = "darkgreen";

    contexto.fillRect(parte.x, parte.y, 20, 20);
    contexto.strokeRect(parte.x, parte.y, 20, 20);

}

function desenharCobrinha() {
    cobra.forEach(element => {
        desenharParteDaCobra(element);
    });
}

desenharCobrinha();

let direcaoX = 20,
    direcaoY = 0,
    comidaX = 0,
    comidaY = 0,
    mudouDeDirecao = false,
    pause = true,
    reset = false;


function moverCobra() {
    const cabeca = { x: cobra[0].x + direcaoX, y: cobra[0].y + direcaoY };
    cobra.unshift(cabeca);
    if (cobra[0].x == comidaX && cobra[0].y == comidaY) {
        gerarComida();
    } else {
        cobra.pop();
    }
}

function changeDirection(code) {
    switch (code) {
        // up
        case 38: if (direcaoY == 0) { direcaoX = 0, direcaoY = -20; } break;
        // down
        case 40: if (direcaoY == 0) { direcaoX = 0, direcaoY = 20; } break;
        // right
        case 39: if (direcaoX == 0) { direcaoX = 20, direcaoY = 0; } break;
        // left
        case 37: if (direcaoX == 0) { direcaoX = -20, direcaoY = 0; } break;
    }
}

playPauseButton.addEventListener("click", () => {
    pause ? (pause = false, playPauseButton.innerText = "PAUSE")
        : (pause = true, playPauseButton.innerText = "PLAY", mudouDeDirecao = true);

});
resetButton.addEventListener("click", () => {
    reset = true;
});
buttons.forEach((array) => {
    array[0].addEventListener("click", () => {
        changeDirection(array[1]);
    });
});

document.body.onkeydown = (event) => {
    if (mudouDeDirecao == true) { return; }
    mudouDeDirecao = true;
    changeDirection(event.keyCode);
};

function resetFunc() {
    direcaoX = 20;
    direcaoY = 0;
    gerarComida();
    reset = false;
    mudouDeDirecao = false;
    let decremento = 20;
    cobra.splice(5, Number.MAX_VALUE);
    cobra.forEach((array, index) => {
        array.x = 100 - (decremento * index);
        array.y = 100;
    });
}

function colisao() {
    const colisaoSuperior = cobra[0].y < 0;
    const colisaoEsquerda = cobra[0].x < 0;
    const colisaoInferior = cobra[0].y == areaDoJogo.height;
    const colisaoDireita = cobra[0].x == areaDoJogo.width;

    for (let i = 1; i < cobra.length; i++) {
        if (cobra[0].x === cobra[i].x && cobra[0].y === cobra[i].y) {
            return true;
        }
    }

    return colisaoSuperior || colisaoDireita || colisaoInferior || colisaoEsquerda;
}

function gerarPosicao(max) {
    return (Math.round(Math.random() * max / 20) * 20);
}

function gerarComida() {
    comidaX = gerarPosicao(areaDoJogo.width - 20);
    comidaY = gerarPosicao(areaDoJogo.height - 20);
    cobra.forEach((parte) => {
        if (parte.x == comidaX && parte.y == comidaY) { gerarComida(); };
    });
}

function desenharComida() {
    contexto.fillStyle = 'red';
    contexto.strokeStyle = "darkred";
    contexto.fillRect(comidaX, comidaY, 20, 20);
    contexto.strokeRect(comidaX, comidaY, 20, 20);
}

gerarComida();

function render() {
    setInterval(() => {
        if (reset == true) { resetFunc(); }
        if (colisao() == true || pause == true) { return; }
        desenharCenario();
        moverCobra();
        mudouDeDirecao = false;
        desenharCobrinha();
        desenharComida();
    }, 200);
}
render();

