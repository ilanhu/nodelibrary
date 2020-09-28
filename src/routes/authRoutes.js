var express = require('express');
var { MongoClient, ObjectID } = require('mongodb');
var debug = require('debug')('app:authRoutes');
const passport = require('passport');

var authRouter = express.Router();


function router(nav) {
    authRouter.route('/signup')
        .post((req, res) => {
            // create a user
            var { username, password } = req.body;
            const url = 'mongodb://localhost:27017';
            const dbName = 'libraryApp';

            (async function addUser() {
                let client;
                try {
                    client = await MongoClient.connect(url);
                    debug('Connected to Mongo server');

                    const db = client.db(dbName);
                    const collection = db.collection('users');
                    const user = { username, password };
                    const result = await collection.insertOne(user);
                    debug(result);

                    req.login(result.ops[0], () => {
                        res.redirect('/auth/profile');
                    });

                } catch (err) {
                    debug(err.stack);
                }
                client.close();
            }());
        });
    authRouter.route('/profile')
        .all((req, res, next) => {
            if (req.user) {
                next();
            } else {
                res.redirect('/');
            }
        })
        .get((req, res) => {
            res.json(req.user);
        });
    authRouter.route('/signin')
        .get((req, res) => {
            res.render('signin', {
                nav,
                title: 'Sign In'
            });
        })
        .post(passport.authenticate('local', {
            successRedirect: '/auth/profile',
            failureRedirect: '/'
        }));

        return authRouter;
}


module.exports = router;