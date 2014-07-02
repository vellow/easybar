var defualt_options = {
	"Shift+Space": "open",
	"Esc": "hide",
	"Up": "prev",
	"Down": "next",
	"Enter": "newtab"
}

var handlers = {
	"open": "Easybar.open",
	"hide": "Easybar.hide",
	"prev": "Operation.select_prev",
	"next": "Operation.select_next",
	"newtab": "Operation.newtab"
}

// (function(window, document){
//build search pane
function build_pane(){
	var easyDiv = document.createElement("div");
	var str = '<div id="vomnibar" class="vimiumReset" style="display: none;">\
					  <div class="vimiumReset vomnibarSearchArea">\
						<input type="text" id="sInput" class="vimiumReset">\
					  </div>\
					  <ul class="vimiumReset" id="sReset" style="display: none;"></ul>\
					</div>';
	easyDiv.innerHTML = str;
	easyDiv = easyDiv.firstChild;
	document.body.appendChild(easyDiv);	
}

build_pane();

var sInput = document.getElementById("sInput"),
	sReset = document.getElementById("sReset");


var Easybar = {
	bind_shortcut: function(ops){
		for (i in ops){
			shortcut.add(i, eval(handlers[ops[i]]))
		}
	},

	open: function(){
		easyDiv.style.display = "block";
		sInput.focus()
		sInput.onkeyup = function(e){
			if(e.keyCode >= 48 && e.keyCode <= 96){
				Easybar.search()
			}
		};
	},

	hide: function(){
		easyDiv.style.display = "none";
		sReset.style.display = "none"
		sReset.innerHTML = "";	
		sInput.value = ""		
	},

	search: function(){
		console.log("searching...")
		var str = sInput.value.toLowerCase();
		chrome.runtime.sendMessage({qtype: "search_bookmarks", qdata: str}, function(r){
			Easybar.show_result(r)
		})		
	},

	show_result: function(r){
		if(r){
			sReset.innerHTML = r; 
			sReset.style.display = "block";
			// sReset.children[0].focus();
			sReset.children[0].classList.add("vomnibarSelected");
		} else {
			sReset.innerHTML = "";
			sReset.style.display = "none"
		}	
	}
}

var Operation = {
	select_prev: function(){
		sSelected = document.getElementsByClassName("vomnibarSelected")[0];
		sSelected.classList.remove("vomnibarSelected");
		if(prev = sSelected.previousElementSibling){
			prev.classList.add("vomnibarSelected")
		} else{
			sReset.lastChild.classList.add("vomnibarSelected")
		}
	},
	select_next: function(){
		sSelected = document.getElementsByClassName("vomnibarSelected")[0];
		sSelected.classList.remove("vomnibarSelected");
		if(next = sSelected.nextElementSibling){
			next.classList.add("vomnibarSelected")
			sSelected.classList.remove("vomnibarSelected");
		} else {
			sReset.firstChild.classList.add("vomnibarSelected")
		}
	},
	newtab: function(){
		var url = document.getElementsByClassName("vomnibarSelected")[0].lastChild.innerText;
		chrome.runtime.sendMessage({qtype: "newtab", qdata: url}, function(){
			console.log("opening new tab")
		})
	}	
}

Easybar.bind_shortcut(defualt_options);

// })(window, document)



