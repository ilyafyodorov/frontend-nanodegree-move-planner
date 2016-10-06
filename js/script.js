
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // load streetview
    
	var streetStr = $('#street').val();
	var cityStr = $('#city').val();
	var address = streetStr + ', ' + cityStr;
	
	var googleRequest = 'http://maps.googleapis.com/maps/api/streetview?size=600x300&location='
	googleRequest = googleRequest + address;
	$body.append('<img class="bgimg" src="'+googleRequest+'">');
    
    var url = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
    url += '?' + $.param({
      'api-key': "3f46617091bd497c9c5c475654d69ebe",
      'q': cityStr
    });
    
    // NYT articles
    
    $.ajax({
      url: url,
      method: 'GET',
    }).done(function(result) {
      
      var articles = result.response.docs;
      var items = [];
      var headline;
      var content;
      var link
      for (i = 0; i < articles.length; i++) {
        headline=articles[i].headline.main;
        link=articles[i].web_url;
        content=articles[i].lead_paragraph;
        items.push( '<li class="article"><a href="'+ link + '">' + headline + '</a><p>' + content + '</p></li>' );
      }
      $("#nytimes-articles").append(items.join( "" ));
      
    }).error(function(err) {
      $("#nytimes-articles").append('<h1>Articles could not be found</h1>');
      throw err;
    });
    
    // Wikipedia
    
    //$.getJSON("http://en.wikipedia.org/w/api.php?action=parse&format=json&callback=?", {page:"Red Sea clownfish", prop:"text"}, function(data) {console.log(data);});
    
    //$.getJSON("http://en.wikipedia.org/w/api.php?action=query&list=search&srsearch="+title+"&format=json&callback=?", function(data) {
    //    console.log(data);
    //});
    
    var link2;
    
    var wikiRequestTimeout = setTimeout(function(){
        $wikiElem.text("failed to get wikipedia resources");
    }, 8000);
    
    
    $.ajax({
      url: 'http://en.wikipedia.org/w/api.php',
      data: { action: 'query', list: 'search', srsearch: cityStr, format: 'json' },
      dataType: 'jsonp',
      success: function (x) {
        console.log(x);
        
        link2='https://en.wikipedia.org/wiki/'+x.query.search[0].title;
        $("#wikipedia-links").append('<li class="article"><a href="'+ link2 + '">'+x.query.search[0].title+'</a></li>');
        
        clearTimeout(wikiRequestTimeout);
        
      }
    });  
    
    /*
    
    $.ajax({
       //stuff
    }).done(function(){
       //do math
    });
    
    */
    
    
    return false;
};

$('#form-container').submit(loadData);
