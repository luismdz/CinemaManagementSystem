export function toBase64(file: File) {
  return new Promise((res, rej) => {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => res(reader.result);
    reader.onerror = (err) => rej(err);
  });
}

export function firstLetterToUpper(texto: string): string {
  return texto[0].toUpperCase() + texto.slice(1);
}

export function generateUrlYoutubeEmbed(url: string) {
  if (!url) {
    return '';
  }

  let video_id = url.split('v=')[1];
  let ampersandPos = video_id.indexOf('&');

  if (ampersandPos !== -1) {
    video_id = video_id.substring(0, ampersandPos);
  }

  return `https://www.youtube.com/embed/${video_id}`;
}
