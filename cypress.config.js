const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://opensource-demo.orangehrmlive.com',
    supportFile: 'cypress/support/e2e.js',
    screenshotsFolder: 'cypress/screenshots',
    videosFolder: 'cypress/videos',
    setupNodeEvents(on, config) {
      // import here para que possamos usar pdfkit e fs no lado Node
      const fs = require('fs');
      const path = require('path');
      const PDFDocument = require('pdfkit');

      // simples gerenciador de estado em memória por teste
      let generators = {};

      on('task', {
        ensureFolders({screenshotsFolderRel, evidencesFolder}) {
          // resolve o caminho absoluto para screenshots usando config
          if (screenshotsFolderRel) {
            const abs = path.join(config.screenshotsFolder, screenshotsFolderRel);
            if (!fs.existsSync(abs)) fs.mkdirSync(abs, { recursive: true });
          }
          if (evidencesFolder && !fs.existsSync(evidencesFolder)) {
            fs.mkdirSync(evidencesFolder, { recursive: true });
          }
          return null;
        },

        storeScreenshotUrl({ suiteName, testName, title, url }) {
          const generatorKey = `${suiteName}|||${testName}`;
          if (!generators[generatorKey]) generators[generatorKey] = { screenshots: [] };
          // Armazena a URL no útimo screenshot adicionado
          const lastScreenshot = generators[generatorKey].screenshots[generators[generatorKey].screenshots.length - 1];
          if (lastScreenshot) {
            lastScreenshot.url = url;
          }
          return null;
        },

        generatePdf({ suiteName, testName, screenshotsFolderRel, evidencesFolder }) {
          return new Promise((resolve, reject) => {
            try {
              // Gera data e hora completas no formato YYYY-MM-DD-HH-MM-SS
              const now = new Date();
              const pad = (num) => String(num).padStart(2, '0');
              const dateTime = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}-${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`;
              const namePDF = `${dateTime}_${testName}.pdf`;
              const pathPDF = path.join(evidencesFolder, namePDF);

              const doc = new PDFDocument({ size: 'A4', margin: 50 });
              const stream = fs.createWriteStream(pathPDF);
              doc.pipe(stream);

              doc
                .fontSize(20)
                .text(`Evidências de Teste: ${testName}`, { align: 'center' });
              doc.fontSize(12).text(`Data/Hora: ${dateTime.replace(/-/g, '/')}`, { align: 'center' });
              doc.moveDown(2);

              // garante que cada caminho seja absoluto antes de usar
              const generatorKey = `${suiteName}|||${testName}`;
              const shots = (generators[generatorKey] && generators[generatorKey].screenshots) || [];
              shots.forEach((screenshot, index) => {
                if (index > 0) doc.addPage();
                doc.fontSize(14).text(`${screenshot.order}. ${screenshot.title}`, {
                  underline: true,
                });
                if (screenshot.url) {
                  doc.fontSize(9).text(`${screenshot.url}`, {
                    color: '#666666',
                  });
                }
                doc.moveDown(1);
                if (fs.existsSync(screenshot.file)) {
                  doc.image(screenshot.file, { fit: [500, 600], align: 'center' });
                } else {
                  doc.text('⚠️ Imagem não encontrada', { align: 'center' });
                }
              });

              doc.end();

              stream.on('finish', () => {
                delete generators[generatorKey];
                resolve(pathPDF);
              });
              stream.on('error', (err) => reject(err));
            } catch (erro) {
              reject(erro);
            }
          });
        },

        cleanScreenshots({ screenshotsFolderRel }) {
          if (screenshotsFolderRel) {
            const abs = path.join(config.screenshotsFolder, screenshotsFolderRel);
            if (fs.existsSync(abs)) {
              const files = fs.readdirSync(abs);
              files.forEach((file) => {
                fs.unlinkSync(path.join(abs, file));
              });
              fs.rmdirSync(abs);
            }
          }
          return null;
        },
      });

      // captura de qualquer screenshot realizado pelo Cypress e grava no estado
      // só adicionamos aqueles que estejam na nossa pasta "temp/<suiteName>/<testName>".
      on('after:screenshot', (details) => {
        try {
          const rel = path.relative(config.screenshotsFolder, details.path);
          const parts = rel.split(path.sep);
          const tempIdx = parts.indexOf('temp');
          if (tempIdx !== -1 && parts.length > tempIdx + 2) {
            const suiteName = parts[tempIdx + 1];
            const testName = parts[tempIdx + 2];
            const generatorKey = `${suiteName}|||${testName}`; // chave única
            const title = path.basename(details.name); // nome usado no screenshot (sem .png)
            if (!generators[generatorKey]) generators[generatorKey] = { screenshots: [] };
            const order = generators[generatorKey].screenshots.length + 1;
            generators[generatorKey].screenshots.push({ title, file: details.path, order });
          }
        } catch (err) {
          // não bloquear o fluxo de screenshots em caso de erro
        }
        return null;
      });

      return config;
    },
  },
});