$(function($)
{
    $("#map_svg").css("width", window.innerWidth).css("height", window.innerHeight);

    Map.init(function(svg, projection)
    {
        var
        waitingTweets    = [],
        newTweets        = 0,
        tweets           = [],
        current          = 0,
        flow_rate        = 2500,
        limit            = 100,
        tweet_list       = $('#tweet_list');

        $.get('Templates/tweet.html', function(template)
        {
            new Twitter('localhost:3000', function(type, data)
            {
                if(type == 'history')
                    showHistory(data, template);
                if(type == 'new')
                    addTweet(data, template);
            });

            function showHistory(lastTweets, template)
            {
                $(tweet_list).empty();
                for(var tweet in lastTweets)
                    $(tweet_list).append(Mustache.render(template, lastTweets[tweet]));
            }

            function addTweet(tweet, template)
            {
                var scroll = $(tweet_list).scrollTop();
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
                            $('#tweet_list').before(Mustache.render(waiting_tpl, { waitingTweets: sentence }));
                    });
                }
                else if(waitingTweets.length == 0)
                {
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

                $(document.body).delegate('#showWaitingTweets', 'click', function(event)
                {
                    event.preventDefault();
                    $(tweet_list).animate({scrollTop: 0}, 600);

                    var waiting = '';
                    for(var t in waitingTweets)
                        waiting += Mustache.render(template, waitingTweets[t]);

                    $('#waitingTweets').fadeOut(500, function(){ $(this).remove(); });
                    $(tweet_list).prepend(waiting);
                    waitingTweets = [];
                    newTweets = 0;
                });
            }

            setInterval(function()
            {
                if(tweets.length > 0)
                {
                    $(tweet_list).prepend(tweets[current]);
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
                else current = 0;
            }, flow_rate);
        });
    });
});

var twitter = new Twitter();
setInterval(function()
{
    $('.tweet_date').each(function(i, tweet)
    {
        $(tweet).text(twitter.parseDate($(tweet).attr('date')));
    })
}, 1000);