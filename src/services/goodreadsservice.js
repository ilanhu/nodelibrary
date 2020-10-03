const axios = require('axios');
const { response } = require('express');
const xml2js = require('xml2js');
var debug = require('debug')('app:goodreadsService');

const parser = xml2js.Parser( {explicitArray: false} );

function goodreadsService() {
    function getBookById(id) {
        return new Promise((resolve, reject) => {
            axios.get(`https://www.goodreads.com/book/show/${id}.xml?key=3zvnNfNxf4BwExVsus23cw`)
                .then((response) => {
                    parser.parseString(response.data, (err, result)=>{
                        if(err){
                            debug(err);
                        } else {
                            debug(result);
                            resolve(result.GoodreadsResponse.book);
                        }
                    });
                })
                .catch((error) => {
                    reject(error);
                    debug(error);
                });
        })
    }

    return {
        getBookById
    }
}

module.exports = goodreadsService();