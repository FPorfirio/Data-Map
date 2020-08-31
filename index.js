import indicators  from './world-bank.js'
console.log(indicators)
import area from './country_iso_codes.js'
import dlmenu from './menu.js';
import generateSelect from './selectGenerator.js';
import getProp from '../lodash-es/merge.js';
console.log(getProp)
console.log(indicators)
const mainClass = document.getElementsByClassName('selectors')[0];
const inputs = document.getElementsByClassName('form')[0].children;
console.log(area)

function areaSelect(select, items){
    const tailSelect = tail.select(select, {searchFocus: false, animate: false, startOpen: true, multiPinSelected:true, search: true, multiple: true});
    tailSelect.config('items', items);
    tailSelect.options.all('unselected','#');
    const CountryContainer = document.querySelector('.mapInfoDisplay .countriesBox ul').children;
    let keys = Object.keys(items)[0];
    tailSelect.options.unselect(keys, items[keys].group)
    let isSelected = Array.from(CountryContainer).forEach((e) => {
        let group = (function(){
            var keys = Object.keys(area)
            
            var keymatch = keys.find(ele =>{
                let match = area[ele].some(elem => {
                    return e.dataset.id == (elem.Code || elem.countriesCode)
                })
                console.log(area[ele])
                return match
            })
            return keymatch
        })()
        console.log(group);
        if(tailSelect.options.get(e.dataset.id, '#')){
            tailSelect.options.select(e.dataset.id, '#')
        }
        else{
            console.log('szhitfuck')
            tailSelect.options.select(e.dataset.id, group)
        }
    });
    tailSelect.select.addEventListener('click', (e) =>{
        let group = e.target.dataset.group ? e.target.dataset.group : '#';
        if(e.target.classList.contains('dropdown-option')){
            if(tailSelect.options.is('select', e.target.dataset.key, group)){
                inputs[3].value = inputs[3].value + e.target.dataset.key;
                const CountryContainer = document.querySelector('.mapInfoDisplay .countriesBox ul');
                const li = document.createElement('li');
                li.classList.add('countries')
                li.dataset.group = e.target.dataset.group
                li.dataset.id = e.target.dataset.key;
                li.textContent = e.target.textContent
                CountryContainer.appendChild(li);
            }
            else{
                const countryValue = e.target.dataset.key;
                const regexp = new RegExp(countryValue);
                const updatedInput = inputs[3].value.replace(regexp, "");
                inputs[3].value = updatedInput;
                const li = document.querySelector(`.mapInfoDisplay .countriesBox ul li[data-id=${e.target.dataset.key}]`);
                li.remove();
            }
        }
    });
}

const SeachBar = (function(){
    const searchBox = document.createElement('div');  

    const search = document.createElement('input');
    search.type = "search";
    searchBox.appendChild(search)

    const select = document.createElement('select');
    searchBox.appendChild(select)

    function SearchArea(obj, word, options = {}, group = []){
        console.log(indicators)
        word = word
        for(let prop in obj){
            let key = Object.keys([obj[prop][0]])[0]

            if(typeof key != "string"){
                group.push(prop);
                SearchArea(obj[prop], word, options, group);
                group = [];
            }
            else{
                let regex = new RegExp(`${word}`, 'ig');
                    
                let filtered = obj[prop].filter(function(item){
                        let value = item.name ? item.name : item.Name;
                        let result =  regex.test(value); 
                        regex.lastIndex = 0;
                        return result; 
                    });

                filtered.forEach((item) => {
                        let value = item.name ? item.name : item.Name;
                        let textContent = item.countriesCode ? item.countriesCode : item.Code;
                        options[textContent] = {
                            group: group.join('-') + prop,
                            category: "area",
                            value,
                        }
                    }) 
            }
        }
        return options
    }

    function searchIndicator(arr, word, options = {}, group = []){
        word = word
        arr.forEach((item)=>{
            let key = Object.keys(item)[0];
        
            if(typeof item[key][0] != "string" ){
                group.push(key);
                searchIndicator(item[key], word, options, group);
                group = [];               
            }
            else{
                let index = group.indexOf(key);
                let filtered = item[key].filter(function(item){
                    return item.includes(word)
                });
                filtered.forEach((item) => {
                    let value = item;
                    const indicatorRegexp = /(?<=\()[^\n\(\)]+(?=\)\n{0,1}$)/gi;
                    options[item.match(indicatorRegexp)] = {
                        group: group.join('-') + ' ' + key,
                        category: "indicator",
                        value,
                    }
                    
                });    
            }
        })
        return options;
    }
    console.log(SearchArea)

    return function(e){
        let element = e.target;
        element.insertAdjacentElement('afterend', searchBox);
        search.value = ""

        if(element.textContent.includes('area')){
            search.addEventListener('input', (e) => {
                let options = SearchArea(area, e.target.value)
                console.log(area)
                generateSelect(select, options)
            })
            
        }
        else if(element.textContent.includes('indicator')){
            search.addEventListener('input', (e) => {
                let options = searchIndicator(indicators, e.target.value)
                generateSelect(select, options)
            })
        }
    }
})()


const addIndicators = (function(){
    
    const indicatorBox = document.createElement('div')
    indicatorBox.classList.add('dl-menuwrapper')

    const select = document.createElement('select');

    const indicatorBoxBtn = document.createElement('button')
    indicatorBox.appendChild(indicatorBoxBtn)
    indicatorBoxBtn.textContent = "Select an indicator";
    indicatorBoxBtn.classList.add('dl-trigger')
    indicatorBoxBtn.addEventListener('click', SeachBar);

    const indicatorsContainer = document.createElement('ul');
    indicatorsContainer.classList.add('dl-menu')
    indicatorBox.appendChild(indicatorsContainer)   

    indicators.forEach((group) => {
        const groupLi = document.createElement('li')
        groupLi.classList.add('indicatorBox_li')
        indicatorsContainer.appendChild(groupLi); 

        const groupElement = document.createElement('ul')
        groupElement.classList.add('menuwrapper_submenu')
        groupLi.appendChild(groupElement);

        const groupName = document.createElement('li');
        groupElement.appendChild(groupName);

        const groupNameBtn = document.createElement('button');
        groupNameBtn.classList.add('title','indicatorBox_button')
        groupName.appendChild(groupNameBtn)

        const groupContentLi = document.createElement('li')
        groupElement.appendChild(groupContentLi);

        const groupContentUl = document.createElement('ul');
        groupContentUl.classList.add('dl-submenu')
        groupContentLi.appendChild(groupContentUl);

        const name = Object.keys(group)[0];
        const groupValues = group[name];
        groupNameBtn.textContent = name;

        groupValues.forEach( ele => {
            const subGroupLi = document.createElement('li');
            subGroupLi.classList.add('indicatorBox_li')
            groupContentUl.appendChild(subGroupLi);

            const subGroupUl = document.createElement('ul')
            subGroupUl.classList.add('menuwrapper_submenu')
            subGroupLi.appendChild(subGroupUl)

            const subGroupName = document.createElement('li')
            subGroupUl.appendChild(subGroupName)

            const subGroupNameBtn = document.createElement('button')
            subGroupNameBtn.classList.add('title','indicatorBox_button');
            subGroupNameBtn.addEventListener('click', btnCallback);
            subGroupName.appendChild(subGroupNameBtn)

            const subGroupContentLi = document.createElement('li');
            subGroupUl.appendChild(subGroupContentLi)

            const subgroupContentUl = document.createElement('ul');
            subgroupContentUl.classList.add('dl-submenu')
            subGroupContentLi.appendChild(subgroupContentUl);

            const indicator = document.createElement('li');
            indicator.classList.add('indicatorBox_li');
            subgroupContentUl.appendChild(indicator);
            
            const name = Object.keys(ele)[0];
            const subgroupValues = ele[name]
            subGroupNameBtn.textContent = name;

        })
    });
    function indicatorSearch(indicators, indicator){
        let result;
        function searchLoop(indicators, indicator){
            for(let item of indicators){

                let key = Object.keys(item)[0];
                if(key != indicator && typeof item[key][0] != "string"){
                    console.log('why')
                     searchLoop(item[key], indicator)
                }
                else if(indicator == key){
                    const value = item[key]
                    console.log(value)
                    result = value;
                    return;
                }
            }
        }
        searchLoop(indicators, indicator);
        console.log(result)
        return result;
    }
    function indicatsorSearch(indicators, indicator){  
        for(let item of indicators){

            let key = Object.keys(item)[0];
            if(key != indicator && typeof item[key][0] != "string"){
                console.log('why')
                return indicatorSearch(item[key], indicator)
            }
            else if(indicator == key){
                const value = item[key]
                console.log(value)
                return value
            }
        }
    }

    function btnCallback(e){
        while(select.firstElementChild){
            select.removeChild(select.firstElementChild);
        }
        let items = (function(){
            let groupobj = {};
            const indicatorRegexp = /(?<=\()[^\n\(\)]+(?=\)\n{0,1}$)/gi;
            
            let blabla = indicatorSearch(indicators, e.target.textContent)
            console.log(blabla)

            indicatorSearch(indicators, e.target.textContent).forEach((element) => {
                console.log(element)
                console.log(element.match(indicatorRegexp))
                let value = element
                groupobj[element.match(indicatorRegexp)] = {
                    category: 'indicator',
                    value    
                }
            });
            return groupobj
        })();
        console.log(items)
        e.target.parentElement.nextElementSibling.firstChild.querySelector('.indicatorBox_li').appendChild(select);
        generateSelect(select, items);
    }

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
            var ele = e.target.parentElement.nextElementSibling
            ele.classList.toggle('closed')
        }
    }
    mainClass.appendChild(indicatorBox);
    dlmenu(indicatorBox, {
        animationClasses : { classin : 'dl-animate-in-5', classout : 'dl-animate-out-5' }
    })
})()



//Creating HTML elements for year selection
const addYears = (function(){

    const yearBox = document.createElement('div')
    yearBox.classList.add('dl-menuwrapper')

    const select = document.createElement('select');

    const yearBoxBtn = document.createElement('button')
    yearBoxBtn.textContent = "Select year or year span(optional)";
    yearBoxBtn.classList.add('dl-trigger')
    yearBoxBtn.addEventListener('click', btnCallback);
    yearBox.appendChild(yearBoxBtn)


    const yearsContainer = document.createElement('ul');
    yearsContainer.classList.add('dl-menu');
    yearBox.appendChild(yearsContainer); 

    let yearLi = document.createElement('li');
    yearLi.classList.add('indicatorBox_li');
    yearsContainer.appendChild(yearLi);

    function btnCallback(e){
        while(select.firstElementChild){
            select.removeChild(select.firstElementChild);
        }
        let items = (function(){
            const groupobj = {};
            for(let i = 1960; i <= 2016; i++){
                const value = i;
                const textContent = i;
                groupobj[textContent] = {
                    value,
                    category: "year"

                }
            }
            return groupobj
        })();
        console.log(e.target.nextElementSibling)
        e.target.nextElementSibling.querySelector('.indicatorBox_li').appendChild(select);
        generateSelect(select, items);
    }
    mainClass.appendChild(yearBox);
    dlmenu(yearBox, {
        animationClasses : { classin : 'dl-animate-in-5', classout : 'dl-animate-out-5' }
    })
    /*
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
    }    */
})()


//creating HTML elements for country selection
const addCountries = (function(){
    const areas = area;
    const indicatorBox = document.createElement('div')
    indicatorBox.classList.add('dl-menuwrapper')

    const indicatorBoxBtn = document.createElement('button')
    indicatorBoxBtn.textContent = "Select an area";
    indicatorBoxBtn.classList.add('dl-trigger');
    indicatorBox.appendChild(indicatorBoxBtn);
    indicatorBoxBtn.addEventListener('click', SeachBar)

    const select = document.createElement('select');

    const indicatorsContainer = document.createElement('ul');
    indicatorsContainer.classList.add('dl-menu')
    indicatorBox.appendChild(indicatorsContainer)   

    for(let group in area){
        const groupLi = document.createElement('li')
        groupLi.classList.add('indicatorBox_li')
        indicatorsContainer.appendChild(groupLi); 

        const groupElement = document.createElement('ul')
        groupElement.classList.add('menuwrapper_submenu')
        groupLi.appendChild(groupElement);

        const groupName = document.createElement('li');
        groupElement.appendChild(groupName);

        const groupNameBtn = document.createElement('button');
        groupNameBtn.classList.add('title','indicatorBox_button')
        groupNameBtn.addEventListener('click', groupBtnCallback);
        groupName.appendChild(groupNameBtn)

        const groupContentLi = document.createElement('li');
        groupElement.appendChild(groupContentLi);

        const groupContentUl = document.createElement('ul');
        groupContentUl.classList.add('dl-submenu');
        groupContentLi.appendChild(groupContentUl); 
        groupNameBtn.textContent = group;

        let areaLi = document.createElement('li');
        areaLi.classList.add('indicatorBox_li');
        groupContentUl.appendChild(areaLi);
    }

    function groupBtnCallback(e){
        while(select.firstElementChild){
            select.removeChild(select.firstElementChild);
        }
        let items = (function(){
            let groupobj = {};

            area[e.target.textContent].forEach((element) => {
                let value = element.name ? element.name : element.Name;
                let textContent = element.countriesCode ? element.countriesCode : element.Code;
                groupobj[textContent] = {
                    category: 'area',
                    value
                }
            });
            return groupobj
        })();
        e.target.parentElement.nextElementSibling.firstChild.querySelector('.indicatorBox_li').appendChild(select);
        generateSelect(select, items);
        /* ---fix tail select menu
            var clone = this.select.cloneNode(true), height = this.con.height, search = 0,
                inner = this.dropdown.querySelector(".dropdown-inner");
            // Calculate Dropdown Height
            clone = this.select.cloneNode(true);
            let cloneDropdown = clone.querySelector('.select-dropdown')
            cloneDropdown.style.cssText = "height:auto;min-height:auto;max-height:none;opacity:0;display:block;visibility:hidden;";
            cloneDropdown.style.maxHeight = this.con.height + "px";
            cloneDropdown.className += " cloned";
            document.body.appendChild(clone);
            height = (height > cloneDropdown.clientHeight)? cloneDropdown.clientHeight: height;
            if(this.con.search){
                search = clone.querySelector(".dropdown-search").clientHeight;
            }
            document.body.removeChild(clone);
        */
    }

    

    mainClass.appendChild(indicatorBox)
    dlmenu(indicatorBox, {
        animationClasses : { classin : 'dl-animate-in-5', classout : 'dl-animate-out-5' }
    })
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
        if(e.target.dataset.category == "indicator"){
            inputs[0].value = "";
            e.target.remove();
        }
        else if(e.target.classList.contains('yearBox__value')){
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
        else if(e.target.dataset.category == "area"){
            const countryValue = e.target.dataset.id;
            const regexp = new RegExp(countryValue);
            const updatedInput = inputs[3].value.replace(regexp, "");
            inputs[3].value = updatedInput;
            e.target.remove()
        }     
        else if(e.target.classList.contains('mode')){
            inputs[4].value = '';
            e.target.remove();
        }
    })
})()



console.log(indicators)


//const regexp = new RegExp(`^${countryValue};|;*${countryValue}`);
