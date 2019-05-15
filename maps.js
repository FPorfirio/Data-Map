//Calling world-bank Api


const API_request =  function(url) {       
    return new Promise((resolve, reject) => {
        var req = new XMLHttpRequest;
        req.onload = function(){
            if(req.status == 200){
                resolve(JSON.parse(req.response));
            }
            else{
                reject(req.statusText);
            }
        }
        req.open('GET', url, true);
        req.send();
    })
}




//Loading Google Charts
google.charts.load('current', {
    'packages':['geochart'],
    // Note: you will need to get a mapsApiKey for your project.
    // See: https://developers.google.com/chart/interactive/docs/basic_load_libs#load-settings
    'mapsApiKey': 'AIzaSyC3nKl9HH4SNYVPm0A_bGXj4bt5ItWQtv4'
  });
  
function drawRegionsMap(regions, descriptions) {
  var data = new google.visualization.DataTable();
  data.addColumn('string', 'mitch');
  data.addColumn('number', descriptions);
  data.addRows(regions)
  var options = {'width': 1200, 'height': 1200};

  var chart = new google.visualization.GeoChart(document.getElementById('maps'));

  chart.draw(data, options);
}


var handler = (data) => {
    let countries = [];
    console.log(data)
    const response = data[1]

    const regExp = /[^\n\(\)]+(?=\)\n{0,1})/gi;
    const regExp2 = /^[^\n\(\)]+(\([^\n\(\)]+\))*(?!:)/gi;
    const finalreg1 = /(^[^\n\(\)]+(?:\([^\n\(\)]+\))*(?!:))\s*(\([^\n]+)/i;
    const finalreg = /(^[^\n\(\)]+(?:\([^\n\(\)]+\))*)\s*(\([^\n]+\))|[^\n]+$/i
    const IndicatorMetaData = response[0].indicator.value.match(finalreg);

    console.log(IndicatorMetaData)
    const IndicatorDescription =  IndicatorMetaData[2];
    
    for(var i = 0; i < response.length; i++){
        countries.push([response[i].country.value, Math.round(response[i].value)]);
    }       
    google.charts.setOnLoadCallback(drawRegionsMap(countries, IndicatorDescription));
}




const submision = (function(){

    return new Promise((resolve, reject) =>{
    const form = document.getElementsByClassName('form')[0];
    const inputs = document.getElementsByClassName('form')[0].children;

    form.addEventListener('submit', formHandler)

    function formHandler(e){
        let indicatorId = inputs[0].value
        let date = inputs[1].value;
        let countries = inputs[2].value;
        e.preventDefault()
        let queryStringParams = `https://api.worldbank.org/v2/countries/${countries}/indicators/${indicatorId}?date=${date}&format=json&per_page=400`
        
            
        API_request(queryStringParams).then(handler)
    }

    })

})()



/*let submision;

const form = document.getElementsByClassName('form')[0];
const inputs = document.getElementsByClassName('form')[0].children;

form.addEventListener('submit', formHandler)

function formHandler(e){
    let indicatorId = inputs[0].value
    let date = inputs[1].value;
    let countries = inputs[2].value;
    e.preventDefault()
    let queryStringParams = `http://api.worldbank.org/v2/countries/${countries}/indicators/${indicatorId}?date=${date}&format=json&per_page=400`    
    
    submision = new Promise((resolve, reject) =>{
        resolve(queryStringParams)
    })
}


submision.then(function(data){
    console.log(data, 6)
    return API_request(data);
}).then(handler)*/

 