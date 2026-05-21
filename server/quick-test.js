const http = require('http');
(async () => {
  const r = await new Promise((resolve) => {
    const req = http.request({hostname:'localhost',port:5001,path:'/',method:'GET',timeout:3000},(res)=>{let d='';res.on('data',c=>d+=c);res.on('end',()=>resolve({status:res.statusCode,body:d}))});
    req.on('error',e=>resolve({status:-1,body:e.message}));
    req.on('timeout',()=>{req.destroy();resolve({status:-2,body:'TIMEOUT'})});
    req.end();
  });
  console.log('Status:', r.status);
  console.log('App.js body:', r.body);
  
  const r2 = await new Promise((resolve) => {
    const req = http.request({hostname:'localhost',port:5001,path:'/api/incidents',method:'GET',timeout:3000},(res)=>{let d='';res.on('data',c=>d+=c);res.on('end',()=>resolve({status:res.statusCode,body:d.substring(0,200)}))});
    req.on('error',e=>resolve({status:-1,body:e.message}));
    req.on('timeout',()=>{req.destroy();resolve({status:-2,body:'TIMEOUT'})});
    req.end();
  });
  console.log('GET /api/incidents Status:', r2.status);
  console.log('Body:', r2.body);
  
  process.exit(0);
})();
