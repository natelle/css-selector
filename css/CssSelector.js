//=============================================================================
// Copyright (c), 1999-2018, Bertin IT. - All Rights Reserved.
// This source code is the property of Bertin IT. Its content may not be
// disclosed to third parties, copied, used or duplicated in any form, in whole
// or in part, without the prior written consent of Bertin IT.
//=============================================================================

if (typeof ARRAY_JS === 'undefined')
	load('inc/sources/array.js');
if (typeof STRING_JS === 'undefined')
	load('inc/sources/string.js');

/**
 * Represents a CSS selector
 * 
 * @constructor
 * 
 * @param {String} selector - the CSS sub selector
 * @param {String} [combinator=null] - the combinator related to the sub selector
 * 
 */
function CssSelector(selector, combinator) {
	this.id = null;
	this.classes = [];
	this.attr = null;
	this.tag = null;
	this.pClass = null;
	this.pElement = null;
	this.all = null;
	this.combinator = (typeof combinator !== "undefined") ? combinator : null;

	var match;

	if (selector.match(/\*/)) {
		this.all = true;
	}

	if ((match = selector.match(/#([a-z0-9_\-]+)/i))) {
		this.id = match[1];
		selector = selector.replace(/#([a-z0-9_\-]+)/i, '');
	}

	var classReg = /\.([a-z0-9_\-]+)/gi, cl;

	while ((cl = classReg.exec(selector))) {
		this.classes.push(cl[1]);
	}

	selector = selector.replace(/\.([a-z0-9_\-]+)/ig, '');

	if ((match = selector.match(/\[(.+?)\]/))) {
		this.attr = match[1];
		selector = selector.replace(/\[(.+?)\]/, '');
	}

	if ((match = selector.match(/::([a-z0-9_\-]+)/i))) {
		this.pElement = match[1];
		selector = selector.replace(/::([a-z0-9_\-]+)/i, '');
	}

	if ((match = selector.match(/:([a-z0-9_\-]+(?:\(.+?\))?)/i))) {
		this.pClass = match[1];
		selector = selector.replace(/:([a-z0-9_\-]+(?:\(.+?\))?)/i, '');
	}

	if ((match = selector.match(/\w+/))) {
		this.tag = match[0];
		selector = selector.replace(/\w+/);
	}
}

/**
 * Split a global CSS selector
 * 
 * @param {String} mainSelector - the main CSS selector containing combinators
 * 
 * @returns {CssSelector[]} the different sub-selectors containing the combinators
 * 
 */
CssSelector.split = function (mainSelector) {
	var inAttrSelector = false, splitPositions = [];
	var tempSelectors = [], tempCombinators = [];

	if(!mainSelector || mainSelector.match(/^\s*$/)) {
		return null;
	}

	var selectors = [], combinators = [];

	for (var i = 0; i < mainSelector.length; i++) {
		if (mainSelector.charAt(i) == '[' || mainSelector.charAt(i) == '(') {
			inAttrSelector = true;
		}
		if (mainSelector.charAt(i) == ']' || mainSelector.charAt(i) == ')') {
			inAttrSelector = false;
		}

		if (!inAttrSelector && mainSelector.charAt(i).match(/[\,\>\+\~]/)) {
			splitPositions.push(i);
		}
	}

	var begin = 0;
	if (splitPositions.length > 0) {
		for (var i in splitPositions) {
			begin = i == 0 ? 0 : splitPositions[i - 1] + 1;

			tempSelectors.push(mainSelector.substring(begin, splitPositions[i]));
			tempCombinators.push(mainSelector.substr(splitPositions[i], 1));
		}

		begin = splitPositions[splitPositions.length - 1] + 1;
	}

	tempSelectors.push(mainSelector.substring(begin));
	tempSelectors = ArrayUtil.transform(tempSelectors, function (item) {
		return StringUtil.trim(item);
	});

	// Split the unspaced selectors
	for (var i in tempSelectors) {
		var inAttrSelector = false;
		splitPositions = [];

		for (var j = 0; j < mainSelector.length; j++) {
			if (mainSelector.charAt(j) == '[' || mainSelector.charAt(j) == '(') {
				inAttrSelector = true;
			}
			if (mainSelector.charAt(j) == ']' || mainSelector.charAt(j) == ')') {
				inAttrSelector = false;
			}

			if (!inAttrSelector && tempSelectors[i].charAt(j).match(/\s/)) {
				splitPositions.push(j);
			}
		}

		if (splitPositions.length > 0) {
			var begin = 0;
			for (var j in splitPositions) {
				begin = j == 0 ? 0 : splitPositions[j - 1] + 1;

				if (tempSelectors[i].substring(begin, splitPositions[j]) !== "") {
					selectors.push(tempSelectors[i].substring(begin, splitPositions[j]));
					combinators.push(" ");
				}
			}

			begin = splitPositions[splitPositions.length - 1] + 1;
			selectors.push(tempSelectors[i].substring(begin));
		} else {
			selectors.push(tempSelectors[i]);
			if (i < tempSelectors.length - 1) {
				combinators.push(tempCombinators[i]);
			}
		}
	}

	var cssSelectors = [];
	for (var i = 0; i < selectors.length; i++) {
		cssSelectors.push(new CssSelector(selectors[i], (i > 0) ? combinators[i - 1] : null));
	}

	return cssSelectors;
};

/**
 * Parse the argument of the :nth-xxx subclasses
 *
 * @param {String} argument - the argument of the :nth-xxx classes: odd|even|an+b
 * 
 * @returs {Object} an object containg the value of a and b in the equation an+b
 * 
 */
CssSelector.parseNthArg = function (argument) {
	if(typeof argument === "undefined") {
		return null;
	}
	
	var a = null, b = null;
	if (argument == 'odd') {
		a = 2;
		b = 1;
	} else if (argument == 'even') {
		a = 2;
		b = 0;
	} else {
		var nthArgMatch = argument.match(/^(([+\-]?\s*\d*)\s*n)?\s*([+\-]?\s*\d+)?$/i);

		if (nthArgMatch) {
			if (nthArgMatch[2] && nthArgMatch[2] != '') {
				a = nthArgMatch[2].replace(/\s*/g, '');

				if (a == '-') {
					a = -1;
				} else if (a == '+') {
					a = 1;
				} else {
					a = parseInt(a);
				}
			} else if (nthArgMatch[1] && nthArgMatch[1] != '') {
				a = 1;
			} else {
				a = 0;
			}

			b = (nthArgMatch[3] && nthArgMatch[3] != '') ? parseInt(nthArgMatch[3].replace(/\s*/g, '')) : 0;
		}
	}

	if (a || b) {
		return {a: a, b: b};
	} else {
		return null;
	}
};