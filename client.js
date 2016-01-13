var amqp = require('amqplib/callback_api');
var url = process.env.CLOUDAMQP_URL || "amqp://qlgmscns:kvcZM_64Xvkqzt1vawEwl3xOIwjdXPJQ@hyena.rmq.cloudamqp.com/qlgmscns";

amqp.connect(url, function(err, conn) {
  conn.createChannel(function(err, ch) {
    ch.assertQueue('', {exclusive: true}, function(err, q) {
      var corr = generateUuid();
      var num = parseInt('11');

      console.log(' [x] Requesting fib(%d)', num);

      ch.consume(q.queue, function(msg) {
        if (msg.properties.correlationId == corr) {
          console.log(' [.] Got %s', msg.content.toString());
          setTimeout(function() { conn.close(); process.exit(0) }, 500);
        }
      }, {noAck: true});

      var headers = {functionName: 'hello'};
      
      ch.sendToQueue('demo',
      new Buffer(num.toString()),
      { correlationId: corr, replyTo: q.queue, headers: headers });
    });
  });
});

function generateUuid() {
  return Math.random().toString() +
         Math.random().toString() +
         Math.random().toString();
}