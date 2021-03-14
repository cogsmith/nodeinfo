const fs   = require('fs');
const os   = require('os'); 
const proc = require('child_process');

const fastify = require('fastify')({ logger:true, trustProxy:true });

const App = { 
    Port:(process.env.PORT || '_'),        //Port:(process.env.APP_PORT || process.argv[2] || '_'), 
    IP:  (process.env.HOST || '0.0.0.0'),  //IP:  (process.env.APP_IP   || process.argv[3] || '0.0.0.0'), 
    IP1:'127.0.0.1', IP4:'0.0.0.0', IP6:'::',
    Requests:0,
    Clients:{},
    Host: { IP:false }
}

App.DoInfoPage = function (req,rep) {
	let msg  = App.GetMsg(req);
	let info = App.GetInfo(req,rep);
	let head = "<title>"+msg+"</title><style>body { font-size:15px;font-family:monospace; }</style>";
	let body = "<center>"+msg+"<hr>"+"</center><pre>\n"+JSON.stringify(info,null,2)+"</pre>"+"<center><hr>"+"<a href='/'>/</a><br><a href='/info'>INFO</a><br><a href='/infoline'>INFOLINE</a><br><a href='/infopage'>INFOPAGE</a></center>";
	let html = "<html><head>"+head+"</head><body>"+body+"</html>";
	rep.type('text/html').send(html); 
}

App.Init = function () {
    // if (!App.IP) { App.IP = App.IP4; };

    App.NICS=[]; App.NICDB = {}; var nics = os.networkInterfaces();
    Object.keys(nics).forEach(function (x,n) { 
        for (var i=0;i<nics[x].length;i++) { 
            var z = nics[x][i]; if (z.family=='IPv4') {
                if (!App.Host.IP && z.cidr!='127.0.0.1/8') { App.Host.IP=z.address; };
                App.NICDB[x]={ID:n, MAC:z.mac.replace(/:/g,'').toUpperCase(), CIDR:z.cidr };
                App.NICS.push(z.mac.replace(/:/g,'').toUpperCase()+'/'+z.cidr);
            }
        }
    });

    console.log(App.GetMsg());

    if (App.Port=='_') { return; }    

    fastify.log.info('App.Init:Init');

    fastify.addHook('onRequest', (req,rep,nxt) => { 
        let reqip = req.ip; // req.socket.remoteAddress;
        App.Requests++; 
        if (!App.Clients[reqip]) { App.Clients[reqip]=1; } else { App.Clients[reqip]++; }
        nxt(); 
    });

    // fastify.setNotFoundHandler((req,rep) => { App.DoInfoPage(req,rep); });
    // fastify.get('/infopage',   (req,rep) => { App.DoInfoPage(req,rep); });

    fastify.setNotFoundHandler(App.DoInfoPage);
    fastify.get('/infopage',   App.DoInfoPage);

    fastify.get('/', (req,rep) => { var url = '/infoline'; if (req.headers['user-agent'].startsWith('Mozilla')) { url='/infopage'; }; rep.redirect(url); });

    fastify.get('/infoline', (req,rep) => { rep.send(App.GetMsg(req)+"\n"); });

    //fastify.get('/info', (req,rep) => { let info = App.GetInfo(req,rep); rep.send(info); });
    fastify.get('/info', (req,rep) => { let info = App.GetInfo(req,rep); rep.send( JSON.stringify(info,null,2)+"\n" ); });


    fastify.listen(App.Port, App.IP, (err,address) => { if (err) { console.error(err); throw err; } else { fastify.log.info('App.Init:Done'); App.Main(); } } );
};

App.Main = function () { fastify.log.info('App.Main'); };

App.GetMsg = function (req) { let msg = 'NODEINFO'; msg += ': '+require('os').hostname().toUpperCase()+' @ '+App.IP+':'+App.Port+' @ '; if (req) { msg += req.headers.host.toUpperCase()+' @ '; }; msg += new Date().toISOString(); return msg; };

App.GetInfoReq = function (req) {
    let info = {};
    if (req) { 
        let reqip = req.ip; // let reqip = req.socket.remoteAddress;
        info = { 
            ID:req.id,
            IP:reqip,
            IPs:req.ips,
            Host:req.hostname,
            Proto:req.protocol,
            Method:req.method,
            URL:req.url,
            // Router:{ Method:req.routerMethod, Path:req.routerPath },
            Query:req.query,
            Params:req.params,
            Body:req.body,
            Headers:req.headers,
        };
    }
    return info;
};

App.GetInfo = function (req,rep) {
    let info = {
        DT: new Date().toISOString(),
        Request: App.GetInfoReq(req),
        Reply: { Status:rep.statusCode, Headers:rep.getHeaders() },
        Requests: { Total:App.Requests, IP:App.Clients },
        Listen: { IP:App.IP, Port:App.Port },
        Docker: { Env:fs.existsSync('/.dockerenv') },
        Host: { Name:os.hostname().toUpperCase(), IP:App.Host.IP, Uptime:os.uptime(), Load:os.loadavg(), OS:{ Info:(os.arch()+','+os.platform()+','+os.type()).replace(/ /g,'_'), Arch:os.arch(), Platform:os.platform(), Type:os.type(), Version:os.version() } },
        Process: { Uptime:process.uptime(), Title:process.title, CWD:process.cwd(), Argv:process.argv, ExecPath:process.execPath, ExecArgv:process.execArgv, PID:process.pid, PPID:process.ppid, },
        Node: { Version:process.version, DebugPort:process.debugPort, Deps:process.versions },
        Env: process.env,
        Metrics: { CPU: process.cpuUsage(), Memory: process.memoryUsage(), Usage:process.resourceUsage(), },
        NIC:App.NICDB,
        //App:App,
    };

    if (os.platform()=='linux') { 
        info.Host.ProcSched = proc.execSync('head -1 /proc/1/sched').toString().split(" (")[0];
        // info.Docker.ProcGroups = proc.execSync('grep docker /proc/1/cgroup').toString().split("\n");
    }
    
    return info;
};

App.Init();