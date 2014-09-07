

if (Meteor.isClient) {

  // counter starts at 0
  Session.setDefault("counter", 0);

  Template.hello.helpers({
    counter: function () {
      return Session.get("counter");
    }
  });

  Template.hello.events({
    'click button': function () {
      // increment the counter when button is clicked
      Session.set("counter", Session.get("counter") + 1);

      Meteor.call('sendText', function(err,data){
        if (err) {
          console.log(err);
        }
        Session.set('response',data);
      });
    }
  });

  Template.seeResponse.events({
    'click button': function() {
      console.log(Session.get('response'));
    }
  });
}

if (Meteor.isServer) {
  var Twilio = Meteor.npmRequire('twilio');
  var twilio = Twilio("ACa9fe3af591e922c3f6b44ad50a9f6228","d512a624ac43c371cd8bff2546c6c6b3");

  Meteor.methods({
    'sendText': function sendText(){
      twilio.sendMessage({
        to:'+15038418527',
        from:'+15032134742',
        body:'Craig sent this from the web.'
      }, function(err, responseData){

        if (!err) {
          var responseText = responseData.body;
          return responseText;
        }
      });
      
    }
  });

  Meteor.startup(function () {
    // code to run on server at startup
  });
}
