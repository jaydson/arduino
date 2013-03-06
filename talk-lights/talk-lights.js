var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , fs = require('fs')

app.listen(81);

function handler (req, res) {
  fs.readFile(__dirname + '/talk-lights.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading talk-lights.html');
    }

    res.writeHead(200);
    res.end(data);
  });
}






var five = require("johnny-five")
    ,board = new five.Board();

board.on("ready", function() {

  var x= 0,
      jf= this;
  
  var BlinkList= {
     list: [],
     add: function(color){
         
         if(typeof color != 'object')
             color= [color];
         
         BlinkList.list.push(color);
     },
     next: function(){
         return BlinkList.list.shift();
     },
     off: function(){
         jf.digitalWrite(3, 0);
         jf.digitalWrite(5, 0);
         jf.digitalWrite(6, 0);
         jf.digitalWrite(9, 0);
     },
     blink: function(c){
         
         if(c.indexOf('red')+1){
             jf.digitalWrite(5, 1);
         }
         if(c.indexOf('green')+1){
             jf.digitalWrite(6, 1);
         }
         if(c.indexOf('blue')+1){
             jf.digitalWrite(3, 1);
         }
         if(c.indexOf('yellow')+1){
             jf.digitalWrite(9, 1);
         }
     }
  };

  this.loop(500, function(){
      
      BlinkList.off();
      
      var c= BlinkList.next() || false;
      
      if(c){
          setTimeout(function(){
              BlinkList.blink(c);
          }, Math.ceil(Math.random() * 100) + 50);
      }
      
  });

  var tryAndAdd= function(txt){
      
        var t= txt,
            l= ['yellow'];
        
        
        if((t.match(/\#red/i)||"").length){
            l.push('red');
        }
        if((t.match(/\#green/i)||"").length){
            l.push('green');
        }
        if((t.match(/\#blue/i)||"").length){
            l.push('blue');
        }
        console.log(l);
        BlinkList.add(l);
        
  };

  // used to test using buttons
  io.sockets.on('connection', function (socket) {
    socket.on('arduinoEnter', function (data) {
        
        BlinkList.add(data.color);
        
    });
    socket.on('arduinoEnter2', function (data) {
        tryAndAdd(data.text);
    });
  });

  BlinkList.off();
  
  
  //http://search.twitter.com/search.json?&q=%23red%20OR%20%23green%20OR%20%23blue
    var twitter = require('ntwitter');

    var twit = new twitter({
      consumer_key: 'lm7ipQkOSyDxeUwwQNOaVw',
      consumer_secret: 'pBJh5VfoAIki46uEvwhBJsp4AWDqaKsW0pM7fxpM4',
      access_token_key: '37043393-PEm1qxtf2wBtKah4bCOyfrDlWOFBsxheX983zCZf8',
      access_token_secret: 'ZQJap7cBktVDRuIGuafv736A7ZIlI99Vr2uG5NGybec'
    });
    
    /*twit.search('nodejs OR #node', function(err, data) {
        if (err) {
          console.log('[ntwitter] Twitter search failed!');
        }
        else {
            
          //console.log('Search results:');
          console.dir(data);
        }
    });*/


    twit.stream('statuses/filter', {'track':'felipenmoura'}, function(stream) {
        stream.on('data', function (data) {
          console.log("RECEIVED", data.text);
          tryAndAdd(data.text);
        });
    });


});