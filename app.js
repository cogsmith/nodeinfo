const port = process.argv[2] || 80; const host = process.argv[3] || '0.0.0.0';
const msg = function () { let msg = 'NODEINFO'; msg += ': '+require('os').hostname()+' @ '+host+':'+port+' @ '+new Date().toISOString(); return msg; };

let INFO = {NODE:'INFO'};

const fastify = require('fastify')({ logger:true });
fastify.get('/', (req,rep) => { var url = '/info'; if (req.headers['user-agent'].startsWith('Mozilla')) { url='/infopage'; }; rep.redirect(url); });
fastify.get('/info', (req,rep) => { rep.send(INFO); });
fastify.get('/infopage', (req,rep) => { 
    let html = "<center>"+msg()+"<hr>"+"<pre>\n"+JSON.stringify(INFO,null,2)+"</pre>"+"<hr>"+"<a href='/info'>INFO</a></center>";
    rep.type('text/html').send(html); 
});
fastify.listen(port, '0.0.0.0', (err,address) => { if (err) { throw err; } else { fastify.log.info('INIT'); } } )

console.log(msg());