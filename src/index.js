// It might be a good idea to add event listener to make sure this file 
// only runs after the DOM has finshed loading. 

const QUOTES_URL = 'http://localhost:3000/quotes';
const GET_QUOTES_URL = `${QUOTES_URL}?_embed=likes`;
const LIKE_URL = 'http://localhost:3000/likes';

document.addEventListener("DOMContentLoaded", () => {
  loadQuotes();
});

//get all quotes promise
const loadQuotes = () => {
  fetch(GET_QUOTES_URL)
    .then(res => res.json())
    .then(data => renderQuotes(data))
}

//Render all quotes
const renderQuotes = (jsonQuotes) => {
  jsonQuotes.forEach((quote) => {
    createQuoteCard(quote);
  })
}

const quoteUL = document.querySelector('#quote-list')

const createQuoteCard = (quote) => {
  const liQuoteCard = document.createElement('li');

  const blockQuote = document.createElement('blockquote');
  blockQuote.classList.add('blockquote');

  const quoteContent = document.createElement('p');
  quoteContent.classList.add('mb-0');
  quoteContent.textContent = quote.quote;

  const footerAuthor = document.createElement('footer');
  footerAuthor.classList.add('blockquote-footer');
  footerAuthor.textContent = quote.author;

  const br = document.createElement('br');

  const likeBtn = document.createElement('button');
  likeBtn.classList.add('btn-success');
  const spanLikeNum = document.createElement('span');
  let likeTotal = quote.likes.length;
  //Like numbers
  spanLikeNum.innerText = likeTotal;
  likeBtn.textContent = 'Likes: ';
  likeBtn.append(spanLikeNum);

  likeBtn.style.cursor = 'pointer';

  //LIKES QUOTE 
  likeBtn.addEventListener('click', () => {
    createLike(quote.id).then(() => {
      likeTotal += 1;
      spanLikeNum.innerText = likeTotal;
      likeBtn.textContent = 'Likes: ';
      likeBtn.append(spanLikeNum);
    })
  });


  //POST LIKES
  const createLike = (id) => {
    return fetch(LIKE_URL, {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quoteId: id })
    })
      .then(resp => resp.json())
      .catch((error) => {
        console.error(error)
      });
  }

  const deleteBtn = document.createElement('button');
  deleteBtn.classList.add('btn-danger');
  deleteBtn.innerText = 'Delete';
  deleteBtn.style.cursor = 'pointer';


  //DELETE QUOTE LISTENER
  deleteBtn.addEventListener('click', () => {
    deleteQuote(quote.id).then(() => liQuoteCard.remove())
  });

  //DELETE METHOD
  const deleteQuote = (id) => {
    return fetch(`${QUOTES_URL}/${id}`, { method: 'DELETE' });
  }

  liQuoteCard.classList.add('quote-card')

  blockQuote.append(quoteContent, footerAuthor, br, likeBtn, deleteBtn);
  liQuoteCard.append(blockQuote);
  quoteUL.append(liQuoteCard);
}

//ADD NEW QUOTE
const form = document.querySelector('#new-quote-form');
const quoteInput = document.querySelector('#new-quote');
const authorInput = document.querySelector('#author');

form.addEventListener('submit', (event) => {
  event.preventDefault();
  createNewQuote(quoteInput.value, authorInput.value)
    .then((newquote) => {
      renderQuotes([newquote]);
      quoteInput.value = '';
    });
});

const createNewQuote = (quote, author) => {
  return fetch(QUOTES_URL, {
    method: 'POST',
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      quote: quote,
      author: author,
      likes: []
    })
  })
    .then(resp => resp.json())
    .catch((error) => {
      console.error(error)
    });
};
