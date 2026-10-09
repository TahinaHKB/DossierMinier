import * as pdfjsLib from 'pdfjs-dist';
import { MiningPermitDocument, EquipmentItem, InvestmentPhaseItem, CmrmItem } from '../types/mining';
import { SAMPLE_37255_DOSSIER } from '../data/sampleDossier';

// Configure pdfjs worker if available or fallback
try {
  // @ts-ignore
  if (typeof window !== 'undefined' && pdfjsLib.GlobalWorkerOptions) {
    // @ts-ignore
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || '4.10.38'}/pdf.worker.min.mjs`;
  }
} catch (e) {
  console.warn('Could not set pdf worker url:', e);
}

export interface ExtractedPdfContent {
  rawText: string;
  pageCount: number;
  extractedDoc: MiningPermitDocument;
  confidenceScore: number;
  aiAssisted?: boolean;
}

export async function parsePdfFile(file: File): Promise<ExtractedPdfContent> {
  const arrayBuffer = await file.arrayBuffer();
  let fullText = '';
  let pageCount = 1;

  try {
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdfDoc = await loadingTask.promise;
    pageCount = pdfDoc.numPages;

    for (let pageNum = 1; pageNum <= pageCount; pageNum++) {
      const page = await pdfDoc.getPage(pageNum);
      const textContent = await page.getTextContent();
      const pageStrings = textContent.items
        .map((item: any) => ('str' in item ? item.str : ''))
        .filter(Boolean);
      fullText += `\n--- PAGE ${pageNum} ---\n` + pageStrings.join(' ');
    }
  } catch (err) {
    console.error('Erreur lecture pdfjs-dist, fallback extraction texte binaire:', err);
    const decoder = new TextDecoder('utf-8');
    fullText = decoder.decode(arrayBuffer);
  }

  // First try server-side AI extraction if backend is available
  try {
    const aiResponse = await fetch('/api/extract-ptpf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rawText: fullText })
    });

    if (aiResponse.ok) {
      const aiResult = await aiResponse.json();
      if (aiResult.success && aiResult.data) {
        const enrichedDoc = buildDocumentFromExtractedData(aiResult.data, file.name, fullText);
        return {
          rawText: fullText,
          pageCount,
          extractedDoc: enrichedDoc,
          confidenceScore: 95,
          aiAssisted: true
        };
      }
    }
  } catch (aiErr) {
    console.warn('API /api/extract-ptpf non joignable ou sans clé, bascule sur parseur heuristique:', aiErr);
  }

  // Fallback: Local Robust Heuristic Parser
  const heuristicDoc = parseTextHeuristically(fullText, file.name);
  return {
    rawText: fullText,
    pageCount,
    extractedDoc: heuristicDoc,
    confidenceScore: 80,
    aiAssisted: false
  };
}

export function parseTextHeuristically(text: string, fileName: string): MiningPermitDocument {
  // Base template
  const doc: MiningPermitDocument = JSON.parse(JSON.stringify(SAMPLE_37255_DOSSIER));
  doc.id = fileName.replace(/\.[^/.]+$/, '');
  doc.fileName = fileName;

  // 1. Permit number
  const permitMatch = text.match(/(?:Permis(?:\s+minier)?\s*(?:N°|Numero|Numéro)?\s*[:\s]+|[Nn]°\s*permis\s*[:\s]+|PERMIS\s+)(\d[\d\s]{2,7})/i);
  if (permitMatch && permitMatch[1]) {
    doc.permitNumber = permitMatch[1].replace(/\s+/g, '').trim();
  }

  // 2. Type de permis (PR, PE, PRE)
  const typeMatch = text.match(/(?:Type\s*(?:du)?\s*permis\s*[:\s]+|[Ss]okajy\s*[:\s]+)(PR|PE|PRE|PREA)/i);
  if (typeMatch && typeMatch[1]) {
    doc.permitType = typeMatch[1].toUpperCase();
  }

  // 3. Code BCMM
  const bcmmMatch = text.match(/(?:Code\s*BCMM\s*[:\s]+)(\d+)/i);
  if (bcmmMatch && bcmmMatch[1]) {
    doc.bcmmCode = bcmmMatch[1].trim();
  }

  // 4. Titulaire / Société
  const titulaireMatch = text.match(/(?:Titulaire|Nom du demandeur|Société|Raison sociale|PROMOTEUR)\s*[:\s]+([A-Z0-9\s.,'’\-]+?(?:S\.?A\.?R\.?L\.?U?|S\.?A\.?|SOCIETE|COMPANY|MINING|SARL|SA|EURL)?)(?=\r|\n|Adresse|NIF|Statut|Code|$)/i);
  if (titulaireMatch && titulaireMatch[1]) {
    const rawName = titulaireMatch[1].trim();
    if (rawName.length > 3 && rawName.length < 80) {
      doc.applicantName = rawName;
    }
  }

  // 5. Gérant
  const gerantMatch = text.match(/(?:Gérant|représentant habilité|Directeur Général|Directeur)\s*[:\s]+([A-Z][a-z]+(?:\s+[A-Z][a-z]+|\s+[A-Z]+)+)/i);
  if (gerantMatch && gerantMatch[1]) {
    doc.managerName = gerantMatch[1].trim();
  }

  // 6. NIF
  const nifMatch = text.match(/(?:Identification\s*fiscale|NIF|N\.I\.F\.)\s*[:\s]+([\d\s]{8,15})/i);
  if (nifMatch && nifMatch[1]) {
    doc.taxId = nifMatch[1].trim();
  }

  // 7. Localisation: Région, District, Commune
  const regionMatch = text.match(/(?:Région\(s\)?|Faritra)\s*[:\s]+([A-Z\s\-]+?)(?=\s+District|\s+Commune|\r|\n|$)/i);
  if (regionMatch && regionMatch[1]) {
    doc.region = regionMatch[1].trim();
  }

  const districtMatch = text.match(/District\s*[:\s]+([A-Z\s\-]+?)(?=\s+Commune|\r|\n|$)/i);
  if (districtMatch && districtMatch[1]) {
    doc.district = districtMatch[1].trim();
  }

  const communeMatch = text.match(/(?:Commune|Kaominina)\s*[:\s]+([A-Z\s\-]+?)(?=\s+Nbre|\s+Total|\r|\n|$)/i);
  if (communeMatch && communeMatch[1]) {
    doc.commune = communeMatch[1].trim();
  }

  // 8. Nombre de carrés & Surface
  const carresMatch = text.match(/(?:Nombre\s*carrés\s*restants|Nombre\s*total\s*de\s*carrés|Fitambaran'ny\s*efamira|Total\s*carrés)\s*[:\s]+(\d+)/i);
  if (carresMatch && carresMatch[1]) {
    doc.carresCount = parseInt(carresMatch[1], 10);
    doc.surfaceKm2 = parseFloat((doc.carresCount * 0.390625).toFixed(2));
  }

  // 9. Substances
  const substanceMatch = text.match(/Substance\(s\)\s*[:\s]+([A-Za-z,\s]+?)(?=\r|\n|Substance|Carrés|$)/i);
  if (substanceMatch && substanceMatch[1]) {
    const subs = substanceMatch[1].split(/[,;]/).map(s => s.trim()).filter(Boolean);
    if (subs.length > 0) {
      doc.mineralsTitle = subs;
      doc.mineralsProject = subs;
      doc.mainMineral = subs[0];
    }
  }

  return doc;
}

function buildDocumentFromExtractedData(
  aiData: any,
  fileName: string,
  _rawText: string
): MiningPermitDocument {
  const baseDoc: MiningPermitDocument = JSON.parse(JSON.stringify(SAMPLE_37255_DOSSIER));

  baseDoc.id = fileName.replace(/\.[^/.]+$/, '');
  baseDoc.fileName = fileName;

  if (aiData.permitNumber) baseDoc.permitNumber = String(aiData.permitNumber);
  if (aiData.permitType) baseDoc.permitType = String(aiData.permitType);
  if (aiData.bcmmCode) baseDoc.bcmmCode = String(aiData.bcmmCode);
  if (aiData.applicantName) baseDoc.applicantName = String(aiData.applicantName);
  if (aiData.legalForm) baseDoc.legalForm = String(aiData.legalForm);
  if (aiData.taxId) baseDoc.taxId = String(aiData.taxId);
  if (aiData.managerName) baseDoc.managerName = String(aiData.managerName);
  if (aiData.headquarters) baseDoc.headquarters = String(aiData.headquarters);
  if (aiData.region) baseDoc.region = String(aiData.region);
  if (aiData.district) baseDoc.district = String(aiData.district);
  if (aiData.commune) baseDoc.commune = String(aiData.commune);
  if (aiData.carresCount) {
    baseDoc.carresCount = Number(aiData.carresCount);
    baseDoc.surfaceKm2 = aiData.surfaceKm2 ? Number(aiData.surfaceKm2) : Number((baseDoc.carresCount * 0.390625).toFixed(2));
  }
  if (Array.isArray(aiData.mineralsTitle) && aiData.mineralsTitle.length > 0) {
    baseDoc.mineralsTitle = aiData.mineralsTitle;
  }
  if (Array.isArray(aiData.mineralsProject) && aiData.mineralsProject.length > 0) {
    baseDoc.mineralsProject = aiData.mineralsProject;
  }
  if (aiData.mainMineral) baseDoc.mainMineral = String(aiData.mainMineral);
  if (aiData.projectTitle) baseDoc.projectTitle = String(aiData.projectTitle);
  if (aiData.geologicalContext) baseDoc.geologicalContext = String(aiData.geologicalContext);
  if (aiData.geologicalMapRef) baseDoc.geologicalMapRef = String(aiData.geologicalMapRef);
  if (aiData.drillingCount) baseDoc.drillingCount = Number(aiData.drillingCount);
  if (aiData.drillingDepthM) baseDoc.drillingDepthM = Number(aiData.drillingDepthM);
  if (aiData.trenchesLengthM) baseDoc.trenchesLengthM = Number(aiData.trenchesLengthM);
  if (aiData.pitsCount) baseDoc.pitsCount = Number(aiData.pitsCount);
  if (aiData.coveredAreaKm2) baseDoc.coveredAreaKm2 = Number(aiData.coveredAreaKm2);
  if (Array.isArray(aiData.laboratories) && aiData.laboratories.length > 0) {
    baseDoc.laboratories = aiData.laboratories;
  }
  if (aiData.rseAnnualDeclared) baseDoc.rseAnnualDeclared = Number(aiData.rseAnnualDeclared);
  if (aiData.rseTotalDeclared) baseDoc.rseTotalDeclared = Number(aiData.rseTotalDeclared);
  if (aiData.declarationDate) baseDoc.declarationDate = String(aiData.declarationDate);
  if (aiData.signatory) baseDoc.signatory = String(aiData.signatory);

  return baseDoc;
}
