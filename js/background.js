var mySender;

chrome.runtime.onMessage.addListener(function(request, sender, foo){
	mySender = sender;
	dispatch(request);
});


function dispatch(rq){
	switch(rq.type){
		case "bookmark":
			console.log(rq.data)
			chrome.bookmarks.search(rq.data, send_response);
			break;

		case "history":
			console.log(rq.data);
			chrome.history.search(rq.data, send_response);
			break;

		case "newtab":
			chrome.tabs.create({url: rq.data});
			break;
	}
}

function send_response(arr){
	chrome.tabs.sendMessage(mySender.tab.id, arr)
}
