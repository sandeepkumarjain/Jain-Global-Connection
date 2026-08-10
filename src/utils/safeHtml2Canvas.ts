import html2canvas from 'html2canvas';

export async function safeHtml2Canvas(element: HTMLElement, options?: any): Promise<HTMLCanvasElement> {
  try {
    return await html2canvas(element, options);
  } catch (error) {
    console.error('html2canvas error:', error);
    throw error;
  }
}
