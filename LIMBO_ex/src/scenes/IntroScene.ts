import Phaser from 'phaser';

type Point = { x:number; y:number };

type GameState = {
  lives: number;
  shards: number;
  totalShards: number;
  firewall: number;
  gameOver: boolean;
  won: boolean;
  hintCooldown: number;
};

const TILE = 40;
const COLS = 20;
const ROWS = 15;
const W = COLS * TILE;
const H = ROWS * TILE;

// 1 wall, 0 floor, 2 exit gate, 3 console, 4 pillar.
const MAP = [
  '11111111111111111111',
  '10001000001000000001',
  '10301011101040104001',
  '10000010000000000001',
  '10111110111110111011',
  '10000000100010100001',
  '10404000103010103001',
  '10000000000000000001',
  '10110111101111101101',
  '10001010000010001001',
  '10301010404010401001',
  '10001010000010001001',
  '11101011101111101011',
  '10000000000000000021',
  '11111111111111111111'
];

const SHARDS: Point[] = [
  {x:2,y:5}, {x:17,y:3}, {x:11,y:7}, {x:5,y:13}, {x:16,y:13}
];
const FIREWALLS: Point[] = [{x:2,y:2},{x:12,y:2},{x:10,y:6},{x:16,y:6}];
const START: Point = {x:1,y:1};
const WATCHER_START: Point = {x:18,y:13};

export class IntroScene extends Phaser.Scene {
  private player!: Phaser.GameObjects.Container;
  private watcher!: Phaser.GameObjects.Container;
  private shards: Phaser.GameObjects.Container[] = [];
  private firewallNodes: Phaser.GameObjects.Container[] = [];
  private exitGlow!: Phaser.GameObjects.Rectangle;
  private overlay!: Phaser.GameObjects.Graphics;
  private darkness!: Phaser.GameObjects.Graphics;
  private hud!: Phaser.GameObjects.Text;
  private feed!: Phaser.GameObjects.Text;
  private prompt!: Phaser.GameObjects.Text;
  private state: GameState = { lives:3, shards:0, totalShards:SHARDS.length, firewall:0, gameOver:false, won:false, hintCooldown:0 };
  private playerTile = {...START};
  private watcherTile = {...WATCHER_START};
  private moveLock = false;
  private watcherTimer = 0;
  private messageTimer = 0;
  private keys!: Record<string, Phaser.Input.Keyboard.Key>;
  private touchDir: Point = {x:0,y:0};
  private pulse = 0;
  private audio?: AudioContext;
  private booting = true;
  private glitchTimer = 0;
  private glitchUntil = 0;
  private endGlitch = false;

  constructor(){ super('IntroScene'); }

  create(): void {
    this.cameras.main.setBackgroundColor('#02040a');
    this.drawMap();
    this.createEntities();
    this.createUI();
    this.createInput();
    this.bindAudio();
    this.log('LIMBO LINK: восстановление узла запущено.', '#00f0ff');
    this.log('СИСТЕМА: синие фрагменты — потерянные данные. Соберите все.', '#8aa4b8');
    this.log('СИСТЕМА: жёлтые ядра временно делают вирусы уязвимыми.', '#ffe66d');
    this.log('ПРЕДУПРЕЖДЕНИЕ: контакт с вирусом разрывает соединение.', '#ff496d');
    this.log('ЦЕЛЬ: собрать 5 фрагментов и добраться до EXIT.', '#7cf29a');
    this.showPrompt('WASD / СТРЕЛКИ — движение   •   SPACE — импульс   •   E — скан');
    this.updateHud();
    this.startGlitchIntro();
  }

  update(time:number, delta:number): void {
    if(this.booting){
      this.updateBootGlitch(delta);
      return;
    }
    if(this.state.gameOver || this.state.won){
      if(this.endGlitch) this.updateEndGlitch(delta);
      return;
    }
    this.pulse += delta * 0.004;
    this.state.hintCooldown = Math.max(0, this.state.hintCooldown - delta);
    this.messageTimer = Math.max(0, this.messageTimer - delta);
    this.watcherTimer += delta;
    if(this.watcherTimer > (this.state.firewall > 0 ? 460 : 650)){
      this.watcherTimer = 0;
      this.moveWatcher();
    }
    this.updateFX();
    this.readMovement();
    this.checkContacts();
  }


  private startGlitchIntro(): void {
    this.booting = true;
    this.glitchUntil = this.time.now + 2600;
    this.glitchTimer = 0;
    const veil = this.add.rectangle(480,360,960,720,0x010208,1).setDepth(120);
    const title = this.add.text(480,300,'P.R.I.N.C. // LIMBO',{
      fontFamily:'monospace',fontSize:'30px',color:'#00f0ff',fontStyle:'bold'
    }).setOrigin(.5).setDepth(121);
    const status = this.add.text(480,345,'INITIALIZING NEURAL CONTAINMENT NODE',{
      fontFamily:'monospace',fontSize:'13px',color:'#8aa4b8'
    }).setOrigin(.5).setDepth(121);
    const bar = this.add.rectangle(480,390,360,4,0x16314a,1).setDepth(121);
    const fill = this.add.rectangle(300,390,1,4,0x00f0ff,1).setOrigin(0,.5).setDepth(122);
    this.tweens.add({targets:fill,width:360,duration:2200,ease:'Linear'});
    this.tweens.add({targets:title,alpha:0,duration:350,delay:2150});
    this.tweens.add({targets:status,alpha:0,duration:350,delay:2150});
    this.tweens.add({targets:veil,alpha:0,duration:450,delay:2350,onComplete:()=>{
      veil.destroy(); title.destroy(); status.destroy(); bar.destroy(); fill.destroy();
      this.booting=false;
      this.log('LIMBO LINK: канал синхронизирован.','#00f0ff');
    }});
  }

  private updateBootGlitch(delta:number): void {
    this.glitchTimer += delta;
    if(this.glitchTimer < 90) return;
    this.glitchTimer = 0;
    this.glitchBurst(0.35, 120, 70);
    this.beep(Phaser.Math.Between(90,900),.035);
  }

  private updateEndGlitch(delta:number): void {
    this.glitchTimer += delta;
    if(this.glitchTimer < 75) return;
    this.glitchTimer = 0;
    const intensity = this.state.won ? 0.75 : 1;
    this.glitchBurst(intensity, 180, 100);
  }

  private glitchBurst(intensity:number, slices:number, blocks:number): void {
    const g=this.add.graphics().setDepth(130);
    const count=Math.floor(5 + 10*intensity);
    for(let i=0;i<count;i++){
      const y=Phaser.Math.Between(60,700);
      const h=Phaser.Math.Between(2,Math.max(3,Math.floor(14*intensity)));
      const x=Phaser.Math.Between(-40,40);
      const w=Phaser.Math.Between(80,Math.floor(slices*(.7+intensity)));
      const colors=[0x00eaff,0xff315c,0x7cf29a,0xffffff];
      g.fillStyle(Phaser.Utils.Array.GetRandom(colors),Phaser.Math.FloatBetween(.08,.35)*intensity);
      g.fillRect(x,y,w,h);
    }
    for(let i=0;i<Math.floor(blocks/30);i++){
      g.fillStyle(Phaser.Utils.Array.GetRandom([0x00eaff,0xff315c]),Phaser.Math.FloatBetween(.1,.25));
      g.fillRect(Phaser.Math.Between(0,W),Phaser.Math.Between(70,H-80),Phaser.Math.Between(8,45),Phaser.Math.Between(3,12));
    }
    const shift=Phaser.Math.Between(-10,10)*intensity;
    this.cameras.main.setScroll(shift,Phaser.Math.Between(-3,3)*intensity);
    this.time.delayedCall(Phaser.Math.Between(35,85),()=>{
      g.destroy();
      this.cameras.main.setScroll(0,0);
    });
  }

  private drawMap(): void {
    const g = this.add.graphics();
    g.fillStyle(0x030711,1).fillRect(0,0,W,H);
    for(let y=0;y<ROWS;y++) for(let x=0;x<COLS;x++){
      const t=MAP[y][x]; const px=x*TILE, py=y*TILE;
      if(t==='1' || t==='4'){
        g.fillStyle(t==='1'?0x0b1430:0x111b3b,1).fillRect(px,py,TILE,TILE);
        g.lineStyle(1,0x23365e,0.8).strokeRect(px+3,py+3,TILE-6,TILE-6);
        if(t==='4') g.fillStyle(0x31508a,0.7).fillRect(px+11,py+11,TILE-22,TILE-22);
      } else {
        g.fillStyle(0x050a16,1).fillRect(px,py,TILE,TILE);
        g.lineStyle(1,0x0d1b2f,0.8).strokeRect(px,py,TILE,TILE);
      }
      if(t==='3'){
        g.fillStyle(0x00d8ff,0.14).fillRect(px+7,py+7,TILE-14,TILE-14);
        g.lineStyle(2,0x00d8ff,0.8).strokeRect(px+9,py+9,TILE-18,TILE-18);
      }
      if(t==='2'){
        g.fillStyle(0xff315c,0.22).fillRect(px,py,TILE,TILE);
        g.lineStyle(3,0xff315c,1).strokeRect(px+5,py+5,TILE-10,TILE-10);
      }
    }
    this.exitGlow=this.add.rectangle((19+.5)*TILE,(13+.5)*TILE,TILE-10,TILE-10,0xff315c,0.25).setDepth(2);
  }

  private createEntities(): void {
    this.player=this.makeCat(START.x*TILE+TILE/2,START.y*TILE+TILE/2,0x7cf7ff);
    this.watcher=this.makeVirus(WATCHER_START.x*TILE+TILE/2,WATCHER_START.y*TILE+TILE/2,0xff315c);
    this.playerTile={...START}; this.watcherTile={...WATCHER_START};

    for(const p of SHARDS){
      const c=this.add.container(p.x*TILE+TILE/2,p.y*TILE+TILE/2).setDepth(5);
      c.add(this.add.rectangle(0,0,10,10,0x00eaff).setRotation(Math.PI/4));
      c.add(this.add.circle(0,0,14,0x00eaff,0.08));
      this.shards.push(c);
    }
    for(const p of FIREWALLS){
      const c=this.add.container(p.x*TILE+TILE/2,p.y*TILE+TILE/2).setDepth(5);
      c.add(this.add.circle(0,0,12,0xffe66d,0.22));
      c.add(this.add.circle(0,0,6,0xffe66d,1));
      this.firewallNodes.push(c);
    }
  }

  private makeCat(x:number,y:number,color:number){
    const c=this.add.container(x,y).setDepth(10);
    const body=this.add.circle(0,4,12,color,1);
    const head=this.add.circle(0,-7,11,color,1);
    const ear1=this.add.triangle(-7,-17,-7,-5,-1,-11,color,1);
    const ear2=this.add.triangle(7,-17,7,-5,1,-11,color,1);
    const eye1=this.add.circle(-4,-8,2,0x06101a,1); const eye2=this.add.circle(4,-8,2,0x06101a,1);
    c.add([body,head,ear1,ear2,eye1,eye2]); return c;
  }

  private makeVirus(x:number,y:number,color:number){
    const c=this.add.container(x,y).setDepth(9);
    const core=this.add.circle(0,0,13,color,1);
    for(let i=0;i<8;i++){
      const a=i*Math.PI/4; c.add(this.add.rectangle(Math.cos(a)*16,Math.sin(a)*16,7,3,color,1).setRotation(a));
    }
    c.add(core); c.add(this.add.circle(0,0,4,0x050711,1)); return c;
  }

  private createUI(): void {
    const top=this.add.rectangle(480,22,960,44,0x02050c,0.94).setDepth(30);
    top.setStrokeStyle(1,0x16314a,1);
    this.add.text(20,9,'P.R.I.N.C. // LIMBO // INTRO_NODE', {fontFamily:'monospace',fontSize:'14px',color:'#00f0ff'}).setDepth(31);
    this.hud=this.add.text(940,9,'',{fontFamily:'monospace',fontSize:'14px',color:'#7cf29a'}).setOrigin(1,0).setDepth(31);
    this.feed=this.add.text(18,635,'',{fontFamily:'monospace',fontSize:'12px',color:'#8aa4b8',lineSpacing:5,wordWrap:{width:600}}).setDepth(30);
    this.prompt=this.add.text(480,690,'',{fontFamily:'monospace',fontSize:'13px',color:'#00f0ff',align:'center'}).setOrigin(.5,.5).setDepth(30);
    this.overlay=this.add.graphics().setDepth(29);
    this.darkness=this.add.graphics().setDepth(28);
  }

  private createInput(): void {
    const kb=this.input.keyboard!;
    this.keys={
      up:kb.addKey(Phaser.Input.Keyboard.KeyCodes.W),down:kb.addKey(Phaser.Input.Keyboard.KeyCodes.S),left:kb.addKey(Phaser.Input.Keyboard.KeyCodes.A),right:kb.addKey(Phaser.Input.Keyboard.KeyCodes.D),
      up2:kb.addKey(Phaser.Input.Keyboard.KeyCodes.UP),down2:kb.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN),left2:kb.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT),right2:kb.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT),
      pulse:kb.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),scan:kb.addKey(Phaser.Input.Keyboard.KeyCodes.E),restart:kb.addKey(Phaser.Input.Keyboard.KeyCodes.R)
    };
    this.input.keyboard.on('keydown-SPACE',()=>this.pulseAction());
    this.input.keyboard.on('keydown-E',()=>this.scan());
    this.input.keyboard.on('keydown-R',()=>{if(this.state.gameOver)this.scene.restart();});
    this.createTouchControls();
  }

  private createTouchControls(): void {
    const make=(x:number,y:number,dx:number,dy:number,label:string)=>{
      const b=this.add.circle(x,y,28,0x061526,0.78).setStrokeStyle(1,0x00dfff,.7).setDepth(50).setScrollFactor(0);
      this.add.text(x,y,label,{fontFamily:'monospace',fontSize:'18px',color:'#00f0ff'}).setOrigin(.5).setDepth(51);
      b.setInteractive();
      b.on('pointerdown',()=>{this.touchDir={x:dx,y:dy};this.tryMove(dx,dy);});
      b.on('pointerup',()=>{this.touchDir={x:0,y:0};}); b.on('pointerout',()=>{this.touchDir={x:0,y:0};});
    };
    make(58,648,0,-1,'▲'); make(58,712,0,1,'▼'); make(26,680,-1,0,'◀'); make(90,680,1,0,'▶');
  }

  private readMovement(): void {
    let dx=0,dy=0;
    if(Phaser.Input.Keyboard.JustDown(this.keys.up)||Phaser.Input.Keyboard.JustDown(this.keys.up2))dy=-1;
    else if(Phaser.Input.Keyboard.JustDown(this.keys.down)||Phaser.Input.Keyboard.JustDown(this.keys.down2))dy=1;
    else if(Phaser.Input.Keyboard.JustDown(this.keys.left)||Phaser.Input.Keyboard.JustDown(this.keys.left2))dx=-1;
    else if(Phaser.Input.Keyboard.JustDown(this.keys.right)||Phaser.Input.Keyboard.JustDown(this.keys.right2))dx=1;
    if(dx||dy)this.tryMove(dx,dy);
    if(this.keys.pulse.isDown)this.pulseAction();
  }

  private tryMove(dx:number,dy:number): void {
    if(this.moveLock||this.state.gameOver||this.state.won)return;
    const nx=this.playerTile.x+dx, ny=this.playerTile.y+dy;
    if(!this.isWalkable(nx,ny)){this.beep(80,.025);return;}
    this.moveLock=true; this.playerTile={x:nx,y:ny};
    this.tweenTo(this.player,nx*TILE+TILE/2,ny*TILE+TILE/2,95,()=>{this.moveLock=false;this.collectAtPlayer();this.checkExit();});
    this.beep(180,.025);
  }

  private tweenTo(obj:Phaser.GameObjects.Container,x:number,y:number,duration:number,done:()=>void){this.tweens.add({targets:obj,x,y,duration,ease:'Power2',onComplete:done});}

  private isWalkable(x:number,y:number):boolean{
    if(x<0||x>=COLS||y<0||y>=ROWS)return false;
    const t=MAP[y][x]; return t==='0'||t==='2'||t==='3';
  }

  private collectAtPlayer(): void {
    this.shards.forEach((s,i)=>{
      if(!s.active)return;
      const p=SHARDS[i]; if(p.x===this.playerTile.x&&p.y===this.playerTile.y){
        s.setVisible(false); this.state.shards++; this.beep(880,.1); this.log(`DATA SHARD ${this.state.shards}/${this.state.totalShards}: фрагмент восстановлен.`,'#00f0ff');
        if(this.state.shards===this.state.totalShards)this.log('EXIT: маршрут разблокирован. Доберитесь до красного шлюза.','#7cf29a');
        this.updateHud();
      }
    });
    this.firewallNodes.forEach((n,i)=>{const p=FIREWALLS[i];if(p.x===this.playerTile.x&&p.y===this.playerTile.y){this.state.firewall=5200;this.beep(520,.2);this.log('FIREWALL CORE: защитное окно 5.2 сек. Вирус можно обойти.','#ffe66d');}});
  }

  private checkExit():void{
    if(MAP[this.playerTile.y][this.playerTile.x]==='2'){
      if(this.state.shards===this.state.totalShards)this.win(); else this.showPrompt(`EXIT LOCKED // НУЖНО ДАННЫХ: ${this.state.totalShards-this.state.shards}`);
    }
  }

  private moveWatcher():void{
    const path=this.findPath(this.watcherTile,this.playerTile);
    if(path.length>1){this.watcherTile=path[1];this.tweenTo(this.watcher,this.watcherTile.x*TILE+TILE/2,this.watcherTile.y*TILE+TILE/2,170,()=>{});}
  }

  private findPath(start:Point,target:Point):Point[]{
    const q:Point[]=[start]; const came=new Map<string,Point|null>(); const key=(p:Point)=>`${p.x},${p.y}`; came.set(key(start),null);
    while(q.length){const p=q.shift()!;if(p.x===target.x&&p.y===target.y)break;for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const n={x:p.x+dx,y:p.y+dy};const k=key(n);if(!this.isWalkable(n.x,n.y)||came.has(k))continue;came.set(k,p);q.push(n);}}
    const out:Point[]=[];let cur:Point|undefined=target;while(cur){out.unshift(cur);cur=came.get(key(cur))??undefined;if(out.length>100)break;}return out.length&&out[0].x===start.x&&out[0].y===start.y?out:[start];
  }

  private checkContacts():void{
    const d=Phaser.Math.Distance.Between(this.player.x,this.player.y,this.watcher.x,this.watcher.y);
    if(d<22){
      if(this.state.firewall>0){this.log('ВИРУС: collision rejected by active firewall.','#ffe66d');this.watcherTile={...WATCHER_START};this.tweenTo(this.watcher,WATCHER_START.x*TILE+TILE/2,WATCHER_START.y*TILE+TILE/2,300,()=>{});this.state.firewall=0;}
      else this.hit();
    }
    if(d<150&&this.state.hintCooldown===0){this.state.hintCooldown=2200;this.showPrompt('!! ВИРУС В ЗОНЕ ОБНАРУЖЕНИЯ !!');}
  }

  private hit():void{
    this.state.lives--; this.updateHud(); this.flash(0xff315c); this.beep(70,.35); this.log('SYSTEM EJECT: соединение с носителем разорвано.','#ff496d');
    if(this.state.lives<=0){this.lose();return;}
    this.playerTile={...START};this.watcherTile={...WATCHER_START};
    this.tweenTo(this.player,START.x*TILE+TILE/2,START.y*TILE+TILE/2,220,()=>{});this.tweenTo(this.watcher,WATCHER_START.x*TILE+TILE/2,WATCHER_START.y*TILE+TILE/2,220,()=>{});
    this.showPrompt(`СОЕДИНЕНИЕ ПОТЕРЯНО // ОСТАЛОСЬ КАНАЛОВ: ${this.state.lives}`);
  }

  private pulseAction():void{
    if(this.state.gameOver||this.state.won||this.pulse>0.25)return;
    this.pulse=0.3;this.beep(260,.12);this.flash(0x00eaff,.16);
    this.log('IMPULSE: ближайшие узлы подсвечены.','#00f0ff');
  }

  private scan():void{
    this.flash(0x00eaff,.28);this.beep(1000,.08);const d=Phaser.Math.Distance.Between(this.player.x,this.player.y,this.watcher.x,this.watcher.y);this.showPrompt(d<280?'SCAN: угроза подтверждена — ВИРУС рядом.':'SCAN: канал относительно чист.');
  }

  private win():void{
    this.state.won=true;
    this.log('DATA LINK RESTORED. LIMBO NODE стабилизирован.','#7cf29a');
    this.flash(0x7cf29a,.5);
    this.showEnd(true);
  }
  private lose():void{
    this.state.gameOver=true;
    this.flash(0xff315c,.8);
    this.showEnd(false);
  }

  private showEnd(win:boolean):void{
    this.endGlitch=true;
    this.glitchTimer=0;
    const bg=this.add.rectangle(480,360,760,430,0x02040a,.965).setDepth(100).setStrokeStyle(2,win?0x7cf29a:0xff315c,1);
    const title=this.add.text(480,245,win?'DATA LINK RESTORED':'SYSTEM EJECTED',{fontFamily:'monospace',fontSize:'34px',color:win?'#7cf29a':'#ff315c',fontStyle:'bold'}).setOrigin(.5).setDepth(101);
    const sub=this.add.text(480,305,win?'NODE 07 // LIMBO ACCESS GRANTED':'NODE 07 // CONNECTION TERMINATED',{fontFamily:'monospace',fontSize:'16px',color:'#8aa4b8'}).setOrigin(.5).setDepth(101);
    this.add.text(480,355,win?'Все фрагменты восстановлены.':'Все доступные каналы исчерпаны.',{fontFamily:'monospace',fontSize:'14px',color:'#d5e3ec',align:'center'}).setOrigin(.5).setDepth(101);
    if(win){
      const transition=this.add.text(480,415,'ПЕРЕХОД В TERMINAL…',{fontFamily:'monospace',fontSize:'16px',color:'#00f0ff'}).setOrigin(.5).setDepth(101);
      this.time.delayedCall(900,()=>{
        this.log('WARNING: LIMBO NODE DESYNCHRONIZING…','#ff315c');
        this.flash(0xff315c,.3);
      });
      this.time.delayedCall(1800,()=>{
        this.log('ROUTING CONTROL TO TERMINAL…','#00f0ff');
        transition.setText('ROUTING CONTROL // TERMINAL');
      });
      this.time.delayedCall(3400,()=>{window.location.href='terminal.html';});
    }else{
      this.add.text(480,415,'R — RECONNECT',{fontFamily:'monospace',fontSize:'16px',color:'#00f0ff'}).setOrigin(.5).setDepth(101);
    }
    bg.setInteractive();
    this.tweens.add({targets:title,alpha:.45,duration:80,yoyo:true,repeat:-1,ease:'Stepped'});
    this.tweens.add({targets:sub,x:Phaser.Math.Between(477,483),duration:70,yoyo:true,repeat:-1});
  }

  private updateHud():void{this.hud.setText(`DATA ${this.state.shards}/${this.state.totalShards}   LINK ${'●'.repeat(this.state.lives)}${'○'.repeat(3-this.state.lives)}   FIREWALL ${this.state.firewall>0?'ACTIVE':'—'}`);}
  private log(s:string,color:string){const old=this.feed.text?String(this.feed.text).split('\n'):[];old.push(`> ${s}`);while(old.length>5)old.shift();this.feed.setText(old.map(v=>v).join('\n')).setColor(color);this.messageTimer=4000;}
  private showPrompt(s:string){this.prompt.setText(s);this.tweens.killTweensOf(this.prompt);this.prompt.setAlpha(1);this.tweens.add({targets:this.prompt,alpha:.25,delay:1800,duration:500});}
  private updateFX():void{
    this.overlay.clear();this.overlay.fillStyle(0x00eaff,.035);this.overlay.fillRect(0,0,W,H);
    for(let y=0;y<H;y+=4){this.overlay.lineStyle(1,0x000000,.16);this.overlay.lineBetween(0,y,W,y);}
    const px=this.player.x,py=this.player.y;this.darkness.clear();this.darkness.fillStyle(0x010208,.82);this.darkness.fillRect(0,0,W,H);this.darkness.fillStyle(0xffffff,.16);this.darkness.fillCircle(px,py,125);this.darkness.setBlendMode(Phaser.BlendModes.ERASE);
    if(this.state.firewall>0){this.state.firewall-=16;this.updateHud();}
    this.exitGlow.setAlpha(.2+.15*Math.sin(this.pulse*10));
  }
  private flash(color:number,alpha=.35){const f=this.add.rectangle(480,360,960,720,color,alpha).setDepth(90);this.tweens.add({targets:f,alpha:0,duration:220,onComplete:()=>f.destroy()});}
  private bindAudio(){try{this.audio=new AudioContext();}catch{}}
  private beep(freq:number,dur:number){if(!this.audio)return;const o=this.audio.createOscillator(),g=this.audio.createGain();o.frequency.value=freq;o.type='square';g.gain.value=.018;o.connect(g);g.connect(this.audio.destination);o.start();g.gain.exponentialRampToValueAtTime(.0001,this.audio.currentTime+dur);o.stop(this.audio.currentTime+dur);}
}
