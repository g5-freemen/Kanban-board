let kanbanBoard = document.querySelector('.board'),
    toDoBoard = document.querySelector('.board__to-do--container'),
    toDoCards = toDoBoard.querySelector('.board__cards'),
    inProgressBoard = document.querySelector('.board__in-progress--container'),
    inProgressCards = inProgressBoard.querySelector('.board__cards'),
    doneBoard = document.querySelector('.board__done--container'),
    doneCards = doneBoard.querySelector('.board__cards'),
    createCardBtn = document.querySelector('.board__add-card-btn'),
    modalWindow = document.querySelector('.modal-window'),
    modalWindowEdit = document.querySelector('.modal-window--edit'),
    closeModalWindowBtn = document.querySelector('.card-form--close-btn'),
    formNewCard = document.querySelector('.card-form'),
    toDoCardsCounter = toDoBoard.querySelector('.board--card_counter'),
    inProgressCardsCounter = inProgressBoard.querySelector('.board--card_counter'),
    doneCardsCounter = doneBoard.querySelector('.board--card_counter'),
    toDoCardsDelBtn = toDoBoard.querySelector('.board--delBtn'),
    inProgressCardsDelBtn = inProgressBoard.querySelector('.board--delBtn'),
    doneCardsDelBtn = doneBoard.querySelector('.board--delBtn'),
    DelBtnTooltip = toDoBoard.querySelector('.board--delBtn-tooltip'),
    toDoCardsArray = [],
    inProgressCardsArray = [],
    doneCardsArray = [];

//#region Functions

function loadCards(cardsName, toPlace, number) {
    if (localStorage[cardsName]) {
        let cardsList = JSON.parse( localStorage[cardsName] );
        for (let item of cardsList) {
            toPlace.append( createCard(item.date, item.title, item.desc, item.id, number) );
    } }
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
    if (number==1) toDoCardsArray.push( {title, desc, date, id:(+card.id)} );
    if (number==2) inProgressCardsArray.push( {title, desc, date, id:(+card.id)} );
    if (number==3) doneCardsArray.push( {title, desc, date, id:(+card.id)} );
    showCardsCounter();
    return card;
};

function createCardElement(tag, text, name) {
    let element = document.createElement(tag);
    element.className = 'card--' + name;
    if (text) element.append(text);
    return element;
};

function deleteCard(cardClassName, nameInLS, array, moveTo) {
    let card = event.target.closest(cardClassName);
    for (let i = 0; i < array.length; i++) {
        if (array[i].id === +card.id) {
            if (moveTo) {moveTo.push( array[i] )};
            array.splice(i, 1);
        }
    }
    card.remove();
    localStorage.setItem(nameInLS, JSON.stringify(array));
    showCardsCounter();
};

function showCardCounter(array, counter, delBtn) {
    if (array.length) {
        counter.innerHTML = array.length;
        counter.style.visibility = 'visible';
        delBtn.style.visibility = 'visible';
    } else {
        delBtn.style.visibility = 'hidden';
        counter.style.visibility = 'hidden';
    }
};

function showCardsCounter() {
    showCardCounter(toDoCardsArray, toDoCardsCounter, toDoCardsDelBtn);
    showCardCounter(inProgressCardsArray, inProgressCardsCounter, inProgressCardsDelBtn);
    showCardCounter(doneCardsArray, doneCardsCounter, doneCardsDelBtn);
};

function closeModalWindow() {
    formNewCard.reset();
    modalWindow.style.visibility = 'hidden';
};

function clearColumn(array, cardsHTML, cardsLS) {
    array.length = 0;
    cardsHTML.innerHTML = '';
    localStorage.removeItem(cardsLS);
    showCardsCounter();
}

//#endregion
//#region Listeners & etc.

loadCards('toDoCards', toDoCards, 1);
loadCards('inProgressCards', inProgressCards, 2);
loadCards('doneCards', doneCards, 3);

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

kanbanBoard.addEventListener('click', event => {
    if( event.target.className === 'card--title' || event.target.className === 'card--desc' // edit card
        || event.target.className === 'card--bottom' || event.target.className === 'card--date') {
        let card = event.target.closest('.card');
        let cardTitle = card.querySelector('.card--title').innerHTML;
        let cardDesc = card.querySelector('.card--desc').innerHTML;

        let editTitle = modalWindowEdit.querySelector('.card-form--title');
        editTitle.value = cardTitle;
        let editDesc = modalWindowEdit.querySelector('.card-form--desc');
        editDesc.value = cardDesc;
        modalWindowEdit.style.visibility = 'visible';
    };

    if (event.target.className === 'board--delBtn') { // Clear Column btn
        if (event.target.closest('.board__to-do--container')) {
            clearColumn(toDoCardsArray, toDoCards, 'toDoCards');
        }
        if (event.target.closest('.board__in-progress--container')) {
            if (confirm('Delete all Cards?')) {
                clearColumn(inProgressCardsArray, inProgressCards, 'inProgressCards');
            }
        }
        if (event.target.closest('.board__done--container')) {
            clearColumn(doneCardsArray, doneCards, 'doneCards');
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
            if (inProgressCardsArray.length >= 7) {
            alert(`You can't have more than 7 tasks in 'In Progress' column.\nPlease delete one or more tasks.`)
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


} ) // end of kanbanBoard.addEventListener

createCardBtn.addEventListener('click',  () => {
    modalWindow.style.visibility = "visible";
} );

formNewCard.addEventListener('submit', event => {
    event.preventDefault();
    let date = new Date();
    let DateTime = date.getDate() +"/"+ date.getMonth() +"/"+ date.getFullYear();
    if (+date.getMinutes() < 10 ) {DateTime += " - "+ date.getHours() +':0'+date.getMinutes()}
    else {DateTime += " - "+ date.getHours() +':'+date.getMinutes()};
    toDoCardTitle = formNewCard.querySelector('.card-form--title').value;
    toDoCardDesc = formNewCard.querySelector('.card-form--desc').value;
    let timerIDgen = new Date();
    let cardId = timerIDgen.getMinutes() * timerIDgen.getMilliseconds();
    toDoCards.append ( createCard(DateTime, toDoCardTitle, toDoCardDesc, cardId, 1) );
    localStorage.setItem('toDoCards', JSON.stringify(toDoCardsArray));
    closeModalWindow();
} );

closeModalWindowBtn.addEventListener('click', closeModalWindow);

//#endregion