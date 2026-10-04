import { chromium } from "playwright";
import { mkdirSync, writeFileSync } from "node:fs";
import assert from "node:assert/strict";
const base=process.env.UX_BASE_URL || "http://127.0.0.1:3104";
if (!["127.0.0.1","localhost"].includes(new URL(base).hostname)) throw new Error("Local preview required");
const evidence=process.env.UX_EVIDENCE_DIR || "../ux-verification";
mkdirSync(evidence,{recursive:true});
const results:{check:string;passed:boolean}[]=[];
const check=(name:string,value:unknown)=>{results.push({check:name,passed:Boolean(value)});assert.ok(value,name);};
const fixture=process.env.UX_HAS_DATABASE === "1";
async function main(){
 const browser=await chromium.launch({...(process.platform==="win32"?{channel:"msedge"}:{}),headless:true});
 const errors:string[]=[];
 try{
  const context=await browser.newContext({extraHTTPHeaders:{"x-forwarded-host":"www.mid-point.co.za"}});
  await context.route("**/*",route=>{
   const req=route.request();
   if(!["127.0.0.1","localhost"].includes(new URL(req.url()).hostname))return route.abort();
   if(req.method()!=="GET")return req.url().includes("/api/enquiry")||req.url().includes("/api/suites-booking")?route.fulfill({status:503,contentType:"application/json",body:'{"error":"Synthetic local failure"}'}):route.abort();
   return route.continue();
  });
  const page=await context.newPage();page.on("pageerror",e=>errors.push(e.message));
  for(const width of [1440,768,390]){
   await page.setViewportSize({width,height:1000});
   for(const path of ["/","/contact-us?space=Local+%26+test&interest=Warehouse+space#Contact","/the-suites-at-midpoint",...(fixture?["/vacancies","/vacancies/ux-local-vacancy"]:[])]){
    await page.goto(base+path,{waitUntil:"domcontentloaded",timeout:90000});
    check(`${path} one main and primary heading ${width}`,await page.locator("main").count()===1&&await page.locator("h1").count()===1);
    check(`${path} no horizontal overflow ${width}`,await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
    check(`${path} Figtree retained ${width}`,(await page.locator("body").evaluate(el=>getComputedStyle(el).fontFamily)).toLowerCase().includes("figtree"));
    if(path==="/"){
     const cta=page.getByRole("link",{name:"View available space",exact:true});
     check(`Stationary primary vacancy CTA ${width}`,await cta.getAttribute("href")==="/vacancies"&&await cta.evaluate(el=>{let node:Element|null=el;while(node){if(getComputedStyle(node).animationName.includes("marquee"))return false;node=node.parentElement;}return true;}));
    }
    if(path.startsWith("/contact-us")){
     check(`One contact form ${width}`,await page.locator("form").count()===1);
     check(`Persistent associated required labels ${width}`,await page.getByLabel(/First name/).getAttribute("required")!==null&&await page.getByLabel(/Email address/).getAttribute("type")==="email");
     check(`Contextual interest preserved ${width}`,await page.getByLabel(/Space interest/).inputValue()==="Warehouse space");
     check(`Property message preserved ${width}`,(await page.getByLabel(/Message/).inputValue()).includes("Local & test"));
     check(`Usable estate map retained ${width}`,await page.locator('iframe[title="Map of Midpoint Business Park"]').count()===1);
     await page.getByLabel(/First name/).focus();
     check(`Visible keyboard focus ${width}`,await page.getByLabel(/First name/).evaluate(el=>getComputedStyle(el).boxShadow!=="none"));
     const colours=await page.locator("#Contact p").first().evaluate(el=>({fg:getComputedStyle(el).color,bg:getComputedStyle(el.closest("section")!).backgroundColor}));
     const fg=colours.fg.match(/[\d.]+/g)!.map(Number),bg=colours.bg.match(/[\d.]+/g)!.map(Number);
     const rgb=fg.slice(0,3).map((v,i)=>v*(fg[3]??1)+bg[i]*(1-(fg[3]??1)));
     const luma=(values:number[])=>values.slice(0,3).map(v=>{v/=255;return v<=0.04045?v/12.92:((v+0.055)/1.055)**2.4;}).reduce((sum,v,i)=>sum+v*[0.2126,0.7152,0.0722][i],0);
     const a=luma(rgb),b=luma(bg);
     check(`Contact supporting text contrast at least 4.5:1 ${width}`,(Math.max(a,b)+0.05)/(Math.min(a,b)+0.05)>=4.5);
    }
    if(path==="/the-suites-at-midpoint"){
     check(`Accommodation is sole form ${width}`,await page.locator("form").count()===1&&await page.getByRole("button",{name:"Enquire about future stays"}).count()===1&&await page.getByRole("button",{name:"Send enquiry"}).count()===0);
     check(`Suites disclosures retained ${width}`,await page.getByText(/This enquiry does not make a reservation/).count()===1&&await page.getByText(/AI renderings for illustration/).count()>0&&await page.getByText(/Coming soon/i).count()>0);
     check(`Suites fields labelled ${width}`,await page.getByLabel(/Preferred arrival/).getAttribute("type")==="date"&&await page.getByLabel(/Number of guests/).count()===1);
     check(`Suites estate map retained ${width}`,await page.locator("iframe").count()===1);
    }
    if(path==="/vacancies/ux-local-vacancy"){
     const action=page.getByRole("link",{name:"Arrange a viewing",exact:true}).first();
     check(`Viewing action before long property features ${width}`,await action.evaluate(el=>!!(el.compareDocumentPosition(document.querySelector('ul[aria-label="Property features"]')!)&Node.DOCUMENT_POSITION_FOLLOWING)));
     const url=new URL((await action.getAttribute("href"))!,base);
     check(`Detail enquiry preselects serviced offices ${width}`,url.searchParams.get("interest")==="Serviced offices"&&url.searchParams.get("space")==="Local UX test building \u2014 Suite & four");
    }
    await page.screenshot({path:`${evidence}/${path.split("?")[0].replaceAll("/","-")||"home"}-${width}.png`});
   }
  }
  await page.goto(base+"/contact-us");
  await page.getByRole("checkbox").check();await page.getByRole("button",{name:"Send enquiry"}).click();
  check("Native required-field error has a visible outline",await page.getByLabel(/First name/).evaluate(el=>el.matches(":user-invalid")&&getComputedStyle(el).outlineColor==="rgb(254, 202, 202)"));
  await page.getByLabel(/First name/).fill("Local");await page.getByLabel(/Last name/).fill("Test");await page.getByLabel(/Phone number/).fill("0000000000");await page.getByLabel(/Email address/).fill("local@example.test");await page.getByLabel(/Space interest/).selectOption("Office space");await page.getByLabel(/Message/).fill("Synthetic test; never forwarded");await page.getByRole("checkbox").check();
  await page.evaluate('window.grecaptcha={getResponse:()=>"local-only",reset:()=>undefined,render:()=>0}');
  await page.getByRole("button",{name:"Send enquiry"}).click();
  await page.getByRole("alert").filter({hasText:/didn.t send/}).waitFor();
  check("Mocked failed enquiry is announced with retained input",await page.getByLabel(/Email address/).inputValue()==="local@example.test");
  check("No browser application exceptions",errors.length===0);
  console.log(`${results.length} local UX browser checks passed; database fixtures: ${fixture}`);
 }finally{writeFileSync(`${evidence}/browser-results.json`,JSON.stringify({results,errors,fixture},null,2));await browser.close();}
}
main().catch(e=>{console.error(e);process.exitCode=1;});

