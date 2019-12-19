// It might be a good idea to add event listener to make sure this file 
// only runs after the DOM has finshed loading. 


document.addEventListener('DOMContentLoaded', function(){
    allQuotes();
});

const BASE_URL = "http://localhost:3000/quotes?_embed=likes"
const QUOTES_URL = "http://localhost:3000/quotes"
const LIKES_URL ="http://localhost:3000/likes"



function allQuotes() {
    fetch(BASE_URL)
    .then(resp => resp.json())
    .then(data => iterateArray(data));
};


function createSingleQuoteCard(q) {

    const li = document.createElement("li")
    li.setAttribute("class","quote-card")
    const br = document.createElement('br')
    const block = document.createElement("blockquote")
    block.setAttribute("class", "blockquote")

    const p = document.createElement("p")
    p.setAttribute("class", "mb-0")
   
    p.innerText = q.quote;

    const footer = document.createElement("footer")
    footer.setAttribute("class", "blockquote-footer")
    footer.innerText = q.author

    const likeButton = document.createElement("button")
    likeButton.setAttribute("class", "btn-success")
    
    likeButton.innerHTML = `Likes: <span name='likes'>${q.likes.length}</span>`

    likeButton.addEventListener("click", () => incrementLikes(q.id).then(() => changeLikeCounter(likeButton)))
    
    const btn = document.createElement("button")
    btn.setAttribute("class", "btn-danger")
    btn.textContent = "Delete"
    btn.addEventListener("click", () =>
    deleteQuote(q.id).then(() => li.remove()))
    
    block.append(p, footer, br, likeButton, btn)
    li.append(block)
    
    
    return li
    
};

const incrementLikes = id => {
    return fetch(LIKES_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            quoteId: id, 
        })

    })
}

const changeLikeCounter = likeButton => {
    const likesSpan = likeButton.querySelector('span')
    likesSpan.innerText = parseInt(likesSpan.innerText) + 1  
}

const deleteQuote = id => {
    return fetch(QUOTES_URL + "/" + id, { method: "DELETE" });
};


function renderSingleQuote(quote) {
    const quoteUL = document.querySelector("#quote-list");
    const quoteCardElement = createSingleQuoteCard(quote)
    quoteUL.append(quoteCardElement)
}

function iterateArray(quotes) {
    quotes.forEach(qu => {
        renderSingleQuote(qu)
    });
}

const submitButton = document.querySelector("#new-quote-form");
submitButton.addEventListener("submit", e => {
    e.preventDefault();
    const newQuote = document.querySelector("#new-quote").value 
    const newAuthor = document.querySelector("#author").value 
    
    fetch(BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            quote: newQuote,
            author: newAuthor,
        })
    })
    
    
    .then(resp => resp.json())
    .then(quote => {renderSingleQuote(quote)})
    .then(()=> {
            document.querySelector("#new-quote-form").reset();
        });
    
})

 


