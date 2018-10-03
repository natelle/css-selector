//=============================================================================
// Copyright (c), 1999-2018, Bertin IT. - All Rights Reserved.
// This source code is the property of Bertin IT. Its content may not be
// disclosed to third parties, copied, used or duplicated in any form, in whole
// or in part, without the prior written consent of Bertin IT.
//=============================================================================

if (typeof OBJECT_JS === 'undefined')
	load('inc/sources/object.js');

/**
 * Represents a CSS combinator
 * 
 * @constructor
 * 
 * @param {String} [sign=null] - the sign related to the combinator
 * @param {Number} [depth=false] - the depth related to the combinator
 * 
 */
function CssCombinator(sign, depth) {
	this.sign = sign = (typeof sign !== "undefined") ? sign : null;
	this.depth = (typeof depth !== "undefined") ? depth : false;
}

/**
 * Get the contexts with the combinator
 * 
 * @param {HtmlNodeSet} set - the nodes set to which the context will be apply to
 * @param {HtmlNode} original - the original HTML node
 * 
 * @returns {HtmlContext[]} the contexts
 * 
 */
CssCombinator.prototype.getContexts = function (set, original) {
	return [new HtmlContext(original, false)];
};

/**
 * Represents a descendant combinator
 * 
 * @constructor
 * 
 */
function DescendantCombinator() {
	CssCombinator.call(this, ' ');
}

/**
 * Get the contexts with the descendant combinator
 * 
 * @param {HtmlNodeSet} set - the nodes set to which the context will be apply to
 * 
 * @returns {HtmlContext[]} the contexts
 * 
 */
DescendantCombinator.prototype.getContexts = function (set) {
	var contexts = [];

	for (var i in set.nodes) {
		contexts.push(new HtmlContext(set.nodes[i], false));
	}

	return contexts;
};

/**
 * Represents an adjacent sibling combinator
 * 
 * @constructor
 * 
 */
function AdjacentSiblingCombinator() {
	CssCombinator.call(this, '+');
}

/**
 * Get the contexts with the adjacent sibling combinator
 * 
 * @param {HtmlNodeSet} set - the nodes set to which the context will be apply to
 * 
 * @returns {HtmlContext[]} the contexts
 * 
 */
AdjacentSiblingCombinator.prototype.getContexts = function (set) {
	var contexts = [];

	for (var i in set.nodes) {
		var result = set.nodes[i];

		if (result.parent) {
			var siblings = result.parent.children;
			for (var j = 0; j < siblings.count(); j++) {
				var child = siblings.nodes[j];

				if (child == result && (j + 1) < siblings.count()) {
					contexts.push(new HtmlContext(siblings.nodes[j + 1], 0));
					break;
				}
			}
		}
	}
	
	return contexts;
};

/**
 * Represents a general sibling combinator
 * 
 * @constructor
 * 
 */
function GeneralSiblingCombinator() {
	CssCombinator.call(this, '~');
}

/**
 * Get the contexts with the general sibling combinator
 * 
 * @param {HtmlNodeSet} set - the nodes set to which the context will be apply to
 * 
 * @returns {HtmlContext[]} the contexts
 * 
 */
GeneralSiblingCombinator.prototype.getContexts = function (set) {
	var contexts = [];

	for (var i in set.nodes) {
		var result = set.nodes[i];

		if (result.parent) {
			var found = false;
			var siblings = result.parent.children;

			for (var j = 0; j < siblings.count(); j++) {
				var child = siblings.nodes[j];

				if (found) {
					contexts.push(new HtmlContext(result.parent.children.nodes[j], 0));
				}

				if (child == result) {
					found = true;
				}
			}
		}
	}

	return contexts;
};

/**
 * Represents a child combinator
 * 
 * @constructor
 * 
 */
function ChildCombinator() {
	CssCombinator.call(this, '>');
}

/**
 * Get the contexts with the child combinator
 * 
 * @param {HtmlNodeSet} set - the nodes set to which the context will be apply to
 * 
 * @returns {HtmlContext[]} the contexts
 * 
 */
ChildCombinator.prototype.getContexts = function (set) {
	var contexts = [];

	for (var i in set.nodes) {
		contexts.push(new HtmlContext(set.nodes[i], 1));
	}

	return contexts;
};