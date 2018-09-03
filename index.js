const indicator = document.getElementById('indicator');
const year = document.getElementById('year');

let indicator_val;
let year_val;

const min = 1800;
const max = 2018;

for(let i = min; i < max; i++){
    let option = document.createElement('option');
    option.value = i;
    option.innerText = i;
    year.appendChild(option);
}

for(let i = 1; i < 10; i++){
    let option = document.createElement('option');
    option.value = call.countries[i];
    option.innerText = call.countries[i];
    indicator.appendChild(option);
}