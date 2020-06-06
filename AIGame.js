function AIGame() {
    document.getElementById("11").innerHTML = '';
    document.getElementById("12").innerHTML = '';
    document.getElementById("13").innerHTML = '';
    document.getElementById("14").innerHTML = '';
    document.getElementById("15").innerHTML = '';
    document.getElementById("16").innerHTML = '';
    document.getElementById("17").innerHTML = '';
    document.getElementById("18").innerHTML = '';
    document.getElementById("19").innerHTML = '';
    a = new Array(9);
    for (let i = 0; i < 9; i++) {
        a[i] = document.getElementById(i+11);
    }
    document.getElementById('gameAI').style.display = 'block';
    document.getElementById('msgGame').style.display = 'block';
    document.getElementById('de').style.display = 'block';
    fig = Math.floor(Math.random() * 2) + 1;
    mesg = document.getElementById('msgGame');
    if(fig == 1) {
        mesg.style.color = 'yellow';
    } else if (fig == 2) {
        mesg.style.color = '#00e600';
        AI();
    }
    mesg.innerHTML = 'ИГРА С БОТОМ';
}

function AI() {
    turn = false;
    krestFig = '<img src="images/krest.png" width="100%" height="100%">';
    nolFig = '<img src="images/nol.png" width="100%" height="100%">';
    while (!turn) {
        let ai = Math.floor(Math.random() * 9);
        console.log(ai);
        if(a[0].innerHTML == '' || a[2].innerHTML == '' || a[6].innerHTML == '' || a[8].innerHTML == '') {
            if(ai == 0 || ai == 2 || ai == 6 || ai == 8) {
                if(a[ai].innerHTML == '') {
                    a[ai].innerHTML = krestFig;
                    turn = true;
                }
            }
        } else {
            if(a[4].innerHTML == '') {
                a[4].innerHTML = krestFig;
                turn = true;
            } else {
                if(a[0].innerHTML == krestFig && a[2].innerHTML == krestFig && a[6].innerHTML == krestFig) {
                    if (a[1].innerHTML == '') {a[1].innerHTML = krestFig;}
                    else if (a[3].innerHTML == '') {a[3].innerHTML = krestFig;}
                    turn = true;
                }
                if(a[0].innerHTML == krestFig && a[2].innerHTML == krestFig && a[8].innerHTML == krestFig) {
                    if (a[1].innerHTML == '') {a[1].innerHTML = krestFig;}
                    else if (a[5].innerHTML == '') {a[5].innerHTML = krestFig;}
                    turn = true;
                }
                if(a[0].innerHTML == krestFig && a[6].innerHTML == krestFig && a[8].innerHTML == krestFig) {
                    if (a[3].innerHTML == '') {a[3].innerHTML = krestFig;}
                    else if (a[7].innerHTML == '') {a[7].innerHTML = krestFig;}
                    turn = true;
                }
                if(a[2].innerHTML == krestFig && a[6].innerHTML == krestFig && a[8].innerHTML == krestFig) {
                    if (a[5].innerHTML == '') {a[5].innerHTML = krestFig;}
                    else if (a[7].innerHTML == '') {a[7].innerHTML = krestFig;}
                    turn = true;
                }
            }
        }
        
    }
}

function closeGameAI() {
    document.getElementById("gameAI").style.display = 'none';
    document.getElementById("msgGame").style.display = 'none';
    document.getElementById("de").style.display = 'none';
}

function clck(id) {
    if(chGame() == 'continue') {
        if(document.getElementById(id).innerHTML == '') {
            if(fig == 1) {
                document.getElementById(id).innerHTML = '<img src="images/krest.png" width=100% height=100% />';
                if(chGame() == 'continue') {
                    turn = false;
                    while(!turn) {
                        let ai = Math.floor(Math.random() * 9) + 11;
                        if(document.getElementById(ai).innerHTML == '') {
                            document.getElementById(ai).innerHTML = '<img src="images/nol.png" width=100% height=100% />';
                            turn = true;
                        }
                    }
                    chGame();
                }
            } else
            if(fig == 2) {
                document.getElementById(id).innerHTML = '<img src="images/nol.png" width=100% height=100% />';
                if(chGame() == 'continue') {
                    turn = false;
                    while(!turn) {
                        let ai = Math.floor(Math.random() * 9) + 11;
                        if(document.getElementById(ai).innerHTML == '') {
                            document.getElementById(ai).innerHTML = '<img src="images/krest.png" width=100% height=100% />';
                            turn = true;
                        }
                    }
                    chGame();
                }
            }
            console.log(document.getElementById(id).innerHTML);
        }
    }
}


function chGame() {
    let krestFig = '<img src="images/krest.png" width="100%" height="100%">';
    let nolFig = '<img src="images/nol.png" width="100%" height="100%">';
    // КРЕСТИК ВЫИГРАЛ
    if (document.getElementById("11").innerHTML == krestFig && document.getElementById("12").innerHTML == krestFig && document.getElementById("13").innerHTML == krestFig) {
        if(fig == 1) {
            mesg.innerHTML = 'ВЫ ПОБЕДИЛИ';
            return 'win';
        } else if (fig == 2) {
            mesg.innerHTML = 'ПОБЕДИЛ СОПЕРНИК';
            return 'lose';
        }
    } else
    if (document.getElementById("14").innerHTML == krestFig && document.getElementById("15").innerHTML == krestFig && document.getElementById("16").innerHTML == krestFig) {
        if(fig == 1) {
            mesg.innerHTML = 'ВЫ ПОБЕДИЛИ';
            return 'win';
        } else if (fig == 2) {
            mesg.innerHTML = 'ПОБЕДИЛ СОПЕРНИК';
            return 'lose';
        }
    } else
    if (document.getElementById("17").innerHTML == krestFig && document.getElementById("18").innerHTML == krestFig && document.getElementById("19").innerHTML == krestFig) {
        if(fig == 1) {
            mesg.innerHTML = 'ВЫ ПОБЕДИЛИ';
            return 'win';
        } else if (fig == 2) {
            mesg.innerHTML = 'ПОБЕДИЛ СОПЕРНИК';
            return 'lose';
        }
    } else
    if (document.getElementById("11").innerHTML == krestFig && document.getElementById("14").innerHTML == krestFig && document.getElementById("17").innerHTML == krestFig) {
        if(fig == 1) {
            mesg.innerHTML = 'ВЫ ПОБЕДИЛИ';
            return 'win';
        } else if (fig == 2) {
            mesg.innerHTML = 'ПОБЕДИЛ СОПЕРНИК';
            return 'lose';
        }
    } else
    if (document.getElementById("12").innerHTML == krestFig && document.getElementById("15").innerHTML == krestFig && document.getElementById("18").innerHTML == krestFig) {
        if(fig == 1) {
            mesg.innerHTML = 'ВЫ ПОБЕДИЛИ';
            return 'win';
        } else if (fig == 2) {
            mesg.innerHTML = 'ПОБЕДИЛ СОПЕРНИК';
            return 'lose';
        }
    } else
    if (document.getElementById("13").innerHTML == krestFig && document.getElementById("16").innerHTML == krestFig && document.getElementById("19").innerHTML == krestFig) {
        if(fig == 1) {
            mesg.innerHTML = 'ВЫ ПОБЕДИЛИ';
            return 'win';
        } else if (fig == 2) {
            mesg.innerHTML = 'ПОБЕДИЛ СОПЕРНИК';
            return 'lose';
        }
    } else
    if (document.getElementById("11").innerHTML == krestFig && document.getElementById("15").innerHTML == krestFig && document.getElementById("19").innerHTML == krestFig) {
        if(fig == 1) {
            mesg.innerHTML = 'ВЫ ПОБЕДИЛИ';
            return 'win';
        } else if (fig == 2) {
            mesg.innerHTML = 'ПОБЕДИЛ СОПЕРНИК';
            return 'lose';
        }
    } else
    if (document.getElementById("13").innerHTML == krestFig && document.getElementById("15").innerHTML == krestFig && document.getElementById("17").innerHTML == krestFig) {
        if(fig == 1) {
            mesg.innerHTML = 'ВЫ ПОБЕДИЛИ';
            return 'win';
        } else if (fig == 2) {
            mesg.innerHTML = 'ПОБЕДИЛ СОПЕРНИК';
            return 'lose';
        }
    } else

    // НОЛИК ВЫИГРАЛ
    if (document.getElementById("11").innerHTML == nolFig && document.getElementById("12").innerHTML == nolFig && document.getElementById("13").innerHTML == nolFig) {
        if(fig == 2) {
            mesg.innerHTML = 'ВЫ ПОБЕДИЛИ';
            return 'win';
        } else if (fig == 1) {
            mesg.innerHTML = 'ВЫ ПРОИГРАЛИ';
            return 'lose';
        }
    } else
    if (document.getElementById("14").innerHTML == nolFig && document.getElementById("15").innerHTML == nolFig && document.getElementById("16").innerHTML == nolFig) {
        if(fig == 2) {
            mesg.innerHTML = 'ВЫ ПОБЕДИЛИ';
            return 'win';
        } else if (fig == 1) {
            mesg.innerHTML = 'ПОБЕДИЛ СОПЕРНИК';
            return 'lose';
        }
    } else
    if (document.getElementById("17").innerHTML == nolFig && document.getElementById("18").innerHTML == nolFig && document.getElementById("19").innerHTML == nolFig) {
        if(fig == 2) {
            mesg.innerHTML = 'ВЫ ПОБЕДИЛИ';
            return 'win';
        } else if (fig == 1) {
            mesg.innerHTML = 'ПОБЕДИЛ СОПЕРНИК';
            return 'lose';
        }
    } else
    if (document.getElementById("11").innerHTML == nolFig && document.getElementById("14").innerHTML == nolFig && document.getElementById("17").innerHTML == nolFig) {
        if(fig == 2) {
            mesg.innerHTML = 'ВЫ ПОБЕДИЛИ';
            return 'win';
        } else if (fig == 1) {
            mesg.innerHTML = 'ПОБЕДИЛ СОПЕРНИК';
            return 'lose';
        }
    } else
    if (document.getElementById("12").innerHTML == nolFig && document.getElementById("15").innerHTML == nolFig && document.getElementById("18").innerHTML == nolFig) {
        if(fig == 2) {
            mesg.innerHTML = 'ВЫ ПОБЕДИЛИ';
            return 'win';
        } else if (fig == 1) {
            mesg.innerHTML = 'ПОБЕДИЛ СОПЕРНИК';
            return 'lose';
        }
    } else
    if (document.getElementById("13").innerHTML == nolFig && document.getElementById("16").innerHTML == nolFig && document.getElementById("19").innerHTML == nolFig) {
        if(fig == 2) {
            mesg.innerHTML = 'ВЫ ПОБЕДИЛИ';
            return 'win';
        } else if (fig == 1) {
            mesg.innerHTML = 'ПОБЕДИЛ СОПЕРНИК';
            return 'lose';
        }
    } else
    if (document.getElementById("11").innerHTML == nolFig && document.getElementById("15").innerHTML == nolFig && document.getElementById("19").innerHTML == nolFig) {
        if(fig == 2) {
            mesg.innerHTML = 'ВЫ ПОБЕДИЛИ';
            return 'win';
        } else if (fig == 1) {
            mesg.innerHTML = 'ПОБЕДИЛ СОПЕРНИК';
            return 'lose';
        }
    } else
    if (document.getElementById("13").innerHTML == nolFig && document.getElementById("15").innerHTML == nolFig && document.getElementById("17").innerHTML == nolFig) {
        if(fig == 2) {
            mesg.innerHTML = 'ВЫ ПОБЕДИЛИ';
            return 'win';
        } else if (fig == 1) {
            mesg.innerHTML = 'ПОБЕДИЛ СОПЕРНИК';
            return 'lose';
        }
    } else
    if (document.getElementById("11").innerHTML != '' && document.getElementById("12").innerHTML != '' && document.getElementById("13").innerHTML != '' && document.getElementById("14").innerHTML != '' && document.getElementById("15").innerHTML != '' && document.getElementById("16").innerHTML != '' && document.getElementById("17").innerHTML != '' && document.getElementById("18").innerHTML != '' && document.getElementById("19").innerHTML != '') {
        mesg.innerHTML = 'НИЧЬЯ';
        return 'draw';
    } else
    return 'continue';
}