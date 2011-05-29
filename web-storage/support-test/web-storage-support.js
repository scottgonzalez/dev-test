(function( $ ) {

/* userData is not tested for two reasons:
 * 1) There doesn't appear to be any way to clear userData (can't detect what
 * data already exists).
 * 2) Microsoft publicly documents the limits.
 */

var storage = {
	localStorage: {
		setup: function( done ) {
			try {
				if ( !localStorage.getItem ) {
					return done( false );
				}
			} catch ( e ) {
				return done( false );
			}
			localStorage.clear();
			return done( true );
		},
		run: function( key, value ) {
			localStorage.setItem( key, value );
		},
		teardown: function( done ) {
			localStorage.clear();
			done();
		}
	},

	sessionStorage: {
		setup: function( done ) {
			try {
				if ( !sessionStorage.getItem ) {
					return done( false );
				}
			} catch ( e ) {
				return done( false );
			}
			sessionStorage.clear();
			return done( true );
		},
		run: function( key, value ) {
			sessionStorage.setItem( key, value );
		},
		teardown: function( done ) {
			sessionStorage.clear();
			done();
		}
	},

	globalStorage: (function() {
		function clear( done ) {
			var key,
				store = globalStorage[ location.hostname ];

			function iterate() {
				try {
					// throws when there are no keys
					key = store.key( 0 );
					store.removeItem( key );
				} catch( error ) {
					return done();
				}
				setTimeout( iterate, 1 );
			}
			iterate();
		}

		return {
			setup: function( done ) {
				try {
					if ( !globalStorage[ location.hostname ].getItem ) {
						return done( false );
					}
				} catch ( error ) {
					return done( false );
				}
				clear(function() {
					done( true );
				});
			},
			run: function( key, value ) {
				globalStorage[ location.hostname ].setItem( key, value );
			},
			teardown: function( done ) {
				clear( done );
			}
		};
	}())
};

window.app = {
	packet: new Array( 1025 ).join( "a" ), // 1 KB
	maxPackets: 1024 * 10, // 20 MB
	storageTypes: [],

	test: function( type, complete, step ) {
		storage[ type ].setup(function( hasSupport ) {
			if ( hasSupport ) {
				iterate( 0 );
			} else {
				complete( false );
			}
		});

		function done( status ) {
			storage[ type ].teardown(function() {
				complete( status );
			});
		}

		function iterate( index ) {
			step( index );
			try {
				storage[ type ].run( index, app.packet );
			} catch ( error ) {
				done( index );
				return;
			}

			if ( index < app.maxPackets ) {
				setTimeout(function() {
					iterate( index + 1 );
				}, 1 );
			} else {
				done( true );
			}
		}
	},

	browserscope: new BrowserScope( APP_CONFIG.testKey, APP_CONFIG.sandboxId )
};

$.each( storage, function( type ) {
	app.storageTypes.push( type );
});

}( jQuery ) );
