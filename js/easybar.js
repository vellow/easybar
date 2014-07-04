
chrome.runtime.onMessage.addListener(function( request, sender, sendResponse ){
	console.log(request)
	Easybar.show_results(request);
})

var status = {
	mode_1: false,
	mode_2: false,
	show: false,
	derective: false
}

var defualt_options = {
	"Shift+Space": "show",
	"Esc": "hide",
	"Up": "prev",
	"Down": "next",
	"Enter": "newtab"
}

var defualt_keywords = {
	"bkmk": "search_bookmark",
	"his": "search_history",
	"google": "search_in_google",
	"ddg": "search_in_duckduckgo",
	"ydic": "search_in_youdaodic"
}

var defualt_operations = {
	"j": "down",
	"k": "up",
	"h": "left",
	"l": "right",
	"t": "new_tab",
	"f": "find_link"
}

var handlers = {
	"show": "Easybar.show",
	"hide": "Easybar.clear",
	"prev": "Operation.select_prev",
	"next": "Operation.select_next",
	"newtab": "Operation.newtab"
}

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
	sHeader: document.getElementById("sHeader"),
	sSource: function(s){
		document.getElement
	}

}

var Command = {

	search_bookmark: function(s){
		chrome.runtime.sendMessage( {type: "bookmark", data: s} )
	},

	search_history: function(s){
		Ui.sHeader.innerText = "Search in History...";
		chrome.runtime.sendMessage({type: "history", data: {text: s}})	
	}
}


////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////

var Easybar = {

	command: Command.search_bookmark,

	bind_shortcut: function(ops){
		for (i in ops){
			shortcut.add(i, eval(handlers[ops[i]]))
		}
	},

	show: function(){
		Ui.easyDiv.style.display = "block";
		sInput.focus()
		sInput.onkeyup = function(e){
			// prevent up down ...
			if(e.keyCode > 40 || e.keyCode < 37){
				Easybar.delegate()
			}
		};
	},

	clear: function(){
		Ui.sInput.value = "";
		Ui.sReset.innerHTML = "";
		Ui.sHeader.innerText = "";	
		Ui.sReset.style.display = "none";
		Ui.easyDiv.style.display = "none";
		for(key in status){
			status[key] = false
		}
	},

	delegate: function(){
		var str = Ui.sInput.value.toLowerCase();
		if(!status.mode_1 && str && event.keyCode === 32) {
			status.mode_1 = true;
			Ui.sInput.value = "";
			var match = str.match(/^(\w+)\s/)[1];
			if( defualt_keywords.hasOwnProperty(match) ){
				this.command = eval( "Command." + defualt_keywords[match] );
			} 
		}
		this.command(str)	
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




