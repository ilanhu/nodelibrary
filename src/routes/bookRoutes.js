var express = require('express');
var bookRouter = express.Router();
const bookController = require('../controllers/bookController');
const bookService = require('../services/goodreadsservice');

function router(nav) {
    const { getIndex, getById, middleware } = bookController(bookService, nav);
    bookRouter.use(middleware);
    bookRouter.route('/')
        .get(getIndex);

    bookRouter.route('/:id')
        .get(getById);
    return bookRouter;
}


module.exports = router;