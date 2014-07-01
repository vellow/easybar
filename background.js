// var all_bookmark;

// function patcher(){
// 	chrome.bookmarks.getTree(function(bookmarkArray){

// 		chrome.tabs.query({active: true}, function(tabs){

// 			tabs.forEach(function(tab){
// 		    	chrome.tabs.sendMessage(tab.id, {bookmarks: bookmarkArray}, function(response){});  
// 			})
// 		});
// 	});
// }

// function searchUrl(str, arr, context){
// 	if( len = arr.length ){
// 		for (var i=0; i<len; i++ ){
// 			if( arr[i].hasOwnProperty("children") ){
// 				searchUrl(str, arr[i].children, arr[i]);
// 			}
// 			else{
// 				if( (arr[i].title).indexOf(str) !=-1 ){
// 					console.log(arr[i].title+" "+arr[i].url)
// 				}
// 			}
// 		}
// 	}
// }

// // chrome.runtime.onMessage.addListener(function(r,x,t){console.log(r); patcher()})

// setTimeout(patcher,100);

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
    if(message == 'Hello'){
        sendResponse('Hello from background.');
    }
});

