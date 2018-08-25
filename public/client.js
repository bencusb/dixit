username = "";
game_state = 
{
  started: false
}

setInterval(tick, 3000);

/*$(document).ready(function(){
    $('#username').keypress(function(e){
      if(e.keyCode==13)
      $('#btn').click();
    });
})*/

function onLoad()
{
	console.log("onLoad() called");	
	update_viev();
}

function join_response() 
{
	if(this.readyState==4 && this.status==200)
	{
		console.log("join_response() called");
		//alert(this.responseText);
	}
}

function join()
{
	var xhttp = new XMLHttpRequest();
	username = document.getElementById("username").value;
	console.log("sent user=" + username);
	xhttp.onreadystatechange = join_response;
	xhttp.open("GET", "/join?username=" + username, true);
	xhttp.send();
}

function start()
{
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = start_response;
	xhttp.open("GET", "/start", true);
	xhttp.send();
}

function start_response() 
{
	if(this.readyState==4 && this.status==200)
	{
		console.log("start_response() called");
	}
}

function tick_response() 
{	
	if(this.readyState==4 && this.status==200)
	{
		console.log("tick_response called");
		game_state = JSON.parse(this.responseText);
		console.log(game_state);
		update_viev();
	}
	else
	{
		//console.log("tick_response error");
	}
		
};

function update_viev()
{
	console.log("update_viev() called");
	if(game_state.started == true)
	{
		//console.log("dowegethere?");
		document.getElementById("btn_start").disabled = true;
		//console.log("username="+username);
		
		var cards = game_state.users[username].cards;		
		for(i=0; i<cards.length; i++)
		{
			document.getElementById("img"+(i+1)).src="\\images\\cards\\Dixit - Odyssey\\"+cards[i]+".jpg";
		}		
		
		document.getElementById('user_data').hidden = false;
		document.getElementById('cards_played').hidden = false;
		document.getElementById('cards_in_hand').hidden = false;
	}
	else
	{		
		document.getElementById('user_data').hidden = true;
		document.getElementById('cards_played').hidden = true;
		document.getElementById('cards_in_hand').hidden = true;
	}
}

function tick()
{
	console.log("tick() called, user=" + username);
	
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = tick_response;
	xhttp.open("GET", "/tick?username=" + username, true);
	xhttp.send();
}

function img_clicked()
{
	var txt;
    var person = prompt("Please enter your name:", "card 1");
    if (person == null || person == "") {
        txt = "Invalid entry please enter(card 1-6)";
    } else {
        //todo
    }
}