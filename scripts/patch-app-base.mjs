import fs from "fs";

const jsPath = "app/assets/index-BuXGMVcM.js";
let js = fs.readFileSync(jsPath, "utf8");
const old = 'Ob,{base:"/".replace(/\\/$/,"")';
const neu = 'Ob,{base:"/app".replace(/\\/$/,"")';
if (!js.includes(neu)) {
  js = js.replace(old, neu);
  fs.writeFileSync(jsPath, js);
  console.log("patched router base");
} else {
  console.log("already patched");
}
