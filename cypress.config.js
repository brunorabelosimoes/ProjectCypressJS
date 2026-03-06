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
      const os = require('os');
      const PDFDocument = require('pdfkit');

      // simples gerenciador de estado em memória por teste
      let generators = {};

      // ─── Helpers para a capa do PDF ──────────────────────────────────────────

      /**
       * Desenha uma seção informativa (título + linhas label/valor) e devolve
       * a coordenada Y logo após o último item.
       */
      function drawInfoSection(doc, navyColor, slateColor, title, items, M, CW, y) {
        // Faixa de cabeçalho da seção
        doc.rect(M, y, CW, 22).fill(slateColor);
        doc.rect(M, y, 4,  22).fill(navyColor);
        doc.fillColor(navyColor).fontSize(9).font('Helvetica-Bold')
           .text(title, M + 12, y + 7, { width: CW - 12, lineBreak: false });
        y += 26;

        items.forEach(([label, value], i) => {
          // Zebra stripe
          if (i % 2 === 0) doc.rect(M, y - 2, CW, 20).fill('#F8FAFC');

          doc.fillColor('#475569').fontSize(10).font('Helvetica-Bold')
             .text(label + ':', M + 10, y, { width: 178, lineBreak: false });
          doc.fillColor('#0F172A').fontSize(10).font('Helvetica')
             .text(String(value || '—'), M + 192, y, { width: CW - 197, lineBreak: false });
          y += 20;
        });

        return y;
      }

      /**
       * Desenha a página de capa completa no documento PDFKit.
       */
      function drawCoverPage(doc, meta) {
        const { suiteName, testName, environment, responsible,
                dateFormatted, browser, executionTime, status, logoPath } = meta;

        const W     = 595.28;  // A4 largura em pontos
        const M     = 40;      // margem horizontal
        const CW    = W - M * 2; // largura do conteúdo ≈ 515 pt

        const NAVY  = '#1B3A6B';
        const CYAN  = '#00B4D8';
        const SLATE = '#EBF2FC';

        // ── Banner superior ──────────────────────────────────────────────────
        doc.rect(0, 0, W, 145).fill(NAVY);
        doc.rect(0, 140, W, 5).fill(CYAN);

        // Logo
        if (fs.existsSync(logoPath)) {
          try { doc.image(logoPath, M, 24, { width: 92 }); } catch (_) { /* logo inválida */ }
        }

        // Título e subtítulo
        doc.fillColor('#FFFFFF').fontSize(26).font('Helvetica-Bold')
           .text('EVIDÊNCIA DE TESTE', M + 112, 40, { width: CW - 112, lineBreak: false });
        doc.fillColor('#A8C8E8').fontSize(11).font('Helvetica')
           .text('Automated Testing Framework  •  Bruno Simões', M + 112, 84, { width: CW - 112 });

        // ── Seção 1: Informações do Teste ────────────────────────────────────
        let y = 163;
        y = drawInfoSection(doc, NAVY, SLATE, 'INFORMAÇÕES DO TESTE', [
          ['Suite',                     suiteName],
          ['Caso de Teste',             testName],
          ['Ambiente',                  environment],
          ['Responsável pela Execução', responsible],
          ['Data / Hora da Execução',   dateFormatted],
        ], M, CW, y);

        y += 12;

        // ── Seção 2: Informações Técnicas ────────────────────────────────────
        y = drawInfoSection(doc, NAVY, SLATE, 'INFORMAÇÕES TÉCNICAS', [
          ['Navegador',         browser],
          ['Framework',         'Cypress'],
          ['Pipeline CI/CD',    'Jenkins'],
          ['Tempo de Execução', executionTime],
        ], M, CW, y);

        y += 20;

        // ── Banner de Status ─────────────────────────────────────────────────
        const passed      = (status === 'passed');
        const statusBg    = passed ? '#DCFCE7' : '#FEE2E2';
        const statusColor = passed ? '#16A34A' : '#DC2626';
        const statusText  = passed ? 'PASSOU' : 'FALHOU';

        doc.save();
        doc.lineWidth(1.5);
        doc.rect(M, y, CW, 58).fillAndStroke(statusBg, statusColor);
        doc.restore();

        // Barra acentuada esquerda (sobrepõe a borda)
        doc.rect(M, y, 6, 58).fill(statusColor);

        doc.fillColor('#374151').fontSize(12).font('Helvetica-Bold')
           .text('STATUS:', M + 18, y + 21, { lineBreak: false });
        doc.fillColor(statusColor).fontSize(22).font('Helvetica-Bold')
           .text(statusText, M + 118, y + 14, { width: CW - 130 });
      }

      // ─────────────────────────────────────────────────────────────────────────

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

        generatePdf({ suiteName, testName, screenshotsFolderRel, evidencesFolder,
                      environment, browser, executionTime, status }) {
          return new Promise((resolve, reject) => {
            try {
              const now = new Date();
              const pad = (n) => String(n).padStart(2, '0');

              // Nome do ficheiro: timestamp + nome do teste
              const dateForFile = `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())}`
                                + `-${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`;
              const dateFormatted = `${pad(now.getDate())}/${pad(now.getMonth()+1)}/${now.getFullYear()}`
                                  + ` ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
              const namePDF = `${dateForFile}_${status}_${testName}.pdf`;
              const pathPDF = path.join(evidencesFolder, namePDF);

              const doc = new PDFDocument({ size: 'A4', margin: 50 });
              const stream = fs.createWriteStream(pathPDF);
              doc.pipe(stream);

              // ── Capa ────────────────────────────────────────────────────────
              const logoPath = path.join(config.projectRoot, 'cypress', 'assets', 'logo.png');
              drawCoverPage(doc, {
                suiteName,
                testName,
                environment:  environment || 'HOM',
                responsible:  os.userInfo().username,
                dateFormatted,
                browser:      browser || 'N/A',
                executionTime: executionTime || '00:00:00',
                status:       status || 'passed',
                logoPath,
              });

              // ── Screenshots (uma por página) ─────────────────────────────────
              const generatorKey = `${suiteName}|||${testName}`;
              const shots = (generators[generatorKey] && generators[generatorKey].screenshots) || [];
              shots.forEach((screenshot) => {
                doc.addPage();
                doc.fillColor('#1B3A6B').fontSize(14).font('Helvetica-Bold')
                   .text(`${screenshot.order}. ${screenshot.title}`, { underline: false });
                if (screenshot.url) {
                  doc.fillColor('#6B7280').fontSize(9).font('Helvetica')
                     .text(screenshot.url);
                }
                doc.moveDown(0.8);
                if (fs.existsSync(screenshot.file)) {
                  doc.image(screenshot.file, { fit: [500, 600], align: 'center' });
                } else {
                  doc.fillColor('#CC0000').text('Imagem nao encontrada', { align: 'center' });
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