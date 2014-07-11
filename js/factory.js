
var Data = {
	build_htmlstr: function(data){
		var rText;
		switch(rq.type){
			case "bookmark":
				rText = Data.build_bookmark_result(data);
				break;
			case "history":
				rText = Data.build_history_result(data);
				break;
			case "ydic":
				rText = Data.build_ydic_result(data);
				break;
		}
		Ui.show_results(rText);
	},

	build_ydic_result: function(words){
		words = JSON.parse(words)
		var translation = '<li><div class="ebarReset">' + words['translation'] + '</div></li>';
		if(words.hasOwnProperty("basic")){
			if(words["basic"].hasOwnProperty("phonetic"))
				phonetic = '<li><div class="ebarReset">' + words['basic']['phonetic'] + '</div></li>'
			else
				phonetic = ""

			if(words["basic"].hasOwnProperty("explains"))
				explains = '<li><div class="ebarReset">' + words['basic']['explains'].join('</div><br><div class="ebarReset">') + '</div></li>'
			else
				explains = ""	
		} else {
			phonetic = explains = ""
		}

		var text = [translation, phonetic, explains].join("");
		return text

	},

	build_history_result: function(arr){
		var rText = [];
		for (var i=0; i<arr.length; i++){
			var time = new Date(arr[i].lastVisitTime);
			var title = arr[i].title.replace(new RegExp(rq.data.text), "<span class='easybarMatch'>" + rq.data.text + "</span>");
			var	url = arr[i].url.replace(new RegExp(rq.data.text), "<span class='easybarMatch'>" + rq.data.text + "</span>");
			var	lastVisit = time.toLocaleDateString()+ ' ' + time.toLocaleTimeString();
			var	visitCount = arr[i].visitCount;

			var text = [
					'<li><div class="ebarReset easybarTopHalf">',
						'<span class="ebarReset easybarOrigin">' + rq.type + '</span>',
						'<span class="ebarReset easybarTitle">',
							arr[i].title.replace(new RegExp(rq.data.text), "<span class='easybarMatch'>" + rq.data.text + "</span>"),
						'</span>',
					'</div>',
					'<div class="ebarReset easybarBottomHalf">',
						'<span class="ebarReset easybarUrl">',
							url,
						'</span>',
					'</div>',
					'<div class="ebarReset easybarBottomHalf">',
						'<span class="ebarReset easybarUrl">',
							" 最近访问: " + lastVisit,
						'</span>',
						'<span class="ebarReset easybarRank">',
							" 访问次数: " + arr[i].visitCount,
						'</span>',
					'</div></li>'
				].join("");
			rText.push(text)
		}
		return rText.join("")
	},

	build_bookmark_result: function(arr){
		var rText = [];
		for (var i=0; i<arr.length; i++){		
			var text = [
					'<li><div class="ebarReset easybarTopHalf">',
						'<span class="ebarReset easybarOrigin">' + rq.type + '</span>',
						'<span class="ebarReset easybarTitle">',
							arr[i].title.replace(new RegExp(rq.data), "<span class='easybarMatch'>" + rq.data + "</span>"),
						'</span>',
					'</div>',
					'<div class="ebarReset easybarBottomHalf">',
						'<span class="ebarReset easybarUrl">',
							arr[i].url.replace(new RegExp(rq.data), "<span class='easybarMatch'>" + rq.data + "</span>"),
						'</span>',
					'</div></li>'
				].join("");
			rText.push(text)
		}
		return rText.join("")
	}
}
