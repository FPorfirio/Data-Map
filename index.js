import { indicators } from './world-bank.js'
import {isoJson, isoContinents, isoSubContinents} from './country_iso_codes.js'
console.log(Object.keys(indicators)[0])
const mainClass = document.getElementsByClassName('selectors')[0];
const inputs = document.getElementsByClassName('form')[0].children;





const addIndicators = (function(){
    
    const indicatorsContainer = document.createElement('ul');
    indicatorsContainer.addEventListener('click', indicatorContainerCallback)
    indicators.forEach((group) => {
        const groupLi = document.createElement('li')
        const groupElement = document.createElement('ul')
        const groupName = document.createElement('li');
        groupName.classList.add('title')

        const groupContentLi = document.createElement('li')
        groupContentLi.classList.add('closed')

        const groupContentUl = document.createElement('ul');
        const name = Object.keys(group)[0];
        const groupValues = group[name];
        groupName.textContent = name;

        groupValues.forEach( ele => {
            const subgroupName = document.createElement('li');
            subgroupName.classList.add('title')

            const sugbroupContent = document.createElement('li');
            sugbroupContent.classList.add('closed')

            const subgroupContentUl = document.createElement('ul');
            const name = Object.keys(ele)[0];
            const subgroupValues = ele[name]
            subgroupName.textContent = name;

            subgroupValues.forEach( ele => {
                const indicator = document.createElement('li');
                const indicatorRegexp = /(?<=\()[^\n\(\)]+(?=\)\n{0,1}$)/gi;
                indicator.textContent = ele;
                indicator.dataset.id = ele.match(indicatorRegexp)
                subgroupContentUl.appendChild(indicator);
                indicator.addEventListener('click', indicatorCallback)
            })
            

            sugbroupContent.appendChild(subgroupContentUl);
            groupContentUl.appendChild(subgroupName);
            groupContentUl.appendChild(sugbroupContent);
            groupContentLi.appendChild(groupContentUl);
            groupElement.appendChild(groupName);
            groupElement.appendChild(groupContentLi);
            groupLi.appendChild(groupElement);
        })
        indicatorsContainer.appendChild(groupLi);    
    });

    //Populate input field according to the indicator selected
    function indicatorCallback(event){
        const indicatorId = event.target.dataset.id;
        inputs[0].value =  indicatorId;
    
        const indicatorInfoDisplay = document.querySelector('.mapInfoDisplay .indicatorBox')
        if(indicatorInfoDisplay.firstElementChild){
            indicatorInfoDisplay.firstElementChild.textContent = event.target.textContent;
        }
        else{
            const span = document.createElement('span');
            span.classList.add('indicator')
            span.textContent = event.target.textContent;
            indicatorInfoDisplay.appendChild(span);
        }
    }

    //Control the display of indicators interface lists
    function indicatorContainerCallback(e){
        if(e.target.classList.contains('title')){
            var ele = e.target.nextElementSibling
            ele.classList.toggle('closed')
        }
    }
    mainClass.appendChild(indicatorsContainer);
})()



//Creating HTML elements for year selection
const addYears = (function(){
    const yearContainer = document.getElementsByClassName('yearBox__value');
    let select = document.createElement('select');
    console.log(yearContainer[0])

    for(let i = 1960; i <= 2016; i++){
        let option =  document.createElement('option');
        option.value = i;
        option.textContent = i;
        select.appendChild(option);
    }
    select.addEventListener('change', yearCallback)
    mainClass.appendChild(select);

    function yearCallback(event){
        const yearValue = event.target.value;
        const yearFromInput = inputs[1].value;
        const yearToInput = inputs[2].value;
        
        if(!yearFromInput){
            inputs[1].value = yearValue;
            yearContainer[0].textContent = yearValue;
        }
        else if (yearFromInput && !yearToInput){
            inputs[2].value = yearValue;
            yearContainer[1].textContent = yearValue;
        }
        else{
            inputs[2].value = yearValue;
            yearContainer[1].textContent = yearValue;
        }
    }    
})()


//creating HTML elements for country selection
const addCountries = (function(){
    const selectCountries = document.createElement('select')
    for(let i = 0; i < 249; i++){
        let option = document.createElement('option');
        option.textContent = isoJson[i].Name;
        option.value = isoJson[i].Code;
        selectCountries.appendChild(option);
    }
    selectCountries.addEventListener('change', countryCallback);


    const selectContinent = document.createElement('select');
    const optionDefault = document.createElement('option')
    optionDefault.selected = 'selected'
    optionDefault.hidden = true;
    optionDefault.textContent = 'please select a continent'
    selectContinent.appendChild(optionDefault)

    isoContinents.forEach(continent => {
        let option = document.createElement('option');
        option.textContent = continent.name;
        option.value = continent.countriesCode;
        option.dataset.isoCode = continent.code;
        selectContinent.appendChild(option)
    })
    selectContinent.addEventListener('change', countryCallback)

    function countryCallback(e){
        inputs[3].value = inputs[3].value + e.target.value;
        console.log(e.target.dataset.iso)
        console.log(inputs);

        const CountryContainer = document.querySelector('.mapInfoDisplay .countriesBox ul');
        const li = document.createElement('li');
        li.classList.add('countries')
        li.dataset.id = e.target.value;
        li.textContent = e.target.options[e.target.selectedIndex].textContent;
        CountryContainer.appendChild(li);
    }

    mainClass.appendChild(selectCountries); 
  
    mainClass.appendChild(selectContinent)

    
})()

//creating HTML elements for mode selection
const addMode = (function(){
    const select =  document.createElement('select');
    select.addEventListener('change', modeCallback);
    const modes = ['countries','continents','subcontinent','provinces','metros']

    modes.forEach(element => {
        let option = document.createElement('option');
        option.textContent = element;
        option.value = element;
        select.appendChild(option)
    })

    function modeCallback(e){
        inputs[3].value = ""
        inputs[4].value = e.target.value;

        const modeContainer = document.querySelector('.mapInfoDisplay .modeBox');
        const regionsBox = document.querySelector('.countriesBox ul');

        while (regionsBox.firstChild) {
            regionsBox.removeChild(regionsBox.firstChild);
        }        
        if(modeContainer.firstElementChild){
            modeContainer.firstElementChild.textContent = event.target.value;
        }
        else{
            const span = document.createElement('span');
            span.textContent = e.target.value;
            span.classList.add('mode');
            modeContainer.appendChild(span)
        } 
    }

    mainClass.appendChild(select)


})() 

//Creating HTML elements to display input values of the request
const mapInfo = (function(){
    const mapInfoDisplay = document.getElementsByClassName('mapInfoDisplay')[0]
   
    mapInfoDisplay.addEventListener('click', (e) => {
        if(e.target.classList.contains('indicator')){
            inputs[0].value = "";
            e.target.remove();
        }
        if(e.target.classList.contains('yearBox__value')){
            const yearContainer = document.getElementsByClassName('yearBox__value');
            const dateValue = e.target.textContent;
            e.target.textContent = "";
            if(e.target == yearContainer[0]){
                inputs[1].value = ""
            }
            else{
                inputs[2].value = "";
            }  
        }
        if(e.target.classList.contains('countries')){
            const countryValue = e.target.dataset.id;
            const regexp = new RegExp(countryValue);
            const updatedInput = inputs[3].value.replace(regexp, "");
            inputs[3].value = updatedInput;
            e.target.remove()
        }     
        if(e.target.classList.contains('mode')){
            inputs[4].value = '';
            e.target.remove;
        }
    })
})()



console.log(indicators)


//const regexp = new RegExp(`^${countryValue};|;*${countryValue}`);
