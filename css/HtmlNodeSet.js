//=============================================================================
// Copyright (c), 1999-2018, Bertin IT. - All Rights Reserved.
// This source code is the property of Bertin IT. Its content may not be
// disclosed to third parties, copied, used or duplicated in any form, in whole
// or in part, without the prior written consent of Bertin IT.
//=============================================================================

if (typeof ARRAY_JS === 'undefined')
	load('inc/sources/array.js');

/**
 * Represents a set of HTML nodes
 * 
 * @constructor
 * 
 * @param {HTMLNode[]} nodes - the HTML nodes that make the set up
 * 
 */
function HtmlNodeSet(nodes) {
	this.nodes = (typeof nodes !== "undefined") ? nodes : [];
}

/**
 * Get the nodes of the set
 * 
 * @returns {HTMLNode[]} the nodes making the set up
 */
HtmlNodeSet.prototype.getNodes = function () {
	return this.nodes;
};

/**
 * Add a HTML node to the set
 * 
 * @param {HTMLNode} node - the node to be added to the set
 */
HtmlNodeSet.prototype.addNode = function (node) {
	this.nodes.push(node);
};

/**
 * Add an array of HTML nodes to the set
 * 
 * @param {HTMLNode[]} nodes - the nodes array to be added to the set
 */
HtmlNodeSet.prototype.addNodes = function (nodes) {
	this.nodes = this.nodes.concat(nodes);
	this.nodes = ArrayUtil.arrayUnique(this.nodes);
};

/**
 * Merge an array of HTML nodes to the existing nodes of the set (with intersection)
 * 
 * @param {HTMLNode[]} nodes - the nodes to be kept in the existing set's nodes
 */
HtmlNodeSet.prototype.mergeNodes = function (nodes) {
	if (this.nodes) {
		this.nodes = ArrayUtil.intersects(this.nodes, nodes);
	} else {
		this.nodes = nodes.slice();
	}
};

/**
 * Set the nodes of the set
 * 
 * @param {HTMLNode[]} nodes
 */
HtmlNodeSet.prototype.setNodes = function (nodes) {
	this.nodes = nodes;
};

/**
 * Merge a set's nodes to the current set's ones
 * 
 * @param {HTMLNodeSet} set - the set whose nodes have to be merged
 */
HtmlNodeSet.prototype.mergeSet = function (set) {
	this.mergeNodes(set.nodes);
};

/**
 * Concatenate a set's nodes to the current set's one
 * 
 * @param {HTMLNodeSet} set - the set whose nodes have to be concatenated
 */
HtmlNodeSet.prototype.concatSet = function (set) {
	this.addNodes(set.nodes);
};

/**
 * Get the contexts from a set of nodes, a combinator and eventually the original node
 * 
 * @param {HTMLNode} node - the original node used with the CSS selector
 * @param {String} sign - the eventual combinator's sign (' ', '+', '~', '>' or null)
 * 
 */
HtmlNodeSet.prototype.getContexts = function (node, sign) {
	var combinator;

	switch (sign) {
		case ' ':
			combinator = new DescendantCombinator();
			break;
		case '+':
			combinator = new AdjacentSiblingCombinator();
			break;
		case '~':
			combinator = new GeneralSiblingCombinator();
			break;
		case '>':
			combinator = new ChildCombinator();
			break;
		default:
			combinator = new CssCombinator();
	}


	return combinator.getContexts(this, node);
};

/**
 * Remove a node from the nodes set
 *  
 * @param {HTMLNode} node - the node to be removed
 */
HtmlNodeSet.prototype.removeNode = function (node) {
	ArrayUtil.remove(this.nodes, node);
};

/**
 * Count the number of HTML nodes in the set
 *
 * @returns {Number} Returns the number of nodes in the set
 */
HtmlNodeSet.prototype.count = function () {
	if (ObjectUtil.isArray(this.nodes)) {
		return this.nodes.length;
	}

	return 0;
};

/**
 * Flatten all the nodes into a HTMLNode one
 *  
 * @param {String} [root="span"] - name of the HTML tag that includes all the set's nodes
 *
 * @returns {HtmlNode} Returns all the nodes found matching the above conditions
 */
HtmlNodeSet.prototype.flatten = function (root) {
	root = (typeof root !== 'undefined') ? root : 'span';

	var xmlNode = new aXMLNode(root);
	var node = new HtmlNode(xmlNode);

	for (var i = 0; i < this.nodes.length; i++) {
		xmlNode.insertNode(i, this.nodes[i].xml);
		node.addChild(this.nodes[i]);
	}

	return node;
};

/**
 * Cast the nodes set to a string
 *
 * @returns {String} Returns all the nodes found matching the above conditions
 */
HtmlNodeSet.prototype.toString = function () {
	var string = "";

	for (var i in this.nodes) {
		string += this.nodes[i].toString();
	}

	return string;
};

/**
 * Cast the HTML nodes set to an array of aXMLNode
 *
 * @returns {aXMLNode[]} Returns all the nodes found matching the above conditions
 */
HtmlNodeSet.prototype.toXml = function () {
	var xmlNodes = [];

	for (var i in this.nodes) {
		xmlNodes.push(this.nodes[i].xml);
	}

	return xmlNodes;
};

/**
 * Get the HTML of the set
 *
 * @returns {String} Returns the HTML content of the nodes set
 */
HtmlNodeSet.prototype.html = function () {
	if (this.nodes.length > 0) {
		return this.toString();
	}

	return null;
};

/**
 * Returns the text present in the HTML node set
 * 
 * @param {Boolean} recursive - retrieve recursively the text if true
 * @param {Boolean} trim - trim the text if true
 *
 * @returns {String} the text of the HTML node
 */
HtmlNodeSet.prototype.text = function (recursive, trim) {
	recursive = (typeof recursive !== "undefined") ? recursive : true;
	trim = (typeof trim !== "undefined") ? trim : false;
	var text = '';

	for (var i = 0; i < this.nodes.length; i++) {
		if (i > 0) {
			text += ' ';
		}

		text += this.nodes[i].text(recursive, trim);
	}

	return text;
};

/**
 * Get the parent of each element in the current set of matched elements, optionally filtered by a selector.
 * 
 * @param {String} selector - a selector expression to match elements against.
 *
 * @returns {HtmlNodeSet} the parents of nodes set
 */
HtmlNodeSet.prototype.parent = function (selector) {
	selector = (typeof selector !== "undefined") ? selector : null;

	var parents = [];

	for (var i in this.nodes) {
		var parent = this.nodes[i].parent;

		if (parent) {
			if (!selector) {
				parents.push(parent);
			} else {
				var node = new HtmlNode(parent.xml);
				var cssNodes = node.css(selector);

				if (cssNodes && cssNodes.count() > 0) {
					parents.push(parent);
				}
			}
		}
	}

	return new HtmlNodeSet(ArrayUtil.arrayUnique(parents));
};

/**
 * Get the ancestors of each element in the current set of matched elements, optionally filtered by a selector.
 * 
 * @param {String} selector - a selector expression to match elements against.
 *
 * @returns {HtmlNodeSet} the ancestors of nodes set
 */
HtmlNodeSet.prototype.parents = function (selector) {
	selector = (typeof selector !== "undefined") ? selector : null;

	var parents = [];

	for (var i in this.nodes) {
		if (!selector) {
			var currentNode = this.nodes[i];
			while (currentNode.parent) {
				parents.push(currentNode.parent);
				currentNode = currentNode.parent;
			}
		} else {
			var currentNode = this.nodes[i];
			while (currentNode.parent) {
				var node = new HtmlNode(currentNode.parent.xml);
				var cssNodes = node.css(selector);

				if (cssNodes && cssNodes.count() > 0) {
					parents.push(currentNode.parent);
				}

				currentNode = currentNode.parent;
			}
		}
	}

	return new HtmlNodeSet(ArrayUtil.arrayUnique(parents));
};

/**
 * Get the ancestors of each element in the current set of matched elements, up to but not including the element matched by the selector.
 * 
 * @param {String} selector - a string containing a selector expression to indicate where to stop matching ancestors elements.
 * @param {String} filter - a string containing a selector expression to match elements against.
 *
 * @returns {HtmlNodeSet} all the ancestors of the nodes set until it stops
 */
HtmlNodeSet.prototype.parentsUntil = function (selector, filter) {
	selector = (typeof selector !== "undefined") ? selector : null;
	filter = (typeof filter !== "undefined") ? filter : null;

	var parents = [];

	for (var i in this.nodes) {
		if (selector) {
			var currentNode = this.nodes[i];
			while (currentNode.parent) {
				var node = new HtmlNode(currentNode.parent.xml);
				var cssLimitNodes = node.css(selector);

				if (cssLimitNodes && cssLimitNodes.count() > 0) {
					break;
				} else {
					if (filter) {
						var cssNodes = node.css(filter);

						if (cssNodes && cssNodes.count() > 0) {
							parents.push(currentNode);
						}
					} else {
						parents.push(currentNode);
					}
				}

				currentNode = currentNode.parent;
			}
		}
	}

	return new HtmlNodeSet(ArrayUtil.arrayUnique(parents));
};

/**
 * For each element in the set, get the first element that matches the selector by
 * testing the element itself and traversing up through its ancestors in the DOM tree.
 * 
 * @param {String} selector - a selector expression to match elements against.
 *
 * @returns {HtmlNodeSet} the closest elements of nodes set
 */
HtmlNodeSet.prototype.closest = function (selector) {
	selector = (typeof selector !== "undefined") ? selector : null;

	var closests = [];

	for (var i in this.nodes) {
		if (!selector) {
			closests.push(this.nodes[i]);
		} else {
			var currentNode = this.nodes[i];
			while (currentNode) {
				var node = new HtmlNode(currentNode.xml);
				var cssNodes = node.css(selector);

				if (cssNodes && cssNodes.count() > 0) {
					closests.push(currentNode.parent);
					break;
				}

				currentNode = currentNode.parent;
			}
		}
	}

	return new HtmlNodeSet(ArrayUtil.arrayUnique(closests));
};

/**
 * Get the children of each element in the set of matched elements, optionally filtered by a selector.
 * 
 * @param {String} selector - a selector expression to match elements against.
 *
 * @returns {HtmlNodeSet} the children elements of the nodes set
 */
HtmlNodeSet.prototype.children = function (selector) {
	selector = (typeof selector !== "undefined") ? selector : null;

	var children = new HtmlNodeSet();

	for (var i in this.nodes) {
		var tempChildren = this.nodes[i].children;

		if (!selector) {
			children = children.concatSet(tempChildren);
		} else {
			for (var j in tempChildren.nodes) {
				var node = new HtmlNode(tempChildren.nodes[j].xml);
				var cssNodes = node.css(selector);

				if (cssNodes && cssNodes.count() > 0) {
					children.addNode(tempChildren);
				}
			}
		}
	}

	return children;
};

/**
 * Get the descendants of each element in the current set of matched elements, filtered by a selector.
 * 
 * @param {String} selector - a selector expression to match elements against.
 *
 * @returns {HtmlNodeSet} the elements found according to the selector
 */
HtmlNodeSet.prototype.find = function (selector) {
	selector = (typeof selector !== "undefined") ? selector : null;

	var children = new HtmlNodeSet();

	for (var i in this.nodes) {
		var tempChildren = this.nodes[i].children;

		if (!selector) {
			children.concatSet(tempChildren);
		} else {
			for (var j in tempChildren.nodes) {
				var child = tempChildren.nodes[j];
				var cssNodes = child.css(selector);

				if (cssNodes && cssNodes.count() > 0) {
					children.concatSet(cssNodes);
				}
			}
		}
	}

	return children;
};

/**
 * Get the siblings of each element in the set of matched elements, optionally filtered by a selector.
 * 
 * @param {String} selector - a selector expression to match elements against.
 *
 * @returns {HtmlNodeSet} the siblings elements of the nodes set
 */
HtmlNodeSet.prototype.siblings = function (selector) {
	selector = (typeof selector !== "undefined") ? selector : null;

	var siblings = [];

	for (var i in this.nodes) {
		var tempNode = this.nodes[i];

		if (tempNode.parent) {
			var tempSiblings = tempNode.parent.children;

			if (!selector) {
				var currentSiblings = ArrayUtil.diff(tempSiblings.nodes, tempNode);

				siblings = siblings.concat(currentSiblings);
			} else {
				for (var j in tempSiblings) {
					var node = new HtmlNode(tempSiblings.nodes[j].xml);
					var cssNodes = node.css(selector);

					if (cssNodes && cssNodes.count() > 0) {
						siblings.push(tempSiblings[j]);
					}
				}
			}
		}
	}

	return new HtmlNodeSet(ArrayUtil.arrayUnique(siblings));
};

/**
 * Get the immediately following sibling of each element in the set of matched elements.
 * If a selector is provided, it retrieves the next sibling only if it matches that selector.
 * 
 * @param {String} selector - a selector expression to match elements against.
 *
 * @returns {HtmlNodeSet} the immedialtely next siblings of the nodes set
 */
HtmlNodeSet.prototype.next = function (selector) {
	selector = (typeof selector !== "undefined") ? selector : null;

	var nexts = [];

	for (var i = 0; i < this.nodes.length; i++) {
		var tempNode = this.nodes[i];

		if (tempNode.parent) {
			var siblings = tempNode.parent.children;
			var index = ArrayUtil.indexOf(siblings.nodes, tempNode);
			var next = siblings.nodes[index + 1];

			if (typeof next !== "undefined") {
				if (!selector) {
					nexts.push(next);
				} else {
					var node = new HtmlNode(next.xml);
					var cssNodes = node.css(selector);

					if (cssNodes && cssNodes.count() > 0) {
						nexts.push(next);
					}
				}
			}
		}
	}

	return new HtmlNodeSet(ArrayUtil.arrayUnique(nexts));
};

/**
 * Get all following siblings of each element in the set of matched elements, optionally filtered by a selector.
 * 
 * @param {String} selector - a selector expression to match elements against.
 *
 * @returns {HtmlNodeSet} all the following siblings of the nodes set
 */
HtmlNodeSet.prototype.nextAll = function (selector) {
	selector = (typeof selector !== "undefined") ? selector : null;

	var nexts = [];

	for (var i = 0; i < this.nodes.length; i++) {
		var tempNode = this.nodes[i];

		if (tempNode.parent) {
			var siblings = tempNode.parent.children;
			var index = ArrayUtil.indexOf(siblings.nodes, tempNode);

			for (var j = index + 1; j < siblings.count(); j++) {
				var next = siblings.nodes[j];

				if (!selector) {
					nexts.push(next);
				} else {
					var node = new HtmlNode(next.xml);
					var cssNodes = node.css(selector);

					if (cssNodes && cssNodes.count() > 0) {
						nexts.push(next);
					}
				}
			}
		}
	}

	return new HtmlNodeSet(ArrayUtil.arrayUnique(nexts));
};

/**
 * Get all following siblings of each element up to but not including the element matched by the selector passed.
 * 
 * @param {String} selector - a string containing a selector expression to indicate where to stop matching following sibling elements.
 * @param {String} filter - a string containing a selector expression to match elements against.
 *
 * @returns {HtmlNodeSet} all the following siblings of the nodes set until it stops
 */
HtmlNodeSet.prototype.nextUntil = function (selector, filter) {
	selector = (typeof selector !== "undefined") ? selector : null;
	filter = (typeof filter !== "undefined") ? filter : null;

	var nexts = [];

	for (var i = 0; i < this.nodes.length; i++) {
		var tempNode = this.nodes[i];

		if (tempNode.parent) {
			var siblings = tempNode.parent.children;
			var index = ArrayUtil.indexOf(siblings.nodes, tempNode);

			for (var j = index + 1; j < siblings.count(); j++) {
				var next = siblings.nodes[j];

				if (selector) {
					var node = new HtmlNode(next.xml);
					var cssLimitNodes = node.css(selector);

					if (cssLimitNodes && cssLimitNodes.count() > 0) {
						break;
					} else {
						if (filter) {
							var cssNodes = node.css(filter);

							if (cssNodes && cssNodes.count() > 0) {
								nexts.push(next);
							}
						} else {
							next.push(next);
						}
					}
				}
			}
		}
	}
	return new HtmlNodeSet(ArrayUtil.arrayUnique(nexts));
};

/**
 * Get the immediately preceding sibling of each element in the set of matched elements.
 * If a selector is provided, it retrieves the previous sibling only if it matches that selector.
 * 
 * @param {String} selector - a string containing a selector expression to match elements against.
 *
 * @returns {HtmlNodeSet} the immedialtely preceding siblings of the nodes set
 */
HtmlNodeSet.prototype.prev = function (selector) {
	selector = (typeof selector !== "undefined") ? selector : null;

	var prevs = [];

	for (var i = 0; i < this.nodes.length; i++) {
		var tempNode = this.nodes[i];

		if (this.nodes[i].parent) {
			var siblings = tempNode.parent.children;
			var index = ArrayUtil.indexOf(siblings.nodes, tempNode);
			var prev = siblings.nodes[index - 1];

			if (typeof prev !== "undefined") {
				if (!selector) {
					prevs.push(prev);
				} else {
					var node = new HtmlNode(prev.xml);
					var cssNodes = node.css(selector);

					if (cssNodes && cssNodes.count() > 0) {
						prevs.push(prev);
					}
				}
			}
		}
	}

	return new HtmlNodeSet(ArrayUtil.arrayUnique(prevs));
};

/**
 * Get all preceding siblings of each element in the set of matched elements, optionally filtered by a selector.
 * 
 * @param {String} selector - a string containing a selector expression to match elements against.
 *
 * @returns {HtmlNodeSet} all the preceding siblings of the nodes set
 */
HtmlNodeSet.prototype.prevAll = function (selector) {
	selector = (typeof selector !== "undefined") ? selector : null;

	var prevs = [];

	for (var i = 0; i < this.nodes.length; i++) {
		var tempNode = this.nodes[i];

		if (tempNode.parent) {
			var siblings = tempNode.parent.children;
			var index = ArrayUtil.indexOf(siblings.nodes, tempNode);

			for (var j = index - 1; j >= 0; j--) {
				var prev = siblings.nodes[j];

				if (!selector) {
					prevs.push(prev);
				} else {
					var node = new HtmlNode(prev.xml);
					var cssNodes = node.css(selector);

					if (cssNodes && cssNodes.count() > 0) {
						prevs.push(prev);
					}
				}
			}
		}
	}

	return new HtmlNodeSet(ArrayUtil.arrayUnique(prevs));
};

/**
 * Get all preceding siblings of each element up to but not including the element matched by the selector.
 * 
 * @param {String} selector - a string containing a selector expression to indicate where to stop matching preceding sibling elements.
 * @param {String} filter - a string containing a selector expression to match elements against.
 *
 * @returns {HtmlNodeSet} all the preceding siblings of the nodes set until it stops
 */
HtmlNodeSet.prototype.prevUntil = function (selector, filter) {
	selector = (typeof selector !== "undefined") ? selector : null;
	filter = (typeof filter !== "undefined") ? filter : null;

	var prevs = [];

	for (var i = 0; i < this.nodes.length; i++) {
		var tempNode = this.nodes[i];

		if (tempNode.parent) {
			var siblings = tempNode.parent.children;
			var index = ArrayUtil.indexOf(siblings.nodes, tempNode);

			for (var j = index - 1; j >= 0; j--) {
				var prev = siblings.nodes[j];

				if (selector) {
					var node = new HtmlNode(prev.xml);
					var cssLimitNodes = node.css(selector);

					if (cssLimitNodes && cssLimitNodes.count() > 0) {
						break;
					} else {
						if (filter) {
							var cssNodes = node.css(filter);

							if (cssNodes && cssNodes.count() > 0) {
								prevs.push(prev);
							}
						} else {
							prev.push(prev);
						}
					}
				}
			}
		}
	}
	return new HtmlNodeSet(ArrayUtil.arrayUnique(prevs));
};

/**
 * Remove elements from the set of matched elements.
 * 
 * @param {Number} selector - a string containing a selector expression, a DOM element, or an array of elements to match against the set.
 *
 * @returns {HtmlNodeSet} the remaining elements of the nodes set
 */
HtmlNodeSet.prototype.not = function (selector) {
	return this.find(":not(" + selector + ")");
};

/**
 * Reduce the set of matched elements to a subset specified by a range of indices.
 * 
 * @param {Number} start - an integer indicating the 0-based position at which the elements begin to be selected.
 *						   If negative, it indicates an offset from the end of the set.
 * @param {Number} end - an integer indicating the 0-based position at which the elements stop being selected.
 *						 If negative, it indicates an offset from the end of the set. If omitted, the range continues until the end of the set.
 *
 * @returns {HtmlNodeSet} the subset reduced from the original set
 */
HtmlNodeSet.prototype.slice = function (start, end) {
	return new HtmlNodeSet(this.nodes.slice(start, end));
};