var screenName = [];
var profileImage = [];
var text = [];

$( document ).ready(function() {
    loadTweets();
});

function loadTweets(){

    $.ajax({
            type:"GET",
            url:"https://www.googleapis.com/download/storage/v1/b/mh-api-project/o/tweets.json?alt=media",
            dataType:"json",
            success: parseTweets
});


}

function parseTweets(data){
  console.log(data);

  for (var i = 0, len = data.length; i < len; ++i){

    screenName = (data[i]["screenName"]);
    profileImage = (data[i]["profileImage"]);
    text = (data[i]["text"]);

    var html = '<div class="row" id="twit"><div class="col-sm-1 id="twitImage""> <img class="bioImage" alt="" src="' + profileImage + '" /></div>';
        html += '<div class="col-sm-11">';
        html += '<p><strong>' + screenName + '</strong></p>';
        html += '<p> ' + text + '</p>' ;
        html += '</div>';
        html += '</div>';

        $('dl').append(html);
}
// $('dl').append($(html));
}
// $('dl').append($(html));
