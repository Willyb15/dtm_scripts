//GATHER REQUESTS
_send = XMLHttpRequest.prototype.send;
XMLHttpRequest.prototype.send = function() {
  //COLLECT XHR PAYLOAD FOR ANALYTICS
  if (arguments[0] !== null) {
    try {
      xhrPayloadExport = JSON.parse(arguments[0]);
      //console.log(xhrPayloadExport);
      //_satellite.setVar("Analytics",xhrPayloadExport);
      _satellite.getToolsByType('sc')[0].getS().clearVars();
      _satellite.track(xhrPayloadExport.name);
      _satellite.getToolsByType('sc')[0].getS().clearVars();
    }
    catch(err) {
      try {
        xhrPayloadExport = JSON.parse(arguments[0]);
        if(xhrPayloadExport.configuration !== undefined) {
          _satellite.track("Edit_Profile");
        }
      }
      catch(err){
        try{ 
          _satellite.notify("No Satellite event " + xhrPayloadExport.name);
        }catch(err){
          _satellite.notify("No xhr payload available");
        }
      }
    }
  }
  //END COLLECT XHR PAYLOAD 
  //PUT BACK XHR REQUEST
  var callback = this.onreadystatechange;
  this.onreadystatechange = function() {
    callback.apply(this, arguments);
  }
  _send.apply(this, arguments);
}
return true;