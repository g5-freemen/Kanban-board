parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"d6sW":[function(require,module,exports) {
"use strict";function e(e,r){var a;if("undefined"==typeof Symbol||null==e[Symbol.iterator]){if(Array.isArray(e)||(a=t(e))||r&&e&&"number"==typeof e.length){a&&(e=a);var n=0,o=function(){};return{s:o,n:function(){return n>=e.length?{done:!0}:{done:!1,value:e[n++]}},e:function(e){throw e},f:o}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var c,l=!0,d=!1;return{s:function(){a=e[Symbol.iterator]()},n:function(){var e=a.next();return l=e.done,e},e:function(e){d=!0,c=e},f:function(){try{l||null==a.return||a.return()}finally{if(d)throw c}}}}function t(e,t){if(e){if("string"==typeof e)return r(e,t);var a=Object.prototype.toString.call(e).slice(8,-1);return"Object"===a&&e.constructor&&(a=e.constructor.name),"Map"===a||"Set"===a?Array.from(e):"Arguments"===a||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(a)?r(e,t):void 0}}function r(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,a=new Array(t);r<t;r++)a[r]=e[r];return a}var a=document.getElementById("#slider"),n=document.querySelectorAll('div[class^="board"][class$="container"]'),o=document.querySelectorAll(".board--card_counter"),c=document.querySelectorAll(".board__cards"),l=document.querySelectorAll(".board--delBtn"),d=document.querySelector(".board"),i=document.querySelector(".board__add-card-btn"),s=document.querySelector(".modal-window"),u=document.querySelector(".card-form--close-btn"),y=document.querySelector(".modal-window--edit"),m=y.querySelector(".modal-window--container"),f=document.querySelector(".modal-window--confirm"),g=document.querySelector(".board--delBtn-tooltip"),p=document.querySelector(".card--post-comment"),v=document.querySelector(".card-form"),S=[[],[],[]],q=[],b=5;function h(e){for(var t=document.querySelector(e),r=t.clientWidth,a=+document.defaultView.getComputedStyle(t).getPropertyValue("zoom");.98*document.documentElement.clientWidth<r;)r-=2,a-=.006;t.style.zoom=a,t.style.width=r+"px"}function _(){var e=document.documentElement.clientHeight,t=document.querySelector(".header__title").clientHeight,r=document.querySelector(".header__subtitle").clientHeight,a=Math.max(n[0].clientHeight,n[1].clientHeight,n[2].clientHeight),o=.88*e-(t+r);d.style.height=o<a?a+"px":o+"px"}function L(t,r,a){if(localStorage[t]){var n,o=e(JSON.parse(localStorage[t]));try{for(o.s();!(n=o.n()).done;){var c=n.value;r.append(w(c.date,c.title,c.desc,c.id,c.user,a))}}catch(l){o.e(l)}finally{o.f()}}_()}function A(){if(localStorage.comments){var t,r=e(JSON.parse(localStorage.comments));try{for(r.s();!(t=r.n()).done;){var a=t.value;q.push(a)}}catch(n){r.e(n)}finally{r.f()}}}function N(){for(var e=0;e<3;e++)M(S[e],c[e],""),L("cardsArray[".concat(e,"]"),c[e],e+1),k(c[e])}function w(e,t,r,a,n,o){var c=document.createElement("li");c.className="card",c.id=+a,c.append(I("span",t,"title")),c.append(I("div",r,"desc")),c.append(I("span",n,"user"));var l=document.createElement("div");return l.className="card--bottom",l.append(I("span",e,"date")),l.append(I("button","","delete-btn")),l.append(I("button","","move-btn")),c.append(l),S[o-1].push({title:t,desc:r,date:e,id:+c.id,user:n}),H(),c}function I(e,t,r,a){var n=document.createElement(e);return r&&(n.className="card--"+r),t&&n.append(t),a&&(n.value=a),n}function E(e,t,r,a){for(var n=event.target.closest(e),o=0;o<r.length;o++)r[o].id===+n.id&&(a&&a.push(r[o]),r.splice(o,1));n.remove(),localStorage.setItem(t,JSON.stringify(r)),H()}function x(e,t,r){e.length?(t.innerHTML=e.length,t.style.visibility="visible",r.style.visibility="visible"):(r.style.visibility="hidden",t.style.visibility="hidden")}function H(){for(var e=0;e<3;e++)x(S[e],o[e],l[e])}function M(e,t,r){e&&(e.length=0),t&&(t.innerHTML=""),r&&localStorage.removeItem(r),H()}function V(e,t,r,n,o,c){y.style.visibility="visible",a.style.display="none",y.querySelector(".card--edit-title").value=t,y.querySelector(".card--edit-title").id=o,y.querySelector(".card--edit-desc").innerHTML=r,y.querySelector(".card--edit-date").innerHTML=n,y.querySelector(".card--edit-date").id=e,y.querySelector(".card--edit-user").innerHTML=c,"cardsArray[1]"==o||"cardsArray[2]"==o?(document.querySelector(".card__add-comment--button").style.display="none",document.querySelector(".card--edit-img.edit-title").style.display="none",document.querySelector(".card--edit-img.edit-desc").style.display="none"):(document.querySelector(".card__add-comment--button").style.display="flex",document.querySelector(".card--edit-img.edit-title").style.display="flex",document.querySelector(".card--edit-img.edit-desc").style.display="flex"),P(m,0,1,1)}var O=function(t){return fetch("".concat(t)).then(function(e){return e.json()}).then(function(t){var r,a=e(t);try{for(a.s();!(r=a.n()).done;){var n=r.value;usersList.append(I("option",n.name,"",n.name))}}catch(o){a.e(o)}finally{a.f()}})};function T(e){for(var t=0;t<q.length;t++)q[t].id===e&&(document.querySelector(".card--comments").append(I("span",q[t].user,"author")),document.querySelector(".card--comments").append(I("span",q[t].comment,"comment")))}function C(){m.clientHeight>.55*document.documentElement.clientHeight?y.style.alignItems="flex-start":y.style.alignItems="center",v.clientHeight>.55*document.documentElement.clientHeight?s.style.alignItems="flex-start":s.style.alignItems="center"}function P(e,t,r,a){var n=+t;e.style.opacity=+t;var o=setInterval(function(){!function(e,t,r){(n=+document.defaultView.getComputedStyle(e).getPropertyValue("opacity")).toFixed(2)!=+r.toFixed(2)?(t<r?n+=.01:n-=.01,e.style.opacity=n):clearInterval(o)}(e,t,r)},a)}function k(t){var r,a=t.getElementsByClassName("card--user"),n=t.querySelector(".card--title"),o=e(a);try{for(o.s();!(r=o.n()).done;){var c=r.value;c.style.marginLeft=n.clientWidth-c.clientWidth-10+"px"}}catch(l){o.e(l)}finally{o.f()}}O("https://jsonplaceholder.typicode.com/users"),N(),A(),window.addEventListener("resize",function(){"hidden"==document.defaultView.getComputedStyle(m).getPropertyValue("visibility")&&"hidden"==document.defaultView.getComputedStyle(v).getPropertyValue("visibility")&&location.reload()}),d.addEventListener("mouseover",function(e){"board--delBtn"===e.target.className&&(g.style.left=e.clientX-g.clientWidth+"px",g.style.top=e.clientY+"px",g.style.visibility="visible")}),d.addEventListener("mouseout",function(){g.style.visibility="hidden"}),d.addEventListener("click",function(e){if("card--title"===e.target.className||"card--desc"===e.target.className||"card--bottom"===e.target.className||"card--date"===e.target.className){var t,r=e.target.closest(".card"),a=+r.id,n=r.closest("div").className;"board__to-do--container"==n&&(t="cardsArray[0]"),"board__in-progress--container"==n&&(t="cardsArray[1]"),"board__done--container"==n&&(t="cardsArray[2]"),V(a,r.querySelector(".card--title").innerHTML,r.querySelector(".card--desc").innerHTML,r.querySelector(".card--date").innerHTML,t,r.querySelector(".card--user").innerHTML),T(a),C(),h(".modal-window--container")}function o(t){var r,a=e.target.closest(".card");r=2==t?0:t+1,E(".card","cardsArray[".concat(t,"]"),S[t],S[r]),c[r].append(a),localStorage.setItem("cardsArray[".concat(r,"]"),JSON.stringify(S[r]))}"board--delBtn"===e.target.className&&(e.target.closest(".board__to-do--container")?M(S[0],c[0],"cardsArray[0]"):e.target.closest(".board__in-progress--container")?f.style.visibility="visible":e.target.closest(".board__done--container")&&M(S[2],c[2],"cardsArray[2]")),"card--delete-btn"===e.target.className&&(e.target.closest(".board__to-do--container")?E(".card","cardsArray[0]",S[0]):e.target.closest(".board__in-progress--container")?E(".card","cardsArray[1]",S[1]):e.target.closest(".board__done--container")&&E(".card","cardsArray[2]",S[2])),"card--move-btn"===e.target.className&&(e.target.closest(".board__to-do--container")?S[1].length>=b?alert("You can't have more than ".concat(b," tasks in 'In Progress' column.\nPlease delete one or more tasks.")):o(0):e.target.closest(".board__in-progress--container")?o(1):e.target.closest(".board__done--container")&&o(2)),_(),N()}),i.addEventListener("click",function(){s.style.visibility="visible",a.style.display="none",h(".card-form"),C(),P(v,0,1,1)}),s.addEventListener("submit",function(e){e.preventDefault();var t=new Date,r=t.getDate()+"/"+(+t.getMonth()+1)+"/"+t.getFullYear();+t.getMinutes()<10?r+=" - "+t.getHours()+":0"+t.getMinutes():r+=" - "+t.getHours()+":"+t.getMinutes();var a=v.querySelector(".card-form--title").value,n=v.querySelector(".card-form--desc").value,o=v.querySelector("#usersList").value,l=new Date,d=l.getMinutes()*l.getMilliseconds();c[0].append(w(r,a,n,d,o,1)),localStorage.setItem("cardsArray[0]",JSON.stringify(S[0])),location.reload()}),u.addEventListener("click",function(){v.reset(),location.reload()}),y.addEventListener("click",function(e){if(e.target.closest(".modal-window--container")&&"card-form--close-btn"!==e.target.className){var t=document.querySelector(".card--edit-title").id;function r(e,r,a){t==e&&r.forEach(function(e){e.id===+y.querySelector(".card--edit-date").id&&(e[a]=y.querySelector(".card--edit-"+a).value,localStorage.setItem(t,JSON.stringify(r)))})}if("card--edit-img edit-desc"===e.target.className)y.querySelector(".card--edit-desc").readOnly=!1,y.querySelector(".card--edit-desc").focus(),y.querySelector(".card--edit-img.edit-desc").classList.add("saveImg");else if("card--edit-img edit-title"===e.target.className)y.querySelector(".card--edit-title").readOnly=!1,y.querySelector(".card--edit-title").focus(),y.querySelector(".card--edit-img.edit-title").classList.add("saveImg");else if("card--edit-img edit-title saveImg"===e.target.className&&y.querySelector(".card--edit-title").value)y.querySelector(".card--edit-title").readOnly=!0,y.querySelector(".card--edit-img.edit-title").classList.remove("saveImg"),r("cardsArray[0]",S[0],"title"),r("cardsArray[1]",S[1],"title"),r("cardsArray[2]",S[2],"title"),N();else if("card--edit-img edit-desc saveImg"===e.target.className&&y.querySelector(".card--edit-desc").value)y.querySelector(".card--edit-desc").readOnly=!0,y.querySelector(".card--edit-img.edit-desc").classList.remove("saveImg"),r("cardsArray[0]",S[0],"desc"),r("cardsArray[1]",S[1],"desc"),r("cardsArray[2]",S[2],"desc"),N();else if("card__add-comment--button"===e.target.className)y.querySelector(".card__add-comment--button").style.display="none",y.querySelector(".card__add-comment").style.display="flex",y.querySelector(".card--comment-usersList").append(usersList);else if("card--post-comment"===e.target.className)if(y.querySelector("#usersList").value&&y.querySelector(".card--input-comment").value){var a=y.querySelector(".card--input-comment").value,n=y.querySelector("#usersList").value,o=+y.querySelector(".card--edit-date").id;q.push({id:o,user:n,comment:a}),localStorage.setItem("comments",JSON.stringify(q)),y.querySelector(".card__add-comment--button").style.display="flex",y.querySelector(".card__add-comment").style.display="none",y.querySelector("#usersList").value="",y.querySelector(".card--input-comment").value="",document.querySelector(".card--comments").innerHTML="",T(o),C()}else y.querySelector("#usersList").value?(y.querySelector(".card--empty-comment-tooltip").style.display="flex",setTimeout(function(){y.querySelector(".card--empty-comment-tooltip").style.display="none"},3e3)):(y.querySelector(".card--noUser-tooltip").style.display="flex",setTimeout(function(){y.querySelector(".card--noUser-tooltip").style.display="none"},3e3))}else location.reload()}),f.addEventListener("click",function(e){"deleteInProgressCards"===e.target.id?(M(S[1],c[1],"cardsArray[1]"),location.reload()):"notDeleteInProgressCards"===e.target.id&&location.reload()});var B=+sessionStorage.currentSlide||1;function J(e){j(B+=e),sessionStorage.setItem("currentSlide",B)}function W(e){j(B=e),sessionStorage.setItem("currentSlide",B)}function j(e){var t=document.getElementsByClassName("dot");e>3&&(B=1),e<1&&(B=3);for(var r=0;r<3;r++)r===B-1?(n[r].style.display="flex",t[r].className+=" active"):(n[r].style.display="none",t[r].className=t[r].className.replace(" active",""));k(n[B-1]),_()}"none"==document.defaultView.getComputedStyle(n[0]).getPropertyValue("display")||"none"==document.defaultView.getComputedStyle(n[1]).getPropertyValue("display")||"none"==document.defaultView.getComputedStyle(n[2]).getPropertyValue("display")?j(B):a.style.display="none";var D=null;function F(e){D=+e.touches[0].clientX.toFixed()}function z(e){var t=+e.touches[0].clientX.toFixed(),r=Math.abs(D-t);(D||0===D)&&r>.05*+d.clientWidth&&(J(t>D?-1:1),D=null)}document.addEventListener("touchstart",F),document.addEventListener("touchmove",z);
},{}]},{},["d6sW"], null)
//# sourceMappingURL=main.746af16c.js.map