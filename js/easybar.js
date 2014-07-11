
chrome.runtime.onMessage.addListener(function( resultArray, sender, sendResponse ){
	Data.build_htmlstr(resultArray)
})

var status = {
	mode_1: false,
	mode_2: false,
	show: false,
	derective: false
}

var operationMap = [
	["Shift+Space", "show", "Operation.show_easybar"],
	["Esc", "hide", "Operation.close_easybar"],
	["Up", "prev", "Operation.select_prev"],
	["Down", "next", "Operation.select_next"],
	["Enter", "newtab", "Operation.newtab"]
]

var directiveMap = [
	["search_in_bookmark", "bkk", "Search in Bookmark"],
	["search_in_history", "his", "Search in History"],
	["search_in_google", "google", "Search in Google"],
	["search_in_ydic", "ydic", "Search in Youdao Dictionary"],
	["search_in_wiki", "wiki", "Search in WikiPedia"]
	["search_in_stackoverflow", "stof", "Search in StackOverflow"]
]

// var default_options = {
// 	"j": "down",
// 	"k": "up",
// 	"h": "left",
// 	"l": "right",
// 	"t": "new_tab",
// 	"f": "find_link"
// }



var url;
var mode = undefined;
var rq = {};

/* If arr[srcPos] == val, retrun arr[targetPos] */
function val_in_arr(arr, val, srcPos, targetPos){
	for(var i=0,len=arr.length; i<len; i++){
		if( arr[i][srcPos] == val )
			return arr[i][targetPos]
	}
}

function carousel(left, right, idx){
	return idx < left ? right : (idx > right ? left : idx)
}

var Directive = {
	search_in_bookmark: function(str){
		rq = {
			type: "bookmark",
			data: str
		};
		chrome.runtime.sendMessage(rq)
	},

	search_in_history: function(str){
		rq = {
			type: 'history',
			data: {
				text: str
			}
		};
		chrome.runtime.sendMessage(rq)	
	},

	search_in_google: function(s){
		url = 'http://google.com/search?q=' + s;
		Operation.newtab(url)
	},

	search_in_wiki: function(s){
		url = 'http://en.wikipedia.org/wiki/' + s;
		Operation.newtab(url)
	},

	search_in_stackoverflow: function(s){
		url = 'http://stackoverflow.com/search?q' + s;
		Operation.newtab(url)
	},

	search_in_ydic: function(s){
		rq = {
			type: "ydic", 
			data: s
		}
		Elements.sInput.select()
		var action = 'http://fanyi.youdao.com/openapi.do?keyfrom=init-life&key=304081511&type=data&doctype=json&version=1.1&q=' + s
		var xhr = new XMLHttpRequest()
		xhr.open("GET", action)
		xhr.onreadystatechange = function(){
			if(xhr.readyState === 4){
				data = xhr.responseText
				Data.build_htmlstr(data)
			}
		}
		xhr.send()
	}
}

////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////

var Operation = {

	show_easybar: function(){
		mode = "search_in_bookmark";
		Ui.show_easybar()
	},

	close_easybar: function(){
		mode = undefined;
		Ui.close_easybar()
	},

	select_prev: function(){
		sSelected = document.getElementsByClassName("easybarSelected")[0];
		sSelected.classList.remove("easybarSelected");
		if(prev = sSelected.previousElementSibling){
			prev.classList.add("easybarSelected")
		} else{
			Elements.sReset.lastChild.classList.add("easybarSelected")
		}
	},
	select_next: function(){
		sSelected = document.getElementsByClassName("easybarSelected")[0];
		sSelected.classList.remove("easybarSelected");
		if(next = sSelected.nextElementSibling){
			next.classList.add("easybarSelected")
			sSelected.classList.remove("easybarSelected");
		} else {
			Elements.sReset.firstChild.classList.add("easybarSelected")
		}
	},
	open_selected: function(){
		if( sSelected = document.getElementsByClassName("easybarSelected")[0] ){
			var url = sSelected.children[1].innerText;
			Operation.newtab(url)
			}
	},
	newtab: function(url){
		// console.log()
		try{
			url = document.getElementsByClassName("easybarSelected")[0].children[1].innerText
		} catch (err) {
			url = url
		}
		if(!url) return
		chrome.runtime.sendMessage( { type: "newtab", data: url } )
		Ui.close_easybar()
	}
}

////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////

var Easybar = {

	bind_shortcut: function(operationMap){
		for (i in operationMap){
			shortcut.add(operationMap[i][0], eval( operationMap[i][2] ))
		}
	},


	delegate: function(){
		var str = Elements.sInput.value.toLowerCase();
		var dmatch = str.match(/^(\w+)\s/)
		if( dmatch && event.keyCode === 32){
			var val = val_in_arr( directiveMap, dmatch[1], 1, 0)
			if(!val) return
			mode = val;
			Ui.clean()
			Ui.update_header( val_in_arr( directiveMap, dmatch[1], 1, 2) )
		} else {
			mode == "search_in_bookmark"
		}

		if(mode == "search_in_bookmark") {
			Directive.search_in_bookmark(str)

		} else if(mode == "search_in_history") {
			Directive.search_in_history(str)

		} else if(mode == "search_in_google" && event.keyCode == 13){
			Directive.search_in_google(str)

		} else if(mode == "search_in_ydic" && event.keyCode == 13){
			Directive.search_in_ydic(str)

		} else if(mode == "search_in_wiki" && event.keyCode == 13){
			Directive.search_in_wiki(str)

		} else if (!mode){
			Directive.search_in_bookmark(str)
		}
	}
}

Easybar.bind_shortcut(operationMap);




