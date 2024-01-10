
//  / __|__ _| |__ _ _(_)___| |/ _|/ _|___ _ _ 
// | (_ / _` | '_ \ '_| / -_) |  _|  _/ -_) '_|
//  \___\__,_|_.__/_| |_\___|_|_| |_| \___|_|  
// github.com/Gabrielffer

const modal              = document.getElementById('modal_confirmacao');
const btsFechamentoModal = document.getElementsByClassName('bt_fechamento');
const enderecos          = document.getElementById('enderecos');
let arrEndersAbrir       = undefined;

for(botao of btsFechamentoModal){
    botao.onclick = function(){
        fecharModal(this.getAttribute('data-id_modal'));
        if(this.id == 'modal_fechar'){
            document.getElementById('lembrar_enderecos').checked = true;
        }
    }
}

function abrirModal(metodo, pergunta){
    document.getElementById('modal_pergunta').innerHTML   = pergunta;
    document.getElementById('fundo_pagina').style.opacity = '0.1';
    modal.style.display  = 'block';
    modal.dataset.funcao = metodo;
}

function fecharModal(){
    modal.style.display = 'none';
    document.getElementById('fundo_pagina').style.opacity = '';
}

function contarUrls(pegarSalvos){
    let enders    = null;
    let ttlEnders = 0;
    if(pegarSalvos == true){
        enders = localStorage.getItem('Enderecos').split('\n');
    }else{
        enders = enderecos.value.split('\n');
    }
    for(let x = 0; x < enders.length; x += 1){
        if(enders[x].trim() != ''){
            ttlEnders++;
        }
    }
    return ttlEnders;
}

function salvar(){
    const conteudo = enderecos.value.trim();
    if(conteudo != ''){
        localStorage.setItem('Enderecos', conteudo);
    }
}

function abrirURLs(){
    let ttl = arrEndersAbrir.length;
    for(let y = 0; y < ttl; y += 1){
        window.open(arrEndersAbrir[y], '_blank');
    }
}




window.addEventListener('load', function(){
    if(localStorage.getItem('Enderecos') != null){
        const ttlUrls = contarUrls(true);
        document.getElementById('res_total_enderecos').innerHTML = ttlUrls;
        if(ttlUrls >= 10){
            enderecos.value = localStorage.getItem('Enderecos');
        }else{
            document.getElementById('bt_abertura').disabled = true;
            const caracteres = localStorage.getItem('Enderecos').split('');
            let cCaracteres  = 0;
            const intervalo  = setInterval(function(){
                if(cCaracteres == caracteres.length - 1){
                    document.getElementById('bt_abertura').disabled = false;
                    clearInterval(intervalo);
                }
                enderecos.value += caracteres[cCaracteres];
                cCaracteres++;
            }, 1);
        }
        document.getElementById('lembrar_enderecos').checked = true;
    }
})

document.getElementById('bt_afirmativo').addEventListener('click', function(){
    if(modal.dataset.funcao == 'remocao'){
        localStorage.removeItem("Enderecos");
    }else if(modal.dataset.funcao == 'abertura'){
        abrirURLs();
    }
    fecharModal();
})

document.getElementById('bt_negativo').addEventListener('click', function(){
    if(modal.dataset.funcao == 'remocao'){
        document.getElementById('lembrar_enderecos').checked = true;
    }
})

document.getElementById('enderecos').addEventListener('input', function(){
    if(this.value != ''){
        this.className                                           = '';
        document.getElementById('bt_abertura').disabled          = false;
        document.getElementById('res_total_enderecos').innerHTML = contarUrls(false);
        if(document.getElementById('lembrar_enderecos').checked == true){
            salvar();
        }
    }
})

document.getElementById('enderecos').addEventListener('blur', function(){
    if(this.value.trim() == ''){
        document.getElementById('res_total_enderecos').innerHTML = 0;
    }
})

document.getElementById('lembrar_enderecos').addEventListener('change', function(){
    if(this.checked == true){
        if(enderecos.value != ''){
            salvar();
        }
    }else{
        const ttlEnders = contarUrls(true);
        if(ttlEnders >= 3){
            abrirModal('remocao', 'Tem certeza que quer esquecer todas as ' + ttlEnders + ' URLs?');
        }else{
            localStorage.removeItem("Enderecos");
        }
    }
})

document.getElementById('bt_copia').addEventListener('click', function(){
    const bt = this;
    if(enderecos.value != ''){
        enderecos.select();
        document.execCommand('Copy');
        bt.disabled              = true;
        bt.innerHTML             = 'Copiado!';
        bt.style.borderColor     = '#9CCC65';
        bt.style.backgroundColor = '#2E7D32';
        setTimeout(function(){
            bt.disabled              = false;
            bt.innerHTML             = 'Copiar';
            bt.style.borderColor     = '';
            bt.style.backgroundColor = '';
        }, 2000);
    }
})

document.getElementById('bt_abertura').addEventListener('click', function(){
    if(enderecos.value.trim() != ''){
        const arrEnders   = enderecos.value.split('\n');
        const nvArrEnders = [];
        for(let x = 0; x < arrEnders.length; x += 1){
            let ender = arrEnders[x].trim();
            if(ender != ''){
                nvArrEnders.push(ender);
            }
        }
        const ttlEnders = nvArrEnders.length;
        arrEndersAbrir  = nvArrEnders;
        if(ttlEnders >= 10){
            abrirModal('abertura', 'Tem certeza que quer abrir todas as ' + ttlEnders + ' URLs?');
        }else{
            abrirURLs();
        }
    }else{
        document.getElementById('enderecos').className  = 'alerta';
        document.getElementById('bt_abertura').disabled = true;
        setTimeout(function(){
            document.getElementById('enderecos').className  = '';
            document.getElementById('bt_abertura').disabled = false;
        }, 2000);
    }
})
