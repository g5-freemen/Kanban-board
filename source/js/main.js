'use strict';

let slider = document.getElementById('#slider'),
    slides = document.querySelectorAll('div[class^="board"][class$="container"]'),
    slidesCounters = document.querySelectorAll('.board--card_counter'),
    slidesCards = document.querySelectorAll('.board__cards'),
    delBtnInCard = document.querySelectorAll('.board--delBtn'),
    kanbanBoard = document.querySelector('.board'),
    createCardBtn = document.querySelector('.board__add-card-btn'),
    modalWindow = document.querySelector('.modal-window'),
    closeModalWindowBtn = document.querySelector('.card-form--close-btn'),
    modalWindowEdit = document.querySelector('.modal-window--edit'),
    modalWindowEditContainer = modalWindowEdit.querySelector('.modal-window--container'),
    modalWindowConfirm = document.querySelector('.modal-window--confirm'),
    DelBtnTooltip = document.querySelector('.board--delBtn-tooltip'),
    postCommentBtn = document.querySelector('.card--post-comment'),
    formNewCard = document.querySelector('.card-form'),
    cardsArray = [ [], [], [] ],
    commentsArray = [],
    maxInProgressCards = 5,
    minWidthSlider = 1000;

//#region Functions

function checkWidthOverflow(place) { // check window width overflow
    let item = document.querySelector(place),
        windowWidth = item.clientWidth,
        scaleSize = +document.defaultView.getComputedStyle(item).getPropertyValue("zoom");
    while (document.documentElement.clientWidth * 0.98 < windowWidth) {
        windowWidth-=2;
        scaleSize-=0.006;
    }
    item.style.zoom = scaleSize;
    item.style.width = windowWidth + 'px';
} // end of checkWidthOverflow()

function calcBoardHeight() { //calculate and set height of board (depends of content)
    let kanbanBoardHeight = document.documentElement.clientHeight,
        kanbanBoardTitleHeight = document.querySelector('.header__title').clientHeight,
        kanbanBoardSubtitleHeight = document.querySelector('.header__subtitle').clientHeight,
        maxColumnHeight = Math.max(slides[0].clientHeight, slides[1].clientHeight, slides[2].clientHeight),
        boardHeightPx = kanbanBoardHeight*0.88 - (kanbanBoardTitleHeight + kanbanBoardSubtitleHeight) ;

    if ( boardHeightPx < maxColumnHeight ) {
        kanbanBoard.style.height = maxColumnHeight + 'px';
    } else {
        kanbanBoard.style.height = boardHeightPx + 'px';
    };
};

function loadCards(cardsName, toPlace, number) { // Load cards from localStorage
    if (localStorage[cardsName]) {
        let cardsList = JSON.parse( localStorage[cardsName] );
        for (let item of cardsList) {
            toPlace.append( createCard(item.date, item.title, item.desc, item.id, item.user, number) );
    } };
    calcBoardHeight();
};

function loadComments() { // Load comments from localStorage
    if (localStorage['comments']) {
        let commentsList = JSON.parse( localStorage['comments'] );
        for (let item of commentsList) {
            commentsArray.push( item ); // add comments to commentsArray
    } };
}

function refreshBoard() {
    for (let i = 0 ; i < 3 ; i++ )
        {
            clearColumn(cardsArray[i], slidesCards[i], '');
            loadCards(`cardsArray[${i}]`, slidesCards[i], i+1);
            setUserNamePosition(slidesCards[i]);
        }
};

function createCard(date, title, desc, idCard, user, number) {
    let card = document.createElement('li');
    card.className = "card";
    card.id = +idCard;
    card.append(createCardElement('span', title, 'title'));
    card.append(createCardElement('div', desc, 'desc'));
    card.append(createCardElement('span', user, 'user'));
    let bottomBlock = document.createElement('div');
    bottomBlock.className = "card--bottom";
    bottomBlock.append(createCardElement('span', date, 'date'));
    bottomBlock.append(createCardElement('button', '', 'delete-btn'));
    bottomBlock.append(createCardElement('button', '', 'move-btn'));
    card.append(bottomBlock);
    cardsArray[number-1].push( {title, desc, date, id:(+card.id), user} );
    showCardsCounter();
    return card;
};

function createCardElement(tag, text, name, value) {
    let element = document.createElement(tag);
    if (name) element.className = 'card--' + name;
    if (text) element.append(text);
    if (value) element.value = value;
    return element;
};

function deleteCard(cardClassName, nameInLS, array, moveTo) { // delete or move (if 4th value = true)
    let card = event.target.closest(cardClassName);
    for (let i = 0; i < array.length; i++) {
        if (array[i].id === +card.id) {
            if (moveTo) {moveTo.push( array[i] )}; //if moveTo exists -> move card to another array
            array.splice(i, 1); // delete card from cards array
        }
    }
    card.remove(); // delete card from HTML
    localStorage.setItem(nameInLS, JSON.stringify(array));
    showCardsCounter();
};

function showCardCounter(array, counter, delBtn) { //show single column cards counter
    if (array.length) {
        counter.innerHTML = array.length;
        counter.style.visibility = 'visible';
        delBtn.style.visibility = 'visible';
    } else {
        delBtn.style.visibility = 'hidden';
        counter.style.visibility = 'hidden';
    }
};

function showCardsCounter() { // show all counters of cards
    for (let i = 0; i < 3; i++) {
        showCardCounter(cardsArray[i], slidesCounters[i], delBtnInCard[i]);
    }
};

function clearColumn(array, cardsHTML, cardsLS) { // clear column
    if (array) array.length = 0;
    if (cardsHTML) cardsHTML.innerHTML = '';
    if (cardsLS) localStorage.removeItem(cardsLS);
    showCardsCounter();
};

function showEditCard(id,title,desc,date, column, user) { // show modal window to edit card
    modalWindowEdit.style.visibility = 'visible';
    slider.style.display = 'none' ;
    modalWindowEdit.querySelector('.card--edit-title').value = title;
    modalWindowEdit.querySelector('.card--edit-title').id = column;
    modalWindowEdit.querySelector('.card--edit-desc').innerHTML = desc;
    modalWindowEdit.querySelector('.card--edit-date').innerHTML = date;
    modalWindowEdit.querySelector('.card--edit-date').id = id;
    modalWindowEdit.querySelector('.card--edit-user').innerHTML = user;
    if (column == 'cardsArray[1]' || column == 'cardsArray[2]') { // no add comments btn in this columns
        document.querySelector('.card__add-comment--button').style.display = 'none';
        document.querySelector('.card--edit-img.edit-title').style.display = 'none';
        document.querySelector('.card--edit-img.edit-desc').style.display = 'none';
    } else {
        document.querySelector('.card__add-comment--button').style.display = 'flex';
        document.querySelector('.card--edit-img.edit-title').style.display = 'flex';
        document.querySelector('.card--edit-img.edit-desc').style.display = 'flex';
    }
    fadeWindow(modalWindowEditContainer, 0, 1, 1);
};

let getUsers = (url) => fetch(`${url}`)     // load users list from URL
.then(response => response.json())
.then(result => {
    for(let item of result) {
        usersList.append( createCardElement('option', item.name, '', item.name ));
    }
} );

function loadCommentsFromArray(id) { // add comments from array to editCard
    for (let i = 0; i < commentsArray.length; i++) {
        if(commentsArray[i].id === id) {
            document.querySelector('.card--comments').append(createCardElement('span', commentsArray[i].user, 'author'));
            document.querySelector('.card--comments').append(createCardElement('span', commentsArray[i].comment, 'comment'));
        }
    }
}

function checkWindowOverflow() { // if editCard window's height too big -> change window position
    if (modalWindowEditContainer.clientHeight > 0.55 * document.documentElement.clientHeight) {
        modalWindowEdit.style.alignItems = 'flex-start'
    } else {modalWindowEdit.style.alignItems = 'center'}
    if (formNewCard.clientHeight > 0.55 * document.documentElement.clientHeight) {
        modalWindow.style.alignItems = 'flex-start'
    } else {modalWindow.style.alignItems = 'center'}
}

function fadeWindow(place, beginOpacity, endOpacity, ms) {
    let currentOpacity = +beginOpacity;
    place.style.opacity = +beginOpacity; 
    
    let intervalID = setInterval( function() {show(place, beginOpacity, endOpacity)}, ms);

    function show(place, beginOpacity, endOpacity) { 
        currentOpacity = +document.defaultView.getComputedStyle(place).getPropertyValue("opacity"); 
        if ( currentOpacity.toFixed(2) != +endOpacity.toFixed(2) ) { 
            if ( beginOpacity < endOpacity ) { currentOpacity += 0.01; }
            else { currentOpacity -= 0.01 }
            place.style.opacity = currentOpacity;
        } 
        else { clearInterval(intervalID) } 
    } 
};

function setUserNamePosition(column) { // set left margin of every userName in every card
    let cardsInColumn = column.getElementsByClassName('card--user'),
        columnWidth = column.querySelector('.card--title');
    for (let element of cardsInColumn) {
        element.style.marginLeft = (columnWidth.clientWidth - element.clientWidth)-10 + 'px';
    }
};

//#endregion
//#region Listeners & etc.

getUsers('https://jsonplaceholder.typicode.com/users');
refreshBoard();
loadComments();

window.addEventListener('resize', () => {   // refresh board on resize
    if ( document.defaultView.getComputedStyle(modalWindowEditContainer).getPropertyValue("visibility") == 'hidden'
    && document.defaultView.getComputedStyle(formNewCard).getPropertyValue("visibility") == 'hidden' ) {
        location.reload();
    }
} );

kanbanBoard.addEventListener('mouseover', event => { // show tooltip if mouseover X button
    if(event.target.className === 'board--delBtn' ) {
    DelBtnTooltip.style.left = event.clientX - DelBtnTooltip.clientWidth +'px';
    DelBtnTooltip.style.top = event.clientY +'px';
    DelBtnTooltip.style.visibility = 'visible';
    }
} );

kanbanBoard.addEventListener('mouseout', () => { // hide tooltip if mouseout of X button
    DelBtnTooltip.style.visibility = 'hidden';
} );

kanbanBoard.addEventListener('click', event => {    // clicks inside of board
    if( event.target.className === 'card--title' || event.target.className === 'card--desc' // edit card
        || event.target.className === 'card--bottom' || event.target.className === 'card--date') {
        let card = event.target.closest('.card'),
            cardID = +card.id,
            column,
            cardColumn = card.closest('div').className;
        if (cardColumn == 'board__to-do--container') column='cardsArray[0]';
        if (cardColumn == 'board__in-progress--container') column='cardsArray[1]';
        if (cardColumn == 'board__done--container') column='cardsArray[2]';
        let cardTitle = card.querySelector('.card--title').innerHTML;
        let cardDesc = card.querySelector('.card--desc').innerHTML;
        let cardDate = card.querySelector('.card--date').innerHTML;
        let user = card.querySelector('.card--user').innerHTML;
        showEditCard(cardID, cardTitle, cardDesc, cardDate, column, user);
        loadCommentsFromArray(cardID);
        checkWindowOverflow();
        checkWidthOverflow('.modal-window--container');
    };

    if (event.target.className === 'board--delBtn') { // Clear Column btn
        if (event.target.closest('.board__to-do--container')) {
            clearColumn(cardsArray[0], slidesCards[0], 'cardsArray[0]'); // clear array, html, localstorage
        } else if (event.target.closest('.board__in-progress--container')) {
            modalWindowConfirm.style.visibility = 'visible'; // call confirmWindow to clear column
        } else if (event.target.closest('.board__done--container')) {
            clearColumn(cardsArray[2], slidesCards[2], 'cardsArray[2]'); // clear array, html, localstorage
        }
    };

    if(event.target.className === 'card--delete-btn' ) { // Delete card btn (inside card)
        if(event.target.closest('.board__to-do--container')) {
            deleteCard('.card', 'cardsArray[0]', cardsArray[0]);
        }
        else if(event.target.closest('.board__in-progress--container')) {
            deleteCard('.card', 'cardsArray[1]', cardsArray[1]);
        }
        else if(event.target.closest('.board__done--container')) {
            deleteCard('.card', 'cardsArray[2]', cardsArray[2]);
        };
    };

    function moveCard(column) {
        let nextColumn,
            card = event.target.closest('.card');
        column == 2 ? nextColumn = 0 : nextColumn = column+1 ;
        deleteCard(`.card`, `cardsArray[${column}]`, cardsArray[column], cardsArray[nextColumn]); // move
        slidesCards[nextColumn].append ( card );
        localStorage.setItem(`cardsArray[${nextColumn}]`, JSON.stringify(cardsArray[nextColumn]));
    }

    if(event.target.className === 'card--move-btn' ) { // Move btn (inside card)
        if(event.target.closest('.board__to-do--container')) {
            if (cardsArray[1].length >= maxInProgressCards) {
            alert(`You can't have more than ${maxInProgressCards} tasks in 'In Progress' column.\nPlease delete one or more tasks.`)
            } else {
                moveCard(0);
            }
        } else if(event.target.closest('.board__in-progress--container')) {
            moveCard(1);
        } else if(event.target.closest('.board__done--container')) {
            moveCard(2);
        };
    };
    calcBoardHeight();
    refreshBoard();
} ) // end of kanbanBoard.addEventListener

createCardBtn.addEventListener('click',  () => { // click on 'Add card' calls modal window with card form
    modalWindow.style.visibility = "visible";
    slider.style.display = 'none' ;
    checkWidthOverflow('.card-form');
    checkWindowOverflow();
    fadeWindow(formNewCard, 0, 1, 1);
} );

modalWindow.addEventListener('submit', event => {   // form submit Btn (create new card & close window)
    event.preventDefault();
    let date = new Date();
    let dateTime = date.getDate() +"/"+ (+date.getMonth()+1) +"/"+ date.getFullYear();
    if (+date.getMinutes() < 10 ) {dateTime += " - "+ date.getHours() +':0'+date.getMinutes()}
    else {dateTime += " - "+ date.getHours() +':'+date.getMinutes()};
    let cardTitle = formNewCard.querySelector('.card-form--title').value;
    let cardDesc = formNewCard.querySelector('.card-form--desc').value;
    let cardUser = formNewCard.querySelector('#usersList').value;
    let timerIDgen = new Date();
    let cardId = timerIDgen.getMinutes() * timerIDgen.getMilliseconds();
    slidesCards[0].append ( createCard(dateTime, cardTitle, cardDesc, cardId, cardUser, 1) );
    localStorage.setItem('cardsArray[0]', JSON.stringify(cardsArray[0]));
    location.reload();
} );

closeModalWindowBtn.addEventListener('click', () => {
    formNewCard.reset();
    location.reload();
}); // close modal window if click closeBtn

modalWindowEdit.addEventListener('click', event => {    
    if (!event.target.closest('.modal-window--container') || // close cardEdit modal window if click outside it
        event.target.className === 'card-form--close-btn') { // close cardEdit modal window if click closeBtn
        location.reload();
    } else { // else click inside cardEdit
    let editDesc = 'card--edit-img edit-desc',
        editTitle = 'card--edit-img edit-title',
        columnID = document.querySelector('.card--edit-title').id;

    function updateCard(column,array,thing) {
        if (columnID==column) {
            array.forEach(item => {
                if (item.id === +modalWindowEdit.querySelector('.card--edit-date').id) {
                    item[thing] = modalWindowEdit.querySelector('.card--edit-'+thing).value;
                    localStorage.setItem(columnID, JSON.stringify(array));
                } } )
        }
    };

    if (event.target.className === editDesc) { // if press editBtn (near description) => edit description
        modalWindowEdit.querySelector('.card--edit-desc').readOnly = false ;
        modalWindowEdit.querySelector('.card--edit-desc').focus();
        modalWindowEdit.querySelector('.card--edit-img.edit-desc').classList.add('saveImg');
    }
    else if (event.target.className === editTitle) { // if press editBtn (near title) => edit title
        modalWindowEdit.querySelector('.card--edit-title').readOnly = false ;
        modalWindowEdit.querySelector('.card--edit-title').focus();
        modalWindowEdit.querySelector('.card--edit-img.edit-title').classList.add('saveImg');
    }
    else if (event.target.className === editTitle+' saveImg' &&
    modalWindowEdit.querySelector('.card--edit-title').value) { //save new title (press saveBtn)
        modalWindowEdit.querySelector('.card--edit-title').readOnly = true ;
        modalWindowEdit.querySelector('.card--edit-img.edit-title').classList.remove('saveImg');
        updateCard('cardsArray[0]',cardsArray[0], 'title');
        updateCard('cardsArray[1]',cardsArray[1], 'title');
        updateCard('cardsArray[2]',cardsArray[2], 'title');
        refreshBoard();
    }
    else if (event.target.className === editDesc+' saveImg' &&
    modalWindowEdit.querySelector('.card--edit-desc').value) { //save new description (press saveBtn)
        modalWindowEdit.querySelector('.card--edit-desc').readOnly = true ;
        modalWindowEdit.querySelector('.card--edit-img.edit-desc').classList.remove('saveImg');
        updateCard('cardsArray[0]',cardsArray[0], 'desc')
        updateCard('cardsArray[1]',cardsArray[1], 'desc');
        updateCard('cardsArray[2]',cardsArray[2], 'desc');
        refreshBoard();
    } else if (event.target.className === 'card__add-comment--button') { // press Add Comment btn
        modalWindowEdit.querySelector('.card__add-comment--button').style.display = 'none';
        modalWindowEdit.querySelector('.card__add-comment').style.display = 'flex';
        modalWindowEdit.querySelector('.card--comment-usersList').append (usersList) ;
    } else if (event.target.className === 'card--post-comment') { // press POST comment btn
        if (modalWindowEdit.querySelector('#usersList').value &&
         modalWindowEdit.querySelector('.card--input-comment').value) {
            let comment = modalWindowEdit.querySelector('.card--input-comment').value,
                user = modalWindowEdit.querySelector('#usersList').value,
                id = +modalWindowEdit.querySelector('.card--edit-date').id;
                commentsArray.push({id, user, comment});
                localStorage.setItem('comments', JSON.stringify(commentsArray));
                modalWindowEdit.querySelector('.card__add-comment--button').style.display = 'flex';
                modalWindowEdit.querySelector('.card__add-comment').style.display = 'none';
                modalWindowEdit.querySelector('#usersList').value = '';
                modalWindowEdit.querySelector('.card--input-comment').value = '';
                document.querySelector('.card--comments').innerHTML = '';
                loadCommentsFromArray(id);
                checkWindowOverflow();
        } else if (!modalWindowEdit.querySelector('#usersList').value) { // tooltip if user not selected
            modalWindowEdit.querySelector('.card--noUser-tooltip').style.display = 'flex';
            setTimeout(() => {
                modalWindowEdit.querySelector('.card--noUser-tooltip').style.display = 'none';
            }, 3000);
        } else { // tooltip if empty comment
            modalWindowEdit.querySelector('.card--empty-comment-tooltip').style.display = 'flex';
            setTimeout(() => {
                modalWindowEdit.querySelector('.card--empty-comment-tooltip').style.display = 'none';
            }, 3000);
        }
    }
}} );

modalWindowConfirm.addEventListener('click', event => {
    if (event.target.id === 'deleteInProgressCards') {
        clearColumn(cardsArray[1], slidesCards[1], 'cardsArray[1]'); //clear array, html, localstorage
        location.reload();
    } else if (event.target.id === 'notDeleteInProgressCards') {
        location.reload();
    }
})

//#endregion
//#region Slider 

let slideIndex = +sessionStorage['currentSlide'] || 1; // load last slide number from sessionStorage
slider.querySelector('.prev').addEventListener('click', () => plusSlides(-1));
slider.querySelector('.next').addEventListener('click', () => plusSlides(1));
let dots = slider.querySelectorAll('.dot');
slider.querySelector('.slider-dots').addEventListener('click', event => {
    if(event.target.className.includes('dot')) {
        if (dots[0] == event.target) currentSlide(1)
        if (dots[1] == event.target) currentSlide(2)
        if (dots[2] == event.target) currentSlide(3)
    }
} )

if ( window.innerHeight > window.innerWidth &&
        window.innerWidth < minWidthSlider ||
        window.innerWidth < minWidthSlider) { 
    showSlides(slideIndex);
    }

function plusSlides(n) { // change slide number
  showSlides(slideIndex += n);
  sessionStorage.setItem('currentSlide', slideIndex); // save current slide number to sessionStorage
}

function currentSlide(n) {
  showSlides(slideIndex = n);
  sessionStorage.setItem('currentSlide', slideIndex);  // save current slide number to sessionStorage
}

function showSlides(n) {
    let dots = document.getElementsByClassName("dot");
    if (n > 3) {slideIndex = 1}; // if try to slide right from slide 3 it returns 1st slide
    if (n < 1) {slideIndex = 3}; // if try to slide left from slide 1 it returns 3rd slide

    for (let i = 0; i < 3; i++) {
        if (i === slideIndex-1) { 
            slides[i].style.display = 'flex';
            if (!dots[i].className.includes('active')) dots[i].className += " active"; // make slider dot -> active
        } else { 
            slides[i].style.display = 'none';
            dots[i].className = dots[i].className.replace(" active", "");  // make slider dot -> non-active
        } 
    }
    setUserNamePosition( slides[slideIndex-1] );
    calcBoardHeight();
}

// Slider Swipe

let x0 = null;

function handleTouchStart(evt) {
    x0 = +evt.touches[0].clientX.toFixed();
}

function handleTouchEnd(evt) {
    let x1 = +evt.touches[0].clientX.toFixed(),
        xDiff = Math.abs(x0 - x1);
    if ( (x0 || x0 === 0) && xDiff > +kanbanBoard.clientWidth * 0.1 ) {
        if (x1 > x0) { plusSlides(-1) } 
        else { plusSlides(1) }
    x0 = null;
    }
}

document.addEventListener('touchstart', handleTouchStart );
document.addEventListener('touchmove', handleTouchEnd );

//#endregion