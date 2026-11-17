// Gera as imagens de cada projeto a partir da gravação: <slug>.jpg (topo) e <slug>-2.jpg (trecho rolado).
import { createRequire } from 'node:module';
import path from 'node:path';
import fs from 'node:fs';

const [, , trabalho, projeto] = process.argv;
const sharp = createRequire(path.join(projeto, 'package.json'))('sharp');
const destino = path.join(projeto, 'src', 'assets', 'projetos');

for (const slug of fs.readdirSync(path.join(trabalho, 'quadros'))) {
  const pasta = path.join(trabalho, 'quadros', slug);
  const lista = JSON.parse(fs.readFileSync(path.join(pasta, 'lista.json'), 'utf8'));
  await sharp(path.join(pasta, 'capa.png')).jpeg({ quality: 90 }).toFile(path.join(destino, `${slug}.jpg`));
  // Último quadro da pausa no fim da descida (1200 + 6500 + 900 ms), quando as animações já assentaram
  const parado = lista.filter((q) => q.t <= 8500).at(-1);
  fs.copyFileSync(path.join(pasta, parado.arq), path.join(destino, `${slug}-2.jpg`));
  console.log(slug, parado.arq, parado.t);
}
