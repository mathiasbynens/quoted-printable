(function(root) {
	'use strict';

	var noop = Function.prototype;

	var load = (typeof require == 'function' && !(root.define && define.amd)) ?
		require :
		(!root.document && root.java && root.load) || noop;

	var QUnit = (function() {
		return root.QUnit || (
			root.addEventListener || (root.addEventListener = noop),
			root.setTimeout || (root.setTimeout = noop),
			root.QUnit = load('../node_modules/qunitjs/qunit/qunit.js') || root.QUnit,
			addEventListener === noop && delete root.addEventListener,
			root.QUnit
		);
	}());

	var qe = load('../node_modules/qunit-extras/qunit-extras.js');
	if (qe) {
		qe.runInContext(root);
	}

	// The `quotedPrintable` object to test
	var quotedPrintable = root.quotedPrintable || (root.quotedPrintable = (
		quotedPrintable = load('../quoted-printable.js') || root.quotedPrintable,
		quotedPrintable = quotedPrintable.quotedPrintable || quotedPrintable
	));

	// The `utf8` object to be used in tests
	var utf8 = root.utf8 || (root.utf8 = (
		utf8 = load('../node_modules/utf8/utf8.js') || root.utf8,
		utf8 = utf8.utf8 || utf8
	));

	/*--------------------------------------------------------------------------*/

	// `throws` is a reserved word in ES3; alias it to avoid errors
	var raises = QUnit.assert['throws'];

	// explicitly call `QUnit.module()` instead of `module()`
	// in case we are in a CLI environment
	QUnit.module('quotedPrintable');

	test('quotedPrintable.encode', function() {
		equal(
			quotedPrintable.encode('If you believe that truth=beauty, then surely mathematics is the most beautiful branch of philosophy.'),
			'If you believe that truth=3Dbeauty, then surely mathematics is the most bea=\r\nutiful branch of philosophy.',
			'Equals sign'
		);
		equal(
			quotedPrintable.encode('Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming id quod mazim placerat facer possim assum. Typi non habent claritatem insitam; est usus legentis in iis qui facit eorum claritatem. Investigationes demonstraverunt lectores legere me lius quod ii legunt saepius. Claritas est etiam processus dynamicus, qui sequitur mutationem consuetudium lectorum. Mirum est notare quam littera gothica, quam nunc putamus parum claram, anteposuerit litterarum formas humanitatis per seacula quarta decima et quinta decima. Eodem modo typi, qui nunc nobis videntur parum clari, fiant sollemnes in futurum.'),
			'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy =\r\nnibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wi=\r\nsi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lo=\r\nbortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure d=\r\nolor in hendrerit in vulputate velit esse molestie consequat, vel illum dol=\r\nore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio digni=\r\nssim qui blandit praesent luptatum zzril delenit augue duis dolore te feuga=\r\nit nulla facilisi. Nam liber tempor cum soluta nobis eleifend option congue=\r\n nihil imperdiet doming id quod mazim placerat facer possim assum. Typi non=\r\n habent claritatem insitam; est usus legentis in iis qui facit eorum clarit=\r\natem. Investigationes demonstraverunt lectores legere me lius quod ii legun=\r\nt saepius. Claritas est etiam processus dynamicus, qui sequitur mutationem =\r\nconsuetudium lectorum. Mirum est notare quam littera gothica, quam nunc put=\r\namus parum claram, anteposuerit litterarum formas humanitatis per seacula q=\r\nuarta decima et quinta decima. Eodem modo typi, qui nunc nobis videntur par=\r\num clari, fiant sollemnes in futurum.',
			'76-char line limit'
		);
		equal(
			quotedPrintable.encode('foo '),
			'foo=20',
			'Trailing space'
		);
		equal(
			quotedPrintable.encode('foo\t'),
			'foo=09',
			'Trailing tab'
		);
		equal(
			quotedPrintable.encode('foo\r\nbar'),
			'foo=0D=0Abar',
			'CRLF'
		);
		equal(
			quotedPrintable.encode('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx='),
			'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx=3D',
			'Exactly 73 chars of which the last one is `=`'
		);
		equal(
			quotedPrintable.encode('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx='),
			'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx=\r\n=3D',
			'Exactly 74 chars of which the last one is `=`'
		);
		equal(
			quotedPrintable.encode('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx='),
			'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx=\r\n=3D',
			'Exactly 75 chars of which the last one is `=`'
		);
		equal(
			quotedPrintable.encode('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx='),
			'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx=\r\n=3D',
			'Exactly 76 chars of which the last one is `=`'
		);
		equal(
			quotedPrintable.encode('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx='),
			'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx=\r\nx=3D',
			'Exactly 77 chars of which the last one is `=`'
		);
		equal(
			quotedPrintable.encode('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx '),
			'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx=20',
			'Exactly 73 chars of which the last one is a space'
		);
		equal(
			quotedPrintable.encode('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx '),
			'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx=20',
			'Exactly 74 chars of which the last one is a space'
		);
		equal(
			quotedPrintable.encode('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx '),
			'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx=\r\n=20',
			'Exactly 75 chars of which the last one is a space'
		);
		equal(
			quotedPrintable.encode('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx '),
			'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx=\r\n=20',
			'Exactly 76 chars of which the last one is a space'
		);
		equal(
			quotedPrintable.encode('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx '),
			'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx=\r\nx=20',
			'Exactly 77 chars of which the last one is a space'
		);
		equal(
			quotedPrintable.encode(utf8.encode('fooI\xF1t\xEBrn\xE2ti\xF4n\xE0liz\xE6ti\xF8n\u2603\uD83D\uDCA9bar')),
			'fooI=C3=B1t=C3=ABrn=C3=A2ti=C3=B4n=C3=A0liz=C3=A6ti=C3=B8n=E2=98=83=F0=9F=\r\n=92=A9bar',
			'UTF-8 can be used for non-ASCII symbols'
		);
		raises(
			function() {
				// Note: “forgot” to UTF-8-encode first
				quotedPrintable.encode('fooI\xF1t\xEBrn\xE2ti\xF4n\xE0liz\xE6ti\xF8n\u2603\uD83D\uDCA9bar')
			},
			RangeError,
			'Invalid input (input must be character-encoded into octets using any encoding)'
		);
	});

	test('quotedPrintable.decode', function() {
		equal(
			quotedPrintable.decode('If you believe that truth=3Dbeauty, then surely =\r\nmathematics is the most beautiful branch of philosophy.'),
			'If you believe that truth=beauty, then surely mathematics is the most beautiful branch of philosophy.',
			'Equals sign'
		);
		equal(
			quotedPrintable.decode('If you believe that truth=3Dbeauty, then surely mathematics is the most bea=\r\nutiful branch of philosophy.'),
			'If you believe that truth=beauty, then surely mathematics is the most beautiful branch of philosophy.',
			'Equals sign'
		);
		equal(
			quotedPrintable.decode('foo\nbar'),
			'foo\nbar',
			'Hard new line characters'
		);
		equal(
			quotedPrintable.decode('foo\r\nbar='),
			'foo\r\nbar',
			'Trailing ='
		);
		equal(
			quotedPrintable.decode('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx=\r\nxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx=\r\nxx'),
			'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
			'76 * 2 characters'
		);
		equal(
			quotedPrintable.decode('Now\'s the time =\r\nfor all folk to come=\r\n to the aid of their country.'),
			'Now\'s the time for all folk to come to the aid of their country.',
			'Soft line break example from the RFC'
		);
		equal(
			utf8.decode(quotedPrintable.decode('fooI=C3=B1t=C3=ABrn=C3=A2ti=C3=B4n=C3=A0liz=C3=A6ti=C3=B8n=E2=98=83=F0=9F=\r\n=92=A9bar')),
			'fooI\xF1t\xEBrn\xE2ti\xF4n\xE0liz\xE6ti\xF8n\u2603\uD83D\uDCA9bar',
			'UTF-8 can be used for non-ASCII symbols'
		);
	});

	/*--------------------------------------------------------------------------*/

	// configure QUnit and call `QUnit.start()` for
	// Narwhal, Node.js, PhantomJS, Rhino, and RingoJS
	if (!root.document || root.phantom) {
		QUnit.config.noglobals = true;
		QUnit.start();
	}
}(typeof global == 'object' && global || this));
