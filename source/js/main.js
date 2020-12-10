let toDoBoard = document.querySelector('.board__to-do--container'),
    toDoCards = document.querySelector('.board__cards'),
    createCardBtn = document.querySelector('.board__add-card-btn'),
    modalWindow = document.querySelector('.modal-window'),
    closeModalWindowBtn = document.querySelector('.card-form--close-btn'),
    formNewCard = document.querySelector('.card-form'),
    toDoCardsCounter = document.querySelector('.board__card_counter'),
    toDoCardsDelBtnTooltip = document.querySelector('.board__card_counter--tooltip'),
    toDoCardsDelBtn = document.querySelector('.board__to-do--delBtn'),
    toDoCardsArray = [];

// functions ////////////////////////////////////////////////////

function loadCards(cardsName) {
    if (localStorage[cardsName]) {
        let toDoCardsList = JSON.parse( localStorage[cardsName] );
        for (let item of toDoCardsList) {
            toDoCards.append( createCard(item.date, item.title, item.desc, item.id) );
    } }
};

function createCard(date, title, desc, idCard) {
    let card = document.createElement('li');
    card.className = "to-do-card";
    card.id = +idCard;
    card.append(createCardElement('span', title, 'title'));
    card.append(createCardElement('div', desc, 'desc'));
    let bottomBlock = document.createElement('div');
    bottomBlock.className = "to-do-card--bottom";
    bottomBlock.append(createCardElement('span', date, 'date'));
    bottomBlock.append(createCardElement('button', '', 'move-btn'));
    bottomBlock.append(createCardElement('button', '', 'delete-btn'));
    card.append(bottomBlock);
    toDoCardsArray.push( {title, desc, date, id:(+card.id)} );
    showToDoCardsCounter();
    return card;
};

function createCardElement(tag, text, name) {
    let element = document.createElement(tag);
    element.className = 'to-do-card--' + name;
    if (text) element.append(text);
    return element;
};

function showToDoCardsCounter() {
    if (toDoCardsArray.length) {
        toDoCardsCounter.innerHTML = toDoCardsArray.length;
        toDoCardsCounter.style.visibility = 'visible';
        toDoCardsDelBtn.style.visibility = 'visible';
    } else {
        toDoCardsDelBtn.style.visibility = 'hidden';
        toDoCardsCounter.style.visibility = 'hidden';
    }
    toDoCardsDelBtnTooltip.style.visibility = 'hidden';
};

function closeModalWindow() {
    formNewCard.reset();
    modalWindow.style.visibility = 'hidden';
};

// listeners ////////////////////////////////////////////////////

loadCards('toDoCards');

toDoCardsDelBtn.addEventListener('mouseover', event => {
    toDoCardsDelBtnTooltip.style.left = 0.82*event.clientX +'px';
    toDoCardsDelBtnTooltip.style.top = 1.06*event.clientY +'px';
    toDoCardsDelBtnTooltip.style.visibility = 'visible';
} );

toDoCardsDelBtn.addEventListener('mouseout', () => {
    toDoCardsDelBtnTooltip.style.visibility = 'hidden';
} );

toDoCardsDelBtn.addEventListener('click', () => {
    // if (confirm('Delete all ToDo Cards?')) {
        toDoCardsArray = [];
        toDoCards.innerHTML = '';
        localStorage.removeItem('toDoCards');
        showToDoCardsCounter();
    // }
} );

createCardBtn.addEventListener('click',  () => {
    modalWindow.style.visibility = "visible";
} );

formNewCard.addEventListener('submit', event => {
    event.preventDefault();
    let date = new Date();
    let DateTime = date.getDate() +"/"+ date.getMonth() +"/"+ date.getFullYear();
    // if (+date.getMinutes() < 10 ) {DateTime += " "+ date.getHours() +':0'+date.getMinutes()}
    // else {DateTime += " "+ date.getHours() +':'+date.getMinutes()};
    toDoCardTitle = formNewCard.querySelector('.card-form--title').value;
    toDoCardDesc = formNewCard.querySelector('.card-form--desc').value;
    let timerIDgen = new Date();
    let cardId = timerIDgen.getMinutes() * timerIDgen.getMilliseconds();
    toDoCards.append ( createCard(DateTime, toDoCardTitle, toDoCardDesc, cardId) );
    localStorage.setItem('toDoCards', JSON.stringify(toDoCardsArray));
    closeModalWindow();
} );

closeModalWindowBtn.addEventListener('click', closeModalWindow);

toDoCards.addEventListener ('click', event => {
    if(event.target.className === 'to-do-card--delete-btn' ) {
        let card = event.target.closest('.to-do-card');
        for (let i = 0; i <  toDoCardsArray.length; i++) {
            if (toDoCardsArray[i].id === +card.id) {
                toDoCardsArray.splice(i, 1);
            }
        }
        card.remove();
        localStorage.setItem('toDoCards', JSON.stringify(toDoCardsArray));
        showToDoCardsCounter();
    }
})