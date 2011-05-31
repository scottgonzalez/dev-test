(function( $ ) {

var baseUrl = "http://www.browserscope.org/user";

var BrowserScope = window.BrowserScope = function( testKey, sandboxId ) {
	this.testKey = testKey;
	this.sandboxId = sandboxId;
};

BrowserScope.browsers = {
	top: 0,
	families: 1,
	minor: 2,
	all: 3
};

$.extend( BrowserScope.prototype, {
	browsersDefault: BrowserScope.browsers.families,

	_resultsUrl: function( format, browsers ) {
		return baseUrl + "/tests/table/" + this.testKey +
			"?o=" + format + "&v=" + (browsers || this.browsersDefault);
	},

	_beaconUrl: function( varName, callbackName ) {
		var url = baseUrl + "/beacon/" + this.testKey +
			"?test_results_var=" + varName;
		if ( callbackName ) {
			url += "&callback=" + callbackName;
		}
		if ( this.sandboxId ) {
			url += "&sandboxId=" + this.sandboxId;
		}
		return url;
	},

	renderResults: function( browsers ) {
		browsers = browsers || this.browsersDefault;
		$.getScript( this._resultsUrl( "js", browsers ) );
	},

	getResults: function( browsers, fn ) {
		if ( !fn ) {
			fn = browsers;
			browsers = undefined;
		}

		$.ajax({
			url: this._resultsUrl( "json", browsers ),
			dataType: "jsonp",
			success: function( data ) {
				var results = {};
				$.each( data.results, function( browser, browserDetails ) {
					results[ browser ] = {};
					$.each( browserDetails.results, function( testName, testDetails ) {
						results[ browser ][ testName ] = testDetails.result;
					});
				});
				fn( results );
			}
		});
	},

	storeResults: function( results, fn ) {
		var fnName,
			name = "_bTestResults" + $.now();
		window[ name ] = results;
		if ( fn ) {
			fnName = "_bCallback" + $.now();
			window[ fnName ] = function() {
				fn();

				// IE throws an error when trying to delete
				window[ fnName ] = undefined;
				try {
					delete window[ fnName ];
				} catch( error ) {}
			};
		}
		$.getScript( this._beaconUrl( name, fnName ) );
	}
});

}( jQuery ) );
