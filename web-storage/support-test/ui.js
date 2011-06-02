(function( app, $ ) {

function test( type, complete ) {
	var log = $( "<div>" ).appendTo( "#tests" ),
		progressbar = $( "<div>" )
			.progressbar({
				max: app.maxPackets
			})
			.appendTo( "#tests" );

	function done( status ) {
		if ( status === false ) {
			log.text( type + ": not supported" );
		} else if ( status === true ) {
			log.text( type + ": unlimited storage" );
		} else {
			log.text( type + ": limited to " + status + " KB" );
		}
		complete( status );
	}

	function step( index ) {
		log.text( type + ": " + index + " KB" );
		progressbar.progressbar( "option", "value", index );
	}

	log.text( type + ": initializing..." );
	app.test( type, done, step );
};

function runTests() {
	var results = {};

	function done() {
		app.browserscope.storeResults( results, function() {
			$( "<p>Your results have been saved.</p>" ).dialog({
				title: "Thank You",
				resizable: false
			});
		});
	}

	function iterate( index ) {
		if ( index === app.storageTypes.length ) {
			done();
			return;
		}

		test( app.storageTypes[ index ], function( status ) {
			// convert booleans to numbers for BrowserScope
			if ( status === false ) {
				status = 0;
			}
			if ( status === true ) {
				status = app.maxPackets;
			}
			results[ app.storageTypes[ index ] ] = status;
			iterate( index + 1 );
		});
	}
	iterate( 0 );
}

function renderResults() {
	function formatNumber( num ) {

		var label = "KB";
		if ( num > 1024 ) {
			num /= 1024;
			label = "MB";
		}
		num = Math.floor( num * 100 ) / 100;

		return num + " " + label;
	}

	app.browserscope.getResults( BrowserScope.browsers.minor, function( data ) {
		var table = $( $( "#test-results" ).html() ),
			tbody = table.find( "tbody" );
		$.each( data, function( browser, limits ) {
			var html = "<tr><td>" + browser + "</td>" +
			$.map( app.storageTypes, function( storageType ) {
				var limit = parseInt( limits[ storageType ].replace( ",", "" ), 10 ) || 0;
				if ( !limit ) {
					return "<td class='none'>none</td>";
				}
				if ( limit === app.maxPackets ) {
					return "<td class='unlimited'>unlimited</td>";
				}
				return "<td class='limited'>" + formatNumber( limit ) + "</td>";
			}).join( "" ) + "</tr>";
			tbody.append( html );
		});
		$( "#test-results" ).replaceWith( table );
	});
}

$(function() {
	$( "#run-tests" )
		.button()
		.one( "click", runTests );

	renderResults();
});

}( app, jQuery ) );
