var pvFlag = "none";
_satellite.getVar("prevSiteSection");
//AskMD Consult Start Variation
if (/^\/ask-md\/consultations\/.*/.test(xhrPayloadExport.data["rg.pagename"])) {
	pvFlag = "y"
}
//RAT Start Variation
if ((/^\/you\/real-age-test$/.test(xhrPayloadExport.data["rg.pagename"])) && (xhrPayloadExport.data["rg.RAT"] == "no")) {
	_satellite.track("Page_View_RAT_Start");
  pvFlag = "y"
}
//RAT Resume Variation
if ((/^\/you\/real-age-test$/.test(xhrPayloadExport.data["rg.pagename"])) && (xhrPayloadExport.data["rg.RAT"] == "yes")) {
	_satellite.track("Page_View_RAT_Resume");
  pvFlag = "y"
}
//RAT Resume Variation
if (/^\/you\/recommendations\/.*/.test(xhrPayloadExport.data["rg.pagename"])) {
	_satellite.track("Page_View_RAT_Rec");
  pvFlag = "y"
}
//Slideshow Pageview
if (/^\/slideshows\/.*/.test(xhrPayloadExport.data["rg.pagename"])) {
	_satellite.track("Page_View_Slideshow");
  pvFlag = "y"
}
//Articles Pageview
if (/^\/articles\/.*/.test(xhrPayloadExport.data["rg.pagename"])) {
	_satellite.track("Page_View_Articles");
  pvFlag = "y"
}
// Videos PageView
if (/^\/videos\/.*/.test(xhrPayloadExport.data["rg.pagename"])) {
	_satellite.track("Page_View_Videos");
  pvFlag = "y"
}
//Clicked Real Age Tips from Home
if (/^\/you\/recommendations$/.test(xhrPayloadExport.data["rg.pagename"]) && (_satellite.getVar("prevSiteSection") == "Home")) {
	_satellite.track("Page_View_RealAgeTips");
  pvFlag = "y"
}
//Generic Page Default
if (pvFlag == "none") {
	_satellite.track("Page_View_Generic");
}
s.abort = true;