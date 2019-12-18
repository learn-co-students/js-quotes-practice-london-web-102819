// It might be a good idea to add event listener to make sure this file
// only runs after the DOM has finshed loading.

const GET_URL = "http://localhost:3000/quotes?_embed=likes";
const LIKE_POST_URL = "http://localhost:3000/likes";
const BASE_URL = "http://localhost:3000/quotes";

const ul = document.querySelector("#quote-list");

const init = () => {
  getAllQuotes().then(renderAllQuotes);
};

const getAllQuotes = async () => {
  const resp = await fetch(GET_URL);
  return await resp.json();
};

const renderAllQuotes = quotesArray => {
  for (const quote of quotesArray) {
    renderQuote(quote);
  }
};

const renderQuote = quote => {
  const li = document.createElement("li");
  li.className = "quote-card";

  const bq = document.createElement("blockquote");
  bq.className = "blockquote";
  li.append(bq);

  const p = document.createElement("p");
  p.className = "mb-0";
  p.innerText = quote.quote;

  const f = document.createElement("footer");
  f.className = "blockquote-footer";
  f.innerText = quote.author;

  const br = document.createElement("br");

  const btnLike = document.createElement("button");
  const likeSpan = document.createElement("span");
  const likeTotal = quote.likes.length;
  likeSpan.innerText = likeTotal;

  btnLike.className = "btn-success";
  btnLike.innerHTML = "Likes ";
  btnLike.addEventListener("click", function() {
    fetch(LIKE_POST_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        quoteId: quote.id
      })
    })
      .then(resp => resp.json())
      .then(() => {
        likeSpan.innerText = parseInt(likeSpan.innerText) + 1;
      });
  });
  btnLike.append(likeSpan);

  const btnDelete = document.createElement("button");
  btnDelete.className = "btn-danger";
  btnDelete.innerText = "Delete";
  btnDelete.addEventListener("click", () =>
    deleteQuote(quote.id).then(() => li.remove())
  );

  bq.append(p, f, br, btnLike, btnDelete);
  ul.append(li);
};

const addNewQuote = () => {
  const btnSubmit = document.querySelector(".btn-primary");

  btnSubmit.addEventListener("click", renderNewQuote);
};

const btnSubmit = document.querySelector(".btn-primary");
btnSubmit.addEventListener("click", e => {
  e.preventDefault();
  const newQuote = document.querySelector("#new-quote").value;
  const newAuthor = document.querySelector("#author").value;
  const newQuoteObj = {};

  fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      quote: newQuote,
      author: newAuthor,
      likes: []
    })
  })
    .then(resp => resp.json())
    .then(data => renderQuote(data))
    .then(() => {
      document.querySelector("#new-quote-form").reset();
    });
});

const deleteQuote = id => {
  return fetch(BASE_URL + "/" + id, { method: "DELETE" });
};

document.addEventListener("DOMContentLoaded", init);
