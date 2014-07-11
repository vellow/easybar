var Elements = {
	easyDiv: (function(){
					var easyDiv = document.createElement("div");
					var str = '<div id="easybar" class="ebarReset" style="display: none;">\
									    <div id="sHeader">Search in Bookmark</div>\
									    <div class="ebarReset easybarSearchArea">\
											<input type="text" id="sInput" class="ebarReset">\
									    </div>\
									    <ul class="ebarReset" id="sReset" style="display: none;"></ul>\
									</div>';
					easyDiv.innerHTML = str;
					easyDiv = easyDiv.firstChild;
					return document.body.appendChild(easyDiv);	
				})(),
	sInput: document.getElementById("sInput"),
	sReset: document.getElementById("sReset"),
	sHeader: document.getElementById("sHeader")
}

var Ui = {
	show_easybar: function(){
		Elements.easyDiv.style.display = "block";
		Elements.sInput.focus()
		Elements.sInput.onkeyup = function(e){
			// prevent up down ...
			if(e.keyCode > 40 || e.keyCode < 37){
				Easybar.delegate()
			}
		};
	},

	close_easybar: function(){
		Ui.clean()
		Elements.easyDiv.style.display = "none";
	},

	clean: function(){
		Elements.sInput.value = "";
		Elements.sHeader.innerHTML = "";	
		Elements.sReset.innerHTML = "";
		Elements.sReset.style.display = "none";
	},

	update_header: function(str){
		Elements.sHeader.innerHTML =  str 
	},

	show_results: function(rText){
		if(rText){
			Elements.sReset.innerHTML = rText;
			if(mode != "search_in_ydic")
				Elements.sReset.children[0].classList.add("easybarSelected");
			Elements.sReset.style.display = "block"
		} else {
			Elements.sReset.innerHTML = "";
			Elements.sReset.style.display = "none"
		}	
	}
	
}

