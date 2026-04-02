import { useState, useMemo } from "react";
import { CATEGORIES, CAT_COLOR, CAT_ICON, SEED, NEXT_ID } from "./data/seedData";
const GLOBAL_STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Syne:wght@400;600;700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg:#0a0c10; --surface:#11141b; --border:#1e2330; --border2:#2a2f3d;
    --accent:#f5a623; --accent2:#ff6b35; --green:#22c55e; --red:#ef4444;
    --text:#e8eaf0; --muted:#6b7280; --muted2:#9ca3af;
    --blue:#3b82f6; --purple:#a855f7;
    --font-mono:'IBM Plex Mono',monospace; --font-sans:'Syne',sans-serif;
    --radius:8px; --shadow:0 4px 24px rgba(0,0,0,.4);
  }
  html,body,#root{height:100%;}
  body{background:var(--bg);color:var(--text);font-family:var(--font-sans);}
  ::-webkit-scrollbar{width:4px;height:4px;}
  ::-webkit-scrollbar-track{background:var(--surface);}
  ::-webkit-scrollbar-thumb{background:var(--border2);border-radius:2px;}
  @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
  .fu{animation:fadeUp .4s ease both;}
  .fu1{animation-delay:.04s} .fu2{animation-delay:.08s} .fu3{animation-delay:.12s}
  .fu4{animation-delay:.16s} .fu5{animation-delay:.20s}
`;

const CATEGORIES = ["Food","Transport","Housing","Entertainment","Healthcare","Shopping","Utilities","Investment","Salary","Freelance"];
const CAT_COLOR = {Food:"#f5a623",Transport:"#3b82f6",Housing:"#a855f7",Entertainment:"#22c55e",Healthcare:"#ef4444",Shopping:"#ff6b35",Utilities:"#06b6d4",Investment:"#84cc16",Salary:"#22c55e",Freelance:"#f59e0b"};
const CAT_ICON  = {Food:"🍜",Transport:"🚇",Housing:"🏠",Entertainment:"🎬",Healthcare:"💊",Shopping:"🛍️",Utilities:"⚡",Investment:"📈",Salary:"💼",Freelance:"💻"};

const SEED = [
  {id:1,date:"2024-06-02",desc:"Monthly Salary",cat:"Salary",type:"income",amount:5800},
  {id:2,date:"2024-06-03",desc:"Apartment Rent",cat:"Housing",type:"expense",amount:1400},
  {id:3,date:"2024-06-04",desc:"Grocery Run",cat:"Food",type:"expense",amount:124},
  {id:4,date:"2024-06-05",desc:"Netflix + Spotify",cat:"Entertainment",type:"expense",amount:28},
  {id:5,date:"2024-06-06",desc:"Freelance Project",cat:"Freelance",type:"income",amount:950},
  {id:6,date:"2024-06-08",desc:"Metro Card",cat:"Transport",type:"expense",amount:45},
  {id:7,date:"2024-06-09",desc:"Electricity Bill",cat:"Utilities",type:"expense",amount:87},
  {id:8,date:"2024-06-10",desc:"Online Shopping",cat:"Shopping",type:"expense",amount:215},
  {id:9,date:"2024-06-11",desc:"Doctor Visit",cat:"Healthcare",type:"expense",amount:150},
  {id:10,date:"2024-06-13",desc:"ETF Investment",cat:"Investment",type:"expense",amount:500},
  {id:11,date:"2024-06-15",desc:"Restaurant Dinner",cat:"Food",type:"expense",amount:76},
  {id:12,date:"2024-06-16",desc:"Uber Rides",cat:"Transport",type:"expense",amount:38},
  {id:13,date:"2024-06-18",desc:"Freelance Invoice",cat:"Freelance",type:"income",amount:1200},
  {id:14,date:"2024-06-19",desc:"Pharmacy",cat:"Healthcare",type:"expense",amount:45},
  {id:15,date:"2024-06-20",desc:"Coffee & Snacks",cat:"Food",type:"expense",amount:34},
  {id:16,date:"2024-06-21",desc:"Cinema Tickets",cat:"Entertainment",type:"expense",amount:42},
  {id:17,date:"2024-06-22",desc:"Internet Bill",cat:"Utilities",type:"expense",amount:60},
  {id:18,date:"2024-06-24",desc:"Clothing",cat:"Shopping",type:"expense",amount:180},
  {id:19,date:"2024-07-01",desc:"Monthly Salary",cat:"Salary",type:"income",amount:5800},
  {id:20,date:"2024-07-02",desc:"Apartment Rent",cat:"Housing",type:"expense",amount:1400},
  {id:21,date:"2024-07-04",desc:"Weekly Groceries",cat:"Food",type:"expense",amount:148},
  {id:22,date:"2024-07-06",desc:"Train Pass",cat:"Transport",type:"expense",amount:55},
  {id:23,date:"2024-07-07",desc:"Freelance Work",cat:"Freelance",type:"income",amount:700},
  {id:24,date:"2024-07-09",desc:"Electricity Bill",cat:"Utilities",type:"expense",amount:92},
  {id:25,date:"2024-07-11",desc:"Online Courses",cat:"Entertainment",type:"expense",amount:89},
  {id:26,date:"2024-07-14",desc:"Restaurant",cat:"Food",type:"expense",amount:65},
  {id:27,date:"2024-07-15",desc:"ETF Investment",cat:"Investment",type:"expense",amount:500},
  {id:28,date:"2024-07-17",desc:"Pharmacy",cat:"Healthcare",type:"expense",amount:28},
  {id:29,date:"2024-07-20",desc:"Amazon Order",cat:"Shopping",type:"expense",amount:134},
  {id:30,date:"2024-07-22",desc:"Gas Station",cat:"Transport",type:"expense",amount:62},
];

let NEXT_ID = 31;
const fmt = n => new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",minimumFractionDigits:0}).format(n);
const fmtDate = d => new Date(d).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"});

function groupByMonth(txns) {
  const map = {};
  txns.forEach(t => {
    const k = t.date.slice(0,7);
    if(!map[k]) map[k]={income:0,expense:0};
    map[k][t.type] += t.amount;
  });
  return Object.entries(map).sort(([a],[b])=>a.localeCompare(b)).map(([k,v])=>({
    month: new Date(k+"-01").toLocaleDateString("en-US",{month:"short",year:"2-digit"}),
    ...v, net:v.income-v.expense
  }));
}
function spendByCat(txns) {
  const map = {};
  txns.filter(t=>t.type==="expense").forEach(t=>{map[t.cat]=(map[t.cat]||0)+t.amount;});
  const total = Object.values(map).reduce((a,b)=>a+b,0)||1;
  return Object.entries(map).sort(([,a],[,b])=>b-a).map(([cat,amt])=>({cat,amt,pct:(amt/total*100).toFixed(1)}));
}

// ── Bar Chart ────────────────────────────────────────────────────────────────
function BarChart({data}) {
  const maxV = Math.max(...data.flatMap(d=>[d.income,d.expense]),1);
  return (
    <div style={{width:"100%",overflowX:"auto"}}>
      <div style={{display:"flex",alignItems:"flex-end",gap:10,minWidth:data.length*70,height:140,paddingBottom:0}}>
        {data.map((d,i)=>(
          <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
            <div style={{width:"100%",display:"flex",gap:3,alignItems:"flex-end",height:110}}>
              <div style={{flex:1,background:"var(--green)",borderRadius:"3px 3px 0 0",height:`${(d.income/maxV)*100}%`,opacity:.8,minHeight:2,transition:"height .5s ease"}}/>
              <div style={{flex:1,background:"var(--red)",borderRadius:"3px 3px 0 0",height:`${(d.expense/maxV)*100}%`,opacity:.8,minHeight:2,transition:"height .5s ease"}}/>
            </div>
            <span style={{fontSize:9,color:"var(--muted)",fontFamily:"var(--font-mono)"}}>{d.month}</span>
          </div>
        ))}
      </div>
      <div style={{display:"flex",gap:14,marginTop:8,justifyContent:"center"}}>
        {[["var(--green)","Income"],["var(--red)","Expense"]].map(([c,l])=>(
          <div key={l} style={{display:"flex",alignItems:"center",gap:5}}>
            <div style={{width:8,height:8,borderRadius:2,background:c}}/>
            <span style={{fontSize:10,color:"var(--muted)",fontFamily:"var(--font-mono)"}}>{l}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Donut Chart ──────────────────────────────────────────────────────────────
function DonutChart({data}) {
  const cx=80,cy=80,r=62,ir=40;
  let angle=-90;
  const slices = data.slice(0,6).map(d=>{
    const sweep=(parseFloat(d.pct)/100)*360;
    const s=angle; angle+=sweep;
    return {...d,start:s,sweep};
  });
  const arc=(cx,cy,r,s,sw)=>{
    const rad=d=>d*Math.PI/180;
    const x1=cx+r*Math.cos(rad(s)),y1=cy+r*Math.sin(rad(s));
    const x2=cx+r*Math.cos(rad(s+sw)),y2=cy+r*Math.sin(rad(s+sw));
    return `M${x1},${y1}A${r},${r},0,${sw>180?1:0},1,${x2},${y2}`;
  };
  return (
    <div style={{display:"flex",alignItems:"center",gap:20,flexWrap:"wrap"}}>
      <svg width={160} height={160} style={{flexShrink:0}}>
        {slices.map((s,i)=>(
          <path key={i} d={arc(cx,cy,r,s.start,s.sweep)+`L${cx},${cy}Z`}
            fill={CAT_COLOR[s.cat]||"#666"} opacity={.85}/>
        ))}
        <circle cx={cx} cy={cy} r={ir} fill="var(--surface)"/>
        <text x={cx} y={cy-5} textAnchor="middle" fill="var(--text)" fontSize={12} fontFamily="var(--font-mono)" fontWeight="600">{data[0]?.pct}%</text>
        <text x={cx} y={cy+10} textAnchor="middle" fill="var(--muted)" fontSize={8} fontFamily="var(--font-mono)">{data[0]?.cat}</text>
      </svg>
      <div style={{flex:1,minWidth:110}}>
        {data.slice(0,6).map((d,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",gap:7,marginBottom:7}}>
            <div style={{width:7,height:7,borderRadius:2,background:CAT_COLOR[d.cat]||"#666",flexShrink:0}}/>
            <span style={{fontSize:11,color:"var(--muted2)",flex:1,fontFamily:"var(--font-mono)"}}>{d.cat}</span>
            <span style={{fontSize:11,fontFamily:"var(--font-mono)",color:"var(--text)"}}>{d.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Sparkline ────────────────────────────────────────────────────────────────
function Sparkline({data,color="#f5a623"}) {
  if(!data||data.length<2) return null;
  const w=200,h=50,p=4,vals=data.map(d=>d.net);
  const mn=Math.min(...vals),mx=Math.max(...vals),rng=mx-mn||1;
  const pts=vals.map((v,i)=>`${p+(i/(vals.length-1))*(w-2*p)},${h-p-((v-mn)/rng)*(h-2*p)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{width:"100%",height:50}}>
      <defs>
        <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity=".3"/>
          <stop offset="100%" stopColor={color} stopOpacity="0"/>
        </linearGradient>
      </defs>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

// ── Shared UI ─────────────────────────────────────────────────────────────────
const Card = ({children,style={},className=""})=>(
  <div className={className} style={{background:"var(--surface)",border:"1px solid var(--border)",borderRadius:"var(--radius)",padding:20,...style}}>{children}</div>
);
const SLabel = ({children})=>(
  <div style={{fontSize:10,color:"var(--muted)",fontFamily:"var(--font-mono)",textTransform:"uppercase",letterSpacing:".08em",marginBottom:5}}>{children}</div>
);
const FInput = ({label,...p})=>(
  <div style={{marginBottom:13}}>
    <SLabel>{label}</SLabel>
    <input {...p} style={{width:"100%",background:"var(--bg)",border:"1px solid var(--border2)",borderRadius:6,padding:"8px 11px",color:"var(--text)",fontSize:13,fontFamily:"var(--font-mono)",outline:"none",...(p.style||{})}}/>
  </div>
);
const FSelect = ({label,children,...p})=>(
  <div style={{marginBottom:13}}>
    <SLabel>{label}</SLabel>
    <select {...p} style={{width:"100%",background:"var(--bg)",border:"1px solid var(--border2)",borderRadius:6,padding:"8px 11px",color:"var(--text)",fontSize:13,fontFamily:"var(--font-mono)",outline:"none"}}>{children}</select>
  </div>
);

function Modal({open,title,onClose,children}) {
  if(!open) return null;
  return (
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.75)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:100,padding:16}}>
      <div onClick={e=>e.stopPropagation()} className="fu" style={{background:"var(--surface)",border:"1px solid var(--border)",borderRadius:"var(--radius)",padding:26,width:"100%",maxWidth:420,boxShadow:"var(--shadow)"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
          <h3 style={{fontWeight:700,fontSize:17}}>{title}</h3>
          <button onClick={onClose} style={{background:"none",border:"none",color:"var(--muted)",cursor:"pointer",fontSize:20,lineHeight:1}}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [role,setRole]       = useState("viewer");
  const [tab,setTab]         = useState("dashboard");
  const [txns,setTxns]       = useState(SEED);
  const [search,setSearch]   = useState("");
  const [fType,setFType]     = useState("all");
  const [fCat,setFCat]       = useState("all");
  const [sort,setSort]       = useState("date-desc");
  const [modal,setModal]     = useState(null);
  const [form,setForm]       = useState({desc:"",amount:"",cat:"Food",type:"expense",date:""});
  const [notify,setNotify]   = useState(null);
  const isAdmin = role==="admin";

  const toast=(msg,col="var(--green)")=>{setNotify({msg,col});setTimeout(()=>setNotify(null),3000);};

  const displayed = useMemo(()=>{
    let l=[...txns];
    if(search) l=l.filter(t=>t.desc.toLowerCase().includes(search.toLowerCase())||t.cat.toLowerCase().includes(search.toLowerCase()));
    if(fType!=="all") l=l.filter(t=>t.type===fType);
    if(fCat!=="all")  l=l.filter(t=>t.cat===fCat);
    l.sort((a,b)=>{
      if(sort==="date-desc") return b.date.localeCompare(a.date);
      if(sort==="date-asc")  return a.date.localeCompare(b.date);
      if(sort==="amt-desc")  return b.amount-a.amount;
      return a.amount-b.amount;
    });
    return l;
  },[txns,search,fType,fCat,sort]);

  const totalIncome  = txns.filter(t=>t.type==="income").reduce((s,t)=>s+t.amount,0);
  const totalExpense = txns.filter(t=>t.type==="expense").reduce((s,t)=>s+t.amount,0);
  const balance      = totalIncome-totalExpense;
  const monthlyData  = useMemo(()=>groupByMonth(txns),[txns]);
  const catData      = useMemo(()=>spendByCat(txns),[txns]);
  const savingsRate  = totalIncome>0?((balance/totalIncome)*100).toFixed(1):0;

  const openAdd  = ()=>{setForm({desc:"",amount:"",cat:"Food",type:"expense",date:new Date().toISOString().slice(0,10)});setModal({mode:"add"});};
  const openEdit = tx=>{setForm({desc:tx.desc,amount:String(tx.amount),cat:tx.cat,type:tx.type,date:tx.date});setModal({mode:"edit",tx});};
  const closeModal = ()=>setModal(null);
  const saveForm = ()=>{
    if(!form.desc||!form.amount||!form.date){toast("Fill all fields","var(--red)");return;}
    const tx={...form,amount:parseFloat(form.amount)||0};
    if(modal.mode==="add"){setTxns(p=>[{...tx,id:NEXT_ID++},...p]);toast("Transaction added");}
    else{setTxns(p=>p.map(t=>t.id===modal.tx.id?{...t,...tx}:t));toast("Updated");}
    closeModal();
  };
  const deleteTx = id=>{setTxns(p=>p.filter(t=>t.id!==id));toast("Deleted","var(--red)");};

  const topCat   = catData[0];
  const prevMon  = monthlyData[monthlyData.length-2];
  const curMon   = monthlyData[monthlyData.length-1];

  // ── Styles helpers ─────────────────────────────────────────────────────────
  const navBtn = (k)=>({
    background:tab===k?"rgba(245,166,35,.13)":"transparent",
    color:tab===k?"var(--accent)":"var(--muted2)",
    border:"none",borderRadius:6,padding:"7px 14px",
    fontFamily:"var(--font-sans)",fontWeight:600,fontSize:13,cursor:"pointer",transition:"all .15s"
  });
  const roleBtn = (r)=>({
    padding:"5px 12px",fontFamily:"var(--font-mono)",fontSize:11,
    background:role===r?(r==="admin"?"var(--accent)":"var(--blue)"):"transparent",
    color:role===r?"#000":"var(--muted2)",
    border:"none",cursor:"pointer",textTransform:"uppercase",letterSpacing:".06em",
    transition:"all .15s",fontWeight:role===r?600:400
  });

  return (
    <>
      <style>{GLOBAL_STYLE}</style>

      {notify&&(
        <div style={{position:"fixed",top:20,right:20,zIndex:200,background:notify.col,color:"#000",padding:"10px 18px",borderRadius:"var(--radius)",fontFamily:"var(--font-mono)",fontSize:13,boxShadow:"var(--shadow)",animation:"fadeUp .3s ease",fontWeight:600}}>
          {notify.msg}
        </div>
      )}

      <Modal open={!!modal} title={modal?.mode==="add"?"Add Transaction":"Edit Transaction"} onClose={closeModal}>
        <FInput label="Description" value={form.desc} onChange={e=>setForm(p=>({...p,desc:e.target.value}))} placeholder="e.g. Grocery run"/>
        <FInput label="Amount" type="number" value={form.amount} onChange={e=>setForm(p=>({...p,amount:e.target.value}))} placeholder="0.00"/>
        <FInput label="Date" type="date" value={form.date} onChange={e=>setForm(p=>({...p,date:e.target.value}))}/>
        <FSelect label="Category" value={form.cat} onChange={e=>setForm(p=>({...p,cat:e.target.value}))}>
          {CATEGORIES.map(c=><option key={c}>{c}</option>)}
        </FSelect>
        <FSelect label="Type" value={form.type} onChange={e=>setForm(p=>({...p,type:e.target.value}))}>
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </FSelect>
        <div style={{display:"flex",gap:10,marginTop:4}}>
          <button onClick={saveForm} style={{flex:1,background:"var(--accent)",color:"#000",border:"none",borderRadius:6,padding:"10px",fontFamily:"var(--font-mono)",fontWeight:700,fontSize:13,cursor:"pointer"}}>
            {modal?.mode==="add"?"Add Transaction":"Save Changes"}
          </button>
          <button onClick={closeModal} style={{padding:"10px 14px",background:"transparent",border:"1px solid var(--border2)",borderRadius:6,color:"var(--muted2)",fontFamily:"var(--font-mono)",fontSize:13,cursor:"pointer"}}>
            Cancel
          </button>
        </div>
      </Modal>

      <div style={{display:"flex",flexDirection:"column",minHeight:"100vh"}}>
        {/* Header */}
        <header style={{background:"var(--surface)",borderBottom:"1px solid var(--border)",padding:"0 24px",display:"flex",alignItems:"center",justifyContent:"space-between",height:60,flexShrink:0,position:"sticky",top:0,zIndex:50,gap:12,flexWrap:"wrap"}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:28,height:28,borderRadius:6,background:"linear-gradient(135deg,var(--accent),var(--accent2))",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:14,color:"#000"}}>₣</div>
            <span style={{fontFamily:"var(--font-sans)",fontWeight:800,fontSize:16,letterSpacing:"-.02em"}}>FinTrack</span>
          </div>
          <nav style={{display:"flex",gap:2}}>
            {[["dashboard","Dashboard"],["transactions","Transactions"],["insights","Insights"]].map(([k,l])=>(
              <button key={k} onClick={()=>setTab(k)} style={navBtn(k)}>{l}</button>
            ))}
          </nav>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <span style={{fontSize:10,color:"var(--muted)",fontFamily:"var(--font-mono)"}}>ROLE</span>
            <div style={{display:"flex",background:"var(--bg)",border:"1px solid var(--border)",borderRadius:6,overflow:"hidden"}}>
              {["viewer","admin"].map(r=><button key={r} onClick={()=>setRole(r)} style={roleBtn(r)}>{r}</button>)}
            </div>
          </div>
        </header>

        <main style={{flex:1,padding:"24px",maxWidth:1200,width:"100%",margin:"0 auto"}}>

          {/* ── DASHBOARD ── */}
          {tab==="dashboard"&&(
            <div>
              <div style={{marginBottom:20,display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:12}}>
                <div>
                  <h1 className="fu" style={{fontWeight:800,fontSize:22,letterSpacing:"-.03em"}}>Financial Overview</h1>
                  <p className="fu fu1" style={{color:"var(--muted)",fontSize:12,marginTop:3,fontFamily:"var(--font-mono)"}}>All time · {txns.length} transactions</p>
                </div>
                {isAdmin&&<button onClick={openAdd} className="fu fu2" style={{background:"var(--accent)",color:"#000",border:"none",borderRadius:6,padding:"9px 18px",fontFamily:"var(--font-mono)",fontWeight:700,fontSize:13,cursor:"pointer"}}>+ Add Transaction</button>}
              </div>

              {/* Summary Cards */}
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:14,marginBottom:20}}>
                {[
                  {label:"Total Balance",value:fmt(balance),icon:"💰",color:"var(--accent)",sub:`Savings rate: ${savingsRate}%`,del:1},
                  {label:"Total Income",value:fmt(totalIncome),icon:"📥",color:"var(--green)",sub:`${txns.filter(t=>t.type==="income").length} transactions`,del:2},
                  {label:"Total Expenses",value:fmt(totalExpense),icon:"📤",color:"var(--red)",sub:`${txns.filter(t=>t.type==="expense").length} transactions`,del:3},
                  {label:"Monthly Avg Spend",value:fmt(totalExpense/Math.max(monthlyData.length,1)),icon:"📊",color:"var(--blue)",sub:"Average per month",del:4},
                ].map(({label,value,icon,color,sub,del})=>(
                  <div key={label} className={`fu fu${del}`} style={{background:"var(--surface)",border:"1px solid var(--border)",borderLeft:`3px solid ${color}`,borderRadius:"var(--radius)",padding:"18px 20px",display:"flex",flexDirection:"column",gap:8}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                      <span style={{fontSize:10,color:"var(--muted)",fontFamily:"var(--font-mono)",textTransform:"uppercase",letterSpacing:".08em"}}>{label}</span>
                      <span style={{fontSize:18}}>{icon}</span>
                    </div>
                    <div style={{fontFamily:"var(--font-mono)",fontSize:24,fontWeight:600,color:"var(--text)",letterSpacing:"-.02em"}}>{value}</div>
                    <div style={{fontSize:10,color:"var(--muted)",fontFamily:"var(--font-mono)"}}>{sub}</div>
                  </div>
                ))}
              </div>

              {/* Charts */}
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:14,marginBottom:14}}>
                <Card className="fu fu3">
                  <h2 style={{fontWeight:700,fontSize:14,marginBottom:14}}>Monthly Income vs Expense</h2>
                  <BarChart data={monthlyData}/>
                </Card>
                <Card className="fu fu4">
                  <h2 style={{fontWeight:700,fontSize:14,marginBottom:14}}>Spending Breakdown</h2>
                  {catData.length>0?<DonutChart data={catData}/>:<div style={{color:"var(--muted)",textAlign:"center",padding:40,fontFamily:"var(--font-mono)",fontSize:13}}>No expenses yet</div>}
                </Card>
              </div>

              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:14}}>
                <Card className="fu fu5">
                  <h2 style={{fontWeight:700,fontSize:14,marginBottom:12}}>Net Balance Trend</h2>
                  <Sparkline data={monthlyData}/>
                  <div style={{display:"flex",justifyContent:"space-between",marginTop:4}}>
                    {monthlyData.map((m,i)=>(
                      <div key={i} style={{textAlign:"center"}}>
                        <div style={{fontSize:9,color:m.net>=0?"var(--green)":"var(--red)",fontFamily:"var(--font-mono)"}}>{m.net>=0?"+":""}{fmt(m.net)}</div>
                        <div style={{fontSize:8,color:"var(--muted)",fontFamily:"var(--font-mono)"}}>{m.month}</div>
                      </div>
                    ))}
                  </div>
                </Card>
                <Card className="fu fu5">
                  <h2 style={{fontWeight:700,fontSize:14,marginBottom:12}}>Recent Transactions</h2>
                  {txns.slice().sort((a,b)=>b.date.localeCompare(a.date)).slice(0,5).map(t=>(
                    <div key={t.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:"1px solid var(--border)"}}>
                      <div style={{display:"flex",alignItems:"center",gap:8}}>
                        <span style={{fontSize:16}}>{CAT_ICON[t.cat]||"💳"}</span>
                        <div>
                          <div style={{fontSize:12,fontWeight:600}}>{t.desc}</div>
                          <div style={{fontSize:10,color:"var(--muted)",fontFamily:"var(--font-mono)"}}>{fmtDate(t.date)}</div>
                        </div>
                      </div>
                      <span style={{fontFamily:"var(--font-mono)",fontSize:13,fontWeight:600,color:t.type==="income"?"var(--green)":"var(--red)"}}>
                        {t.type==="income"?"+":"-"}{fmt(t.amount)}
                      </span>
                    </div>
                  ))}
                </Card>
              </div>
            </div>
          )}

          {/* ── TRANSACTIONS ── */}
          {tab==="transactions"&&(
            <div>
              <div style={{marginBottom:20,display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:12}}>
                <div>
                  <h1 className="fu" style={{fontWeight:800,fontSize:22,letterSpacing:"-.03em"}}>Transactions</h1>
                  <p className="fu fu1" style={{color:"var(--muted)",fontSize:12,marginTop:3,fontFamily:"var(--font-mono)"}}>
                    {displayed.length} of {txns.length}
                    {!isAdmin&&<span style={{marginLeft:8,color:"var(--blue)",fontSize:10}}>[VIEWER — read only]</span>}
                  </p>
                </div>
                {isAdmin&&<button onClick={openAdd} className="fu fu2" style={{background:"var(--accent)",color:"#000",border:"none",borderRadius:6,padding:"9px 18px",fontFamily:"var(--font-mono)",fontWeight:700,fontSize:13,cursor:"pointer"}}>+ Add Transaction</button>}
              </div>

              {/* Filters */}
              <Card style={{marginBottom:14,padding:"12px 14px"}} className="fu fu1">
                <div style={{display:"flex",gap:10,flexWrap:"wrap",alignItems:"center"}}>
                  <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search…" style={{flex:1,minWidth:160,background:"var(--bg)",border:"1px solid var(--border2)",borderRadius:6,padding:"7px 11px",color:"var(--text)",fontSize:12,fontFamily:"var(--font-mono)",outline:"none"}}/>
                  {[
                    [fType,setFType,[["all","All Types"],["income","Income"],["expense","Expense"]]],
                    [fCat,setFCat,[["all","All Categories"],...CATEGORIES.map(c=>[c,c])]],
                    [sort,setSort,[["date-desc","Newest"],["date-asc","Oldest"],["amt-desc","Highest $"],["amt-asc","Lowest $"]]],
                  ].map(([val,set,opts],i)=>(
                    <select key={i} value={val} onChange={e=>set(e.target.value)} style={{background:"var(--bg)",border:"1px solid var(--border2)",borderRadius:6,padding:"7px 10px",color:"var(--text)",fontSize:12,fontFamily:"var(--font-mono)",outline:"none"}}>
                      {opts.map(([v,l])=><option key={v} value={v}>{l}</option>)}
                    </select>
                  ))}
                  {(search||fType!=="all"||fCat!=="all")&&<button onClick={()=>{setSearch("");setFType("all");setFCat("all");}} style={{background:"transparent",border:"1px solid var(--border2)",borderRadius:6,padding:"7px 10px",color:"var(--muted2)",fontSize:11,fontFamily:"var(--font-mono)",cursor:"pointer"}}>Clear</button>}
                </div>
              </Card>

              {/* Table */}
              <Card style={{padding:0,overflow:"hidden"}} className="fu fu2">
                <div style={{display:"grid",gridTemplateColumns:"1fr 100px 110px 80px 90px",gap:10,padding:"9px 14px",borderBottom:"1px solid var(--border)",background:"rgba(255,255,255,.02)"}}>
                  {["Description","Category","Amount","Type","Actions"].map(h=>(
                    <div key={h} style={{fontSize:9,color:"var(--muted)",fontFamily:"var(--font-mono)",textTransform:"uppercase",letterSpacing:".08em"}}>{h}</div>
                  ))}
                </div>
                {displayed.length===0
                  ?<div style={{textAlign:"center",padding:"48px 0",color:"var(--muted)",fontFamily:"var(--font-mono)",fontSize:13}}>No transactions found</div>
                  :displayed.map(t=>(
                    <div key={t.id}
                      style={{display:"grid",gridTemplateColumns:"1fr 100px 110px 80px 90px",gap:10,alignItems:"center",padding:"10px 14px",borderBottom:"1px solid var(--border)",transition:"background .15s",cursor:"default"}}
                      onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,.03)"}
                      onMouseLeave={e=>e.currentTarget.style.background="transparent"}
                    >
                      <div style={{display:"flex",alignItems:"center",gap:8,minWidth:0}}>
                        <span style={{fontSize:16,flexShrink:0}}>{CAT_ICON[t.cat]||"💳"}</span>
                        <div style={{minWidth:0}}>
                          <div style={{fontSize:12,fontWeight:600,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{t.desc}</div>
                          <div style={{fontSize:10,color:"var(--muted)",fontFamily:"var(--font-mono)"}}>{fmtDate(t.date)}</div>
                        </div>
                      </div>
                      <span style={{fontSize:10,fontFamily:"var(--font-mono)",padding:"3px 7px",borderRadius:4,background:(CAT_COLOR[t.cat]||"#666")+"22",color:CAT_COLOR[t.cat]||"var(--muted2)"}}>{t.cat}</span>
                      <span style={{fontFamily:"var(--font-mono)",fontSize:12,fontWeight:600,color:t.type==="income"?"var(--green)":"var(--red)"}}>{t.type==="income"?"+":"-"}{fmt(t.amount)}</span>
                      <span style={{fontSize:9,padding:"2px 6px",borderRadius:3,fontFamily:"var(--font-mono)",background:t.type==="income"?"rgba(34,197,94,.15)":"rgba(239,68,68,.15)",color:t.type==="income"?"var(--green)":"var(--red)",textTransform:"uppercase",letterSpacing:".06em"}}>{t.type}</span>
                      <div style={{display:"flex",gap:5}}>
                        {isAdmin&&<>
                          <button onClick={()=>openEdit(t)} style={{background:"transparent",border:"1px solid #3b82f644",color:"var(--blue)",borderRadius:4,padding:"3px 7px",fontSize:10,cursor:"pointer",fontFamily:"var(--font-mono)"}}>Edit</button>
                          <button onClick={()=>deleteTx(t.id)} style={{background:"transparent",border:"1px solid #ef444444",color:"var(--red)",borderRadius:4,padding:"3px 7px",fontSize:10,cursor:"pointer",fontFamily:"var(--font-mono)"}}>Del</button>
                        </>}
                      </div>
                    </div>
                  ))
                }
              </Card>
            </div>
          )}

          {/* ── INSIGHTS ── */}
          {tab==="insights"&&(
            <div>
              <div style={{marginBottom:20}}>
                <h1 className="fu" style={{fontWeight:800,fontSize:22,letterSpacing:"-.03em"}}>Insights</h1>
                <p className="fu fu1" style={{color:"var(--muted)",fontSize:12,marginTop:3,fontFamily:"var(--font-mono)"}}>Patterns from your financial data</p>
              </div>

              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:14,marginBottom:14}}>
                {/* Top Category */}
                <Card className="fu fu1" style={{borderLeft:`3px solid ${CAT_COLOR[topCat?.cat]||"var(--accent)"}`}}>
                  <SLabel>Highest Spending Category</SLabel>
                  {topCat?<>
                    <div style={{display:"flex",alignItems:"center",gap:12,margin:"10px 0"}}>
                      <span style={{fontSize:30}}>{CAT_ICON[topCat.cat]}</span>
                      <div>
                        <div style={{fontSize:18,fontWeight:700}}>{topCat.cat}</div>
                        <div style={{fontSize:11,color:"var(--muted)",fontFamily:"var(--font-mono)"}}>{topCat.pct}% of total spend</div>
                      </div>
                    </div>
                    <div style={{fontFamily:"var(--font-mono)",fontSize:22,fontWeight:600,color:"var(--red)"}}>{fmt(topCat.amt)}</div>
                  </>:<div style={{color:"var(--muted)",fontFamily:"var(--font-mono)",fontSize:12}}>No data</div>}
                </Card>

                {/* Monthly Comparison */}
                <Card className="fu fu2" style={{borderLeft:"3px solid var(--blue)"}}>
                  <SLabel>Monthly Comparison</SLabel>
                  {curMon&&prevMon?<>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,margin:"10px 0"}}>
                      {[prevMon,curMon].map((m,i)=>(
                        <div key={i} style={{background:"var(--bg)",borderRadius:6,padding:"10px"}}>
                          <div style={{fontSize:10,color:"var(--muted)",fontFamily:"var(--font-mono)",marginBottom:5}}>{m.month}</div>
                          <div style={{fontSize:13,fontWeight:600,fontFamily:"var(--font-mono)",color:m.net>=0?"var(--green)":"var(--red)"}}>{m.net>=0?"+":""}{fmt(m.net)}</div>
                          <div style={{fontSize:10,color:"var(--muted)",fontFamily:"var(--font-mono)",marginTop:3}}>Spent {fmt(m.expense)}</div>
                        </div>
                      ))}
                    </div>
                    {(()=>{const diff=curMon.expense-prevMon.expense,pct=((diff/prevMon.expense)*100).toFixed(1);return(
                      <div style={{padding:"8px 10px",borderRadius:6,fontFamily:"var(--font-mono)",fontSize:11,background:diff>0?"rgba(239,68,68,.1)":"rgba(34,197,94,.1)",color:diff>0?"var(--red)":"var(--green)"}}>
                        {diff>0?"⬆":"⬇"} Spending {diff>0?"increased":"decreased"} {fmt(Math.abs(diff))} ({Math.abs(pct)}%)
                      </div>
                    );})()}
                  </>:<div style={{color:"var(--muted)",fontFamily:"var(--font-mono)",fontSize:12,marginTop:10}}>Need 2+ months of data</div>}
                </Card>

                {/* Savings Rate */}
                <Card className="fu fu3" style={{borderLeft:"3px solid var(--green)"}}>
                  <SLabel>Savings Rate</SLabel>
                  <div style={{fontFamily:"var(--font-mono)",fontSize:34,fontWeight:700,color:"var(--green)",margin:"8px 0"}}>{savingsRate}%</div>
                  <div style={{height:5,background:"var(--bg)",borderRadius:3,overflow:"hidden",marginBottom:8}}>
                    <div style={{height:"100%",width:`${Math.min(Math.max(savingsRate,0),100)}%`,background:"var(--green)",borderRadius:3,transition:"width .8s ease"}}/>
                  </div>
                  <div style={{fontSize:11,color:"var(--muted)",fontFamily:"var(--font-mono)"}}>
                    {savingsRate>=20?"✅ Great saving habit!":savingsRate>=10?"⚠️ Consider saving more":"❌ Low savings — review expenses"}
                  </div>
                </Card>
              </div>

              {/* Category Breakdown */}
              <Card className="fu fu4">
                <h2 style={{fontWeight:700,fontSize:14,marginBottom:16}}>Full Category Breakdown</h2>
                {catData.length===0
                  ?<div style={{color:"var(--muted)",textAlign:"center",padding:32,fontFamily:"var(--font-mono)",fontSize:13}}>No expense data yet</div>
                  :catData.map((d,i)=>(
                    <div key={i} style={{marginBottom:13}}>
                      <div style={{display:"flex",justifyContent:"space-between",marginBottom:5,alignItems:"center"}}>
                        <div style={{display:"flex",alignItems:"center",gap:8}}>
                          <span style={{fontSize:14}}>{CAT_ICON[d.cat]||"💳"}</span>
                          <span style={{fontSize:13,fontWeight:600}}>{d.cat}</span>
                        </div>
                        <div style={{display:"flex",gap:14}}>
                          <span style={{fontFamily:"var(--font-mono)",fontSize:11,color:"var(--muted2)"}}>{d.pct}%</span>
                          <span style={{fontFamily:"var(--font-mono)",fontSize:12,fontWeight:600,color:"var(--red)"}}>{fmt(d.amt)}</span>
                        </div>
                      </div>
                      <div style={{height:4,background:"var(--bg)",borderRadius:2,overflow:"hidden"}}>
                        <div style={{height:"100%",width:`${d.pct}%`,background:CAT_COLOR[d.cat]||"var(--accent)",borderRadius:2,transition:"width .7s ease"}}/>
                      </div>
                    </div>
                  ))
                }
              </Card>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer style={{borderTop:"1px solid var(--border)",padding:"12px 24px",display:"flex",justifyContent:"space-between",alignItems:"center",background:"var(--surface)"}}>
          <span style={{fontSize:10,color:"var(--muted)",fontFamily:"var(--font-mono)"}}>FinTrack v1.0 · {txns.length} records</span>
          <span style={{fontSize:10,fontFamily:"var(--font-mono)",padding:"3px 9px",borderRadius:4,background:isAdmin?"rgba(245,166,35,.15)":"rgba(59,130,246,.15)",color:isAdmin?"var(--accent)":"var(--blue)"}}>
            {role.toUpperCase()} MODE
          </span>
        </footer>
      </div>
    </>
  );
}
