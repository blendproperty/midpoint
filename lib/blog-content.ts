/**
 * The editor allows authors to choose a cover image and also insert images in
 * the article body. If the same image is inserted in both places, keep the
 * template cover and remove only its first duplicate from the rich text.
 */
export function removeDuplicateCoverImage(contentHtml: string, coverImage?: string | null) {
  if (!contentHtml || !coverImage) return contentHtml;

  let removed = false;
  const imageOrImageParagraph = /<p\b[^>]*>\s*<img\b[^>]*>\s*<\/p>|<img\b[^>]*>/gi;
  const normalizedCover = normalizeImageSource(coverImage);

  return contentHtml.replace(imageOrImageParagraph, (markup) => {
    if (removed) return markup;

    const source = markup.match(/\bsrc\s*=\s*(["'])(.*?)\1/i)?.[2];
    if (!source || normalizeImageSource(source) !== normalizedCover) return markup;

    removed = true;
    return "";
  });
}

function normalizeImageSource(source: string) {
  const htmlDecoded = source.replaceAll("&amp;", "&");

  try {
    // Use a representative blog URL so root-relative, absolute and editor-
    // generated ../../ paths can be compared as the browser resolves them.
    const url = new URL(htmlDecoded, "https://www.mid-point.co.za/blog/article");
    return `${url.pathname}${url.search}`;
  } catch {
    return htmlDecoded;
  }
}
