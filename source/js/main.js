'use strict';

let kanbanBoard = document.querySelector('.board'),
    toDoBoard = document.querySelector('.board__to-do--container'),
    toDoCards = toDoBoard.querySelector('.board__cards'),
    inProgressBoard = document.querySelector('.board__in-progress--container'),
    inProgressCards = inProgressBoard.querySelector('.board__cards'),
    doneBoard = document.querySelector('.board__done--container'),
    doneCards = doneBoard.querySelector('.board__cards'),
    createCardBtn = document.querySelector('.board__add-card-btn'),
    modalWindow = document.querySelector('.modal-window'),
    closeModalWindowBtn = document.querySelector('.card-form--close-btn'),
    modalWindowEdit = document.querySelector('.modal-window--edit'),
    modalWindowEditContainer = modalWindowEdit.querySelector('.modal-window--container'),
    toDoCardsCounter = toDoBoard.querySelector('.board--card_counter'),
    inProgressCardsCounter = inProgressBoard.querySelector('.board--card_counter'),
    doneCardsCounter = doneBoard.querySelector('.board--card_counter'),
    toDoCardsDelBtn = toDoBoard.querySelector('.board--delBtn'),
    inProgressCardsDelBtn = inProgressBoard.querySelector('.board--delBtn'),
    doneCardsDelBtn = doneBoard.querySelector('.board--delBtn'),
    DelBtnTooltip = toDoBoard.querySelector('.board--delBtn-tooltip'),
    toDoCardsArray = [],
    inProgressCardsArray = [],
    doneCardsArray = [],
    maxInProgressCards = 5,
    mobileWidthUI = 541;

//#region Functions

function calcBoardHeight() { //calculate and set height of board (depends of content)
    let kanbanBoardHeight = document.documentElement.clientHeight,
        kanbanBoardTitleHeight = document.querySelector('.header__title').clientHeight,
        kanbanBoardSubtitleHeight = document.querySelector('.header__subtitle').clientHeight,
        toDoHeight = toDoBoard.clientHeight,
        inProgressHeight = inProgressBoard.clientHeight,
        doneHeight = doneBoard.clientHeight,
        maxColumnHeight;

    if (toDoHeight >= inProgressHeight && toDoHeight >= doneHeight ) maxColumnHeight = toDoHeight;
    if (inProgressHeight >= toDoHeight && inProgressHeight >= doneHeight ) maxColumnHeight = inProgressHeight;
    if (doneHeight >= inProgressHeight && doneHeight >= toDoHeight ) maxColumnHeight = doneHeight;

    let boardHeightPx = kanbanBoardHeight*0.88 - (kanbanBoardTitleHeight + kanbanBoardSubtitleHeight) ;

    if ( boardHeightPx < maxColumnHeight ) {
        kanbanBoard.style.height = maxColumnHeight + 'px';
    } else {
        kanbanBoard.style.height = boardHeightPx + 'px';
    };
}

function loadCards(cardsName, toPlace, number) { // Load cards from LS
    if (localStorage[cardsName]) {
        let cardsList = JSON.parse( localStorage[cardsName] );
        for (let item of cardsList) {
            toPlace.append( createCard(item.date, item.title, item.desc, item.id, number) );
    } };
    calcBoardHeight();
};

function refreshBoard() {
    clearColumn(toDoCardsArray, toDoCards, '');
    clearColumn(inProgressCardsArray, inProgressCards, '');
    clearColumn(doneCardsArray, doneCards, '');
    loadCards('toDoCards', toDoCards, 1);
    loadCards('inProgressCards', inProgressCards, 2);
    loadCards('doneCards', doneCards, 3);
};

function createCard(date, title, desc, idCard, number) {
    let card = document.createElement('li');
    card.className = "card";
    card.id = +idCard;
    card.append(createCardElement('span', title, 'title'));
    card.append(createCardElement('div', desc, 'desc'));
    let bottomBlock = document.createElement('div');
    bottomBlock.className = "card--bottom";
    bottomBlock.append(createCardElement('span', date, 'date'));
    bottomBlock.append(createCardElement('button', '', 'delete-btn'));
    bottomBlock.append(createCardElement('button', '', 'move-btn'));
    card.append(bottomBlock);
    if (number===1) toDoCardsArray.push( {title, desc, date, id:(+card.id)} );
    if (number===2) inProgressCardsArray.push( {title, desc, date, id:(+card.id)} );
    if (number===3) doneCardsArray.push( {title, desc, date, id:(+card.id)} );
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

function deleteCard(cardClassName, nameInLS, array, moveTo) { //delete or move (if 4 value)
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
    showCardCounter(toDoCardsArray, toDoCardsCounter, toDoCardsDelBtn);
    showCardCounter(inProgressCardsArray, inProgressCardsCounter, inProgressCardsDelBtn);
    showCardCounter(doneCardsArray, doneCardsCounter, doneCardsDelBtn);
};

function closeModalWindow() {
    let formNewCard = document.querySelector('.card-form');
    formNewCard.reset();
    modalWindow.style.visibility = 'hidden';
};

function clearColumn(array, cardsHTML, cardsLS) { // clear column
    if (array) array.length = 0;
    if (cardsHTML) cardsHTML.innerHTML = '';
    if (cardsLS) localStorage.removeItem(cardsLS);
    showCardsCounter();
};

function showEditCard(id,title,desc,date, column) { // show modal window to edit card
    modalWindowEdit.style.visibility = 'visible';
    modalWindowEdit.querySelector('.card--edit-title').value = title;
    modalWindowEdit.querySelector('.card--edit-title').id = column;
    modalWindowEdit.querySelector('.card--edit-desc').innerHTML = desc;
    modalWindowEdit.querySelector('.card--edit-date').innerHTML = date;
    modalWindowEdit.querySelector('.card--edit-date').id = id;
};

let getUsers = (url) => fetch(`${url}`)     // load users list from URL
.then(response => response.json())
.then(result => {
    for(let item of result) {
        usersList.append( createCardElement('option', item.name, '', item.name ));
    }
} );

//#endregion
//#region Listeners & etc.

getUsers('https://jsonplaceholder.typicode.com/users');

refreshBoard();

kanbanBoard.addEventListener('mouseover', event => { // show tooltip if mouseover X button
    if(event.target.className === 'board--delBtn' ) {
    DelBtnTooltip.style.left = event.clientX-50 +'px';
    DelBtnTooltip.style.top = event.clientY+10 +'px';
    DelBtnTooltip.style.visibility = 'visible';
    }
} );

kanbanBoard.addEventListener('mouseout', () => { // hide tooltip if mouseout of X button
    DelBtnTooltip.style.visibility = 'hidden';
} );

kanbanBoard.addEventListener('click', event => {    // clicks inside of board
    if( event.target.className === 'card--title' || event.target.className === 'card--desc' // edit card
        || event.target.className === 'card--bottom' || event.target.className === 'card--date') {
        let card = event.target.closest('.card');
        let cardID = card.id;
        let column;
        let cardColumn = card.closest('div').className;
        if (cardColumn == 'board__to-do--container') column='toDoCards';
        if (cardColumn == 'board__in-progress--container') column='inProgressCards';
        if (cardColumn == 'board__done--container') column='doneCards';
        let cardTitle = card.querySelector('.card--title').innerHTML;
        let cardDesc = card.querySelector('.card--desc').innerHTML;
        let cardDate = card.querySelector('.card--date').innerHTML;
        showEditCard(cardID, cardTitle, cardDesc, cardDate, column);
    };

    if (event.target.className === 'board--delBtn') { // Clear Column btn
        if (event.target.closest('.board__to-do--container')) {
            clearColumn(toDoCardsArray, toDoCards, 'toDoCards'); //clear array, html, localstorage
        }
        if (event.target.closest('.board__in-progress--container')) {
            if (confirm('Delete all Cards?')) {
                clearColumn(inProgressCardsArray, inProgressCards, 'inProgressCards'); //clear array, html, localstorage
            }
        }
        if (event.target.closest('.board__done--container')) {
            clearColumn(doneCardsArray, doneCards, 'doneCards'); //clear array, html, localstorage
        }
    };

    if(event.target.className === 'card--delete-btn' ) { // Delete card btn (inside card)
        if(event.target.closest('.board__to-do--container')) {
            deleteCard('.card', 'toDoCards', toDoCardsArray);
        }
        else if(event.target.closest('.board__in-progress--container')) {
            deleteCard('.card', 'inProgressCards', inProgressCardsArray);
        }
        else if(event.target.closest('.board__done--container')) {
            deleteCard('.card', 'doneCards', doneCardsArray);
        };
    };

    if(event.target.className === 'card--move-btn' ) { // Move btn (inside card)
        if(event.target.closest('.board__to-do--container')) {
            if (inProgressCardsArray.length >= maxInProgressCards) {
            alert(`You can't have more than ${maxInProgressCards} tasks in 'In Progress' column.\nPlease delete one or more tasks.`)
            } else {
            let card = event.target.closest('.card');
            deleteCard('.card', 'toDoCards', toDoCardsArray, inProgressCardsArray); // Copy and delete = move
            inProgressCards.append ( card );
            localStorage.setItem('inProgressCards', JSON.stringify(inProgressCardsArray)); 
            }
        } else if(event.target.closest('.board__in-progress--container')) {
            let card = event.target.closest('.card');
            deleteCard('.card', 'inProgressCards', inProgressCardsArray, doneCardsArray); // Copy and delete = move
            doneCards.append ( card );
            localStorage.setItem('doneCards', JSON.stringify(doneCardsArray));
        } else if(event.target.closest('.board__done--container')) {
            let card = event.target.closest('.card');
            deleteCard('.card', 'doneCards', doneCardsArray, toDoCardsArray); // Copy and delete = move
            toDoCards.append ( card );
            localStorage.setItem('toDoCards', JSON.stringify(toDoCardsArray));
        };
    };
    calcBoardHeight();
} ) // end of kanbanBoard.addEventListener

createCardBtn.addEventListener('click',  () => { // click on 'Add card' calls modal window with card form
    modalWindow.style.visibility = "visible";
} );

modalWindow.addEventListener('submit', event => {   // form submit Btn create new card & close window
    let formNewCard = document.querySelector('.card-form');
    event.preventDefault();
    let date = new Date();
    let DateTime = date.getDate() +"/"+ date.getMonth() +"/"+ date.getFullYear();
    if (+date.getMinutes() < 10 ) {DateTime += " - "+ date.getHours() +':0'+date.getMinutes()}
    else {DateTime += " - "+ date.getHours() +':'+date.getMinutes()};
    let toDoCardTitle = formNewCard.querySelector('.card-form--title').value;
    let toDoCardDesc = formNewCard.querySelector('.card-form--desc').value;
    let timerIDgen = new Date();
    let cardId = timerIDgen.getMinutes() * timerIDgen.getMilliseconds();
    toDoCards.append ( createCard(DateTime, toDoCardTitle, toDoCardDesc, cardId, 1) );
    localStorage.setItem('toDoCards', JSON.stringify(toDoCardsArray));
    closeModalWindow();
    calcBoardHeight();
} );

closeModalWindowBtn.addEventListener('click', closeModalWindow); // close modal window if click closeBtn

modalWindowEdit.addEventListener('click', event => {    
    if (!event.target.closest('.modal-window--container')) {// close cardEdit modal window if click outside it
        modalWindowEdit.style.visibility = 'hidden';
    } else {
    let editDesc = 'card--edit-img edit-desc',
        editTitle = 'card--edit-img edit-title',
        columnID = document.querySelector('.card--edit-title').id;
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
    else if (event.target.className === editTitle+' saveImg') { //save new title (press saveBtn)
        modalWindowEdit.querySelector('.card--edit-title').readOnly = true ;
        modalWindowEdit.querySelector('.card--edit-img.edit-title').classList.remove('saveImg');
        if (columnID=='toDoCards') {
            toDoCardsArray.forEach(item => {
                if (item.id === +modalWindowEdit.querySelector('.card--edit-date').id) {
                    item.title = modalWindowEdit.querySelector('.card--edit-title').value;
                    localStorage.setItem(columnID, JSON.stringify(toDoCardsArray));
                } } )
        }
        if (columnID=='inProgressCards') {
            inProgressCardsArray.forEach(item => {
                if (item.id === +modalWindowEdit.querySelector('.card--edit-date').id) {
                    item.title = modalWindowEdit.querySelector('.card--edit-title').value;
                    localStorage.setItem(columnID, JSON.stringify(inProgressCardsArray));
                } } )
        }
        if (columnID=='doneCards'){
            doneCardsArray.forEach(item => {
                if (item.id === +modalWindowEdit.querySelector('.card--edit-date').id) {
                    item.title = modalWindowEdit.querySelector('.card--edit-title').value;
                    localStorage.setItem(columnID, JSON.stringify(doneCardsArray));
                } } )
        }
        refreshBoard();
    }
    else if (event.target.className === editDesc+' saveImg') { //save new description (press saveBtn)
        modalWindowEdit.querySelector('.card--edit-desc').readOnly = true ;
        modalWindowEdit.querySelector('.card--edit-img.edit-desc').classList.remove('saveImg');
        if (columnID=='toDoCards') {
            toDoCardsArray.forEach(item => {
                if (item.id === +modalWindowEdit.querySelector('.card--edit-date').id) {
                    item.desc = modalWindowEdit.querySelector('.card--edit-desc').value;
                    localStorage.setItem(columnID, JSON.stringify(toDoCardsArray));
                } } )
        }
        if (columnID=='inProgressCards') {
            inProgressCardsArray.forEach(item => {
                if (item.id === +modalWindowEdit.querySelector('.card--edit-date').id) {
                    item.desc = modalWindowEdit.querySelector('.card--edit-desc').value;
                    localStorage.setItem(columnID, JSON.stringify(inProgressCardsArray));
                } } )
        }
        if (columnID=='doneCards'){
            doneCardsArray.forEach(item => {
                if (item.id === +modalWindowEdit.querySelector('.card--edit-date').id) {
                    item.desc = modalWindowEdit.querySelector('.card--edit-desc').value;
                    localStorage.setItem(columnID, JSON.stringify(doneCardsArray));
                } } )
        }
        refreshBoard();
    }
}} );

//#endregion
//#region Slider 

let slideIndex = 1;
if (document.documentElement.clientHeight < mobileWidthUI) {
    showSlides(slideIndex);
}

function plusSlides(n) {
  showSlides(slideIndex += n);
}

function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
    let i;
    let dots = document.getElementsByClassName("dot");
    if (n > 3) {slideIndex = 1}; // if try to slide right from slide 3 it returns 1st slide
    if (n < 1) {slideIndex = 3}; // if try to slide left from slide 1 it returns 3rd slide

    toDoBoard.style.display = "none";
    inProgressBoard.style.display = "none";
    doneBoard.style.display = "none";

    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", ""); //make all slider dots non active
    }
    if (slideIndex === 1) toDoBoard.style.display = "flex";
    if (slideIndex === 2) inProgressBoard.style.display = "flex";
    if (slideIndex === 3) doneBoard.style.display = "flex";
    calcBoardHeight();

    dots[slideIndex-1].className += " active"; //make slider dot number n -> active
}
//#endregion