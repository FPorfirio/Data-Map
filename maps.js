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

function vectorChart(worldBankReq, googleApiOptions){
    console.log(worldBankReq)
    let shapes;
    let svg = d3.select("svg");
    let width = parseInt(svg.style("width"));
    svg.style('height', window.innerWidth * 0.618 ) 

  

    if(window.innerWidth * 0.618 > window.innerHeight){
        svg.style('height', window.innerHeight ) 

    }else{
        svg.style('height', window.innerWidth * 0.618 ) 
    }
    let height = parseInt(svg.style("height"));

     console.log(typeof width)

    console.log(width, height)
    console.log( "document=" + document.documentElement.clientWidth,document.documentElement.clientHeight, "window="+ window.innerWidth, window.innerHeight)


    /*let colorScale = d3.scaleThreshold()
    .domain([100000, 1000000, 10000000, 30000000, 100000000, 500000000])
    .range(d3.schemeBlues[7]);*/
    let keys = Object.keys(worldBankReq)

    var projection =  d3.geoMercator().fitSize([width,height], {
        type: "Polygon",
        coordinates: [[ 
          [-179.999,84] , 
          [-179.999,-57] , 
          [179.999,-57] , 
          [179.999,84], 
          [-179.999,84] 
         ]]
       })

    var path = d3.geoPath().projection(projection);


    let geoJson = d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson")
    geoJson.then(ready)
    
    function ready(json){
        shapes = json;
        initRange()
        update(shapes, worldBankReq[keys[0]])
    }

    function initRange(){
        let map = d3.select('#maps')
        let range = map.append('input')
        .attr('type', 'range')
        .attr('max', Math.max(...Object.keys(worldBankReq)))
        .attr('min', Math.min(...Object.keys(worldBankReq)))
        .on('input', callback)
   
        function callback(d, i){
          let value = this.value;
          let dataArr = worldBankReq[value];
          console.log(dataArr)
          update(shapes, dataArr)
        }
    }

    function update(shapes, data){
        
        let breakpoints = ss.ckmeans(data.map(ele => ele[1]), 8).map(cluster => cluster[0]);
        let last = breakpoints.pop();
        let first = breakpoints.shift();
        
        let colorsNumber = data.length >= 7 ? 7 : data.length;
        let colorScale = d3.scaleThreshold()
        .domain(breakpoints)
        .range(d3.schemeBlues[colorsNumber]);

        let u = d3.select('g.map')
        .selectAll('path')
        .data(shapes.features)

        u.enter()
        .append('path')
        .merge(u)
        .attr('d', path)
        .attr("fill", function (d) {      
            let statisticData = data.filter(e => d.properties.name == e[0])[0] ? colorScale( data.filter(e => d.properties.name == e[0])[0][1]) : 'grey' 
            return statisticData;
        });

        let legend_labels = (function(){
            let labels = [];
            for(let i = 0; i < breakpoints.length; i++){
                for(let a = 0; a < d3.schemeBlues[7].length; a++){
                    if(i == 0 && a == 0){
                        labels.push([`<${breakpoints[i]}`,
                        d3.schemeBlues[7][a]])
                    }
                    else if(i == 0 && a == 1){
                        labels.push([`${breakpoints[i]}+`,
                        d3.schemeBlues[7][a]])
                        break
                    }
                    else if(a > i){
                       labels.push([`${breakpoints[i]}+`,
                       d3.schemeBlues[7][a++]])
                        break
                    }       
                }        
            }
            return labels;
        })()
        console.log(colorsNumber, legend_labels, breakpoints,d3.schemeBlues[7])
        
        //legend group
        var ls_w = 20, ls_h = 20;
        let legend = svg.selectAll("g.legend")
        .data(legend_labels)
        
        
        let legendEnter = 
        legend.enter()
        .append("g")
        .attr("class", "legend");
        
        let legendMerge = legendEnter.merge(legend)
        .attr('transform', (d,i) => `translate(${50},${height - (i*ls_h) - ls_h - 4})`)
        
        //legend text
        let textLegend = legendMerge.selectAll('text').data(function(d){
            console.log(d)
            return [d[0]]})

        let textLegendEnter = 
        textLegend.enter()
        .append("text");
        var ls_w = 20, ls_h = 20;

        textLegendEnter.merge(textLegend)
        .text(function(d,i){return d})
        .attr('x', 50)
        .attr('y', 0)
        .attr("dominant-baseline", "text-before-edge");


        //legend color
        let colorLegend = legendMerge.selectAll('rect').data(function(d,i){
            return [d[1]]
        })

        let colorLegendEnter = colorLegend.enter()
        .append("rect")

        colorLegend.merge(colorLegendEnter)
        .style("fill", function(d,i){
            return d
        })
        .attr("width", ls_w)
        .attr("height", ls_h)
        .attr('x', 20)
        .attr('y', 0)
        /* var ls_w = 20, ls_h = 20;

        legend.append("rect")
        .attr("x", 20)
        .attr("y", function(d, i){ return height - (i*ls_h) - 2*ls_h;})
        .attr("width", ls_w)
        .attr("height", ls_h)
        .style("fill", function(d, i) { return d[1]; })

        legend.append("text")
        .attr("x", 50)
        .attr("y", function(d, i){ return height - (i*ls_h) - ls_h - 4;})
        .text(function(d, i){ return d[0]; });*/
       
    } 
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
        /*let mapContainer1 = document.createElement('div');
        let mapContainer2 = document.createElement('div');
        mapContainer1.classList.add(arr);
        mapContainer2.classList.add(arr);
        let mapContainers = new Array(mapContainer1,mapContainer2);

        maps.appendChild(mapContainer1);
        maps.appendChild(mapContainer2);*/
        let mapContainers = [];
        vectorChart(dataSet, IndicatorDescription, mapContainers, googleApiOptions)
    

 /*   const range = (function(){
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
        
    })()*/
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
                console.log(page)
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
                    console.log(promises)
                    if(item.done){
                        let reducedElements = promises.reduce((accumulator, currentValue) =>{
                            return accumulator.concat(currentValue[1])
                        },[]) 
                        handler(reducedElements, parameters)
                        return
                    }
                    item.value.then(data => {
                        promises.push(data)
                        item = generator.next(data)
                        nextItem()
                    }).catch(err => {console.log(err)})
                    console.log(promises)
                }
               nextItem();      
            }    

             getRunner(req)
        })()
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

 /*let legend_labels = (function(){
            let labels = [];
            colorScale.range().forEach((e,i) => {
                let labelStr = [];

                if(i == 0 ){
                    labelStr.push(`<${breakpoints[0]}`);
                    labelStr.push(e);
                    labels.push(labelStr)
                }
                if(i == 1){
                    labelStr.push(`${breakpoints[0]}+`);
                    labelStr.push(e);
                    labels.push(labelStr)
                }
                else{
                    labelStr.push(`${breakpoints[i]}+`);
                    labelStr.push(e);
                    labels.push(labelStr)
                }
            })
            return labels
        })()*/