import html2canvas from 'html2canvas';

export const exportCardAsPNG = async (elementId: string, filename: string = 'business-card.png') => {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error('Element not found');
  }

  try {
    const canvas = await html2canvas(element, {
      backgroundColor: '#000000', // Set black background to ensure visibility
      scale: 3, // Higher scale for better quality
      logging: false,
      useCORS: true,
      allowTaint: true,
      width: 384, // w-96 = 384px
      height: 224, // h-56 = 224px
    });

    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL('image/png');
    link.click();
  } catch (error) {
    console.error('Error exporting card:', error);
    throw error;
  }
};