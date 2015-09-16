new Twitter('192.168.1.39:3000', function(tweet)
{
    console.log(tweet);
    $.get('Templates/tweet.html', function(data)
    {
        $('#tweet_list').prepend(Mustache.render(data, tweet));
    });
});


$('.tweet_date').timeago();