import fs from 'fs';
import path from 'path';

const brainDir = "C:/Users/saikr/.gemini/antigravity-ide/brain/4966e2ed-f7d6-4f31-a176-2d6c2f3e12f0";
const destDir = "c:/Users/saikr/Downloads/hollydental-platform-main/hollydental-platform-main/client/public";

const copyAsset = (srcName, destName) => {
  try {
    const srcPath = path.join(brainDir, srcName);
    const destPath = path.join(destDir, destName);
    if (fs.existsSync(srcPath)) {
      fs.copyFileSync(srcPath, destPath);
      console.log(`COPIED: ${srcName} -> ${destName}`);
    } else {
      console.warn(`MISSING: ${srcPath}`);
    }
  } catch (err) {
    console.error(`ERROR copying ${srcName}:`, err);
  }
};

copyAsset("media__1779941739177.png", "clinic-storefront.png");
copyAsset("media__1779941712712.png", "dentist-mirror.png");
copyAsset("media__1779943161030.png", "cosmetic-icon.png");
copyAsset("media__1779942579666.png", "image-js-before.png");
copyAsset("media__1779942779153.png", "image-js-after.png");
copyAsset("dental_implant_1779939669300.png", "dental-implants.png");

