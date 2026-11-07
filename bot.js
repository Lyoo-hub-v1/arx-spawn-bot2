const { default: makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys');
const pino = require('pino');
const express = require('express');
const app = express();
const NOMOR_KAU = '6283178162622';
const CHANNEL_ID = '0029VbEDiuo4NVig0WAGRy1A@newsletter';
app.get('/', (req,res)=> res.send('ARX BOT IDUP 24 JAM!'));
app.listen(process.env.PORT || 3000, ()=> console.log('Web server idup!'));
const PET_EMOJI = {
  'Phoenix':'🐦‍🔥','Royal Skywhale':'🐳👑','Kitsune':'🦊✨','Gorilla King':'🦍👑',
  'ArchAngel':'👼✨','Nightflame':'🔥🦁','Voidseer Pumpkin':'🎃👁️','Celestial Sunlion':'🦁⭐',
  'Starry Fox':'🦊⭐','Spirit World Guardian':'👻🛡️','Eternal Lunar Dragon':'🌙🐉',
  'Ice Dragon':'🐉❄️','Lava Dragon':'🐉🔥','Mosasaurus':'🦕','Unicorn':'🦄','Pegasus':'🦄🪽',
  'Tung Tung Sahur':'🪵','Strawberry Elephant':'🍓🐘','Chicken':'🐔','Shark':'🦈'
};
function emojiPet(nama){
  for(const k in PET_EMOJI){ if(nama.toLowerCase()===k.toLowerCase()) return PET_EMOJI[k]; }
  const n=nama.toLowerCase();
  if(n.includes('dragon')) return '🐉'; if(n.includes('whale')) return '🐳'; if(n.includes('phoenix')) return '🐦‍🔥';
  if(n.includes('fox')||n.includes('kitsune')) return '🦊'; if(n.includes('tiger')) return '🐯'; if(n.includes('lion')) return '🦁';
  if(n.includes('shark')) return '🦈'; if(n.includes('unicorn')) return '🦄'; if(n.includes('angel')) return '👼';
  if(n.includes('pumpkin')) return '🎃'; if(n.includes('ghost')) return '👻'; if(n.includes('skeleton')) return '💀';
  return '🥚';
}
function judulRarity(r){
  const x=r.toUpperCase();
  if(x==='DIVINE') return '🥚🔥 DIVINE HAS SPAWNED‼️🔥🥚';
  if(x==='ETERNAL') return '🥚🔥 ETERNAL HAS SPAWNED! 🔥🥚';
  if(x==='SECRET') return '🥚🖤 SECRET HAS SPAWNED! 🖤🥚';
  if(x==='COSMIC') return '🥚🌌 COSMIC HAS SPAWNED! 🌌🥚';
  if(x==='MYTHIC') return '🥚❤️ MYTHIC HAS SPAWNED! ❤️🥚';
  if(x==='LEGENDARY') return '🥚🧡 LEGENDARY HAS SPAWNED! 🧡🥚';
  if(x==='EPIC') return '🥚💜 EPIC HAS SPAWNED! 💜🥚';
  if(x==='RARE') return '🥚💙 RARE HAS SPAWNED! 💙🥚';
  return `🥚 ${x} HAS SPAWNED! 🥚`;
}
function buatPesan(rarity,pet,area,speed){
  return `${judulRarity(rarity)}\n\n${emojiPet(pet)} Pet: ${pet.toUpperCase()}\n📍 Area: ${area.toUpperCase()}\n🏃 Recommend Speed: ${speed.toUpperCase()}\n\n🎮 JOIN GAME:\nhttps://www.roblox.com/games/107778070777162/Steal-an-Egg\n\n🔥 Burusan login & steal sebelum keduluan!\nPantengin terus spawn berikutnya! 👀\n⛔ DILARANG MENGCOPY ATAU MENGIKUTI SEMUA YANG ADA DISINI KECUALI SUDAH IZIN‼️`;
}
function prioritas(r){ const p={divine:10,eternal:9,secret:8,cosmic:7,mythic:6,legendary:5,epic:4,rare:3,uncommon:2,common:1}; return p[r.toLowerCase()]||0; }
function parseSatu(sisa){
  let petName,area,speed;
  if(sisa.length===3){ petName=sisa[0]; area=sisa[1]; speed=sisa[2]; }
  else if(sisa.length===4){ petName=sisa[0]+' '+sisa[1]; area=sisa[2]; speed=sisa[3]; }
  else { petName=sisa.slice(0,-2).join(' '); area=sisa[sisa.length-2]; speed=sisa[sisa.length-1]; }
  return {petName,area,speed};
}
async function mulaiBot(){
  const {state,saveCreds}=await useMultiFileAuthState('ARX-SESI');
  const sock=makeWASocket({auth:state,logger:pino({level:'silent'}),printQRInTerminal:false,browser:['Ubuntu','Chrome','20.0.04']});
  sock.ev.on('creds.update',saveCreds);
  let sudahMinta=false;
  sock.ev.on('connection.update',async(u)=>{
    if(u.connection==='open') console.log('✅ BOT IDUP 24 JAM DI RENDER!');
    if(!sock.authState.creds.registered && !sudahMinta){
      sudahMinta=true;
      setTimeout(async()=>{ try{ const kode=await sock.requestPairingCode(NOMOR_KAU); console.log('KODE PAIRING KAU: '+kode); }catch(e){ console.log('Gagal:',e.message); sudahMinta=false; } },5000);
    }
  });
  setInterval(()=>{ console.log('Bot masih idup... '+new Date().toLocaleString()); }, 10*60*1000);
  sock.ev.on('messages.upsert', async(m)=>{
    try{
      const msg=m.messages[0];
      if(!msg.message||msg.key.fromMe) return;
      const from=msg.key.remoteJid;
      const text=msg.message.conversation||msg.message.extendedTextMessage?.text||'';
      const parts=text.trim().split(' ');
      const cmd=parts[0].toLowerCase().replace('.','');
      const reply=(t)=>sock.sendMessage(from,{text:t},{quoted:msg});
      const listRarity=['common','uncommon','rare','epic','legendary','mythic','cosmic','secret','eternal','divine'];
      if(cmd==='menu') return reply(`🥚 ARX BOT 24 JAM - IDUP WALAU HP MATI!\n\n.spawn2 eternal Phoenix Volcano 700K | divine Royal Skywhale Enchanted 50B\n.divine Royal Skywhale Enchanted 50B\n.eternal Phoenix Volcano 700K`);
      if(cmd==='spawn2'||cmd==='double'||cmd==='both'){
        const isi=text.slice(text.indexOf(' ')+1);
        const dua=isi.split('|').map(s=>s.trim());
        let items=[];
        for(const d of dua){ const p=d.split(' '); const rarity=p[0].toLowerCase(); const parsed=parseSatu(p.slice(1)); items.push({rarity,...parsed}); }
        items.sort((a,b)=>prioritas(b.rarity)-prioritas(a.rarity));
        let hasil=`✅ 2 SPAWN! UTAMAKAN ${items[0].rarity.toUpperCase()} DULU!\n\n`;
        for(let i=0;i<items.length;i++){
          const it=items[i];
          const pesan=buatPesan(it.rarity,it.petName,it.area,it.speed);
          await sock.sendMessage(CHANNEL_ID,{text:pesan});
          hasil+=`${i+1}. ${it.rarity.toUpperCase()} - ${it.petName} SUDAH DI-POST!\n`;
          if(i<items.length-1) await new Promise(r=>setTimeout(r,5000));
        }
        return reply(hasil);
      }
      if(listRarity.includes(cmd)||cmd==='spawn'){
        let rarity,sisa;
        if(cmd==='spawn'){ rarity=parts[1]; sisa=parts.slice(2); }
        else { rarity=cmd; sisa=parts.slice(1); }
        const parsed=parseSatu(sisa);
        const pesan=buatPesan(rarity,parsed.petName,parsed.area,parsed.speed);
        await sock.sendMessage(CHANNEL_ID,{text:pesan});
        return reply(`✅ SUDAH OTOMATIS DI-POST KE SALURAN! HP KAU MATI PUN TETAP JALAN!\n\n${pesan}`);
      }
      if(from.endsWith('@g.us')){
        const lower=text.toLowerCase();
        for(const r of listRarity){
          if(lower.startsWith(r)){
            const p=text.trim().split(' ');
            const rarity=p[0].toLowerCase();
            const parsed=parseSatu(p.slice(1));
            const pesan=buatPesan(rarity,parsed.petName,parsed.area,parsed.speed);
            await sock.sendMessage(CHANNEL_ID,{text:pesan});
            console.log(`AUTO-FORWARD: ${rarity} ${parsed.petName}`);
            break;
          }
        }
      }
    }catch(e){ console.log(e); }
  });
}
mulaiBot();
