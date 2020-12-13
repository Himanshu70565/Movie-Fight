const autoCompleteConfig={
    renderOption(movie){
        const imgSrc=movie.Poster==='N/A' ? '':movie.Poster;
        return `
            <img src=${imgSrc} alt='image'>
            ${movie.Title} (${movie.Year})
        `;
    },
    inputValue(movie){
        return movie.Title;
    },
    async fetchData(searchTerm){
        const response=await axios.get('http://www.omdbapi.com',{
            params:{
                apikey:'c9256337',
                s:searchTerm
            }
        })
    
        if(response.data.Error){
            return [];
        }
        return response.data.Search;
    }
}

createAutoComplete({
    ...autoCompleteConfig,
    root:document.querySelector('#left-autocomplete'),
    onOptionSelect(movie){
        document.querySelector('.tutorial').classList.add('is-hidden');
        onMovieSelect(document.querySelector('#left-summary'),movie,'left');
    }
});

createAutoComplete({
    ...autoCompleteConfig,
    root:document.querySelector('#right-autocomplete'),
    onOptionSelect(movie){
        document.querySelector('.tutorial').classList.add('is-hidden');
        onMovieSelect(document.querySelector('#right-summary'),movie,'right');
    },
});


let leftMovie,rightMovie;
const onMovieSelect=async (selector,movie,side)=>{
    let response=await axios.get('http://www.omdbapi.com/',{
        params:{
            apikey:'c9256337',
            i:movie.imdbID
        }
    });
   
    selector.innerHTML=MovieTemplate(response.data);
    if(side==='left'){
        leftMovie=response.data;
    }else{
        rightMovie=response.data;
    }

    if(leftMovie && rightMovie){
        runComparison();
    }
}

const runComparison=()=>{
    const leftSideStats=document.querySelectorAll('#left-summary .notification');
    const rightSideStats=document.querySelectorAll('#right-summary .notification');

    leftSideStats.forEach((leftStat,index)=>{
        const rightStat=rightSideStats[index];

        const leftSideValue=leftStat.dataset.value;
        const rightSideValue=rightStat.dataset.value;

        if(rightSideValue>leftSideValue){
            leftStat.classList.remove('is-primary');
            leftStat.classList.add('is-warning');
        }else{
            rightStat.classList.remove('is-primary');
            rightStat.classList.add('is-warning');
        }

    })

}

const MovieTemplate=(movieDetail)=>{

    const rottenTomatoRating=parseInt(movieDetail.Ratings[1].Value.replace(/,/g,''));
    const metaScore=parseInt(movieDetail.Metascore);
    const imdbRating=parseFloat(movieDetail.imdbRating);
    const imdbVotes=parseInt(movieDetail.imdbVotes.replace(/,/g,''));

    const awards=movieDetail.Awards.split(' ').reduce((prev,word)=> {
        const data=parseInt(word);

        if(isNaN(data)){
            return prev;
        }
        return prev+data;
    },0);

    console.log(rottenTomatoRating,metaScore,imdbRating,imdbVotes,awards);

    return `
      <article class="media">
        <figure class="media-left">
            <p class="image">
                <img src="${movieDetail.Poster}" />
            </p>
        </figure>
        <div class="media-content">
            <div class=="content">
                <h1>${movieDetail.Title}</h1>
                <h4>${movieDetail.Genre}</h4>
                <p>${movieDetail.Plot}</p>
            </div>
        </div>
      </article>
      <article data-value=${awards} class="notification is-primary">
        <p class="title">${movieDetail.Awards}</p>
        <p class="subtitle">Awards</p>
      </article>
      <article data-value=${rottenTomatoRating} class="notification is-primary">
        <p class="title">${movieDetail.Ratings[1].Value}</p>
        <p class="subtitle">Rotten Tomato Rating</p>
      </article>
      <article data-value=${metaScore} class="notification is-primary">
        <p class="title">${movieDetail.Metascore}</p>
        <p class="subtitle">Metascore</p>
      </article>
      <article data-value=${imdbRating} class="notification is-primary">
        <p class="title">${movieDetail.imdbRating}</p>
        <p class="subtitle">IMDB Rating</p>
      </article>
      <article data-value=${imdbVotes} class="notification is-primary">
        <p class="title">${movieDetail.imdbVotes}</p>
        <p class="subtitle">IMDB Votes</p>
      </article>
    `;
}