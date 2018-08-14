username = "";

setInterval(tick, 3000);

/*$(document).ready(function(){
    $('#username').keypress(function(e){
      if(e.keyCode==13)
      $('#btn').click();
    });
})*/

function onLoad()
{
	console.log("onLoad()");
	
	var xmlhttp;
	
	  if (window.XMLHttpRequest)
	{
		xmlhttp = new XMLHttpRequest();
	}
	 else
	 {
		xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	 }
	 
	 xmlhttp.onreadystatechange = function()
	 {
		if (this.readyState == 4 && this.status == 200) {
			document.getElementById("room_data").innerHTML =
			this.responseText;
		}
	};
	xmlhttp.open("GET", "TODO", true);
	xmlhttp.send();
}

function join_response() 
{
	if (this.readyState == 4 && this.status == 200) 
	{
		alert(this.responseText);
	}
};

function join()
{
	var xhttp = new XMLHttpRequest();
	username = document.getElementById("username").value;
	console.log("sent user=" + username);
	xhttp.onreadystatechange = join_response;
	xhttp.open("GET", "/join?username=" + username, true);
	xhttp.send();
}

function tick_response() 
{
	if (!(this.readyState == 4 && this.status == 200))
	{
		console.log("tick_response error");
		//username = "";
	}
};

function tick()
{
	console.log("user=" + username);
	
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = tick_response;
	xhttp.open("GET", "/tick?username=" + username, true);
	xhttp.send();
}