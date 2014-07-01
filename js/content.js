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

document.addEventListener("keydown", keyboard_handler, true);

function keyboard_handler(e){
		// shift + space
	if(e.shiftKey && e.keyCode === 32){
			search_pane.style.display = "block";
			search_input.focus()
			search_input.onkeyup = search;
		// Esc 
	} else if (e.keyCode === 27) {
			search_pane.style.display = "none";
			search_result.style.display = "none";
	}
}

function query_backend(q){
	chrome.runtime.sendMessage({query: q}, function(response){
		show_result(response)
	})
}

function search(){
	var q = search_input.value;
	query_backend(q.toLowerCase());
}

function show_result(response){
		search_result.innerHTML = response;	
		search_result.style.display = "block";
		search_result.children[0].focus()		
	// if(1){
	// } else {
	// 	search_result.style.display = 'none'
	// }


}


