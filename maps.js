//Calling world-bank Api
let countries = [];
const form = document.getElementById('form');

form.addEventListener('submit', function(e){
    e.preventDefault();
    indicator_val = indicator.value;
    year_val = year.value;
    console.log(indicator_val, year_val)
})

import {API_call} from './world-bank.js';

//Loading Google Charts
google.charts.load('current', {
    'packages':['geochart'],
    // Note: you will need to get a mapsApiKey for your project.
    // See: https://developers.google.com/chart/interactive/docs/basic_load_libs#load-settings
    'mapsApiKey': 'AIzaSyDlQHFy9yyAHKvOG-s-DB4y1Ifnfe_Ge-w'
  });
  
function drawRegionsMap() {
  var data = new google.visualization.DataTable();
  data.addColumn('string', 'Country');
  data.addColumn('number', 'GDP');
  data.addRows(countries)
  var options = {'width': 1200, 'height': 1200};

  var chart = new google.visualization.GeoChart(document.getElementById('maps'));

  chart.draw(data, options);
}

const promise = API_call.request("asdasd");

var handler = (data) => {
    var response = data[1]
    console.log(response)

    for(var i = 50; i < response.length; i++){
        countries.push([response[i].country.value, Math.round(response[i].value)]);
    }       

    google.charts.setOnLoadCallback(drawRegionsMap);
}

//Callback Drawing map
promise.then(handler);





