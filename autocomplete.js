const createAutoComplete=({
    root,
    renderOption,
    onOptionSelect,
    inputValue,
    fetchData
})=>{
    root.innerHTML=`
    <label><b>Search</b></label>
    <input class="input" />
    <div class="dropdown">
        <div class='dropdown-menu'>
            <div class='dropdown-content results'></div>
        </div>  
    </div>
    `;

const input=root.querySelector('input');
const dropdown=root.querySelector('.dropdown');
const resultWrapper=root.querySelector('.results');

const onInput=async (event)=>{
    const items=await fetchData(event.target.value);
    
    if(!items.length){
        dropdown.classList.remove('is-active');
        return;
    }

    dropdown.classList.add('is-active');
    resultWrapper.innerHTML=``; 
    
    for(let item of items){
        const option=document.createElement('a');
        
        option.classList.add('dropdown-item');
        option.innerHTML=renderOption(item);
        option.addEventListener('click',(event)=>{
            dropdown.classList.remove('is-active');
            input.value=inputValue(item);
            onOptionSelect(item);
        })

        resultWrapper.appendChild(option);
    }

}

input.addEventListener('input',debounce(onInput,1000));
document.addEventListener('click',(event)=>{
    if(!root.contains(event.target)){
        dropdown.classList.remove('is-active');
    }
})

}