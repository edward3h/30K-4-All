// Inject Saedathii Grand Performance forceEntries into New Recruit's IndexedDB
// Run in the browser console on newrecruit.eu if the detachments disappear after an update
// Last working: 2026-06-05

async function injectGP() {
  function uid() {
    return 'xxxx-xxxx-xxxx-xxxx'.replace(/x/g, () => Math.floor(Math.random()*16).toString(16));
  }
  var A="e90d-e5a8-f42d-da84",X="e8ed-ca49-ad6d-5688",
      HQ="4f85-eb33-30c9-8f51",EL="7aee-565f-b0ae-294e",
      TR="9b5d-fac7-799b-d7e7",FA="20ef-cd01-a8da-376e",HS="7031-469a-1aeb-eab0";

  function sc(scope,value,type){
    return {field:"selections",scope:scope,value:value,percentValue:false,shared:true,
            includeChildSelections:true,includeChildForces:false,id:uid(),type:type};
  }
  function cl(name,tid,lo,hi,scope){
    scope=scope||"force";
    var o={id:uid(),name:name,hidden:false,targetId:tid,primary:false};
    if(lo!=null||hi!=null){
      o.constraints=[];
      if(lo!=null) o.constraints.push(sc(scope,lo,"min"));
      if(hi!=null) o.constraints.push(sc(scope,hi,"max"));
    }
    return o;
  }
  function fe(name,h0,h1,t0,t1,e0,e1,f0,f1,s0,s1){
    var links=[cl("Allegiance:",A,2,2,"parent"),cl("Expanded Army Lists",X,null,null),cl("HQ:",HQ,h0,h1)];
    if(e1!=null) links.push(cl("Elites:",EL,e0,e1));
    links.push(cl("Troops:",TR,t0,t1));
    if(f1!=null) links.push(cl("Fast Attack:",FA,f0,f1));
    if(s1!=null) links.push(cl("Heavy Support:",HS,s0,s1));
    return {id:uid(),name:name,hidden:false,categoryLinks:links,
            constraints:[{type:"max",value:1,field:"forces",scope:"roster",
                          percentValue:false,shared:true,includeChildSelections:false,
                          includeChildForces:false,id:uid()}]};
  }

  // Grand Performance compositions (Pivotal Roles = min, total = max)
  // Trials of Khaine:  1 TM, 2 Troupes + up to 2 more Troupes, 2 Elites, 1 FA, 1 HS
  // Heroes Path:       2 TMs, 2 Troupes + up to 2 more, 1-3 Elites
  // Faolchu's Blade:   1 TM, 1 Troupe + up to 2 more, 2 Elites, 1-3 FA, 2 HS
  // Cegorach's Jest:   1 TM, 0-3 Troupes, 2 Elites, 1-3 FA, 1-3 HS
  // Cegorach's Lament: 1 TM, 1 Troupe + up to 2 more, 1-4 Elites, 1 FA, 2 HS
  var FE=[
    fe("Saedathii: The Trials of Khaine",  1,1, 2,4, 0,2, 0,1, 0,1),
    fe("Saedathii: The Heroes Path",        2,2, 2,4, 1,3, null,null, null,null),
    fe("Saedathii: Faolchu's Blade",   1,1, 1,3, 0,2, 1,3, 0,2),
    fe("Saedathii: Cegorach's Jest",   1,1, 0,3, 0,2, 1,3, 1,3),
    fe("Saedathii: Cegorach's Lament", 1,1, 1,3, 1,4, 0,1, 0,2)
  ];

  var req=indexedDB.open("nr-editor");
  await new Promise(function(r){req.onsuccess=r;});
  var db=req.result;
  var tx=db.transaction("catalogues","readwrite");
  var store=tx.objectStore("catalogues");
  var item=await new Promise(function(r){var q=store.get("bd2b-c57-2ddd-4b7c");q.onsuccess=function(){r(q.result);};});
  item.content.catalogue.forceEntries=FE;
  store.put(item);
  await new Promise(function(r){tx.oncomplete=r;});
  console.log("Done - reload the page and create a Saedath list");
}
injectGP();
