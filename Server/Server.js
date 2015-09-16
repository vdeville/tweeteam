var fs = require("fs"),
    app = require("http").createServer(handler),
    io = require("socket.io").listen(app, { log: false }),
    theport = process.env.PORT || 3000,
    twitter = require("ntwitter");

io.set('heartbeats', false);
app.listen(theport);
console.log ("http server on port: " + theport);

function handler (req, res) {

}

var tw = new twitter({
    consumer_key        : "O4Hhtf1mTUfCMmICOGNcLPP9X",
    consumer_secret     : "c8todcqVU2w5Fk51Qk0aLukvyIwGJ1V4x4NLpTKGq9TEyLWc1f",
    access_token_key    : "2478411144-b08QFN42lFhe8INmBIpmob74OefFGS85uAeI29j",
    access_token_secret : "SxSCqKIjMRoJKsbH4lSd1ikETe8I9PO8kpl2GiGnifw0Y"
}), users = [], nbTweets = 0;



var track = 'elysée';

io.sockets.on("connection", function(socket)
{
    if (users.indexOf(socket.id) === -1)
        users.push(socket.id);


    logConnectedUsers();

    socket.on("disconnect", function(o)
    {
        var index = users.indexOf(socket.id);
        if(index != -1)
            users.splice(index, 1);
    });
});

tw.stream("statuses/filter",
{
    track: track
},
function(stream)
{
    stream.on("data", function(data)
    {
        nbTweets++;
        console.log(nbTweets);
        io.sockets.emit('new tweet', data);
    });

    stream.on('error', function(error)
    {
        console.log(error);
    });
});


logConnectedUsers();

function resolveLocation(location)
{
    tw.get('https://api.twitter.com/1.1/geo/id/df51dec6f4ee2b2c.json', {'place_id': location}, function(data)
    {
        console.log(data);
    });
}

function logConnectedUsers() {
    console.log("============= CONNECTED USERS ==============");
    console.log("==  ::  " + users.length);
    console.log("============================================");
}
