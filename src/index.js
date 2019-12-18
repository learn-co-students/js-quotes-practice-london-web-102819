// It might be a good idea to add event listener to make sure this file 
// only runs after the DOM has finshed loading. 

const quoteList = document.querySelector("#quote-list"),
      form = document.querySelector("#new-quote-form"),
      sort = document.querySelector("#sort");

function getQuotes(sorted = false) {
    let URL;
    console.log(sorted);
    if (!sorted) {
        URL = "http://localhost:3000/quotes?_embed=likes";
    } else {
        URL = "http://localhost:3000/quotes?_sort=author";
    }
    fetch(URL)
        .then(data => data.json())
        .then(displayQuotes)
        .catch(console.log);
}

function displayQuotes(quotesData) {
    Array.from(quoteList.children).forEach(q => q.remove());
    quotesData.forEach(q => displayQuote(q))
}

function displayQuote(quoteData, insert = false) {
    const card = document.createElement('li');
    card.className = "quote-card";
    card.id = quoteData.id
    if (!quoteData.likes) quoteData.likes = [];

    card.innerHTML = `<blockquote class="blockquote">
                        <p class="mb-0">${quoteData.quote}</p>
                        <footer class="blockquote-footer">${quoteData.author}</footer>
                        <br>
                        <button class='btn-success' data-quote-id='${quoteData.id}'>Likes: <span>${quoteData.likes.length}</span></button>
                        <button class='btn-warning' data-quote-id='${quoteData.id}'>Edit</button>
                        <button class='btn-danger' data-quote-id='${quoteData.id}'>Delete</button>
                    </blockquote>
                    <form id="edit-quote-form" class="hidden">
                        <div class="form-group">
                          <label for="edit-quote">Edit Quote</label>
                          <input type="text" class="form-control" id="new-quote" value="${quoteData.quote}">
                        </div>
                        <div class="form-group">
                          <label for="Author">Author</label>
                          <input type="text" class="form-control" id="author" value="${quoteData.author}">
                          <input type="hidden" name="quote-id" value="${quoteData.id}">
                        </div>
                        <button type="submit" class="btn btn-primary">Submit</button>
                    </form>`

    card.querySelector(".btn-danger").addEventListener('click', deleteQuote);
    card.querySelector(".btn-success").addEventListener('click', like);
    card.querySelector(".btn-warning").addEventListener('click', (e) => {
        const form = e.target.parentNode.parentNode.querySelector("form");
        form.className = (form.className === "hidden" ? "" : "hidden");
    });
    card.querySelector("form").addEventListener('submit', e => {
        e.target.className = "hidden";
        e.preventDefault();
        const values = Array.from(e.target.querySelectorAll("input")).map(i => i.value);
        patchQuote(values);
    })
    
    if (!insert) {
        quoteList.append(card);}
    else {
        const quotes = Array.from(quoteList.children);
        const beforeQuote = quotes.find(q => parseInt(q.id) > quoteData.id);
        if (!beforeQuote) {
            quoteList.append(card);
        }
        beforeQuote.insertAdjacentElement('beforebegin', card);
    }

    
}

function like(e) {
    const id = parseInt(e.target.dataset.quoteId);
    const likes = this.querySelector("span")
    const likeNumber = parseInt(likes.innerText);
    
    const newLike = {
        quoteId: id,
        createdAt: Date.parse(new Date)
    }

    const configObj = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(newLike)
    }

    fetch("http://localhost:3000/likes", configObj)
        .then(resp => resp.json())
        .then((e) => {
            likes.innerText = likeNumber + 1;
        })
        .catch(console.log);
    
}

function deleteQuote(e) {
    const id = e.target.dataset.quoteId;
    fetch(`http://localhost:3000/quotes/${id}`, {
        method: "DELETE"
    })
    e.target.parentNode.parentNode.remove();
}

function patchQuote(quoteData) {

    const editedQuote = {
        quote: quoteData[0],
        author: quoteData[1]
    }

    const configObj = {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
        body: JSON.stringify(editedQuote)
    }

    fetch(`http://localhost:3000/quotes/${quoteData[2]}`, configObj)
        .then(resp => resp.json())
        .then(quoteData => {
            document.querySelector(`li[id='${quoteData.id}']`).remove();
            displayQuote(quoteData, true);
        })
        .catch(console.log);

}

function postQuote(quoteData) {
    const newQuote = {
        quote: quoteData[0],
        author: quoteData[1]
    }

    const configObj = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
        body: JSON.stringify(newQuote)
    }

    fetch("http://localhost:3000/quotes", configObj)
        .then(resp => resp.json())
        .then(displayQuote)
        .catch(console.log);

}

document.addEventListener('DOMContentLoaded', e => {
    getQuotes();
});
sort.addEventListener('click', e => {
    getQuotes(true);
})

form.addEventListener('submit', e => {
    e.preventDefault();
    const values = Array.from(e.target.querySelectorAll("input")).map(i => i.value);
    postQuote(values);
})