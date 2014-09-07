Phones = new Mongo.Collection("phones");

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

  Template.sendText.phones = function(){
    return Phones.find({});
  }

  Template.sendText.events({
    'click button': function(event, template){
      message = template.find("input[name=message]");
      nameSelected = template.find("input[name=firstName]:checked");
      console.log(nameSelected.value);
      console.log(message.value);
      person = Phones.findOne({name:nameSelected.value});
      console.log(person.number);
      Meteor.call('sendText',message.value, person.number,  function(err,data){
        if (err) {
          console.log(err);
        }
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
    'sendText': function sendText(bodyText, phoneNumber){
      twilio.sendMessage({
        to:phoneNumber,
        from:'+15032134742',
        body:bodyText
      }, function(err, responseData){

        if (!err) {
          var responseText = responseData.body;
          return responseText;
        }
      });
      
    }
  });

  Meteor.startup(function () {
    Phones.remove({});
    Phones.insert({name:"Michael", number:"+16175195801"});
    Phones.insert({name:"Craig", number:"+15038418527"});
  });
}
