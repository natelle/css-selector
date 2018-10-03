//=============================================================================
// Copyright (c), 1999-2018, Bertin IT. - All Rights Reserved.
// This source code is the property of Bertin IT. Its content may not be
// disclosed to third parties, copied, used or duplicated in any form, in whole
// or in part, without the prior written consent of Bertin IT.
//=============================================================================

if (typeof ARRAY_JS === 'undefined')
	load('inc/sources/array.js');

/**
 * Represents a HTML context for CSS purposes
 * 
 * @constructor
 * 
 * @param {HtmlNode} node - the HTML Node used as a reference
 * @param {Number} [depth=false] - the depth where future nodes will be sought
 * 
 */
function HtmlContext(node, depth) {
	this.node = node;
	this.depth = (typeof depth !== "undefined") ? depth : false;
}

HtmlContext.prototype.processCss = function (selector) {
	var nodes = new HtmlNodeSet(null);

	// UNIVERSAL SELECTOR
	if (selector.all) {
		nodes.mergeSet(this.findNodesByAll());
	}

	// Id selector
	if (selector.id) {
		nodes.mergeSet(this.findNodesById(selector.id));
	}

	// Classes selector
	if (selector.classes.length > 0) {
		for (var iCl in selector.classes) {
			nodes.mergeSet(this.findNodesByClass(selector.classes[iCl]));
		}
	}

	// Tag selector
	if (selector.tag) {
		nodes.mergeSet(this.findNodesByType(selector.tag));
	}

	// Attribute selector
	if (selector.attr) {
		nodes.mergeSet(this.findNodesByAttr(selector.attr));
	}

	// Pseudo class selector
	if (selector.pClass) {
		nodes.mergeSet(this.findNodesByPseudoClass(selector.pClass, selector.tag));
	}

	return nodes;
};

/**
 * Universal selector search in a (HtmlContext) context
 *
 * @returns {HtmlNode} Returns the nodes that match the universal selector (all the nodes)
 */
HtmlContext.prototype.findNodesByAll = function () {
	return this.node.findAllNodesByAttr(null, null, null, null, this.depth);
};

/**
 * Type selector search in a (HtmlContext) context
 *  
 * @param {String} tag - the node name in the selector (<tagName>)
 *
 * @returns {HtmlNode} Returns the nodes that match the type selector
 */
HtmlContext.prototype.findNodesByType = function (tag) {
	return this.node.findAllNodesByAttr(tag, null, null, null, this.depth);
};

/**
 * Id selector search in a (HtmlContext) context
 *  
 * @param {String} id - the value of the id attribute in the selector (id="idName" => #idName)
 *
 * @returns {HtmlNode} Returns the nodes that match the id selector
 */
HtmlContext.prototype.findNodesById = function (id) {
	return this.node.findAllNodesByAttr(null, "id", id, null, this.depth);
};

/**
 * Class selector search in a (HtmlContext) context
 *  
 * @param {String} cl - (one of) the value of the class attribute in the selector (class="class1 class2" => .class1)
 *
 * @returns {HtmlNode} Returns the nodes that match the class selector
 */
HtmlContext.prototype.findNodesByClass = function (cl) {
	return this.node.findAllNodesByAttr(null, "class", cl, true, this.depth);
};

/**
 * Attribute selector search in a (HtmlContext) context
 *  
 * @param {String} attr - the attribute argument in  [ ] in the selector (attribute="my attribute" => [attribute...])
 *
 * @returns {HtmlNode} Returns the nodes that match the attribute selector
 */
HtmlContext.prototype.findNodesByAttr = function (attr) {
	var attrMatch = attr.match(/([a-z0-9_\-]+)\s*(?:([\~\|\^\$\*]?=)\s*([a-z0-9_\-]+)\s*(i)?)?/i);
	var attrName = null, attrOp = null, attrValue = null, attrCase = null;
	var attrNodes = new HtmlNodeSet();

	if (attrMatch) {
		attrName = attrMatch[1];
		attrOp = attrMatch[2];
		attrValue = attrMatch[3];
		attrCase = (typeof attrMatch[4] !== 'undefined') ? 'i' : '';

		attrNodes = this.node.findAllNodesByAttr(null, attrName, null, null, this.depth);

		if (attrOp && attrValue) {
			var regex;

			switch (attrOp) {
				case '=':
					regex = new RegExp('^' + attrValue + '$', attrCase);
					break;
				case '~=':
					regex = new RegExp('(^|\\s)' + attrValue + '($|\\s)', attrCase);
					break;
				case '|=':
					regex = new RegExp('^' + attrValue + '($|-)', attrCase);
					break;
				case '^=':
					regex = new RegExp('^' + attrValue, attrCase);
					break;
				case '$=':
					regex = new RegExp(attrValue + '$', attrCase);
					break;
				case '*=':
					regex = new RegExp(attrValue, attrCase);
					break;
			}

			for (var i = attrNodes.nodes.length - 1; i >= 0; i--) {
				var node = attrNodes.nodes[i];
				var currentAttr = node.xml.getAttribute(attrName);
				if (!currentAttr.match(regex)) {
					attrNodes.removeNode(node);
				}
			}
		}
	}

	return attrNodes;
};

/**
 * Pseudo class selector search in a (HtmlContext) context
 *  
 * @param {String} pseudoClass - the pseudo class in the selector (tag:pseudoClass)
 * @param {String} tag - the tag name that can be used by some pseudo classes
 *
 * @returns {HtmlNode} Returns the nodes that match the pseudo class selector
 */
HtmlContext.prototype.findNodesByPseudoClass = function (pseudoClass, tag) {
	var pClassMatch = pseudoClass.match(/^(.+?)\s*(?:\(\s*(.*?)\s*\))?$/);
	var pClassNodes = new HtmlNodeSet();

	if (pClassMatch) {
		var pClassName = pClassMatch[1];
		var pClassArg = pClassMatch[2];

		switch (pClassName) {
			case 'empty':
				pClassNodes = this.empty();
				break;
			case 'first-child':
				pClassNodes = this.nthChild('1', tag);
				break;
			case 'last-child':
				pClassNodes = this.nthChild('1', tag, false);
				break;
			case 'nth-child':
				pClassNodes = this.nthChild(pClassArg, tag);
				break;
			case 'nth-last-child':
				pClassNodes = this.nthChild(pClassArg, tag, false);
				break;
			case 'only-child':
				pClassNodes = this.nthChild('1', tag, true, true);
				break;
			case 'first-of-type':
				pClassNodes = this.nthOfType('1', tag);
				break;
			case 'last-of-type':
				pClassNodes = this.nthOfType('1', tag, false);
				break;
			case 'nth-of-type':
				pClassNodes = this.nthOfType(pClassArg, tag);
				break;
			case 'nth-last-of-type':
				pClassNodes = this.nthOfType(pClassArg, tag, false);
				break;
			case 'only-of-type':
				pClassNodes = this.nthOfType('1', tag, true, true);
				break;
			case 'not':
				pClassNodes = this.not(pClassArg);
				break;
			default:
		}
	}

	return pClassNodes;
};

/**
 * Pseudo class :emtpy selector
 *
 * @returns {HtmlNode} Returns the nodes that match the pseudo class :emtpy selector
 */
HtmlContext.prototype.empty = function () {
	var allNodes = this.node.findAllNodesByAttr(null, null, null, null, this.depth);
	var finalNodes = new HtmlNodeSet();

	for (var i in allNodes.nodes) {
		var node = allNodes.nodes[i];

		if (node.children == 0 && node.xml.value == "") {
			finalNodes.addNode(node);
		}
	}

	return finalNodes;
};

/**
 * Pseudo class :nth-child(an+b) also used for all :xxx-child selectors
 *  
 * @param {String} argument - the argument passed to nth-child or nth-last-child selectors
 * @param {String} tag - the tag name that can be used in the pseudo class
 * @param {Boolean} [asc=true] - if true, start from the beginning, else from the end
 * @param {Boolean} [only=false] - if true, becomes a only-child selector
 *
 * @returns {HtmlNode} Returns the nodes that match the pseudo class :xxx-child selector
 */
HtmlContext.prototype.nthChild = function (argument, tag, asc, only) {
	asc = (typeof asc !== 'undefined') ? asc : true;
	only = (typeof only !== 'undefined') ? only : false;

	var parsedArg = CssSelector.parseNthArg(argument);
	var finalNodes = new HtmlNodeSet();

	if (!parsedArg) {
		return finalNodes;
	}

	var temp = this.node.findAllNodesByAttr(tag, null, null, null, this.depth);

	var parents = new HtmlNodeSet();

	for (var i in temp.nodes) {
		var node = temp.nodes[i];

		if (node.parent && !ArrayUtil.inArray(parents.nodes, node.parent)) {
			parents.addNode(node.parent);
		}
	}

	for (var i in parents.nodes) {
		var children = parents.nodes[i].children, n, nthChildFound;
		if (only && children.count() > 1) {
			continue;
		}

		if (asc || parsedArg.b != 0) {
			n = 0;
		} else {
			n = 1;
		}

		do {
			var c = parsedArg.a * n + parsedArg.b - (asc ? 1 : 0);

			var index = asc ? c : children.count() - c;
			var currentNode = children.nodes[index];

			if (typeof currentNode !== "undefined" && currentNode.xml.name == tag) {
				finalNodes.addNode(currentNode);
			}

			nthChildFound = (c < 0 && parsedArg.a > 0) ||
					((typeof currentNode !== "undefined") && (parsedArg.a != 0));

			n++;
		} while (nthChildFound);
	}

	return finalNodes;
};

/**
 * Pseudo class :nth-of-type(an+b) also used for all :xxx-of-type selectors
 *  
 * @param {String} argument - the argument passed to nth-of-type or nth-last-child selectors
 * @param {String} tag - the tag name that can be used in the pseudo class
 * @param {Boolean} [asc=true] - if true, start from the beginning, else from the end
 * @param {Boolean} [only=false] - if true, becomes a only-of-type selector
 *
 * @returns {HtmlNode} Returns the nodes that match the pseudo class :xxx-of-type selector
 */
HtmlContext.prototype.nthOfType = function (argument, tag, asc, only) {
	asc = (typeof asc !== 'undefined') ? asc : true;
	only = (typeof only !== 'undefined') ? only : false;

	var parsedArg = CssSelector.parseNthArg(argument);
	var finalNodes = new HtmlNodeSet();

	if (!parsedArg) {
		return finalNodes;
	}

	var temp = this.node.findAllNodesByAttr(tag, null, null, null, this.depth);

	var parents = new HtmlNodeSet();
	for (var i in temp.nodes) {
		var node = temp.nodes[i];
		if (node.parent && !ArrayUtil.inArray(parents.nodes, node.parent)) {
			parents.addNode(node.parent);
		}
	}

	for (var i in parents.nodes) {
		var children = parents.nodes[i].children, n, nthChildFound;
		var childrenOfType = new HtmlNodeSet();

		for (var j in children.nodes) {
			var child = children.nodes[j];

			if (child.xml.name == tag) {
				childrenOfType.addNode(child);
			}
		}

		if (only && childrenOfType.count() > 1) {
			continue;
		}

		if (asc || parsedArg.b != 0) {
			n = 0;
		} else {
			n = 1;
		}

		do {
			var c = parsedArg.a * n + parsedArg.b - (asc ? 1 : 0);

			var index = asc ? c : childrenOfType.count() - c;
			var currentNode = childrenOfType.nodes[index];

			if (typeof currentNode !== "undefined") {
				finalNodes.addNode(currentNode);
			}

			nthChildFound = (c < 0 && parsedArg.a > 0) ||
					((typeof currentNode !== "undefined") && (parsedArg.a != 0));

			n++;
		} while (nthChildFound);
	}

	return finalNodes;
};

/**
 * Pseudo class :not(CSS selector)
 *  
 * @param {String} argument - the new CSS selector passed to the :not selector
 *
 * @returns {HtmlNode} Returns the nodes that match the pseudo class :not selector
 */
HtmlContext.prototype.not = function (argument) {
	var allNodes = this.node.findAllNodesByAttr(null, null, null, null, this.depth);
	var notNodes = this.node.css(argument);

	return new HtmlNodeSet(ArrayUtil.diff(allNodes.nodes, notNodes.nodes));
};