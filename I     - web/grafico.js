
const graphic = {}

var days_data_temp

graphic.generateGraphic = (month_days, days_data) => {


    if (JSON.stringify(days_data) === JSON.stringify(days_data_temp))
        return;
    

    var ctx = document.getElementById("grafico_linha").getContext('2d')

    var chartGraph = new Chart(ctx, {
        type: 'line', 
        data: {
            labels: month_days,
            datasets: [{
                label: "Quantidade consumida" ,
                data: days_data,
                bordewWidth: 10,
                borderColor: '#6AB9D2',
                backgroundColor: 'transparent'
            }],
        },
        options: {
            scales:{
                x:{
                    grid:{
                        color: 'white',
                        tickColor:'white'
                    }
                }
            },
            title: {
                display:true,
                fontSize: 25,
                text: "Ração x Dia"
            },

            labels:{
                fontSize: "bold",
                backgroundColor: "white"
            }
        },

    });
    days_data_temp = days_data
}

export {graphic}