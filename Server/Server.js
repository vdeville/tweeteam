var fs = require("fs"),
    app = require("http").createServer(handler),
    io = require("socket.io").listen(app, { log: false }),
    theport = process.env.PORT || 3000,
    twitter = require("ntwitter");

app.listen(theport);
console.log ("http server on port: " + theport);

function handler (req, res) {

    res.end('test');
}

var tw = new twitter({
        consumer_key: "",
        consumer_secret: "",
        access_token_key: "",
        access_token_secret: ""
    }),
    track,
    users = [];

io.sockets.on("connection", function(socket)
{

    if(users.indexOf(socket.id) === -1) {
        users.push(socket.id);
    }

    logConnectedUsers();

    socket.on("start stream", function(t) {
        socket.stream = null;
        var track = t;
        if(socket.stream === null)
        {
            tw.stream("statuses/filter",
            {
                track: track
            }, function(s)
             {
                socket.stream = s;
                socket.stream.on("data", function(data) {

                    if(users.length > 0) {

                        socket.emit("new tweet", data);
                    }
                    else if(socket.stream)
                    {
                        socket.stream.destroy();
                        socket.stream = null;
                    }
                });
                socket.stream.on('error', function(error, code) {
                    console.log("Error: " + error + ": " + code);
                });
             });
        }
    });

    function resolveLocation(location)
    {
        tw.get('https://api.twitter.com/1.1/geo/id/df51dec6f4ee2b2c.json', {'place_id': location}, function(data)
        {
            console.log(data);
        })
    }

    socket.on("disconnect", function(o) {

        var index = users.indexOf(socket.id);
        if(index != -1) {
            users.splice(index, 1);
        }
        logConnectedUsers();
    });

    socket.emit("connected");
});

function logConnectedUsers() {
    console.log("============= CONNECTED USERS ==============");
    console.log("==  ::  " + users.length);
    console.log("============================================");
}
