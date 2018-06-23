// chrome.debugger.sendCommand(debuggeeId, "DOM.querySelectorAll", {
//     nodeId: root.nodeId,
//     selector: '*'
// }, function(response){
//     var promises = [];
//     response.nodeIds.forEach(function(nodeId){
//         promises.push(new Promise(function(resolve, reject) {
//             chrome.debugger.sendCommand(debuggeeId, "CSS.setEffectivePropertyValueForNode", {
//                 nodeId: nodeId,
//                 propertyName: 'visibility',
//                 value: 'hidden'
//             }, function(response){
//                 resolve();
//             });
//         }));
//     });
//
//     Promise.all(promises).then(function (data) {
//         chrome.debugger.sendCommand(debuggeeId, "DOM.querySelector", {
//             nodeId: root.nodeId,
//             selector: '.customers.bx'
//         }, function(response){
//             var obrazekId = response.nodeId;
//
//             chrome.debugger.sendCommand(debuggeeId, "CSS.setEffectivePropertyValueForNode", {
//                 nodeId: obrazekId,
//                 propertyName: 'visibility',
//                 value: 'visible'
//             }, function(response){
//                 chrome.debugger.sendCommand(debuggeeId, "DOM.getBoxModel", {
//                     nodeId: obrazekId
//                 }, function(response){
//                     var model = response.model.border;
//                     var elemLeft = model[0];
//                     var elemTop = model[1];
//                     var elemWidth = elemLeft + model[2];
//                     var elemHeight = model[5] - elemTop;
//
//                     chrome.debugger.sendCommand(debuggeeId, "Page.captureScreenshot", {
//                         clip: {
//                             x: elemLeft,
//                             y: elemTop,
//                             width: elemWidth,
//                             height: elemHeight,
//                             scale: 1
//                         }
//                     }, function(c){
//                         chrome.downloads.download({url:"data:image/png;base64," + c.data});
//                     });
//                 });
//             });
//
//         });
//      }).catch(function (e) {
//          console.log(e);
//      });
// })


// chrome.tabs.executeScript({
//   file: 'reveal.js'
// }, function() {
//     setTimeout(function(){
//         chrome.debugger.sendCommand(debuggeeId, "DOM.querySelector", {
//             nodeId: root.nodeId,
//             selector: '.customers.bx'
//         }, function(response){
//             var obrazekId = response.nodeId;
//
//             chrome.debugger.sendCommand(debuggeeId, "CSS.setEffectivePropertyValueForNode", {
//                 nodeId: obrazekId,
//                 propertyName: 'visibility',
//                 value: 'visible'
//             }, function(response){
//                 chrome.debugger.sendCommand(debuggeeId, "DOM.getBoxModel", {
//                     nodeId: obrazekId
//                 }, function(response){
//                     var model = response.model.border;
//                     var elemLeft = model[0];
//                     var elemTop = model[1];
//                     var elemWidth = elemLeft + model[2];
//                     var elemHeight = model[5] - elemTop;
//
//                     chrome.debugger.sendCommand(debuggeeId, "Page.captureScreenshot", {
//                         clip: {
//                             x: elemLeft,
//                             y: elemTop,
//                             width: elemWidth,
//                             height: elemHeight,
//                             scale: 1
//                         }
//                     }, function(c){
//                         chrome.downloads.download({url:"data:image/png;base64," + c.data});
//                     });
//                 });
//             });
//
//         });
//
//     }, 1000)
//
// });




// chrome.debugger.sendCommand(debuggeeId, "DOM.describeNode", {
//     nodeId: response.root.nodeId
// }, function(response){
//     // console.log(response);
// });
// chrome.debugger.sendCommand(debuggeeId, "DOM.resolveNode", {
//     nodeId: response.root.nodeId
// }, function(response){
//     // console.log(response);
// });
//
//
// chrome.debugger.sendCommand(debuggeeId, "DOM.querySelectorAll", {
//     nodeId: response.root.nodeId,
//     selector: '*'
// }, function(response){
//     // console.log(response);
// });

// chrome.debugger.sendCommand(debuggeeId, "DOM.querySelector", {
//     nodeId: response.root.nodeId,
//     selector: '#vid_email_marketing > img'
// }, function(response){
//     var obrazekId = response.nodeId;
//
//     chrome.debugger.sendCommand(debuggeeId, "DOM.getBoxModel", {
//         nodeId: obrazekId
//     }, function(response){
//         console.log(response);
//     });
//
//     chrome.debugger.sendCommand(debuggeeId, "DOM.resolveNode", {
//         nodeId: response.nodeId
//     }, function(response){
//         // console.log(response.object.objectId);
//         // chrome.debugger.sendCommand(debuggeeId, "Runtime.callFunctionOn", {
//         //     functionDeclaration: 'function() { return this; }',
//         //     objectId: response.object.objectId
//         // }, function(response){
//         //     console.log(response);
//         // });
//         // chrome.debugger.sendCommand(debuggeeId, "Emulation.canEmulate", {
//         //     expression: 'document'
//         // }, function(response){
//         //     console.log(response);
//         // });
//         chrome.debugger.sendCommand(debuggeeId, "Emulation.setDeviceMetricsOverride", {
//             width: 414,
//             height: 736,
//             deviceScaleFactor: 1,
//             mobile: true
//         }, function(response){
//             console.log(obrazekId);
//
//         });
//         // chrome.debugger.sendCommand(debuggeeId, "Runtime.getProperties", {
//         //     objectId: response.object.objectId
//         // }, function(response){
//         //     console.log(response);
//         // });
//     });
//     // console.log(response);
// });