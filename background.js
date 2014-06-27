var all_bookmark;

chrome.bookmarks.getTree(function(bookmarkArray){
	all_bookmark = bookmarkArray;
	chrome.storage.sync.set({"all_bookmark": bookmarkArray}, function(){
		console.log(bookmarkArray)
	});
	localStorage.bookmarks = bookmarkArray
});

function searchUrl(str, arr, context){
	if( len = arr.length ){
		for (var i=0; i<len; i++ ){
			if( arr[i].hasOwnProperty("children") ){
				searchUrl(str, arr[i].children, arr[i]);
			}
			else{
				if( (arr[i].title).indexOf(str) !=-1 ){
					console.log(arr[i].title+" "+arr[i].url)
				}
			}
		}
	}
}


