(function() {
    var elementsWithBackgroundImage = [].filter.call(document.querySelectorAll('*'), function(el){
        if(getComputedStyle(el).backgroundImage !== 'none'){
            return true;
        }
        return false;
    });

    console.log(elementsWithBackgroundImage);
})();