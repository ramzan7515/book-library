/* =========================================
   BOOK LIBRARY JAVASCRIPT
========================================= */


/* =========================================
   LOCAL STORAGE KEYS
========================================= */

const BOOKS_KEY = "myBookLibrary";

const HISTORY_KEY = "myBookLibraryHistory";


/* =========================================
   DEFAULT BOOKS
========================================= */

const defaultBooks = [

    {
        id: 1,

        title: "Artificial Intelligence: A Modern Approach",

        author: "Stuart Russell & Peter Norvig",

        category: "AI",

        isbn: "9780134610993",

        description:
            "A famous book about Artificial Intelligence and intelligent systems.",

        status: "Available"
    },


    {
        id: 2,

        title: "Clean Code",

        author: "Robert C. Martin",

        category: "Programming",

        isbn: "9780132350884",

        description:
            "A practical book about writing clean and maintainable code.",

        status: "Available"
    },


    {
        id: 3,

        title: "The Alchemist",

        author: "Paulo Coelho",

        category: "Fiction",

        isbn: "9780062315007",

        description:
            "A famous story about dreams, goals and following your destiny.",

        status: "Borrowed"
    }

];


/* =========================================
   LOAD DATA
========================================= */

let books =
    JSON.parse(
        localStorage.getItem(BOOKS_KEY)
    ) || defaultBooks;


let history =
    JSON.parse(
        localStorage.getItem(HISTORY_KEY)
    ) || [

        {
            book: "The Alchemist",

            person: "Friend",

            borrowed: "2026-09-18",

            returned: "—"
        }

    ];


/* =========================================
   SAVE DATA
========================================= */

function saveData() {

    localStorage.setItem(
        BOOKS_KEY,
        JSON.stringify(books)
    );


    localStorage.setItem(
        HISTORY_KEY,
        JSON.stringify(history)
    );

}


/* =========================================
   ESCAPE HTML
========================================= */

function escapeHTML(text) {

    if (!text) {

        return "";
    }


    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* =========================================
   RENDER EVERYTHING
========================================= */

function render() {

    updateStatistics();

    updateCategoryFilter();

    displayBooks();

    displayHistory();

}


/* =========================================
   UPDATE STATISTICS
========================================= */

function updateStatistics() {

    const total =
        books.length;


    const available =
        books.filter(
            book => book.status === "Available"
        ).length;


    const borrowed =
        books.filter(
            book => book.status === "Borrowed"
        ).length;


    const categories =
        new Set(
            books.map(
                book => book.category
            )
        ).size;


    document.getElementById(
        "totalBooks"
    ).textContent = total;


    document.getElementById(
        "availableBooks"
    ).textContent = available;


    document.getElementById(
        "borrowedBooks"
    ).textContent = borrowed;


    document.getElementById(
        "totalCategories"
    ).textContent = categories;

}


/* =========================================
   CATEGORY FILTER
========================================= */

function updateCategoryFilter() {

    const filter =
        document.getElementById(
            "categoryFilter"
        );


    const currentValue =
        filter.value;


    const categories =
        [
            ...new Set(
                books.map(
                    book => book.category
                )
            )
        ].sort();


    filter.innerHTML =
        '<option value="">All Categories</option>';


    categories.forEach(
        category => {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                category;


            option.textContent =
                category;


            filter.appendChild(
                option
            );

        }
    );


    filter.value =
        currentValue;

}


/* =========================================
   DISPLAY BOOKS
========================================= */

function displayBooks() {

    const container =
        document.getElementById(
            "bookContainer"
        );


    const search =
        document.getElementById(
            "searchInput"
        ).value.toLowerCase();


    const category =
        document.getElementById(
            "categoryFilter"
        ).value;


    const status =
        document.getElementById(
            "statusFilter"
        ).value;


    const filteredBooks =
        books.filter(book => {

            const searchMatch =

                book.title
                    .toLowerCase()
                    .includes(search)

                ||

                book.author
                    .toLowerCase()
                    .includes(search)

                ||

                book.category
                    .toLowerCase()
                    .includes(search)

                ||

                (book.isbn || "")
                    .toLowerCase()
                    .includes(search);


            const categoryMatch =
                !category ||
                book.category === category;


            const statusMatch =
                !status ||
                book.status === status;


            return (
                searchMatch &&
                categoryMatch &&
                statusMatch
            );

        });


    if (filteredBooks.length === 0) {

        container.innerHTML = `
            <div class="empty">
                No books found.
            </div>
        `;

        return;
    }


    container.innerHTML =
        filteredBooks
            .map(
                book => createBookCard(book)
            )
            .join("");

}


/* =========================================
   CREATE BOOK CARD
========================================= */

function createBookCard(book) {

    const statusClass =
        book.status === "Available"
            ? "available"
            : "borrowed";


    const buttonText =
        book.status === "Available"
            ? "Borrow"
            : "Return";


    return `

        <article class="book-card">

            <div class="book-header">

                <div>

                    <h3 class="book-title">
                        ${escapeHTML(book.title)}
                    </h3>

                    <p class="book-author">
                        by ${escapeHTML(book.author)}
                    </p>

                </div>


                <span class="status ${statusClass}">
                    ${book.status}
                </span>

            </div>


            <div class="book-tags">

                <span class="tag">
                    ${escapeHTML(book.category)}
                </span>


                ${
                    book.isbn
                    ?
                    `
                    <span class="tag">
                        ISBN:
                        ${escapeHTML(book.isbn)}
                    </span>
                    `
                    :
                    ""
                }

            </div>


            <p class="book-description">

                ${
                    escapeHTML(
                        book.description ||
                        "No description available."
                    )
                }

            </p>


            <div class="book-actions">

                <button
                    class="borrow-btn"
                    onclick="toggleBorrow(${book.id})"
                >
                    ${buttonText}
                </button>


                <button
                    class="edit-btn"
                    onclick="editBook(${book.id})"
                >
                    Edit
                </button>


                <button
                    class="delete-btn"
                    onclick="deleteBook(${book.id})"
                >
                    Delete
                </button>

            </div>

        </article>

    `;

}


/* =========================================
   ADD BOOK MODAL
========================================= */

function openAddBookModal() {

    document.getElementById(
        "modalTitle"
    ).textContent =
        "Add New Book";


    document.getElementById(
        "bookForm"
    ).reset();


    document.getElementById(
        "bookId"
    ).value = "";


    document.getElementById(
        "bookModal"
    ).classList.add("show");

}


/* =========================================
   CLOSE BOOK MODAL
========================================= */

function closeBookModal() {

    document.getElementById(
        "bookModal"
    ).classList.remove("show");

}


/* =========================================
   SAVE BOOK
========================================= */

document.getElementById(
    "bookForm"
).addEventListener(
    "submit",
    function(event) {

        event.preventDefault();


        const id =
            document.getElementById(
                "bookId"
            ).value;


        const title =
            document.getElementById(
                "bookTitle"
            ).value.trim();


        const author =
            document.getElementById(
                "bookAuthor"
            ).value.trim();


        const category =
            document.getElementById(
                "bookCategory"
            ).value.trim();


        const isbn =
            document.getElementById(
                "bookISBN"
            ).value.trim();


        const description =
            document.getElementById(
                "bookDescription"
            ).value.trim();


        if (id) {

            /* EDIT EXISTING BOOK */

            const book =
                books.find(
                    item =>
                        item.id == id
                );


            book.title =
                title;


            book.author =
                author;


            book.category =
                category;


            book.isbn =
                isbn;


            book.description =
                description;

        }

        else {

            /* ADD NEW BOOK */

            const newBook = {

                id:
                    Date.now(),

                title:
                    title,

                author:
                    author,

                category:
                    category,

                isbn:
                    isbn,

                description:
                    description,

                status:
                    "Available"

            };


            books.push(
                newBook
            );

        }


        saveData();


        closeBookModal();


        render();

    }
);


/* =========================================
   EDIT BOOK
========================================= */

function editBook(id) {

    const book =
        books.find(
            item =>
                item.id === id
        );


    if (!book) {
        return;
    }


    document.getElementById(
        "modalTitle"
    ).textContent =
        "Edit Book";


    document.getElementById(
        "bookId"
    ).value =
        book.id;


    document.getElementById(
        "bookTitle"
    ).value =
        book.title;


    document.getElementById(
        "bookAuthor"
    ).value =
        book.author;


    document.getElementById(
        "bookCategory"
    ).value =
        book.category;


    document.getElementById(
        "bookISBN"
    ).value =
        book.isbn || "";


    document.getElementById(
        "bookDescription"
    ).value =
        book.description || "";


    document.getElementById(
        "bookModal"
    ).classList.add("show");

}


/* =========================================
   DELETE BOOK
========================================= */

function deleteBook(id) {

    const book =
        books.find(
            item =>
                item.id === id
        );


    if (!book) {
        return;
    }


    const confirmDelete =
        confirm(
            `Delete "${book.title}"?`
        );


    if (!confirmDelete) {
        return;
    }


    books =
        books.filter(
            item =>
                item.id !== id
        );


    saveData();


    render();

}


/* =========================================
   BORROW BOOK
========================================= */

let selectedBookId = null;


function toggleBorrow(id) {

    const book =
        books.find(
            item =>
                item.id === id
        );


    if (!book) {
        return;
    }


    /* RETURN BOOK */

    if (
        book.status ===
        "Borrowed"
    ) {

        book.status =
            "Available";


        const activeHistory =
            history.find(
                item =>
                    item.book ===
                    book.title
                    &&
                    item.returned ===
                    "—"
            );


        if (activeHistory) {

            activeHistory.returned =
                getToday();

        }


        saveData();


        render();


        return;
    }


    /* BORROW BOOK */

    selectedBookId =
        id;


    document.getElementById(
        "borrowPerson"
    ).value = "";


    document.getElementById(
        "borrowModal"
    ).classList.add("show");

}


/* =========================================
   CONFIRM BORROW
========================================= */

function confirmBorrow() {

    const person =
        document.getElementById(
            "borrowPerson"
        ).value.trim();


    if (!person) {

        alert(
            "Please enter the person's name."
        );

        return;
    }


    const book =
        books.find(
            item =>
                item.id ===
                selectedBookId
        );


    if (!book) {
        return;
    }


    book.status =
        "Borrowed";


    history.unshift({

        book:
            book.title,

        person:
            person,

        borrowed:
            getToday(),

        returned:
            "—"

    });


    saveData();


    closeBorrowModal();


    render();

}


/* =========================================
   CLOSE BORROW MODAL
========================================= */

function closeBorrowModal() {

    document.getElementById(
        "borrowModal"
    ).classList.remove("show");

}


/* =========================================
   TODAY'S DATE
========================================= */

function getToday() {

    return new Date()
        .toISOString()
        .split("T")[0];

}


/* =========================================
   DISPLAY HISTORY
========================================= */

function displayHistory() {

    const container =
        document.getElementById(
            "historyContainer"
        );


    if (history.length === 0) {

        container.innerHTML = `

            <p class="empty">
                No borrowing history yet.
            </p>

        `;

        return;
    }


    let html = `

        <div class="
            history-row
            history-header
        ">

            <div>
                Book
            </div>

            <div>
                Borrowed By
            </div>

            <div>
                Borrowed Date
            </div>

            <div>
                Returned
            </div>

        </div>

    `;


    history.forEach(item => {

        html += `

            <div class="history-row">

                <div>
                    ${escapeHTML(item.book)}
                </div>

                <div>
                    ${escapeHTML(item.person)}
                </div>

                <div>
                    ${item.borrowed}
                </div>

                <div>
                    ${item.returned}
                </div>

            </div>

        `;

    });


    container.innerHTML =
        html;

}


/* =========================================
   SEARCH
========================================= */

document.getElementById(
    "searchInput"
).addEventListener(
    "input",
    displayBooks
);


/* =========================================
   CATEGORY FILTER
========================================= */

document.getElementById(
    "categoryFilter"
).addEventListener(
    "change",
    displayBooks
);


/* =========================================
   STATUS FILTER
========================================= */

document.getElementById(
    "statusFilter"
).addEventListener(
    "change",
    displayBooks
);


/* =========================================
   CLOSE MODAL WHEN CLICKING OUTSIDE
========================================= */

document.getElementById(
    "bookModal"
).addEventListener(
    "click",
    function(event) {

        if (
            event.target ===
            this
        ) {

            closeBookModal();

        }

    }
);


document.getElementById(
    "borrowModal"
).addEventListener(
    "click",
    function(event) {

        if (
            event.target ===
            this
        ) {

            closeBorrowModal();

        }

    }
);


/* =========================================
   START APPLICATION
========================================= */

render();