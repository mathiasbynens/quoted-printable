var utf8 = require('utf8');
var jsesc = require('jsesc');
require('string.fromcodepoint');

// We need a regular expression that matches the sets of UTF-8-encoded octets
// for lone surrogates, and nothing else. For example, the lone surrogate U+D800
// (the lowest high surrogate code point) encodes to `=ED=A0=80`, and D+FFFF
// (the highest low surrogate code point) encodes to `=ED=BF=BF`. Based on that,
// it’s easy to come up with the following regular expression:
var regex = /^=ED=[AB][0-9A-F]=[89AB][0-9A-F]$/i;

// Let’s prove that this regular expression only matches lone surrogates, and
// nothing else by testing it out on every single Unicode code point.
var min = 0x000000;
var max = 0x10FFFF;
var current = min - 1;
while (++current <= max) {
	var symbol = String.fromCodePoint(current);
	var tmp = jsesc(utf8.encode(symbol)).replace(/\\x/g, '=');
	var isMatch = regex.test(tmp);
	if (current < 0xD800 || current > 0xDFFF) {
		// It’s not a surrogate. Check if the regular expression does not match.
		if (isMatch) {
			console.log('Should not match, but matches for', current.toString(16));
		}
	} else {
		// It’s a surrogate. Check if the regular expression matches.
		if (!isMatch) {
			console.log('Should match, but doesn’t match for', current.toString(16));
		}
	}
}
