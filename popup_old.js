function hello() {
    var responseListener = function(details){
        console.log(details);
        details.responseHeaders.push({"name": "Access-Control-Allow-Origin", "value": "*"});
        return {responseHeaders: details.responseHeaders};
    };

    chrome.webRequest.onHeadersReceived.addListener(responseListener, {
					urls: ["<all_urls>"]
				},["blocking", "responseHeaders"]);

  chrome.tabs.executeScript({
    file: 'content.js'
  });
}

// document.getElementById('clickme').addEventListener('click', hello);
// document.getElementById('clickme').addEventListener('click', screenshot);
// document.getElementById('clickme').addEventListener('click', backgrounds);
document.getElementById('clickme').addEventListener('click', capture);

var version = "1.3";
var currentTab;

function capture() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      currentTab = tabs[0]; // there will be only one in this array
      // console.log(currentTab); // also has properties like currentTab.id
      var debuggeeId = {tabId:currentTab.id};
      chrome.debugger.attach(debuggeeId, version, onAttach.bind(null, debuggeeId));
    });
}
function onAttach(debuggeeId) {

  // chrome.debugger.sendCommand(debuggeeId, "CSS.getMediaQueries", function(c){
  //     console.log(c);
  // });
  // chrome.debugger.sendCommand(debuggeeId, "Page.getLayoutMetrics", {  }, function(response){
  //     console.log(response);
  //     chrome.extension.getBackgroundPage().console.log(response);
  // });
  chrome.debugger.sendCommand(debuggeeId, "DOM.getDocument", {  }, function(response){
      var root = response.root;

      chrome.debugger.sendCommand(debuggeeId, "Emulation.setDeviceMetricsOverride", {
          width: 414,
          height: 736,
          deviceScaleFactor: 2,
          mobile: true
      }, function(response){

          chrome.debugger.sendCommand(debuggeeId, "DOM.querySelector", {
              nodeId: root.nodeId,
              selector: '.customers.bx'
          }, function(response){
              var obrazekId = response.nodeId;

              chrome.debugger.sendCommand(debuggeeId, "DOM.querySelectorAll", {
                  nodeId: root.nodeId,
                  selector: '*'
              }, function(response){

                  var promises = [];
                  response.nodeIds.forEach(function(nodeId){
                      promises.push(new Promise(function(resolve, reject) {
                          chrome.debugger.sendCommand(debuggeeId, "CSS.setEffectivePropertyValueForNode", {
                              nodeId: nodeId,
                              propertyName: 'visibility',
                              value: nodeId !== obrazekId ? 'hidden' : 'visible'
                          }, function(response){
                              resolve();
                          });
                      }));
                  });

                  Promise.all(promises).then(function (data) {
                      setTimeout(function(){
                          chrome.debugger.sendCommand(debuggeeId, "DOM.getBoxModel", {
                              nodeId: obrazekId
                          }, function(response){
                              var model = response.model.border;
                              var elemLeft = model[0];
                              var elemTop = model[1];
                              var elemWidth = elemLeft + model[2];
                              var elemHeight = model[5] - elemTop;

                              chrome.debugger.sendCommand(debuggeeId, "Page.captureScreenshot", {
                                  clip: {
                                      x: elemLeft,
                                      y: elemTop,
                                      width: elemWidth,
                                      height: elemHeight,
                                      scale: 1
                                  }
                              }, function(c){
                                  chrome.downloads.download({url:"data:image/png;base64," + c.data});
                              });
                          });
                      }, 10000)

                  }).catch(function (e) {
                      console.log(e);
                  });
              });

          });

      });

  });
}




function backgrounds() {
    chrome.tabs.executeScript({
        file: 'content2.js'
    });
}



// chrome.debugger.sendCommand(debuggeeId, "DOM.resolveNode", {
//     nodeId: obrazekId
// }, function(response){
//     chrome.tabs.sendMessage(currentTab.id, JSON.stringify(response));
// });







