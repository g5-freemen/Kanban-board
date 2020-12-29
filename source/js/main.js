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
    modalWindowConfirm = document.querySelector('.modal-window--confirm'),
    toDoCardsCounter = toDoBoard.querySelector('.board--card_counter'),
    inProgressCardsCounter = inProgressBoard.querySelector('.board--card_counter'),
    doneCardsCounter = doneBoard.querySelector('.board--card_counter'),
    toDoCardsDelBtn = toDoBoard.querySelector('.board--delBtn'),
    inProgressCardsDelBtn = inProgressBoard.querySelector('.board--delBtn'),
    doneCardsDelBtn = doneBoard.querySelector('.board--delBtn'),
    DelBtnTooltip = toDoBoard.querySelector('.board--delBtn-tooltip'),
    postCommentBtn = document.querySelector('.card--post-comment'),
    toDoCardsArray = [],
    inProgressCardsArray = [],
    doneCardsArray = [],
    commentsArray = [],
    maxInProgressCards = 5,
    mobileWidthUI = 1079,
    screenWidth = document.documentElement.clientWidth,
    screenHeight = document.documentElement.clientHeight,
    slider = document.getElementById('#slider');

//#region Functions

function checkWidthOverflow(place) { // check width overflow
    let item = document.querySelector(place);
    console.log(item.clientWidth);
    console.log('screen=',document.documentElement.clientWidth * 0.97);
    while (document.documentElement.clientWidth * 0.97 < item.clientWidth) {
        item.clientWidth--;
        console.log(item.clientWidth);
    }
} // end of checkWidthOverflow()

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
    clearColumn(toDoCardsArray, toDoCards, '');
    clearColumn(inProgressCardsArray, inProgressCards, '');
    clearColumn(doneCardsArray, doneCards, '');
    loadCards('toDoCards', toDoCards, 1);
    loadCards('inProgressCards', inProgressCards, 2);
    loadCards('doneCards', doneCards, 3);
    setUserNamePosition(doneCards);
    setUserNamePosition(toDoCards);
    setUserNamePosition(inProgressCards);
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
    if (number===1) toDoCardsArray.push( {title, desc, date, id:(+card.id), user} );
    if (number===2) inProgressCardsArray.push( {title, desc, date, id:(+card.id), user} );
    if (number===3) doneCardsArray.push( {title, desc, date, id:(+card.id), user} );
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
    location.reload();
};

function clearColumn(array, cardsHTML, cardsLS) { // clear column
    if (array) array.length = 0;
    if (cardsHTML) cardsHTML.innerHTML = '';
    if (cardsLS) localStorage.removeItem(cardsLS);
    showCardsCounter();
};

function showEditCard(id,title,desc,date, column, user) { // show modal window to edit card
    modalWindowEdit.style.visibility = 'visible';
    modalWindowEdit.querySelector('.card--edit-title').value = title;
    modalWindowEdit.querySelector('.card--edit-title').id = column;
    modalWindowEdit.querySelector('.card--edit-desc').innerHTML = desc;
    modalWindowEdit.querySelector('.card--edit-date').innerHTML = date;
    modalWindowEdit.querySelector('.card--edit-date').id = id;
    modalWindowEdit.querySelector('.card--edit-user').innerHTML = user;
    if (column == 'inProgressCards' || column == 'doneCards') { // no add comments btn in this columns
        document.querySelector('.card__add-comment--button').style.display = 'none';
        document.querySelector('.card--edit-img.edit-title').style.display = 'none';
        document.querySelector('.card--edit-img.edit-desc').style.display = 'none';
    } else {
        document.querySelector('.card__add-comment--button').style.display = 'flex';
        document.querySelector('.card--edit-img.edit-title').style.display = 'flex';
        document.querySelector('.card--edit-img.edit-desc').style.display = 'flex';
    }
};

let getUsers = (url) => fetch(`${url}`)     // load users list from URL
.then(response => response.json())
.then(result => {
    for(let item of result) {
        usersList.append( createCardElement('option', item.name, '', item.name )); // <option> innerHTML & value = name
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
    if (modalWindowEditContainer.clientHeight > 0.75 * document.documentElement.clientHeight) {
        modalWindowEdit.style.alignItems = 'flex-start';
    } else {modalWindowEdit.style.alignItems = 'center';}
}

//#endregion
//#region Listeners & etc.

setInterval(() => { // refresh page on screen resize
    if ( screenWidth !== document.documentElement.clientWidth 
        || screenHeight !== document.documentElement.clientHeight 
         && modalWindowEdit.style.visibility.value == 'undefined' 
         && modalWindow.style.visibility.value == 'undefined'   ) {
    screenWidth = document.documentElement.clientWidth;
    screenHeight = document.documentElement.clientHeight;
    location.reload();
         }
}, 99);

getUsers('https://jsonplaceholder.typicode.com/users');
refreshBoard();
loadComments();

function setUserNamePosition(column) { // set left margin of every userName in every card
    let cardsInColumn = column.getElementsByClassName('card--user'),
        columnWidth = column.querySelector('.card--title');
    for (let element of cardsInColumn) {
        element.style.marginLeft = (columnWidth.clientWidth - element.clientWidth)-10 + 'px';
    }
};

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
        let cardID = +card.id;
        let column;
        let cardColumn = card.closest('div').className;
        if (cardColumn == 'board__to-do--container') column='toDoCards';
        if (cardColumn == 'board__in-progress--container') column='inProgressCards';
        if (cardColumn == 'board__done--container') column='doneCards';
        let cardTitle = card.querySelector('.card--title').innerHTML;
        let cardDesc = card.querySelector('.card--desc').innerHTML;
        let cardDate = card.querySelector('.card--date').innerHTML;
        let user = card.querySelector('.card--user').innerHTML;
        showEditCard(cardID, cardTitle, cardDesc, cardDate, column, user);
        loadCommentsFromArray(cardID);
        // if (document.getElementById('#slider')) {
        //     alert('SLIDER NOT HIDDEN');
        //     document.getElementById('#slider').style.visibility = 'hidden';
        // }
        checkWindowOverflow();
    };

    if (event.target.className === 'board--delBtn') { // Clear Column btn
        if (event.target.closest('.board__to-do--container')) {
            clearColumn(toDoCardsArray, toDoCards, 'toDoCards'); // clear array, html, localstorage
        } else if (event.target.closest('.board__in-progress--container')) {
            modalWindowConfirm.style.visibility = 'visible'; // call confirmWindow to clear column
        } else if (event.target.closest('.board__done--container')) {
            clearColumn(doneCardsArray, doneCards, 'doneCards'); // clear array, html, localstorage
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
    setUserNamePosition(toDoCards);
    setUserNamePosition(doneCards);
    setUserNamePosition(inProgressCards);
} ) // end of kanbanBoard.addEventListener

createCardBtn.addEventListener('click',  () => { // click on 'Add card' calls modal window with card form
    modalWindow.style.visibility = "visible";
    checkWidthOverflow('.card-form');
} );

modalWindow.addEventListener('submit', event => {   // form submit Btn create new card & close window
    let formNewCard = document.querySelector('.card-form');
    event.preventDefault();
    let date = new Date();
    let dateTime = date.getDate() +"/"+ date.getMonth() +"/"+ date.getFullYear();
    if (+date.getMinutes() < 10 ) {dateTime += " - "+ date.getHours() +':0'+date.getMinutes()}
    else {dateTime += " - "+ date.getHours() +':'+date.getMinutes()};
    let cardTitle = formNewCard.querySelector('.card-form--title').value;
    let cardDesc = formNewCard.querySelector('.card-form--desc').value;
    let cardUser = formNewCard.querySelector('#usersList').value;
    let timerIDgen = new Date();
    let cardId = timerIDgen.getMinutes() * timerIDgen.getMilliseconds();
    toDoCards.append ( createCard(dateTime, cardTitle, cardDesc, cardId, cardUser, 1) );
    localStorage.setItem('toDoCards', JSON.stringify(toDoCardsArray));
    closeModalWindow();
    refreshBoard();
    calcBoardHeight();
} );

closeModalWindowBtn.addEventListener('click', closeModalWindow); // close modal window if click closeBtn

modalWindowEdit.addEventListener('click', event => {    
    if (!event.target.closest('.modal-window--container') || // close cardEdit modal window if click outside it
        event.target.className === 'card-form--close-btn') { // close cardEdit modal window if click closeBtn
        location.reload();
    } else { // else click inside cardEdit
    let editDesc = 'card--edit-img edit-desc',
        editTitle = 'card--edit-img edit-title',
        columnID = document.querySelector('.card--edit-title').id;

        checkWidthOverflow('.modal-window--container');

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
        updateCard('toDoCards',toDoCardsArray, 'title');
        updateCard('inProgressCards',inProgressCardsArray, 'title');
        updateCard('doneCards',doneCardsArray, 'title');
        refreshBoard();
    }
    else if (event.target.className === editDesc+' saveImg' &&
    modalWindowEdit.querySelector('.card--edit-desc').value) { //save new description (press saveBtn)
        modalWindowEdit.querySelector('.card--edit-desc').readOnly = true ;
        modalWindowEdit.querySelector('.card--edit-img.edit-desc').classList.remove('saveImg');
        updateCard('toDoCards',toDoCardsArray, 'desc')
        updateCard('inProgressCards',inProgressCardsArray, 'desc');
        updateCard('doneCards',doneCardsArray, 'desc');
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
        clearColumn(inProgressCardsArray, inProgressCards, 'inProgressCards'); //clear array, html, localstorage
        location.reload();
    } else if (event.target.id === 'notDeleteInProgressCards') {
        location.reload();
    }
})

//#endregion
//#region Slider 

let slideIndex = 1;
if (+document.documentElement.clientWidth <= +mobileWidthUI &&
    modalWindowEdit.style.visibility.value != 'visible' &&
    modalWindow.style.visibility.value != 'visible'
    ) { 
    showSlides(slideIndex);
} else { slider.style.visibility = 'hidden' }

function plusSlides(n) {
  showSlides(slideIndex += n);
}

function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
    slider.style.visibility = 'visible';
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
    setUserNamePosition(toDoCards);
    setUserNamePosition(inProgressCards);
    setUserNamePosition(doneCards);

    dots[slideIndex-1].className += " active"; //make slider dot number n -> active
}
//#endregion