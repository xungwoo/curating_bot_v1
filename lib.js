/**
 * Created by Administrator on 2018-01-28.
 */
'use strict';

const
    steem = require("steem");

steem.api.setOptions({ url: 'https://api.steemit.com' });

const
    MAX_POST_TO_READ_PER_QUERY = 100;

console.log("test");




function getPosts_recursive(prevPosts, stopAtPost, limit, callback) {
    console.log("test4");
    var posts;
    if (prevPosts == null || prevPosts === undefined) {
        posts = [];
    } else {
        posts = prevPosts;
    }
    var query = {
        limit: MAX_POST_TO_READ_PER_QUERY
    };
    if (posts.length > 0) {
        query.start_permlink = posts[posts.length - 1].permlink;
        query.start_author = posts[posts.length - 1].author;
    }
    steem.api.getDiscussionsByCreated(query, function(err, res) {
        if (err || res == null || res === undefined) {
            //callback({message: "error: "+(err != null ? err.message + ", " + JSON.stringify(err.payload) : "null result")}, null);
            return;
        }
        // skip first post in results if search with permlink and author
        // as that will be the first and we already have it from the last page
        var limitReached = false;
        for (let i = (query.start_permlink === undefined ? 0 : 1) ; i < res.length ; i++) {
            // #57, check for null post in list
            if (res[i] === undefined || res[i] == null) {
                console.log("getPosts_recursive, a post object is null, skipping");
                continue;
            }
            if (stopAtPost !== undefined && stopAtPost != null && res[i].id == stopAtPost.id) {
                console.log("getPosts_recursive, limit reached at last post");
                limitReached = true;
                break;
            }
            posts.push(res[i]);
            if (posts.length >= limit) {
                console.log("getPosts_recursive, limit reached at max num to fetch");
                limitReached = true;
                break;
            }
        }
        console.log("getPosts_recursive, posts now " + posts.length);
        if (limitReached || res.length < MAX_POST_TO_READ_PER_QUERY || posts.length == 0) {
            console.log("getPosts_recursive, finished");
            callback(null, posts);
        } else {
            getPosts_recursive(posts, stopAtPost, limit, callback);
        }
    });
}





module.exports.getPosts_recursive = getPosts_recursive;