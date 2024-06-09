const Hapi = require('@hapi/hapi');
const { nanoid } = require('nanoid');

const init = async () => {
    const server = Hapi.server({
        port: 9000,
        host: 'localhost'
    });

    // Temporary storage for books (replace this with a database in a real application)
    let books = [];

    // Route to save a book
    server.route({
        method: 'POST',
        path: '/books',
        handler: (request, h) => {
            const {
                name,
                year,
                author,
                summary,
                publisher,
                pageCount,
                readPage,
                reading
            } = request.payload;

            // Check if required fields are provided
            if (!name) {
                return h.response({
                    status: 'fail',
                    message: 'Gagal menambahkan buku. Mohon isi nama buku'
                }).code(400);
            }

            // Check if readPage is greater than pageCount
            if (readPage > pageCount) {
                return h.response({
                    status: 'fail',
                    message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
                }).code(400);
            }

            const id = nanoid();
            const finished = pageCount === readPage;
            const insertedAt = new Date().toISOString();

            const newBook = {
                id,
                name,
                year,
                author,
                summary,
                publisher,
                pageCount,
                readPage,
                finished,
                reading,
                insertedAt,
                updatedAt: insertedAt
            };

            books.push(newBook);

            return h.response({
                status: 'success',
                message: 'Buku berhasil ditambahkan',
                data: {
                    bookId: id
                }
            }).code(201);
        }
    });

// Route to get all books
server.route({
    method: 'GET',
    path: '/books',
    handler: (request, h) => {
        const filteredBooks = books.map(({ id, name, publisher }) => ({ id, name, publisher }));
        
        return h.response({
            status: 'success',
            data: {
                books: filteredBooks
            }
        }).code(200);
    }
});



    // Route to get book details by ID
    server.route({
        method: 'GET',
        path: '/books/{bookId}',
        handler: (request, h) => {
            const bookId = request.params.bookId;
            const book = books.find(book => book.id === bookId);

            if (!book) {
                return h.response({
                    status: 'fail',
                    message: 'Buku tidak ditemukan'
                }).code(404);
            }

            return h.response({
                status: 'success',
                data: {
                    book
                }
            }).code(200);
        }
    });

    // Route to update book by ID
    server.route({
        method: 'PUT',
        path: '/books/{bookId}',
        handler: (request, h) => {
            const bookId = request.params.bookId;
            const {
                name,
                year,
                author,
                summary,
                publisher,
                pageCount,
                readPage,
                reading
            } = request.payload;

            const bookIndex = books.findIndex(book => book.id === bookId);

            if (bookIndex === -1) {
                return h.response({
                    status: 'fail',
                    message: 'Gagal memperbarui buku. Id tidak ditemukan'
                }).code(404);
            }

            if (!name) {
                return h.response({
                    status: 'fail',
                    message: 'Gagal memperbarui buku. Mohon isi nama buku'
                }).code(400);
            }

            if (readPage > pageCount) {
                return h.response({
                    status: 'fail',
                    message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
                }).code(400);
            }

            const finished = pageCount === readPage;
            const updatedAt = new Date().toISOString();

            books[bookIndex] = {
                ...books[bookIndex],
                name,
                year,
                author,
                summary,
                publisher,
                pageCount,
                readPage,
                finished,
                reading,
                updatedAt
            };

            return h.response({
                status: 'success',
                message: 'Buku berhasil diperbarui'
            }).code(200);
        }
    });

    // Route to delete book by ID
    server.route({
        method: 'DELETE',
        path: '/books/{bookId}',
        handler: (request, h) => {
            const bookId = request.params.bookId;
            const bookIndex = books.findIndex(book => book.id === bookId);

            if (bookIndex === -1) {
                return h.response({
                    status: 'fail',
                    message: 'Buku gagal dihapus. Id tidak ditemukan'
                }).code(404);
            }

            books.splice(bookIndex, 1);

            return h.response({
                status: 'success',
                message: 'Buku berhasil dihapus'
            }).code(200);
        }
    });

    await server.start();
    console.log(`Server is running on ${server.info.uri}`);
};

init();
