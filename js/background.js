var all_bookmark, rq, mySender, res = new Array();


// chrome.bookmarks.getTree(function(bookmarkArray){
// 	 all_bookmark = bookmarkArray;
chrome.runtime.onMessage.addListener(function(request, sender, foo){
	res = [];
	rq = request;
	mySender = sender;
	dispatch(request);
	console.log(request)
});


function dispatch(q){
	switch(q.type){
		case "bookmark":
			console.log(q.data)
			chrome.bookmarks.search(q.data, Data.handle_results);
			break;

		case "history":
			console.log(q.data);
			chrome.history.search(q.data, Data.handle_results);
			break;

		case "newtab":
			chrome.tabs.create({url: q.data});
			break;
	}
}


var Data = {
	handle_results: function(arr){
		for (var i=0; i<arr.length; i++){
			Data.build_htmlstr(arr[i])
		}
		Data.send_response(res.join(""))	
	},

	send_response: function(data){
		chrome.tabs.sendMessage(mySender.tab.id, data)
	},

	build_htmlstr: function(item){
		if(rq.type == "history"){
			console.log('-----');
			var time = new Date(item.lastVisitTime);
			var title = item.title.replace(new RegExp(rq.data.text), "<span class='vomnibarMatch'>" + rq.data.text + "</span>");
			var	url = item.url.replace(new RegExp(rq.data.text), "<span class='vomnibarMatch'>" + rq.data.text + "</span>");
			var	lastVisit = time.toLocaleDateString()+ ' ' + time.toLocaleTimeString();
			var	visitCount = item.visitCount;

			console.log(title+"||"+url+"||"+lastVisit+"||"+visitCount)

			res.push([
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
							" 最近访问: " + lastVisit,
						'</span>',
						'<span class="vimiumReset vomnibarRank">',
							" 访问次数: " + item.visitCount,
						'</span>',
					'</div></li>'
				].join(""))
			console.log(res)

		} else {
			res.push([
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
}



