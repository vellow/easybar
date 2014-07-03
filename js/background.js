var all_bookmark, r = new Array();
var rq;


chrome.bookmarks.getTree(function(bookmarkArray){
	 all_bookmark = bookmarkArray;
	 chrome.storage.local.set({"bookmarks": bookmarkArray}, function(){console.log("stored!")})
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
	r = [];
	rq = request;
	console.log(rq);
	dispatch(request);
	sendResponse(r.join(""));
	console.log(r.join(""))  
});

function dispatch(q){
	switch(q.type){
		case "bookmark":
			console.log(q.data)
			chrome.bookmarks.search(q.data, function(arr){
					console.log(arr)
					for (var i=0; i<arr.length; i++){
						convert_result(arr[i])
					}
					console.log(r)
			});
			break;

		case "history":
			console.log(q.data);
			chrome.history.search(q.data, handle_results);
			break;

		case "newtab":
			chrome.tabs.create({url: q.data});
			break;
	}
}

function handle_results(arr){
	console.log(arr)
	for (var i=0; i<arr.length; i++){
		convert_result(arr[i])
	}
	console.log(r)
}

function convert_result(item){
	console.log(item)
	if(rq.type == "history"){
		console.log('-----');
		var time = new Date(item.lastVisitTime);
		var title = item.title.replace(new RegExp(rq.data.text), "<span class='vomnibarMatch'>" + rq.data.text + "</span>");
		var	url = item.url.replace(new RegExp(rq.data.text), "<span class='vomnibarMatch'>" + rq.data.text + "</span>");
		var	lastVisit = time.toLocaleDateString()+ ' ' + time.toLocaleTimeString();
		var	visitCount = item.visitCount;

		console.log(title+"||"+url+"||"+lastVisit+"||"+visitCount)

		r.push([
				'<li><div class="vimiumReset vomnibarTopHalf">',
					'<span class="vimiumReset vomnibarSource">bookmark</span>',
					'<span class="vimiumReset vomnibarTitle">',
						item.title.replace(new RegExp(rq.data.text), "<span class='vomnibarMatch'>" + rq.data.text + "</span>"),
					'</span>',
				'</div>',
				'<div class="vimiumReset vomnibarBottomHalf">',
					'<span class="vimiumReset vomnibarUrl">',
						url,
					'</span>',
				'</div>',
				'<div class="vimiumReset vomnibarBottomHalf">',
					'<span class="vimiumReset vomnibarUrl">',
						"最近访问: " + lastVisit,
					'</span>',
					'<span class="vimiumReset vomnibarRank">',
						"访问次数: " + item.visitCount,
					'</span>',
				'</div></li>'
			].join(""))
		console.log(r)

	} else {
		r.push([
				'<li><div class="vimiumReset vomnibarTopHalf">',
					'<span class="vimiumReset vomnibarSource">bookmark</span>',
					'<span class="vimiumReset vomnibarTitle">',
						item.title.replace(new RegExp(rq.data), "<span class='vomnibarMatch'>" + rq.data + "</span>"),
					'</span>',
				'</div>',
				'<div class="vimiumReset vomnibarBottomHalf">',
					'<span class="vimiumReset vomnibarUrl">',
						item.url.replace(new RegExp(rq.data), "<span class='vomnibarMatch'>" + rq.data + "</span>"),
					'</span>',
				'</div></li>'
			].join(""))
	}
}


// function search_bookmarks(req, arr, context){
// 	if(!req) return
// 	for (var i=0; i<arr.length; i++ ){
// 		if( arr[i].hasOwnProperty("children") ){
// 			arguments.callee(req, arr[i].children, arr[i]);
// 		} else{
// 			if( (arr[i].title.toLowerCase().indexOf(req)) !=-1 || (arr[i].url.toLowerCase().indexOf(req)) !=-1 ){
// 				// concat_result(arr[i].title, arr[i].url, req)
// 				convert_result(arr[i])
// 			}
// 		}
// 	}
// }


