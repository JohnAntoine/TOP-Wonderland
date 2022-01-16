const myLibrary = [];
if (!localStorage.getItem('myLibrary')) {
  localStorage.setItem('myLibrary', myLibrary);
} else {
  const library = JSON.parse(localStorage.getItem('myLibrary'));
  library.forEach(item => addBookToLibrary(item));
  addLibraryToUI();
}


function Book(title, author, pages, dsc, read) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.dsc = dsc;
  this.read = read;
}

Book.prototype.isRead = function(bool) {this.read = bool};

function addBookToLibrary(title, author, pages, dsc, read) {
  const book = new Book(title, author, pages, dsc, read);
  myLibrary.push(book);
  localStorage.setItem('myLibrary', JSON.stringify(myLibrary));
}

function addLibraryToUI(library) {
  const mainContainer = document.querySelector('main');
  const docFrag = document.createElement('main');
  library.forEach((book, idx) => {
    const bookElement = document.querySelector('.reference .card').cloneNode(true);
    bookElement.querySelector('.card-header p').textContent = book.title;
    bookElement.querySelector('.card-read-input').checked = book.read;
    bookElement.querySelector('.card-read-input').id = 'card-read-toggle-' + idx;
    bookElement.querySelector('.card-read-input').dataset['idx'] = idx;
    bookElement.querySelector('.card-read-container').htmlFor = 'card-read-toggle-' + idx;
    bookElement.querySelector('.card-dsc').textContent = book.dsc;
    bookElement.querySelector('.card-author p').textContent = book.author;
    bookElement.querySelector('.card-pages p').textContent = book.pages;
    docFrag.appendChild(bookElement);
  });
  mainContainer.parentElement.replaceChild(docFrag, mainContainer);
}

const title1 = "The Hobbit";
const author1 = "J.R.R. Tolkien";
const pages1 = "310";
const dsc1 = "The Hobbit, or There and Back Again is a children's fantasy novel by English author J. R. R. Tolkien. It was published in 1937 to wide critical acclaim, being nominated for the Carnegie Medal and awarded a prize from the New York Herald Tribune for best juvenile fiction. The book remains popular and is recognized as a classic in children's literature.";
const read1 = false;

const title2 = "The Silmarillion";
const author2 = "J.R.R. Tolkien";
const pages2 = "365";
const dsc2 = "The Silmarillion (Quenya: [silmaˈrilliɔn]) is a collection of mythopoeic stories by the English writer J. R. R. Tolkien, edited and published posthumously by his son Christopher Tolkien in 1977 with assistance from the fantasy author Guy Gavriel Kay.[T 1] The Silmarillion tells of Eä, a fictional universe that includes the Blessed Realm of Valinor, the once-great region of Beleriand, the sunken island of Númenor, and the continent of Middle-earth, where Tolkien's most popular works—The Hobbit and The Lord of the Rings—take place.";
const read2 = true;
      localStorage.setItem('myLibrary', JSON.stringify(myLibrary));
      localStorage.setItem('myLibrary', JSON.stringify(myLibrary));


//// Form Display
const addBookButton = document.querySelector('header button');
const moodle = document.querySelector('.moodle');
const moodleContainer = document.querySelector('.moodle-container');
addBookButton.addEventListener('click', () => {
  moodle.classList.add('moodle-open');
});

moodle.addEventListener('click', () => {
  moodle.classList.remove('moodle-open');
});

moodleContainer.addEventListener('click', (e) => {
  e.stopPropagation();
});


//// Form Control
const form = document.getElementById('moodle-form');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const formInputs = Array.from(e.target.querySelectorAll('input'));
  const formTextArea = e.target.querySelector('textarea');
  const formObject = formInputs.reduce( (prevObj, element) => {
    if (element.name === "read") prevObj[element.name] = element.checked;
    else if (element.name !== "submit") prevObj[element.name] = element.value;
    return prevObj;
  }, {} );
  formObject[formTextArea.name] = formTextArea.value;
  addBookToLibrary(formObject);
  addLibraryToUI();
  moodle.classList.remove('moodle-open');
  form.reset();
});


