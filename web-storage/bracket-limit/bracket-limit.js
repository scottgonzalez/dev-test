window.onload = function() {

var packet = new Array( 1025 ).join( "a" ),
	maxPackets = 1024 * 6, // 6 MB (should hit limit around 4.8 MB)
	output = document.getElementById( "output" );

var tests = [
	function( done ) {
		var button = document.createElement( "button" );
		button.innerHTML = "start test";
		button.onclick = done;
		output.appendChild( button );
	},
	function( done ) {
		function iterate( index ) {
			output.innerHTML = index + " KB";

			try {
				localStorage[ "a" + index ] = packet;
			} catch( error ) {
				output.innerHTML = "an error occurred at " + index + " KB. " +
					"Your browser does not suffer from the problem being tested.";
				return;
			}

			if ( index < maxPackets ) {
				setTimeout(function() {
					iterate( index + 1 );
				}, 1 );
			} else {
				done();
			}
		}
		iterate( 0 );
	},
	function() {
		output.innerHTML =
			"<p>first value: " + localStorage[ "a0" ] + "</p>" +
			"<p>last value: " + localStorage[ "a" + (maxPackets - 1) ] + "</p>";
	}
];

var step = parseInt( location.search.slice( 1 ), 10 ) || 0,
	finalStep = tests.length - 1;

tests[ step ](function() {
	if ( step < finalStep ) {
		location.replace( location.pathname + "?" + (step + 1) );
	}
});

};
