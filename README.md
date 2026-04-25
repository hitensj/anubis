# Anubis — Autonomous Supply Chain Intelligence System

This project was built for the Solution Challenge 2026. It demonstrates a global supply chain orchestration system that uses predictive modeling and external APIs to coordinate shipments, predict risks, and calculate alternate safe routes.

## The Inspiration — Who is Anubis?

In ancient Egyptian mythology, Anubis was the god of funerary rites, protector of graves, and guide to the underworld. He was renowned for weighing the hearts of the deceased against the feather of truth — an absolute arbiter of fate.

This AI assistant takes its name and spirit from Anubis. Just as the original Anubis guided souls through the perilous trials of the Duat — protecting them and ensuring safe passage — this system guides global shipments through the perilous "underworld" of modern supply chain chokepoints. It weighs geopolitical events, weather disruptions, and chokepoint congestion to advise on decisions and keep the flow of global trade running smoothly. It does not act on impulse; it judges the risks.

🚀 **Live Demo:** [https://anubis-frontend-832546103382.us-central1.run.app/](https://anubis-frontend-832546103382.us-central1.run.app/)

## Architecture

1. **FastAPI Backend**: Provides a suite of endpoints for predictive intelligence, mock data generation, and route assessment.
2. **React Frontend**: Built with Vite and MapLibre, it graphically illustrates the flow of global shipments and cascades alerts visually.
3. **Google Cloud Run**: The frontend and backend containers are deployed separately on GCP for scalable availability.

## Intelligence Roster

All evaluations embody the persona of Anubis — speaking with the ancient authority and mysticism of the Egyptian god.

| Service | Responsibilities |
| --- | --- |
| 🔮 **Gemini Oracle** | Evaluate risk factors and render a 2-3 sentence judgment with ancient authority. |
| 🗺️ **OpenRouteService** | Calculate live driving distances, alternative routes, and risk-reduction offsets. |
| 📰 **NewsAPI** | Scan recent global news for geopolitical developments and supply chain disruptions. |
| ⛈️ **OpenWeather** | Collect climate events and weather severities near shipment origins and destinations. |
| 🔥 **Firebase DB** | (Mocked) Store and retrieve real-time shipment nodes and risk levels. |

## Features

- **Cascading Chokepoint Simulation**: The system visually cascades disruptions from global chokepoints like the Strait of Hormuz to connected network routes.
- **Dynamic Route Calculation**: Finds alternative paths intelligently if a primary route falls under elevated risk or geopolitical strain.
- **The Oracle**: A mystical AI personality leveraging Gemini 2.5 Flash to weigh the risks and offer guidance on shipping logistics.
- **Vibrant Cinematic UI**: Built intricately using modern CSS with dark 'stone' themes, gold glowing highlights, and fluid Framer Motion animations.

## How to run locally

1. Copy `.env.example` to `.env` and insert your appropriate API Keys (`GEMINI_API_KEY`, etc).
2. For an automated run, use the provided setup script on Windows: `.\setup.ps1`
   - Or on Linux/Mac: `./setup.sh`
3. Alternatively, manually install requirements in `backend/` (`pip install -r requirements.txt`) and run `uvicorn main:app --reload`.
4. Install frontend dependencies (`npm install`) and start the Vite dev server (`npm run dev`).

## Deployment

This project is packaged with two `Dockerfile`s (one for backend, one for frontend) and is fully compatible with Google Cloud Run. 

To deploy via the automated script, ensure you are authenticated via `gcloud` and run:

```powershell
.\deploy_gcp.ps1
```
