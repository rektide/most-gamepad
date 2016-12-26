"use strict"

var
  defaulter= require( "defaulter"),
  Defer= require( "p-defer"),
  MostClockMultiplier= require( "most-clock-multiplier"),
  MostRAF= require( "most-raf")

function MostGamepad( options){
	var
	  tick= options.tick|| defaults.tick,
	  gamepads= [],
	  waits= []

	var gamepadsCreated= MostCreate(function( add, end, error){
		addGamepad= add
		tick.subscribe( poll)
	})

	function poll(){
		var _gamepads= navigator.getGampads()
		for( var i= 0; i< gamepads.length; ++i){
			var gamepad= _gamepads[ i]
			if( !gamepad){
				continue
			}
			var ctx= gamepads[ i]
			if( !ctx){
				ctx= createGamepad( gamepad)
			}
			if( !gamepad.connected&& ctx.connected){
				// gamepad went away
				ctx.error( gamepad)
				ctx.connected= false
			}else{
				ctx.add( gamepad)
				ctx.connected= gamepad.connected
			}
		}
	}

	function createGamepad( gamepad){
		if( ctx[ gamepad.index]){
			return ctx[ gamepad.index]
		}
		var ctx= gamepads[ gamepad.index]= {
			add: null,
			error: null,
			connected: gamepad.connected,
			resolved: Promise.resolve( ctx)
		}
		ctx.stream= MostCreate(function( add, end, event){
			ctx.add= add
			ctx.error= error
		})
		var wait= wait[ gamepad.index]
		if( wait){
			wait.resolve( ctx.stream)
		}
		return ctx
	}

	function get( index){
		var existing= gamepads[ index]
		if( existing){
			return existing.resolved
		}
		var wait= waits[ index]
		if( !wait){
			wait= waits[ index]= defer()
		}
		return wait.promise
	}

	return request
}


exports= module.exports
var defaults= module.exports.defaults= {
	multiplier: 2
}
defaulter(function(){
	return MostRAF()
}, defaults, "raf")
defaulter(function(){
	if( multiplier> 1){
		return MostClockMultiplier( defaults.tick, defaults.multiplier)
	}
	return defaults.tick
}, defaults, "tick")

