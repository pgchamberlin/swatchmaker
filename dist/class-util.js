!function(e,s){"object"==typeof module&&module.exports?module.exports=s():e.ClassUtil=s()}(this,function(){return{has:function(e,s){return null!==e.className.match(new RegExp("(^| )"+s+"($| )"))},add:function(e,s){this.has(e,s)||(e.className=e.className+" "+s)},remove:function(e,s){this.has(e,s)&&(e.className=e.className.replace(new RegExp("((^| )"+s+"($| ))"),""))},replace:function(e,s,a){this.remove(e,s),this.add(e,a)}}});