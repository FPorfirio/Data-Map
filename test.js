import {isoContinents} from './country_iso_codes.js';

console.log(isoContinents)

var reduced = isoContinents.map( e => e.countriesCode)

var match = reduced[3].match(/.{2}/gi)
console.log(match)
match.forEach(e => {
    let url = `https://api.worldbank.org/v2/countries/${e}/indicators/SP.POP.TOTL?date=1970&format=json&per_page=400`;
    
    API_request(url,e)
       

})

function API_request(url, e) {       
        var req = new XMLHttpRequest;
        req.onload = function(){
            if(this.status == 200){
                console.log(e,(JSON.parse(this.response)));
            }
            else{
               console.log(e, this.status, this.statusText )
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
    }



/*
let continent = isoContinents.filter(e => e.code.includes(googleApiOptions.isoCodes))
            for(let i = 0; i < response.length; i++){
                let date = response[i].date;
                if(!dataSet.hasOwnProperty(date)){
                    dataSet[date] = [];
                }
                let continent = isoContinents.filter(e => e.countriesCode.includes(response[i].country.id))
                console.log(continent)
                let cell = ['',0]
                if(isoContinents[0].countriesCode.indexOf(response[i].country.id) != -1){
                    if(!cell[0]){
                        cell[0] = '009'
                        cell[1] += response[i].value 
                    }
                }
            
                for(let i = 0; i <= dataSet[response[i].date].length; i++){
                    if(!dataSet[response[i].date].some( e => e[0] == cell[0])){
                        dataSet[response[i].date].push(cell);
                        break
                    }
                    if(dataSet[response[i].date][i][0] == cell[0]){
                        dataSet[response[i].date][i][1] += cell[1]
                        break
                    }
                }
            } 

            return dataSet;
*/