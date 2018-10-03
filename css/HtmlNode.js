//=============================================================================
// Copyright (c), 1999-2018, Bertin IT. - All Rights Reserved.
// This source code is the property of Bertin IT. Its content may not be
// disclosed to third parties, copied, used or duplicated in any form, in whole
// or in part, without the prior written consent of Bertin IT.
//=============================================================================

if (typeof STRING_JS === 'undefined')
	load('inc/sources/string.js');

/**
 * Represents a HTML node for CSS purposes
 * 
 * @constructor
 * 
 * @param {aXMLNode} xml - the XML Node
 * @param {HtmlNodeSet} children - the node's children (a HtmlNodeSet)
 * @param {HtmlNode} parent - the node's parent
 * 
 */
function HtmlNode(xml, parent, children) {
	this.xml = xml;
	this.parent = (typeof parent !== "undefined") ? parent : null;
	this.children = (typeof children !== "undefined") ? children : new HtmlNodeSet();
}

/**
 * Returns the text present in the HTML node
 * 
 * @param {Boolean} recursive - retrieve recursively the text if true
 * @param {Boolean} trim - trim the text if true
 *
 * @returns {String} the text of the HTML node
 */
HtmlNode.prototype.text = function (recursive, trim) {
	recursive = (typeof recursive !== "undefined") ? recursive : true;
	trim = (typeof trim !== "undefined") ? trim : false;
	var text = '';

	if (this.xml.value != '') {
		text += trim ? StringUtil.trim(this.xml.value) : this.xml.value;
	}

	if (recursive) {
		var childrenText = this.children.text(recursive, trim);

		if (childrenText !== '') {
			text += ' ' + this.children.text(recursive, trim);
		}
	}

	return text;
};

HtmlNode.prototype.addChild = function (child) {
	this.xml.insertNode(this.children.count(), child.xml);
	child.parent = this;
	this.children.addNode(child);
};

HtmlNode.prototype.remove = function () {
	var parent = this.parent;
	parent.children.removeNode(this);
};

HtmlNode.prototype.toString = function () {
	return this.xml.toString();
};

/**
 * Find recursively all the nodes that match the validator's condition
 * 
 * @callback nodeValidator
 * @param {aXMLNode} xml - current xml node to be validated or not
 * @param {Number} depth - the node's depth
 * 
 * @param {nodeValidator} validator - callback that returns true if the node must be added to the result ones
 * @param {Number} depth - the current depth of the node
 *
 * @returns {HtmlNodeSet} Returns all the nodes found recursively from the current node (included)
 */
HtmlNode.prototype.findAllNodes = function (validator, depth) {
	validator = typeof validator !== "undefined" ? validator : function () {
		return true;
	};
	depth = typeof depth !== 'undefined' ? depth : 0;

	//var found = [];
	var found = new HtmlNodeSet();

	if (validator(this.xml, depth)) {
		//found.push(this);
		found.addNode(this);
	}

	for (var i in this.children.nodes) {
		var child = this.children.nodes[i];
		//found = found.concat(child.findAllNodes(validator, depth + 1));
		found.concatSet(child.findAllNodes(validator, depth + 1));
	}

	return found;
};

/**
 * Find all the nodes by tag and/or attributes
 *  
 * @param {String} [tag=null] - name of the HTML tag
 * @param {String} [attr=null] - name of the attribute
 * @param {String} [value=null] - value of the attribute
 * @param {Boolean} [multiple=false - if true, match attribute value that are separated by space
 * @param {Number} [depth=false] - selected depth where nodes must be found (all depth if false)
 *
 * @returns {HtmlNodeSet} Returns the nodes found matching the above conditions in a set
 */
HtmlNode.prototype.findAllNodesByAttr = function (tag, attr, value, multiple, depth) {
	tag = typeof tag !== 'undefined' ? tag : null;
	attr = typeof attr !== 'undefined' ? attr : null;
	value = typeof value !== 'undefined' ? value : null;
	multiple = typeof multiple !== 'undefined' ? multiple : false;
	depth = typeof depth !== 'undefined' ? depth : false;

	return this.findAllNodes(function (xml, currentDepth) {
		var res = true;

		if (depth !== false) {
			res = res && currentDepth == depth;
		}

		if (tag) {
			res = res && (xml.name.match(new RegExp("^" + tag + "$", 'i')));
		}

		if (attr) {
			var attrValue = xml.getAttribute(attr);

			res = res && (attrValue !== false);

			if (value) {
				if (!multiple) {
					res = res && (attrValue.match(new RegExp("^" + value + "$", 'i')));
				} else {
					res = res && (attrValue.match(new RegExp("(^|\\s)" + value + "($|\\s)", 'i')));
				}
			}
		}

		return res;
	});
};

/**
 * The "main" function: find all the nodes matching with the CSS selector, starting from a HTML Node
 *  
 * @param {String} mainSelector - the main and complete CSS selector
 *
 * @returns {HtmlNodeSet} returns the set of nodes found matching the CSS selector
 */
HtmlNode.prototype.css = function (mainSelector) {
	var selectors = CssSelector.split(mainSelector);
	var contexts, results = new HtmlNodeSet(), finalResults = new HtmlNodeSet();

	if (!selectors) {
		return finalResults;
	}

	for (var i = 0; i < selectors.length; i++) {
		var selector = selectors[i];

		if (selector.combinator == ',') {
			finalResults.addNodes(results.nodes);
		}

		// Get the new contexts according to the current combinator
		contexts = results.getContexts(this, selector.combinator);
		results = new HtmlNodeSet();

		// Start processing sub-CSS selector for each context
		for (var j in contexts) {
			results.concatSet(contexts[j].processCss(selector));
		}
	}

	finalResults.addNodes(results.nodes);

	return finalResults;
};