//Grab URL
var URL = window.location.hostname
//Get Name of Article
var content = $("#app > div > div > div:nth-child(2) > div:nth-child(1)")[0].innerText;
//Remove WhiteSpaces
var trim = content.replace(/ /g,'');
//Compile new page name
var pageName = URL + "/articles/" + trim;
return pageName;


//Grab URL
var URL = window.location.href
console.log(URL, "this is the URL");
//Split the URL
var newURL = URL.split("/");
//Get Name of Slideshow
var content = $("#app > div > div > div:nth-child(2) > div:nth-child(1)")[0].innerText;
console.log(content, "this is the content")
//Remove WhiteSpaces
var trim = content.replace(/ /g,'');
//Compile new page name
var ss_pageName = newURL[2] + "/slideshows/" + trim + "/" + newURL[5];
return ss_pageName;