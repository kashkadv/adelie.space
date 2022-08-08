var storage = window.localStorage

var Library = storage.getItem('Library') !== null ? JSON.parse(storage.getItem('Library')) : []

var form = document.querySelector('form');
form.addEventListener('submit', function(event) {
    event.preventDefault()
    const data = new FormData(event.target)
    let errors = false
    for(var key of data.keys()) {
        if(data.get(key).length < 1) {
            errors = true;
            var input = document.querySelector('input[name="' + key + '"]')
            var label = input.nextElementSibling;
            label.classList.add('form__message_error')
            input.addEventListener('keyup', function(event) {
                var label = event.target.nextElementSibling;
                label.classList.remove('form__message_error')
            })
        }
    }
    if(!errors) {
        const book = Book()
        book.add_book(data)
        event.target.reset()
    }
})

const Book = () => {
    const add_book = (data) => {
        var book = {
            title: data.get('title'),
            author: data.get('author'),
            pages: data.get('pages'),
            read: false,
            id: Date.now()
        }        
        Library.push(book)
        storage.setItem('Library', JSON.stringify(Library))
        render_book(book)
    }
    const render_book = (data) => {
        const shelter = document.getElementById("shelter")
        const book = document.createElement("div")
        book.className = 'book'
        book.id = data.id
        const book__inner = document.createElement("div")
        book__inner.className = 'book__inner'
        const book__title = document.createElement('div')
        book__title.className = 'book__title'
        book__title.innerHTML = data.title + ' by ' + data.author
        const book__info = document.createElement('div')
        book__info.className = 'book__info'
        book__info.innerHTML = data.pages + ' pages'
        const book__status = document.createElement('img')
        book__status.className = 'book__status'
        if(data.read) {
            book__status.classList.add('book__status_read')
        }
        book__status.title = 'Book status'
        book__status.src = 'toggle.svg'
        book__status.setAttribute('data-id', data.id)
        book__status.addEventListener('click', function(event) { change_book_status(event, data.id) })
        const book__delete = document.createElement('img')
        book__delete.className = 'book__delete'
        book__delete.title = 'Remove from library'
        book__delete.src = 'trash.svg'
        book__delete.setAttribute('data-id', data.id)        
        book__delete.addEventListener('click', function() { delete_book(data.id) })
        shelter.appendChild(book)
        book.appendChild(book__inner)
        book__inner.appendChild(book__title)
        book__inner.appendChild(book__info)
        book__inner.appendChild(book__status)
        book__inner.appendChild(book__delete)
    }

    const change_book_status = (event, id) => {
        event.target.classList.toggle('book__status_read')
        Library = Library.filter(function(data) {
            if(data.id == id) {
                data.read = data.read ? false : true
            }
            return true
        })
        storage.setItem('Library', JSON.stringify(Library))
    }

    const delete_book = (id) => {
        var book = document.getElementById(id)
        Library = Library.filter(function(data, index) {
            return data.id !== id
        })
        storage.setItem('Library', JSON.stringify(Library))
        book.remove()
    }

    return { add_book, render_book }
}

if(Library.length > 0) {
    Library.forEach(function(data) {
        let book = Book()
        book.render_book(data)
    })
}