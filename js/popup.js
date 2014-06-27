var all_bookmark;
var search_input = document.getElementById("search_input");
search_input.focus();
search_input.onkeyup = search_bookmark;


chrome.bookmarks.getTree(function(bookmarkArray){
	all_bookmark = bookmarkArray;
});


var r=[];

function search_bookmark(){
	r=[];
	var q = search_input.value;
	search_url(q.toLowerCase(), all_bookmark);
	document.getElementById("result").innerHTML = r.join("");	
}


function search_url(str, arr, context){
	if( len = arr.length ){
		for (var i=0; i<len; i++ ){
			if( arr[i].hasOwnProperty("children") ){
				search_url(str, arr[i].children, arr[i]);
			}
			else{
				if( (arr[i].title.toLowerCase().indexOf(str)) !=-1 || (arr[i].url.toLowerCase().indexOf(str)) !=-1 ){
					r.push("<a href='" + arr[i].url + "' target='_blank'>" + arr[i].title +" </a><br><br>");
				}
			}
		}
	}
}

