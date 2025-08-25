"use strict";
const playersBox = document.getElementById('players');
const countEl = document.getElementById('count');
const out = document.getElementById('out');
function renderPlayers(n) {
    playersBox.innerHTML = '';
    for (let i = 0; i < n; i++) {
        const div = document.createElement('div');
        div.innerHTML = `Joueur ${i + 1} : <input id="p${i}-name" value="J${i + 1}">`;
        playersBox.appendChild(div);
    }
}
document.getElementById('apply').addEventListener('click', () => {
    renderPlayers(parseInt(countEl.value, 10));
});
