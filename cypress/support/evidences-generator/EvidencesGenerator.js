const path = require("path");

/**
 * Cliente leve que roda no navegador durante os testes.
 * Todo trabalho com disco e bibliotecas Node (pdfkit, fs, etc.)
 * é delegado para `cy.task` configuradas no `cypress.config.js`.
 */
class EvidencesGenerator {
  constructor(suiteName, testName, metadata = {}) {
    this.suiteName = suiteName;
    this.testName = testName;
    this.startTime = Date.now();
    this.browser = metadata.browser || 'N/A';
    this.environment = metadata.environment || 'HOM';
    // usaremos uma pasta relativa para o screenshotsFolder; o task sabe combinar
    this.screenshotsRel = path.posix.join("temp", suiteName, testName); // sempre com barras '/'
    this.evidencesFolder = path.join("evidences", suiteName);

    // garante que as pastas existam no Node (screenshots será resolvida dentro de config)
    cy.task("ensureFolders", {
      screenshotsFolderRel: this.screenshotsRel,
      evidencesFolder: this.evidencesFolder,
    });
  }


  /**
   * Captura um screenshot e salva com um título
   * @param {string} title - Descrição do que está sendo capturado
   * @param {'viewport'|'fullPage'} captureMode - 
   * 'viewport'- sem scroll captura somente a área visível do navegador
   * (default) ou 'fullPage' - com scroll,Cypress rola a página, captura partes e junta numa imagem única 
   * (pode duplicar elementos fixed, ser maior e mais lento).
   */
  takeScreenshot(title, captureMode) {
    // não colocamos extensão, o Cypress adiciona ".png" automaticamente
    const fileName = `${title}`;
    //Regex caso precise retirar os caracteres especiais - .replace(/[^a-z0-9]/gi, "_")
    // caminho relativo usado como nome para o comando Cypress (sem extensão)
    const relativeName = path.posix.join(this.screenshotsRel, fileName);

    // Captura a URL atual da página
    return cy.url().then((url) => {
      // tira o screenshot no navegador e espera terminar
      return cy.screenshot(relativeName, { overwrite: true, capture: captureMode }).then(() => {
        // Armazena a URL junto com o screenshot
        cy.task("storeScreenshotUrl", {
          suiteName: this.suiteName,
          testName: this.testName,
          title: title,
          url: url,
        });

        // computa o caminho absoluto (com .png) só para log ou debug
        const absPath =
          path.join(
            Cypress.config("screenshotsFolder"),
            ...relativeName.split(path.posix.sep),
          ) + ".png";

        cy.log(`📸 Evidência capturada: ${title} -> ${absPath}`);
      });
    });
  }

  /**
   * Gera o PDF com todas as evidências capturadas
   * @returns {Promise} Promise que resolve quando o PDF for criado
   */

  generatePDF(status = 'passed') {
    const durationMs = Date.now() - this.startTime;
    const pad = (n) => String(n).padStart(2, '0');
    const h = Math.floor(durationMs / 3600000);
    const m = Math.floor((durationMs % 3600000) / 60000);
    const s = Math.floor((durationMs % 60000) / 1000);
    const executionTime = `${pad(h)}:${pad(m)}:${pad(s)}`;

    // delega toda a geração para o processo Node via task
    return cy.task("generatePdf", {
      suiteName: this.suiteName,
      testName: this.testName,
      screenshotsFolderRel: this.screenshotsRel,
      evidencesFolder: this.evidencesFolder,
      environment: this.environment,
      browser: this.browser,
      executionTime,
      status,
    });
  }

  /**
   * Limpa os screenshots temporários após gerar o PDF
   */
  deleteScreenshots() {
    // pede ao Node para apagar a pasta e os arquivos
    return cy.task("cleanScreenshots", {
      screenshotsFolderRel: this.screenshotsRel,
    });
  }
  /**
   * Finaliza o processo: gera o PDF e limpa os screenshots
   */
  async finish(status = 'passed') {
    await this.generatePDF(status);
    await this.deleteScreenshots();
  }
}

module.exports = EvidencesGenerator;
