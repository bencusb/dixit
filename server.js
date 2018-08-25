var http = require('http');
var express = require('express');
var fs = require('fs');
var server = new express();
var port = 8080;
var file = fs.readFileSync('public/cards.json', "utf8");

var game_state = 
{
	started : false,
	tick_num: 0,
	users: {}
};

server.use('/', express.static('public'));
setInterval(on_tick, 3000);


game_state.cards = JSON.parse(file);

shuffle(game_state.cards.dix1);

function shuffle(a)
{
    var j, x, i;	
    for (i = a.length - 1; i > 0; i--)
	{
		j = Math.floor(Math.random() * (i + 1));
		x = a[i];
		a[i] = a[j];
		a[j] = x;
	}
    return a;
}

function on_join(req, res)
{
	var name = req.query.username;
	
	console.log("request recived");
	console.log(name);
	console.log(game_state.users);
	
	if(name in game_state.users)
	{
		res.send(name + " has been already registered.");	
	}
	else
	{
		res.send(name + " has been registered.");
		game_state.users[name] = {}		
	}
	//	values.usernames = name;
	//	res.writeHead(200, {'Content-Type': 'text/plain'});
	//	res.write(req.url);
	//	res.end();
}

function on_start(req, res)
{
	game_state.started = true;
	console.log("a game has started");
	res.send("game has started");
	var value = game_state.users;
	
	for (var key in game_state.users)
	{
		game_state.users[key].cards = game_state.cards.dix1.splice(0,6);
	}
}
	
function on_tick()
{	
	game_state.tick_num++;
	//console.log(game_state);

		var value = game_state.users;
		for (var key in game_state.users)
		{
			if(game_state.users[key].last_tick < game_state.tick_num - 20)
			{
				console.log("Deleting user: " + game_state.users[key]);				
				// TODO:
				// 1. a user kezebol a kartyakat visszatenni a pakliba
				// 2. user torlese a listabol (splice)
			}
		}
		
}

function on_beat(req, res)
{
	console.log("on_beat() called");
	var name = req.query.username;	
	if(name in game_state.users)
	{		
		game_state.users[name].last_tick = game_state.tick_num;
	}
	res.send(game_state);
}

server.get('/tick' , on_beat);
server.get('/join', on_join);
server.get('/start', on_start);

server.listen(port);
console.log("server is listening on port " + port +"...");