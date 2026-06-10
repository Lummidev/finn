const JSONFiles: Record<string, Record<string, unknown>> = import.meta.glob(
  "./namespaces/**/*.json",
  { eager: true },
);

export const namespacesByLocale: Record<
  string,
  Record<string, Record<string, unknown>>
> = {};

for (const path in JSONFiles) {
  //['.','namespaces','en','common.json']
  const [, , locale, namespaceFile] = path.split("/");
  if (!namespaceFile || !locale) {
    throw new Error("Invalid locales found");
  }
  const namespace = namespaceFile.split(".").shift();
  if (!namespace) {
    throw new Error("Error while determining locale name");
  }
  const contents = JSONFiles[path];
  if (namespacesByLocale[locale]) {
    namespacesByLocale[locale] = {
      [namespace]: contents,
      ...namespacesByLocale[locale],
    };
  } else {
    namespacesByLocale[locale] = {
      [namespace]: contents,
    };
  }
}
export const supportedLanguages = Object.keys(namespacesByLocale).sort();
