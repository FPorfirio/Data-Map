//Calling world-bank Api


const API_request =  function(url) {       
    return new Promise((resolve, reject) => {
        var req = new XMLHttpRequest;
        req.onload = function(){
            if(req.status == 200){
                resolve(JSON.parse(req.response));
            }
            else{
                reject({
                    status: req.status,
                    statusText: req.statusText
                });
            }
        }
        req.onerror = function() {
            reject({
                status: this.status,
                statusText: req.statusText
            });
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
  
function drawRegionsMap(regions, descriptions, elementContainer) {
  var data = new google.visualization.DataTable();
  data.addColumn('string', 'mitch');
  data.addColumn('number', descriptions);
  data.addRows(regions)
  var options = {'width': 1200, 'height': 1200};

  var chart = new google.visualization.GeoChart(elementContainer);

  chart.draw(data, options);
}


var handler = (data) => {
    console.log(data)
    const response = data[1]

    const finalreg = /(^[^\n\(\)]+(?:\([^\n\(\)]+\))*)\s*(\([^\n]+\))|[^\n]+$/i
    const IndicatorMetaData = response[0].indicator.value.match(finalreg);

    console.log(IndicatorMetaData)
    const IndicatorDescription =  IndicatorMetaData[2];
    const maps = document.getElementById('maps');

    const dataSet = (function(){
        const dataSet = {    
        }

        for(var i = 0; i < response.length; i++){
            let date = response[i].date;
            if(!dataSet.hasOwnProperty(date)){
                dataSet[date] = [];
            }
            dataSet[date].push([response[i].country.value, Math.round(response[i].value)])
        } 

        return dataSet;
    })()
    
    for(var arr in dataSet){
        let mapContainer = document.createElement('div');
        mapContainer.classList.add(arr)
        maps.appendChild(mapContainer);
        google.charts.setOnLoadCallback(drawRegionsMap(dataSet[arr], IndicatorDescription, mapContainer));
    }
       
}




const submision = (function(){
    const form = document.getElementsByClassName('form')[0]
    const inputs = document.getElementsByClassName('form')[0].children;
    form.addEventListener('submit', formHandler)
    
    function formValidation(year, region, indicator){
        const errorMessage = document.querySelector('.errorBox .errorMessage');
        let errorStr = "Please enter";
        if(!year||!region||!indicator){
            if(!year){
                errorStr += "year";
            }
            if(!region){
                errorStr += "country"
            }
            if(!indicator){
                errorStr += "indicator"
            }
            errorMessage.textContent = errorStr;
            return true
        }
    }

    var prevIndicatorId;
    var prevDate;
    var prevRegion;
    function formHandler(e){
        e.preventDefault();
        let indicatorId = inputs[0].value;
        let year = inputs[1].value;
        let region = inputs[2].value;
        if(prevIndicatorId == indicatorId && prevDate == year && region == prevRegion){
            console.log('no new inputs detected');
        }
        prevIndicatorId = indicatorId;
            prevDate = year;
            prevRegion = region;
        if(formValidation(year, region, indicatorId)){
            return 
        }

        let queryStringParams = `https://api.worldbank.org/v2/countries/${region}/indicators/${indicatorId}?date=${year}&format=json&per_page=400`;
        API_request(queryStringParams).then(handler).catch((e)=>(console.log('errpr:',e)));
    }
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

 