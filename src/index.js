// It might be a good idea to add event listener to make sure this file 
// only runs after the DOM has finshed loading. 

document.addEventListener('DOMContentLoaded', function(){
    fetchQuotes()

})
const ul = document.querySelector("#quote-list")
//fetch quotes
function fetchQuotes(){
    fetch("http://localhost:3000/quotes?_embed=likes").then(resp => resp.json()).then(data => displayQuotes(data))
}

//display quotes
function displayQuotes(data){
    data.forEach(data => quoteCardCreate(data));
}
// create new quote
    const submit = document.querySelector("#new-quote-form")
    const quoteInput =  document.querySelector("#new-quote")
    const authorInput =  document.querySelector("#author")
    submit.addEventListener('submit', (e) => {
        e.preventDefault()
        fetch("http://localhost:3000/quotes", {
            method: "POST", 
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                quote: quoteInput.value,
                author: authorInput.value,
                likes: []
            })
        }).then(resp => resp.json()).then(newQuote => quoteCardCreate(newQuote))
             quoteInput.value = ""
             authorInput.value = ""
    })

// create new HTML card for quote
    function quoteCardCreate(data){
        //call on quote card function
        quoteCard(data)

        //delete btn
        const deleteBtn = document.querySelector(`#deleteBtn${data.id}`)
        deleteBtn.addEventListener('click', () => {
            fetch(`http://localhost:3000/quotes/${data.id}`, {
                method: "DELETE"
            })
            removeQuote(data)
        })
        

        //like btn

        const likeBtn = document.querySelector(`#likeBtn${data.id}`)
        
        likeBtn.addEventListener('click', () => {
            
            fetch("http://localhost:3000/likes", {
                method: "POST", 
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    quoteId: data.id
                })
            })
            // .then(resp => resp.json()).then(data => likeCounter(data))
                
            let like = likeBtn.querySelector("span")
            like.textContent = parseInt(like.textContent) + 1
        })
      
    }



    // function likeCounter(data) {
    //     return fetch("http://localhost:3000/likes").then(resp => resp.json()).then(allLikes => {
        
    //     let filteredLikes = allLikes.filter( (a) => {
    //         return a.quoteId === data.id
    //     })
    //     return filteredLikes

    //     // const likeBtn = document.querySelector(`#likeBtn${data.id}`)
    //     // let like = likeBtn.querySelector("span")
    //     //     like.textContent = filteredLikes.length
    //     })
    // }

    function removeQuote(data) {
        let quoteLi = document.querySelector(`#li${data.id}`)
            quoteLi.remove()
    }


    function quoteCard(data) {
        const ul = document.querySelector("#quote-list")
        const li = document.createElement("li")
        li.id = `li${data.id}`
        li.classList = "quote-card"

        const blockquote = document.createElement("blockquote")
        blockquote.classList = "blockquote"
        
        const p = document.createElement("p")
        p.classList = "mb-0"
        p.textContent = data.quote

        const footer = document.createElement("footer")
        footer.classList = "blockquote-footer"
        footer.textContent = data.author

        const br = document.createElement("br")
        
        const btn = document.createElement("button") 
        btn.innerHTML = `Likes: <span>${data.likes.length}</span>`
        btn.id = `likeBtn${data.id}`
        btn.classList = "btn-success"
        

        const btn2 = document.createElement("button")
        btn2.textContent = "Delete"
        btn2.id = `deleteBtn${data.id}`
        btn2.classList = "btn-danger"

    
        li.append(blockquote)
        blockquote.append(p, footer, br, btn, btn2)
        ul.append(li)
    }

    