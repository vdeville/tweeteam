/**
 * Created by Mel on 16/07/2015.
 */
var _socket = null;
var io = require('socket.io-client');
var $ = require('jquery');
var Mustache = require('mustache');
var sentiment = require('sentiment');
var emotions_avg = [];

var Twitter =
{
    socket: null,
    init: function(host, options, callback)
    {
        var start = (new Date()).getTime();
        var nbTweets = 0;
        var hashtags = [];
        if(this.socket)
            socket.close();

        var that = this;
        if(io !== undefined)
        {
            this.socket = io.connect(host);
            this.socket.on('new tweet', function(tweet)
            {
                nbTweets++;
                var color;
                var emotion_score = sentiment(tweet.text);
                score = emotion_score.score;
                emotions_avg.push(score);

                color = 'white';
                if(score <= -4)
                    color = 'red';
                if(score <= -0.4)
                    color =  'orange';
                if(score >= 0.4)
                    color = '#000BFF';
                if(score > 4)
                    color = '#4CD618';


                var match = tweet.text.match(/(^#|\s#)([a-z0-9]+)/gi);
                if(match)
                {
                    addItem = function(tag, items) {
                        var foundItem = items.filter(function(item) {
                            return item.tag === $.trim(tag);
                        })[0];

                        if (foundItem) {
                            foundItem.value++;
                        } else {
                            return items.push({
                                tag: $.trim(tag),
                                value: 1
                            });
                        }
                    };

                    for(x in match)
                        addItem(match[x], hashtags);
                }

                function compare(a,b)
                {
                    if (a.value < b.value)
                        return 1;
                    if (a.value > b.value)
                        return -1;
                    return 0;
                }

                hashtags.sort(compare);

                var hashs = hashtags.slice(1, 10);

                $('#hashtags').empty();
                for(z in hashs)
                    $('#hashtags').append('<li>'+hashs[z].tag+' <span class="pull-right">'+hashs[z].value+'</span></li>');


                var data =
                {
                    text: tweet.text,
                    sentiment: emotion_score,
                    name: tweet.user.name,
                    avatar: tweet.user.profile_image_url,
                    color: color
                };

                if(tweet.place)
                {
                    tweet.place.color = color;
                    callback(tweet.place);
                }

                if(tweet.extended_entities !== undefined)
                    data.image = tweet.extended_entities.media[0].media_url;

                var averageEm = average(emotions_avg, 1);
                avg_color = 'white';
                if(averageEm <= -4)
                    avg_color = 'red';
                if(averageEm <= -0.4)
                    avg_color =  'orange';
                if(averageEm >= 0.4)
                    avg_color = '#000BFF';
                if(averageEm >= 4)
                    avg_color = '#4CD618';

                if(emotions_avg.length > 0)
                {
                    $('#twitter_sentiment_avg span').text(averageEm);
                    $('#sentiment_color').css('background', avg_color);
                }

                var count = $('#tweets .tweet').length;
                if (count > 5) $('#tweets .tweet:last-child').remove();
                var end = (new Date()).getTime();

                $('#tweets_count span').text(nbTweets);
                $('#tweets_rate span').text(that.rate(nbTweets, start, end));
                options.template = '<div class="tweet"><div class="pull-right" style="width: 10px; height: 10px; border-radius: 50%; background-color: '+color+'"></div><p>{{text}}</p></div>';
                $(options.container).prepend(Mustache.render(options.template, data));
            });

            this.socket.on('connected', function(r)
            {
                $(options.form).on('submit', function(event)
                {
                    event.preventDefault();
                    that.call('start stream', $(this).find(options.field).val());
                });
            });
        }
    },

    rate: function(n, start, end)
    {
        var duration = (end - start) / 1000;
        return (n / duration).toFixed(1);
    },

    call: function(signal, data)
    {
        if(this.socket)
            this.socket.emit(signal, data);
        else
            console.log('Shit! Socket.io didn\'t start!');
    }
};

function average(a, d){
    var sum=0;
    var j=0;
    for(var i=0;i<a.length;i++){
        if(isFinite(a[i])){
            sum=sum+parseFloat(a[i]);
            j++;
        }
    }
    if(j===0){
        return 0;
    }else{
        return (sum/j).toFixed(d);
    }

}

module.exports.Twitter = Twitter;