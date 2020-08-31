import indicators  from './world-bank.js';
import area from './country_iso_codes.js'
import assign from "../lodash-es/assign.js"

console.log(assign)
const inputs = document.getElementsByClassName('form')[0].children;


const generateSelect = (function(){
    
    function selectCb(htmlElement, tailSelect){
        let group = htmlElement.dataset.group ? htmlElement.dataset.group : '#';
        const isSelected = tailSelect.options.is('select', htmlElement.dataset.key, group);
        const value = htmlElement.dataset.key;
        const category = htmlElement.dataset.category;
        const textContent = htmlElement.textContent;
        const regexpValue = new RegExp(value);
        const filtersBox = document.querySelector(`.mapInfoDisplay .${category}Box ul`);
        
        switch(category){
            case "indicator":
                if(!isSelected){
                    filtersBox.children[0].remove();
                    inputs[0].value = "";         
                    
                }
                else{
                    const oldLi = filtersBox.children[0];
                    const li = document.createElement("li")
                    if(oldLi){
                        tailSelect.options.unselect(oldLi.dataset.id, '#')
                        oldLi.remove();
                    }
                    li.dataset.id = value;
                    li.dataset.category = category
                    li.textContent = textContent;
                    filtersBox.appendChild(li);
                    inputs[0].value = value;
                               
                }        
            break;

            case "year":
                console.log(value)
                if(isSelected){
                    if(filtersBox.children.length == 2){
                        const li = document.createElement('li');
                        li.dataset.category = category
                        li.dataset.id = value
                        li.textContent = textContent
                        tailSelect.options.unselect(filtersBox.children[1].dataset.id, '#')
                        filtersBox.children[1].remove()
                        filtersBox.appendChild(li);
                        inputs[2].value = value;
                    }
                    else if(filtersBox.children.length == 1){
                        const li = document.createElement('li');
                        li.dataset.category = category
                        li.dataset.id = value
                        li.textContent = textContent
                        filtersBox.appendChild(li)
                        inputs[2].value = value;
                    }
                    else{
                        const li = document.createElement('li');
                        li.dataset.category = category
                        li.dataset.id = value
                        li.textContent = textContent
                        filtersBox.appendChild(li);
                        inputs[1].value = value;
                    }

                }
                    /*if(optionalLi){
                        console.log('selected');
                        const li = document.createElement("li")
                        li.dataset.id = value;
                        li.dataset.category = category
                        li.textContent = textContent;
                        inputs[2].value = value;
                        filtersBox.appendChild(li);
                    }
                    else{
                        const li = document.createElement("li")
                        li.dataset.id = value;
                        li.dataset.category = category
                        li.textContent = textContent;
                        inputs[1].value = value;
                        filtersBox.appendChild(li);
                    }         */                                                               
                else{
                    const findElement = filtersBox.querySelector(`li[data-id="${value}"]`)

                    inputs[2].value = "";
                    findElement.remove()
                    /*
                    const updatedInput = inputs[3].value.replace(regexpValue, "");
                    inputs[3].value = updatedInput;
                    const li = filtersBox.querySelector(`li[data-id=${value}`);
                    li.remove()*/
                }
            break;

            case "area":
                if(isSelected){
                    const li = document.createElement('li');
                    li.dataset.category = category
                    li.dataset.id = value
                    li.textContent = textContent
                    filtersBox.appendChild(li);
                    inputs[3].value = inputs[3].value + value;
                }
                else{
                    const updatedInput = inputs[3].value.replace(regexpValue, "");
                    const li = filtersBox.querySelector(`li[data-id=${value}`);
                    li.remove();
                    inputs[3].value = updatedInput;
                }   
            break
        }  
    }

    function select(select, items){
        var tailOptionDefault = {searchFocus: false, animate: false, startOpen: true, multiPinSelected:true, search: true, multiple: true}
        const tailSelect = tail.select(select, tailOptionDefault);
        const keys = Object.keys(items);
        const selector = items[keys[0]].category
        console.log(tailSelect.options.get(items))
        const CountryContainer = document.querySelector(`.mapInfoDisplay .${selector}Box ul`).children;
        tailSelect.config('items', items);
        tailSelect.options.all('unselected','#');
        tailSelect.options.unselect(keys[0], items[keys[0]].group)
        
        /* arreglar el gorup del primer render entendiendo que retorna el nombre del grupo, ya sea paises o continentes y agregar grupo al render por click */
        console.log(keys)
        Array.from(CountryContainer).forEach((e) => {
            const keymatch = keys.find((element) => {
                return element == e.dataset.id
            })
            console.log(keymatch)
            /*
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
            console.log(group)
*/
            if(tailSelect.options.get(e.dataset.id, '#')){
                tailSelect.options.select(e.dataset.id, '#')
            }
            else{
                tailSelect.options.select(e.dataset.id, items[keymatch].group)
            }
            
           /*
           let group = tailSelect.options.finder(e.dataset.id, "value");
           console.log(e.dataset.id, group);
           tailSelect.options.select(e.dataset.id, group.group)
           
          let group = tailSelect.options.find(e.dataset.id, "any");
          console.log(e.dataset.id, group);
          tailSelect.options.select(e.dataset.id, group.group)
    */
            
        });

        tailSelect.select.addEventListener('click', (e) =>{
            if(e.target.classList.contains('dropdown-option')){
                selectCb(e.target, tailSelect);
            }
        });
    }

    return select
})()
//modificar el tail select para poder agregar atributos personalizados

export default generateSelect