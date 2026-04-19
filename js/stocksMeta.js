// ============================================================
// Stock Chip — mini visual label por emulsión
// ============================================================

const StockChip = (() => {

  // [gradient-top, gradient-bottom, text-color, brand-label, name-label]
  const META = {
    // ── KODAK ──────────────────────────────────
    'Kodak|Portra 160':         ['#c8a070','#8b6540','#fff3e8','KODAK','PORTRA\n160'],
    'Kodak|Portra 400':         ['#c4956a','#8b6540','#fff3e8','KODAK','PORTRA\n400'],
    'Kodak|Portra 800':         ['#a07848','#6a4420','#fce8d0','KODAK','PORTRA\n800'],
    'Kodak|Gold 200':           ['#f5c020','#c49000','#3a2000','KODAK','GOLD\n200'],
    'Kodak|Ektar 100':          ['#e02030','#880010','#ffd0d0','KODAK','EKTAR\n100'],
    'Kodak|ColorPlus 200':      ['#e8d050','#b8a020','#2a1a00','KODAK','COLOR\nPLUS'],
    'Kodak|UltraMax 400':       ['#f08020','#c05010','#fff0e0','KODAK','ULTRA\nMAX'],
    'Kodak|Pro Image 100':      ['#d05028','#903010','#ffe8d8','KODAK','PRO\nIMAGE'],
    'Kodak|Tri-X 400':          ['#383838','#181818','#d8d8d8','KODAK','TRI-X\n400'],
    'Kodak|T-Max 100':          ['#222222','#080808','#c8c8c8','KODAK','T-MAX\n100'],
    'Kodak|T-Max 400':          ['#2a2a2a','#101010','#d0d0d0','KODAK','T-MAX\n400'],
    'Kodak|T-Max 3200':         ['#181818','#040404','#b0b0b0','KODAK','T-MAX\n3200'],
    'Kodak|Ektachrome E100':    ['#1a5ab8','#0a3480','#c8dff8','KODAK','EKTA\nE100'],
    'Kodak|Vision3 50D':        ['#2870c0','#0c3a80','#b8d0f0','KODAK','VIS3\n50D'],
    'Kodak|Vision3 250D':       ['#2060a8','#0a3070','#b0c8e8','KODAK','VIS3\n250D'],
    'Kodak|Vision3 500T':       ['#182860','#080e28','#a0b4d8','KODAK','VIS3\n500T'],
    // ── FUJIFILM ────────────────────────────────
    'Fujifilm|Fuji 100':        ['#34a85a','#0a7030','#d0f8e0','FUJI','FUJI\n100'],
    'Fujifilm|Fuji 200':        ['#2a9a4a','#0a6a2a','#c8f0d8','FUJI','FUJI\n200'],
    'Fujifilm|Provia 100F':     ['#1a7ac8','#0a4a88','#c0d8f8','FUJI','PROVIA\n100F'],
    'Fujifilm|Provia 400':      ['#1460a8','#083870','#b8cef0','FUJI','PROVIA\n400'],
    'Fujifilm|Velvia 50':       ['#6a10a8','#300060','#e8c8ff','FUJI','VELVIA\n50'],
    'Fujifilm|Velvia 100':      ['#5808a0','#240050','#e0bcff','FUJI','VELVIA\n100'],
    'Fujifilm|Superia 200':     ['#00a848','#006830','#b8f0d0','FUJI','SUPERIA\n200'],
    'Fujifilm|Superia 400 Premium': ['#009840','#006028','#b0e8c8','FUJI','SUPERIA\n400'],
    'Fujifilm|Superia X-TRA 400':   ['#00a038','#006020','#a8e8c0','FUJI','X-TRA\n400'],
    'Fujifilm|Acros 100 II':    ['#2a3a28','#101810','#90b890','FUJI','ACROS\nII'],
    'Fujifilm|Natura 1600':     ['#0a5a2a','#041e10','#78d898','FUJI','NATURA\n1600'],
    'Fujifilm|Eterna 250D':     ['#0a4878','#040e28','#90b8d8','FUJI','ETERNA\n250D'],
    // ── ILFORD ──────────────────────────────────
    'Ilford|HP5 Plus 400':      ['#1c3c1c','#0a180a','#80c080','ILFORD','HP5\n400'],
    'Ilford|FP4 Plus 125':      ['#3a4a3a','#1a2a1a','#90b090','ILFORD','FP4\n125'],
    'Ilford|Delta 100':         ['#2a2a3a','#12121e','#90a0c0','ILFORD','DELTA\n100'],
    'Ilford|Delta 400':         ['#242430','#0e0e18','#8090b8','ILFORD','DELTA\n400'],
    'Ilford|Delta 3200':        ['#141420','#060610','#6878a0','ILFORD','DELTA\n3200'],
    'Ilford|Pan F Plus 50':     ['#101010','#000000','#909090','ILFORD','PAN F\n50'],
    'Ilford|XP2 Super 400':     ['#1a3a60','#0a1a30','#90b0d8','ILFORD','XP2\n400'],
    'Ilford|SFX 200':           ['#1a0a10','#080408','#c890a0','ILFORD','SFX\n200'],
    // ── CINESTILL ───────────────────────────────
    'Cinestill|800T':           ['#1e2e6a','#080e28','#a0b0e8','CINE','800T'],
    'Cinestill|50D':            ['#c89010','#8a5800','#fff0b0','CINE','50D'],
    'Cinestill|400D':           ['#b07840','#784a18','#ffe8c0','CINE','400D'],
    'Cinestill|BwXX':           ['#2a2a2a','#121212','#d0d0d0','CINE','BwXX'],
    // ── ROLLEI ──────────────────────────────────
    'Rollei|RPX 25':            ['#a02818','#580a04','#ffccb8','ROLLEI','RPX\n25'],
    'Rollei|RPX 100':           ['#902010','#4e0800','#ffbba0','ROLLEI','RPX\n100'],
    'Rollei|RPX 400':           ['#961810','#4e0600','#ffc0a0','ROLLEI','RPX\n400'],
    'Rollei|Retro 80S':         ['#7a1808','#3a0400','#ffa888','ROLLEI','RETRO\n80S'],
    'Rollei|Infrared 400':      ['#8b0000','#3d0000','#ff9090','ROLLEI','IR\n400'],
    // ── LOMOGRAPHY ──────────────────────────────
    'Lomography|Color Negative 100': ['#e01870','#900038','#ffe0f0','LOMO','CN\n100'],
    'Lomography|Color Negative 400': ['#d81068','#880030','#ffd8ee','LOMO','CN\n400'],
    'Lomography|Color Negative 800': ['#c00858','#780020','#ffd0e8','LOMO','CN\n800'],
    'Lomography|Lady Grey 400':      ['#4a5a4a','#202820','#c0d0c0','LOMO','LADY\nGREY'],
    'Lomography|Berlin Kino 400':    ['#1a2a3a','#080e18','#90a8c0','LOMO','BERLIN\n400'],
    'Lomography|LomoChrome Purple':  ['#6a10a8','#300060','#e8c8ff','LOMO','PURPLE'],
    'Lomography|LomoChrome Metropolis':['#4a5a7a','#1a2a4a','#c0d0f0','LOMO','METRO'],
    'Lomography|LomoChrome Turquoise':['#008888','#004444','#a0f0f0','LOMO','TURQ'],
    // ── BERGGER ─────────────────────────────────
    'Bergger|Pancro 400':       ['#4a3018','#221408','#c0a070','BERGGER','PANCRO\n400'],
    // ── AGFA ────────────────────────────────────
    'Agfa|APX 100':             ['#8a0010','#480008','#ffb0b8','AGFA','APX\n100'],
    'Agfa|APX 400':             ['#700808','#360004','#ffa8b0','AGFA','APX\n400'],
    'Agfa|Vista Plus 200':      ['#d04000','#882000','#ffd0a8','AGFA','VISTA\n200'],
    // ── FOMAPAN ─────────────────────────────────
    'Fomapan|100':              ['#aa1515','#6a0808','#ffc8c8','FOMA','100'],
    'Fomapan|200':              ['#b81010','#700606','#ffcccc','FOMA','200'],
    'Fomapan|400':              ['#c01818','#780a0a','#ffd0d0','FOMA','400'],
    // ── KENTMERE ────────────────────────────────
    'Kentmere|100':             ['#3a5a3a','#182818','#a8c8a8','KENT','100'],
    'Kentmere|400':             ['#2a4a2a','#101e10','#98b898','KENT','400'],
    // ── ADOX ────────────────────────────────────
    'Adox|CHS 100 II':          ['#2a1a50','#100830','#c0a8f0','ADOX','CHS\n100'],
    'Adox|Silvermax 100':       ['#1a2a1a','#080e08','#90c090','ADOX','SILVER\nMAX'],
    // ── REFLXLAB ────────────────────────────────
    'ReflxLab|800T':            ['#102050','#04081e','#9090d8','REFLX','800T'],
    'ReflxLab|50D':             ['#b88008','#785000','#ffe890','REFLX','50D'],
    'ReflxLab|400D':            ['#a06828','#684010','#ffdcb0','REFLX','400D'],
  };

  // Fallback por tipo de película
  const TYPE_FALLBACK = {
    color: ['#1c6a51','#0a3828','#a0e8d0'],
    bw:    ['#383838','#181818','#d0d0d0'],
    slide: ['#8a6a00','#4a3800','#ffe880'],
  };

  function render(brand, name, type, size = 'md') {
    const key = `${brand}|${name}`;
    const m   = META[key];

    let c1, c2, textColor, brandLabel, nameLabel;
    if (m) {
      [c1, c2, textColor, brandLabel, nameLabel] = m;
    } else {
      const fb = TYPE_FALLBACK[type] || TYPE_FALLBACK.color;
      [c1, c2, textColor] = fb;
      brandLabel = brand.slice(0, 7).toUpperCase();
      nameLabel  = name.length > 10 ? name.slice(0, 9) + '…' : name;
    }

    const nameLines = nameLabel.split('\n').join('<br>');

    return `<div class="sc sc--${size}" style="background:linear-gradient(145deg,${c1} 0%,${c2} 100%)" title="${brand} ${name}">
      <span class="sc-brand" style="color:${textColor}">${brandLabel}</span>
      <span class="sc-name" style="color:${textColor}">${nameLines}</span>
    </div>`;
  }

  return { render };
})();
