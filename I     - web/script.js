import {service} from "./js/datebaseConfig.js"
import {graphic} from "./grafico.js"

// CÓDIGO ADAPTADO PARA O MEU GOSTO
const endPoint = "/Cat_feeder"

// Definindo estrutura do corpo do meu objeto do banco.
var body = {
    
}
service.set(endPoint+"/filter/filter", "")
// Carregando dados do meu banco
const loadData = () => {
    service.load(endPoint).then( data => {
        body = data;
    })

    const QuantityElement = document.getElementById("nivel_racao");
    const ProgrammedHourElement = document.getElementById("programmed_hour");
    const TimeElement = document.getElementById("hora");
    const DateElement = document.getElementById("data");

    var now = new Date();
    var day = now.getDate();
    var month = now.getMonth() + 1;
    var year = now.getFullYear()
    var hours = now.getHours().toString().padStart(2, '0');
    var minutes = now.getMinutes().toString().padStart(2, '0');


    let quantity = body.updated.quantity;
    let progammed_hour = body.programmed.hour
    let critico = document.getElementById("critico");
    

    QuantityElement.innerHTML = quantity + "%";
    ProgrammedHourElement.innerHTML = progammed_hour;
    TimeElement.innerHTML = hours + ":" + minutes;
    DateElement.innerHTML = day + "/0" + month + "/" + year;

    if(quantity  < 10 ){
       critico.style.display =  "block";
    } else{
        critico.style.display = "none"
    }
}




// Enviar dados para o FireBase
const setData = async () => {
    

    var select   = document.getElementById('meses');
    var filter = '';
    select.onchange = async function() {
        filter = this.value;
        await service.set(endPoint+"/filter/filter", filter)
    }


}


function updateGraphic () {
    // sleep(5000);

    service.load(endPoint).then( data => {
        body = data;
    })
    graphic.generateGraphic(body.filter.days.month_days, body.filter.days.day_data);
}



const status = () => {
    const status = document.getElementById("colocar_racao")
    
    if(body.updated.updated){
        status.innerHTML = 'Colocando'
    }
    else{
        status.innerHTML = 'Colocar ração'
    }
}


function updateButton(){
    service.set(endPoint+"/updated/updated", 1)
}


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


window.updateButton = updateButton

document.getElementById("nivelRacao");

setInterval(() => {
    loadData();
    setData();
    updateGraphic();
    status();
}, 2000);

