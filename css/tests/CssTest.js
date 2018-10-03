include('/opt/AlbScriptUnit/Framework/TestCase.js');
load('inc/sources/css.js');


function CssTest() {
	this.source =
			"<html>" +
			"<body>" +
			'<h1 id="title">My First Heading</h1>' +
			'<p class="top" lang="en-us">My first paragraph.</p>' +
			'<img class="top image" src="link"/>' +
			'<ul>' +
			'<span>first</span>' +
			'<li>1</li>' +
			'<li>2</li>' +
			'<li data-target="Olala">3</li>' +
			'<li>4</li>' +
			'<li>5</li>' +
			'<li>6</li>' +
			'<li data-target="language">7</li>' +
			'<li>8</li>' +
			'<li>9</li>' +
			'<span>last</span>' +
			'</ul>' +
			'<div>' +
			'<h3>Only child</h3>' +
			'</div>' +
			'<div content="h4">' +
			'<h4></h4>' +
			'<p>Only child</p>' +
			'</div>' +
			'<p>A normal paragraph</p>' +
			'<a data-target="Other page" lang="en-en" href="http://www.otherpage.com">Other page</a>' +
			"</body>" +
			"</html>";

	this.xml = new aXMLDocument(this.source);
}
CssTest.prototype = TestCase.prototype;
CssTest.prototype.constructor = CssTest;

/*
 * Tests the universal selector *
 */
CssTest.prototype.testUniversalSelector = function () {
	var nodes = this.xml.querySelectorAll("*");
	this.assertCount(24, nodes);
};

/*
 * Tests the simple tag selector 
 */
CssTest.prototype.testTagSelector = function () {
	// Positive assertions
	var nodes = this.xml.querySelectorAll("html");
	this.assertCount(1, nodes);

	nodes = this.xml.querySelectorAll("body");
	this.assertCount(1, nodes);

	nodes = this.xml.querySelectorAll("h1");
	this.assertCount(1, nodes);

	nodes = this.xml.querySelectorAll("p");
	this.assertCount(3, nodes);

	nodes = this.xml.querySelectorAll("img");
	this.assertCount(1, nodes);

	nodes = this.xml.querySelectorAll("ul");
	this.assertCount(1, nodes);

	nodes = this.xml.querySelectorAll("span");
	this.assertCount(2, nodes);

	nodes = this.xml.querySelectorAll("li");
	this.assertCount(9, nodes);

	nodes = this.xml.querySelectorAll("div");
	this.assertCount(2, nodes);

	nodes = this.xml.querySelectorAll("h3");
	this.assertCount(1, nodes);

	nodes = this.xml.querySelectorAll("h4");
	this.assertCount(1, nodes);

	nodes = this.xml.querySelectorAll("a");
	this.assertCount(1, nodes);

	// Negative assertions
	nodes = this.xml.querySelectorAll("h2");
	this.assertEmpty(nodes);

	nodes = this.xml.querySelectorAll("aa");
	this.assertEmpty(nodes);
};

/*
 * Tests the ID selector '#id'
 */
CssTest.prototype.testIdSelector = function () {
	// Positive assertions
	var nodes = this.xml.querySelectorAll("#title");
	this.assertCount(1, nodes);

	// Negative assertions
	nodes = this.xml.querySelectorAll("#foo");
	this.assertEmpty(nodes);

	nodes = this.xml.querySelectorAll("#titlee");
	this.assertEmpty(nodes);

	nodes = this.xml.querySelectorAll("#etitle");
	this.assertEmpty(nodes);
};

/*
 * Tests the class selector '.class'
 */
CssTest.prototype.testClassSelector = function () {
	// Positive assertions
	var nodes = this.xml.querySelectorAll(".top");
	this.assertCount(2, nodes);

	nodes = this.xml.querySelectorAll(".top.image");
	this.assertCount(1, nodes);
	this.assertEquals("img", nodes[0].name);

	// Negative assertions
	nodes = this.xml.querySelectorAll(".foo");
	this.assertEmpty(nodes);

	nodes = this.xml.querySelectorAll(".fooe");
	this.assertEmpty(nodes);

	nodes = this.xml.querySelectorAll(".efoo");
	this.assertEmpty(nodes);
};

/*
 * Tests the combination of tag and id selectors 'tag#id'
 */
CssTest.prototype.testTagAndIdSelector = function () {
	// Positive assertions
	var nodes = this.xml.querySelectorAll("h1#title");
	this.assertCount(1, nodes);

	// Negative assertions
	nodes = this.xml.querySelectorAll("h1#foo");
	this.assertEmpty(nodes);

	nodes = this.xml.querySelectorAll("foo#title");
	this.assertEmpty(nodes);

	nodes = this.xml.querySelectorAll("foo#bar");
	this.assertEmpty(nodes);
};

/*
 * Tests the combination of tag and class selectors 'tag.class'
 */
CssTest.prototype.testTagAndClassSelector = function () {
	// Positive assertions
	var nodes = this.xml.querySelectorAll("p.top");
	this.assertCount(1, nodes);

	nodes = this.xml.querySelectorAll("img.top.image");
	this.assertCount(1, nodes);

	// Negative assertions
	nodes = this.xml.querySelectorAll("p.foo");
	this.assertEmpty(nodes);

	nodes = this.xml.querySelectorAll("foo.top");
	this.assertEmpty(nodes);

	nodes = this.xml.querySelectorAll("foo.bar");
	this.assertEmpty(nodes);

	nodes = this.xml.querySelectorAll("img.top.foo");
	this.assertEmpty(nodes);
};

/*
 * Tests the attribute selector
 */
CssTest.prototype.testAttributeNameSelector = function () {
	// Positive assertions
	var nodes = this.xml.querySelectorAll("[data-target]");
	this.assertCount(3, nodes);

	nodes = this.xml.querySelectorAll("[class]");
	this.assertCount(2, nodes);

	// Negative assertions
	nodes = this.xml.querySelectorAll("[foo]");
	this.assertEmpty(nodes);

	nodes = this.xml.querySelectorAll("[classe]");
	this.assertEmpty(nodes);

	nodes = this.xml.querySelectorAll("[eclass]");
	this.assertEmpty(nodes);
};

/*
 * Tests the attribute exact value selector [attr=value]
 */
CssTest.prototype.testAttributeExactValueSelector = function () {
	// Positive assertions
	var nodes = this.xml.querySelectorAll("[src=link]");
	this.assertCount(1, nodes);

	nodes = this.xml.querySelectorAll("[src=LINK i]");
	this.assertCount(1, nodes);

	var nodesAttr = this.xml.querySelectorAll("[id=title]");
	var nodesId = this.xml.querySelectorAll("#title");
	this.assertEquals(nodesAttr.length, nodesId.length);

	// Negative assertions
	nodes = this.xml.querySelectorAll("[src=linke]");
	this.assertEmpty(nodes);

	nodes = this.xml.querySelectorAll("[src=LINKE i]");
	this.assertEmpty(nodes);

	nodes = this.xml.querySelectorAll("[src=elink]");
	this.assertEmpty(nodes);

	nodes = this.xml.querySelectorAll("[src=ELINK i]");
	this.assertEmpty(nodes);
};

/*
 * Tests the attribute word list value selector [attr~=value]
 */
CssTest.prototype.testAttributeListValueSelector = function () {
	// Positive assertions
	var nodes = this.xml.querySelectorAll("[data-target~=page]");
	this.assertCount(1, nodes);

	nodes = this.xml.querySelectorAll("[data-target~=PAGE i]");
	this.assertCount(1, nodes);

	var nodesAttr = this.xml.querySelectorAll("[class~=top]");
	var nodesClass = this.xml.querySelectorAll(".top");
	this.assertEquals(nodesAttr.length, nodesClass.length);

	// Negative assertions
	nodes = this.xml.querySelectorAll("[src~=linke]");
	this.assertEmpty(nodes);

	nodes = this.xml.querySelectorAll("[src~=LINKE i]");
	this.assertEmpty(nodes);

	nodes = this.xml.querySelectorAll("[src~=elink]");
	this.assertEmpty(nodes);

	nodes = this.xml.querySelectorAll("[src~=ELINK i]");
	this.assertEmpty(nodes);
};

/*
 * Tests the attribute hyphen separated value selector [attr|=value]
 */
CssTest.prototype.testAttributeHyphenSeparatedValueSelector = function () {
	// Positive assertions
	var nodes = this.xml.querySelectorAll("[lang|=en]");
	this.assertCount(2, nodes);

	nodes = this.xml.querySelectorAll("[lang|=EN i]");
	this.assertCount(2, nodes);

	// Negative assertions
	nodes = this.xml.querySelectorAll("[lang|=fr]");
	this.assertEmpty(nodes);

	nodes = this.xml.querySelectorAll("[lang|=FR i]");
	this.assertEmpty(nodes);
};

/*
 * Tests the attribute prefixed value selector [attr^=value]
 */
CssTest.prototype.testAttributePrefixedValueSelector = function () {
	// Positive assertions
	var nodes = this.xml.querySelectorAll("[data-target^=O]");
	this.assertCount(2, nodes);

	nodes = this.xml.querySelectorAll("[data-target^=o i]");
	this.assertCount(2, nodes);

	// Negative assertions
	nodes = this.xml.querySelectorAll("[data-target^=F]");
	this.assertEmpty(nodes);

	nodes = this.xml.querySelectorAll("[data-target^=f i]");
	this.assertEmpty(nodes);
};

/*
 * Tests the attribute suffixed value selector [attr$=value]
 */
CssTest.prototype.testAttributePrefixedValueSelector = function () {
	// Positive assertions
	var nodes = this.xml.querySelectorAll("[data-target$=age]");
	this.assertCount(2, nodes);

	nodes = this.xml.querySelectorAll("[data-target$=AGE i]");
	this.assertCount(2, nodes);

	// Negative assertions
	nodes = this.xml.querySelectorAll("[data-target$=ape]");
	this.assertEmpty(nodes);

	nodes = this.xml.querySelectorAll("[data-target$=APE i]");
	this.assertEmpty(nodes);
};

/*
 * Tests the attribute contained value selector [attr*=value]
 */
CssTest.prototype.testAttributeContainedValueSelector = function () {
	// Positive assertions
	var nodes = this.xml.querySelectorAll("[data-target*=la]");
	this.assertCount(2, nodes);

	nodes = this.xml.querySelectorAll("[data-target*=LA i]");
	this.assertCount(2, nodes);

	// Negative assertions
	nodes = this.xml.querySelectorAll("[data-target*=fa]");
	this.assertEmpty(nodes);

	nodes = this.xml.querySelectorAll("[data-target*=FA i]");
	this.assertEmpty(nodes);
};

/*
 * Tests the nth-child pseudo class selector :nth-child(odd|even|an+b)
 */
CssTest.prototype.testPseudoClassNthChildSelector = function () {
	// Positive assertions
	var nodes = this.xml.querySelectorAll("li:nth-child(odd)");
	this.assertCount(4, nodes);

	nodes = this.xml.querySelectorAll("li:nth-child(even)");
	this.assertCount(5, nodes);

	nodes = this.xml.querySelectorAll("li:nth-child(3)");
	this.assertCount(1, nodes);
	this.assertEquals("2", nodes[0].value);

	nodes = this.xml.querySelectorAll("li:nth-child(n)");
	this.assertCount(9, nodes);

	nodes = this.xml.querySelectorAll("li:nth-child(2n)");
	this.assertCount(5, nodes);

	nodes = this.xml.querySelectorAll("li:nth-child(2n+1)");
	this.assertCount(4, nodes);

	nodes = this.xml.querySelectorAll("li:nth-child(3n)");
	this.assertCount(3, nodes);

	nodes = this.xml.querySelectorAll("li:nth-child(-n+3)");
	this.assertCount(2, nodes);
	this.assertEquals("1", nodes[0].value);
	this.assertEquals("2", nodes[1].value);

	// Negative assertions
	nodes = this.xml.querySelectorAll("li:nth-child(12)");
	this.assertEmpty(nodes);

	nodes = this.xml.querySelectorAll("li:nth-child(20n)");
	this.assertEmpty(nodes);

	nodes = this.xml.querySelectorAll("li:nth-child(5k+1)");
	this.assertEmpty(nodes);

	nodes = this.xml.querySelectorAll("li:nth-child(5+1)");
	this.assertEmpty(nodes);

	nodes = this.xml.querySelectorAll("li:nth-child()");
	this.assertEmpty(nodes);
};

/*
 * Tests the nth-last-child pseudo class selector :nth-last-child(odd|even|an+b)
 */
CssTest.prototype.testPseudoClassNthLastChildSelector = function () {
	// Positive assertions
	var nodes = this.xml.querySelectorAll("li:nth-last-child(odd)");
	this.assertCount(4, nodes);

	nodes = this.xml.querySelectorAll("li:nth-last-child(even)");
	this.assertCount(5, nodes);

	nodes = this.xml.querySelectorAll("li:nth-last-child(3)");
	this.assertCount(1, nodes);
	this.assertEquals("8", nodes[0].value);

	nodes = this.xml.querySelectorAll("li:nth-last-child(n)");
	this.assertCount(9, nodes);

	nodes = this.xml.querySelectorAll("li:nth-last-child(2n)");
	this.assertCount(5, nodes);

	nodes = this.xml.querySelectorAll("li:nth-last-child(2n+1)");
	this.assertCount(4, nodes);

	nodes = this.xml.querySelectorAll("li:nth-last-child(3n)");
	this.assertCount(3, nodes);

	nodes = this.xml.querySelectorAll("li:nth-last-child(-n+3)");
	this.assertCount(2, nodes);
	this.assertEquals("8", nodes[0].value);
	this.assertEquals("9", nodes[1].value);

	// Negative assertions
	nodes = this.xml.querySelectorAll("li:nth-last-child(13)");
	this.assertEmpty(nodes);

	nodes = this.xml.querySelectorAll("li:nth-last-child(40n)");
	this.assertEmpty(nodes);

	nodes = this.xml.querySelectorAll("li:nth-last-child(6p-5)");
	this.assertEmpty(nodes);

	nodes = this.xml.querySelectorAll("li:nth-last-child(2-1)");
	this.assertEmpty(nodes);

	nodes = this.xml.querySelectorAll("li:nth-last-child()");
	this.assertEmpty(nodes);
};

/*
 * Tests the first-child pseudo class selector :first-child
 */
CssTest.prototype.testPseudoClassFirstChildSelector = function () {
	// Positive assertions
	nodes = this.xml.querySelectorAll("h4:first-child");
	this.assertCount(1, nodes);

	// Negative assertions
	var nodes = this.xml.querySelectorAll("li:first-child");
	this.assertEmpty(nodes);
};

/*
 * Tests the last-child pseudo class selector :last-child
 */
CssTest.prototype.testPseudoClassLastChildSelector = function () {
	// Positive assertions
	nodes = this.xml.querySelectorAll("h3:last-child");
	this.assertCount(1, nodes);

	// Positive assertions
	var nodes = this.xml.querySelectorAll("li:last-child");
	this.assertEmpty(nodes);
};

/*
 * Tests the last-child pseudo class selector :last-child
 */
CssTest.prototype.testPseudoClassOnlyChildSelector = function () {
	// Positive assertions
	var nodes = this.xml.querySelectorAll("h3:only-child");
	this.assertCount(1, nodes);

	// Negative assertions
	nodes = this.xml.querySelectorAll("h4:only-child");
	this.assertEmpty(nodes);

	nodes = this.xml.querySelectorAll("li:only-child");
	this.assertEmpty(nodes);
};

/*
 * Tests the nth-of-type pseudo class selector :nth-of-type(odd|even|an+b)
 */
CssTest.prototype.testPseudoClassNthOfTypeSelector = function () {
	// Positive assertions
	var nodes = this.xml.querySelectorAll("li:nth-of-type(odd)");
	this.assertCount(5, nodes);

	nodes = this.xml.querySelectorAll("li:nth-of-type(even)");
	this.assertCount(4, nodes);

	nodes = this.xml.querySelectorAll("li:nth-of-type(3)");
	this.assertCount(1, nodes);
	this.assertEquals("3", nodes[0].value);

	nodes = this.xml.querySelectorAll("li:nth-of-type(n)");
	this.assertCount(9, nodes);

	nodes = this.xml.querySelectorAll("li:nth-of-type(2n)");
	this.assertCount(4, nodes);

	nodes = this.xml.querySelectorAll("li:nth-of-type(2n+1)");
	this.assertCount(5, nodes);

	nodes = this.xml.querySelectorAll("li:nth-of-type(3n)");
	this.assertCount(3, nodes);

	nodes = this.xml.querySelectorAll("li:nth-of-type(-n+3)");
	this.assertCount(3, nodes);
	this.assertEquals("1", nodes[0].value);
	this.assertEquals("3", nodes[2].value);

	// Negative assertions
	nodes = this.xml.querySelectorAll("li:nth-of-type(33)");
	this.assertEmpty(nodes);

	nodes = this.xml.querySelectorAll("li:nth-of-type(54n)");
	this.assertEmpty(nodes);

	nodes = this.xml.querySelectorAll("li:nth-of-type(9m-1)");
	this.assertEmpty(nodes);

	nodes = this.xml.querySelectorAll("li:nth-of-type(1+4)");
	this.assertEmpty(nodes);

	nodes = this.xml.querySelectorAll("li:nth-of-type()");
	this.assertEmpty(nodes);
};

/*
 * Tests the nth-last-of-type pseudo class selector :nth-last-of-type(odd|even|an+b)
 */
CssTest.prototype.testPseudoClassNthLastOfTypeSelector = function () {
	// Positive assertions
	var nodes = this.xml.querySelectorAll("li:nth-last-of-type(odd)");
	this.assertCount(5, nodes);

	nodes = this.xml.querySelectorAll("li:nth-last-of-type(even)");
	this.assertCount(4, nodes);

	nodes = this.xml.querySelectorAll("li:nth-last-of-type(3)");
	this.assertCount(1, nodes);
	this.assertEquals("7", nodes[0].value);

	nodes = this.xml.querySelectorAll("li:nth-last-of-type(n)");
	this.assertCount(9, nodes);

	nodes = this.xml.querySelectorAll("li:nth-last-of-type(2n)");
	this.assertCount(4, nodes);

	nodes = this.xml.querySelectorAll("li:nth-last-of-type(2n+1)");
	this.assertCount(5, nodes);

	nodes = this.xml.querySelectorAll("li:nth-last-of-type(3n)");
	this.assertCount(3, nodes);

	nodes = this.xml.querySelectorAll("li:nth-last-of-type(-n+3)");
	this.assertCount(3, nodes);
	this.assertEquals("7", nodes[0].value);
	this.assertEquals("9", nodes[2].value);

	// Negative assertions
	nodes = this.xml.querySelectorAll("li:nth-last-of-type(23)");
	this.assertEmpty(nodes);

	nodes = this.xml.querySelectorAll("li:nth-last-of-type(11n)");
	this.assertEmpty(nodes);

	nodes = this.xml.querySelectorAll("li:nth-last-of-type(9a-4)");
	this.assertEmpty(nodes);

	nodes = this.xml.querySelectorAll("li:nth-last-of-type(5+3)");
	this.assertEmpty(nodes);

	nodes = this.xml.querySelectorAll("li:nth-last-of-type()");
	this.assertEmpty(nodes);
};

/*
 * Tests the first-of-type pseudo class selector :first-of-type
 */
CssTest.prototype.testPseudoClassFirstOfTypeSelector = function () {
	// Positive assertions
	var nodes = this.xml.querySelectorAll("li:first-of-type");
	this.assertCount(1, nodes);
};

/*
 * Tests the last-of-type pseudo class selector :last-of-type
 */
CssTest.prototype.testPseudoClassLastOfTypeSelector = function () {
	// Positive assertions
	var nodes = this.xml.querySelectorAll("li:last-of-type");
	this.assertCount(1, nodes);
};

/*
 * Tests the last-of-type pseudo class selector :last-of-type
 */
CssTest.prototype.testPseudoClassOnlyOfTypeSelector = function () {
	// Positive assertions
	var nodes = this.xml.querySelectorAll("h3:only-of-type");
	this.assertCount(1, nodes);

	nodes = this.xml.querySelectorAll("h4:only-of-type");
	this.assertCount(1, nodes);

	// Negative assertions
	nodes = this.xml.querySelectorAll("li:only-child");
	this.assertEmpty(nodes);
};

/*
 * Tests the empty pseudo class selector :empty
 */
CssTest.prototype.testPseudoClassEmptySelector = function () {
	// Positive assertions
	var nodes = this.xml.querySelectorAll("h4:empty");
	this.assertCount(1, nodes);

	// Negative assertions
	nodes = this.xml.querySelectorAll("div:empty");
	this.assertEmpty(nodes);

	nodes = this.xml.querySelectorAll("h1:empty");
	this.assertEmpty(nodes);
};

/*
 * Tests the not pseudo class selector :not(selector)
 */
CssTest.prototype.testPseudoClassNotSelector = function () {
	// Positive assertions
	var nodes = this.xml.querySelectorAll(":not(*)");
	this.assertEmpty(nodes);

	var allNodes = this.xml.querySelectorAll("*");
	var notNodes = this.xml.querySelectorAll(":not(foo)");
	this.assertEquals(allNodes.length, notNodes.length);

	notNodes = this.xml.querySelectorAll(":not()");
	this.assertEquals(allNodes.length, notNodes.length);

	notNodes = this.xml.querySelectorAll(":not(li)");
	var liNodes = this.xml.querySelectorAll("li");
	this.assertEquals(allNodes.length - liNodes.length, notNodes.length);
};

/*
 * Tests the descendant combinator selector A B
 */
CssTest.prototype.testDescendantCombinatorSelector = function () {
	// Positive assertions
	var nodes = this.xml.querySelectorAll("ul li");
	this.assertCount(9, nodes);
	
	nodes = this.xml.querySelectorAll("html li");
	this.assertCount(9, nodes);
	
	// Negative assertions
	nodes = this.xml.querySelectorAll("li ul");
	this.assertEmpty(nodes);
};

/*
 * Tests the adjacent sibling combinator selector A + B
 */
CssTest.prototype.testAdjacentSiblingCombinatorSelector = function () {
	// Positive assertions
	var nodes = this.xml.querySelectorAll("li:first-of-type + li");
	this.assertCount(1, nodes);
	this.assertEquals("2", nodes[0].value);
	
	// Negative assertions
	nodes = this.xml.querySelectorAll("h3 + *");
	this.assertEmpty(nodes);
	
	nodes = this.xml.querySelectorAll("li:last-of-type + li");
	this.assertEmpty(nodes);
};

/*
 * Tests the general sibling combinator selector A ~ B
 */
CssTest.prototype.testGeneralSiblingCombinatorSelector = function () {
	// Positive assertions
	var nodes = this.xml.querySelectorAll("li:first-of-type ~ li");
	this.assertCount(8, nodes);
	
	nodes = this.xml.querySelectorAll("li:nth-of-type(5) ~ li");
	this.assertCount(4, nodes);
	
	// Negative assertions
	nodes = this.xml.querySelectorAll("h3 ~ *");
	this.assertEmpty(nodes);
};

/*
 * Tests the child combinator selector A > B
 */
CssTest.prototype.testChildCombinatorSelector = function () {
	// Positive assertions
	var nodes = this.xml.querySelectorAll("ul > li");
	this.assertCount(9, nodes);
	
	// Negative assertions
	nodes = this.xml.querySelectorAll("html > li");
	this.assertEmpty(nodes);
	
	nodes = this.xml.querySelectorAll("li > ul");
	this.assertEmpty(nodes);
};

/*
 * Tests the comma separator selector A , B
 */
CssTest.prototype.testChildCombinatorSelector = function () {
	var nodes = this.xml.querySelectorAll("h3, h4");
	this.assertCount(2, nodes);
	
	nodes = this.xml.querySelectorAll("h3, foo");
	this.assertCount(1, nodes);
	
	nodes = this.xml.querySelectorAll("ul, li");
	this.assertCount(10, nodes);
};