import { defineConfig } from 'vite';
import handlebars from 'vite-plugin-handlebars';
import { resolve } from 'path';
import fs from 'fs';

const data_read = () => {
    // Lire et parser projects.json
    const file_path = resolve(__dirname, 'src/data/projects.json');
    const file_content = fs.readFileSync(file_path, 'utf-8');
    return JSON.parse(file_content);
};

export default defineConfig({
    // Definir le chemin de base pour GitHub Pages
    base: '/portfolio/',
    plugins: [
        handlebars({
            // Directory qui contient les composants HTML
            partialDirectory: resolve(__dirname, 'src/partials'),
            // Injecter le JSON dans les templates
            context: data_read()
        })
    ]
});