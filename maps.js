import {wrap,fixCountryNames} from "./countryNameFix.js"
import downloadCanvas from "./svgDownload.js"
import debounce from "../lodash-es/debounce.js"


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


function vectorChart(worldBankReq, IndicatorMetaData, googleApiOptions){
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
    /*if(!shapes){
        let geoS = d3.json('./geojson/europe.json').then(readytopo)
    }
    else{
        update(shapes)
    }

    
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
    }*/

    let geoJson = d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json")
    geoJson.then(ready)
    
    function ready(json){
        shapes = json;
        initRange()
        update(shapes, worldBankReq[keys[0]], keys[0])
        var thesource = document.getElementsByClassName('mapInfoDisplay')[0]
        var btn = document.createElement('button');
        btn.addEventListener('click', downloadCanvas(update, shapes, worldBankReq, keys))
        thesource.appendChild(btn)
    }

    function initRange(){
        console.log(worldBankReq)
        let map = d3.select('#maps')
        let rangeU = map.selectAll('input.yearSpan').data([worldBankReq]);
        let rangeEnter = rangeU.enter().append('input')
        

        rangeEnter.merge(rangeU)
        .attr("class", "yearSpan")
        .attr('type', 'range')
        .attr('max', function(d){return Math.max(...Object.keys(d))})
        .attr('min', function(d){return Math.min(...Object.keys(d))})
        .property('value', function(d){return Math.min(...Object.keys(d))})
        .on('input', callback)
        

        function callback(d, i){
          let value = this.value;
          let dataArr = worldBankReq[value];
          console.log(dataArr)
          update(shapes, dataArr, value)
        }
    }

    function update(shapes, data, year){
        let FilteredData = [...new Set(data.map(ele => ele[1]))].sort((a,b) => a - b) 
        //Scale domain
        let domain = (function(){
            if(FilteredData.length > 7){
                let domain = ss.ckmeans(FilteredData, 8).map(cluster => cluster[0]);
                domain.pop();
                domain.shift();
                return domain
            }
           
            else{
                let domain = [...FilteredData]
                domain.shift()
                return domain
            }
        })()

        //Scale range
        let colorScale = d3.scaleThreshold()
        .domain(domain)
        .range(d3.schemeBlues[7]);

        //Tooltips
        let tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset(function(){
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
                for(let i = 0; i < FilteredData.length; i++){
                    labels.push([`${FilteredData[i]}`,
                    colorScale(FilteredData[i])])
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
        
        //legend 
        var ls_w = 20, ls_h = 20;

        //legend container
        let legendContainer = svg.selectAll('g.legendContainer').data([data])
        
        let legendContainerEnter = legendContainer.enter().append('g')
        .classed('legendContainer', true)
        .merge(legendContainer)
        .attr('transform', `translate(50, 400)`)
        .attr('stroke', 'black')
        .attr('stroke-width', 1)

        let containerBorder = legendContainerEnter.selectAll('rect.border').data([legend_labels.length]);

        let containerBorderEnter = containerBorder.enter().append('rect')
        .classed('border', true)
        .merge(containerBorder)
        .attr('height', legend_labels.length * ls_h + 40)
        .attr('width', 200)
        .attr('fill', 'none')
        .attr('stroke', "black")
        .attr('stroke-width', 1 )
        
        //legend metadata
        var txtWrap = d3plus.textWrap().fontFamily('arial').fontSize(17).width(250)(IndicatorMetaData.name)

        let indicatorName = legendContainerEnter.selectAll('text.indicatorName').data(txtWrap.lines);
        
        let indicatorNameEnter = indicatorName.enter().append('text')
        .classed('indicatorName', true)
        .merge(indicatorName)
        .text(d => d)
        .attr('y', (d,i) => i * 17 - (17 * txtWrap.lines.length))

        indicatorName.exit().remove();

        let indicatorYear = legendContainerEnter.selectAll('text.indicatorYear').data([year]);

        let indicatorYearEnter = indicatorYear.enter().append('text')
        .classed('indicatorYear', true)
        .merge(indicatorYear)
        .text(d => d)
        .attr('transform',(d,i) => `translate(${0},${legend_labels.length * ls_h + 40 })`)

                      
        //legend groups
        let legend = legendContainerEnter.selectAll("g.legend")
        .data(legend_labels)
        
        let legendEnter = legend.enter().append("g")
        .attr("class", "legend")
        .merge(legend)
        .attr('transform', (d,i) => `translate(${0},${legend_labels.length * ls_h - (i * ls_h) })`)
        
        legend.exit().remove()

        //legend text
        let textLegend = legendEnter.selectAll('text').data(function(d){
            console.log(d)
            return [d[0]]})

        let textLegendEnter = 
        textLegend.enter()
        .append("text")
        .merge(textLegend)
        .text(function(d,i){return d})
        .attr('x', 50)
        .attr('y', 0)
        .attr("dominant-baseline", "text-before-edge");

        //legend color
        let colorLegend = legendEnter.selectAll('rect').data(function(d,i){
            return [d[1]]
        })

        let colorLegendEnter = colorLegend.enter()
        .append("rect")
        .merge(colorLegend)
        .style("fill", function(d,i){
            return d
        })
        .attr("width", ls_w)
        .attr("height", ls_h)
        .attr('x', 20)
        .attr('y', 0)  
    
        //d3 zoom
        const zoom = d3.zoom()
        .scaleExtent([1, 8])
        .on('zoom', zoomed);

        function zoomed() {
            d3.select('g.map')
            .selectAll('path') // To prevent stroke width from scaling
            .attr('transform', d3.event.transform);
          }
        svg.call(zoom)

        let newSvg = document.getElementById('svg')
        return newSvg

    } 
}

//arreglar las propiedades del response
function handler(worldBankReq, googleApiOptions){
    const response = worldBankReq;
    console.log(worldBankReq)
    const finalreg = /(^[^\n\(\)]+(?:\([^\n\(\)]+\))*)\s*(\([^\n]+\))|[^\n]+$/i
    const IndicatorMetaData = (function(){
        let responseData = response.find(e => e.indicator.value)

        if(responseData){
            return {
                date: responseData.date,
                name: responseData.indicator.value
            }
        }
        else{
            return undefined
        }
    })()
    //response[0].indicator.value.match(finalreg);
    console.log(response[0].indicator.value)
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

    vectorChart(dataSet, IndicatorMetaData, googleApiOptions)
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



