import { UpdateZones } from './увеличение карточек во время игры.js';
import { UpdatebackImgTreasure, timer } from './game.js';
import { UpdatebackImgDoor } from './game.js';
import socket from './socket/index.js';
//import {socket} from './game.js';
// console.log("card работает");
window.allCards = null;
let currentDrag;

function dragstart_handler(e) {
  currentDrag = e.target.closest('.card');
	//console.log('старт сработал');
	const zone = e.target.closest('.cards-zone');
	// console.log(zone);
	if (zone.classList.contains('zone2')) {
    // Получаем значение power из currentDrag
    	const CardID = currentDrag.id;
		const foundCard = window.treasures.find(card => card.name === CardID);
    	// Если карта найдена, записываем значение power в переменную
		if (foundCard){
			let power = foundCard.power;
			if (power>0) {
				// Находим элемент с классом .MyPower
				const MyPower = document.getElementById('MyPower');
	
				let currentValue = parseFloat(MyPower.textContent);
	
				// Прибавляем power к текущему значению
				let newValue = currentValue - power;
	
				// Обновляем текст элемента новым значением
				MyPower.textContent = newValue;
	
				const messageUpdateData = {
					method: "UpdatePower",
					power: newValue
				};
				socket.emit("message",messageUpdateData);
			}
		}
  	}

	if (zone.classList.contains('zone3')) {
	// Получаем значение power из currentDrag
		const CardID = currentDrag.id;
		const foundCard = window.treasures.find(card => card.name === CardID);
		// Если карта найдена, записываем значение power в переменную
		if (foundCard){
			let power = foundCard.power;
			if (power>0) {
				// Находим элемент с классом .MyBonus
				const MyBonus = document.getElementById('MyBonus');
	
				let currentValue = parseFloat(MyBonus.textContent);
	
				// Прибавляем power к текущему значению
				let newValue = currentValue - power;
	
				// Обновляем текст элемента новым значением
				MyBonus.textContent = newValue;
	
				const messageUpdateData = {
					method: "UpdateBonus",
					power: newValue
				};
				socket.emit("message",messageUpdateData);
			}
		}

	}
	if (zone.classList.contains('zone_monster')) {
	// Получаем значение power из currentDrag
		const CardID = currentDrag.id;

		let foundCard = window.doors.find(card => card.name === CardID);
		if (foundCard == null){
			foundCard = window.treasures.find(card => card.name === CardID);
		};
		// Если карта найдена, записываем значение power в переменную
		let power = foundCard.power;
		if (power>0) {
			// Находим элемент с классом .MyBonus
			const MonsterBonus = document.getElementById('MonsterBonus');

			let currentValue = parseFloat(MonsterBonus.textContent);

			// Прибавляем power к текущему значению
			let newValue = currentValue - power;

			// Обновляем текст элемента новым значением
			MonsterBonus.textContent = newValue;

			const messageUpdateData = {
				method: "UpdateMonster",
				power: newValue
			};
			socket.emit("message",messageUpdateData);
		}
	}
  
}
function dragover_handler(e) {
	e.preventDefault();
	e.dataTransfer.dropEffect = 'move';
  
	const target = e.target.closest('.card');
	const zone = e.target.closest('.cards-zone');
  
	// If dragging to a different card within the same zone
	if (target && target !== currentDrag && target.parentElement === currentDrag.parentElement) {
	  currentDrag.parentElement.insertBefore(currentDrag, target.nextSibling);
	} 
	// If dragging to a different zone or directly to a zone
	else if (zone) {
	  currentDrag.remove(); // Remove from current parent
	  zone.appendChild(currentDrag); 
	}
	UpdateZones();
  }
   
  

function drop_handler(e) {
  e.preventDefault();
  const target = e.target.closest('.card');
  const zone = e.target.closest('.cards-zone');
  if (currentDrag && target && target.nextSibling && zone.contains(target.nextSibling)) {
    zone.insertBefore(currentDrag, target.nextSibling);
  } else if (currentDrag) {
    zone.appendChild(currentDrag);
		
  }

		
  if (zone.classList.contains('zone2') && currentDrag) {
    // Получаем значение power из currentDrag
    const CardID = currentDrag.id;
	const foundCard = window.treasures.find(card => card.name === CardID);
    // Если карта найдена, записываем значение power в переменную
	if(foundCard){
		let power = foundCard.power;
		if (power>0) {
			// Находим элемент с классом .MyPower
			const MyPower = document.getElementById('MyPower');
			let currentValue = parseInt(MyPower.textContent);
			// Прибавляем power к текущему значению
			let newValue = currentValue + power;
	
			// Обновляем текст элемента новым значением
			MyPower.textContent = newValue;
	
			const messageUpdateData = {
				method: "UpdatePower",
				power: newValue
			};
			socket.emit("message",messageUpdateData);
		}
	}
  }



  if (zone.classList.contains('zone3') && currentDrag) {
  // Получаем значение power из currentDrag
    const CardID = currentDrag.id;
  	const foundCard = window.treasures.find(card => card.name === CardID);
 	 // Если карта найдена, записываем значение power в переменную
	if (foundCard){
		let power = foundCard.power;
		if (power>0) {
			// Находим элемент с классом .MyPower
			const MyBonus = document.getElementById('MyBonus');
			let currentValue = parseInt(MyBonus.textContent);
			// Прибавляем power к текущему значению
			let newValue = currentValue + power;
	
			// Обновляем текст элемента новым значением
			MyBonus.textContent = newValue;
	
			const messageUpdateData = {
				method: "UpdateBonus",
				power: newValue
			};
			socket.emit("message",messageUpdateData);
		}
	}
  }


  if (zone.classList.contains('zone3') && currentDrag) {
	// const timerElement = document.getElementById('timer');
	// timerElement.textContent = ""
	timer();
	const messageUpdateData = {
		method: "UpdateTimer",
	};
	socket.emit("message",messageUpdateData);
  }
  if (zone.classList.contains('zone_monster') && currentDrag) {
		// const timerElement = document.getElementById('timer');
		// timerElement.textContent = ""
		timer();
		const messageUpdateData = {
			method: "UpdateTimer",
		};
		socket.emit("message",messageUpdateData);

		const CardID = currentDrag.id;

		let foundCard = window.doors.find(card => card.name === CardID);
		if (foundCard == null){
			foundCard = window.treasures.find(card => card.name === CardID);
		};

		// Если карта найдена, записываем значение power в переменную
		let power = foundCard.power;
		if (power>0) {
		  // Находим элемент с классом .MyPower
		  const MonsterBonus = document.getElementById('MonsterBonus');
		  let currentValue = parseInt(MonsterBonus.textContent);
		  // Прибавляем power к текущему значению
		  let newValue = currentValue + power;
  
		  // Обновляем текст элемента новым значением
		  MonsterBonus.textContent = newValue;
		//   console.log('бонус отправлен')
		  const messageUpdateData = {
			  method: "UpdateMonster",
			  power: newValue
		  };
		  socket.emit("message",messageUpdateData);
	    }
		
  }
  adjustCardWidth('.myhand');
  adjustCardWidth('.zone2');
  adjustCardHeight('.zone3');
  adjustCardHeight('.zone_monster');
  adjustCardWidth('.zone5');
  adjustCardWidth('.opponenthand');
  adjustCardWidth('.zone_opponent');
  adjustCardWidth('.zone_opponent_side');
  adjustCardWidth('.opponent2hand');
  adjustCardWidth('.zone_opponent2');
  adjustCardWidth('.zone_opponent2_side');
  adjustCardWidth('.opponent3hand');
  adjustCardWidth('.zone_opponent3');
  adjustCardWidth('.zone_opponent3_side');
  UpdatebackImgTreasure();
  UpdatebackImgDoor();

  const moveData = {
    method: "moveCard",
    cardId: currentDrag.id,
    targetId: target ? target.id : null,
    zoneId: zone.id
  };
  socket.emit("message",moveData);
}

function checkAllCards() {
  if (window.allCards != null) {
		//console.log(window.allCards)
    window.allCards.forEach(item => {
      item.addEventListener('dragstart', dragstart_handler);
      item.addEventListener('dragover', dragover_handler);
      item.addEventListener('drop', drop_handler);
    });


  } else {
    setTimeout(checkAllCards, 100);
  }
}
if (window.allCards == null){
	setTimeout(checkAllCards, 100);
}


document.addEventListener('DOMContentLoaded', function() {
  function initialize() {
    const myhand = document.querySelector('.myhand');
		const zone2 = document.querySelector('.zone2');
		const opponenthand = document.querySelector('.opponenthand');
		const zone_opponent = document.querySelector('.zone_opponent');
		const zone_opponent_side = document.querySelector('.zone_opponent_side');
		const opponent2hand = document.querySelector('.opponent2hand');
		const zone_opponent2 = document.querySelector('.zone_opponent2');
		const zone_opponent2_side = document.querySelector('.zone_opponent2_side');
		const opponent3hand = document.querySelector('.opponent3hand');
		const zone_opponent3 = document.querySelector('.zone_opponent3');
		const zone_opponent3_side = document.querySelector('.zone_opponent3_side');
		const zone3 = document.querySelector('.zone3');
		const zone_monster = document.querySelector('.zone_monster');
		const zone5 = document.querySelector('.zone5');
		const zone_doors_drop = document.querySelector('.zone_doors_drop');
		const zone_treasure_drop = document.querySelector('.zone_treasure_drop');
		const zone_treasure = document.querySelector('.zone_treasure');
		const zone_doors = document.querySelector('.zone_doors');

		//надо будет убрать 
		// window.allCards = document.querySelectorAll('.card');
		// checkAllCards();
    if (myhand) { // Проверка наличия элемента
			//console.log(window.allCards);
      myhand.addEventListener('dragover', dragover_handler);
	  zone2.addEventListener('dragover', dragover_handler);
	  opponenthand.addEventListener('dragover', dragover_handler);
	  zone_opponent.addEventListener('dragover', dragover_handler);
	  zone_opponent_side.addEventListener('dragover', dragover_handler);
	  opponent2hand.addEventListener('dragover', dragover_handler);
	  zone_opponent2.addEventListener('dragover', dragover_handler);
	  zone_opponent2_side.addEventListener('dragover', dragover_handler);
	  opponent3hand.addEventListener('dragover', dragover_handler);
	  zone_opponent3.addEventListener('dragover', dragover_handler);
	  zone_opponent3_side.addEventListener('dragover', dragover_handler);
	  zone3.addEventListener('dragover', dragover_handler);
	  zone_monster.addEventListener('dragover', dragover_handler);
	  zone5.addEventListener('dragover', dragover_handler);
	  zone_doors_drop.addEventListener('dragover', dragover_handler);
	  zone_treasure_drop.addEventListener('dragover', dragover_handler);
	  zone_treasure.addEventListener('dragover', dragover_handler);
	  zone_doors.addEventListener('dragover', dragover_handler);
	} 
	else {
      setTimeout(initialize, 1000); 
    }
  }
  // Вызов функциb инициализации сразу после загрузки DOM
  initialize();
});

let prevWidth = {};
let prevcardsCount = {};

let prevHeight = {};
let prevcardsCount2 = {};

export function adjustCardHeight(zoneSelector) {
	let cards = document.querySelectorAll(zoneSelector + ' .card');
	let totalHeight = 0;
	cards.forEach(function(card) {
		totalHeight += card.offsetHeight;
	});
	if (!prevcardsCount2[zoneSelector]) {
		prevcardsCount2[zoneSelector] = 0;
	}
	let cardsCount = cards.length;
	if (!prevHeight[zoneSelector]) {
		prevHeight[zoneSelector] = 0;
	}
	let newHeight = 80 / cardsCount; 

	if (cardsCount < 4) {
		cards.forEach(function(card) {
			card.style.height = '20px';
		});
	}
	else if (cardsCount < prevcardsCount2[zoneSelector]) {
		cards.forEach(function(card) {
			card.style.height = prevHeight[zoneSelector] + 'px';
		});
	}
	else if ((totalHeight > 80) && (cardsCount >= 4)) {

		cards.forEach(function(card) {
			card.style.height = newHeight + 'px';	
		});
		
	}
	prevcardsCount2[zoneSelector] = cardsCount;
	prevHeight[zoneSelector] = newHeight;
}

export function adjustCardWidth(zoneSelector) {
	let cards = document.querySelectorAll(zoneSelector + ' .card');
	let totalWidth = 0;
	cards.forEach(function(card) {
		totalWidth += card.offsetWidth;
	});

	if (!prevcardsCount[zoneSelector]) {
		prevcardsCount[zoneSelector] = 0;
	}
	let cardsCount = cards.length;

	if (!prevWidth[zoneSelector]) {
		prevWidth[zoneSelector] = 0;
	}
	let newWidth = 210 / cardsCount; 

	if (cardsCount <= 3) {
		cards.forEach(function(card) {
			card.style.width = '70px';
		});
	}
	else if (cardsCount < prevcardsCount[zoneSelector]) {
		cards.forEach(function(card) {
			card.style.width = prevWidth[zoneSelector] + 'px';
		});
	}
	else if ((totalWidth > 210) && (cardsCount > 3)) {
		cards.forEach(function(card) {
			card.style.width = newWidth + 'px';
	
		});
	}
	prevcardsCount[zoneSelector] = cardsCount;
	prevWidth[zoneSelector] = newWidth;
}