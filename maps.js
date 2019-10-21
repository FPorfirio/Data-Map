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
    const maps = document.getElementById('maps');

    var data = new google.visualization.DataTable();
    data.addColumn('string', 'mitch');
    data.addColumn('number', descriptions);
    data.addRows(regions)
    var options = {'width': 'auto','height': 'auto', resolution: options.mode};
    var chartRegion = new google.visualization.GeoChart(elementContainer[0]);
    chartRegion.draw(data, options);
    /*let options1 = {'width': 'auto','height': 'auto', displayMode: 'text'};
    let chartText = new google.visualization.GeoChart(elementContainer[1]);
    let svgText

    function readyHandler(){
        const text = Array.from(document.querySelectorAll('g[clip-path] text'));
        const svg = document.getElementsByTagName('svg')[0];
        let pt = svg.createSVGPoint();
        let fragment = document.createDocumentFragment();

        function svgPoint(element, x, y) {
            pt.x = x;
            pt.y = y;
            return pt.matrixTransform(element.getScreenCTM().inverse());
        }   
    
        const svgText = text.map(e => {
            e.style.fill = 'black';
            e.style.fontSize = '25'
            let parent = e.parentElement;
            parent.remove()
            let clone = parent.cloneNode(true)
            
            clone.setAttributeNS(null, 'cx', svgPoint(parent,10,10).x);
            clone.setAttributeNS(null, 'cy',  svgPoint(parent,10,10).y);
            clone.setAttributeNS(null, 'r', 10);

            return clone;
        })
        console.log(svgText,fragment)
        while(elementContainer[1].firstElementChild){
            elementContainer[1].removeChild(elementContainer[1].firstChild);
        }

        svgText.forEach(e => {
            fragment.appendChild(e);
        })

        function regionHandler(){
            let regionSVG = document.getElementsByTagName('svg')[0];
        console.log(regionSVG)
        regionSVG.appendChild(fragment);
        }
        let chartRegion = new google.visualization.GeoChart(elementContainer[0]);
        google.visualization.events.addListener(chartRegion, 'ready', regionHandler);

        chartRegion.draw(data, options);
        

   const textCoords = text.map(ele => [ele.textContent, ele.getBoundingClientRect()])
   console.log(textCoords)
   const ul = document.createElement('ul')
   text.forEach(e => {
      let parent = e.parentElement;
      parent.remove()
      let clone = parent.cloneNode(true)
      
        clone.setAttributeNS(null, 'cx', svgPoint(parent,10,10).x);
        clone.setAttributeNS(null, 'cy',  svgPoint(parent,10,10).y);
        clone.setAttributeNS(null, 'r', 10);
        svg.appendChild(clone);
    })
  }
  google.visualization.events.addListener(chartText, 'ready', readyHandler);
  chartText.draw(data,options1)*/
  var chartRegion = new google.visualization.GeoChart(elementContainer[0]);
  chartRegion.draw(data, options);
  
}

//arreglar las propiedades del response
function handler(worldBankReq, googleApiOptions){
    const response = worldBankReq;
    console.log(worldBankReq)
    const finalreg = /(^[^\n\(\)]+(?:\([^\n\(\)]+\))*)\s*(\([^\n]+\))|[^\n]+$/i
    const IndicatorMetaData = response[0].indicator.value.match(finalreg);
    console.log(response[0].indicator.value)
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
        let mapContainer1 = document.createElement('div');
        let mapContainer2 = document.createElement('div');
        mapContainer1.classList.add(arr);
        mapContainer2.classList.add(arr);
        let mapContainers = new Array(mapContainer1,mapContainer2);

        maps.appendChild(mapContainer1);
        //maps.appendChild(mapContainer2);
        google.charts.setOnLoadCallback(drawRegionsMap(dataSet[arr], IndicatorDescription, mapContainers, googleApiOptions));
        window.addEventListener('resize', e => {drawRegionsMap(dataSet[arr], IndicatorDescription, mapContainers, googleApiOptions)})
    }

    const range = (function(){
        let range = document.getElementById('yearRange');
        range.max = Math.max(...Object.keys(dataSet));
        range.min = Math.min(...Object.keys(dataSet));
        range.addEventListener(('input'),callback);
        range.classList.add('show');

        let dataList = document.getElementById('dataList');

        for(let i = range.min; i <= range.max; i++){
            let option = document.createElement('option');
            option.value = i;
            option.label = i;
            dataList.appendChild(option)
        }
        
       
        console.log(range.value)
        let currentElement = document.getElementsByClassName(range.value)[0];
        currentElement.classList.toggle('show')

        function callback(e){
          const nextElement = document.getElementsByClassName(this.value)[0];
          nextElement.classList.toggle('show');
          currentElement.classList.toggle('show');
          currentElement = nextElement;
        }
        
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
        let parameters = {
            mode: inputs[4].value,
        }
       
        if(formValidation(year, region, indicatorId)){
            return 
        }
        

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
       /*
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

 