var Twitter = function(host, callback)
{
    this.host     = host || null;
    this.callback = callback || null;
    this.socket   = null;
    this.randomAnimations = [ 'fadeInDown'];

    if(typeof callback == 'function')
        this.init(callback);

    return this;
};

Twitter.prototype.init = function(callback)
{
    var that = this;
    this.socket = io.connect(this.host);
    this.socket.on('tweets history', function(lastTweets)
    {
        for(var tweet in lastTweets)
        {
            lastTweets[tweet].animation     = that.addRandomAnimation();
            lastTweets[tweet].text          = that.parseUrls(lastTweets[tweet].text);
            lastTweets[tweet].original_date = lastTweets[tweet].created_at;
            lastTweets[tweet].created_at    = that.parseDate(lastTweets[tweet].created_at);
        }

        callback('history', lastTweets);
    });

    this.socket.on('new tweet', function(tweet)
    {
        tweet.animation     = that.addRandomAnimation();
        tweet.text          = that.parseUrls(tweet.text);
        tweet.original_date = tweet.created_at;
        tweet.created_at    = that.parseDate(tweet.created_at);

        callback('new', tweet);
    });
};


Twitter.prototype.addRandomAnimation = function()
{
    return this.randomAnimations[~~(Math.random() * this.randomAnimations.length)];
};

Twitter.prototype.parseUrls = function(text)
{
    if(typeof text !== 'undefined')
        return text.replace(/(https?:\/\/[^\s]+)/g, function(url)
        { return '<a href="' + url + '" target="blank">' + url + '</a>'; });
};

Twitter.prototype.parseDate = function(created_at)
{
    var timeStamp   = new Date(Date.parse(created_at.replace(/( \+)/, ' UTC$1')));
    var now         = new Date();
    var secondsPast = (now.getTime() - timeStamp.getTime() + 35000) / 1000;

    if(secondsPast <= 0)
        return 'A l\'instant';
    if(secondsPast < 60)
        return ~~(secondsPast) + 's';
    if(secondsPast < 3600)
        return ~~(secondsPast/60) + 'm';
    if(secondsPast <= 86400)
        return ~~(secondsPast/3600) + 'h';

    if(secondsPast > 86400)
    {
        var day   = timeStamp.getDate();
        var month = timeStamp.toDateString().match(/ [a-zA-Z]*/)[0].replace(" ","");
        var year  = timeStamp.getFullYear() == now.getFullYear() ? "" :  " "+timeStamp.getFullYear();
        return day + " " + month + year;
    }
};