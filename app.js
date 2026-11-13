(() => {
  'use strict';
  const form = document.getElementById('style-form');
  const results = document.getElementById('results');
  const list = document.getElementById('outfit-list');
  const paletteBox = document.getElementById('palette');
  const summary = document.getElementById('summary');
  const STORAGE_KEY = 'lebas-monasib-preferences-v1';
  const words = {
    gender:{girl:'زنانه',boy:'مردانه',any:'آزاد'}, body:{slim:'لاغر',medium:'متوسط',full:'درشت‌اندام'},
    height:{short:'کوتاه',medium:'متوسط',tall:'بلند'}, season:{spring:'بهار',summer:'تابستان',autumn:'پاییز',winter:'زمستان'},
    tone:{warm:'گرم',cool:'سرد',neutral:'خنثی',any:'فرقی ندارد'}, occasion:{daily:'روزمره',work:'کار یا دانشگاه',party:'مهمانی'},
    style:{sport:'اسپرت',minimal:'مینیمال',classic:'کلاسیک'}, coverage:{covered:'پوشیده‌تر',regular:'عادی'}
  };
  const tones = {
    warm:{names:['کرم','زیتونی','آجری','کاراملی','سبز تیره','شیری'], colors:['#e9d8b8','#68764c','#b86142','#a9784d','#385747','#f7f1df']},
    cool:{names:['سرمه‌ای','آبی یخی','یاسی','خاکستری','زرشکی','سفید'], colors:['#253d5a','#b8d8df','#b5a0c9','#8b9299','#7c344a','#f5f5f0']},
    neutral:{names:['ذغالی','بژ','سفید','قهوه‌ای','سبز سدری','سرمه‌ای'], colors:['#414345','#d4c2a3','#f6f3e9','#80614b','#a5ae8d','#293b53']},
    any:{names:['کرم','آبی نفتی','سبز زیتونی','گلبهی','ذغالی','شیری'], colors:['#e8d7b8','#22576a','#6d774e','#e8a28e','#45464b','#f7f1df']}
  };
  const pieces = {
    tops:{sport:['تی‌شرت ساده','پولوشرت راحت','هودی سبک','پیراهن جین'],minimal:['تی‌شرت تک‌رنگ خوش‌فرم','بلوز یقه‌گرد ساده','شومیز یا پیراهن ساده','بافت ظریف یقه‌گرد'],classic:['پیراهن یقه‌دار اتوکشیده','بلوز یقه‌دار خوش‌دوخت','پیراهن ساده با یقه مرتب','بافت یقه‌دار ظریف']},
    bottoms:{sport:['جین راسته','شلوار کتان راحت','شلوار جاگر خوش‌فرم','دامن میدی ساده'],minimal:['شلوار راسته تک‌رنگ','جین راسته تیره','شلوار پارچه‌ای خوش‌دوخت','دامن میدی ساده'],classic:['شلوار پارچه‌ای راسته','جین تیره بدون زاپ','شلوار پیلی‌دار خوش‌دوخت','دامن میدی راسته']},
    layers:{spring:['کت جین سبک','ژاکت نازک','رویه کتان باز','بدون لایه اضافه'],summer:['رویه نخی بسیار سبک','شومیز نازک به‌عنوان لایه','کتان نازک باز','بدون لایه اضافه'],autumn:['کت کتان یا جین','ژاکت بافت متوسط','اورشرت چهارخانه ریز','بارانی سبک'],winter:['پالتو یا کاپشن گرم','بافت ضخیم روی پیراهن','کاپشن لایه‌دار','بارانی گرم با پلیور']},
    shoes:{sport:['کتانی ساده','اسنیکر سبک','کتانی مینیمال','کتانی ساق‌دار'],minimal:['کتانی تک‌رنگ','لوفر ساده','کفش تخت مینیمال','نیم‌بوت ساده'],classic:['لوفر چرمی','کفش بنددار ساده','نیم‌بوت کلاسیک','کفش تخت رسمی']}
  };
  const patternByStyle={sport:['بدون طرح یا لوگوی کوچک','راه‌راه باریک','جزئیات اسپرت کم‌رنگ'],minimal:['ساده و بدون طرح','بافت ظریف و یکدست','راه‌راه بسیار باریک'],classic:['ساده و خوش‌دوخت','چهارخانه ریز','راه‌راه کلاسیک و خلوت']};
  const occasionNote={daily:'برای رفت‌وآمد روزانه، پارچه راحت و کفش قابل‌راه‌رفتن انتخاب شده.',work:'برای کار یا دانشگاه، برش مرتب و جزئیات کم کمک می‌کند ظاهر جمع‌وجور بماند.',party:'برای مهمانی، یک جزئیات شاخص یا بافت لطیف به ترکیب جلوه می‌دهد.'};
  const seasonNote={spring:'لایه سبک را با تغییر دما به‌راحتی کم‌وزیاد کن.',summer:'پارچه نخی یا لینن و رنگ روشن، انتخاب خنک‌تری برای این فصل است.',autumn:'یک لایه میانی بردار تا برای هوای متغیر آماده باشی.',winter:'لایه‌پوشی گرم را با زیرپوش نازک و لایه بیرونی هماهنگ کن.'};
  function readForm(){const d=new FormData(form);return Object.fromEntries(['gender','body','height','season','tone','occasion','style','coverage'].map(k=>[k,d.get(k)]));}
  function save(){try{localStorage.setItem(STORAGE_KEY,JSON.stringify(readForm()));}catch(_){}}
  function load(){try{const saved=JSON.parse(localStorage.getItem(STORAGE_KEY)||'{}');for(const [key,value] of Object.entries(saved)){const el=form.elements[key];if(el){if(el instanceof RadioNodeList){const radio=[...el].find(x=>x.value===value);if(radio)radio.checked=true;}else if([...el.options].some(o=>o.value===value))el.value=value;}}}catch(_){}}
  function selectedLabel(data,key){return words[key][data[key]];}
  function reasonFor(d, n){
    const h=d.height==='short'?'برای قد کوتاه، بالاتنه و شلوار هم‌رنگ‌تر و قدِ شلوار نزدیک مچ کمک می‌کند خط عمودی پیوسته‌تر دیده شود.':d.height==='tall'?'برای قد بلند، لایه‌بندی یا تضاد ملایم میان بالا و پایین تعادل بصری دلخواه می‌سازد.':'برای قد متوسط، تناسب قد آستین و دمپای شلوار را با راحتی خودت تنظیم کن.';
    const b=d.body==='slim'?'برای اندام لاغر، برش راحت و یک لایه یا بافت کمی حجیم‌تر انتخابی برای بازی با حجم است.':d.body==='full'?'برای اندام درشت‌تر، برش راحت و پارچه‌ای که روی بدن روان می‌ایستد می‌تواند حس آزادی بیشتری بدهد.':'برای اندام متوسط، فیت متعادل و آزادی حرکت را معیار انتخاب قرار بده.';
    const cov=d.coverage==='covered'?'رویه بلندتر و آستین‌دار پوشیدگی بیشتری می‌دهد.':'پوشیدگی عادی در نظر گرفته شده؛ هر بخش را مطابق راحتی خودت تغییر بده.';
    const tailored=d.gender==='any'?'ترکیب آزاد و قابل‌انتخاب است.':`پیشنهاد ${selectedLabel(d,'gender')} با فرم‌های ساده و قابل‌تطبیق نوشته شده است.`;
    return `${h} ${b} ${occasionNote[d.occasion]} ${seasonNote[d.season]} ${cov} ${tailored}`;
  }
  function paletteTone(d){return d.tone==='any'?'any':d.tone;}
  function makeCard(title, tag, item, d, color){
    const card=document.createElement('article');card.className='outfit-card';
    const top=document.createElement('div');top.className='outfit-top';const h=document.createElement('h3');h.textContent=title;const badge=document.createElement('span');badge.className='tag';badge.textContent=tag;top.append(h,badge);card.append(top);
    const ul=document.createElement('ul');ul.className='items';
    [['بالاپوش',item.top],['پایین‌تنه',item.bottom],['لایه',item.layer],['کفش',item.shoe],['رنگ‌ها',item.colors],['طرح',item.pattern]].forEach(([label,value])=>{const li=document.createElement('li');const b=document.createElement('b');b.textContent=label+' :';const s=document.createElement('span');s.textContent=value;li.append(b,s);ul.append(li);});
    card.append(ul);const p=document.createElement('p');p.className='reason';p.textContent=reasonFor(d);card.append(p);return card;
  }
  function generate(d){
    const t=tones[paletteTone(d)], count=6, outfits=[];
    const topSet=pieces.tops[d.style], bottomSet=pieces.bottoms[d.style], shoeSet=pieces.shoes[d.style], layerSet=pieces.layers[d.season], patternSet=patternByStyle[d.style];
    for(let i=0;i<count;i++){
      const col1=t.names[i%t.names.length],col2=t.names[(i+1)%t.names.length],col3=t.names[(i+2)%t.names.length];
      let layer=layerSet[i%layerSet.length]; if(d.coverage==='covered'&&layer==='بدون لایه اضافه')layer=d.season==='summer'?'رویه نخی بلند و سبک':'رویه بلند و آستین‌دار';
      let top=topSet[i%topSet.length];if(d.coverage==='covered'&&d.season==='summer'&&i%2===0)top='بلوز آستین‌بلند نخی و خنک';
      let bottom=bottomSet[(i*3)%bottomSet.length];
      if(d.height==='short'&&i%2===0)bottom=bottom.replace('شلوار','شلوار راسته با قد نزدیک مچ ·');
      const item={top,bottom,layer,shoe:shoeSet[(i*3)%shoeSet.length],colors:`${col1}، ${col2} و ${col3}`,pattern:patternSet[i%patternSet.length]};
      outfits.push(makeCard(`ترکیب ${String(i+1).toLocaleString('fa-IR')}`,['آسان و روزانه','کمی لایه‌دار','ساده و مرتب','با تأکید رنگی','راحت و کاربردی','جزئیات ظریف'][i],item,d));
    }
    list.replaceChildren(...outfits);
    paletteBox.replaceChildren();const label=document.createElement('span');label.className='palette-title';label.textContent='پالت پیشنهادی · '+selectedLabel(d,'tone');paletteBox.append(label);
    t.names.slice(0,5).forEach((name,i)=>{const sw=document.createElement('span');sw.className='swatch';sw.style.backgroundColor=t.colors[i];const accessible=document.createElement('span');accessible.textContent=name;sw.append(accessible);sw.setAttribute('aria-label',name);sw.title=name;paletteBox.append(sw);});
    summary.textContent=`${selectedLabel(d,'season')} · ${selectedLabel(d,'occasion')} · ${selectedLabel(d,'style')} · ${selectedLabel(d,'coverage')} | برای ${selectedLabel(d,'gender')}، قد ${selectedLabel(d,'height')} و اندام ${selectedLabel(d,'body')}`;
    results.hidden=false;results.setAttribute('aria-busy','false');results.scrollIntoView({behavior:'smooth',block:'start'});
  }
  form.addEventListener('change',save);
  form.addEventListener('submit',event=>{event.preventDefault();save();results.setAttribute('aria-busy','true');generate(readForm());});
  document.getElementById('reset').addEventListener('click',()=>{form.reset();try{localStorage.removeItem(STORAGE_KEY);}catch(_){}results.hidden=true;form.scrollIntoView({behavior:'smooth',block:'start'});});
  document.getElementById('copy').addEventListener('click',async event=>{const text=[`پیشنهاد لباس مناسب | ${summary.textContent}`,...[...list.children].map(card=>`${card.querySelector('h3').textContent}\n${[...card.querySelectorAll('.items li')].map(li=>li.innerText).join('\n')}\n${card.querySelector('.reason').textContent}`)].join('\n\n');const btn=event.currentTarget;try{await navigator.clipboard.writeText(text);btn.textContent='کپی شد ✓';}catch(_){const ta=document.createElement('textarea');ta.value=text;ta.setAttribute('readonly','');ta.style.position='fixed';ta.style.opacity='0';document.body.append(ta);ta.select();try{document.execCommand('copy');btn.textContent='کپی شد ✓';}catch(__){btn.textContent='کپی در دسترس نیست';}ta.remove();}window.setTimeout(()=>btn.textContent='کپی پیشنهادها',1800);});

  /* --- ست‌ساز: تحلیل محلی رنگ با Canvas و راهنمای ست‌کردن --- */
  const setPhoto=document.getElementById('garment-photo'), setPreview=document.getElementById('image-preview');
  const setPreviewWrap=document.getElementById('image-preview-wrap'), setRemove=document.getElementById('remove-photo');
  const setAnalyze=document.getElementById('analyze-color'), setType=document.getElementById('item-type');
  const setManual=document.getElementById('manual-color'), setExact=document.getElementById('color-correction');
  const setStatus=document.getElementById('color-status'), setResults=document.getElementById('set-results');
  const setMake=document.getElementById('make-set');
  let setImageURL=null, setImage=null, setDetected=false;
  const typeNames={top:'پیراهن / بالاپوش',pants:'شلوار',coat:'مانتو / کت / کاپشن',dress:'لباس یک‌تکه / پیراهن',shoes:'کفش',scarf:'روسری / شال',bag:'کیف',other:'سایر'};
  const colorInfo={
    'مشکی':{hex:'#1f1f1f',family:'dark',label:'مشکی',pairs:['سفید','کرم','خاکستری روشن','بژ','زیتونی'],avoid:'از مشکی سرتاسری در روزهای گرم پرهیز کن؛ یک رنگ روشن به‌عنوان لایه یا کفش تعادل می‌سازد.'},
    'سفید':{hex:'#f5f3ee',family:'light',label:'سفید',pairs:['سرمه‌ای','خاکستری','زیتونی','قهوه‌ای','آبی'],avoid:'سفید خالص با رنگ‌های بسیار روشن ممکن است کم‌کنتراست شود؛ یک لایه تیره کمک می‌کند.'},
    'خاکستری':{hex:'#8b9299',family:'neutral',label:'خاکستری',pairs:['سفید','سرمه‌ای','صورتی پودری','زرشکی','زیتونی'],avoid:'خاکستری متوسط را با یک جزئیات رنگی یا بافت متفاوت از یکنواختی خارج کن.'},
    'سرمه‌ای':{hex:'#253d5a',family:'dark',label:'سرمه‌ای',pairs:['کرم','سفید','خاکستری روشن','قهوه‌ای روشن','زرشکی'],avoid:'سرمه‌ای و مشکی کنار هم کم‌عمق دیده می‌شوند؛ یک رنگ روشن میانشان بگذار.'},
    'آبی':{hex:'#4a7fb5',family:'cool',label:'آبی',pairs:['سفید','کرم','خاکستری','قهوه‌ای روشن','زرد خردلی'],avoid:'آبی پررنگ با رنگ‌های نئونی رقابت می‌کند؛ خنثی‌ها را پایه قرار بده.'},
    'سبز':{hex:'#4e7a4a',family:'cool',label:'سبز',pairs:['کرم','سفید','خاکستری','قهوه‌ای','زرشکی'],avoid:'سبز روشن با صورتی پررنگ ممکن است شلوغ شود؛ یکی از دو رنگ را ملایم کن.'},
    'زیتونی':{hex:'#68764c',family:'warm',label:'زیتونی',pairs:['کرم','سفید','خاکستری','قهوه‌ای','نارنجی سوخته'],avoid:'زیتونی با قهوه‌ای خیلی نزدیک ممکن است یکدست شود؛ کرم یا سفید را جداکننده کن.'},
    'قرمز':{hex:'#b23b3b',family:'warm',label:'قرمز',pairs:['سفید','کرم','سرمه‌ای','خاکستری','مشکی'],avoid:'قرمز را با صورتی یا نارنجی هم‌خانواده زیاد ترکیب نکن؛ یک خنثی آرام بهتر است.'},
    'زرشکی':{hex:'#7c344a',family:'warm',label:'زرشکی',pairs:['کرم','سفید','خاکستری','سرمه‌ای','زیتونی'],avoid:'زرشکی و مشکی در نور کم شبیه هم می‌شوند؛ کرم یا خاکستری روشن را انتخاب کن.'},
    'صورتی':{hex:'#d99aa8',family:'warm',label:'صورتی',pairs:['سفید','خاکستری','سرمه‌ای','کرم','زیتونی'],avoid:'صورتی با قرمز پررنگ ممکن است سنگین شود؛ سفید و خاکستری را پایه بگذار.'},
    'بنفش':{hex:'#7d5a9b',family:'cool',label:'بنفش',pairs:['سفید','کرم','خاکستری','زیتونی','سرمه‌ای'],avoid:'بنفش با زرد پررنگ کنتراست شدیدی می‌سازد؛ یکی را ملایم‌تر کن.'},
    'زرد':{hex:'#e0b23c',family:'warm',label:'زرد',pairs:['سفید','سرمه‌ای','خاکستری','قهوه‌ای','مشکی'],avoid:'زرد روشن را با سفید در آفتاب کم‌کنتراست می‌بیند؛ سرمه‌ای یا خاکستری بهتر است.'},
    'نارنجی':{hex:'#d07a3a',family:'warm',label:'نارنجی',pairs:['کرم','سفید','سرمه‌ای','زیتونی','قهوه‌ای'],avoid:'نارنجی با قرمز رقابت می‌کند؛ یک خنثی سرد تعادل خوبی می‌دهد.'},
    'قهوه‌ای':{hex:'#80614b',family:'warm',label:'قهوه‌ای',pairs:['کرم','سفید','آبی روشن','زیتونی','زرشکی'],avoid:'قهوه‌ای با مشکی می‌تواند تیره و سنگین شود؛ کرم یا آبی روشن را اضافه کن.'},
    'کرم':{hex:'#e9d8b8',family:'light',label:'کرم',pairs:['قهوه‌ای','سرمه‌ای','زیتونی','زرشکی','خاکستری'],avoid:'کرم با بژ خیلی نزدیک یکدست می‌شود؛ یک رنگ تیره یا بافت متفاوت کمک می‌کند.'},
    'بژ':{hex:'#d4c2a3',family:'light',label:'بژ',pairs:['سفید','قهوه‌ای','سرمه‌ای','زیتونی','مشکی'],avoid:'بژ با کرم در نور روز کم‌کنتراست است؛ سرمه‌ای یا قهوه‌ای تیره را انتخاب کن.'}
  };
  const typeAdvice={
    top:{complement:['شلوار راسته یا جین تیره','دامن میدی یا شلوار پارچه‌ای'],shoes:['کتانی ساده','لوفر یا کفش تخت'],accessories:['کمربند ساده','کیف کوچک هم‌رنگ کفش']},
    pants:{complement:['بلوز ساده هم‌خانواده','پیراهن یقه‌دار خوش‌دوخت'],shoes:['کتانی تک‌رنگ','نیم‌بوت یا لوفر'],accessories:['کمربند هم‌رنگ شلوار','کیف کوچک']},
    coat:{complement:['شلوار راسته','بافت یا شومیز ساده'],shoes:['بوت یا نیم‌بوت','کتانی مینیمال'],accessories:['شال هماهنگ','کیف ساختاردار']},
    dress:{complement:['کت یا مانتوی ساده','ژاکت کوتاه یا شومیز'],shoes:['کفش تخت','صندل یا کفش پاشنه‌کوتاه'],accessories:['کیف کوچک','شال یا روسری هماهنگ']},
    shoes:{complement:['جین راسته','شلوار پارچه‌ای ساده'],shoes:['—'],accessories:['کیف هم‌رنگ یا هم‌خانواده','کمربند ساده']},
    scarf:{complement:['بالاپوش تک‌رنگ','کت یا مانتوی خنثی'],shoes:['کفش ساده هم‌رنگ کیف'],accessories:['کیف با یک رنگ هماهنگ','زیورآلات ساده']},
    bag:{complement:['لباس تک‌رنگ خنثی','کت یا بلوز ساده'],shoes:['کفش هم‌رنگ یا هم‌خانواده کیف'],accessories:['کمربند هماهنگ','شال ساده']},
    other:{complement:['یک بالاپوش ساده','یک پایین‌تنه خنثی'],shoes:['کفش ساده و راحت'],accessories:['یک اکسسوری هماهنگ']}
  };
  function rgbToHsl(r,g,b){r/=255;g/=255;b/=255;const max=Math.max(r,g,b),min=Math.min(r,g,b),l=(max+min)/2;let h=0,s=0;if(max!==min){const d=max-min;s=l>.5?d/(2-max-min):d/(max+min);if(max===r)h=(g-b)/d+(g<b?6:0);else if(max===g)h=(b-r)/d+2;else h=(r-g)/d+4;h*=60;}return [h,s,l];}
  function classify(r,g,b){const [h,s,l]=rgbToHsl(r,g,b);if(l<0.16)return 'مشکی';if(l>0.88&&s<0.14)return 'سفید';if(s<0.12)return 'خاکستری';if(l>0.78&&h>=20&&h<=60)return 'کرم';if(l>0.6&&h>=20&&h<=50&&s<0.4)return 'بژ';if(h<15||h>=345)return l<0.4?'زرشکی':'قرمز';if(h<45)return s>0.55&&l>0.5?'نارنجی':(l<0.4?'قهوه‌ای':'نارنجی');if(h<70)return l<0.3?'قهوه‌ای':(l<0.55?'زیتونی':'زرد');if(h<160)return 'سبز';if(h<250)return l<0.35?'سرمه‌ای':'آبی';if(h<290)return 'بنفش';if(h<345)return 'صورتی';return 'قرمز';}
  function resetPhoto(){if(setImageURL){URL.revokeObjectURL(setImageURL);setImageURL=null;}setImage=null;setDetected=false;setPreview.removeAttribute('src');setPreviewWrap.hidden=true;setAnalyze.disabled=true;setResults.hidden=true;setStatus.textContent='عکس لازم نیست؛ می‌توانی رنگ را دستی انتخاب کنی.';}
  setPhoto.addEventListener('change',()=>{const file=setPhoto.files&&setPhoto.files[0];if(!file)return;if(!file.type.startsWith('image/')){setStatus.textContent='فایل انتخاب‌شده تصویر نیست؛ لطفاً یک عکس انتخاب کن.';setPhoto.value='';return;}resetPhoto();setImageURL=URL.createObjectURL(file);setPreview.src=setImageURL;setPreviewWrap.hidden=false;setAnalyze.disabled=false;setStatus.textContent='عکس روی دستگاه انتخاب شد. برای برآورد رنگ، دکمه را بزن.';const img=new Image();img.onload=()=>{setImage=img;};img.onerror=()=>{setStatus.textContent='این عکس در مرورگر باز نشد؛ رنگ را دستی انتخاب کن.';setAnalyze.disabled=true;};img.src=setImageURL;});
  setRemove.addEventListener('click',()=>{resetPhoto();setPhoto.value='';setPhoto.click();});
  setAnalyze.addEventListener('click',()=>{if(!setImage){setStatus.textContent='اول یک عکس انتخاب کن یا رنگ را دستی بگذار.';return;}try{const size=72,canvas=document.createElement('canvas');canvas.width=size;canvas.height=size;const ctx=canvas.getContext('2d',{willReadFrequently:true});if(!ctx)throw new Error('no canvas');ctx.drawImage(setImage,0,0,size,size);const data=ctx.getImageData(0,0,size,size).data;let r=0,g=0,b=0,n=0;for(let i=0;i<data.length;i+=4){const a=data[i+3];if(a<128)continue;const R=data[i],G=data[i+1],B=data[i+2];const mx=Math.max(R,G,B),mn=Math.min(R,G,B);if(mx>248&&mn>248)continue;if(mx<10)continue;r+=R;g+=G;b+=B;n++;}if(!n)throw new Error('empty');r=Math.round(r/n);g=Math.round(g/n);b=Math.round(b/n);const name=classify(r,g,b);setManual.value=name;setExact.value='#'+[r,g,b].map(v=>v.toString(16).padStart(2,'0')).join('');setDetected=true;setStatus.textContent=`رنگ غالب تقریبی: ${name} (${setExact.value}). اگر درست نیست، رنگ را دستی اصلاح کن.`;}catch(_){setStatus.textContent='خواندن رنگ از این عکس ممکن نشد؛ رنگ را دستی انتخاب کن.';}});
  setManual.addEventListener('change',()=>{const info=colorInfo[setManual.value];if(info)setExact.value=info.hex;setStatus.textContent=`رنگ انتخابی: ${setManual.value}.`;});
  setExact.addEventListener('input',()=>{const hex=setExact.value;const r=parseInt(hex.slice(1,3),16),g=parseInt(hex.slice(3,5),16),b=parseInt(hex.slice(5,7),16);setManual.value=classify(r,g,b);setStatus.textContent=`رنگ اصلاح‌شده: ${setManual.value} (${hex}).`;});
  function makeSetCard(title,rows){const card=document.createElement('article');card.className='outfit-card';const top=document.createElement('div');top.className='outfit-top';const h=document.createElement('h3');h.textContent=title;top.append(h);card.append(top);const ul=document.createElement('ul');ul.className='items';rows.forEach(([label,value])=>{const li=document.createElement('li');const b=document.createElement('b');b.textContent=label+' :';const s=document.createElement('span');s.textContent=value;li.append(b,s);ul.append(li);});card.append(ul);return card;}
  setMake.addEventListener('click',()=>{const color=setManual.value,info=colorInfo[color],type=setType.value,adv=typeAdvice[type];const palette=document.createElement('div');palette.className='palette set-palette';const title=document.createElement('span');title.className='palette-title';title.textContent=`رنگ پایه: ${color} · ${typeNames[type]}`;palette.append(title);[color,...info.pairs.slice(0,4)].forEach(name=>{const sw=document.createElement('span');sw.className='swatch';sw.style.backgroundColor=(colorInfo[name]||{hex:setExact.value}).hex;sw.title=name;sw.setAttribute('aria-label',name);palette.append(sw);});const cards=[makeSetCard('ست روزمره',[['بالا / قطعه اصلی',type==='top'||type==='dress'||type==='coat'?`${color} (لباس خودت)`:`${info.pairs[0]}، هماهنگ با ${color}`],['پایین‌تنه',adv.complement[0]],['کفش',adv.shoes[0]],['اکسسوری',adv.accessories[0]]]),makeSetCard('ست کمی رسمی‌تر',[['بالا / قطعه اصلی',type==='top'||type==='dress'||type==='coat'?`${color} (لباس خودت)`:`${info.pairs[1]}`],['پایین‌تنه',adv.complement[1]||adv.complement[0]],['کفش',adv.shoes[1]||adv.shoes[0]],['اکسسوری',adv.accessories[1]||adv.accessories[0]]]),makeSetCard('ست با تأکید رنگی',[['بالا / قطعه اصلی',`${color} (لباس خودت)`],['رنگ‌های هماهنگ',info.pairs.slice(0,3).join('، ')],['کفش',adv.shoes[0]],['اکسسوری',adv.accessories[0]]])];const note=document.createElement('p');note.className='reason set-note';note.textContent=`رنگ‌های هماهنگ پیشنهادی: ${info.pairs.join('، ')}. نکته: ${info.avoid} ${setDetected?'رنگ اصلی از عکس به‌صورت تقریبی برآورد شده است؛':'رنگ اصلی به‌صورت دستی انتخاب شده است؛'} نوع لباس دستی انتخاب شده و برنامه ادعای تشخیص خودکار نوع لباس ندارد.`;setResults.replaceChildren(palette,...cards,note);setResults.hidden=false;setResults.scrollIntoView({behavior:'smooth',block:'start'});});

  load();
  if('serviceWorker' in navigator && location.protocol!=='file:')window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
})();
