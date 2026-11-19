// Procedurally builds the Mirrorfall .glb models. Run: npm i three@0.186.1 && node build-models.mjs ../assets/models
import fs from 'fs';import * as THREE from 'three';
import {GLTFExporter} from 'three/examples/jsm/exporters/GLTFExporter.js';
import {mergeGeometries} from 'three/examples/jsm/utils/BufferGeometryUtils.js';
globalThis.FileReader=class{readAsArrayBuffer(b){b.arrayBuffer().then(r=>{this.result=r;this.onloadend()})}};
const out=process.argv[2]||'assets/models';fs.mkdirSync(out,{recursive:true});
let seed=7;const rng=()=>(seed=seed*16807%2147483647)/2147483647,V3=a=>new THREE.Vector3(...a),Q=r=>r.isQuaternion?r:new THREE.Quaternion().setFromEuler(new THREE.Euler(...r));
const MAT=new THREE.MeshStandardMaterial({vertexColors:true,roughness:.9,metalness:.15});
class Kit{pre=new THREE.Matrix4();g=[];
 add(geo,p=[0,0,0],r=[0,0,0],c=0x888888,s=[1,1,1]){const g=geo.clone();g.applyMatrix4(this.pre.clone().multiply(new THREE.Matrix4().compose(V3(p),Q(r),V3(s))));const col=new THREE.Color(c),j=.85+rng()*.3,n=g.attributes.position.count,a=new Float32Array(n*3);for(let i=0;i<n;i++)a.set([col.r*j,col.g*j,col.b*j],i*3);g.setAttribute('color',new THREE.BufferAttribute(a,3));this.g.push(g)}
 box(w,h,d,...a){this.add(new THREE.BoxGeometry(w,h,d),...a)}cyl(r,h,...a){this.add(new THREE.CylinderGeometry(r,r,h,14),...a)}ball(r,...a){this.add(new THREE.SphereGeometry(r,14,10),...a)}
 at(p,r,f){const o=this.pre;this.pre=o.clone().multiply(new THREE.Matrix4().compose(V3(p),Q(r),V3([1,1,1])));f();this.pre=o}
 mesh(name,mat=MAT){const m=new THREE.Mesh(mergeGeometries(this.g),mat);m.name=name;return m}}
async function save(name,...ms){const sc=new THREE.Scene();ms.forEach(m=>sc.add(m));const ab=await new GLTFExporter().parseAsync(sc,{binary:true});fs.writeFileSync(`${out}/${name}.glb`,Buffer.from(ab));console.log(name,ab.byteLength)}
/* ---- the cellar: brick walls, beams, stage lamps, speaker stacks, cables, crates ---- */
const R=new Kit(),brick=[0x5a3128,0x4a2a24,0x3c2220,0x6a4034];
for(const ry of[0,Math.PI/2,Math.PI,-Math.PI/2])R.at([0,0,0],[0,ry,0],()=>{
 R.box(19,7.4,.5,[0,3.6,-9.25],[0,0,0],0x2a1a17);
 for(let i=0;i<17;i++)R.box(18.6,.05,.1,[0,.3+i*.4,-9],[0,0,0],0x140b0a);
 for(let i=0;i<90;i++)R.box(.8,.3,.08,[(rng()-.5)*17.6,.4+rng()*6.2,-8.98],[0,0,0],brick[i%4]);
 R.cyl(.07,18.6,[0,6.5,-8.8],[0,0,Math.PI/2],0x2c2c2a);R.cyl(.05,18.6,[0,5.9,-8.85],[0,0,Math.PI/2],0x3a2a22)});
for(let z=-6;z<=6;z+=3)R.box(18.5,.35,.4,[0,6.9,z],[0,0,0],0x2b2220);
for(const p of[[-4.2,5.3,-2.5],[4.2,5.3,-2.5],[0,5.5,-6]]){const o=new THREE.Object3D();o.position.set(...p);o.lookAt(0,1,0);
 R.cyl(.03,1.7,[p[0],p[1]+1.3,p[2]],[0,0,0],0x1a1a1a);
 R.at(p,o.quaternion,()=>{R.box(.8,.7,.9,[0,0,-.1],[0,0,0],0x2d2926);R.cyl(.3,.2,[0,0,.4],[Math.PI/2,0,0],0x14100f);R.cyl(.22,.05,[0,0,.52],[Math.PI/2,0,0],0xc9a770);
  for(const[a,b]of[[0,.45],[0,-.45],[.5,0],[-.5,0]])R.box(a?0.02:0.8,a?0.7:0.02,.35,[a,b,.62],[0,0,0],0x1d1a18)})}
for(const[x,z]of[[-8,-3.5],[-8,3.5]])R.at([x,0,z],[0,Math.PI/2,0],()=>{for(let k=0;k<2;k++){const y=1.2+k*2.4;R.box(1.5,2.3,1.1,[0,y,0],[0,0,0],0x1c1613);R.cyl(.5,.12,[0,y-.35,.56],[Math.PI/2,0,0],0x0b0907);R.cyl(.2,.14,[0,y-.35,.6],[Math.PI/2,0,0],0x2a2622);R.cyl(.2,.1,[0,y+.65,.56],[Math.PI/2,0,0],0x0b0907)}});
R.at([-7.6,0,0],[0,Math.PI/2,0],()=>{R.box(1.3,1.3,.8,[0,.65,0],[0,0,0],0x2a2a26);for(let i=0;i<4;i++){R.box(1.1,.14,.05,[0,.25+i*.28,.42],[0,0,0],0x6a6a60);for(let k=0;k<4;k++)R.cyl(.04,.05,[-.4+k*.26,.25+i*.28,.46],[Math.PI/2,0,0],0x111111)}});
for(let i=0;i<7;i++)R.box(1+rng()*.6,.8+rng()*.4,1,[7.4+rng()*.8,.45+(i>4?.9:0),-8+i*1.1-(i>4?5.5:0)],[0,rng()*.5,0],0x5a4630);
const cab=(a,b,sag)=>{const m=a.map((v,i)=>(v+b[i])/2);m[1]-=sag;R.add(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([V3(a),V3(m),V3(b)]),16,.035,5),[0,0,0],[0,0,0],0x0e0b0a)};
cab([-4.2,6.7,-2.5],[4.2,6.7,-2.5],1.3);cab([-8.5,5,-3.5],[-4.2,5.9,-2.5],1.2);cab([4.2,5.9,-2.5],[8.7,4,2],1.6);cab([0,6.7,-6],[0,6.7,4],1.8);cab([-8,1.5,0],[-5.5,0.05,3],.1);cab([7,6.8,-5],[2,6.8,5],1.4);
await save('room',R.mesh('Room'));
/* ---- floating masks + hands only (no bodies) ---- */
const SK=[0xcdb99a,0x6b5c4a,0x4e5240,0xd9d0c0];
function hand(skin,sx){const K=new Kit();K.cyl(.075,.2,[0,0,-.06],[Math.PI/2,0,0],0x14100f);K.box(.2,.07,.22,[0,0,.12],[0,0,0],skin);
 for(let f=0;f<4;f++){K.box(.04,.045,.14,[-.075+f*.05,0,.29],[0,0,0],skin);K.box(.04,.04,.1,[-.075+f*.05,-.035,.38],[.6,0,0],skin)}
 K.box(.05,.05,.14,[sx*.13,-.01,.12],[0,sx*.6,0],skin);return K.mesh('Hand'+(sx<0?'L':'R'))}
for(let v=0;v<4;v++){const K=new Kit(),E=new Kit(),skin=SK[v];
 if(v===0){K.ball(.42,[0,0,0],[0,0,0],skin,[1,1.15,.95]);for(const s of[-1,1]){K.ball(.13,[s*.17,.1,.34],[0,0,0],0x050303,[1,1.2,.5]);E.ball(.04,[s*.17,.1,.38]);K.cyl(.14,.22,[s*.26,-.2,.3],[Math.PI/2,0,0],0x3a3a36);K.add(new THREE.TorusGeometry(.14,.025,6,14),[s*.26,-.2,.4],[0,0,0],0x5a5a52)}K.cyl(.1,.16,[0,-.2,.42],[Math.PI/2,0,0],0x2a2a26);K.box(.08,.2,.1,[0,-.02,.4],[0,0,0],skin)}
 if(v===1){K.ball(.5,[0,.05,0],[0,0,0],0x6b4a32);K.box(.66,.46,.12,[0,.04,.42],[0,0,0],0x25201c);K.box(.5,.09,.05,[0,.06,.49],[0,0,0],0x050303);for(const s of[-1,1]){E.box(.08,.05,.02,[s*.13,.06,.5]);K.ball(.04,[s*.3,.3,.42],[0,0,0],0x9a7a50)}}
 if(v===2){K.ball(.4,[0,0,0],[0,0,0],skin,[1,1.1,1]);for(const s of[-1,1]){K.cyl(.13,.06,[s*.17,.1,.35],[Math.PI/2,0,0],0x0a0a09);K.add(new THREE.TorusGeometry(.14,.03,6,14),[s*.17,.1,.36],[0,0,0],0x3a3a34);E.ball(.045,[s*.17,.1,.39])}K.add(new THREE.ConeGeometry(.14,.8,10),[0,-.12,.7],[Math.PI/2,0,0],0x2d332a)}
 if(v===3){K.ball(.4,[0,0,0],[0,0,0],skin,[.95,1.2,.95]);for(const s of[-1,1]){K.ball(.11,[s*.15,.12,.34],[0,0,0],0x050303,[1,1.3,.5]);E.ball(.035,[s*.15,.12,.38])}K.box(.46,.025,.03,[0,-.2,.38],[0,0,0],0x1a0d0d);for(let i=0;i<9;i++)K.box(.02,.1,.03,[-.2+i*.05,-.2,.38],[0,0,0],0x1a0d0d)}
 const mk=K.mesh('Mask'),ey=E.mesh('Eyes',new THREE.MeshStandardMaterial({color:0,emissive:0xff3b30,emissiveIntensity:4})),hl=hand(skin,-1),hr=hand(skin,1);
 mk.position.y=ey.position.y=2.6;hl.position.set(-.8,1.05,1.3);hr.position.set(.8,1.05,1.3);await save('entity'+v,mk,ey,hl,hr)}
/* ---- pump shotgun: barrel along -z, 'Pump' slides separately ---- */
{const G=new Kit(),P=new Kit(),st=0x2b2b28,wd=0x5b3b22;
 G.cyl(.045,1.7,[0,0,-.45],[Math.PI/2,0,0],st);G.cyl(.038,1.1,[0,-.095,-.7],[Math.PI/2,0,0],st);G.box(.12,.17,.55,[0,-.02,.3],[0,0,0],0x3a3a36);
 G.box(.1,.2,.8,[0,-.06,.95],[.12,0,0],wd);G.box(.085,.2,.1,[0,-.2,.42],[.35,0,0],wd);G.box(.02,.07,.2,[0,-.16,.25],[0,0,0],st);G.box(.02,.04,.03,[0,.05,-1.28],[0,0,0],st);G.cyl(.055,.04,[0,0,-1.3],[Math.PI/2,0,0],0x1a1a18);
 P.box(.14,.13,.45,[0,0,0],[0,0,0],wd);for(let i=0;i<4;i++)P.box(.15,.02,.03,[0,0,-.15+i*.1],[0,0,0],0x2a1a10);
 const g=G.mesh('Gun'),p=P.mesh('Pump');p.position.set(0,-.095,-.62);await save('shotgun',g,p)}
/* ---- desk items: cigarettes, walkie-talkie, knife, hourglass, energy drink, tongs, padlock ---- */
{const br=0xb08a3e,sm=new Kit(),ra=new Kit(),kn=new Kit(),rv=new Kit(),en=new Kit(),ej=new Kit(),wa=new Kit();
 sm.box(.34,.12,.5,[0,.06,0],[0,0,0],0xb8302a);sm.box(.345,.125,.16,[0,.06,-.12],[0,0,0],0xe8e2d4);sm.box(.1,.03,.1,[0,.126,.1],[0,0,0],0x1a1a18);sm.cyl(.02,.32,[.07,.15,.12],[Math.PI/2,0,.12],0xe8e2d4);sm.cyl(.021,.05,[.09,.15,-.03],[Math.PI/2,0,.12],0xc0642a);
 ra.box(.2,.1,.5,[0,.07,0],[0,0,0],0x2a2a28);ra.box(.12,.02,.1,[0,.13,-.12],[0,0,0],0x2a5a30);for(let i=0;i<5;i++)ra.box(.14,.012,.015,[0,.125,.05+i*.04],[0,0,0],0x111111);ra.cyl(.014,.38,[.07,.07,-.42],[Math.PI/2,0,0],0x14100f);ra.cyl(.03,.03,[-.06,.13,.22],[0,0,0],0xc0302a);ra.box(.04,.05,.14,[.11,.07,.1],[0,0,0],0x1a1a18);
 kn.box(.13,.05,.34,[0,.04,.2],[0,0,0],0x7a1c18);kn.box(.075,.02,.42,[0,.045,-.17],[0,0,0],0xa8a8a2);for(let i=0;i<10;i++)kn.box(.03,.02,.022,[.05,.045,-.36+i*.04],[0,0,0],0x8a8a84);kn.cyl(.02,.06,[0,.07,.1],[0,0,0],0x3a3a36);
 rv.cyl(.14,.03,[0,.015,0],[0,0,0],br);rv.cyl(.14,.03,[0,.435,0],[0,0,0],br);rv.add(new THREE.ConeGeometry(.11,.2,14),[0,.12,0],[0,0,0],0x9ad7c6);rv.add(new THREE.ConeGeometry(.11,.2,14),[0,.32,0],[Math.PI,0,0],0x9ad7c6);rv.add(new THREE.ConeGeometry(.07,.1,12),[0,.07,0],[0,0,0],0xe0b45a);for(let i=0;i<3;i++){const a=i*2.094;rv.cyl(.012,.4,[Math.cos(a)*.13,.225,Math.sin(a)*.13],[0,0,0],br)}
 en.cyl(.1,.34,[0,.17,0],[0,0,0],0x14210f);en.cyl(.102,.12,[0,.17,0],[0,0,0],0xb5ff3c);en.cyl(.095,.02,[0,.35,0],[0,0,0],0xc9c9c4);en.box(.05,.01,.03,[0,.362,.03],[0,0,0],0x8a8a84);en.box(.03,.1,.01,[0,.19,.1],[0,0,.4],0x0a0a08);
 ej.box(.6,.025,.05,[0,.03,.04],[0,-.06,0],0x9a9a94);ej.box(.6,.025,.05,[0,.03,-.04],[0,.06,0],0x9a9a94);ej.cyl(.05,.12,[-.28,.04,0],[0,0,Math.PI/2],0xc0302a);ej.box(.05,.04,.02,[.3,.03,.02],[0,0,0],0x5a5a54);ej.cyl(.03,.03,[-.05,.04,0],[Math.PI/2,0,0],0x6a6a64);
 wa.box(.3,.26,.12,[0,.14,0],[0,0,0],0x7a7a74);wa.add(new THREE.TorusGeometry(.09,.025,6,14,Math.PI),[0,.27,0],[0,0,0],0x9a9a94);wa.cyl(.025,.03,[0,.15,.065],[Math.PI/2,0,0],0x050303);wa.box(.02,.08,.01,[0,.12,.065],[0,0,0],0x050303);
 await save('items',...[['SMOKE',sm],['RADIO',ra],['KNIFE',kn],['REVERSE',rv],['ENERGY',en],['EJECT',ej],['WARD',wa]].map(([t,k])=>k.mesh(t)))}
/* ---- item crate with a hinged lid ---- */
{const C=new Kit(),L=new Kit(),wd=0x4a3422,dk=0x241810;C.box(1.1,.06,.8,[0,.03,0],[0,0,0],dk);C.box(1.1,.5,.06,[0,.25,.37],[0,0,0],wd);C.box(1.1,.5,.06,[0,.25,-.37],[0,0,0],wd);C.box(.06,.5,.8,[.52,.25,0],[0,0,0],wd);C.box(.06,.5,.8,[-.52,.25,0],[0,0,0],wd);for(let i=0;i<3;i++)C.box(1.12,.04,.08,[0,.1+i*.17,.4],[0,0,0],0x6a5038);
 L.box(1.1,.05,.8,[0,0,.4],[0,0,0],wd);L.box(1.12,.06,.08,[0,.02,.7],[0,0,0],0x6a5038);const lid=L.mesh('Lid');lid.position.set(0,.5,-.4);await save('box',C.mesh('Crate'),lid)}
