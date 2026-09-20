import { defineConfig } from 'vite';
import handlebars from 'vite-plugin-handlebars';
import { resolve } from 'path';
import fs from 'fs';

/** 
 * Lit, fusionne et tri les données de la frise chronologique depuis différents fichiers JSON. 
 * @return {Object} L'objet contenant le contexte de la stack et de la frise. 
 */
const buildContext = () => {
    const data_dir = resolve(__dirname, 'src/data');

    const stack = JSON.parse(fs.readFileSync(resolve(data_dir, 'stack.json'), 'utf-8'));
    const projects_raw = JSON.parse(fs.readFileSync(resolve(data_dir, 'projects.json'), 'utf-8'));
    const jobs_raw = JSON.parse(fs.readFileSync(resolve(data_dir, 'jobs.json'), 'utf-8'));

    // Ajouter les méta-données du layout pour le template Handlebars
    const projects = projects_raw.map(p => ({ ...p, layout: 'left', is_project: true }));
    const jobs = jobs_raw.map(j => ({ ...j, layout: 'right', is_job: true }));

    // Fusionner les tableaux et les trier par 'sort_date'
    const timeline = [...projects, ...jobs].sort((a, b) => {
        return b.sort_date.localeCompare(a.sort_date);
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