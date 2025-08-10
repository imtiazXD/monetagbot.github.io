# Graphic Designer Portfolio

A modern, responsive portfolio website for a graphic designer (Taylor Rivera by default). Built with semantic HTML, modern CSS, and a sprinkle of vanilla JS. No build step required.

## Structure
- `index.html`: Landing page with hero and featured projects
- `work.html`: Filterable portfolio grid
- `about.html`: Bio, skills, and recognition
- `contact.html`: Contact form and links
- `assets/css/style.css`: Styles (light/dark theme)
- `assets/js/main.js`: Interactions (theme, nav, lightbox, filters, form)
- `data/projects.json`: Sample project data

## Customize
- Replace the name, bio, and copy in the HTML files
- Update `data/projects.json` with your real projects (image, title, tags)
- Swap the logo in `assets/img/logo.svg`
- Add your resume at `assets/Taylor-Rivera-Resume.pdf` or update the links
- Set your real social links in footers
- For the contact form, replace the `action` in `contact.html` with your Formspree endpoint or use a `mailto:` link

## Run locally
No dependencies are required. You can open `index.html` directly or serve the folder.

Using Python:
```bash
cd portfolio-site
python3 -m http.server 5173
```
Then open `http://localhost:5173`.

## Deploy
- GitHub Pages: push the folder and set Pages to the root
- Netlify/Vercel: drag-and-drop or set the folder as the project root

## License
MIT