# Universal Symptom → Disease Engine (Starter Repo)


This repo is a starter kit that demonstrates a hybrid symptom→disease engine. It is NOT a medical device. Use only for prototyping and testing; do not use as a substitute for professional medical advice.


## Quick start (local with Docker)


1. Copy the repository files to a folder.
2. Place the `sample_diseases.json` into `backend/src/data/` and import to Mongo or let the app import on first start (manual import recommended):


```bash
docker compose up -d
# then copy sample json into mongo container or run mongoimport