// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

require = (function (modules, cache, entry) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof require === "function" && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof require === "function" && require;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }
      
      localRequire.resolve = resolve;

      var module = cache[name] = new newRequire.Module;

      modules[name][0].call(module.exports, localRequire, module, module.exports);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module() {
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  // Override the current require with this new one
  return newRequire;
})({3:[function(require,module,exports) {
"use strict";let e=document.getElementById("#slider"),t=document.querySelectorAll('div[class^="board"][class$="container"]'),r=document.querySelectorAll(".board--card_counter"),a=document.querySelectorAll(".board__cards"),l=document.querySelectorAll(".board--delBtn"),c=document.querySelector(".board"),o=document.querySelector(".board__add-card-btn"),d=document.querySelector(".modal-window"),n=document.querySelector(".card-form--close-btn"),i=document.querySelector(".modal-window--edit"),s=i.querySelector(".modal-window--container"),u=document.querySelector(".modal-window--confirm"),m=document.querySelector(".board--delBtn-tooltip"),y=document.querySelector(".card--post-comment"),g=document.querySelector(".card-form"),p=[[],[],[]],S=[],f=5;function q(e){let t=document.querySelector(e),r=t.clientWidth,a=+document.defaultView.getComputedStyle(t).getPropertyValue("zoom");for(;.98*document.documentElement.clientWidth<r;)r-=2,a-=.006;t.style.zoom=a,t.style.width=r+"px"}function v(){let e=document.documentElement.clientHeight,r=document.querySelector(".header__title").clientHeight,a=document.querySelector(".header__subtitle").clientHeight,l=Math.max(t[0].clientHeight,t[1].clientHeight,t[2].clientHeight),o=.88*e-(r+a);c.style.height=o<l?l+"px":o+"px"}function b(e,t,r){if(localStorage[e]){let a=JSON.parse(localStorage[e]);for(let e of a)t.append(L(e.date,e.title,e.desc,e.id,e.user,r))}v()}function h(){if(localStorage.comments){let e=JSON.parse(localStorage.comments);for(let t of e)S.push(t)}}function _(){for(let e=0;e<3;e++)E(p[e],a[e],""),b(`cardsArray[${e}]`,a[e],e+1),C(a[e])}function L(e,t,r,a,l,c){let o=document.createElement("li");o.className="card",o.id=+a,o.append(N("span",t,"title")),o.append(N("div",r,"desc")),o.append(N("span",l,"user"));let d=document.createElement("div");return d.className="card--bottom",d.append(N("span",e,"date")),d.append(N("button","","delete-btn")),d.append(N("button","","move-btn")),o.append(d),p[c-1].push({title:t,desc:r,date:e,id:+o.id,user:l}),I(),o}function N(e,t,r,a){let l=document.createElement(e);return r&&(l.className="card--"+r),t&&l.append(t),a&&(l.value=a),l}function A(e,t,r,a){let l=event.target.closest(e);for(let e=0;e<r.length;e++)r[e].id===+l.id&&(a&&a.push(r[e]),r.splice(e,1));l.remove(),localStorage.setItem(t,JSON.stringify(r)),I()}function w(e,t,r){e.length?(t.innerHTML=e.length,t.style.visibility="visible",r.style.visibility="visible"):(r.style.visibility="hidden",t.style.visibility="hidden")}function I(){for(let e=0;e<3;e++)w(p[e],r[e],l[e])}function E(e,t,r){e&&(e.length=0),t&&(t.innerHTML=""),r&&localStorage.removeItem(r),I()}function H(t,r,a,l,c,o){i.style.visibility="visible",e.style.display="none",i.querySelector(".card--edit-title").value=r,i.querySelector(".card--edit-title").id=c,i.querySelector(".card--edit-desc").innerHTML=a,i.querySelector(".card--edit-date").innerHTML=l,i.querySelector(".card--edit-date").id=t,i.querySelector(".card--edit-user").innerHTML=o,"cardsArray[1]"==c||"cardsArray[2]"==c?(document.querySelector(".card__add-comment--button").style.display="none",document.querySelector(".card--edit-img.edit-title").style.display="none",document.querySelector(".card--edit-img.edit-desc").style.display="none"):(document.querySelector(".card__add-comment--button").style.display="flex",document.querySelector(".card--edit-img.edit-title").style.display="flex",document.querySelector(".card--edit-img.edit-desc").style.display="flex"),T(s,0,1,1)}let x=e=>fetch(`${e}`).then(e=>e.json()).then(e=>{for(let t of e)usersList.append(N("option",t.name,"",t.name))});function M(e){for(let t=0;t<S.length;t++)S[t].id===e&&(document.querySelector(".card--comments").append(N("span",S[t].user,"author")),document.querySelector(".card--comments").append(N("span",S[t].comment,"comment")))}function V(){s.clientHeight>.55*document.documentElement.clientHeight?i.style.alignItems="flex-start":i.style.alignItems="center",g.clientHeight>.55*document.documentElement.clientHeight?d.style.alignItems="flex-start":d.style.alignItems="center"}function T(e,t,r,a){let l=+t;e.style.opacity=+t;let c=setInterval(function(){!function(e,t,r){(l=+document.defaultView.getComputedStyle(e).getPropertyValue("opacity")).toFixed(2)!=+r.toFixed(2)?(t<r?l+=.01:l-=.01,e.style.opacity=l):clearInterval(c)}(e,t,r)},a)}function C(e){let t=e.getElementsByClassName("card--user"),r=e.querySelector(".card--title");for(let e of t)e.style.marginLeft=r.clientWidth-e.clientWidth-10+"px"}x("https://jsonplaceholder.typicode.com/users"),_(),h(),window.addEventListener("resize",()=>{"hidden"==document.defaultView.getComputedStyle(s).getPropertyValue("visibility")&&"hidden"==document.defaultView.getComputedStyle(g).getPropertyValue("visibility")&&location.reload()}),c.addEventListener("mouseover",e=>{"board--delBtn"===e.target.className&&(m.style.left=e.clientX-m.clientWidth+"px",m.style.top=e.clientY+"px",m.style.visibility="visible")}),c.addEventListener("mouseout",()=>{m.style.visibility="hidden"}),c.addEventListener("click",e=>{if("card--title"===e.target.className||"card--desc"===e.target.className||"card--bottom"===e.target.className||"card--date"===e.target.className){let t,r=e.target.closest(".card"),a=+r.id,l=r.closest("div").className;"board__to-do--container"==l&&(t="cardsArray[0]"),"board__in-progress--container"==l&&(t="cardsArray[1]"),"board__done--container"==l&&(t="cardsArray[2]"),H(a,r.querySelector(".card--title").innerHTML,r.querySelector(".card--desc").innerHTML,r.querySelector(".card--date").innerHTML,t,r.querySelector(".card--user").innerHTML),M(a),V(),q(".modal-window--container")}function t(t){let r,l=e.target.closest(".card");r=2==t?0:t+1,A(".card",`cardsArray[${t}]`,p[t],p[r]),a[r].append(l),localStorage.setItem(`cardsArray[${r}]`,JSON.stringify(p[r]))}"board--delBtn"===e.target.className&&(e.target.closest(".board__to-do--container")?E(p[0],a[0],"cardsArray[0]"):e.target.closest(".board__in-progress--container")?u.style.visibility="visible":e.target.closest(".board__done--container")&&E(p[2],a[2],"cardsArray[2]")),"card--delete-btn"===e.target.className&&(e.target.closest(".board__to-do--container")?A(".card","cardsArray[0]",p[0]):e.target.closest(".board__in-progress--container")?A(".card","cardsArray[1]",p[1]):e.target.closest(".board__done--container")&&A(".card","cardsArray[2]",p[2])),"card--move-btn"===e.target.className&&(e.target.closest(".board__to-do--container")?p[1].length>=f?alert(`You can't have more than ${f} tasks in 'In Progress' column.\nPlease delete one or more tasks.`):t(0):e.target.closest(".board__in-progress--container")?t(1):e.target.closest(".board__done--container")&&t(2)),v(),_()}),o.addEventListener("click",()=>{d.style.visibility="visible",e.style.display="none",q(".card-form"),V(),T(g,0,1,1)}),d.addEventListener("submit",e=>{e.preventDefault();let t=new Date,r=t.getDate()+"/"+(+t.getMonth()+1)+"/"+t.getFullYear();+t.getMinutes()<10?r+=" - "+t.getHours()+":0"+t.getMinutes():r+=" - "+t.getHours()+":"+t.getMinutes();let l=g.querySelector(".card-form--title").value,c=g.querySelector(".card-form--desc").value,o=g.querySelector("#usersList").value,d=new Date,n=d.getMinutes()*d.getMilliseconds();a[0].append(L(r,l,c,n,o,1)),localStorage.setItem("cardsArray[0]",JSON.stringify(p[0])),location.reload()}),n.addEventListener("click",()=>{g.reset(),location.reload()}),i.addEventListener("click",e=>{if(e.target.closest(".modal-window--container")&&"card-form--close-btn"!==e.target.className){let r="card--edit-img edit-desc",a="card--edit-img edit-title",l=document.querySelector(".card--edit-title").id;function t(e,t,r){l==e&&t.forEach(e=>{e.id===+i.querySelector(".card--edit-date").id&&(e[r]=i.querySelector(".card--edit-"+r).value,localStorage.setItem(l,JSON.stringify(t)))})}if(e.target.className===r)i.querySelector(".card--edit-desc").readOnly=!1,i.querySelector(".card--edit-desc").focus(),i.querySelector(".card--edit-img.edit-desc").classList.add("saveImg");else if(e.target.className===a)i.querySelector(".card--edit-title").readOnly=!1,i.querySelector(".card--edit-title").focus(),i.querySelector(".card--edit-img.edit-title").classList.add("saveImg");else if(e.target.className===a+" saveImg"&&i.querySelector(".card--edit-title").value)i.querySelector(".card--edit-title").readOnly=!0,i.querySelector(".card--edit-img.edit-title").classList.remove("saveImg"),t("cardsArray[0]",p[0],"title"),t("cardsArray[1]",p[1],"title"),t("cardsArray[2]",p[2],"title"),_();else if(e.target.className===r+" saveImg"&&i.querySelector(".card--edit-desc").value)i.querySelector(".card--edit-desc").readOnly=!0,i.querySelector(".card--edit-img.edit-desc").classList.remove("saveImg"),t("cardsArray[0]",p[0],"desc"),t("cardsArray[1]",p[1],"desc"),t("cardsArray[2]",p[2],"desc"),_();else if("card__add-comment--button"===e.target.className)i.querySelector(".card__add-comment--button").style.display="none",i.querySelector(".card__add-comment").style.display="flex",i.querySelector(".card--comment-usersList").append(usersList);else if("card--post-comment"===e.target.className)if(i.querySelector("#usersList").value&&i.querySelector(".card--input-comment").value){let e=i.querySelector(".card--input-comment").value,t=i.querySelector("#usersList").value,r=+i.querySelector(".card--edit-date").id;S.push({id:r,user:t,comment:e}),localStorage.setItem("comments",JSON.stringify(S)),i.querySelector(".card__add-comment--button").style.display="flex",i.querySelector(".card__add-comment").style.display="none",i.querySelector("#usersList").value="",i.querySelector(".card--input-comment").value="",document.querySelector(".card--comments").innerHTML="",M(r),V()}else i.querySelector("#usersList").value?(i.querySelector(".card--empty-comment-tooltip").style.display="flex",setTimeout(()=>{i.querySelector(".card--empty-comment-tooltip").style.display="none"},3e3)):(i.querySelector(".card--noUser-tooltip").style.display="flex",setTimeout(()=>{i.querySelector(".card--noUser-tooltip").style.display="none"},3e3))}else location.reload()}),u.addEventListener("click",e=>{"deleteInProgressCards"===e.target.id?(E(p[1],a[1],"cardsArray[1]"),location.reload()):"notDeleteInProgressCards"===e.target.id&&location.reload()});let O=+sessionStorage.currentSlide||1;function P(e){B(O+=e),sessionStorage.setItem("currentSlide",O)}function k(e){B(O=e),sessionStorage.setItem("currentSlide",O)}function B(e){let r=document.getElementsByClassName("dot");e>3&&(O=1),e<1&&(O=3);for(let e=0;e<3;e++)e===O-1?(t[e].style.display="flex",r[e].className+=" active"):(t[e].style.display="none",r[e].className=r[e].className.replace(" active",""));C(t[O-1]),v()}"none"==document.defaultView.getComputedStyle(t[0]).getPropertyValue("display")||"none"==document.defaultView.getComputedStyle(t[1]).getPropertyValue("display")||"none"==document.defaultView.getComputedStyle(t[2]).getPropertyValue("display")?B(O):e.style.display="none";let J=null;function W(e){J=+e.touches[0].clientX.toFixed()}function $(e){let t=+e.touches[0].clientX.toFixed(),r=Math.abs(J-t);(J||0===J)&&r>.05*+c.clientWidth&&(P(t>J?-1:1),J=null)}document.addEventListener("touchstart",W),document.addEventListener("touchmove",$);
},{}]},{},[3])