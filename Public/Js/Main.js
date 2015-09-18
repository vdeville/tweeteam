$(function($)
{
    $("#map_svg").css("width", window.innerWidth).css("height", window.innerHeight);

    Map.init(function(svg, projection)
    {
        var waitingTweets    = [];
        var newTweets        = 0;
        var tweets           = [];
        var current          = 0;
        var flow_rate        = 1000;
        var limit            = 20;
        var randomAnimations = [ 'fadeInDown'];

        $.get('Templates/tweet.html', function(template)
        {
            new Twitter('localhost:3000', function(type, data)
            {
                if(type == 'history')
                    showHistory(data, template);
                else if(type == 'new')
                    addTweet(data, template);
            });

            function showHistory(lastTweets, template)
            {
                for(var tweet in lastTweets)
                {
                    lastTweets[tweet].animation = randomAnimations[~~(Math.random() * randomAnimations.length)];
                    lastTweets[tweet].text = parseUrls(lastTweets[tweet].text);
                    $('#tweet_list').append(Mustache.render(template, lastTweets[tweet]));
                }
            }

            function addTweet(tweet, template)
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
                            $('#waitingTweets').html(Mustache.render(waiting_tpl, { waitingTweets: sentence }));
                        else
                            $('#tweet_list').prepend(Mustache.render(waiting_tpl, { waitingTweets: sentence }));
                    });
                }
                else if(waitingTweets.length == 0)
                {
                    tweet.animation = randomAnimations[~~(Math.random() * randomAnimations.length)];
                    tweet.text = parseUrls(tweet.text);

                    if(tweet.place)
                    {
                        var coord =
                        {
                            longitude: tweet.place.bounding_box.coordinates[0][0][0],
                            latitude : tweet.place.bounding_box.coordinates[0][0][1]
                        };

                        svg.append('circle', '.pin')
                        .data([coord])
                        .style('fill', '#ff0000')
                        .attr('transform', function(d)
                        {
                            return 'translate('+projection(
                                [
                                    d.longitude,
                                    d.latitude
                                ])+')'
                        })
                        //.style('opacity', 0)
                        .attr("r", 5)
                        .transition()
                        .duration(2000)
                        .attr('stroke-width', 0.5)
                        .attr("r", 25)
                        .duration(1000)
                        .style('opacity', 0)
                        .transition()
                        .duration(0)
                        .style('opacity', 1)
                        .attr("r", 2);
                    }

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
            }

            function parseUrls(text)
            {
                if(typeof text !== 'undefined')
                    return text.replace(/(https?:\/\/[^\s]+)/g, function(url)
                    { return '<a href="' + url + '" target="blank">' + url + '</a>'; });
            }

            setInterval(function()
            {
                if(tweets.length > 0)
                {
                    $('#tweet_list').prepend(tweets[current]);
                    $(".tweet:not(:first)").animate({'margin-top': 0});
                    $('.tweet').css('margin-top', '0px');
                    $('.tweet').first().animate({'opacity': 1});
                    $('#tweet_list .tweet').first().addClass('tweet_border_bottom');
                    var count = $('#tweet_list .tweet').length;
                    if (count > limit) $('#tweet_list .tweet:last-child').remove();
                    current++;
                    tweets.shift();
                    $('[data-toggle="tooltip"]').tooltip();
                }
            }, flow_rate);
        });
    });
});
