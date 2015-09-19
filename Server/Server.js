var
fs        = require('fs'),
app       = require('http').createServer(),
io        = require('socket.io').listen(app),
port      = process.env.PORT || 3000,
twitter   = require('./TweetLib.js');
config    = require('./Config.js');

var Datastore = require('nedb'),
db        = new Datastore(
{
    filename: 'tweets.db',
    autoload: true
}),
users    = [],
tracks   =
[
    {screen_name: 'fhollande',  count: 15},
    {screen_name: 'elysee',     count: 15},
    {screen_name: 'elysee_com', count: 15}
];

app.listen(port);

// Config.js object structure
// consumer_key
// consumer_secret
// access_token_secret
// access_token_key
twitter.init(config, db);

var refreshHistory = 0;
twitter.getLastTweets(tracks, function()
{
    refreshHistory++;
    if(refreshHistory == tracks.length)
    {
        twitter.stream(tracks, function(tweet)
        {
            io.sockets.emit('new tweet',
            {
                id          : tweet.id_str,
                text        : tweet.text,
                created_at  : tweet.created_at,
                user        : {screen_name : tweet.user.screen_name},
                place       : tweet.place
            });
        });

        io.sockets.on("connection", function(socket)
        {
            if (users.indexOf(socket.id) === -1)
                users.push(socket.id);

            db.find({}, function(err, history)
            {
                history.sort(function(a, b)
                { return new Date(b.created_at) - new Date(a.created_at); });

                socket.emit('tweets history', history);
            });

            logConnectedUsers();

            socket.on("disconnect", function(o)
            {
                var index = users.indexOf(socket.id);
                if(index != -1)
                    users.splice(index, 1);
            });
        });
    }
});

function logConnectedUsers()
{
    console.log("============= CONNECTED USERS ==============");
    console.log("==  ::  " + users.length);
    console.log("============================================");
}
