let title=document.querySelector('h1');
let reset_button=document.getElementById('reset_button');
let o_score=document.getElementById('o_score');
let x_score=document.getElementById('x_score');
// PC : O
let turn='X';
let x=0;
let o=0;
let board=[
    ['','',''],
    ['','',''],
    ['','','']
];
let game_mode='easy';
get_data();
get_mode();
function get_mode() {
    game_mode=localStorage.getItem('gameMode') || 'easy';
}
function dot_place(id) {
    let element=document.getElementById(id);
    if (element.innerHTML=='') {
        element.innerHTML='.';
    }
}
function remove_dot(id) {
    let element=document.getElementById(id);
    if (element.innerHTML=='.') {
        element.innerHTML='';
    }
}
function reset_gameboard() {
    for (let indexI = 0; indexI < 3; indexI++) {
        for (let indexJ = 0; indexJ < 3; indexJ++) {
            board[indexI][indexJ]='';
            let element=document.getElementById('index'+indexI+indexJ);
            element.innerHTML='';
            element.removeAttribute('style'); // Clear any inline styles
            element.setAttribute('onclick','game(this.id)');
        }
    }
    title.innerText='X/O GAME';
    reset_button.setAttribute('onclick','reset_gameboard()');
}
function get_data() {
    x=Number(localStorage.getItem('PLAYER')) || 0;
    o=Number(localStorage.getItem('AI')) || 0;
    x_score.innerHTML=x;
    o_score.innerHTML=o;
}
function save_data() {
    localStorage.setItem('AI',o);
    localStorage.setItem('PLAYER',x);
}
function clear_data() {
    o=0;
    x=0;
    save_data();
    get_data();
}
function end(id1,id2,id3) {
    document.getElementById('index'+id1).style.backgroundColor='#d3c7a0';
    document.getElementById('index'+id2).style.backgroundColor='#d3c7a0';
    document.getElementById('index'+id3).style.backgroundColor='#d3c7a0';
    let winner = document.getElementById('index' + id1).innerHTML;
    if (winner=='X') {
        x++;
        x_score.innerHTML=x;
    } else {
        o++;
        o_score.innerHTML=o;
    }
    for (let indexI = 1; indexI < 3; indexI++) {
        for (let indexJ = 0; indexJ < 3; indexJ++) {
            document.getElementById(`index${indexI}${indexJ}`).removeAttribute('onclick');
        }
    }
    reset_button.removeAttribute('onclick');
    title.innerHTML=`${winner} winner`;
    let count=0;
    let interval=setInterval(()=>{
        title.innerHTML+='.';
        if (count==3) {
            clearInterval(interval);
            reset_gameboard();
        }
        count++;
    },1000);
}
function check_winner(board,valid) {
    for (let i = 0; i < 3; i++) {
        if (board[i][0]==board[i][1] && board[i][1]==board[i][2] && board[i][0]!='') {
            if (valid) {
                end(String(i)+0,String(i)+1,String(i)+2);
            }
            return board[i][0]=='O' ? 2:-2;
        }
        else if(board[0][i]==board[1][i] && board[1][i]==board[2][i] && board[0][i]!=''){
            if (valid) {
                end(0+String(i),1+String(i),2+String(i));
            }
            return board[0][i]=='O' ? 2:-2;
        }
    }
    if (board[0][0]==board[1][1] && board[1][1]==board[2][2] && board[1][1]!='') {
        if (valid) {
            end('00','11','22');
        }
        return board[0][0]=='O' ? 2:-2;
    }
    if (board[0][2]==board[1][1] && board[1][1]==board[2][0] && board[1][1]!='') {
        if (valid) {
            end('02','11','20');
        }
        return board[1][1]=='O' ? 2:-2;
    }
    let tie=true;
    for ( let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[i][j]=='') {
                tie=false;
            }
        }
    }
    if (tie==true) {
        if (valid) {
            title.innerHTML='no winner';
            reset_button.removeAttribute('onclick');
            setTimeout(()=>{
                reset_gameboard();
            },3000)
        }
        return 0;
    }
    return 1;
}
function minimax(board, isMax) {
    // impossible mode
    let result = check_winner(board,false);
    if (result !== 1) {
        return [null,null,result];
    }
    if (isMax) {
        let bestScore = -Infinity;
        let bestMove=null;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[i][j] === '') {
                    board[i][j] = 'O';
                    let [_,__,score] = minimax(board, false);
                    board[i][j] = '';
                    if (score>bestScore) {
                        bestScore=score;
                        bestMove=[i,j];
                    }
                }
            }
        }
        return [...bestMove,bestScore];
    } else {
        let bestScore = Infinity;
        let bestMove=null;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[i][j] === '') {
                    board[i][j] = 'X';
                    let [_,__,score] = minimax(board, true);
                    board[i][j] = '';
                    if (score<bestScore) {
                        bestScore=score;
                        bestMove=[i,j];
                    }
                }
            }
        }
        return [...bestMove,bestScore];
    }
}
function getRandomInt() {
    return Math.floor(Math.random() * 3); // Génère un nombre entier entre 0 et 2 inclus
}
function medium_mode(board) {
    if (check_winner(board)!=1) {
        return [null,null];
    }
    for (let indexI = 0; indexI < 3; indexI++) {
        for (let indexJ = 0; indexJ < 3; indexJ++) {
            if (board[indexI][indexJ]=='') {
                board[indexI][indexJ]='O';
                if (check_winner(board,false)==2) {
                    board[indexI][indexJ]='';
                    return [indexI,indexJ];
                }
                board[indexI][indexJ]='X';
                if (check_winner(board,false)==-2) {
                    board[indexI][indexJ]='';
                    return [indexI,indexJ];
                }
                board[indexI][indexJ]='';
            }
        }
    }
    let indexI=1;
    let indexJ=1;
    while (board[indexI][indexJ]!='') {
        indexI=getRandomInt();
        indexJ=getRandomInt();
    }
    return [indexI,indexJ];
}
function easy_mode(board) {
    if (check_winner(board)!=1) {
        return [null,null];
    }
    let indexI=1;
    let indexJ=1;
    while (board[indexI][indexJ]!='') {
        indexI=getRandomInt();
        indexJ=getRandomInt();
    }
    return [indexI,indexJ];
}
function mode(board) {
    if (game_mode=='hard') {
        return minimax(board,true);
    }
    else if (game_mode=='medium') {
        return medium_mode(board);
    }
    else return easy_mode(board);
}
function game(id) {
    let element=document.getElementById(id);
    if ((element.innerHTML=='' || element.innerHTML=='.') && turn==='X') {
        element.innerHTML='X';
        let i=Number(id[5]);
        let j=Number(id[6]);
        board[i][j]='X';
        check_winner(board,true);
        turn='O';
        let bestMove=mode(board);
        if (bestMove[0]!=null && check_winner(board,false)==1) {
            document.getElementById('index'+bestMove[0]+bestMove[1]).innerHTML='O';
            board[bestMove[0]][bestMove[1]]='O';
        }
        turn='X';
    }
    check_winner(board,true);
    save_data();
}
