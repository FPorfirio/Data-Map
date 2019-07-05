//Calling world-bank Api


 function API_request(url) {       
    return new Promise((resolve, reject) => {
        var req = new XMLHttpRequest;
        req.onload = function(){
            if(this.status == 200){
                resolve(JSON.parse(this.response));
            }
            else{
                reject({
                    status: this.status,
                    statusText: this.statusText
                });
            }
        }
        req.onerror = function() {
            reject({
                status: this.status,
                statusText: this.statusText
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


function handler(data){
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

    const range = (function(){
        let range = document.createElement('input');
        range.type = 'range';
        range.max = Math.max(...Object.keys(dataSet));
        range.min = Math.min(...Object.keys(dataSet));
        range.addEventListener(('change'),callback);
        range.classList.add('show');
        console.log(range.value)
        let currentElement = document.getElementsByClassName(range.value)[0];
        currentElement.classList.toggle('show')

        function callback(e){
          const nextElement = document.getElementsByClassName(this.value)[0];
          nextElement.classList.toggle('show');
          currentElement.classList.toggle('show');
          currentElement = nextElement;
        }
        
        maps.appendChild(range)
    })()
    
    
    
       
}




const submision = (function(){
    const form = document.getElementsByClassName('form')[0]
    const inputs = document.getElementsByClassName('form')[0].children;
    form.addEventListener('submit', formHandler)
    
    function formValidation(year, region, indicator){
        const errorMessage = document.querySelector('.errorBox .errorMessage');
        errorMessage.textContent = "";
        let errorCheck;
        let errorCases = [];

        if(!year){
            errorCases.push('year')
        }
        
        if(!region){
            errorCases.push('region')
        }
        
        if(!indicator){
            errorCases.push('indicator')
        }

        if(errorCases.length > 0){
            errorMessage.textContent = `Please enter ${errorCases.join(', ')}`;
            errorCheck = true;
        }

        return errorCheck;
        
    }

  
    function formHandler(e){
        e.preventDefault();
        let indicatorId = inputs[0].value;
        let year = (function(){
            let yearFrom = inputs[1].value;
            let yearTo = inputs[2].value
            if(yearFrom && !yearTo){
                return yearFrom
            }
            else if(yearFrom && yearTo){
                return `${yearFrom}:${yearTo}`
            }
            else{
                return yearTo
            }
        })()
        let region = inputs[3].value;
       
        if(formValidation(year, region, indicatorId)){
            return 
        }

        let queryStringParams = `https://api.worldbank.org/v2/countries/${region}/indicators/${indicatorId}?date=${year}&format=json&per_page=400`;
        API_request(queryStringParams).then(handler).catch((e)=>(console.log('errpr:',e)));
    }
})()



/*
var prevIndicatorId;
    var prevDate;
    var prevRegion;
if(prevIndicatorId == indicatorId && prevDate == year && region == prevRegion){
            console.log('no new inputs detected');
        }
        prevIndicatorId = indicatorId;
            prevDate = year;
            prevRegion = region;*/

 