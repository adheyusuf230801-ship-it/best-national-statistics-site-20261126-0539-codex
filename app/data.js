// A single fictional annual dataset. Currency: solari. No remote data sources.
export const release='14 Feb 2026';
export const years=[2015,2016,2017,2018,2019,2020,2021,2022,2023,2024,2025];
export const data={
 population:[4.21,4.27,4.34,4.41,4.48,4.56,4.64,4.73,4.82,4.91,5.00],
 gdp:[18.4,19.1,20.3,21.2,22.4,21.8,23.6,25.1,26.8,28.4,30.2],
 unemployment:[7.8,7.4,6.9,6.5,6.1,8.6,7.7,6.8,6.2,5.7,5.3],
 inflation:[1.2,1.5,1.8,2.1,2.3,1.1,2.8,6.4,4.2,2.7,2.4],
 life:[71.8,72.1,72.5,72.9,73.2,72.8,73.6,74.0,74.4,74.8,75.1],
 births:[18.2,17.9,17.7,17.4,17.1,16.8,16.5,16.2,15.9,15.7,15.4],
 literacy:[89.4,89.9,90.4,90.9,91.4,91.8,92.3,92.8,93.2,93.7,94.1],
 co2:[2.8,2.9,3.0,3.1,3.0,2.7,2.8,2.9,2.8,2.7,2.6],
 renewable:[18,20,22,24,27,31,35,39,43,47,51],
 exports:[5.1,5.4,5.9,6.2,6.7,5.8,6.9,7.8,8.6,9.3,10.1],
 income:[18400,18900,19500,20100,20800,20500,21600,22900,24200,25600,27100],
 doctors:[1.7,1.8,1.9,2.0,2.1,2.1,2.2,2.3,2.4,2.5,2.6]
};
export const meta={
 population:{label:'Population',unit:'million people',definition:'Estimated usual-resident population at mid-year, in millions.',format:v=>v.toFixed(2)+'m',color:'#1e6b5c'},
 gdp:{label:'GDP',unit:'billion solari',definition:'Gross domestic product at current prices, in billions of local solari.',format:v=>'$'+v.toFixed(1)+'bn',color:'#d97742'},
 unemployment:{label:'Unemployment',unit:'percent of labour force',format:v=>v.toFixed(1)+'%',color:'#b45467'},
 inflation:{label:'Inflation',unit:'annual percent change',format:v=>v.toFixed(1)+'%',color:'#8a63b8'},
 life:{label:'Life expectancy',unit:'years at birth',format:v=>v.toFixed(1)+' years',color:'#2e7bb4'},
 births:{label:'Birth rate',unit:'births per 1,000 people',format:v=>v.toFixed(1),color:'#e09b2d'},
 literacy:{label:'Adult literacy',unit:'percent of adults',format:v=>v.toFixed(1)+'%',color:'#2b8c7e'},
 co2:{label:'CO₂ emissions',unit:'tonnes per person',format:v=>v.toFixed(1)+' t',color:'#60707a'},
 renewable:{label:'Renewable electricity',unit:'share of generation',format:v=>v.toFixed(0)+'%',color:'#529c65'},
 exports:{label:'Exports',unit:'billion solari, goods and services',format:v=>'$'+v.toFixed(1)+'bn',color:'#b66d36',definition:'Goods and services sold abroad, measured at current prices in local solari.'},
 income:{label:'Median household income',unit:'solari per household per year',format:v=>'$'+v.toLocaleString('en-US'),color:'#837044',definition:'Median annual disposable household income, in nominal solari; not adjusted for inflation.'},
 doctors:{label:'Doctors',unit:'per 1,000 people',format:v=>v.toFixed(1),color:'#ca6572'}
};
export function latest(k){return data[k][data[k].length-1]}
export function atYear(k,year){const i=years.indexOf(+year);if(i<0)throw new RangeError('Year is outside the Lunara series.');return data[k][i]}
export function validateDataset(){for(const [key,values] of Object.entries(data)){if(values.length!==years.length||values.some(v=>!Number.isFinite(v)))throw new Error('Invalid annual series: '+key)}for(const region of regions){for(const key of ['population','gdp'])if(region[key].length!==years.length||region[key].some(v=>!Number.isFinite(v)))throw new Error('Invalid regional series: '+region.name+' '+key)}for(const key of ['population','gdp'])for(let i=0;i<years.length;i++){const regional=regions.reduce((sum,r)=>sum+r[key][i],0);if(Math.abs(regional-data[key][i])>.011)throw new Error('Regional '+key+' does not reconcile in '+years[i])}return true}
export function change(k){const a=data[k]; return ((a.at(-1)-a[0])/a[0])*100}

// Regional observations use the same units and years as the national accounts.
// The fourth region is the exact residual, avoiding independent rounding drift.
const regionalInputs=[
 {name:'Solara Coast',population:[1.55,1.58,1.62,1.65,1.69,1.73,1.77,1.81,1.86,1.90,1.95],gdp:[7.8,8.1,8.7,9.1,9.7,9.3,10.2,10.9,11.7,12.5,13.4]},
 {name:'Verdant Valley',population:[1.12,1.14,1.16,1.18,1.20,1.22,1.24,1.27,1.29,1.32,1.35],gdp:[4.5,4.7,5.0,5.2,5.5,5.4,5.8,6.2,6.6,7.0,7.4]},
 {name:'Amber Highlands',population:[.89,.90,.91,.92,.93,.94,.95,.96,.97,.98,.99],gdp:[3.7,3.8,4.0,4.2,4.4,4.4,4.7,5.0,5.3,5.5,5.8]}
];
export const regions=[...regionalInputs,{name:'Northern Isles',...Object.fromEntries(['population','gdp'].map(k=>[k,years.map((_,i)=>Number((data[k][i]-regionalInputs.reduce((sum,r)=>sum+r[k][i],0)).toFixed(2)))]))}];
export const regionalYear=years.at(-1);
export function difference(key,start=0,end=years.length-1){return data[key][end]-data[key][start]}

validateDataset();
