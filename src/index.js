// It might be a good idea to add event listener to make sure this file 
// only runs after the DOM has finshed loading. 
document.addEventListener("DOMContentLoaded", function(){
    //Read 
    fetch('http://localhost:3000/quotes?_embed=likes')
    .then(resp=>resp.json())
    .then(quotes => quotes.forEach(quote => createAQuote(quote)));
});
// create a quote:
function createAQuote (quoteInfo){
//creating HTML elements for READ:

const ul = document.querySelector('#quote-list');
const quoteLi = document.createElement('li');
quoteLi.classList.add('quote-cart');
ul.appendChild(quoteLi); 

const blockquote = document.createElement("blockquote");
blockquote.classList.add('blockquote');
blockquote.id = quoteInfo.id; 
quoteLi.appendChild (blockquote); 


const p = document.createElement ('p');
p.classList.add('mb-0');
p.innerText = quoteInfo.quote;

const footer = document.createElement('footer');
footer.classList.add('blockquote-footer');
footer.innerText = quoteInfo.author; 

let br = document.createElement('br');

//like button & action:
const likeBtn = document.createElement('button');
likeBtn.innerText = 'Likes:';
likeBtn.classList.add('btn-success');
let likeSpan = document.createElement('span');
likeSpan.innerText = quoteInfo.likes.length;
likeBtn.appendChild(likeSpan); 
likeBtn.addEventListener('click', increaseLike);

//delete button & action:
const deleteBtn = document.createElement('button');
deleteBtn.innerText = 'Delete'; 
deleteBtn.classList.add('btn-danger');
deleteBtn.addEventListener('click', deleteQuote);

blockquote.append(p,footer,br, likeBtn,deleteBtn); 
};

//incease Likes of A quote:
function increaseLike(e){
    e.preventDefault();
    const likeData = {
        quoteId: parseInt(e.target.parentElement.id),
        createdAt: new Date()
    };
    // console.log(likeData)
    const configObj = {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
         },
        body: JSON.stringify(likeData)
        }; 

    fetch('http://localhost:3000/likes', configObj)
    .then(resp => resp.json())
    .then(like => {
        // console.log('after fetch',like.quoteId);
        const parentBlockquote = document.getElementById(`${like.quoteId}`);    
        let button = parentBlockquote.querySelector('button.btn-success span');
        button.innerText = parseInt(button.innerText)+1; 
    })
        
}


//delete event action:
function deleteQuote (e){
    e.preventDefault();

    const parentBlockquote = e.target.parentElement;
    const parentLi = parentBlockquote.parentElement; 
    fetch (`http://localhost:3000/quotes/${parentBlockquote.id}`, {method:'delete'})
    .then(()=> {
        alert ("Selected quote has been deleted.");
        parentLi.remove(); 
    })
    // console.log(parentBlockquote);
};

//create event action:
const newQuoteForm = document.querySelector('#new-quote-form'); 
const submitQuoteBtn = newQuoteForm.querySelector('button');
submitQuoteBtn.addEventListener('click', newQuote);

function newQuote(e){
    const newQuoteTxt = newQuoteForm.querySelector('#new-quote').value;
    const newQuoteAuthor = newQuoteForm.querySelector('#author').value;

    e.preventDefault(); 
    const quoteData = {
        quote: newQuoteTxt,
        author: newQuoteAuthor
    }
    // console.log(quoteData);
    const configObj = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify(quoteData)
    }

    fetch ('http://localhost:3000/quotes',configObj)
    .then (resp => resp.json())
    .then (quote => createAQuote(quote));
};

