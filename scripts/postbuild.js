const fs = require("fs-extra");
const path = require("path");
const xml2js = require("xml2js");

const translateManifests = async (sourceDirectory, destinationDirectory) => {
  const xliffFiles = fs
    .readdirSync(path.join(sourceDirectory, "locale"))
    .map((xlfPath) => path.join(sourceDirectory, "locale", xlfPath));
  const manifestTemplatePath = path.join(sourceDirectory, "manifest.webmanifest");

  function nameToCamelCase(name) {
    const parts = name.split("-");
    parts[0] = parts[0].toLowerCase();
    const uppercased = parts.slice(1).map((part) => {
      return part.charAt(0).toUpperCase() + part.slice(1);
    });

    return [parts[0], ...uppercased].join("");
  }

  for (const xlfPath of xliffFiles) {
    console.log("Processing Xliff file:", xlfPath);
    const xliffData = await xml2js.parseStringPromise(fs.readFileSync(xlfPath), {
      trim: true,
      explicitArray: false,
      attrNameProcessors: [nameToCamelCase],
      tagNameProcessors: [nameToCamelCase],
    });
    const xliffFile = xliffData.xliff.file;

    const sourceLanguage = xliffFile.$.sourceLanguage;
    const targetLanguage = xliffFile.$.targetLanguage;

    const language = targetLanguage || sourceLanguage;

    const manifestTemplate = fs.readFileSync(manifestTemplatePath, "utf8");
    const manifestOutput = manifestTemplate.replace(/"@@(.+)"/g, (match, key) => {
      const transUnit = xliffFile.body.transUnit.find((tu) => tu.$.id === key);
      return JSON.stringify(transUnit.target || transUnit.source);
    });

    const manifestDestinationPath = path.join(
      destinationDirectory,
      language,
      "manifest.webmanifest"
    );
    console.log("Writing manifest file:", manifestDestinationPath);
    fs.writeFileSync(manifestDestinationPath, manifestOutput, "utf8");
  }
};

const copyDefaultLang = (destinationDirectory) => {
  console.log("Copying default language to root directory");

  const defaultLanguageDirectory = path.join(destinationDirectory, "en");
  fs.copySync(defaultLanguageDirectory, destinationDirectory, {
    overwrite: true,
    errorOnExist: false,
  });
};

const main = async () => {
  const packageJson = require(path.join(__dirname, "..", "package.json"));
  const appName = packageJson.name;

  const sourceDirectory = path.join(__dirname, "..", "src");
  const destinationDirectory = path.join(__dirname, "..", "dist", appName, "browser");

  await translateManifests(sourceDirectory, destinationDirectory);
  copyDefaultLang(destinationDirectory);
};

main();
