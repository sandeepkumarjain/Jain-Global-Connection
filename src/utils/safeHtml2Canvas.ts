/**
 * html2canvas is a large library used only when exporting images/PDFs.
 * It is imported dynamically here so it never joins the first-page bundle.
 */
export async function safeHtml2Canvas(element: HTMLElement, options?: any): Promise<HTMLCanvasElement> {
  const { default: html2canvas } = await import('html2canvas');
  try {
    return await html2canvas(element, options);
  } catch (error) {
    console.error('html2canvas error:', error);
    throw error;
  }
}
