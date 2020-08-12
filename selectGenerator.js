import indicators  from './world-bank.js';
import area from './country_iso_codes.js'

const inputs = document.getElementsByClassName('form')[0].children;


const generateSelect = (function(){
    function handleInput(HtmlElement, isSelected){
        const value = HtmlElement.dataset.key;
        const category = HtmlElement.dataset.category;
        const textContent = HtmlElement.textContent;
        const regexpValue = new RegExp(value);
        const filtersBox = document.querySelector(`.mapInfoDisplay .${category}Box ul`);
        
        switch(category){
            case "indicator":
                if(!isSelected){
                    filtersBox.querySelector("li").remove();
                    inputs[0].value = "";         
                    
                }
                else{
                    const oldLi = filtersBox.querySelector("li");
                    if(oldLi){
                        oldLi.remove();
                    }
                    const li = document.createElement("li")
                    li.dataset.id = value;
                    li.dataset.category = category
                    li.textContent = textContent;
                    filtersBox.appendChild(li);
                    inputs[0].value = value;
                               
                }        
            break;

            case "year":
                if(isSelected){
                    const optionalLi = filtersBox.querySelector("li");
                    if(optionalLi){
                        const inputOrder = optionalLi.dataset.id > value ? optionalLi.dataset.id : value;
                        const removelist = filtersBox.querySelector()
                        const li = document.createElement("li")
                        li.dataset.id = value;
                        li.dataset.category = category
                        li.textContent = textContent;
                        inputs[2].value = inputOrder;
                        filtersBox.appendChild(li);
                    }
                    else{
                        const li = document.createElement("li")
                        li.dataset.id = value;
                        li.dataset.category = category
                        li.textContent = textContent;
                        inputs[1].value = value;
                        filtersBox.appendChild(li);
                    }                                                                        
                }
                else{
                    const updatedInput = inputs[3].value.replace(regexpValue, "");
                    inputs[3].value = updatedInput;
                    const li = filtersBox.querySelector(`li[data-id=${value}`);
                    li.remove()
                }
            break;

            case "area":
                if(isSelected){
                    console.log('is')
                    inputs[3].value = inputs[3].value + value;
                    const li = document.createElement('li');
                    li.dataset.category = category
                    li.dataset.id = value
                    li.textContent = textContent
                    filtersBox.appendChild(li);
                }
                else{
                    const updatedInput = inputs[3].value.replace(regexpValue, "");
                    inputs[3].value = updatedInput;
                    const li = filtersBox.querySelector(`li[data-id=${value}`);
                    li.remove()
                }   
            break
        }  
    }

    function select(select, items){
        const tailSelect = tail.select(select, {searchFocus: false, animate: false, startOpen: true, multiPinSelected:true, search: true, multiple: true});
        const keys = Object.keys(items)[0];
        const selector = items[keys].category
        const CountryContainer = document.querySelector(`.mapInfoDisplay .${selector}Box ul`).children;
        tailSelect.config('items', items);
        tailSelect.options.all('unselected','#');
        tailSelect.options.unselect(keys, items[keys].group)
        
        Array.from(CountryContainer).forEach((e) => {
            let group = (function(){        
                const keys = Object.keys(area)
                
                const keymatch = keys.find(ele =>{
                    let match = area[ele].some(elem => {
                        return e.dataset.id == (elem.Code || elem.countriesCode)
                    })
                    console.log(area[ele])
                    return match
                })
                return keymatch
            })()

            if(tailSelect.options.get(e.dataset.id, '#')){
                tailSelect.options.select(e.dataset.id, '#')
            }
            else{
                tailSelect.options.select(e.dataset.id, group)
            }
        });

        tailSelect.select.addEventListener('click', (e) =>{
            let group = e.target.dataset.group ? e.target.dataset.group : '#';
            if(e.target.classList.contains('dropdown-option')){
                const selected = tailSelect.options.is('select', e.target.dataset.key, group);
                handleInput(e.target, selected);
            }
        });
    }
    return select
})()
//modificar el tail select para poder agregar atributos personalizados

export default generateSelect