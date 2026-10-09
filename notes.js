window.StudioNotes = [
  {id:'note-01', title:'The Website Begins', shortTitle:'Website / Day 01', date:'2026.09.18', type:'Website Journal'},
  {id:'note-02', title:'AI Art Reading Response', shortTitle:'AI Art / Reading', date:'2026.09.19', type:'Reading Response'},
  {id:'note-03', title:'reading_Internet Art', shortTitle:'Internet Art / Reading', date:'2026.09.21', type:'Reading Response'},
  {id:'note-04', title:'Unstable Aesthetics: Game', shortTitle:'Unstable Aesthetics', date:'2026.10.02', type:'Reading Response'},
  ...Array.from({length:14},(_,i)=>({
    id:'note-'+String(i+5).padStart(2,'0'),
    title:'Untitled Entry '+String(i+5).padStart(2,'0'),
    shortTitle:'Empty / '+String(i+5).padStart(2,'0'),
    date:'—.—.—',
    type:'Empty Log Slot',
    empty:true
  }))
];
