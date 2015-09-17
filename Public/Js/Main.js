var waitingTweets = [];
var newTweets     = 0;
var tweets        = [];
var current       = 0;
var flow_rate     = 2500;
var limit         = 3;

$.get('Templates/tweet.html', function(template)
{
    new Twitter('localhost:3000', function(tweet)
    {
        var scroll = $(window).scrollTop();
        if(scroll > 0)
        {
            newTweets++;
            waitingTweets.push(tweet);
            $.get('Templates/waitingTweets.html', function(waiting_tpl)
            {
                var sentence = 'Voir '+newTweets+' nouveau'+(newTweets>1?'x':'')+' tweet'+(newTweets>1?'s':'');
                if($('#waitingTweets').length > 0)
                {
                    $('#waitingTweets').html(Mustache.render(waiting_tpl,
                    {
                        waitingTweets: sentence
                    }));
                }
                else
                {
                    $('#tweet_list').prepend(Mustache.render(waiting_tpl,
                    {
                        waitingTweets: sentence
                    }));
                }
            });
        }
        else if(waitingTweets.length == 0)
        {
            var randomAnimations = ['bounceInDown', 'bounceInLeft', 'bounceInRight'];
            tweet.animation = randomAnimations[~~(Math.random() * randomAnimations.length)];
            tweet.text = parseUrls(tweet.text);
            tweets.push(Mustache.render(template, tweet));
        }
        else
        {
            $('#showWaitingTweets').on('click', function(event)
            {
                event.preventDefault();
                var waiting = '';
                for(var t in waitingTweets)
                    waiting += Mustache.render(template, waitingTweets[t]);
                $('#waitingTweets').html(waiting);
            });
        }
    });
});


function parseUrls(text)
{
    if(text.length && typeof text !== 'undefined')
        return text.replace(/(https?:\/\/[^\s]+)/g, function(url)
        { return '<a href="' + url + '" target="blank">' + url + '</a>'; });
}

setInterval(function()
{
    if(tweets.length > 0)
    {
        $('#tweet_list').prepend(tweets[current]);
        $('#tweet_list .tweet').first().addClass('tweet_border_bottom');
        var count = $('#tweet_list .tweet').length;
        if (count > limit) $('#tweet_list .tweet:last-child').remove();
        current++;
        tweets.shift();
        console.log(tweets.length);
        $('[data-toggle="tooltip"]').tooltip();
    }
}, flow_rate);
