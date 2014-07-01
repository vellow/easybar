var all_bookmark, r = new Array;

chrome.bookmarks.getTree(function(bookmarkArray){
	 all_bookmark = bookmarkArray;
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
	r = [];
	console.log(request);
	search_url(request, all_bookmark);	
	sendResponse(r.join(""));  
});

function search_url(req, arr, context){
	for (var i=0; i<arr.length; i++ ){
		if( arr[i].hasOwnProperty("children") ){
			search_url(req, arr[i].children, arr[i]);
		} else{
			if( (arr[i].title.toLowerCase().indexOf(req)) !=-1 || (arr[i].url.toLowerCase().indexOf(req)) !=-1 ){
				concat_result(arr[i].title, arr[i].url, req)
			}
		}
	}
}

function concat_result(title, url, req){
	title = title.replace(new RegExp(req), "<span class='vomnibarMatch'>" + req + "</span>");
	url = url.replace(new RegExp(req), "<span class='vomnibarMatch'>" + req + "</span>");
	r.push([
			'<li><div class="vimiumReset vomnibarTopHalf">',
				'<span class="vimiumReset vomnibarSource">bookmark</span>',
				'<span class="vimiumReset vomnibarTitle">',
					title,
				'</span>',
			'</div>',
			'<div class="vimiumReset vomnibarBottomHalf">',
				'<span class="vimiumReset vomnibarUrl">',
					url,
				'</span>',
			'</div></li>'
		].join(""))
}
