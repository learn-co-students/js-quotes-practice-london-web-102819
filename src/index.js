// It might be a good idea to add event listener to make sure this file 
// only runs after the DOM has finshed loading. 
const QUOTES = "http://localhost:3000/quotes?_embed=likes"

const JUSTQuotes = "http://localhost:3000/quotes"
const LIKES = "http://localhost:3000/likes"
// create a new quote///////

document.addEventListener("DOMContentLoaded", () => {
    addForm = document.querySelector("#new-quote-form")
    addQuote = document.querySelector("#new-quote");
    addAuthor = document.querySelector("#author")


    fetchQuotes()

    addForm.addEventListener('submit', e => {
        e.preventDefault()

        fetch(JUSTQuotes, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },

            body: JSON.stringify({ "quote": addQuote.value, "author": addAuthor.value, likes: [] })

        })
            .then(resp => resp.json())
            .then(data => { postQuotes(data) })
    });

})

// fetching all quotes

function fetchQuotes() {
    fetch(QUOTES)
        .then(resp => resp.json())
        .then(data => loopQuotes(data))
}

function loopQuotes(data) {
    data.forEach(element => {
        postQuotes(element)
    });

}

// posting all quotes with HTML tags 

function postQuotes(element) {
    const ul = document.querySelector("ul")
    const li = document.createElement('li')
    li.classList.add("quote-card");
    const blockQuote = document.createElement('blockquote');
    blockQuote.classList.add("blockquote");
    const p = document.createElement('p');
    p.innerText = element.quote;
    p.classList.add("mb-0");
    const footer = document.createElement("footer");
    footer.innerText = element.author;
    footer.classList.add("blockquote-footer");
    const br = document.createElement("br");
    const likesButton = document.createElement('button');
    likesButton.innerText = "Likes:";
    likesButton.classList.add("btn-success");
    let span = document.createElement("span");
    let likeTotal = element.likes.length;
    span.innerText = likeTotal;
    // eventListener for like button
    likesButton.addEventListener("click", () => {
        addLike(element.id).then(() => {
            likeTotal += 1;
            span.innerText = likeTotal;
            likesButton.innerText = "Likes:";
            likesButton.append(span)

        })
    })
    const deleteButton = document.createElement('button');
    deleteButton.innerText = "Delete";
    deleteButton.classList.add("btn-danger");
    // eventListener for delete Button
    deleteButton.addEventListener("click", function () {
        deleteQuote(element.id, li)
    })

    blockQuote.append(p, footer, br);
    likesButton.append(span);
    blockQuote.append(likesButton);
    blockQuote.append(deleteButton);
    li.append(blockQuote);
    ul.append(li);


}


//deleting quotes

function deleteQuote(obj_id, tag) {
    fetch(JUSTQuotes + "/" + obj_id, {
        method: "DELETE"

    });
    tag.remove();

}

// adding likes

function addLike(obj_id) {

    return fetch(LIKES, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },

        body: JSON.stringify({ "quoteId": obj_id })

    })

}
