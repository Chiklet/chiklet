const mongo = require('mongodb').MongoClient;
const client = require('socket.io').listen(12000).sockets;

mongo.connect('mongodb://127.0.0.1/mongochat', function(err, db){
	if(err){
		throw err;

	}

	console.log('MongoDB connected...');

	//connect to socket.io
	client.on('connection', function(){
	
		let chat = db.collection('chats');

		//create function to send status
		sendStatus = function(s){
			socket.emit('status', s);

		}

		//Get chats from mongo collection
		chat.find().limit(100).sort({_id:1}).toArray(function(err, res){
		
			if(err)
				throw err;
			//emit the messages
			socket.emit('output', res);
		
		});


		//Handle input events
		socket.on('input', function(date){
		
			let name = date.name;
			let message = date.message;

			//check for name and message
			if(name==''||message==""){
			
				//send error status
				sendStatus('Please enter name and msg');
			
			}else{
			
			
				//insert message
				chat.insert({name:name, message:message}, function(){
				
					client.emit('output', [data]);
					//send status
					sendStatus({
					
						message: 'Message sent',
						clear: true
					
					});
				
				});


			}
		
		});


		//Handle clear
		socket.on('clear', function(){
		

			//remove all chats from collection
			chat.remove({}, function(){
			
				//emit cleared
				socket.emit('cleared');
			
			});
		
		});

	
	});


});
