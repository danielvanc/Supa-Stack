interface IMeta {
  title?: string;
  description?: string;
  keywords?: string;
}

export function getMetaInfo({
  title = "Default title",
  description = "Default description",
  keywords = "keyword1",
}: IMeta) {
  return {
    title,
    description,
    keywords,
  };
}
