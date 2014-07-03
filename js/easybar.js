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
					    <div id="sHeader"></div>\
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

var easyDiv = document.getElementById("vomnibar"),
	sInput = document.getElementById("sInput"),
	sReset = document.getElementById("sReset"),
	sHeader = document.getElementById("sHeader");

var hisMode = false;

var bookmarks, histories;

chrome.storage.local.get("bookmarks", function(r){console.log(r)})

var Easybar = {
	bind_shortcut: function(ops){
		for (i in ops){
			shortcut.add(i, eval(handlers[ops[i]]))
		}
	},

	open: function(){
		chrome.storage.local.get("bookmarks", function(r){bookmarks = r})
		easyDiv.style.display = "block";
		sInput.focus()
		sInput.onkeyup = function(e){
			// prevent up down ...
			if(e.keyCode > 40 || e.keyCode < 37){
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
		var str = sInput.value.toLowerCase();

		chrome.storage.local.get("bookmarks", function(r){console.log(r)})
		// console.log(str.match(/^his /) + " " + event.keyCode);
		if( !hisMode && str.match(/^his /)) {
			hisMode = true;
			sInput.value = "";
		}

		if(hisMode){
			sHeader.innerText = "Search in History..."
			chrome.runtime.sendMessage( { type: "history", data: {text: str} }, function(r){
				console.log(r);
				Easybar.show_result(r)
			})				
		} else {
			chrome.runtime.sendMessage( { type: "bookmark", data: str }, function(r){
				console.log(r);
				Easybar.show_result(r)
			})		
		}
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


chrome.runtime.sendMessage( { type: "history", data: {text: 'combanc'} }, function(r){
	console.log(r);
	// Easybar.show_result(r)
	});

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
		if( sSelected = document.getElementsByClassName("vomnibarSelected")[0] ){
			var url = sSelected.lastChild.innerText;
			chrome.runtime.sendMessage( { type: "newtab", data: url }, function(){
				console.log("opening new tab")
			})
		}
	}	
}

Easybar.bind_shortcut(defualt_options);

// })(window, document)



