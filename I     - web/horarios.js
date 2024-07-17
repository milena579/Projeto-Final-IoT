import {service} from "./js/datebaseConfig.js"

const endPoint = "/Cat_feeder"

// Definindo estrutura do corpo do meu objeto do banco.
var body = {
    
}


// Função para atualizar a visibilidade dos dias da semana
function custumized() {
    // Captura o contêiner de dias da semana
    var divs = document.getElementsByClassName("dias_semana");

    // Captura o elemento do botão "Personalizado"
    var custumized = document.getElementById("personalizado");

    // Define o display do contêiner de dias da semana com base no estado do botão "Personalizado"
    for (var i = 0; i < divs.length; i++) {
        divs[i].style.display =  (custumized.checked) ? "block" :"none";
    
    
    }
}



function setMode(modeChecked) {
    var mode = document.getElementById(modeChecked)
    if(mode.checked)
        service.set(endPoint + "/programmed/days", mode.value)
}


const set_custumizes = () => {
    var custumized = document.getElementById("personalizado")
    var checkboxes = document.querySelectorAll('.dias_semana input[type="checkbox"]');
    let checked_itens = [];


    checkboxes.forEach(checkbox => {
        // Verificar se a checkbox está marcada
        if (checkbox.checked) {
            // Se estiver marcada, adicionar o valor ao array de valores selecionados
            checked_itens.push(checkbox.value);
        }
    });
    custumized.value = checked_itens;
    console.log(custumized.value);

}

const content = document.querySelector(".content"),
selectMenu = document.querySelectorAll("select"),
setAlarmBtn = document.querySelector("button");

let isAlarmSet;

for (let i = 23; i >= 0; i--) {
    i = i < 10 ? `0${i}` : i;
    let option = `<option value="${i}">${i}</option>`;
    selectMenu[0].firstElementChild.insertAdjacentHTML("afterend", option);
}

for (let i = 59; i >= 0; i--) {
    i = i < 10 ? `0${i}` : i;
    let option = `<option value="${i}">${i}</option>`;
    selectMenu[1].firstElementChild.insertAdjacentHTML("afterend", option);
}



function setAlarm() {
    if (isAlarmSet) {
        content.classList.remove("disable");
        setAlarmBtn.innerText = "Cancelar Alarme";
        return isAlarmSet = false;
    }

    let time = `${selectMenu[0].value}:${selectMenu[1].value}`;
    if (time.includes("Hora") || time.includes("Minutos")) {
        return alert("Por favor, selecione uma hora e data válida!");
    }
    isAlarmSet = true;
    content.classList.add("disable");
    setAlarmBtn.innerText = "Cancelar Alarme";



    service.set(endPoint + "/programmed/hour", time)
}

setAlarmBtn.addEventListener("click", setAlarm);









// Adiciona um evento onchange para monitorar mudanças na seleção
personalizado.addEventListener("change", custumized);

// Verifica o estado inicial do botão "Personalizado" ao carregar a página
window.addEventListener("load", custumized);




window.dias_semana = custumized;
window.set_mode = set_custumizes;

setInterval(() => {
    if(document.getElementById("personalizado").checked)
        set_custumizes();

    setMode("personalizado");
    setMode("seg_sexta");
    setMode("diariamente");

    
}, 2000);