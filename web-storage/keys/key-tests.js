(function() {

var testResults = sessionStorage.getItem( "localStorageKeys" );
if ( testResults ) {
	testResults = JSON.parse( testResults );
}

var tests = [
	function() {
		testResults = {};
		localStorage.clear();
		localStorage[ 1 ] = "test";
		testResults[ "numeric-bracket-bracket-immediate" ] = localStorage[ 1 ] === "test";
		testResults[ "numeric-bracket-method-immediate" ] = localStorage.getItem( 1 ) === "test";
	},
	function() {
		testResults[ "numeric-bracket-bracket-persist" ] = localStorage[ 1 ] === "test";
		testResults[ "numeric-bracket-method-persist" ] = localStorage.getItem( 1 ) === "test";
	},
	function() {
		localStorage.clear();
		localStorage.setItem( 1, "test" );
		testResults[ "numeric-method-bracket-immediate" ] = localStorage[ 1 ] === "test";
		testResults[ "numeric-method-method-immediate" ] = localStorage.getItem( 1 ) === "test";
	},
	function() {
		testResults[ "numeric-method-bracket-persist" ] = localStorage[ 1 ] === "test";
		testResults[ "numeric-method-method-persist" ] = localStorage.getItem( 1 ) === "test";
	},
	function() {
		localStorage.clear();
		localStorage[ "a" ] = "test";
		testResults[ "string-bracket-bracket-immediate" ] = localStorage[ "a" ] === "test";
		testResults[ "string-bracket-method-immediate" ] = localStorage.getItem( "a" ) === "test";
	},
	function() {
		testResults[ "string-bracket-bracket-persist" ] = localStorage[ "a" ] === "test";
		testResults[ "string-bracket-method-persist" ] = localStorage.getItem( "a" ) === "test";
	},
	function() {
		localStorage.clear();
		localStorage.setItem( "a", "test" );
		testResults[ "string-method-bracket-immediate" ] = localStorage[ "a" ] === "test";
		testResults[ "string-method-method-immediate" ] = localStorage.getItem( "a" ) === "test";
	},
	function() {
		testResults[ "string-method-bracket-persist" ] = localStorage[ "a" ] === "test";
		testResults[ "string-method-method-persist" ] = localStorage.getItem( "a" ) === "test";
	},
	function() {
		localStorage.clear();
		localStorage[ "" ] = "test";
		testResults[ "empty-bracket-bracket-immediate" ] = localStorage[ "" ] === "test";
		testResults[ "empty-bracket-method-immediate" ] = localStorage.getItem( "" ) === "test";
	},
	function() {
		testResults[ "empty-bracket-bracket-persist" ] = localStorage[ "" ] === "test";
		testResults[ "empty-bracket-method-persist" ] = localStorage.getItem( "" ) === "test";
	},
	function() {
		localStorage.clear();
		localStorage.setItem( "", "test" );
		testResults[ "empty-method-bracket-immediate" ] = localStorage[ "" ] === "test";
		testResults[ "empty-method-method-immediate" ] = localStorage.getItem( "" ) === "test";
	},
	function() {
		testResults[ "empty-method-bracket-persist" ] = localStorage[ "" ] === "test";
		testResults[ "empty-method-method-persist" ] = localStorage.getItem( "" ) === "test";
	},
	function() {
		var desc, prop, status,
			output = "";
		
		for ( prop in testResults ) {
			status = testResults[ prop ] ? "pass" : "fail",
			desc = prop.split( "-" );
			output += "<p class='" + status + "'>" +
				desc[ 0 ] + " index; " +
				"set via " + desc[ 1 ] + "; " +
				"get via " + desc[ 2 ] + " " +
				"(" + desc[ 3 ] + "): " +
				status + "</p>";
		}
		window.onload = function() {
			document.body.innerHTML = output;
		};
	}
];

var step = parseInt( location.search.slice( 1 ), 10 ) || 0,
	finalStep = tests.length - 1;

function errorHandler( error ) {
	alert( "An error occurred and the tests did not finish" );
	tests[ finalStep ]();
	throw error;
}

try {
	tests[ step ]();
} catch ( error ) {
	errorHandler( error );
}

if ( step < finalStep ) {
	sessionStorage.setItem( "localStorageKeys", JSON.stringify( testResults ) );
	location.replace( location.pathname + "?" + (step + 1) );
}

}());
