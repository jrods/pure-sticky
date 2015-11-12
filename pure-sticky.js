/**
 * pure-sticky.js
 * Author: Jared Smith <jared.smith.jrod@gmail.com> 
 * Github: @jrods
 * 
 * This file is licensed under MPL v2.0. See LICENSE file for details.
 * 
 */

function pureSticky(elementQuery, position) {
	"use strict";

	var element           = document.querySelector(elementQuery);
	var elementNodeParent = element.parentNode;
	var posElement        = element.getBoundingClientRect();
	var elementHeight     = posElement.bottom - posElement.top;

	var posParent, posShim;

	var shim          = document.createElement('div');
	shim.style.height = elementHeight + 'px';

	var makeSticky = (function (set) {
		if (set) {
			elementNodeParent.insertBefore(shim, element);
			element.style.position = 'fixed';
			element.style.top      = position + 'px';
			element.style.width    = '100%';
			element.style.zIndex   = '10000';
		} else {
			elementNodeParent.removeChild(shim);
			element.removeAttribute("style");
		}
	});

	var updateElementPositions = (function () {
		posElement = element.getBoundingClientRect();
		posShim    = shim.getBoundingClientRect();
		posParent  = element.parentElement.getBoundingClientRect();
	});

	var setSticky = (function () {
		// the reason for not using an if () {} else {} when checking for fixed position
		// is the first if statement (element.style.position != 'fixed') doesn't check for correct 
		// positioning like it would when the sticky element is fixed (if that makes any sense)
		// this way will allow a check when not fixed and fixed in the same function call
		

		if (element.style.position != 'fixed') {
			updateElementPositions();
			if (posElement.top <= position) {
				makeSticky(true);
			}
		} 

		if (element.style.position == 'fixed') {
			updateElementPositions();
			if (posShim.top >= posElement.top) {
				makeSticky(false);
				return;
			}

			if (posParent.bottom >= position) {
				element.style.top    = position + 'px';
				element.style.zIndex = '10000';
			}
			
			if (posParent.bottom <= position + elementHeight) {
				// happens when the sticky element has reached its parent's 
				// bottom position, sticky element will now appear it's being carried
				var newPosition = posParent.bottom - elementHeight;

				if (posElement.bottom <= 0) {
					// stops the element from updating it's position, for optimization
					if (posParent.bottom >= posElement.top) {
						// condition happens when scrolling down and sticky element
						// will be coming into the viewport	
						element.style.top    = newPosition + 'px';
						element.style.zIndex = null;						
					}
					
					return;
				}

				element.style.top    = newPosition + 'px';
				element.style.zIndex = null;				
			}
		}
	});

	setSticky();

	window.addEventListener('scroll', setSticky, true);
};