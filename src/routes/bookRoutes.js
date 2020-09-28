var express = require('express');
var bookRouter = express.Router();
var { MongoClient, ObjectID } = require('mongodb');
var debug = require('debug')('app:bookRoutes');
const sql = require('mssql');

function router(nav) {
    bookRouter.use((req, res, next) => {
        if (req.user) {
            next();
        } else {
            res.redirect('/');
        }
    });
    bookRouter.route('/')
        .get((req, res) => {
            const url = 'mongodb://localhost:27017';
            const dbName = 'libraryApp';

            (async function mongo() {
                let client;
                try {
                    client = await MongoClient.connect(url);
                    debug('Connected to Mongo server');

                    const db = client.db(dbName);
                    const collection = await db.collection('books');

                    const books = await collection.find().toArray();
                    debug(books);

                    res.render('bookListView',
                        {
                            title: 'My Library',
                            nav,
                            books
                        });
                } catch (err) {
                    debug(err.stack);
                }

                client.close();

            }());
        });

    bookRouter.route('/:id')
        .get((req, res) => {
            const { id } = req.params;
            const url = 'mongodb://localhost:27017';
            const dbName = 'libraryApp';

            (async function mongo() {
                let client;
                try {
                    client = await MongoClient.connect(url);
                    debug('Connected correctly to Mongo server');

                    const db = client.db(dbName);

                    const col = await db.collection('books');

                    const book = await col.findOne({ _id: new ObjectID(id) });
                    debug(book);
                    res.render(
                        'bookView',
                        {
                            nav,
                            title: 'Library',
                            book
                        }
                    );
                } catch (err) {
                    debug(err.stack);
                }
            }());
        });
    return bookRouter;
}


module.exports = router;