/**
 * pure-sitcky.js
 * Version: 1
 * Author: Jared Smith <jared.smith.jrod@gmail.com> 
 * Github: @jrods
 * Home: https://gihtub.com/jrods/pure-sticky
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. 
 */
function PureSticky(autoStart) { //fuck you chrome not having default params in func args
    // TODO: check browser compatibility
    
    var allElements = new Array();

    /* Private
     *****************************/
    var elementID = function(element) {
	if( !(element instanceof HTMLElement) )
	    return undefined;
	
	var tag       = element.localName.toString();
	var id        = (element.id ? "#" + element.id.toString() : "");
	var className = (element.className ? "." + element.className.replace(/ /g, ".").toString() : "");
	
	return tag + id + className;
    };

    var makeSticky = function(sticky) {
	sticky.e.parentNode.insertBefore(sticky.shim, sticky.e);
	sticky.e.style.position = 'fixed';
	sticky.e.style.top      = sticky.position + 'px';
	sticky.e.style.width    = '100%';
	sticky.e.style.zIndex   = '10000';
    };

    var makeUnSticky = function(sticky) {
	sticky.e.parentNode.removeChild(sticky.shim);
	sticky.e.removeAttribute("style");
    };
    
    var makeShim = function(height) {
	var shim = document.createElement('div');
	shim.style.height = height + 'px';
	
	return shim;
    };

    /* Public
     *****************************/    
    this.startSticky = function() {
	window.addEventListener('scroll', this.setSticky, false);
    };
    
    this.stopSticky = function() {
	window.removeEventListener('scroll', this.setSticky, false);
    };

    this.getAllElements = function() {
	return allElements;
    };
    
    this.add = function(elementQuery, position) {
	var getElement = document.querySelector(elementQuery);
	var getElementPos = getElement.getBoundingClientRect();
	var sticky = {
	    id: elementID(getElement),
	    e: getElement,
	    position: position,
	    shim: makeShim(getElementPos.height)
	};
	
	if (!sticky.id)
	    return false;
	
	allElements.push(sticky);
	return true;
    };

    this.remove = function(elementQuery) {
	
    };

    this.setSticky = function() {
	var posElement, posParent, posShim;
	
	var updateElementPositions = function(sticky) {
	    posElement = sticky.e.getBoundingClientRect();
	    posParent = sticky.e.parentElement.getBoundingClientRect();
	    posShim = sticky.shim.getBoundingClientRect();
	};
	
	allElements.map(function(sticky) {

	    if (sticky.e.style.position != 'fixed') {
		updateElementPositions(sticky);
		if (posElement.top <= sticky.position) {
		    makeSticky(sticky);
		}
	    } 
	    if (sticky.e.style.position == 'fixed') {
		updateElementPositions(sticky);
		if (posShim.top >= posElement.top) {
		    makeUnSticky(sticky);
		    return;
		}
		if (posParent.bottom >= sticky.position) {
		    sticky.e.style.top    = sticky.position + 'px';
		    sticky.e.style.zIndex = '10000';
		}	   
		if (posParent.bottom <= sticky.position + posElement.height) {
		    var newPosition = posParent.bottom - posElement.height;
		    if (posElement.bottom <= 0) {
			if (posParent.bottom >= posElement.top) {
			    sticky.e.style.top    = newPosition + 'px';
			    sticky.e.style.zIndex = null;
			}
			
			return;
		    }
		    sticky.e.style.top    = newPosition + 'px';
		    sticky.e.style.zIndex = null;				
		}
	    }
	});
	
	    
    };

    /* Main
     *****************************/
    // Why? Because i needed to define the methods above
    //      first so i could then use them
    if(autoStart)
	this.startSticky();
}
