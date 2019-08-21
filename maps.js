import {isoJson, isoContinents, isoSubContinents} from './country_iso_codes.js'
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
    'mapsApiKey': 'AIzaSyCktte1kQ1EfJT6AJNWC5kfMZJMtcnvowg'
  });
  
function drawRegionsMap(regions, descriptions, elementContainer, options) {
  var data = new google.visualization.DataTable();
  data.addColumn('string', 'mitch');
  data.addColumn('number', descriptions);
  data.addRows(regions)
  var options = {'width': 1200, 'height': 1200, resolution: options.mode};

  var chart = new google.visualization.GeoChart(elementContainer);

  chart.draw(data, options);
}

//arreglar las propiedades del response
function handler(worldBankReq, googleApiOptions){
    const response = worldBankReq;
    console.log(worldBankReq)
    const finalreg = /(^[^\n\(\)]+(?:\([^\n\(\)]+\))*)\s*(\([^\n]+\))|[^\n]+$/i
    const IndicatorMetaData = response[0].indicator.value.match(finalreg);
    const IndicatorDescription =  IndicatorMetaData[2];
    const maps = document.getElementById('maps');

    const dataSet = (function(){
        const dataSet = {    
        }

        if(googleApiOptions.mode == 'countries') {
            for(let i = 0; i < response.length; i++){
                let date = response[i].date;
                if(!dataSet.hasOwnProperty(date)){
                    dataSet[date] = [];
                }
                dataSet[date].push([response[i].country.value, Math.round(response[i].value)])
            } 

            return dataSet;
        }
        else{
            for(let i = 0; i < response.length; i++){
                let date = response[i].date;
                if(!dataSet.hasOwnProperty(date)){
                    dataSet[date] = [];
                }
                let continent = isoContinents.filter(e => e.countriesCode.match(/(.{2})/gi).includes(response[i].country.id))
                let cell = [continent[0].code, response[i].value]       
                const findIndex = dataSet[response[i].date].findIndex(e => e[0] == cell[0]);

                if(findIndex == -1){
                    dataSet[response[i].date].push(cell);
                }
                else{
                    dataSet[response[i].date][findIndex][1] += cell[1]
                }
            } 
            return dataSet;
        }

    })()

    console.log(dataSet)
    for(let arr in dataSet){
        let mapContainer = document.createElement('div');
        mapContainer.classList.add(arr)
        maps.appendChild(mapContainer);
        google.charts.setOnLoadCallback(drawRegionsMap(dataSet[arr], IndicatorDescription, mapContainer, googleApiOptions));
    }

    const range = (function(){
        let range = document.createElement('input');
        range.type = 'range';
        range.max = Math.max(...Object.keys(dataSet));
        range.min = Math.min(...Object.keys(dataSet));
        range.addEventListener(('change'),callback);
        range.classList.add('show');
        let dataList = document.createElement('datalist');
        let tickMarks = Array.from()
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
        let region = (function(){
            let regexp = /(.{2})/gi;
            let regexp2 = /;$/g
            return inputs[3].value.replace(regexp,('$1;')).replace(regexp2,'');
        })()
        
        

        const parameters = {
            mode: inputs[5].value,
            isoCodes: inputs[4].value,
        }
       
        if(formValidation(year, region, indicatorId)){
            return 
        }
        let pages = 1;

        let queryStringParams = `https://api.worldbank.org/v2/countries/${region}/indicators/${indicatorId}?date=${year}&format=json&per_page=400&page=${pages}`;
        

        let queries = (function(){
            function url(page=1){
               return `https://api.worldbank.org/v2/countries/${region}/indicators/${indicatorId}?date=${year}&format=json&per_page=400&page=${page}`
            }

            function* req(){
                let data = yield API_request(url());
                console.log(data)
                let page = data[0].page
                while(page < data[0].pages){
                    page++
                    yield API_request(url(page));
                }
                
            }

            function getRunner(query){
                let generator = query();
                let item = generator.next()

                let promises = [];
                function nextItem(){
                    console.log(item)
                    if(item.done){
                        Promise.all(promises).then(elements => {
                            let reducedElements = elements.reduce((accumulator, currentValue) =>{
                                return accumulator.concat(currentValue[1])
                            },[]) 
                            handler(reducedElements, parameters)
                        })
                        return
                    }
                    item.value.then(data => {
                        promises.push(data)
                        item = generator.next(data)
                        nextItem()
                    })
                    console.log(promises)
                }
                return nextItem();      
            }    

            return getRunner(req)
            console.log(getRunner(req))
        })()
       /* Promise.all(queries).then(elements => {elements.forEach(e => {
            handler(e, parameters)
        })})
         /*let promises = (function(){
            const newPromise = [];
            API_request(queryStringParams).then((data) => {
                let response = data;
                newPromise.push(response)
                while(pages <= response[0].pages){
                    pages++
                    queryStringParams = `https://api.worldbank.org/v2/countries/${region}/indicators/${indicatorId}?date=${year}&format=json&per_page=400&page=${pages}`;
                    console.log(data[0])
                    response = API_request(queryStringParams).then((data) => data);
                   newPromise.push(data);
                    console.log(newPromise)
                }
            });

            return newPromise
        })()
        console.log(promises)
        
        API_request(queryStringParams)
        .then(data => {handler(data, parameters)}).
        catch((e)=>(console.log('errpr:',e)));*/
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

 