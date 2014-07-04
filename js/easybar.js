var ChromePlus = {
	bookmarks: null,
	history: {}
};

var hisMode = false;

chrome.runtime.onMessage.addListener(function( request, sender, sendResponse ){
	Easybar.show_results(request);
})

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

var Ui = {
	easyDiv: (function(){
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
					return document.body.appendChild(easyDiv);	
				})(),
	sInput: document.getElementById("sInput"),
	sReset: document.getElementById("sReset"),
	sHeader: document.getElementById("sHeader")

}

////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////

var Easybar = {
	bind_shortcut: function(ops){
		for (i in ops){
			shortcut.add(i, eval(handlers[ops[i]]))
		}
	},

	open: function(){
		Ui.easyDiv.style.display = "block";
		sInput.focus()
		sInput.onkeyup = function(e){
			// prevent up down ...
			if(e.keyCode > 40 || e.keyCode < 37){
				Easybar.search()
			}
		};
	},

	hide: function(){
		Ui.sInput.value = "";
		Ui.sReset.innerHTML = "";
		Ui.sHeader.innerText = "";	
		Ui.sReset.style.display = "none";
		Ui.easyDiv.style.display = "none";
		hisMode = false;	
	},

	search: function(){
		var str = Ui.sInput.value.toLowerCase();

		if( !hisMode && str.match(/^his /)) {
			hisMode = true;
			Ui.sInput.value = "";
		}

		if(hisMode){
			Ui.sHeader.innerText = "Search in History...";
			chrome.runtime.sendMessage({type: "history", data: {text: str}})
						
		} else {
			chrome.runtime.sendMessage({type: "bookmark", data: str})		
		}
	},

	show_results: function(r){
		if(r){
			Ui.sReset.innerHTML = r; 
			Ui.sReset.style.display = "block";
			// Ui.sReset.children[0].focus();
			Ui.sReset.children[0].classList.add("vomnibarSelected");
		} else {
			Ui.sReset.innerHTML = "";
			Ui.sReset.style.display = "none"
		}	
	}
}


////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////


var Operation = {
	select_prev: function(){
		sSelected = document.getElementsByClassName("vomnibarSelected")[0];
		sSelected.classList.remove("vomnibarSelected");
		if(prev = sSelected.previousElementSibling){
			prev.classList.add("vomnibarSelected")
		} else{
			Ui.sReset.lastChild.classList.add("vomnibarSelected")
		}
	},
	select_next: function(){
		sSelected = document.getElementsByClassName("vomnibarSelected")[0];
		sSelected.classList.remove("vomnibarSelected");
		if(next = sSelected.nextElementSibling){
			next.classList.add("vomnibarSelected")
			sSelected.classList.remove("vomnibarSelected");
		} else {
			Ui.sReset.firstChild.classList.add("vomnibarSelected")
		}
	},
	newtab: function(){
		if( sSelected = document.getElementsByClassName("vomnibarSelected")[0] ){
			var url = sSelected.children[1].innerText;
			chrome.runtime.sendMessage( { type: "newtab", data: url }, function(){
				console.log("opening new tab")
			})
		}
	}	
}

Easybar.bind_shortcut(defualt_options);

// })(window, document)



