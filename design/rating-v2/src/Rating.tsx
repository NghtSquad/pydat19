'use client';
import {useRef,useState,type CSSProperties} from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import {Bell,Trophy,Map,ShoppingBag,UserRound,X,ChevronRight} from 'lucide-react';
import {motion,MotionConfig,useReducedMotion} from 'motion/react';
import s from './Rating.module.css';

export type Participant={id:string;name:string;initial:string;level:number;skill:string;points:number;avatarUrl?:string};
export const participants:Participant[]=[
{id:'nedari',name:'nedari',initial:'N',level:5,skill:'4.0',points:41},
{id:'doshirak',name:'Doshirak',initial:'D',level:15,skill:'3.8',points:0},
{id:'jukabernik',name:'jukabernik',initial:'J',level:9,skill:'4.6',points:0},
{id:'grigri',name:'григри',initial:'Г',level:9,skill:'5.0',points:0},
{id:'marku',name:'Marku_Alles',initial:'M',level:7,skill:'4.2',points:0},
{id:'paws',name:'УменяЛапки',initial:'У',level:5,skill:'3.9',points:0},
];
const metals=['gold','silver','bronze'] as const;
function Avatar({person,large=false}:{person:Participant;large?:boolean}){
 const [failed,setFailed]=useState(false);
 return <span className={large?s.podiumAvatar:s.avatar} aria-hidden="true">{person.avatarUrl&&!failed?<img src={person.avatarUrl} alt="" onError={()=>setFailed(true)}/>:<span>{person.initial}</span>}</span>;
}
function Podium({people}:{people:Participant[]}){
 return <div className={s.podium} role="img" aria-label="Топ-3: первое место — nedari, второе — Doshirak, третье — jukabernik. Полный рейтинг расположен ниже.">
 {[1,0,2].map(i=><div key={people[i].id} className={`${s.podiumMember} ${s[metals[i]]}`} aria-hidden="true"><div className={s.metalTrail}/><div className={s.avatarRing}><Avatar person={people[i]} large/></div><span className={s.podiumRank}>{i+1}</span></div>)}
 </div>;
}
export default function Rating(){
 const [selected,setSelected]=useState<Participant|null>(null);
 const [notice,setNotice]=useState<string|null>(null);
 const lastTrigger=useRef<HTMLButtonElement|null>(null);
 const reducedMotion=useReducedMotion();
 const open=Boolean(selected||notice);
 const close=()=>{setSelected(null);setNotice(null)};
 const demo=(label:string,event:React.MouseEvent<HTMLButtonElement>)=>{lastTrigger.current=event.currentTarget;setNotice(label)};
 return <MotionConfig reducedMotion="user"><div className={s.shell}>
 <header className={s.header}><span className={s.logo} aria-label="TENGU’S">TENGU’S</span><button type="button" className={s.iconButton} aria-label="Уведомления" onClick={e=>demo('Уведомления',e)}><Bell size={21} strokeWidth={1.7}/></button></header>
 <main className={s.main}>
 <nav className={s.tabs} aria-label="Разделы рейтинга"><button type="button" className={`${s.tab} ${s.activeTab}`} aria-current="page">Лиги</button><button type="button" className={s.tab} onClick={e=>demo('Встречи',e)}>Встречи</button><button type="button" className={`${s.tab} ${s.clans}`} disabled><span>Кланы</span><span className={s.soon}>В разработке</span></button></nav>
 <section aria-labelledby="league-title">
 <div className={s.hero}><div className={s.heading}><p className={s.eyebrow}>Ваша лига</p><h1 id="league-title" className={s.title}>ЖЕЛТАЯ</h1><p className={s.countdown}>До обновления лиги <strong>3 дн.</strong></p></div><Podium people={participants}/></div>
 <section className={s.ranking} aria-label="Рейтинг участников">
 <div className={s.promotion}><span className={s.promotionDot} aria-hidden="true"/><p><strong>Зона повышения</strong><span>Топ-5 переходят в следующую лигу</span></p></div>
 <ol className={s.list}>
 {participants.map((person,i)=><li key={person.id} className={`${s.entry} ${i<5?s.promotionEntry:''}`}>
 {i===5&&<div className={s.boundary}><span/>Граница зоны повышения<span/></div>}
 <button type="button" data-person={person.id} className={`${s.row} ${i===2?s.currentRow:''}`} onClick={e=>{lastTrigger.current=e.currentTarget;setSelected(person)}} aria-label={`${i+1} место, ${person.name}${i===2?', вы':''}, ${person.points} очков. Карточка участника`}>
 <span className={`${s.rank} ${i<3?s.medal+' '+s[metals[i]]:''}`} aria-hidden="true">{i+1}</span>
 <Avatar person={person}/>
 <span className={s.person}><span className={s.nameLine}><span className={s.name} title={person.name}>{person.name}</span>{i===2&&<span className={s.you}>Вы</span>}</span><span className={s.metrics}><span>Ур. {person.level}</span><span className={s.metricDivider} aria-hidden="true"/><span>Навык {person.skill}</span></span></span>
 <span className={s.score}><strong>{person.points}</strong><span>очк.</span></span>
 </button></li>)}
 </ol></section></section>
 </main>
 <nav className={s.primaryNav} aria-label="Основная навигация"><span className={s.sidebarLogo} aria-hidden="true">T</span><div className={s.navItems}>{[{name:'Рейтинг',Icon:Trophy},{name:'Карта',Icon:Map},{name:'Магазин',Icon:ShoppingBag},{name:'Профиль',Icon:UserRound}].map(({name,Icon},i)=><button type="button" key={name} className={`${s.navItem} ${i===0?s.navSelected:''}`} aria-current={i===0?'page':undefined} onClick={e=>{if(i!==0)demo(name,e)}}><Icon size={22} strokeWidth={1.65}/><span>{name}</span></button>)}</div></nav>
 <Dialog.Root open={open} onOpenChange={value=>{if(!value)close()}}><Dialog.Portal><Dialog.Overlay className={s.overlay}/><Dialog.Content className={s.dialog} onCloseAutoFocus={e=>{e.preventDefault();lastTrigger.current?.focus()}}>
 <motion.div initial={reducedMotion?false:{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{duration:.18,ease:'easeOut'}}>
 <div className={s.dialogTop}><span className={s.dialogEyebrow}>{selected?'Участник лиги':'Макет раздела'}</span><Dialog.Close className={s.closeButton} aria-label="Закрыть"><X size={21}/></Dialog.Close></div>
 <Dialog.Title className={s.dialogTitle}>{selected?.name||notice}</Dialog.Title>
 <Dialog.Description className={s.dialogDescription}>{selected?`${participants.findIndex(p=>p.id===selected.id)+1} место в жёлтой лиге${selected.id==='jukabernik'?' · Вы':''}`:'В этой демонстрации оформлена только активная лига. Остальные разделы откроются после переноса в приложение.'}</Dialog.Description>
 {selected&&<dl className={s.stats}>{[{label:'Очки',value:selected.points},{label:'Уровень',value:selected.level},{label:'Навык',value:selected.skill}].map(item=><div key={item.label}><dt>{item.label}</dt><dd>{item.value}</dd></div>)}</dl>}
 <Dialog.Close className={s.dialogAction}>Вернуться к рейтингу<ChevronRight size={18}/></Dialog.Close>
 </motion.div></Dialog.Content></Dialog.Portal></Dialog.Root>
 </div></MotionConfig>;
}
