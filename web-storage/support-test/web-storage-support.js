(function( $ ) {

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

	sessionStorage: (function() {
		// support for old versions of Firefox that don't have sessionStorage.clear()
		function clear( done ) {
			function iterate() {
				try {
					// throws when there are no keys
					var key = sessionStorage.key( 0 );
					sessionStorage.removeItem( key );
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
					if ( !sessionStorage.getItem ) {
						return done( false );
					}
				} catch ( e ) {
					return done( false );
				}
				try {
					sessionStorage.clear();
					return done( true );
				} catch( error ) {
					clear(function() {
						done( true );
					});
				}
			},
			run: function( key, value ) {
				sessionStorage.setItem( key, value );
			},
			teardown: function( done ) {
				try {
					sessionStorage.clear();
					return done();
				} catch( error ) {
					clear( done );
				}
			}
		}
	}()),

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
	packet: new Array( 1025 ).join( "a" ), // 1 k
	maxPackets: 1024 * 10, // 20 M
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
