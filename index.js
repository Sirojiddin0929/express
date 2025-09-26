let express = require("express")
let { readBooks, writeBooks } = require("./db")

let app = express()
app.use(express.json())


app.get("/", (req, res) => {
    res.send({ message: "Book Service API ishlayapti " })
})


app.get("/books", async (req, res) => {
    try {
        let books = await readBooks()
        res.send(books)
    } catch (err) {
        res.status(500).send({ message: err.message })
    }
})


app.get("/books/:id", async (req, res) => {
    try {
        let { id } = req.params
        let books = await readBooks()
        let book = books.find(b => b.id === id)

        if (!book) {
            return res.status(404).send({ message: "Kitob topilmadi" })
        }
        res.send(book)
    } catch (err) {
        res.status(500).send({ message: err.message })
    }
})


app.post("/books", async (req, res) => {
    try {
        let { title, author, year } = req.body
        if (!title || !author || !year) {
            return res.status(400).send({ message: "title, author, year majburiy" })
        }

        let books = await readBooks()
        let book = {
            id: Math.random().toString(36).substr(2, 9),
            title,
            author,
            year
        }
        books.push(book)
        await writeBooks(books)

        res.status(201).send(book)
    } catch (err) {
        res.status(500).send({ message: err.message })
    }
})


app.put("/books/:id", async (req, res) => {
    try {
        let { id } = req.params
        let { title, author, year } = req.body

        let books = await readBooks()
        let bookIndex = books.findIndex(b => b.id === id)

        if (bookIndex === -1) {
            return res.status(404).send({ message: "Kitob topilmadi" })
        }

        let book = books[bookIndex]

        
        if (title !== undefined) book.title = title
        if (author !== undefined) book.author = author
        if (year !== undefined) book.year = year

        
        books[bookIndex] = book
        await writeBooks(books)

        
        res.send(book)
    } catch (err) {
        res.status(500).send({ message: err.message })
    }
})



app.delete("/books/:id", async (req, res) => {
    try {
        let { id } = req.params
        let books = await readBooks()
        let bookIndex = books.findIndex(b => b.id === id)

        if (bookIndex === -1) {
            return res.status(404).send({ message: "Kitob topilmadi" })
        }

        let deletedBook = books.splice(bookIndex, 1)[0]
        await writeBooks(books)

        res.send({ message: "Kitob ochirildi", deleted: deletedBook })
    } catch (err) {
        res.status(500).send({ message: err.message })
    }
})


app.listen(7000, () => {
    console.log("Server running on port 7000 ")
})
