(function() {
    [].forEach.call(document.querySelectorAll('link[rel="stylesheet"]'), function(link){
        link.setAttribute('crossorigin', '');
        link.href += ""; // reload css
    });

    setTimeout(function(){
        var rules = [].map.call(document.styleSheets,function(ss){
            try{
                return ss.rules;
            } catch(e) {
                return null;
            }
        });

        rules = [].map.call(rules, function(r){if(r) return [].slice.call(r,0)})
        rules = [].concat.apply([],rules)
        rules = rules.filter(function(r){
            if(r && r.media){
                return true;
            }
        });
        rules = rules.filter(function(mq){
            if(mq.conditionText.indexOf('width')!==-1){
                return true;
            }
        });
        console.log(rules);
    }, 1000);



    // console.log(document.styleSheets);
})();