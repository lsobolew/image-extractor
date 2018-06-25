var version = "1.3";
var currentTab;
var customPrefix = "imageExtractor_";

document.getElementById('clickme').addEventListener('click', capture);

// chrome.contentSettings.javascript.clear({}, function() {
//     contentSettings.javascript.set({
//         primaryPattern: '*://*/*',
//         setting: 'block'
//     });
// });


function capture() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        currentTab = tabs[0];
        var debuggeeId = {tabId: currentTab.id};
        chrome.debugger.attach(debuggeeId, version, onAttach.bind(null, debuggeeId));
    });
}


function onAttach(debuggeeId) {
    var documentRoot,
        backgroundImageNodeId,
        devicePixelRatio;

    (new Promise(function(resolve, reject) {
        chrome.debugger.sendCommand(debuggeeId, "DOM.getDocument", {  }, function(response){
            documentRoot = response.root;
            resolve();
        })
    })).then(function(response){
        return new Promise(function(resolve, reject){
            chrome.debugger.sendCommand(debuggeeId, "Emulation.setDefaultBackgroundColorOverride", {
                color: {r: 0, g: 0, b: 0, a: 0}
            }, function(){
                resolve();
            });
        });
    }).then(function() {
        return new Promise(function(resolve, reject){
            chrome.debugger.sendCommand(debuggeeId, "CSS.enable", function(){
                resolve();
            });
        });
    }).then(function() {
        return new Promise(function(resolve, reject){
            chrome.debugger.sendCommand(debuggeeId, "Runtime.evaluate", {
                expression: "window.devicePixelRatio",
            }, function(response){
                resolve(response);
            });
        });
    }).then(function(response) {
        devicePixelRatio = response.result.description;
        return new Promise(function(resolve, reject){
            chrome.debugger.sendCommand(debuggeeId, "Emulation.setDeviceMetricsOverride", {
                width: 414,
                height: 736,
                deviceScaleFactor: 2,
                mobile: true
            }, function(response){
                resolve(response)
            });
        });
    }).then(function(response) {
        return new Promise(function(resolve, reject){
            chrome.debugger.sendCommand(debuggeeId, "DOM.querySelector", {
                nodeId: documentRoot.nodeId,
                selector: '#img3'
            }, function(response){
                resolve(response);
            });
        });
    }).then(function(response){
        backgroundImageNodeId = response.nodeId;

        return new Promise(function(resolve, reject){
            chrome.debugger.sendCommand(debuggeeId, "DOM.setAttributeValue", {
                nodeId: backgroundImageNodeId,
                name: customPrefix + 'currentNode',
                value: 'true'
            }, function(response){
                resolve(response);
            });
        });
    }).then(function(response) {
        return new Promise(function(resolve, reject){
            chrome.tabs.executeScript({
                file: 'reveal.js'
            }, function() {
                chrome.tabs.sendMessage(currentTab.id, JSON.stringify({currentElement: '[' + customPrefix + 'currentNode=true]', step: 1}), function(response) {
                    resolve(response);
                });
            });
        });
    }).then(function(response) {
        return new Promise(function(resolve, reject){
            chrome.debugger.sendCommand(debuggeeId, "Emulation.setDeviceMetricsOverride", {
                width: 414,
                height: 7360,
                deviceScaleFactor: 2,
                mobile: true
            }, function(response){
                resolve(response)
            });
        });
    }).then(function(response) {
        return new Promise(function(resolve, reject){
            chrome.tabs.sendMessage(currentTab.id, JSON.stringify({currentElement: '[' + customPrefix + 'currentNode=true]', step: 2}), function(response) {
                resolve(response);
            });
        });
    }).then(function(response){
        var elemLeft = response.clip.x;
        var elemTop = response.clip.y;
        var elemWidth = response.clip.width;
        var elemHeight = response.clip.height;

        return new Promise(function(resolve, reject){
            chrome.debugger.sendCommand(debuggeeId, "Page.captureScreenshot", {
                clip: {
                    x: elemLeft,
                    y: elemTop,
                    width: elemWidth,
                    height: elemHeight,
                    scale: 1
                }
            }, function(response){
                resolve(response)

            });
        });
    }).then(function(response){
        chrome.downloads.download({url:"data:image/png;base64," + response.data});
        return;
    }).catch(function(error){
        console.error(error);
    });
};

// .then(function(response){
//     return new Promise(function(resolve, reject){
//         chrome.debugger.sendCommand(debuggeeId, "Page.reload", {
//             ignoreCache: true
//         }, function(response){
//             resolve(response);
//         });
//     });
// })