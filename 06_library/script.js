// Local Storage Management
const myLibrary = [];
if (!localStorage.getItem('myLibrary')) {
  localStorage.setItem('myLibrary', myLibrary);
} else {
  const library = JSON.parse(localStorage.getItem('myLibrary'));
  library.forEach(item => addBookToLibrary(item));
  addLibraryToUI();
}


//// Book object constructor
function Book(title, author, pages, dsc, read) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.dsc = dsc;
  this.read = read;
}

//// Book object prototype
Book.prototype.isRead = function(bool) {this.read = bool};


//// Operation Functions
function addBookToLibrary(bookObject) {
  const book = new Book(bookObject.title, bookObject.author, bookObject.pages, bookObject.dsc, bookObject.read);
  myLibrary.push(book);
  localStorage.setItem('myLibrary', JSON.stringify(myLibrary));
}

function addLibraryToUI() {
  const library = myLibrary;
  const mainContainer = document.querySelector('main');
  const mainFragment = document.createElement('main');
  library.forEach((book, idx) => {
    const bookElement = document.querySelector('.reference .card').cloneNode(true);
    bookElement.querySelector('.card-header p').textContent = book.title;
    bookElement.querySelector('.read-input').checked = book.read;
    bookElement.querySelector('.read-input').id = 'read-toggle-' + idx;
    bookElement.querySelector('.read-input').dataset['idx'] = idx;
    bookElement.querySelector('.header-buttons button').dataset['idx'] = idx;
    bookElement.querySelector('.read-container').htmlFor = 'read-toggle-' + idx;
    bookElement.querySelector('.card-dsc').textContent = book.dsc;
    bookElement.querySelector('.card-author p').textContent = book.author;
    bookElement.querySelector('.card-pages p').textContent = book.pages;
    mainFragment.appendChild(bookElement);
  });
  mainContainer.parentElement.replaceChild(mainFragment, mainContainer);
  refreshEventListners();
}


//// Book element operations
function refreshEventListners() {
  const checkboxes = document.querySelectorAll('.card .read-input');
  checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', (e) => {
      myLibrary[e.target.dataset.idx].isRead(e.target.checked);
      localStorage.setItem('myLibrary', JSON.stringify(myLibrary));
    });
  });

  const deleteButtons = document.querySelectorAll('.header-buttons button');
  deleteButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      myLibrary.splice(e.target.dataset.idx, 1);
      localStorage.setItem('myLibrary', JSON.stringify(myLibrary));
      addLibraryToUI();
    });
  });
}


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


////Mock Data
// const book1 = {
//   title: "The Hobbit",
//   author: "J.R.R. Tolkien",
//   pages: "310",
//   dsc: "The Hobbit, or There and Back Again is a children's fantasy novel by English author J. R. R. Tolkien. It was published in 1937 to wide critical acclaim, being nominated for the Carnegie Medal and awarded a prize from the New York Herald Tribune for best juvenile fiction. The book remains popular and is recognized as a classic in children's literature.",
//   read: false
// }

// const book2 = {
//   title: "The Silmarillion",
//   author: "J.R.R. Tolkien",
//   pages: "365",
//   dsc: "The Silmarillion (Quenya: [silmaˈrilliɔn]) is a collection of mythopoeic stories by the English writer J. R. R. Tolkien, edited and published posthumously by his son Christopher Tolkien in 1977 with assistance from the fantasy author Guy Gavriel Kay.[T 1] The Silmarillion tells of Eä, a fictional universe that includes the Blessed Realm of Valinor, the once-great region of Beleriand, the sunken island of Númenor, and the continent of Middle-earth, where Tolkien's most popular works—The Hobbit and The Lord of the Rings—take place.",
//   read: true
// }

// const book3 = {
//   title: "Harry Potter and the Philosopher's Stone",
//   author: "J. K. Rowling",
//   pages: "223",
//   dsc: "Harry Potter and the Philosopher's Stone is a fantasy novel written by British author J. K. Rowling. The first novel in the Harry Potter series and Rowling's debut novel, it follows Harry Potter, a young wizard who discovers his magical heritage on his eleventh birthday, when he receives a letter of acceptance to Hogwarts School of Witchcraft and Wizardry. Harry makes close friends and a few enemies during his first year at the school, and with the help of his friends, he faces an attempted comeback by the dark wizard Lord Voldemort, who killed Harry's parents, but failed to kill Harry when he was just 15 months old",
//   read: true
// }

// addBookToLibrary(book1);
// addBookToLibrary(book2);
// addBookToLibrary(book3);

// addLibraryToUI();
