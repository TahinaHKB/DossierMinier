import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Server-side Gemini Client
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build'
      }
    }
  });
}

// API endpoint for AI-powered document extraction from arbitrary PDF/text
app.post('/api/extract-ptpf', async (req: Request, res: Response) => {
  try {
    const { rawText } = req.body;
    if (!rawText || typeof rawText !== 'string') {
      res.status(400).json({ error: 'Texte brut manquant ou invalide.' });
      return;
    }

    if (!ai) {
      res.status(200).json({
        success: false,
        fallback: true,
        message: 'Clé GEMINI_API_KEY non configurée sur le serveur. Utilisation du parseur heuristique local.'
      });
      return;
    }

    const prompt = `Tu es un ingénieur expert du Ministère des Mines de Madagascar.
Extrais les données cadastrales, techniques et financières du texte suivant issu d'un dossier minier (PTPF / Avis Cadastral).
Le document peut avoir n'importe quelle forme ou mise en page. Extrais les informations sous forme de JSON strict respectant ce schéma exact :

{
  "permitNumber": "numéro du permis (ex: 37255)",
  "permitType": "PR ou PE ou PRE",
  "bcmmCode": "code BCMM",
  "movementType": "type de mouvement ou session",
  "filingDate": "date de dépôt",
  "region": "région",
  "district": "district",
  "commune": "commune",
  "carresCount": nombre_de_carres_entier,
  "surfaceKm2": surface_en_km2_nombre,
  "applicantName": "nom de l'entreprise ou titulaire",
  "legalForm": "SARLU, SA, SARL, etc.",
  "taxId": "numéro NIF",
  "headquarters": "adresse du siège social",
  "managerName": "nom du gérant",
  "projectTitle": "titre du projet",
  "mineralsTitle": ["substances autorisées dans le titre minier"],
  "mineralsProject": ["substances recherchées dans le projet"],
  "mainMineral": "substance principale",
  "geologicalContext": "résumé contexte géologique",
  "geologicalMapRef": "carte géologique de référence",
  "drillingCount": nombre_de_forages,
  "drillingDepthM": profondeur_cumulative_en_metres,
  "trenchesLengthM": longueur_tranchees_en_metres,
  "pitsCount": nombre_de_puits,
  "coveredAreaKm2": surface_couverte_travaux_km2,
  "laboratories": ["noms des labos d'analyse"],
  "rseAnnualDeclared": budget_annuel_rse_en_MGA,
  "rseTotalDeclared": budget_total_rse_en_MGA,
  "declarationDate": "date de signature de la déclaration",
  "signatory": "nom du signataire"
}

Texte du document minier à analyser :
${rawText.slice(0, 40000)}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const parsedJson = JSON.parse(response.text || '{}');
    res.json({
      success: true,
      data: parsedJson
    });
  } catch (err: any) {
    console.error('Erreur extraction Gemini API:', err);
    res.status(500).json({
      success: false,
      error: err.message || 'Erreur lors de l’analyse par le modèle.'
    });
  }
});

// Mounting Vite in development or static in production
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, () => {
    console.log(`Serveur ÉvalMinier en écoute sur http://localhost:${PORT}`);
  });
}

startServer();
