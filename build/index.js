(()=>{var t={652:()=>{!function(){const t=canvas.width,e=canvas.height;canvas.width=Math.round(2*t),canvas.height=Math.round(2*e),canvas.style.width=t+"px",canvas.style.height=e+"px",window.dpr=2,canvas.getContext("2d").scale(2,2)}()},293:()=>{!function(){if(window.wx)return;window.wx={getSystemInfoSync:()=>({safeArea:{top:0},windowWidth:document.querySelector("canvas").clientWidth,windowHeight:document.querySelector("canvas").clientHeight})};const t=document.querySelector("body");t.style.padding="0",t.style.margin="auto",t.style.left=0,t.style.right=0,t.style.top=0,t.style.bottom=0,t.style.position="absolute",t.style.width="100%",t.style.height="100%";const e=document.createElement("canvas");e.width=t.clientWidth,e.height=t.clientHeight,e.style.display="block",e.style.touchAction="none",t.appendChild(e),window.canvas=e}()},6:()=>{!function(){const t=Symbol("_Allow");function e(t){this.ImitationINS=t,this.dependentQueue=[],this.monitorQueue=[]}function i(t){this.state=t,this.MonitorINS=new e(this)}e.prototype.dispatch=function(){this.monitorQueue.forEach(((e,i)=>{const s=this.dependentQueue[i],n=this.executeDependent(e.dependent);return n===t||Array.isArray(n)&&Array.isArray(s)&&(a=n,o=s,Array.isArray(a)&&Array.isArray(o)&&(a.length!==o.length||a.filter(((t,e)=>t===o[e])).length!==a.length))||!Array.isArray(n)&&!Array.isArray(s)&n!==s?(this.executeEvent(e.event),void(this.dependentQueue[i]=n)):void(this.dependentQueue[i]=n);var a,o}))},e.prototype.register=function(e,i=t){const s={event:e,dependent:i};return this.monitorQueue.push(s),this.dependentQueue.push(this.executeDependent(i)),()=>{this.monitorQueue.forEach(((t,e)=>{t===s&&(this.monitorQueue=this.monitorQueue.filter(((t,i)=>i!==e)),this.dependentQueue=this.dependentQueue.filter(((t,i)=>i!==e)))}))}},e.prototype.executeEvent=function(t){t(this.ImitationINS.state)},e.prototype.executeDependent=function(t){return"function"==typeof t?t(this.ImitationINS.state):t},i.prototype.setState=function(t){this.state="function"==typeof t?t(this.state):t,this.dispatch()},i.prototype.assignState=function(t){this.state=Object.assign(this.state,"function"==typeof t?t(this.state):t),this.dispatch()},i.prototype.register=function(){return this.MonitorINS.register(...arguments)},i.prototype.dispatch=function(){return this.MonitorINS.dispatch(...arguments)};const s=new i;window.Imitation=s}()}},e={};function i(s){var n=e[s];if(void 0!==n)return n.exports;var a=e[s]={exports:{}};return t[s](a,a.exports,i),a.exports}(()=>{"use strict";i(293),i(652),i(6);const t="build/music_1c31bcc267a545ef971109512053f3e50.jpeg",e="build/music_47a83799595b4a5b97145a6e594620310.jpeg",s="build/music_6e9e96c75cf04411baa154b1d6a3c7360.jpeg",n=[{key:1,name:"燃烧",type:"进攻卡",race:"火",limit:3,image:t,description:t=>`消耗10MP，造成 ${15*t+100} 伤害，并附加给目标一层灼烧印记。`,function:(t,e,i,s)=>[{type:"cost-mp",target:"self",value:-10},{type:"hit",target:"opposite",value:-(15*t.level+100)},{type:"buff",target:"opposite",value:"fire"}]},{key:2,name:"冰冻",type:"魔法卡",race:"水",limit:3,image:e,description:t=>`造成 ${15*t+30} 伤害，恢复 30MP。`,function:(t,e,i,s)=>[{type:"cost-mp",target:"self",value:30},{type:"hit",target:"opposite",value:-(15*t.level+30)}]},{key:3,name:"自然",type:"治疗卡",race:"木",limit:3,image:s,description:t=>"恢复 50HP、20MP，抽一张卡",function:(t,e,i,s)=>[{type:"cure-hp",target:"self",value:50},{type:"cure-mp",target:"self",value:20},{type:"pump-positive",target:"self",value:1}]},{key:4,name:"堕天",type:"进攻卡",race:"暗",limit:3,image:"build/music_072c59684f6c401dad40cadf0d0dd6290.jpeg",description:t=>`消耗50MP，造成 ${30*t+300} 伤害`,function:(t,e,i,s)=>[{type:"cost-mp",target:"self",value:-50},{type:"hit",target:"opposite",value:-(15*t.level+100)}]}],a=(t,e)=>{const i=t.reduce(((t,i)=>{const s=[...t],a=n.find((t=>i.key===t.key));return i.value.forEach((t=>{if(e){const e={...a,...t};delete e.number,s.push(...new Array(t.number).fill(e))}e||s.push({...a,...t})})),s}),[]);return i},o=t=>Number(Number(t).toFixed(2)),h=t=>{for(var e=[],i=t;i.length;){const t=Math.floor(Math.random()*i.length);e.push(i[t]),i=i.filter(((e,i)=>i!==t))}return e},r=(t,e,i)=>{const s=t=>l(t,i)?e(t):null;canvas.addEventListener(t,s,{passive:!0}),Imitation.state.removeEventListener.push((()=>canvas.removeEventListener(t,s)))},c=(t,e)=>{const i=t=>e(t);canvas.addEventListener(t,i,{passive:!0}),Imitation.state.removeEventListener.push((()=>canvas.removeEventListener(t,i)))},l=(t,e)=>{const i=e.x,s=e.y,n=e.width,a=e.height,o=t.x||t.touches[0].clientX,h=t.y||t.touches[0].clientY;return o>=i&&o<=i+n&&h>=s&&h<=s+a},d=(t,e)=>{const{x:i,y:s,width:n,height:a}=t,{x:o,y:h,width:r,height:c}=e;return i+n>o&&i<o+r&&s+a>h&&s<h+c},u=t=>{const e=new Image;return e.src=t,e},m=canvas.getContext("2d"),p=(t,e)=>{const i=e.x,s=e.y,n=e.width,a=e.height;var o=0,h=0,r=t.width,c=t.height;const l=Math.max(n/t.width,a/t.height),d=t.width*l-n,u=t.height*l-a;d&&(o=d/2/l,r-=d/l),u&&(h=u/2/l,c-=u/l),m.drawImage(t,o,h,r,c,i,s,n,a)},w=t=>{const e=t.x,i=t.y,s=t.width,n=t.height,a=t.radius;m.beginPath(),m.moveTo(e,i+a),m.arcTo(e,i,e+a,i,a),m.lineTo(e+s-a,i),m.arcTo(e+s,i,e+s,i+a,a),m.lineTo(e+s,i+n-a),m.arcTo(e+s,i+n,e+s-a,i+n,a),m.lineTo(e+a,i+n),m.arcTo(e,i+n,e,i+n-a,a),m.closePath()},g=t=>{const e=t.x,i=t.y,s=t.width,n=t.fontHeight;let a=t.text.split(""),o="",h=[];a.forEach((t=>{m.measureText(o).width>s&&(h.push(o),o=""),o+=t})),h.push(o),h.forEach(((t,s)=>{m.fillText(t,e,i+(s+1)*n)}))},f=canvas.getContext("2d"),y=u("build/162926_76690565815.jpg"),x=wx.getSystemInfoSync().windowWidth,v=wx.getSystemInfoSync().windowHeight,b=class{constructor(){this.opacity=0,this.count=0}render(){if(this.count<=20&&(this.opacity=o(this.opacity+.05),this.count=this.count+1),this.count>20&&this.count<=40&&(this.count=this.count+1),this.count>40&&this.count<=60&&(this.opacity=o(this.opacity-.05),this.count=this.count+1),this.count>60)return Imitation.state.page.current=Imitation.state.page.next,void(Imitation.state.page.next="");f.globalAlpha=this.opacity,p(y,{x:0,y:0,width:x,height:v}),f.globalAlpha=1}},I=canvas.getContext("2d");class S{constructor(t){this.x=t.x,this.y=t.y,this.width=t.width,this.height=t.height,this.radius=t.radius||8,this.font=t.font||14,this.opacity=t.opacity||1,this.text=t.text}get option(){return{x:this.x,y:this.y,width:this.width,height:this.height}}render(){I.textAlign="center",I.textBaseline="middle",I.font=`bold ${this.font}px monospace`,I.fillStyle=`rgba(255, 255, 255, ${this.opacity})`,w({x:this.x,y:this.y,width:this.width,height:this.height,radius:this.radius}),I.fill(),I.fillStyle="black",I.fillText(this.text,this.x+this.width/2,this.y+this.height/2)}}canvas.getContext("2d");const B=u("build/music_56280e428411459c823ce172d97da20c0.jpeg"),T=wx.getSystemInfoSync().windowWidth,A=wx.getSystemInfoSync().windowHeight,P=class{constructor(){}drawButtonBattle(){const t={x:T/2-60,y:.7*A-60,width:120,height:40,text:"战斗"};new S(t).render(),r("touchstart",(()=>{Imitation.state.page.current="transition",Imitation.state.page.next="battle"}),t)}drawButtonExplore(){const t={x:T/2-60,y:.7*A,width:120,height:40,text:"探索"};new S(t).render(),r("touchstart",(()=>{Imitation.state.page.current="transition",Imitation.state.page.next="explore"}),t)}drawButtonStore(){const t={x:T/2-60,y:.7*A+60,width:120,height:40,text:"仓库"};new S(t).render(),r("touchstart",(()=>{Imitation.state.page.current="transition",Imitation.state.page.next="store"}),t)}drawBackground(){p(B,{x:0,y:0,width:T,height:A})}render(){this.drawBackground(),this.drawButtonBattle(),this.drawButtonExplore(),this.drawButtonStore()}},C=canvas.getContext("2d");class H{constructor(t){this.x=t.x,this.y=t.y,this.width=t.width,this.height=t.height,this.radius=t.radius,this.scrollX=t.scrollX||0,this.scrollY=t.scrollY||0,this.scrollPosition=[0,0],this.mouseDownPosition=null,this.clipFunction=()=>{const t={x:this.x,y:this.y,width:this.width,height:this.height,radius:this.radius};return w(t),t}}get option(){return{x:this.x,y:this.y,width:this.width,height:this.height}}eventDown(t){try{this.mouseDownPosition=[t.x||t.touches[0].clientX,t.y||t.touches[0].clientY]}catch{}}eventUp(t){this.mouseDownPosition=null}eventMove(t){if(!this.mouseDownPosition)return;if(this.scrollX<=0&&this.scrollY<=0)return;clearTimeout(this.scrollbarTimeout),this.scrollbarTimeout=setTimeout((()=>this.scrollbarTimeout=null),1e3);const e=(t.pageX||t.targetTouches[0].pageX)-this.mouseDownPosition[0],i=(t.pageY||t.targetTouches[0].pageY)-this.mouseDownPosition[1];this.mouseDownPosition=[this.mouseDownPosition[0]+e,this.mouseDownPosition[1]+i];var s=this.scrollPosition[0]-e,n=this.scrollPosition[1]-i;this.scrollX>0&&(s<=0&&(s=0),s>this.scrollX&&(s=this.scrollX)),this.scrollY>0&&(n<=0&&(n=0),n>this.scrollY&&(n=this.scrollY)),this.scrollPosition=[s,n]}render(t){C.save();const e=this.clipFunction();C.clip(),t(this.scrollPosition),C.restore(),r("touchstart",this.eventDown.bind(this),e),c("touchmove",this.eventMove.bind(this)),c("touchend",this.eventUp.bind(this))}}const D=canvas.getContext("2d"),M=u(t),E=wx.getSystemInfoSync().safeArea.top,k=wx.getSystemInfoSync().windowWidth,O=wx.getSystemInfoSync().windowHeight,L=class{constructor(){this.exploreMap,this.InstanceScrollBox,this.InstanceScrollList,this.instance()}get scrollListHeight(){const t=this.exploreMap.length;return 0===t?0:160*t+(t?12*(t-1):0)}instance(){this.exploreMap=Imitation.state.explore.map,this.instanceScrollBox(),this.instanceScrollList()}instanceScrollBox(){const t={x:12,y:60+E,width:k-24,height:O-72-E,radius:12,scrollbarHidden:!0};this.InstanceScrollBox=new H(t),this.InstanceScrollBox.scrollY=this.scrollListHeight-this.InstanceScrollBox.height}instanceScrollList(){this.InstanceScrollList=this.exploreMap.map(((t,e)=>{const i=new H({x:12,y:60+172*e+E,width:k-24,height:160,radius:12,scrollbarHidden:!0});return i.extra=t,i.scrollX=92*t.list.length+12-i.width,i}))}drawScrollBox(){this.InstanceScrollBox.render((t=>{const e=t[1];this.drawScrollList(e)}))}drawScrollList(t){this.InstanceScrollList.forEach(((e,i)=>{const s={...e.option,y:e.y-t,radius:e.radius};w(s),D.fillStyle="rgba(255, 255, 255, 0.7)",D.fill(),e.offsetY=0-t,e.render((s=>{const n=s[0];this.drawScrollContent(e.extra,n,t,i)}))}))}drawScrollContent(t,e,i,s){D.textAlign="start",D.textBaseline="top",D.fillStyle="black",D.font="bold 12px monospace",D.fillText(t.name,24,72+172*s-i+E),t.list.forEach(((t,n)=>{const a={width:80,height:80,y:108+172*s-i+E,font:12,text:t.name};a.x=24+(a.width+12)*n-e,new S(a).render()}))}drawButtonHome(){const t={x:12,y:12+E,width:72,height:36,text:"Back"};new S(t).render(),r("touchstart",(()=>{Imitation.state.page.current="transition",Imitation.state.page.next="home"}),t)}drawBackground(){p(M,{x:0,y:0,width:k,height:O})}render(){this.drawBackground(),this.drawButtonHome(),this.drawScrollBox()}},Y=canvas.getContext("2d"),X=u(t),$=u(s),R=u("build/music_b40316005b55465b80ae4eecad8447960.jpeg"),Q=wx.getSystemInfoSync().safeArea.top,_=wx.getSystemInfoSync().windowWidth,W=wx.getSystemInfoSync().windowHeight;class N{constructor(t){this.x=t.x,this.y=t.y,this.width=t.width,this.height=t.height,this.battler=t.battler,this.imageIns=t.imageIns,this.beHitAnimation=!1,this.beHitAnimationTime=0,this.beCureAnimation=!1,this.beCureAnimationTime=0}beHit(){this.beHitAnimation=!0}beCure(){this.beCureAnimation=!0}render(){const t=this.x,e=this.y,i=this.width,s=this.height,n=this.battler;Y.save(),w({x:t,y:e,width:i,height:s,radius:12}),Y.clip(),p(this.imageIns,{x:t,y:e,width:i,height:s}),Y.fillStyle="white",Y.font="bold 12px monospace",Y.textAlign="start",Y.textBaseline="top",Y.fillText(`HP: ${n.HP}`,t+12,e+12),Y.fillText(`MP: ${n.MP}`,t+12,e+30),Y.fillText(`牌库: ${n.card.store.length}`,t+12,e+48),Y.fillText(`手牌: ${n.card.hand.length}`,t+12,e+66),Y.fillText(`墓地: ${n.card.cemetery.length}`,t+12,e+84),Y.fillText(this.battler.buff.join(" · "),t+12,e+102),Y.restore()}}class j{constructor(t){this.x=t.x,this.y=t.y,this.width=t.width,this.height=t.height,this.offsetX=t.offsetX||0,this.offsetY=t.offsetY||0,this.nova=t.nova,this.novaTime=this.nova?0:1,this.card=t.card,this.touchStart=t.touchStart,this.touchEnd=t.touchEnd,this.actionHeight=t.actionHeight,this.useAble=!1,this.useAbleTime=0,this.mouseDownPosition=null,this.mouseDownPositionTime=0,this.imageDOM}eventDown(t){try{this.mouseDownPosition=[t.x||t.touches[0].clientX,t.y||t.touches[0].clientY],this.touchStart()}catch{}}eventUp(t){this.mouseDownPosition=null,this.offsetX=0,this.offsetY=0,this.useAble&&this.touchEnd()}eventMove(t){if(!this.mouseDownPosition)return;clearTimeout(this.scrollbarTimeout),this.scrollbarTimeout=setTimeout((()=>this.scrollbarTimeout=null),1e3);const e=(t.pageX||t.targetTouches[0].pageX)-this.mouseDownPosition[0],i=(t.pageY||t.targetTouches[0].pageY)-this.mouseDownPosition[1];this.mouseDownPosition=[this.mouseDownPosition[0]+e,this.mouseDownPosition[1]+i],this.offsetX=this.offsetX+e,this.offsetY=this.offsetY+i}render(){this.imageDOM&&this.imageDOM.src===this.card.image||(this.imageDOM=u(this.card.image)),this.novaTime<1&&(this.novaTime=o(this.novaTime+.05)),this.useAble=this.offsetY<0-this.actionHeight/2,this.mouseDownPosition&&this.mouseDownPositionTime<1&&(this.mouseDownPositionTime=o(this.mouseDownPositionTime+.1)),!this.mouseDownPosition&&this.mouseDownPositionTime>0&&(this.mouseDownPositionTime=0),this.useAble&&this.useAbleTime<1&&(this.useAbleTime=o(this.useAbleTime+.1)),!this.useAble&&this.useAbleTime>0&&(this.useAbleTime=o(this.useAbleTime-.1));const t=this.card,e=.5*-this.width,i=.5*-this.height,s=this.width,n=this.height,a=this.x+this.offsetX+e*this.mouseDownPositionTime,h=this.y+this.offsetY+i*this.mouseDownPositionTime,l=this.width+s*this.mouseDownPositionTime,d=this.height+n*this.mouseDownPositionTime;Y.save(),Y.globalAlpha=this.novaTime,w({x:a,y:h,width:l,height:d,radius:.08*l}),this.useAbleTime&&(Y.shadowBlur=40*this.useAbleTime,Y.shadowColor="black",Y.fill(),Y.shadowBlur=0),Y.clip(),p(this.imageDOM,{x:a,y:h,width:l,height:d}),Y.fillStyle="rgba(255, 255, 255, 1)",Y.textAlign="center",Y.textBaseline="middle",Y.font=`bold ${.075*l}px monospace`,this.mouseDownPosition||(Y.fillText(t.name,a+l/2,h+.12*l),t.number&&Y.fillText("X"+t.number,a+l-.12*l,h+.12*l),Y.textAlign="start",Y.fillText("Lv"+t.level,a+.08*l,h+.36*l),g({x:a+.08*l,y:h+.48*l,width:l-.25*l,fontHeight:.12*l,text:t.description(1)})),this.mouseDownPosition&&(Y.fillText(t.name,a+l/2,h+.12*l),t.number&&Y.fillText("X"+t.number,a+l-.12*l,h+.12*l),Y.textAlign="start",Y.fillText("Lv"+t.level,a+.08*l,h+.36*l),Y.fillText(`${t.race} · ${t.type}`,a+.08*l,h+.48*l),g({x:a+.08*l,y:h+.6*l,width:l-.25*l,fontHeight:.12*l,text:t.description(1)})),Y.restore(),r("touchstart",this.eventDown.bind(this),{x:a,y:h,width:l,height:d}),c("touchmove",this.eventMove.bind(this)),c("touchend",this.eventUp.bind(this))}}class U{constructor(t){this.x=t.x,this.y=t.y,this.width=t.width,this.height=t.height,this.InstanceBattlerSelf=t.InstanceBattlerSelf,this.InstanceBattlerOpposite=t.InstanceBattlerOpposite,this.cards=t.cards,this.env=t.env,this.useCard=t.useCard,this.overRound=t.overRound,this.touchCard,this.InstanceCards=[]}get option(){return{x:this.x,y:this.y,width:this.width,height:this.height}}get cardHeight(){return 1.35*(this.width/4-12)}updateCards(t){this.cards=t;const e=this.x,i=this.y,s=this.width,n=this.height;this.InstanceCards=this.InstanceCards.filter((t=>this.cards.find((e=>e===t.card)))),this.cards.forEach(((a,o)=>{const h=o-(t.length/2-.5),r={width:s/4-4-s/48};r.height=1.35*r.width,r.x=e+(s-r.width)/2+h*(s/4-4),r.y=i+(n-r.height)/2,r.touchStart=()=>this.touchCard=a,r.touchEnd=()=>this.useCard(a,this.InstanceBattlerSelf),r.actionHeight=this.height;const c=this.InstanceCards.find((t=>t.card===a));c&&(c.x=r.x),c||this.InstanceCards.push(new j({card:a,nova:!0,...r}))}))}updateEnv(t){this.env=t}drawEnv(){const t={x:this.x+12,y:this.y+this.height/2-this.cardHeight/2-42,width:this.width-24,height:30,font:10,text:`ROUND ${this.env.round}`};new S(t).render()}drawButtonOverRound(){const t={x:this.x+this.width-84,y:this.y+this.height/2+this.cardHeight/2+12,width:72,height:30,font:10,text:"结束回合"};new S(t).render(),r("touchstart",(()=>{this.overRound()}),t)}drawButtonConsume(){const t={x:this.x+12,y:this.y+this.height/2+this.cardHeight/2+12,width:72,height:30,font:10,text:"查看消耗"};new S(t).render(),r("touchstart",(()=>{this.overRound()}),t)}drawButtonCemetery(){const t={x:this.x+96,y:this.y+this.height/2+this.cardHeight/2+12,width:72,height:30,font:10,text:"查看墓地"};new S(t).render(),r("touchstart",(()=>{this.overRound()}),t)}drawBackground(){w({...this.option,radius:12,x:12,width:_-24}),Y.fillStyle="rgba(255, 255, 255, 0.5)",Y.fill()}render(){this.drawBackground(),this.drawEnv(),this.drawButtonOverRound(),this.drawButtonConsume(),this.drawButtonCemetery(),this.InstanceCards.forEach((t=>t.card!==this.touchCard?t.render():null)),this.InstanceCards.forEach((t=>t.card===this.touchCard?t.render():null))}}class F{constructor(){this.cards=[]}render(){}}const q=class{constructor(){this.animationing=!1,this.modal=null,this.env={round:1},this.InstanceBattlerSelf,this.InstanceBattlerOpposite,this.InstanceAction,this.InstanceModal,this.instanceBattlerSelf(),this.instanceBattlerOpposite(),this.instanceAction(),this.instanceModal(),this.initBattler()}initBattler(){this.InstanceBattlerSelf.battler.card.store=[...this.InstanceBattlerSelf.battler.card.team],this.InstanceBattlerOpposite.battler.card.store=[...this.InstanceBattlerOpposite.battler.card.team],new Array(4).fill().forEach((t=>{this.InstanceBattlerSelf.battler.card.hand.push(this.InstanceBattlerSelf.battler.card.store.shift())})),new Array(4).fill().forEach((t=>{this.InstanceBattlerOpposite.battler.card.hand.push(this.InstanceBattlerOpposite.battler.card.store.shift())})),this.InstanceAction.updateCards(this.InstanceBattlerSelf.battler.card.hand)}instanceBattlerSelf(){const t=.5*W/2;this.InstanceBattlerSelf=new N({x:12,y:72+t+Q,width:_-24,height:t,imageIns:R,battler:Imitation.state.battle.self}),this.InstanceBattlerSelf.battler.card.team=h(a(Imitation.state.info.team[0],!0))}instanceBattlerOpposite(){const t=.5*W/2;this.InstanceBattlerOpposite=new N({x:12,y:60+Q,width:_-24,height:t,imageIns:$,battler:Imitation.state.battle.opposite}),this.InstanceBattlerOpposite.battler.card.team=h(a(Imitation.state.info.team[0],!0))}instanceAction(){var t=_-24,e=.5*W-96;t>W-160&&(t=W-160),e>t/2+60&&(e=t/2+60),this.InstanceAction=new U({x:(_-t)/2,y:W-e-12,width:t,height:e,cards:this.InstanceBattlerSelf.battler.card.hand,env:this.env,InstanceBattlerSelf:this.InstanceBattlerSelf,InstanceBattlerOpposite:this.InstanceBattlerOpposite,useCard:this.useCard,overRound:this.overRound})}instanceModal(){this.InstanceModal=new F}drawBattlerSelf(){this.InstanceBattlerSelf.render()}drawBattlerOpposite(){this.InstanceBattlerOpposite.render()}drawAction(){this.InstanceAction.render()}drawBackground(){p(X,{x:0,y:0,width:_,height:W})}drawButtonHome(){const t={x:12,y:12+Q,width:72,height:36,text:"Home"};new S(t).render(),r("touchstart",(()=>{Imitation.state.page.current="transition",Imitation.state.page.next="home"}),t)}useCard=(t,e)=>{this.animationing=!0;const[i,s]=e===this.InstanceBattlerSelf?[this.InstanceBattlerSelf,this.InstanceBattlerOpposite]:[this.InstanceBattlerOpposite,this.InstanceBattlerSelf],n=t.function(t,i.battler,s.battler,this.env);for(;n.length;){const t=n.shift();"cost-mp"===t.type&&"self"===t.target&&(i.battler.MP=i.battler.MP+t.value),"hit"===t.type&&(Imitation.state.function.sound("hit"),"opposite"===t.target&&(s.battler.HP=s.battler.HP+t.value)),"buff"===t.type&&("self"===t.target&&i.battler.buff.push(t.value),"opposite"===t.target&&s.battler.buff.push(t.value)),"cure-hp"===t.type&&"self"===t.target&&(i.battler.HP=i.battler.HP+t.value),"cure-mp"===t.type&&"self"===t.target&&(i.battler.MP=i.battler.MP+t.value),"pump-positive"===t.type&&"self"===t.target&&new Array(t.value).fill().forEach((t=>{this.InstanceBattlerSelf.battler.card.hand.push(this.InstanceBattlerSelf.battler.card.store.shift())}))}i.battler.card.hand=i.battler.card.hand.filter((e=>e!==t)),i.battler.card.cemetery.push(t),i.battler.card.consume.push(t),this.animationing=!1,this.InstanceAction.updateCards(this.InstanceBattlerSelf.battler.card.hand)};overRound=()=>{};render(){this.drawBackground(),this.drawButtonHome(),this.drawBattlerSelf(),this.drawBattlerOpposite(),this.drawAction()}},J=canvas.getContext("2d"),K=u(t),z=u(e),G=wx.getSystemInfoSync().safeArea.top,V=wx.getSystemInfoSync().windowWidth,Z=wx.getSystemInfoSync().windowHeight;class tt{constructor(t){this.x=t.x,this.y=t.y,this.width=t.width,this.height=t.height,this.offsetX=t.offsetX||0,this.offsetY=t.offsetY||0,this.card=t.card,this.touchAble=t.touchAble,this.touchEvent=t.touchEvent,this.touchDelayTime=t.touchDelayTime,this.touchArea=t.touchArea,this.touchTimeout,this.displayMode=t.displayMode,this.imageDOM}get option(){return{x:this.x,y:this.y,width:this.width,height:this.height}}eventDown(t){this.touchArea&&!l(t,this.touchArea)||(this.touchTimeout=!0)}eventUp(t){!0===this.touchTimeout&&this.touchEvent(),this.touchTimeout=!1}eventMove(t){this.touchTimeout=!1}render(){this.imageDOM&&this.imageDOM.src===this.card.image||(this.imageDOM=u(this.card.image));const t=this.x+this.offsetX,e=this.y+this.offsetY,i=this.width,s=this.height,n=this.card;J.save(),w({x:t,y:e,width:i,height:s,radius:.08*i}),J.clip(),p(this.imageDOM,{x:t,y:e,width:i,height:s}),J.fillStyle="rgba(255, 255, 255, 1)",J.textAlign="center",J.textBaseline="middle",J.font=`bold ${.075*i}px monospace`,"card"===this.displayMode&&(J.fillText(n.name,t+i/2,e+.12*i),n.number&&J.fillText("X"+n.number,t+i-.12*i,e+.12*i),J.textAlign="start",J.fillText("Lv"+n.level,t+.08*i,e+.36*i),g({x:t+.08*i,y:e+.48*i,width:i-.25*i,fontHeight:.12*i,text:n.description(1)})),"preview"===this.displayMode&&(J.fillText(n.name,t+i/2,e+.12*i),n.number&&J.fillText("X"+n.number,t+i-.12*i,e+.12*i),J.textAlign="start",J.fillText("Lv"+n.level,t+.08*i,e+.36*i),J.fillText(`${n.race} · ${n.type}`,t+.08*i,e+.48*i),g({x:t+.08*i,y:e+.6*i,width:i-.25*i,fontHeight:.12*i,text:n.description(1)})),J.restore(),this.touchAble&&(r("touchstart",this.eventDown.bind(this),{x:t,y:e,width:i,height:s}),c("touchmove",this.eventMove.bind(this)),c("touchend",this.eventUp.bind(this)))}}const et=class{constructor(){this.preview=null,this.type="team",this.sort="name",this.card,this.InstanceScroll,this.InstanceCard,this.InstancePreview,this.initCard(),this.instanceScroll(),this.instanceCard(),this.instancePreview()}get bannerHeight(){return 180}get cardHeight(){const t=Math.ceil(this.card.length/4);return 0===t?0:(V-60)/4*1.35*t+(t?12*(t-1):0)}initCard(){"team"===this.type&&(this.card=a(Imitation.state.info.team[Imitation.state.info.teamIndex],!0).sort(((t,e)=>e[this.sort]-t[this.sort]))),"library"===this.type&&(this.card=a(Imitation.state.info.cardLibrary).sort(((t,e)=>e[this.sort]-t[this.sort])))}instanceScroll(){const t={x:12,y:60+G,width:V-24,height:Z-72-G,radius:12};this.InstanceScroll=new H(t),this.InstanceScroll.scrollY=this.bannerHeight+this.cardHeight-this.InstanceScroll.height+12}instanceCard(){this.InstanceCard=this.card.map(((t,e)=>{const i={width:(V-60)/4,card:t,displayMode:"card",touchArea:this.InstanceScroll.option,touchEvent:()=>this.preview=t};return i.height=1.35*i.width,i.x=12+parseInt(e%4)*(i.width+12),i.y=72+parseInt(e/4)*(i.height+12)+this.bannerHeight+G,new tt(i)}))}instancePreview(){const t={width:.7*V,card:this.preview,displayMode:"preview"};t.height=1.35*t.width,t.x=.15*V,t.y=(Z-1.5*t.width)/2-60,this.InstancePreview=new tt(t)}drawScroll(){this.InstanceScroll.render((t=>{const e=t[1];this.drawBanner(e),this.drawCard(e)}))}drawBanner(t){const e={x:12,y:60-t+G,width:V-24,height:this.bannerHeight,radius:12};d(e,this.InstanceScroll.option)&&(J.save(),w(e),J.clip(),p(z,e),(()=>{new Array(Imitation.state.info.team.length).fill().forEach(((t,i)=>{const s={x:24+72*i,y:12+e.y,width:60,height:30,font:10,opacity:.5,text:`队伍 ${i+1}`};d(s,this.InstanceScroll.option)&&(i===Imitation.state.info.teamIndex&&(s.opacity=1),new S(s).render(),this.preview||r("touchstart",(t=>{l(t,this.InstanceScroll.option)&&(Imitation.state.info.teamIndex=i,this.type="team",this.initCard(),this.instanceScroll(),this.instanceCard())}),s))}))})(),(()=>{const t={x:V-54,y:12+e.y,width:30,height:30,font:10,opacity:.5,radius:15,text:"S"};d(t,this.InstanceScroll.option)&&("library"===this.type&&(t.opacity=1),new S(t).render(),this.preview||r("touchstart",(t=>{if(l(t,this.InstanceScroll.option))return"team"===this.type?(this.type="library",this.initCard(),this.instanceScroll(),void this.instanceCard()):"library"===this.type?(this.type="team",this.initCard(),this.instanceScroll(),void this.instanceCard()):void 0}),t))})(),(()=>{new Array(...[["name","名称"],["level","等级"],["type","类型"],["race","种类"]]).forEach(((t,i)=>{const s={x:24+72*i,y:e.y+e.height-42,width:60,height:30,font:10,opacity:.5,text:t[1]};d(s,this.InstanceScroll.option)&&(t[0]===this.sort&&(s.opacity=1),new S(s).render(),this.preview||r("touchstart",(e=>{l(e,this.InstanceScroll.option)&&(this.sort=t[0],this.initCard(),this.instanceScroll(),this.instanceCard())}),s))}))})(),J.restore())}drawCard(t){this.InstanceCard.forEach((e=>{d({...e.option,y:e.y-t},this.InstanceScroll.option)&&(e.offsetY=0-t,e.touchAble=!this.preview,e.render())}))}drawPreview(){if(!this.preview)return;(t=>{const e=t.x,i=t.y,s=t.width,n=t.height;m.beginPath(),m.moveTo(e,i),m.lineTo(e+s,i),m.lineTo(e+s,i+n),m.lineTo(e,i+n),m.closePath()})({x:0,y:0,width:V,height:Z}),J.fillStyle="rgba(0, 0, 0, 0.75)",J.fill(),this.InstancePreview.card=this.preview,this.InstancePreview.render();const t=Z-this.InstancePreview.y-120;var e,i;if("library"===this.type&&(new S(e={x:V/2-60,y:t,width:120,height:40,radius:8,text:"装载"}).render(),r("touchstart",(()=>{this.load(this.preview),this.preview=null}),e),new S(i={x:V/2-60,y:t+60,width:120,height:40,radius:8,text:"合成"}).render(),r("touchstart",(()=>{this.compose(this.preview),this.preview=null}),i)),"team"===this.type){const e={x:V/2-60,y:t,width:120,height:40,radius:8,text:"卸载"};new S(e).render(),r("touchstart",(()=>{this.unload(this.preview),this.preview=null}),e)}c("touchstart",(t=>{e&&l(t,e)||i&&l(t,i)||(this.preview=null)}))}drawBackground(){p(K,{x:0,y:0,width:V,height:Z})}drawButtonHome(){const t={x:12,y:12+G,width:72,height:36,text:"Home"};new S(t).render(),this.preview||r("touchstart",(()=>{Imitation.state.page.current="transition",Imitation.state.page.next="home"}),t)}compose(t){const e=Imitation.state.info.cardLibrary.find((e=>e.key===t.key)),i=e.value.find((e=>e.level===t.level));if(i.number<3)return;i.number=i.number-3,0===i.number&&(e.value=e.value.filter((t=>t!==i)));const s=e.value.find((e=>e.level===t.level+1));s&&(s.number=s.number+1),s||e.value.push({level:t.level+1,number:1}),this.initCard(),this.instanceScroll(),this.instanceCard()}load(t){const e=Imitation.state.info.cardLibrary,i=Imitation.state.info.team[Imitation.state.info.teamIndex],s=i.find((e=>e.key===t.key)),n=()=>{this.initCard(),this.instanceScroll(),this.instanceCard(),this.instancePreview()};if(!s)return i.push({key:t.key,value:[{level:t.level,number:1}]}),void n();if(s.value.reduce(((t,e)=>t+e.number),0)===t.limit)return;const a=s.value.find((e=>e.level===t.level));if(!a)return s.value.push({level:t.level,number:1}),void n();const o=e.find((e=>e.key===t.key)).value.find((e=>e.level===t.level));return a&&a.number<o.number?(a.number=a.number+1,void n()):void 0}unload(t){const e=Imitation.state.info.team,i=Imitation.state.info.teamIndex,s=e[i].find((e=>e.key===t.key)),n=s.value.find((e=>e.level===t.level));n.number=n.number-1,0===n.number&&(s.value=s.value.filter((t=>t!==n))),0===s.value.length&&(e[i]=e[i].filter((t=>t!==s))),this.initCard(),this.instanceScroll(),this.instanceCard()}render(){this.drawBackground(),this.drawButtonHome(),this.drawScroll(),this.drawPreview()}},it=canvas.getContext("2d"),st=wx.getSystemInfoSync().windowWidth;wx.getSystemInfoSync().windowHeight;class nt{constructor(){this.message="",this.timeout=1e3,this.timeoutRef=null,this.show=!1,this.opacity=0}send(t){clearTimeout(this.timeoutRef),this.message=t,this.show=!0,this.timeoutRef=setTimeout((()=>{this.show=!1,this.timeoutRef=null}),this.timeout)}render(){this.show&&this.opacity<1&&(this.opacity=o(this.opacity+.05)),!this.show&&this.opacity>0&&(this.opacity=o(this.opacity-.05)),(this.show||0!==this.opacity)&&(it.textAlign="center",it.textBaseline="middle",it.font="bold 14px monospace",it.lineWidth=1,it.fillStyle=`rgba(0, 0, 0, ${this.opacity})`,it.fillText(this.message,st/2,24))}}class at{constructor(){this.map={JOJO_HBY:"build/_storages_386a-audiofreehighqps_DA_B0_CKwRINsEIkYTAAWoHgCR2Utt.mp3",hit:"build/5c88acd3ccdc817369.mp3"},this.audioQueue=new Array(8).fill().map((t=>new Audio))}play(t,e=!1){const i=this.audioQueue.find((t=>!t.playing));i.onended=()=>i.playing=!1,i.playing=!0,i.loop=e,i.src=this.map[t],i.play()}}const ot=canvas.getContext("2d"),ht=wx.getSystemInfoSync().windowWidth,rt=wx.getSystemInfoSync().windowHeight;class ct{constructor(){window.SaveImage=()=>{const t=document.createElement("a");t.href=canvas.toDataURL(),t.download="image",t.click()}}render(){const t=ht,e=rt,i=n[0];w({x:0,y:0,width:t,height:e,radius:.08*t}),ot.clip(),p(u(i.image),{x:0,y:0,width:t,height:e}),ot.fillStyle="rgba(255, 255, 255, 1)",ot.textAlign="center",ot.textBaseline="middle",ot.font=`bold ${.075*t}px monospace`,ot.fillText(i.name,0+t/2,0+.12*t),i.number&&ot.fillText("X"+i.number,0+t-.12*t,0+.12*t),ot.textAlign="start",ot.fillText(`${i.race} · ${i.type}`,0+.08*t,0+.48*t),g({x:0+.08*t,y:0+.6*t,width:t-.25*t,fontHeight:.12*t,text:i.description(1)})}}const lt=[{name:"主线挑战",list:[{name:"挑战一",boss:{},card:[],reward:[]},{name:"挑战"},{name:"挑战"},{name:"挑战"},{name:"挑战"},{name:"挑战"},{name:"挑战"},{name:"挑战"}]},{name:"主线挑战",list:[{name:"挑战"},{name:"挑战"},{name:"挑战"},{name:"挑战"},{name:"挑战"},{name:"挑战"},{name:"挑战"},{name:"挑战"}]},{name:"主线挑战",list:[{name:"挑战"}]},{name:"主线挑战",list:[{name:"挑战"}]},{name:"主线挑战",list:[{name:"挑战"}]}],dt=canvas.getContext("2d");new class{constructor(){this.animationFrameId,this.instance,this.instanceMessage=new nt,this.instanceSound=new at,this.ImitationInit(),this.loopStart()}render(){dt.clearRect(0,0,canvas.width,canvas.height),Imitation.state.removeEventListener.forEach((t=>t())),Imitation.state.removeEventListener=[];const t=Imitation.state.page.map[Imitation.state.page.current];this.instance instanceof t||(this.instance=new t),this.instance.render(),this.instanceMessage.render()}loopStart(){this.animationFrameId=requestAnimationFrame((()=>{this.render(),this.loopStart()}))}loopEnd(){cancelAnimationFrame(this.animationFrameId)}ImitationInit(){Imitation.state={page:{current:"home",next:"",map:{"save-image":ct,transition:b,home:P,explore:L,battle:q,store:et}},removeEventListener:[],info:{cardLibrary:[],team:[[],[],[],[]],teamIndex:0},explore:{map:[]},battle:{self:{HP:1e3,MP:1e3,card:{team:[],store:[],hand:[],cemetery:[],consume:[]},buff:[]},opposite:{HP:1e3,MP:1e3,card:{team:[],store:[],hand:[],cemetery:[],consume:[]},buff:[]}},function:{render:this.render,loopStart:this.loopStart,loopEnd:this.loopEnd,message:t=>this.instanceMessage.send(t),sound:t=>this.instanceSound.play(t)}},Imitation.state.info.cardLibrary=n.map((t=>({key:t.key,value:[{level:1,number:10},{level:2,number:4}]}))),Imitation.state.info.cardLibrary=[...Imitation.state.info.cardLibrary,...Imitation.state.info.cardLibrary,...Imitation.state.info.cardLibrary],Imitation.state.info.team[0]=n.map((t=>({key:t.key,value:[{level:1,number:1}]}))),Imitation.state.info.team[0]=[...Imitation.state.info.team[0],...Imitation.state.info.team[0]],Imitation.state.explore.map=lt}}})()})();