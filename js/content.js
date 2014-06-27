var all_bookmark;
var search_pane = document.createElement("div");
var htmlstr = '<div id="vomnibar" class="vimiumReset" style="display: none;">\
				  <div class="vimiumReset vomnibarSearchArea">\
				    <input type="text" id="search_input" class="vimiumReset">\
				  </div>\
				  <ul class="vimiumReset" id="search_result" style="display: none;"></ul>\
				</div>';
search_pane.innerHTML = htmlstr;
search_pane = search_pane.firstChild;

document.body.appendChild(search_pane);

var search_input = document.getElementById("search_input"),
	search_result = document.getElementById("search_result");


function keyboard_handler(e){
	console.log(e.shiftKey+" "+e.keyCode);
	if(e.shiftKey && e.keyCode === 32){
		search_pane.style.display="block";
	}
}

document.addEventListener("keydown", keyboard_handler, true);


/*chrome.bookmarks.getTree(function(bookmarkArray){
	all_bookmark = bookmarkArray;
});*/


var r=[];

function search_bookmark(){
	r=[];
	var q = search_input.value;
	search_url(q.toLowerCase(), all_bookmark);
	search_result.innerHTML = r.join("");	
}


function search_url(re, arr, context){
	if( len = arr.length ){
		for (var i=0; i<len; i++ ){
			if( arr[i].hasOwnProperty("children") ){
				search_url(re, arr[i].children, arr[i]);
			}
			else{
				if( (arr[i].title.toLowerCase().indexOf(re)) !=-1 || (arr[i].url.toLowerCase().indexOf(re)) !=-1 ){
					// r.push("<a href='" + arr[i].url + "' target='_blank'>" + arr[i].title +" </a><br><br>");
					concat_result(arr[i].title, arr[i].url, re)
				}
			}
		}
	}
}

function concat_result(title, url, re){
	title = title.replace(new RegExp(re), "<span class='vomnibarMatch'>$1</span>");
	url = url.replace(new RegExp(re), "<span class='vomnibarMatch'>$1</span>");
	r.push([
			'<li class="vomnibarSelected"><div class="vimiumReset vomnibarTopHalf">',
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
