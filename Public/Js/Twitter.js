var Twitter = function(host, callback)
{
    this.host     = host;
    this.callback = callback;
    this.socket   = null;
    this.init(callback);

    return this;
};

Twitter.prototype.init = function(callback)
{
    this.socket = io.connect(this.host);
    this.socket.on('new tweet', function(data)
    {
        callback(data);
    });
};