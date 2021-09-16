const table = document.getElementById('table');
const btn = document.getElementById('btn');
const round = document.getElementById('round');
const player1 = document.getElementById('player1');
const player2 = document.getElementById('player2');
const modal = document.getElementById('modal');
const lastWin = document.getElementById('last-win');
const btnOk = document.getElementById('ok');

class Game {
    constructor() {
        this.board = [
            [null, null, null],
            [null, null, null],
            [null, null, null]
        ];
        this.currentPlayer = 'X';
        this.round = 1;
        this.score = { 'X': 0, '0': 0 };
        this.roundResult = '';
    }
    startOver() {
        this.board = [
            [null, null, null],
            [null, null, null],
            [null, null, null]
        ];
    }
    addValueToBoard(x, y) {
        this.board[x][y] = this.currentPlayer;
        this.checkForWinner();
        this.changePlayer();
    }
    changePlayer() {
        this.currentPlayer = this.currentPlayer === 'X' ? '0' : 'X';
    }
    checkDiagonal(isMain) {
        let counter = 0;
        for (let i = 0; i < this.board.length; i++) {
            const current = this.board[i][isMain ? i : this.board.length - i - 1];
            if (current === this.currentPlayer) {
                counter++;
            } else break;
        }
        return counter === this.board.length;
    }
    checkCol() {
        let counter = 0;
        for (let i = 0; i < this.board.length; i++) {
            for (let j = 0; j < this.board.length; j++) {
                if (this.board[i][j] === this.currentPlayer) counter++;
                else break;
            }
            if (counter === this.board.length)return true;
            else counter = 0;
        }
        return false;
    }
    checkRow() {
        let counter = 0;
        for (let i = 0; i < this.board.length; i++) {
            for (let j = 0; j < this.board.length; j++) {
                if (this.board[j][i] === this.currentPlayer) counter++;
                else break;
            }
            if (counter === this.board.length) return true;
            else counter = 0;
        }
        return false;
    }
    checkForDraw() {
        const flatten = this.board.flat().filter(item => item);
        if (flatten.length === this.board.length ** 2) {
            this.roundResult = `Draw`;
            this.round++;
        }
    }
    checkForWinner() {
        const checks = [this.checkCol.bind(this), this.checkRow.bind(this), this.checkDiagonal.bind(this, true), this.checkDiagonal.bind(this, false)];
        let index = 0;
        let check = checks[index];
        let hasWinner = false;
        while (!hasWinner && index < checks.length) {
            const result = check();
            if (result) {
                hasWinner = true;
                this.roundResult = `Winner is ${this.currentPlayer}`;
                this.score[this.currentPlayer]++;
                this.round++;
            }
            else {
                check = checks[++index];
            }
        }
        this.checkForDraw();
    }
}

const game = new Game();
round.innerText = 'Round ' + game.round;

function showModal() {
    modal.style.display = 'flex';
    lastWin.innerText = game.roundResult;
}

function makeMove(e, x, y) {
    const rounds = game.round;
    e.target.innerText = game.currentPlayer;
    game.addValueToBoard(x, y);
    if (rounds != game.round) {
        round.innerText = 'Round ' + game.round;
        player1.innerText = `Player 1 - ${game.score['X']}`;
        player2.innerText = `Player 2 - ${game.score['0']}`;
        table.style.pointerEvents = "none";
        showModal();
    }
}

function createTable() {
    for (let i = 0; i < 3; i++) {
        const tr = document.createElement('tr');
        for (let j = 0; j < 3; j++) {
            const td = document.createElement('td');
            td.addEventListener('click', (e) => makeMove(e, i, j));
            td.setAttribute('class', 'cell');
            td.setAttribute('customspace', `(${i}, ${j})`);
            tr.append(td);
        }
        table.append(tr);
    }
}
createTable();

function startOver() {
    table.style.pointerEvents = "auto";
    const cell = document.getElementsByClassName('cell');
    for (const key in cell) {
        cell[key].innerHTML = '';
    }
    game.startOver();
}

btn.addEventListener('click', startOver);

function onSubmit() {
    modal.style.display = 'none';
}

btnOk.addEventListener('click', onSubmit);








