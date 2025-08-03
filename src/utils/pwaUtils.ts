import html2canvas from 'html2canvas';

export const isPWAInstallable = () => {
  return 'serviceWorker' in navigator && window.matchMedia('(display-mode: standalone)').matches === false;
};

export const installPWA = async () => {
  if ('serviceWorker' in navigator) {
    try {
      await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered successfully');
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  }
};

export const canShare = () => {
  return 'share' in navigator;
};

export const shareCard = async (card: any, title: string, text: string, url?: string) => {
  // Create a more detailed share text with card information
  const cardInfo = [
    card.name && `Name: ${card.name}`,
    card.title && `Title: ${card.title}`,
    card.company && `Company: ${card.company}`,
    card.email && `Email: ${card.email}`,
    card.phone && `Phone: ${card.phone}`,
    card.website && `Website: ${card.website}`,
  ].filter(Boolean).join('\n');

  const shareText = `${text}\n\n${cardInfo}`;

  if (canShare()) {
    try {
      await navigator.share({
        title,
        text: shareText,
        url: url || window.location.href,
      });
    } catch (error) {
      console.error('Error sharing:', error);
      // Fallback to clipboard copy
      fallbackShare(shareText);
    }
  } else {
    // Fallback to clipboard copy
    fallbackShare(shareText);
  }
};

const fallbackShare = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    // Show a toast or alert to indicate success
    showShareSuccess();
  } catch (error) {
    console.error('Clipboard copy failed:', error);
    // Final fallback - show the text in an alert
    alert(`Share this information:\n\n${text}`);
  }
};

const showShareSuccess = () => {
  // Create a temporary success message
  const successDiv = document.createElement('div');
  successDiv.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #10b981;
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    z-index: 10000;
    font-family: system-ui, -apple-system, sans-serif;
    font-size: 14px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  `;
  successDiv.textContent = 'Card information copied to clipboard!';
  document.body.appendChild(successDiv);
  
  setTimeout(() => {
    document.body.removeChild(successDiv);
  }, 3000);
};

export const shareCardAsImage = async (elementId: string, card: any) => {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error('Element not found');
    }

    const canvas = await html2canvas(element, {
      backgroundColor: '#000000',
      scale: 3,
      logging: false,
      useCORS: true,
      allowTaint: true,
      width: 384,
      height: 224,
    });

    const blob = await new Promise<Blob>((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
      }, 'image/png');
    });

    if (canShare() && navigator.canShare && navigator.canShare({ files: [blob] })) {
      const file = new File([blob], `${card.name || 'business-card'}.png`, { type: 'image/png' });
      await navigator.share({
        title: `${card.name || 'Business Card'}`,
        text: `Check out my business card created with CardCraft!`,
        files: [file],
      });
    } else {
      // Fallback to downloading the image
      const link = document.createElement('a');
      link.download = `${card.name || 'business-card'}-shared.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
  } catch (error) {
    console.error('Error sharing card as image:', error);
    // Fallback to text sharing
    await shareCard(card, `${card.name || 'Business Card'}`, `Check out my business card created with CardCraft!`);
  }
};