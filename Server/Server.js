var fs = require("fs"),
    app = require("http").createServer(handler),
    io = require("socket.io").listen(app, { log: false }),
    theport = process.env.PORT || 3000;
    var tweeter = require('ntwitter');
app.listen(theport);
console.log ("http server on port: " + theport);

function handler (req, res) {

}


var Stream = require('user-stream');
var twitter = new tweeter({
    consumer_key        : "O4Hhtf1mTUfCMmICOGNcLPP9X",
    consumer_secret     : "c8todcqVU2w5Fk51Qk0aLukvyIwGJ1V4x4NLpTKGq9TEyLWc1f",
    access_token_key    : "2478411144-b08QFN42lFhe8INmBIpmob74OefFGS85uAeI29j",
    access_token_secret : "SxSCqKIjMRoJKsbH4lSd1ikETe8I9PO8kpl2GiGnifw0Y"
});

var users = [], nbTweets = 0;

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


twitter.stream('statuses/filter',
{
    follow:
    [
        18814998,
        16717501,
        1464243415
    ]
},
function(stream)
{
    stream.on('data', function(data)
    {
        nbTweets++;

        var image = null;
        if(typeof data.extended_entities !== 'undefined')
            if(data.extended_entities.media.length > 0)
                image = data.extended_entities.media[0].media_url;

        io.sockets.emit('new tweet',
        {
            image       : image,
            id          : data.id_str,
            text        : data.text,
            created_at  : data.created_at,
            screen_name : data.user.screen_name,
            place       : data.place
        });
    });
});



function logConnectedUsers() {
    console.log("============= CONNECTED USERS ==============");
    console.log("==  ::  " + users.length);
    console.log("============================================");
}
