import { defineConfig } from 'vite';
import handlebars from 'vite-plugin-handlebars';
import { resolve } from 'path';
import fs from 'fs';

// Lit, fusionne et tri les données de la frise chronologique depuis différents fichiers JSON. 
const buildContext = () => {
    const data_dir = resolve(__dirname, 'src/data');

    const stack = JSON.parse(fs.readFileSync(resolve(data_dir, 'stack.json'), 'utf-8'));
    const color_map = {};
    [...stack.languages, ...stack.tools].forEach(tech => {
        color_map[tech.name] = tech.color;
    });
    const tech_format = (tech_name) => ({
        name: tech_name,
        color: color_map[tech_name] || "var(--color-primary)" // Fallback
    });

    const projects_raw = JSON.parse(fs.readFileSync(resolve(data_dir, 'projects.json'), 'utf-8'));
    const jobs_raw = JSON.parse(fs.readFileSync(resolve(data_dir, 'jobs.json'), 'utf-8'));

    // Fusionner et trier les tableaux en ajoutant les méta-données du layout pour le template Handlebars
    const timeline_raw = [
        ...projects_raw.map(p => ({ ...p, is_project: true })),
        ...jobs_raw.map(j => ({ ...j, is_job: true }))
    ].sort((a, b) => b.sort_date.localeCompare(a.sort_date));

    // Alterner dynamiquement gauche/droite et appliquer le formatage des technologies
    const timeline = timeline_raw.map((item, index) => {
        item.layout = (index % 2 === 0) ? 'left' : 'right';

        if (item.tech) {
            item.tech = item.tech.map(tech_format);
        }
        return item;
    });

    return { stack, timeline };
};

export default defineConfig({
    // Definir le chemin de base pour GitHub Pages
    base: '/portfolio/',
    plugins: [
        handlebars({
            // Directory qui contient les composants HTML
            partialDirectory: resolve(__dirname, 'src/partials'),
            // Injecter le JSON dans les templates
            context: () => buildContext()
        })
    ]
});