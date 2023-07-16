/** Abrir e fechar cards */

function abrirLoginGer(){
    document.querySelector('.modal-overlay.gerencia').classList.add('active')
}

function fecharLogInG(){
    document.querySelector('.modal-overlay.gerencia').classList.remove('active');
}

function fecharLogInF(){
    document.querySelector('.modal-overlay.funcionario').classList.remove('active');
}

function abrirLoginFunc(){
    document.querySelector('.modal-overlay.funcionario').classList.add('active');
}

function abrirModal() {
    document.querySelector('.modal-overlay.delete').classList.add('active')
}

function fecharModal() {
    document.querySelector('.modal-overlay.delete').classList.remove('active')
}