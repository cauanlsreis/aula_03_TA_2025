//client.js
const socket = io();
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

//Armazena os jogadores no lado do cliente
let players = {};

//Recebe todos os jogadores ao se conectar
socket.on('currentPlayers', (serverPlayers) => {
    players = serverPlayers;
    render(); //criar a função
});

//Entrada de novo jogador
socket.on('newPlayer', (player) => {
    players[player.id] = player;
    render();
});

//Movimento de jogadores
socket.on('playerMoved', (data) => {
    if(players[data.id]){
        players[data.id].x = data.x;
        players[data.id].y = data.y;
        render()
    }
});

//Saída de jogador
socket.on('playerDisconnected', (id) => {
    delete players[id];
    render();
});

//Teclas de movimentos
document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') socket.emit('move', 'left');
    if (event.key === 'ArrowRight') socket.emit('move', 'right');
    if (event.key === 'ArrowUp') socket.emit('move', 'up');
    if(event.key === 'ArrowDown') socket.emit('move', 'down');
});

//Renderização
function render(){
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.height);
    Object.values(players).forEach((player) => {
        ctx.fillStyle = player.color;
        ctx.fillRect(player.x, player.y, 30, 30);
    });
}