let title=document.querySelector('h1');
let reset_button=document.getElementById('reset_button');
let turn='X';
let o_score=document.getElementById('o_score');
let x_score=document.getElementById('x_score');
let x=0;
let o=0;
get_data();
function get_data() {
    x=Number(localStorage.getItem('X')) || 0;
    o=Number(localStorage.getItem('O')) || 0;
    x_score.innerHTML=x;
    o_score.innerHTML=o;
}

function game(id) {
    let element=document.getElementById(id);
    if ((element.innerHTML=='' || element.innerHTML=='.') && turn==='X') {
        element.innerHTML='X';
        turn='O';
        title.innerHTML='Turn:O';
    }
    else if ((element.innerHTML=='' || element.innerHTML=='.') && turn==='O') {
        element.innerHTML='O';
        turn='X';
        title.innerHTML='Turn:X';
    }
    winner();
    no_winner();
    save_data();
}
function winner() {
    let squares=[];
    for (let index = 1; index < 10; index++) {
        squares[index]=document.getElementById(`index${index}`).innerHTML;
    }
    if (squares[1]==squares[2] && squares[2]==squares[3] && squares[3]!='') {
        end(1,2,3);
    } else if (squares[4]==squares[5] && squares[5]==squares[6] && squares[6]!='') {
        end(4,5,6);
    }else if (squares[7]==squares[8] && squares[8]==squares[9] && squares[9]!='') {
        end(7,8,9);
    }else if (squares[1]==squares[4] && squares[4]==squares[7] && squares[7]!='') {
        end(1,4,7);
    }else if (squares[2]==squares[5] && squares[5]==squares[8] && squares[8]!='') {
        end(2,5,8);
    }else if (squares[3]==squares[6] && squares[6]==squares[9] && squares[9]!='') {
        end(3,6,9);
    }else if (squares[1]==squares[5] && squares[5]==squares[9] && squares[9]!='') {
        end(1,5,9);
    }else if (squares[3]==squares[5] && squares[5]==squares[7] && squares[7]!='') {
        end(3,5,7);
    }
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
    for (let index = 1; index < 10; index++) {
        document.getElementById(`index${index}`).removeAttribute('onclick');
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
function reset_gameboard() {
    for (let index = 1; index < 10; index++) {
        let element=document.getElementById(`index${index}`);
        element.innerHTML='';
        element.removeAttribute('style'); // Clear any inline styles
        element.setAttribute('onclick','game(this.id)');
    }
    title.innerText='X/O GAME';
    reset_button.setAttribute('onclick','reset_gameboard()');
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
function no_winner() {
    let squares=[];
    for (let index = 1; index < 10; index++) {
        squares[index]=document.getElementById(`index${index}`).innerHTML;
    }
    let i=1;
    for (i = 1; i < 10; i++) {
        if (squares[i]=='' || squares[i]=='.') {
            break;
        }
    }
    if (i==10) {
        title.innerHTML='no winner';
        setTimeout(()=>{
            reset_gameboard();
        },3000)
    }
}
function save_data() {
    localStorage.setItem('O',o);
    localStorage.setItem('X',x);
}
function clear_data() {
    o=0;
    x=0;
    save_data();
    get_data();
}
