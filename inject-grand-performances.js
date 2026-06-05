// Inject Saedathii Grand Performances + entryLinks into New Recruit IndexedDB
// Usage: fetch("https://raw.githubusercontent.com/edward3h/30K-4-All/release/inject-grand-performances.js").then(r=>r.text()).then(t=>eval(t))
// After running, reload the page and create a Saedath Grand Performance list.

(async function() {
  var apos = String.fromCharCode(39);
  function uid(){return "xxxx-xxxx-xxxx-xxxx".replace(/x/g,function(){return Math.floor(Math.random()*16).toString(16);});}
  var A="e90d-e5a8-f42d-da84",X="e8ed-ca49-ad6d-5688",
      HQ="4f85-eb33-30c9-8f51",EL="7aee-565f-b0ae-294e",
      TR="9b5d-fac7-799b-d7e7",FA="20ef-cd01-a8da-376e",HS="7031-469a-1aeb-eab0";
  function sc(s,v,t){return{field:"selections",scope:s,value:v,percentValue:false,shared:true,includeChildSelections:true,includeChildForces:false,id:uid(),type:t};}
  function cl(n,tid,lo,hi,s){s=s||"force";var o={id:uid(),name:n,hidden:false,targetId:tid,primary:false};if(lo!=null||hi!=null){o.constraints=[];if(lo!=null)o.constraints.push(sc(s,lo,"min"));if(hi!=null)o.constraints.push(sc(s,hi,"max"));}return o;}
  function fe(n,h0,h1,t0,t1,e0,e1,f0,f1,s0,s1){var L=[cl("Allegiance:",A,2,2,"parent"),cl("Expanded Army Lists",X,null,null),cl("HQ:",HQ,h0,h1)];if(e1!=null)L.push(cl("Elites:",EL,e0,e1));L.push(cl("Troops:",TR,t0,t1));if(f1!=null)L.push(cl("Fast Attack:",FA,f0,f1));if(s1!=null)L.push(cl("Heavy Support:",HS,s0,s1));return{id:uid(),name:n,hidden:false,categoryLinks:L,constraints:[{type:"max",value:1,field:"forces",scope:"roster",percentValue:false,shared:true,includeChildSelections:false,includeChildForces:false,id:uid()}]};}

  var req=indexedDB.open("nr-editor");
  await new Promise(function(r){req.onsuccess=r;});
  var db=req.result;
  var tx=db.transaction("catalogues","readwrite");
  var store=tx.objectStore("catalogues");
  var item=await new Promise(function(r){var q=store.get("bd2b-c57-2ddd-4b7c");q.onsuccess=function(){r(q.result);};});
  var cat=item.content.catalogue;

  // Build entryLinks from all unit-type sharedSelectionEntries
  var units=cat.sharedSelectionEntries||[];
  cat.entryLinks=units.filter(function(u){return u.id&&u.type==="unit";}).map(function(u){
    return{id:uid(),name:u.name,hidden:false,collective:false,import:true,targetId:u.id,type:"selectionEntry"};
  });
  console.log("entryLinks injected:",cat.entryLinks.length);

  cat.forceEntries=[
    fe("Saedathii: The Trials of Khaine",  1,1,2,4,0,2,0,1,0,1),
    fe("Saedathii: The Heroes Path",        2,2,2,4,1,3,null,null,null,null),
    fe("Saedathii: Faolchu"+apos+"s Blade", 1,1,1,3,0,2,1,3,0,2),
    fe("Saedathii: Cegorach"+apos+"s Jest", 1,1,0,3,0,2,1,3,1,3),
    fe("Saedathii: Cegorach"+apos+"s Lament",1,1,1,3,1,4,0,1,0,2)
  ];
  console.log("forceEntries injected:",cat.forceEntries.length);

  store.put(item);
  await new Promise(function(r){tx.oncomplete=r;});
  console.log("Done - reload the page");
})();
