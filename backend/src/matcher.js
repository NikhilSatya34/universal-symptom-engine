const express = require('express');
const router = express.Router();
const { normalizeTokens, scoreDisease } = require('../lib/matcher');


// POST /predict { symptoms: "text..." }
router.post('/', async (req,res)=>{
const db = req.app.locals.db;
const { symptoms } = req.body;
if(!symptoms || typeof symptoms !== 'string') return res.status(400).json({error:'Provide symptoms text.'});


const userTokens = normalizeTokens(symptoms);


// Quick candidate fetch: we fetch all (sample). In production use text-index or prefiltering.
const diseases = await db.collection('diseases').find({}).toArray();


const scored = diseases.map(d=>{
const dtokens = (d.symptom_keywords || d.symptoms || []).map(t=>t.toLowerCase());
const s = scoreDisease(userTokens, dtokens, d);
return {...d, score: s};
});


scored.sort((a,b)=>b.score - a.score);


// Map results to safe response
const results = scored.slice(0,5).map(d=>({
disease_name: d.disease_name,
confidence: Math.round(d.score*100),
medicines: d.medicines || [],
warnings: d.warnings || [],
pregnancy_warning: d.pregnancy_warning || null
}));


// If top confidence low, you can call an LLM here (commented hook)
// if(results[0].confidence < 45) { /* call LLM fallback with careful system prompt */ }


res.json({input: symptoms, results});
});


module.exports = router;