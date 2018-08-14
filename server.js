var http = require('http');
var express = require('express');
var fs = require('fs');
var server = new express();
var port = 8080;

var game_state = 
{
  tick_num: 0,
  users: {}
};

server.use('/', express.static('public'));
setInterval(on_tick, 3000);

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

function on_tick()
{
	var file = fs.readFileSync('public/cards.txt', "utf8");
	console.log(file);
	
	game_state.tick_num++;
	console.log(game_state);

		var value = game_state.users;
		for (var key in game_state.users)
		{
			if(game_state.users[key].last_tick < game_state.tick_num - 20)
			{
				console.log("Deleting user: " + game_state.users[key]);
				delete game_state.users[key];
			}
		}
		
}

function on_beat(req, res)
{
	console.log("Beat");
	var name = req.query.username;
	
	if(name in game_state.users)
	{		
		game_state.users[name].last_tick = game_state.tick_num;				
	}
	else
	{
		console.log("beat_error " + name)
	}
	res.send("ok");
}

server.get('/tick' , on_beat);
server.get('/join', on_join);

server.listen(port);
console.log("server is running on " + port +"...");