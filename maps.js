import {worldBankFix,fixCountryNames} from "./countryNameFix.js"
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

    //geotopofunction
    let geoS = d3.json('./geojson/europe.json').then(readytopo)

    
    function readytopo(geo){
        let topology = topojson.topology({countries: geo});
        let topoMerge = topojson.merge(topology, topology.objects.countries.geometries)
        console.log(topoMerge)
        svg
        .append('path')
        .datum(topoMerge)
        .attr('d', path)
        .attr('fill', 'none')
        .attr('stroke', 'green')
        .attr('stroke-width', 3)

    }

    let geoJson = d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-10m.json")
    geoJson.then(ready)
    
    function ready(json){
        shapes = json;
        initRange()
        update(shapes, worldBankReq[keys[0]])
    }

    function initRange(){
        let map = d3.select('#maps')
        console.log(worldBankReq)
       /* let rangeU = map.select('input').data([worldBankReq]);

        let rangeEnter = rangeU.enter().append('input')
        .attr('type', 'range')
        .attr('max', function(d){return Math.max(...Object.keys(d))})
        .attr('min', function(d){return Math.min(...Object.keys(d))})
        .on('input', callback)*/


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
        let prueba = topojson.feature(shapes, shapes.objects.countries);
        console.log(data, prueba)

        let FilteredData = [...new Set(data.map(ele => ele[1]))].sort((a,b) => a - b) 
        console.log(FilteredData)
        //Scale domain
        let domain = (function(){
            let FilteredData = [...new Set(data.map(ele => ele[1]))].sort((a,b) => a - b) 

            if(FilteredData.length > 7){
                let domain = ss.ckmeans(FilteredData, 8).map(cluster => cluster[0]);
                domain.pop();
                domain.shift();
                return domain
            }
           
            else{
                return FilteredData
            }
        })()

        //Scale range
        let colorScale = d3.scaleThreshold()
        .domain(domain)
        .range(d3.schemeBlues[7]);

        //Tooltips
        let tip = d3.tip()
        .attr('class', 'd3-tip')
        tip.offset(function(){
            return [this.getBBox().height / 2, 0]
        })
        .html(function(d) {
            return `<strong>${d.properties.name}</strong>
            <span style= color:red> ${d.total} </span>`;
        })
        svg.call(tip)

        //Svg path selection
        let u = d3.select('g.map')
        .selectAll('path')
        .data(topojson.feature(shapes, shapes.objects.countries).features)

        //comparission
        function compare(){
           let dataMap = data.map(e => e[0])
           let shapesMap = prueba.features.map(e => e.properties.name)
           let filter = dataMap.filter(e => shapesMap.indexOf(e) == -1)
           return filter
        }

        console.log(compare())
        
        console.log(prueba)
        u.enter()
        .append('path')
        .merge(u)
        .attr('d', path)
        .attr("fill", function (d) {      
            let statisticData = data.filter(e => d.properties.name == e[0])[0] ? colorScale( data.filter(e => d.properties.name == e[0])[0][1]) : 'grey' 
            d.total = data.filter(e => d.properties.name == e[0])[0] ? data.filter(e => d.properties.name == e[0])[0][1] : null;
            return statisticData;
        })
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide)

        //Legend labels
        let legend_labels = (function(){
            let labels = [];
            if(FilteredData.length <= 7 ){
                for(let i = 0; i < domain.length; i++){
                    labels.push([`${domain[i]}`,
                    d3.schemeBlues[7][i]])
                }
            }
            else{
                for(let i = 0; i < domain.length; i++){
                    for(let a = 0; a < d3.schemeBlues[7].length; a++){
                        if(i == 0 && a == 0){
                            labels.push([`<${domain[i]}`,
                            d3.schemeBlues[7][a]])
                        }
                        else if(i == 0 && a == 1){
                            labels.push([`${domain[i]}+`,
                            d3.schemeBlues[7][a]])
                            break
                        }
                        else if(a > i){
                           labels.push([`+${domain[i]}`,
                           d3.schemeBlues[7][a++]])
                            break
                        }       
                    }        
                }
            }
            return labels;
        })()
        console.log(legend_labels, domain,d3.schemeBlues[7])
        
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
        
        legend.exit().remove()

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

        function fixNumber(number){
            if (d3.format("d")(number).length > 2){
                return d3.format("d")(number)
                console.log("SHeeeeet")
            } else {
                return +d3.format(".1f")(number)
            }
        }
        
        const dataSet = {    
        }

        if(googleApiOptions.mode == 'countries') {
            for(let i = 0; i < response.length; i++){
                let date = response[i].date;
                if(!dataSet.hasOwnProperty(date)){
                    dataSet[date] = [];
                }
                dataSet[date].push([fixCountryNames(response[i].country.value), Number.parseFloat(fixNumber(response[i].value))])
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

    let mapContainers = [];
    vectorChart(dataSet, IndicatorDescription, mapContainers, googleApiOptions)
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



