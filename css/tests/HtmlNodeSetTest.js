include('/opt/AlbScriptUnit/Framework/TestCase.js');
load('inc/sources/css.js');


function HtmlNodeSetTest() {
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

	this.document = new amiDocument();
	this.document.source = this.source;

}
HtmlNodeSetTest.prototype = TestCase.prototype;
HtmlNodeSetTest.prototype.constructor = HtmlNodeSetTest;

/*
 * Tests the fast the CSS selectors
 */
HtmlNodeSetTest.prototype.testCssSelector = function () {
	//It uses normally the same methods than the querySelectorAll already tests
	//in the CssTests class so no need to add lots of assertions

	var set = this.document.$("*");
	this.assertEquals(24, set.count());

	set = this.document.$("li:nth-of-type(8)");
	this.assertEquals("8", set.text());

	set = this.document.$('li["data-target*=la]');
	this.assertEquals(2, set.count());
};

/*
 * Tests the parent selector
 */
HtmlNodeSetTest.prototype.testParentSelector = function () {
	// Positive assertions
	var set = this.document.$("li").parent();
	this.assertEquals(1, set.count());
	this.assertEquals("ul", set.nodes[0].xml.name);

	set = this.document.$("h3, h4").parent();
	this.assertEquals(2, set.count());

	set = this.document.$("h3, h4").parent("[content]");
	this.assertEquals(1, set.count());

	// Negative assertions
	set = this.document.$("html").parent();
	this.assertEquals(0, set.count());

	set = this.document.$("foo").parent();
	this.assertEquals(0, set.count());
};

/*
 * Tests the parents selector
 */
HtmlNodeSetTest.prototype.testParentsSelector = function () {
	// Positive assertions
	var set = this.document.$("li").parents();
	this.assertEquals(3, set.count());

	set = this.document.$("h3, h4").parents();
	this.assertEquals(4, set.count());

	set = this.document.$("h3, h4").parents("div, html");
	this.assertEquals(3, set.count());

	// Negative assertions
	set = this.document.$("html").parents();
	this.assertEquals(0, set.count());

	set = this.document.$("foo").parent();
	this.assertEquals(0, set.count());
};

/*
 * Tests the parentsUntil selector
 */
HtmlNodeSetTest.prototype.testParentsUntilSelector = function () {
	// Positive assertions
	var set = this.document.$("li").parents();
	this.assertEquals(3, set.count());

	set = this.document.$("h3, h4").parents();
	this.assertEquals(4, set.count());

	set = this.document.$("h3, h4").parents("div, html");
	this.assertEquals(3, set.count());

	// Negative assertions
	set = this.document.$("html").parents();
	this.assertEquals(0, set.count());

	set = this.document.$("foo").parent();
	this.assertEquals(0, set.count());
};