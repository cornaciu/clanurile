// prisma/seed.ts

import { PrismaClient } from '@prisma/client';
import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const prisma = new PrismaClient();

async function main() {
  console.log(`Începe popularea bazei de date cu teritorii...`);

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  
  const geojsonPath = path.join(__dirname, '../ro_judete_poligon.geojson');
  
  try {
    const geojsonData = JSON.parse(readFileSync(geojsonPath, 'utf-8'));

    for (const feature of geojsonData.features) {
      try {
        const { name, ID, LOC_PUNCT, natcode, county } = feature.properties;
      
        if (!ID && !name) {
          console.warn("Feature-ul curent nu are ID sau nume. Sărit peste.");
          continue;
        }
        
        const geoJsonId = String(natcode);
        const locationName = name;
        const description = `Zona a județului ${county}.`;
        const locationValue = LOC_PUNCT || "N/A"; // <-- Aici este modificarea

        console.log(`  Procesează: ${locationName} (ID: ${geoJsonId})`);

        await prisma.mapTerritory.upsert({
          where: { geoJsonId: geoJsonId },
          update: {
            name: locationName,
            description: description,
            location: locationValue,
          },
          create: {
            geoJsonId: geoJsonId,
            name: locationName,
            description: description,
            location: locationValue,
          },
        });

        console.log(`  Adăugat/actualizat cu succes: ${locationName}`);

      } catch (e) {
        console.error(`  Eroare la procesarea unui feature:`, e);
      }
    }
  } catch (e) {
    console.error("Eroare la citirea sau parsarea fișierului GeoJSON:", e);
    process.exit(1);
  }

  console.log(`Popularea bazei de date a fost finalizată.`);
}

main()
  .catch((e) => {
    console.error("Eroare fatală în timpul scriptului:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });