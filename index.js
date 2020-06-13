import indicators  from './world-bank.js'
console.log(indicators)
import area from './country_iso_codes.js'
import dlmenu from './menu.js';
console.log(area)
const mainClass = document.getElementsByClassName('selectors')[0];
const inputs = document.getElementsByClassName('form')[0].children;
console.log(area)


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
                        return regex.test(value)
                    });

                filtered.forEach((item) => {
                        let value = item.name ? item.name : item.Name;
                        let textContent = item.countriesCode ? item.countriesCode : item.Code;
                        options[textContent] = {
                            group: group.join('-') + prop,
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
                    options[value] = {
                        group: group.join('-') + ' ' + key,
                        value,
                        p: 'shit'
                    }
                    
                });    
            }
        })
        return options;
    }

    return function(e){
        let element = e.target;
        element.insertAdjacentElement('afterend', searchBox);
        search.value = ""
        const tailSelect = tail.select(select, {multiple: true, items: {}})
        tailSelect.config('items', {});

        if(element.textContent.includes('area')){
            search.addEventListener('input', (e) => {
                tailSelect.config('items', SearchArea(area, e.target.value));
                tailSelect.on('change', (item, state) => {
                    console.log(item,state)
                })
            })
        }
        else if(element.textContent.includes('indicator')){
            search.addEventListener('input', (e) => {
                tailSelect.config('items', searchIndicator(indicators, e.target.value));
                tailSelect.on('change', (item, state) => {
                    console.log(item,state)
                })
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

            function btnCallback(e){
                while(select.firstElementChild){
                    select.removeChild(select.firstElementChild);
                }
                let items = (function(){
                    let groupobj = {};
        
                    subgroupValues.forEach((element) => {
                        let value = element
                        groupobj[value] = {
                            value
                        }
                    });
                    return groupobj
                })();
                indicator.appendChild(select);
                const tailSelect = tail.select(select, {search: true});
                tailSelect.on('change', (item, state) => {
                    console.log(item,state)
                })
                tailSelect.config('items', items);
                tailSelect.options.add('placeholder', 'select an indicator', '#', true, false, '', true);
                tailSelect.options.handle('unselect','placeholder','#',true);
                tailSelect.options.remove('placeholder','#',true);
                tailSelect.updateLabel('Please select an indicator')
            }
        })
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
    const indicatorBox = document.createElement('div')
    indicatorBox.classList.add('dl-menuwrapper')

    const indicatorBoxBtn = document.createElement('button')
    indicatorBoxBtn.textContent = "Select an area";
    indicatorBoxBtn.classList.add('dl-trigger');
    indicatorBox.appendChild(indicatorBoxBtn);
    indicatorBoxBtn.addEventListener('click', SeachBar)

    //select.addEventListener('click', selectCallback);
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
        groupName.appendChild(groupNameBtn)
        groupNameBtn.addEventListener('click', groupBtnCallback);


        const groupContentLi = document.createElement('li');
        groupElement.appendChild(groupContentLi);

        const groupContentUl = document.createElement('ul');
        groupContentUl.classList.add('dl-submenu');
        groupContentLi.appendChild(groupContentUl); 
        groupNameBtn.textContent = group;

        let areaLi = document.createElement('li');
        areaLi.classList.add('indicatorBox_li');
        groupContentUl.appendChild(areaLi);


            /*tailSelect.options.add('placeholder', 'select an indicator', '#', true, false, '', true);
            tailSelect.options.handle('unselect','placeholder','#',true);
            tailSelect.options.remove('placeholder','#',true);*/
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
                    value
                }
            });
            return groupobj
        })();
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
        e.target.parentElement.nextElementSibling.firstChild.querySelector('.indicatorBox_li').appendChild(select);
        const tailSelect = tail.select(select, {animate: false, startOpen: true, multiPinSelected:true, search: true, multiple: true});
        tailSelect.config('items', items);
        tailSelect.options.all('unselected','#');
        tailSelect.select.addEventListener('click', (e) =>{
            if(e.target.classList.contains('dropdown-option')){
                if(tailSelect.options.is('select', e.target.dataset.key, '#')){
                    inputs[3].value = inputs[3].value + e.target.dataset.key;
                    const CountryContainer = document.querySelector('.mapInfoDisplay .countriesBox ul');
                    const li = document.createElement('li');
                    li.classList.add('countries')
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
        window.setTimeout((e)=>{
            tailSelect.config('animate', true, false);
        })
    }

    /*function selectCallback(e){
        inputs[3].value = inputs[3].value + e.target.value;
        console.log(e.target.dataset.iso)
        console.log(inputs);

        const CountryContainer = document.querySelector('.mapInfoDisplay .countriesBox ul');
        const li = document.createElement('li');
        li.classList.add('countries')
        li.dataset.id = e.target.value;
        li.textContent = e.target.options[e.target.selectedIndex].textContent;
        CountryContainer.appendChild(li);
    }*/

    mainClass.appendChild(indicatorBox)
    dlmenu(indicatorBox, {
        animationClasses : { classin : 'dl-animate-in-5', classout : 'dl-animate-out-5' }
    })
    /*
    const selectCountries = document.createElement('select')
    for(let i = 0; i < area.isoJson.length; i++){
        let option = document.createElement('option');
        option.textContent = area.isoJson[i].Name;
        option.value = area.isoJson[i].Code;
        selectCountries.appendChild(option);
    }
    selectCountries.addEventListener('change', countryCallback);


    const selectContinent = document.createElement('select');
    const optionDefault = document.createElement('option')
    optionDefault.selected = 'selected'
    optionDefault.hidden = true;
    optionDefault.textContent = 'please select a continent'
    selectContinent.appendChild(optionDefault)

    area.isoContinents.forEach(continent => {
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

    */
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
            e.target.remove();
        }
    })
})()



console.log(indicators)


//const regexp = new RegExp(`^${countryValue};|;*${countryValue}`);
