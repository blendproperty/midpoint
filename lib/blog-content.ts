/**
 * The editor allows authors to choose a cover image and also insert images in
 * the article body. If the same image is inserted in both places, keep the
 * template cover and remove only its first duplicate from the rich text.
 */
export function removeDuplicateCoverImage(contentHtml: string, coverImage?: string | null) {
  if (!contentHtml || !coverImage) return contentHtml;

  let removed = false;
  const imageOrImageParagraph = /<p\b[^>]*>\s*<img\b[^>]*>\s*<\/p>|<img\b[^>]*>/gi;

  return contentHtml.replace(imageOrImageParagraph, (markup) => {
    if (removed) return markup;

    const source = markup.match(/\bsrc\s*=\s*(["'])(.*?)\1/i)?.[2];
    if (source !== coverImage) return markup;

    removed = true;
    return "";
  });
}
