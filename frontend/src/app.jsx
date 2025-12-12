import React, {useState} from 'react';
import axios from 'axios';
import './styles.css';


export default function App(){
const [symptoms, setSymptoms] = useState('');
const [results, setResults] = useState(null);
const [loading, setLoading] = useState(false);
const backend = process.env.REACT_APP_BACKEND || 'http://localhost:3001';


async function handleSubmit(e){
e.preventDefault();
setLoading(true);
try{
const resp = await axios.post(backend + '/predict', {symptoms});
setResults(resp.data.results);
}catch(err){
console.error(err);
alert('Error: '+ (err?.response?.data?.error || err.message));
}finally{ setLoading(false); }
}


return (
<div className="container">
<h2>Symptom → Disease Engine (Demo)</h2>
<form onSubmit={handleSubmit}>
<textarea value={symptoms} onChange={e=>setSymptoms(e.target.value)} placeholder="Describe symptoms e.g. 'urine yellowish'" />
<button type="submit" disabled={loading}>{loading? 'Checking...' : 'Check'}</button>
</form>


{results && (
<div className="results">
{results.map(r=> (
<div key={r.disease_name} className="card">
<h3>{r.disease_name} — {r.confidence}%</h3>
<div><strong>Medicines:</strong>
<ul>{r.medicines.map(m=>(<li key={m.name}>{m.name} {m.otc===false? '(Prescription only)':''}</li>))}</ul>
</div>
{r.warnings?.length>0 && <div><strong>Warnings:</strong><ul>{r.warnings.map(w=>(<li key={w}>{w}</li>))}</ul></div>}
</div>
))}
</div>
)}


<p className="disclaimer">This is informational only — not a diagnosis. Always consult a licensed healthcare professional.</p>
</div>
);
}