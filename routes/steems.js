/**
 * Created by Administrator on 2018-01-28.
 */
var express = require('express');
var router = express.Router();
var lib = require('../lib');

/* GET users listing. */
router.get('/', function(req, res, next) {
    lib.getPosts_recursive([], null, 2000, function(err, res) {
        if (err || res == null || res === undefined) {
            console.log("error: "+(err != null ? err.message + ", " + JSON.stringify(err.payload) : "null result"));
            return;
        }

        const msecPerMinute = 1000 * 60;
        for (let i=0; i<res.length; i++) {
            const post = res[i];
            const postCreated = post.created;
            const date = new Date();
            const nowDate = new Date(date.valueOf() + date.getTimezoneOffset() * 60000);
            const postCreatedDate = new Date(postCreated);

            const elapsed = nowDate.getTime() - postCreatedDate.getTime();
            const elapsedMin = Math.floor(elapsed / msecPerMinute);
            console.log(elapsed);
            console.log('created: ' + postCreatedDate + ' now: ' + nowDate + ' 경과:'  + elapsedMin);


            //setTimeout(function(data) {
            //    console.log(JSON.stringify(data));
            //
            //
            //}, 1000, data)
        }
    });
    res.send('respond with a resource');
});

module.exports = router;
