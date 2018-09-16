var http = require('http');
var express = require('express');
var fs = require('fs');
var server = new express();
var port = 8080;

var game_state = 
{
	state: "init",
	cards: [],
	tick_num: 0,
	users: {},
	users_in_playing_order: [],
	story: "",
	story_teller_ind: 0,
	cards_in_play: [],
	votes: 0
};

server.use('/', express.static('public'));
setInterval(on_tick, 3000);

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
		// TODO: error
	}
	else
	{
		game_state.users[name] = {score: 0}
		game_state.users_in_playing_order.push(name);
		res.send(game_state);
	}
}

function on_start(req, res)
{	
    // read cards
    var file = fs.readFileSync('public/cards.json', "utf8");
    game_state.cards = JSON.parse(file);
		
	// shuffle all cards
	shuffle(game_state.cards.dix1);		
	
	// push 6 random cards to each user
	game_state.users_in_playing_order = [];
	for (var user in game_state.users)
	{
		game_state.users[user].cards = game_state.cards.dix1.splice(0,6);
		game_state.users[user].played_card = null;
		game_state.users[user].vote = null;
		game_state.users_in_playing_order.push(user);
	}	
	
	// shuffle users
	shuffle(game_state.users_in_playing_order);
	game_state.story_teller_ind = 0;

    // remove used cards
	game_state.cards_in_play = [];	
	game_state.votes = 0;
	
	game_state.state = "wait_for_story";
	console.log("a game has started");
	res.send(game_state);
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

function on_set_story(req, res)
{
	console.log("on_set_story() called");
	game_state.story = req.query.story;	
	game_state.state = "wait_for_response_cards";
	res.send(game_state);
}

function on_place_card(req, res)
{
	console.log("on_place_card() called");
	
	var user = game_state.users[req.query.username];	
	if( user.played_card == null )
	{
		card = user.cards.splice(req.query.card_ind,1)[0];
		game_state.cards_in_play.push(card);
		user.played_card = card;
		
		if(game_state.cards_in_play.length == Object.keys(game_state.users).length)
		{
			// evrybody placed the card
			shuffle(game_state.cards_in_play);
			game_state.state = "voting";
		}
	}
	
	// TODO: pull new card
	//game_state.users[rec.query,username].cards[rec.query.card_ind] = splice(game_state.cards,1);
	
	res.send(game_state);
}

function on_vote(req, res)
{	
	console.log("on_vote() called");
	var user_num = Object.keys(game_state.users).length;
	var user = game_state.users[req.query.username];
	if( user.vote == null )
	{		
        user.vote = game_state.cards_in_play[req.query.card_ind];
		game_state.votes++;
		
		if(game_state.votes == user_num-1)
		{
			// evrybody has voted
			
			// scoring			
			var story_teller = game_state.users_in_playing_order[game_state.story_teller_ind];			
			var matches = 0;
			for (var u in game_state.users)
			{
				if( game_state.users[u].vote == game_state.users[story_teller].played_card )
					matches++;
			}
			
			if( matches > 0 && matches < user_num-1 )
			{
				// storyteller win
				game_state.users[story_teller].score += 3;
				for (var u in game_state.users)
					if( game_state.users[u].vote == game_state.users[story_teller].played_card )
						game_state.users[u].score += 3;
			}
			else
			{
				// storyteller lost
				for (var u in game_state.users)
					if( u != story_teller )
						game_state.users[u].score += 2;
			}
			
			// fakes
			for (var u1 in game_state.users)
			{
				for (var u2 in game_state.users)
				{
					if( u2 != story_teller && game_state.users[u1].vote == game_state.users[u2].played_card )
						game_state.users[u2].score++;						
				}				
			}
						
			// prepare  next round
			game_state.story = "";
			game_state.story_teller_ind = (game_state.story_teller_ind + 1) % user_num;
			game_state.cards_in_play = [];	
			game_state.votes = 0;	
			for (var user in game_state.users)
			{
				game_state.users[user].cards.push(game_state.cards.dix1.splice(0,1)[0]);
				game_state.users[user].played_card = null;
				game_state.users[user].vote = null;
			}				
			game_state.state = "wait_for_story";
		}
	}
	
	res.send(game_state);
}

server.get('/tick' , on_beat);
server.get('/join', on_join);
server.get('/start', on_start);
server.get('/set_story', on_set_story);
server.get('/place_card', on_place_card);
server.get('/vote', on_vote);

server.listen(port);
console.log("server is listening on port " + port +"...");
