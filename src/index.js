// It might be a good idea to add event listener to make sure this file 
// only runs after the DOM has finshed loading. 
document.addEventListener("DOMContentLoaded", function(){
    //Read 
    fetch('http://localhost:3000/quotes?_embed=likes')
    .then(resp=>resp.json())
    .then(quotes => quotes.forEach(quote => createAQuote(quote)));
});
//toggle switch to sort: 

const body = document.body;
const h1 = document.querySelector('h1');
const sort = document.createElement('h6');
sort.innerText = '⬆️ Sort List';

const sortToggleLabel = document.createElement('label');
sortToggleLabel.classList.add('switch')

body.insertBefore(sortToggleLabel, h1);
body.insertBefore(sort, h1);


const checkbox = document.createElement('input');
checkbox.setAttribute('type', 'checkbox');
const span = document.createElement('span');
span.classList.add('slider');
span.classList.add('round');


sortToggleLabel.append(checkbox, span);

//sorting quotes: 
const sortQuotes = () =>{
    let liList = [];
    let liEls = document.querySelectorAll('.quote-cart');
    let ul = document.querySelector('#quote-list');
    liList=[...liEls];
    let compareFunc;
    if(checkbox.checked){
        compareFunc = function(a,b){
            let contentA=a.querySelector('p').innerText;
            let contentB=b.querySelector('p').innerText;
            if (contentA < contentB){
                return -1;
            }
            if (contentA>contentB){ 
                return 1;
            }
            return 0
        };
    } else{
        compareFunc = function(a,b){
            let contentA= parseInt(a.querySelector('.blockquote').id);
            let contentB= parseInt(b.querySelector('.blockquote').id);
            if (contentA < contentB){
                return -1;
            }
            if (contentA>contentB){ 
                return 1;
            }
            return 0;
        };
    }
    let sortedList = liList.sort(compareFunc);
    sortedList.forEach(liEl => {
        // debugger
        ul.appendChild(liEl)
    });
};
checkbox.addEventListener('change', sortQuotes); 
 
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

    if (quoteInfo.likes){
    likeSpan.innerText = quoteInfo.likes.length
    } else {
        likeSpan.innerText = 0; 
    };
   
    likeBtn.appendChild(likeSpan); 
    likeBtn.addEventListener('click', increaseLike);
    

    //update button & action: 
    const updateBtn = document.createElement('button');
    updateBtn.innerText = 'Update'; 
    updateBtn.classList.add('btn-change'); 

    updateBtn.addEventListener('click', hideAQuote);

    //update user hidden form
    let form = document.createElement('form');
    form.hidden = true; 
    form.id = 'update_form';

    let label = document.createElement('label'); 
    label.innerText = 'Update Quote'; 
    label.id = 'updated-quote';
    let textArea = document.createElement('textarea'); 
    textArea.id = 'new_quote';
    textArea.value = quoteInfo.quote; 

    let brk = document.createElement('br');
    let brk2 = document.createElement('br');

    let authorInput = document.createElement('input');
    authorInput.id = 'new_author'; 
    authorInput.value =quoteInfo.author; 

    let submit = document.createElement('button');
    submit.addEventListener('click', updateAQuote);

    submit.innerText = 'Submit'; 
    form.append(label, brk, textArea, brk2, authorInput, submit);



    //delete button & action:
    const deleteBtn = document.createElement('button');
    deleteBtn.innerText = 'Delete'; 
    deleteBtn.classList.add('btn-danger');
    deleteBtn.addEventListener('click', deleteQuote);

    blockquote.append(p,footer, form, br, likeBtn, deleteBtn, updateBtn); 
};
//update a quote:
function hideAQuote(e){
    e.preventDefault(); 
    let quoteP = e.target.parentElement.querySelector('p');
    let quoteAuthor = e.target.parentElement.querySelector('footer');
    let form = e.target.parentElement.querySelector('#update_form');

    form.hidden = false; 
    quoteP.hidden = true; 
    quoteAuthor.hidden = true; 
};

function updateAQuote(e){
    e.preventDefault(); 
    let form = e.target.parentElement;

    let updateData = {
        quote: form.querySelector('#new_quote').value,
        author:  form.querySelector('#new_author').value
    }

    let quoteId = e.target.parentElement.parentElement.id; 
    let configObj = {
        method: "PATCH",
        headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
         },
        body: JSON.stringify(updateData)
    }; 

    fetch(`http://localhost:3000/quotes/${quoteId}`, configObj)
    .then(resp => resp.json())
    .then(() =>{
        form.hidden = true;
        let parent = e.target.parentElement.parentElement;
        let p = parent.querySelector('p');
        p.innerText = updateData.quote;
        p.hidden = false; 

        let footer = parent.querySelector('footer');
        footer.innerText = updateData.author; 
        footer.hidden = false; 
    });


}

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
    .then (quote => { 
        createAQuote(quote);
        sortQuotes(); 
    });
};