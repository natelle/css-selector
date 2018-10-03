//=============================================================================
// Copyright (c), 1999-2018, Bertin IT. - All Rights Reserved.
// This source code is the property of Bertin IT. Its content may not be
// disclosed to third parties, copied, used or duplicated in any form, in whole
// or in part, without the prior written consent of Bertin IT.
//=============================================================================


load('inc/sources/string.js');
load('inc/sources/object.js');
load('inc/sources/array.js');
load('inc/sources/css/CssCombinator.js');
load('inc/sources/css/CssSelector.js');
load('inc/sources/css/HtmlContext.js');
load('inc/sources/css/HtmlNode.js');
load('inc/sources/css/HtmlNodeSet.js');


/**
 * Build recursively the tree of HTML nodes from a aXMLNode object
 *  
 * @param {HTMLNode} parent - the parent of the new HTML node object
 *
 * @returns {HtmlNode} the matching HTML node object
 */
aXMLNode.prototype.buildTree = function (parent) {
	parent = (typeof parent !== "undefined") ? parent : null;

	if(!this || this.name === '') {
		return null;
	}

	var item = new HtmlNode(this, parent);
	var child = this.get();

	while (child) {
		var tree = child.buildTree(item);

		if (tree) {
			item.children.addNode(tree);
		}
		child = child.next;
	}

	return item;
};

/**
 * Find all the aXMLNode that match the CSS selector from an aXMLNode
 *  
 * @param {String} selector - the complete CSS selector
 * @param {Boolean} [join=false] - if true, join all the aXMLNode into a single one
 *
 * @returns {aXMLNode[]} the aXMLNode that match the CSS selector
 */
aXMLNode.prototype.querySelectorAll = function (selector, join) {
	join = (typeof join !== "undefined") ? join : false;

	var xmlTree = this.buildTree();

	var rawNodes = xmlTree.css(selector).nodes;
	var nodes;

	if (!join) {
		nodes = [];

		for (var i in rawNodes) {
			nodes.push(rawNodes[i].xml);
		}
	} else {
		nodes = new aXMLNode('span');

		for (var i = 0; i < rawNodes.length; i++) {
			nodes.insertNode(i, rawNodes[i].xml);
		}
	}

	return nodes;
};

/**
 * Return the first aXMLNode that match the CSS selector or null if nothing is found from an aXMLNode
 *  
 * @param {String} selector - the complete CSS selector
 *
 * @returns {aXMLNode} the aXMLNode that match the CSS selector
 */
aXMLNode.prototype.querySelector = function (selector) {
	var xmlTree = this.buildTree();

	var rawNodes = xmlTree.css(selector).nodes;

	if (rawNodes.length > 0) {
		return rawNodes[0].xml;
	}

	return null;
};

/**
 * Find all the aXMLNode that match the CSS selector from an amiDocument
 *  
 * @param {String} selector - the complete CSS selector
 * @param {Boolean} [join=false] - if true, join all the aXMLNode into a single one
 *
 * @returns {aXMLNode[]} the aXMLNode that match the CSS selector
 */
amiDocument.prototype.querySelectorAll = function (selector, join) {
	join = (typeof join !== "undefined") ? join : false;

	var xml = htmlToXml(this.source);

	return xml.querySelectorAll(selector, join);
};

/**
 * Return the first aXMLNode that match the CSS selector or null if nothing is found from an amiDocument
 *  
 * @param {String} selector - the complete CSS selector
 *
 * @returns {aXMLNode} the aXMLNode that match the CSS selector
 */
amiDocument.prototype.querySelector = function (selector) {
	var xml = htmlToXml(this.source);

	return xml.querySelector(selector);
};

/**
 * Return a HTML node sets matching the CSS selector on the source of the document.
 *  
 * @param {String} selector - the complete CSS selector
 *
 * @returns {HTMLNodeSet} the set of nodes matching the CSS selector
 */
amiDocument.prototype.$ = function (selector) {
	var xmlTree = htmlToXml(this.source).buildTree();

	return xmlTree.css(selector);
};

/**
 * Filter the amiDocument like with the topology tag in descriptors
 *  
 * @param {Object} filters - the filters object
 * @param {String} filters.author - the CSS selector for the author
 * @param {String} filters.content - the CSS selector for the content/XHTML
 * @param {String} filters.date - the CSS selector for the date 
 * @param {String} filters.description - the CSS selector for the description
 * @param {String} filters.remove - the CSS selector for the elements to be removed
 * @param {String} filters.title - the CSS selector for the title
 * 
 * @returns {amiDocument}
 */
amiDocument.prototype.filter = function (filters) {
	var xmlTree = htmlToXml(this.source).buildTree();

//	if (typeof filters.remove !== "undefined" && filters.remove != "") {
//		var removedNodes = xmlTree.css(filters.remove);
//		print(removedNodes.count())
//		for (var i in removedNodes.nodes) {
//			removedNodes.nodes[i].remove();
//		}
//	}

	if (typeof filters.title !== "undefined" && filters.title != "") {
		this.title = utf8_decode(xmlTree.css(filters.title).text());
	}

	if (typeof filters.author !== "undefined" && filters.author != "") {
		this.author = utf8_decode(xmlTree.css(filters.author).text());
	}

	if (typeof filters.description !== "undefined" && filters.description != "") {
		this.description = utf8_decode(xmlTree.css(filters.description).text());
	}

	if (typeof filters.date !== "undefined" && filters.date != "") {
		load('topo/scanner.js');
		this.date = matchDate(utf8_decode(xmlTree.css(filters.date).text()));
	}

	if (typeof filters.content !== "undefined" && filters.content != "") {
		var content = xmlTree.css(filters.content);
		
		var remove = content.find(filters.remove);
		
		for(var i in remove.nodes) {
			remove.nodes[i].remove();
		}
		

		this.content = utf8_decode(content.text());
		this.setField("ami:x_xhtml", utf8_decode(content.html()));
	}

	return this;
};
