var
fs        = require('fs'),
app       = require('http').createServer(),
io        = require('socket.io').listen(app),
port      = process.env.PORT || 3000,
twitter   = require('./TweetLib.js');

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
twitter.init(
{
    consumer_key        : "O4Hhtf1mTUfCMmICOGNcLPP9X",
    consumer_secret     : "c8todcqVU2w5Fk51Qk0aLukvyIwGJ1V4x4NLpTKGq9TEyLWc1f",
    access_token_key    : "2478411144-b08QFN42lFhe8INmBIpmob74OefFGS85uAeI29j",
    access_token_secret : "SxSCqKIjMRoJKsbH4lSd1ikETe8I9PO8kpl2GiGnifw0Y"
}, db);

twitter.getLastTweets(tracks, function(lastTweets)
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

        socket.emit('tweets history', lastTweets);
        logConnectedUsers();

        socket.on("disconnect", function(o)
        {
            var index = users.indexOf(socket.id);
            if(index != -1)
                users.splice(index, 1);
        });
    });
});

function logConnectedUsers()
{
    console.log("============= CONNECTED USERS ==============");
    console.log("==  ::  " + users.length);
    console.log("============================================");
}
