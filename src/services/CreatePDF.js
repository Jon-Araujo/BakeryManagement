import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import sendEmail from './SendReport';

const dataAtual = new Date();
const dia = String(dataAtual.getDate()).padStart(2, '0');
const mes = String(dataAtual.getMonth() + 1).padStart(2, '0');
const ano = dataAtual.getFullYear();
const horaFormatada = dataAtual.toLocaleTimeString();

const ConvertCurrency = (price) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(price);
};

export default async function createPdf(data, user, initialValue, finalValue, differenceValue) {
  let lackOrOver = '';
  const pdfDoc = await PDFDocument.create();
  let page = pdfDoc.addPage();
  const { height, width } = page.getSize();

  const imageUrl = '/images/logo.jpg';
  const imgBytes = await fetch(imageUrl).then((res) => res.arrayBuffer());
  const image = await pdfDoc.embedJpg(imgBytes);

  const imageWidth = 120;
  const imageHeight = 100;
  const xPos = (page.getWidth() - imageWidth) / 2;
  let yPos = height - imageHeight - 20;

  page.drawImage(image, {
    x: xPos,
    y: yPos,
    width: imageWidth,
    height: imageHeight,
  });

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontSize = 12;

  yPos -= 30;
  const margin = 50;

  page.drawText(`Relatório gerado em: ${dia}/${mes}/${ano} às ${horaFormatada}`, {
    x: margin,
    y: yPos,
    size: fontSize,
    color: rgb(0, 0, 0),
  });

  yPos -= 20;
  page.drawText(`O caixa foi aberto por: ${user}`, {
    x: margin,
    y: yPos,
    size: fontSize,
    color: rgb(0, 0, 0),
  });

  yPos -= 20;
  page.drawText(`O caixa iniciou com o valor de: ${ConvertCurrency(initialValue)}`, {
    x: margin,
    y: yPos,
    size: fontSize,
    color: rgb(1, 0, 0),
  });

  yPos -= 60;

  // Cabeçalho da tabela
  const headers = ['Produto', 'Quantidade', 'Valor', 'Total'];
  const columnWidths = [180, 100, 100, 100];
  const tableWidth = columnWidths.reduce((sum, w) => sum + w, 0);
  const x = (width - tableWidth) / 2;
  let y = yPos;
  const rowHeight = 20;
  const bottomMargin = 50;

  const drawTableHeader = () => {
    headers.forEach((header, index) => {
      const textWidth = font.widthOfTextAtSize(header, fontSize);
      const cellX = x + columnWidths.slice(0, index).reduce((sum, w) => sum + w, 0);
      const centeredX = cellX + columnWidths[index] / 2 - textWidth / 2;

      page.drawText(header, {
        x: centeredX,
        y,
        font,
        size: fontSize,
        color: rgb(0, 0, 0),
      });
    });
    y -= rowHeight + 5;
  };

  drawTableHeader();

  // Renderizar os dados da tabela com quebra de página
  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    const values = [row.produto, row.quantidade.toString(), row.valor, row.total];

    if (y < bottomMargin) {
      page = pdfDoc.addPage();
      y = height - 50;
      drawTableHeader();
    }

    values.forEach((text, index) => {
      const textWidth = font.widthOfTextAtSize(text, fontSize);
      const cellX = x + columnWidths.slice(0, index).reduce((sum, w) => sum + w, 0);
      const centeredX = cellX + columnWidths[index] / 2 - textWidth / 2;

      page.drawText(text, {
        x: centeredX,
        y,
        font,
        size: fontSize,
        color: rgb(0, 0, 0),
      });
    });

    y -= rowHeight;
  }

  // Escrever rodapé (valores finais e diferença) na última página
  y -= 40;
  page.drawText(`Valor do caixa fechado: ${ConvertCurrency(finalValue)}`, {
    x: margin,
    y,
    size: fontSize,
    color: rgb(0, 0, 0),
  });

  y -= 30;
  if (differenceValue === 0) {
    page.drawText(`Parabéns, caixa fechado sem alteração!`, {
      x: margin,
      y,
      size: 20,
      color: rgb(0, 0, 0),
    });
  } else if (differenceValue < 0) {
    lackOrOver = 'falta';
    page.drawText(`Alteração: Caixa fechado com ${lackOrOver} de ${ConvertCurrency(differenceValue)}!`, {
      x: margin,
      y,
      size: 20,
      color: rgb(0, 0, 0),
    });
  } else {
    lackOrOver = 'sobra';
    page.drawText(`Alteração, caixa fechado com ${lackOrOver} de ${ConvertCurrency(differenceValue)}`, {
      x: margin,
      y,
      size: 20,
      color: rgb(0, 0, 0),
    });
  }

  // Finalização do PDF
  const date = new Date().toLocaleDateString("pt-BR");
  const docName = `fechamento-caixa-${date}.pdf`;

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = docName;
  const income = finalValue - initialValue;
  const msg = `Alteração, caixa fechado com ${lackOrOver} de ${ConvertCurrency(differenceValue)}`;
  sendEmail(docName, ConvertCurrency(finalValue), ConvertCurrency(income), msg);
  link.click();
}