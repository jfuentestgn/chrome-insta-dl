(function() {
	
	const extensionName = 'Instagram Image Downloader';
	const extensionPfx = 'insta-img-dl';

	let childrenInFullPage = 0;
	
	
	init();
	
	function init() {
        hkLog(`Loading '${extensionName}' extension`);		
		if (window.location.pathname.startsWith('/p/')) {
			parseImagePage();
		} else {
			parseFullPage();
		}
    }
	
	// =====================================================

	// -- Private functions --
	
	function hkLog(str, o) {
		let msg = `[${extensionPfx}] ${str}`;
        if (o) {
            console.log(msg, o);
        } else {
            console.log(msg);
        }
    }


	function waitForElementExistence(selector, callback) {
		let intervalID = null;
		let iters = 0;
		const intervalFunction = function() {
			let elem = document.querySelector(selector);
			if (elem === null) {
				iters++;
				if (iters > 10) {
					clearInterval(intervalID);
					hkLog('Reached max iterations. Cancelling');
				}
			} else {
				clearInterval(intervalID);
				callback(elem);
			}
		};
		intervalID = window.setInterval(intervalFunction, 1000);
	}

	// =====================================================


	function parseImagePage() {
		waitForElementExistence('article', function(elem) {
			let imgElem = document.querySelector('article div._aagv img');
			if (imgElem === null) {
				return;
			}
			let imgUrl = imgElem.src;
			hkLog('Image URL = ' + imgUrl);

			const dlDiv = document.createElement('div');
			dlDiv.innerHTML = `<a href="${imgUrl}" target="_blank">Download image</a>`;
			elem.append(dlDiv);
		});
	}

	function parseFullPage() {
		waitForElementExistence('article', function(elem) {
			let imgElems = document.querySelectorAll('article div._aagv img');
			if (!imgElems.length) {
				return;
			}
			loadFullPage();
		});

	}


	function loadFullPage() {
		let currentChildren = getChildrenInFullPage();
		if (childrenInFullPage !== currentChildren) {
			childrenInFullPage = currentChildren;

			// Buscamos las imágenes a las que no se les ha aplicado el link de descarga
			let imgElems = document.querySelectorAll('article div._aagv img:not(.insta-dl-link)');
			imgElems.forEach((imgElem) => {
				let imgUrl = imgElem.src;
				imgElem.className = imgElem.className + ' insta-dl-link';

				const dlDiv = document.createElement('div');
				dlDiv.innerHTML = `<a href="${imgUrl}" target="_blank">Download image</a>`;

				imgElem.parentElement.parentElement.parentElement.parentElement.append(dlDiv);
			});
		}
		setTimeout(loadFullPage, 3000);
	}

	function getChildrenInFullPage() {
		const div = document.querySelector('article > div > div');
		return div.children.length;
	}

	// =====================================================




















	
	function addClassNameListener(elem, callback) {
		var lastClassName = elem.className;
	
		var intervalID = null;
		var iters = 0;
		var intervalFunction = function() {
			hkLog('Checking class name change');
			var className = elem.className;
			if (className !== lastClassName) {
				callback();   
				clearInterval(intervalID);
			} else {
				iters++;
				if (iters > 10) {
					clearInterval(intervalID);
					hkLog('Reached max iterations. Cancelling');
				}
			}
		};
		intervalID = window.setInterval(intervalFunction, 1000);
	}
	
	function addClassExistsListener(elem, className, callback) {
		var intervalID = null;
		var iters = 0;
		var intervalFunction = function() {
			hkLog('Checking class name: ' + className);
			var elemClasses = elem.classList;
			if (elemClasses.contains(className)) {
				callback();   
				clearInterval(intervalID);
			} else {
				iters++;
				if (iters > 10) {
					clearInterval(intervalID);
					hkLog('Reached max iterations. Cancelling');
				}
			}
		};
		intervalID = window.setInterval(intervalFunction, 1000);
	}
	
	
	function tagHackedElement(elem) {
		if (elem !== null) {
			elem.style.backgroundColor = '#FFF1F1';
			elem.style.border = '1px solid #FC4B4B';
		}
		
		document.title = '[HK] ' + document.title;
	}
	
	// =====================================================
	
	
	// El Periodico
	// -----------------------------------------------------
	
	function hkEP() {
		hkLog('Running hkEP');
		var closedElems = document.getElementsByClassName('closedseo');
		if (closedElems.length === 0) {
			hkLog('Closed content not found');
			return;
		}
		var sentinel = closedElems.item(0);
		addClassExistsListener(sentinel, 'closed', function() {
			hkLog('Opening content');
			sentinel.classList.remove('closed');
			tagHackedElement(sentinel);
			hkLog('End');
		});
	}
	
	// El Confidencial
	// -----------------------------------------------------
	
	function hkEC() {
		hkLog('Running hkEC');
		var body = document.body;
		addClassNameListener(body, function() {
			hkLog('Opening content');
			body.classList.remove('tp-modal-open');
			
			var tpModals = document.getElementsByClassName('tp-modal');
			for (let tpModal of tpModals) {
				tpModal.remove();
			}
			
			var tpBackdrops = document.getElementsByClassName('tp-backdrop');
			for (let tpBackdrop of tpBackdrops) {
				tpBackdrop.remove();
			}
			
			var container = document.getElementById('container');
			tagHackedElement(container);
			
			hkLog('End');
		});
	}
	
	// La Vanguardia 
	// -----------------------------------------------------
	
	function hkLV() {
		hkLog('Running hkLV');
		var body = document.body;
		addClassNameListener(body, function() {
			hkLog('Opening content');
			body.classList.remove('modal-open');
			
			var modals = document.getElementsByClassName('ev-open-modal-paywall-REQUIRE_LOGIN');
			for (let modal of modals) {
				modal.remove();
			}
			
			var mains = document.getElementsByClassName('main__structure');
			if (mains.length > 0) {
				tagHackedElement(mains.item(0));
			} else {
				tagHackedElement(null);
			}
			
			
			hkLog('End');
		});
	}
	

})();