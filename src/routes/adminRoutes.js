var express = require('express');
var adminRouter = express.Router();
var { MongoClient } = require('mongodb');
var debug = require('debug')('app:adminRoutes');

const books = [
    {
      title: 'War and Peace',
      genre: 'Historical Fiction',
      author: 'Lev Nikolayevich Tolstoy',
      bookId: 656,
      read: false
    },
    {
      title: 'Les Misérables',
      genre: 'Historical Fiction',
      author: 'Victor Hugo',
      bookId: 24280,
      read: false
    },
    {
      title: 'The Time Machine',
      genre: 'Science Fiction',
      author: 'H. G. Wells',
      bookId: 2493,
      read: false
    },
    {
      title: 'A Journey into the Center of the Earth',
      genre: 'Science Fiction',
      author: 'Jules Verne',
      bookId: 35262749,
      read: false
    },
    {
      title: 'The Dark World',
      genre: 'Fantasy',
      author: 'Henry Kuttner',
      bookId: 1881716,
      read: false
    },
    {
      title: 'The Wind in the Willows',
      genre: 'Fantasy',
      author: 'Kenneth Grahame',
      bookId: 5659,
      read: false
    },
    {
      title: 'Life On The Mississippi',
      genre: 'History',
      author: 'Mark Twain',
      bookId: 99152,
      read: false
    },
    {
      title: 'Childhood',
      genre: 'Biography',
      author: 'Lev Nikolayevich Tolstoy',
      bookId: 53282474,
      read: false
    }];
  

function router(nav) {
    adminRouter.route('/')
        .get((req, res) => {
            const url = 'mongodb://localhost:27017';
            const dbName = 'libraryApp';

            (async function mongo() {
                let client;
                try {
                    client = await MongoClient.connect(url);
                    debug('Connected to Mongo server');

                    const db = client.db(dbName);
                    const response = await db.collection('books').insertMany(books);
                    res.json(response);
                } catch (err) {
                    debug(err.stack);
                }

                client.close();
            }());
        });
    return adminRouter;
}

module.exports = router;
