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
    var that = this;
    this.socket = io.connect(this.host);
    this.socket.on('new tweet', function(data)
    {
        if(data.created_at)
            data.created_at = that.parseDate(data.created_at);
        callback(data);
    });
};

Twitter.prototype.parseDate = function(tdate)
{
    var system_date = new Date(Date.parse(tdate));
    var user_date = new Date();
    if(K.ie) system_date = Date.parse(tdate.replace(/( \+)/, ' UTC$1'));

    var diff = Math.floor((user_date - system_date) / 1000);
    if (diff <= 0) { return "A l'instant";}
    if (diff < 20) {return "il y a " + diff + " secondes";}
    if (diff < 40) {return "il y a une minute";}
    if (diff < 60) {return "il y a moins d'une minute";}
    if (diff <= 90) {return "il y a une minute";}
    if (diff <= 3540) {return "il y a " + Math.round(diff / 60) + " minutes";}
    if (diff <= 5400) {return "il y a 1 heure";}
    if (diff <= 86400) {return "il y a " + Math.round(diff / 3600) + " heures";}
    if (diff <= 129600) {return "il y a 1 jour";}
    if (diff < 604800) {return "il y a " + Math.round(diff / 86400) + " jours";}
    if (diff <= 777600) {return "il y a 1 semaine";}

    return system_date;
};

var K = function ()
{
    return {ie: navigator.userAgent.match(/MSIE\s([^;]*)/)}
}();