// Hand-drawn SVG from the shared annual observations. Bars always start at zero.
import { years, data, meta, regions } from './data.js';
export function chart(key, start=years[0], end=years.at(-1), type='line') {
  let first=years.indexOf(+start), last=years.indexOf(+end);
  if (first>last) [first,last]=[last,first];
  const observations=data[key].slice(first,last+1), m=meta[key];
  const w=760,h=220,left=48,right=22,top=18,bottom=30;
  const rawMin=Math.min(...observations), rawMax=Math.max(...observations);
  const padding=(rawMax-rawMin)*.15||rawMax*.05||1;
  const low=type==='bar'?0:Math.max(0,rawMin-padding), high=rawMax+padding;
  const x=i=>observations.length===1?w/2:left+i*(w-left-right)/(observations.length-1);
  const y=v=>h-bottom-(v-low)/(high-low)*(h-top-bottom);
  const grid=Array.from({length:4},(_,i)=>{
    const value=low+(high-low)*i/3, axis=y(value);
    return `<line x1="${left}" x2="${w-right}" y1="${axis}" y2="${axis}" class="grid"/><text x="${left-10}" y="${axis+3}" style="text-anchor:end">${value.toFixed(1)}</text>`;
  }).join('');
  const line=observations.map((v,i)=>`${x(i)},${y(v)}`).join(' ');
  const dots=observations.map((v,i)=>`<circle cx="${x(i)}" cy="${y(v)}" r="3.5" fill="${m.color}"><title>${years[first+i]}: ${m.format(v)}</title></circle>`).join('');
  const band=(w-left-right)/observations.length;
  const bars=observations.map((v,i)=>`<rect x="${left+i*band+band*.17}" y="${y(v)}" width="${band*.66}" height="${y(0)-y(v)}" rx="3" fill="${m.color}"><title>${years[first+i]}: ${m.format(v)}</title></rect>`).join('');
  const labels=observations.map((v,i)=>i%2===0||i===observations.length-1?`<text x="${type==='bar'?left+(i+.5)*band:x(i)}" y="${h-7}">${years[first+i]}</text>`:'').join('');
  const trendDescription=observations.length>1?`${m.label} moved from ${m.format(observations[0])} to ${m.format(observations.at(-1))} between ${years[first]} and ${years[last]}.`:`${m.label} was ${m.format(observations[0])} in ${years[first]}.`;
  return `<div class="chart" aria-label="${trendDescription}"><svg viewBox="0 0 ${w} ${h}" role="img" aria-label="${m.label}, ${years[first]} to ${years[last]}, ${m.unit}"><title>${m.label}, ${m.unit}</title>${grid}${type==='bar'?bars:`<polyline points="${line}" fill="none" stroke="${m.color}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>${dots}`}${labels}</svg><div class="chart-note"><span>${m.unit} · ${type==='bar'?'zero baseline':'expanded scale'}</span><b>${m.format(observations.at(-1))} in ${years[last]}</b></div><p class="source">Source: Lunara illustrative annual dataset · Calendar year · <a href="#/methodology">Definitions & methods →</a></p></div>`;
}

// A signed, zero-centred scale makes contractions as visible as growth.
export function changeChart(key,start=years[0],end=years.at(-1)) {
  const first=Math.min(years.indexOf(+start),years.indexOf(+end));
  const last=Math.max(years.indexOf(+start),years.indexOf(+end));
  const values=years.map((year,i)=>({year,value:i?(data[key][i]/data[key][i-1]-1)*100:null})).slice(Math.max(1,first),last+1);
  if(!values.length)return '<p class="notice">Annual change needs an observation after the first dataset year.</p>';
  const max=Math.max(...values.map(d=>Math.abs(d.value)),1), band=660/values.length;
  return `<div class="chart delta-chart"><svg viewBox="0 0 760 190" role="img" aria-label="${meta[key].label}: annual percentage change"><title>Annual percentage change in ${meta[key].label}</title><line x1="55" x2="735" y1="85" y2="85" class="grid"/><text x="28" y="88">0%</text>${values.map((d,i)=>{const h=Math.abs(d.value)/max*52,x=65+i*band;return `<rect x="${x}" y="${d.value>=0?85-h:85}" width="${band*.65}" height="${h}" rx="2" fill="${d.value>=0?meta[key].color:'#b45467'}"><title>${d.year}: ${d.value.toFixed(1)}%</title></rect><text x="${x+band*.325}" y="${d.value>=0?77-h:100+h}">${d.value.toFixed(1)}%</text><text x="${x+band*.325}" y="178">${String(d.year).slice(2)}</text>`}).join('')}</svg><p class="chart-description">Change relative to the previous year, even when the selected range starts later. Percentage changes in rates are relative changes, not percentage points.</p></div>`;
}
export function renewableDonut(){
  const share=data.renewable.at(-1);
  return `<figure class="energy-visual"><div class="donut" style="--share:${share}%" role="img" aria-label="${share}% renewable electricity in ${years.at(-1)}"><div><strong>${meta.renewable.format(share)}</strong><span>renewable</span></div></div><figcaption>Electricity generation · ${years.at(-1)}<small>Up ${share-data.renewable[0]} percentage points since ${years[0]}</small></figcaption></figure>`;
}
export function regionalBars(year=years.at(-1),key='population'){
 const i=years.indexOf(+year);if(i<0)throw new RangeError('Year is outside the regional series.');const max=Math.max(...regions.map(r=>r[key][i]));
 return `<div class="regional-bars" role="img" aria-label="Regional ${meta[key].label.toLowerCase()} in ${year}">${regions.map(r=>`<div><span>${r.name}</span><div class="bar-track"><i style="width:${r[key][i]/max*100}%;background:${meta[key].color}"></i></div><b>${meta[key].format(r[key][i])}</b></div>`).join('')}</div><p class="chart-description">${meta[key].unit} · ${year} · bars start at zero</p>`;
}
