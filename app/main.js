import {years,data,meta,regions} from './data.js';
import {chart,changeChart} from './charts.js';
const app=document.querySelector('#app');

import {overview,themed,methodology,regionalContent} from './views.js';
function render(){let key=location.hash.slice(2).split('/')[0]||'overview';let out=key==='overview'?overview():key==='methodology'?methodology():key==='population'?themed(key,'People, counted carefully.','How many of us there are and how our population is changing.',['population','births'],'population'):key==='economy'?themed(key,'A resilient economy.','The pulse of work, prices and production across Lunara.',['gdp','exports','income','unemployment','inflation'],'gdp'):key==='health'?themed(key,'Longer, healthier lives.','Health outcomes and the capacity of our care system.',['life','doctors'],'life'):key==='education'?themed(key,'Learning for every age.','The foundations of opportunity, tracked through adult literacy.',['literacy'],'literacy'):key==='environment'?themed(key,'A lighter footprint.','Our transition to clean power and a healthier natural world.',['co2','renewable'],'renewable'):overview();app.innerHTML=out;document.title=(key.charAt(0).toUpperCase()+key.slice(1))+' | Lunara Statistics Office';bind();window.scrollTo(0,0);if(location.hash.endsWith('/regions'))document.querySelector('#regions')?.scrollIntoView();window.__shotReady=true}
function bind(){
  let chartType='line';
  const refreshRegions=()=>{document.querySelector('#regional-content').innerHTML=regionalContent(+document.querySelector('#region-year').value,document.querySelector('#region-measure').value)};
  for(const id of ['region-year','region-measure'])document.getElementById(id)?.addEventListener('change',refreshRegions);
  document.querySelector('#region-download')?.addEventListener('click',()=>{
    const rows=['year,region,population_million,gdp_billion_solari',...years.flatMap((year,i)=>regions.map(r=>[year,r.name,r.population[i],r.gdp[i]].join(',')))];
    downloadCSV(rows.join('\n'),'lunara-regions-2015-2025.csv');
  });
  const selected=()=>{
    const from=document.querySelector('#from'), to=document.querySelector('#to');
    if(+from.value>+to.value){const a=from.value;from.value=to.value;to.value=a;}
    return {key:document.querySelector('#indicator').value,start:+from.value,end:+to.value};
  };
  const redraw=()=>{
    const {key,start,end}=selected();
    document.querySelector('#chart').innerHTML=chart(key,start,end,chartType);
    if(document.querySelector('#change-chart')){document.querySelector('#change-chart').innerHTML=changeChart(key,start,end);document.querySelector('#change-title').textContent=meta[key].label+': annual change';}
    const title=document.querySelector('#series-title');
    if(title){
      title.textContent=meta[key].label;
      document.querySelector('#series-unit').textContent=meta[key].unit+' · '+start+'–'+end;
      document.querySelector('#series-latest').textContent=meta[key].format(data[key][years.indexOf(end)]);
    }
  };
  for(const type of ['line','bar']) document.querySelector('#'+type+'-view')?.addEventListener('click',()=>{
    chartType=type;
    for(const t of ['line','bar'])document.querySelector('#'+t+'-view').setAttribute('aria-pressed',String(t===type));
    redraw();
  });
  document.querySelector('#apply')?.addEventListener('click',redraw);
  document.querySelector('#indicator')?.addEventListener('change',redraw);
  document.querySelector('#download')?.addEventListener('click',()=>{
    const {key,start,end}=selected();
    const rows=years.map((year,i)=>[year,data[key][i]]).filter(([year])=>year>=start&&year<=end);
    const csv=['year,'+key+' ('+meta[key].unit+')',...rows.map(row=>row.join(','))].join('\n');
    downloadCSV(csv,'lunara-'+key+'-'+start+'-'+end+'.csv');
  });
  document.querySelectorAll('th[data-sort]').forEach(th=>{
    th.querySelector('button').addEventListener('click',()=>{
      const table=th.closest('table'),idx=+th.dataset.sort,rows=[...table.tBodies[0].rows];
      const direction=th.dataset.direction==='asc'?'desc':'asc';
      table.querySelectorAll('th').forEach(cell=>{delete cell.dataset.direction;cell.removeAttribute('aria-sort')});
      th.dataset.direction=direction;th.setAttribute('aria-sort',direction==='asc'?'ascending':'descending');
      const value=row=>Number(row.cells[idx].dataset.value??row.cells[idx].textContent);
      rows.sort((a,b)=>(value(a)-value(b))*(direction==='asc'?1:-1));
      table.tBodies[0].append(...rows);
    });
  });
}
addEventListener('hashchange',render);render();

function downloadCSV(csv,name){
 const url=URL.createObjectURL(new Blob(['\ufeff'+csv],{type:'text/csv;charset=utf-8'}));
 const a=document.createElement('a');a.href=url;a.download=name;a.click();
 setTimeout(()=>URL.revokeObjectURL(url),0);
}
