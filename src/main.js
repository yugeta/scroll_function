;$$scroll_function = (function(){

  var options = {
    scrollbar_target : "",
    scrollbar_color  : "#00F",
    scrollbar_pos    : "bottom"
  };

  var LIB  = function(){};
  LIB.prototype.event = function(target, mode, func , flg){
    flg = (flg) ? flg : false;
		if (target.addEventListener){target.addEventListener(mode, func, flg)}
		else{target.attachEvent('on' + mode, function(){func.call(target , window.event)})}
  };
  LIB.prototype.currentScriptTag = (function(){
    var scripts = document.getElementsByTagName("script");
    return this.currentScriptTag = scripts[scripts.length-1].src;
  })();
  LIB.prototype.urlinfo = function(uri){
    uri = (uri) ? uri : location.href;
    var data={};
		//URLとクエリ分離分解;
    var urls_hash  = uri.split("#");
    var urls_query = urls_hash[0].split("?");
		//基本情報取得;
		var sp   = urls_query[0].split("/");
		var data = {
      uri      : uri
		,	url      : sp.join("/")
    , dir      : sp.slice(0 , sp.length-1).join("/") +"/"
    , file     : sp.pop()
		,	domain   : sp[2]
    , protocol : sp[0].replace(":","")
    , hash     : (urls_hash[1]) ? urls_hash[1] : ""
		,	query    : (urls_query[1])?(function(urls_query){
				var data = {};
				var sp   = urls_query.split("#")[0].split("&");
				for(var i=0;i<sp .length;i++){
					var kv = sp[i].split("=");
					if(!kv[0]){continue}
					data[kv[0]]=kv[1];
				}
				return data;
			})(urls_query[1]):[]
		};
		return data;
  };
  LIB.prototype.upperSelector = function(elm , selectors) {
    selectors = (typeof selectors === "object") ? selectors : [selectors];
    if(!elm || !selectors){return;}
    var flg = null;
    for(var i=0; i<selectors.length; i++){
      for (var cur=elm; cur; cur=cur.parentElement) {
        if (cur.matches(selectors[i])) {
          flg = true;
          break;
        }
      }
      if(flg){
        break;
      }
    }
    return cur;
  }
  LIB.prototype.construct = function(){
    switch(document.readyState){
      case "complete"    : new MAIN();break;
      case "interactive" : this.event(window , "DOMContentLoaded" , (function(){new MAIN()}).bind(this));break;
      default            : this.event(window , "load"             , (function(){new MAIN()}).bind(this));break;
		}
  };

  LIB.prototype.set_css = function(){
    var head = document.getElementsByTagName("head");
    var base = (head) ? head[0] : document.body;
    var current_pathinfo = this.urlinfo(this.currentScriptTag);
    var css  = document.createElement("link");
    css.rel  = "stylesheet";
    var target_css = current_pathinfo.dir + current_pathinfo.file.replace(".js",".css");
    var querys = [];
    if(current_pathinfo.query){
      for(var i in current_pathinfo.query){
        querys.push(i);
      }
      var query = querys.length ? "?"+ query.join("") : "";
    }
    css.href = target_css + query;
    base.appendChild(css);
  };

  var MAIN = function(custom_options){
    this.options = this.setOptions(custom_options);
    new LIB().set_css();
    this.set();
    new LIB().event(window , "scroll" , (function(e){this.scrollbar_progress()}).bind(this));
    // 初回処理
    this.scrollbar_progress();
  };

  MAIN.prototype.setOptions = function(custom_options){
    var newOptions = JSON.parse(JSON.stringify(options));
    if(custom_options){
      for(var i in custom_options){
        newOptions[i] = custom_options[i];
      }
    }
    return newOptions;
  };

  MAIN.prototype.set = function(){
    // 固定ヘッダがある場合
    if(this.options.scrollbar_target){
      var pos = this.options.scrollbar_pos ? this.options.scrollbar_pos : "bottom";
      var target = document.querySelector(this.options.scrollbar_target , pos);
      if(getComputedStyle(target, null).getPropertyValue("position") === "fixed"){
        this.scrollbar_set(target , pos);
        return;
      }
    }
    // 固定ヘッダがない場合
    var pos = "top";
    var scrollbar = this.scrollbar_set(document.body , pos);
    scrollbar.style.setProperty("position","fixed","");
  };

  MAIN.prototype.scrollbar_set = function(target , pos){console.log(pos);
    if(!target){return;}

    var scrollbar = document.createElement("div");
    scrollbar.className = "sf-scrollbar";
    if(pos){
      scrollbar.style.setProperty(pos,"0","");
    }
    
    target.appendChild(scrollbar);

    var line = document.createElement("div");
    line.className = "sf-scrollbar-line";
    line.style.setProperty("background-color" , this.options.scrollbar_color , "");
    scrollbar.appendChild(line);

    new LIB().event(scrollbar , "click" , (function(e){this.scrollbar_click(e)}).bind(this));
    return scrollbar;
  };

  MAIN.prototype.scrollbar_get_bar = function(){
    return document.querySelector(".sf-scrollbar");
  };
  MAIN.prototype.scrollbar_get_line = function(){
    return document.querySelector(".sf-scrollbar .sf-scrollbar-line");
  };

  MAIN.prototype.scrollbar_progress = function(){
    var line = this.scrollbar_get_line();
    if(!line){return;}
    var s = this.get_pagesize();
    var y = this.get_scroll_y();
    var h = this.get_pageheight();
    var max = s >= h ? s-h : h;
    var num = (y / max) * 100;
    line.style.setProperty("width", num + "%","");
  }

  MAIN.prototype.get_scroll_y = function(){
    return document.scrollingElement.scrollTop;
  };
  MAIN.prototype.get_pageheight = function(){
    return window.innerHeight;
  };
  MAIN.prototype.get_pagesize = function(){
    return document.scrollingElement.scrollHeight;
  }

  MAIN.prototype.scrollbar_click = function(e){
    var line = this.scrollbar_get_line();
    if(!line){return;}
    var scrollbar = e.currentTarget;
    var x = e.offsetX;
    var w = scrollbar.offsetWidth;
    var num = x / w * 100;
    line.style.setProperty("width", num + "%","");
    var s = this.get_pagesize();
    var h = this.get_pageheight();
    if(s < h){return;}
    var y = (s - h) * (x / w);
    document.scrollingElement.scrollTop = y;
  };





  return MAIN;
})();