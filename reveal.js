chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    addCssClasses();
    message = JSON.parse(message);
    var currentElementWithBackgroundImage = document.querySelector(message.currentElement);

    if(message.step === 1) {
        [].forEach.call(document.querySelectorAll('*'), function(el){
            var computedStyles = getComputedStyle(el);
            var elementSizes = el.getBoundingClientRect();
            var elementFixedSize = {};


            // console.log(elementSizes, el);

            if(el !== currentElementWithBackgroundImage) {
                el.style.visibility = 'hidden';
                el.style.backgroundColor = 'transparent';
            } else {
                el.style.visibility = 'visible';
                el.style.backgroundBlendMode = 'normal';
                el.style.opacity = '1';
                el.style.borderColor = 'transparent';
                el.classList.add('imageextractor-hide-pseudo-elements');
                el.classList.add('imageextractor-hide-text');

                if(computedStyles.boxSizing === "border-box") {
                    elementFixedSize.width = elementSizes.width;
                    elementFixedSize.height = elementSizes.height;
                } else {
                    elementFixedSize.width = elementSizes.width - computedStyles.paddingLeft - computedStyles.paddingRight - computedStyles.borderLeftWidth - computedStyles.borderRightWidth;
                    elementFixedSize.height = elementSizes.height - computedStyles.paddingTop - computedStyles.paddingBottom - computedStyles.borderTopWidth - computedStyles.borderBottomWidth;
                }

                el.setAttribute('style', el.getAttribute('style') + '/* xxx */;width:' + elementFixedSize.width +'px !important;height:' + elementFixedSize.height + 'px !important/* yyy */')

                getImageNaturalSize(computedStyles.backgroundImage.match(/url\(["']?([^"']*)["']?\)/)[1])
                .then(function(response){
                    console.log(response);
                }).catch(function(e){
                    console.error(e);
                })
            }
        });



        window.requestAnimationFrame(function(){
            window.requestAnimationFrame(function(){
                sendResponse();
            });
        });
    } else if(message.step === 2) {
        window.requestAnimationFrame(function(){
            window.requestAnimationFrame(function(){
                var computedStyles = getComputedStyle(currentElementWithBackgroundImage);
                var backgroundOrigin = computedStyles.backgroundOrigin;
                var clip = currentElementWithBackgroundImage.getBoundingClientRect();

                switch (backgroundOrigin) {
                    case 'border-box':
                        break;
                    case 'content-box':
                        clip.x += (parseInt(computedStyles.borderTopWidth) + parseInt(computedStyles.paddingTop));
                        clip.y += (parseInt(computedStyles.borderLeftWidth) + parseInt(computedStyles.paddingLeft));
                        clip.width -= (parseInt(computedStyles.borderTopWidth) + parseInt(computedStyles.paddingTop));
                        clip.height -= (parseInt(computedStyles.borderLeftWidth) + parseInt(computedStyles.paddingLeft));
                        break;
                    default: // padding-box
                        clip.x += parseInt(computedStyles.borderTopWidth);
                        clip.y += parseInt(computedStyles.borderLeftWidth);
                        clip.width -= parseInt(computedStyles.borderTopWidth);
                        clip.height -= parseInt(computedStyles.borderLeftWidth);
                }

                sendResponse({
                    clip: {
                        x: clip.x,
                        y: clip.y,
                        width: clip.width,
                        height: clip.height
                    }
                });
            });
        });
    }

    return true;
});


function addCssClasses() {
    var style = document.createElement("style");
    style.appendChild(document.createTextNode(""));

    document.head.appendChild(style);

    style.sheet.insertRule(".imageextractor-hide-pseudo-elements::before { visibility: hidden !important }");
    style.sheet.insertRule(".imageextractor-hide-pseudo-elements::after { visibility: hidden !important }");
    style.sheet.insertRule(".imageextractor-hide-text { color: transparent !important }");
    style.sheet.insertRule("html::-webkit-scrollbar { opacity: 0 !important; width: 0 !important, visibility: hidden !important }");
    style.sheet.insertRule("body::-webkit-scrollbar { opacity: 0 !important; width: 0 !important, visibility: hidden !important }");
}

function getImageNaturalSize(url){
    return new Promise(function(resolve, reject){
        var img = new Image();
        img.addEventListener("load", function(){
            resolve({
                width: img.naturalWidth,
                height: this.naturalHeight
            });
        });
        img.src = url;
    });
}