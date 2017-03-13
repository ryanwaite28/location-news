function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');
	
    // load streetview

	var streetInfo = $("#street").val();
	var cityInfo = $("#city").val();
	var address = streetInfo + ", " + cityInfo;
	
	$greeting.text("So, you want to live at " + address + "?")
	
	var streetViewURL = 'https://maps.googleapis.com/maps/api/streetview?size=600x400&location=' + address + '';
	$body.append('<img class="bgimg" src="' + streetViewURL + '">')

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    /* ----- YOUR CODE GOES HERE! ----- */
	
	//NewYorkTimes AJAX Request
	
	var nytURL = 'https://api.nytimes.com/svc/search/v2/articlesearch.json?q=' + cityInfo + '&sort=newest&api-key=e3b29ee6890e39977d33529ea6eaff6e:12:73463344'
	
	$.getJSON(nytURL, function(data) {
		console.log(data);
		
		$nytHeaderElem.text('New York Times Articles about ' + cityInfo);
		
		articles = data.response.docs;
		for (var i = 0; i < articles.length; i++) {
			var article = articles[i];
			$nytElem.append('<li class="article">' +
			'<a href="'+ article.web_url + '">' + article.headline.main + '</a>' +			
			'<p>' + article.snippet + '</p>' + '</li>'
			);
		};
		
		
		
	}).error(function() {
		$nytHeaderElem.text('New York Times Could Not Be Loaded');
	})
	
	
	//WikiPedia AJAX Request
	
	var wikiURL = 'https://en.wikipedia.org/w/api.php?action=opensearch&search='
	+ cityInfo + '&format=json&callback=wikiCallback';
	
	var wikiTimeout = setTimeout(function(){
		$wikiElem.text("Failed To Load Wikipedia Resources");
	}, 8000);
	
	$.ajax({
		url : wikiURL,
		dataType : "jsonp",
		// callback,
		success : function(response) {
			var articleList = response[1];
			
			for (var i = 0; i < articleList.length; i++) {
				articleInfo = articleList[i];
				var URL = 'http://en.wikipedia.org/wiki/' + articleInfo;
				$wikiElem.append(
				'<li><a href="' + URL + '">' + articleInfo + '</a></li>'
				);
			};
			clearTimeout(wikiTimeout);
		}
		
	})


    return false;
};

$('#form-container').submit(loadData);

