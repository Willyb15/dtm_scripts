(function() {
    var origOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function() {
        console.log('request started!');
        this.addEventListener('load', function() {
            console.log('request completed!');
            //will always be 4 (ajax is completed successfully)
             console.log(this.readyState, "This is the Ready State. 4 means request finished and response is ready."); 
          	//whatever the response was
          	response = this.response;
          //Some Responses Are Empty Strings and throw errors when parsed
         		console.log(response.length, "If 0 the response was empty string")
          	console.log(typeof(response))
            //console.log(response + "<br>" + "this is the repsonse");
          //If not an empty string parse
          if(response.length !== 0){
          try {
      			x = JSON.parse(response);
      			console.log(x, "this is me parsing");
            //_satellite.setCookie("URL", x.content.title,1);
    }
    catch(err) {
    console.log(err, "there was an error")
    }
    }
        });
        origOpen.apply(this, arguments);
    };
})();
return true;