var TweetLib = function()
{
    this.instance = null;
};

TweetLib.prototype.init = function(credentials, db)
{
    var twitter = require('ntwitter');
    this.instance = new twitter(credentials);
    this.db = db;
};

TweetLib.prototype.getLastTweets = function(tracks, callback)
{
    var that = this;
    for(var channel in tracks)
    {
        this.instance.getUserTimeline(
        {
            screen_name : tracks[channel].screen_name,
            count       : tracks[channel].count
        },
        function(err, data)
        {
            if(data.length > 0)
                for(var tweet in data)
                    that.db.insert(data[tweet]);

            callback(data);
        });
    }
};


TweetLib.prototype.stream = function(tracks, callback)
{
    var names = [];
    for(var t in tracks) names.push(tracks[t].screen_name);

    this.instance.stream('user',
    {
        track: names.join(',')
    },
    function(stream)
    {
        stream.on('data', function(data)
        {
            if(typeof data.user !== 'undefined')
                if(names.indexOf(data.user.screen_name) !== -1)
                    callback(data);
        });

        stream.on('error', function(error)
        {
            console.log(error);
        });
    });
};

module.exports = new TweetLib();