/**
 * Verteidigungspläne – Teil C: Fortress, Kafe, Kanal, Lair, Nighthaven
 * Marker: [floor, x, y, kind, label, toX?, toY?]
 */
const L = (p, s, g) => ({ primary: p, secondary: s, gadget: g });

export default [
  /* ========================================================== FORTRESS */
  {
    id: 'fortress-commander-def-standard',
    map: 'fortress', site: 'commander', side: 'defense', style: 'standard',
    name: 'Commander – Dach-Anker mit Bathroom-Rotation',
    summary:
      'Commander\'s Office wird gegen Dach- und Fensterdruck gehalten. Mira sichert den Dachzugang, Castle die Fensterfront, ' +
      'ein Roamer hält Games Room/Dormitory gegen den Vertikal-Push.',
    confidence: 'eigene-analyse',
    ratings: {
      c: 4, d: 'hoch', u: 'hoch', k: 'hoch',
      s: ['Dach nur über wenige Zugänge erreichbar', 'Starke Innenwinkel'],
      w: ['Vertikal-Druck durch Dormitory', 'Viele Außenfenster'],
    },
    players: [
      {
        op: 'mira', role: 'Anchor', task: 'Commander-Anker & Dach-Mirror',
        why: 'Der Mirror kontrolliert den Dachzugang, den man sonst nur mit offenem Fenster sieht.',
        ab: 'Black-Mirror Commander ↔ Bathroom',
        load: L('Vector .45 ACP', 'ITA12S', 'Nitro Cell'),
        obj: ['anchor', 'intel', 'plantDenial'],
        prep: [
          'Verstärke die Außenwand und den Dachzugang.',
          'Mirror in die Wand Commander → Bathroom.',
          'Nitro unter das Dachfenster.',
        ],
        act: [
          'Halte den Mirror- und den Innenwinkel.',
          'Dach-Bewegungen früh ansagen.',
          'Retake: Nitro auf den Defuser, Mirror aufreißen.',
        ],
        m: [
          ['2F', 62, 42, 'position', 'Mira – Commander'],
          ['2F', 65, 44, 'gadget', 'Black-Mirror – Bathroom'],
          ['2F', 59, 45, 'gadget', 'Nitro – Dach'],
        ],
      },
      {
        op: 'castle', role: 'Flex-Anchor', task: 'Bathroom-Flex & Fenster-Panels',
        why: 'Castle schließt zwei Fenster der Commander-Front.',
        ab: 'Armor Panels Commander-Fenster + Bathroom',
        load: L('UMP45', 'M1014', 'Bulletproof Camera'),
        obj: ['support', 'antiEntry', 'anchor'],
        prep: [
          'Panels an das Commander-Fenster und die Bathroom-Tür.',
          'Kamera in den 2F-Flur.',
        ],
        act: [
          'Halte Bathroom und den Flur.',
          'Panel-Bruch ansagen.',
          'Retake: Panel an die Tür.',
        ],
        m: [
          ['2F', 67, 44, 'position', 'Castle – Bathroom'],
          ['2F', 66, 41, 'gadget', 'Armor Panel – Fenster'],
          ['2F', 69, 46, 'gadget', 'Armor Panel – Bathroom'],
          ['2F', 60, 48, 'gadget', 'Bulletproof Camera – Flur'],
        ],
      },
      {
        op: 'echo', role: 'Support-Roamer', task: 'Dach & Skylight-Intel',
        why: 'Yokai deckt Dach und Flur, Echo kann Plants auf dem Dach verzögern.',
        ab: 'Yokai Dach + Flur',
        load: L('MP5SD', 'SuperNova', 'Deployable Shield'),
        obj: ['support', 'intel', 'plantDenial'],
        prep: [
          'Yokai 1 an das Dachfenster, Yokai 2 in den 2F-Flur.',
          'Shield an die Commander-Tür.',
        ],
        act: [
          'Dach und Flur abwechselnd lesen.',
          'Schock bei Plant oder Dach-Entry.',
          'Retake: Yokai als Intel halten.',
        ],
        m: [
          ['2F', 59, 45, 'gadget', 'Yokai – Dach'],
          ['2F', 60, 50, 'gadget', 'Yokai – Flur'],
          ['2F', 62, 44, 'gadget', 'Deployable Shield – Commander'],
          ['2F', 61, 47, 'position', 'Echo – Flur'],
        ],
      },
      {
        op: 'valkyrie', role: 'Roamer', task: 'Dormitory- & Games-Roam',
        why: 'Valkyrie liest den vertikalen Push aus Dormitory/Games Room.',
        ab: 'Black Eyes Dormitory / Games / Rooftop',
        load: L('MPX', 'SPAS-12', 'Nitro Cell'),
        obj: ['roam', 'intel', 'flankWatch'],
        prep: [
          'Kamera in Dormitory, Kamera in Games, Kamera zum Rooftop.',
          'Nitro an die Dormitory-Tür.',
        ],
        act: [
          'Starte in Dormitory, halte das Aufbrechen des Bodens im Blick.',
          'Ruf Vertikal-Push sofort durch.',
          'Rückzug über den 2F-Flur.',
          'Ab 1:05 an der Site.',
        ],
        m: [
          ['2F', 64, 50, 'position', 'Valkyrie – Dormitory'],
          ['2F', 66, 53, 'gadget', 'Black Eye – Dormitory'],
          ['2F', 62, 46, 'gadget', 'Nitro – Boden'],
          ['2F', 60, 55, 'rotation', 'Rückzug → Flur', 61, 49],
        ],
      },
      {
        op: 'kaid', role: 'Support-Roamer', task: 'Anti-Breach Außenwand',
        why: 'Kaid sichert die Commander-Außenwand gegen Hard Breach.',
        ab: 'Electroclaw Commander-Außenwand',
        load: L('AUG A3', 'TCSG12', 'Barbed Wire'),
        obj: ['support', 'breach', 'utility'],
        prep: [
          'Verstärke die Außenwand, Claw daran.',
          'Stacheldraht in den Flur.',
        ],
        act: [
          'Halte den 2F-Flur.',
          'Breach-Picks ansagen.',
          'Retake: Claw an die Tür.',
        ],
        m: [
          ['2F', 59, 50, 'position', 'Kaid – Flur'],
          ['2F', 64, 40, 'gadget', 'Electroclaw – Außenwand'],
        ],
      },
    ],
    subs: [
      { op: 'smoke', for: 'mira', role: 'Anchor', reason: 'Gas stoppt den Dach-Push und Plants.', takes: ['Denial'], change: 'Gas an Dach und Fenster.', weak: 'Kein Intel.' },
      { op: 'mute', for: 'kaid', role: 'Support-Roamer', reason: 'Jammer blocken Breach und Drohnen.', takes: ['Anti-Breach'], change: 'Jammer an Außenwand/Flur.', weak: 'Kurze Reichweite.' },
      { op: 'alibi', for: 'valkyrie', role: 'Roamer', reason: 'Prismas geben Dormitory-Intel.', takes: ['Roam-Intel'], change: 'Prismas statt Kameras.', weak: 'Nur lokale Intel.' },
      { op: 'lesion', for: 'castle', role: 'Flex-Anchor', reason: 'Minen verlangsamen Fenster-Entry.', takes: ['Anti-Entry'], change: 'Minen an Fenster/Bathroom.', weak: 'Keine Barriere.' },
      { op: 'maestro', for: 'echo', role: 'Support-Roamer', reason: 'Evil Eyes decken Dach und Flur dauerhaft.', takes: ['Intel', 'Denial'], change: 'Evil Eyes an Dach/Flur.', weak: 'Kein Schock.' },
    ],
    def: {
      retake: [
        'Mira/Castle halten Commander/Bathroom, Yokai liefert Dach-Intel.',
        'Gas oder Panel schließt den Hauptzugang.',
      ],
      roam: [
        'Valkyrie hält Dormitory/Games.',
        'Kaid bleibt im Flur.',
      ],
    },
  },
  {
    id: 'fortress-hammam-def-standard',
    map: 'fortress', site: 'hammam', side: 'defense', style: 'standard',
    name: 'Hammam – 1F-Bunker mit Courtyard-Rotation',
    summary:
      'Hammam/Sitting Room wird als Bunker gehalten. Die Courtyard-/Storage-Rotation ist der Schlüssel für Retakes, ' +
      'Castle schließt die Außenfenster, ein Support sichert die Waiting-Room-Seite.',
    confidence: 'eigene-analyse',
    ratings: {
      c: 3, d: 'hoch', u: 'hoch', k: 'hoch',
      s: ['Sehr starke Innenwinkel', 'Zwei Anker decken die Site komplett'],
      w: ['Viele Zugänge im 1F', 'Vertikal von 2F-Dormitory'],
    },
    players: [
      {
        op: 'mira', role: 'Anchor', task: 'Hammam-Anker & Courtyard-Mirror',
        why: 'Der Mirror zeigt den Courtyard-Push, ohne dass Mira im Fenster steht.',
        ab: 'Black-Mirror Hammam ↔ Sitting Room',
        load: L('Vector .45 ACP', 'ITA12S', 'Nitro Cell'),
        obj: ['anchor', 'intel', 'plantDenial'],
        prep: [
          'Verstärke die Courtyard-Wand und die Außenwand.',
          'Mirror in die Wand Hammam → Sitting Room.',
          'Nitro an das Hauptfenster legen.',
        ],
        act: [
          'Halte den Mirror und den Innenwinkel.',
          'Melde Courtyard-Bewegungen.',
          'Retake: Nitro auf den Defuser.',
        ],
        m: [
          ['1F', 66, 55, 'position', 'Mira – Hammam'],
          ['1F', 63, 57, 'gadget', 'Black-Mirror – Sitting Room'],
          ['1F', 68, 56, 'gadget', 'Nitro – Hauptfenster'],
        ],
      },
      {
        op: 'castle', role: 'Flex-Anchor', task: 'Sitting-Flex & Fenster-Panels',
        why: 'Castle schließt zwei Fenster der Hammam-Front.',
        ab: 'Armor Panels Hammam + Sitting',
        load: L('UMP45', 'M1014', 'Bulletproof Camera'),
        obj: ['support', 'antiEntry', 'anchor'],
        prep: [
          'Panels an das Hammam-Fenster und die Sitting-Tür.',
          'Kamera in den Lobby-Korridor.',
        ],
        act: [
          'Halte Sitting und den Korridor.',
          'Panel-Bruch ansagen.',
          'Retake: Panel an die Tür.',
        ],
        m: [
          ['1F', 61, 57, 'position', 'Castle – Sitting'],
          ['1F', 64, 59, 'gadget', 'Armor Panel – Fenster'],
          ['1F', 59, 59, 'gadget', 'Armor Panel – Sitting'],
          ['1F', 58, 53, 'gadget', 'Bulletproof Camera – Korridor'],
        ],
      },
      {
        op: 'smoke', role: 'Support-Roamer', task: 'Waiting-Room-Seite & Plant-Denial',
        why: 'Smoke deckt die Waiting-Room-Seite und stoppt Plants.',
        ab: 'Remote-Gas Waiting-Room-Tür',
        load: L('FMG-9', 'M590A1', 'Barbed Wire'),
        obj: ['support', 'plantDenial', 'utility'],
        prep: [
          'Verstärke die Waiting-Room-Wand.',
          'Stacheldraht in den Korridor.',
        ],
        act: [
          'Halte die Waiting-Room-Seite.',
          'Gas bei Plant oder offener Tür.',
          'Retake: Gas auf den Defuser.',
        ],
        m: [
          ['1F', 60, 45, 'position', 'Smoke – Waiting'],
          ['1F', 62, 47, 'gadget', 'Stacheldraht – Korridor'],
          ['1F', 62, 50, 'angle', 'Winkel in den Korridor'],
        ],
      },
      {
        op: 'valkyrie', role: 'Roamer', task: 'Cafeteria- & Stairwell-Roam',
        why: 'Valkyrie liest den Push über Cafeteria und die Treppe.',
        ab: 'Black Eyes Cafeteria / Stairwell / Courtyard',
        load: L('MPX', 'SPAS-12', 'Nitro Cell'),
        obj: ['roam', 'intel', 'flankWatch'],
        prep: [
          'Kamera in die Cafeteria, Kamera an die Treppe, Kamera in den Courtyard.',
          'Nitro an die Cafeteria-Tür.',
        ],
        act: [
          'Starte in der Cafeteria, halte die Fenster.',
          'Ruf Treppenbewegungen durch.',
          'Rückzug über den Korridor.',
          'Ab 1:05 an der Site.',
        ],
        m: [
          ['1F', 64, 47, 'position', 'Valkyrie – Cafeteria'],
          ['1F', 66, 45, 'gadget', 'Black Eye – Cafeteria'],
          ['1F', 58, 47, 'gadget', 'Black Eye – Stairwell'],
          ['1F', 63, 53, 'rotation', 'Rückzug → Korridor', 61, 55],
        ],
      },
      {
        op: 'aruni', role: 'Deep-Roamer', task: 'Lobby-/Courtyard-Denial',
        why: 'Aruni-Gates sperren Lobby und Courtyard.',
        ab: 'Surya-Gates Lobby + Courtyard',
        load: L('P10 RONI', 'Mk 14 EBR', 'Barbed Wire'),
        obj: ['antiEntry', 'flankWatch', 'utility'],
        prep: [
          'Gate an die Lobby, Gate an den Courtyard-Zugang.',
          'Stacheldraht dahinter.',
        ],
        act: [
          'Halte die Lobby, rotiere dann in den Korridor.',
          'Gate-Bruch melden.',
          'Retake: Gate erneuern.',
        ],
        m: [
          ['1F', 57, 50, 'position', 'Aruni – Lobby'],
          ['1F', 56, 53, 'gadget', 'Surya-Gate – Lobby'],
          ['1F', 55, 58, 'gadget', 'Surya-Gate – Courtyard'],
        ],
      },
    ],
    subs: [
      { op: 'echo', for: 'mira', role: 'Anchor', reason: 'Yokai liefert Courtyard-Intel.', takes: ['Intel'], change: 'Yokai im Courtyard/Korridor.', weak: 'Kein Mirror.' },
      { op: 'lesion', for: 'aruni', role: 'Deep-Roamer', reason: 'Minen geben Lobby-Intel.', takes: ['Anti-Entry'], change: 'Minen statt Gates.', weak: 'Kein harter Block.' },
      { op: 'alibi', for: 'valkyrie', role: 'Roamer', reason: 'Prismas im Courtyard.', takes: ['Roam-Intel'], change: 'Prismas statt Kameras.', weak: 'Nur lokale Intel.' },
      { op: 'kaid', for: 'castle', role: 'Flex-Anchor', reason: 'Claws sichern Außenwand gegen Breach.', takes: ['Anti-Breach'], change: 'Claws statt Panels.', weak: 'Fenster offen.' },
      { op: 'melusi', for: 'smoke', role: 'Support-Roamer', reason: 'Banshees verlangsamen die Waiting-Seite.', takes: ['Denial'], change: 'Banshees statt Gas.', weak: 'Weniger Plant-Stopp.' },
    ],
    def: {
      retake: [
        'Mira/Castle halten Hammam/Sitting, Smoke stoppt den Plant.',
        'Roamer kommt über Courtyard/Storage zurück.',
      ],
      roam: [
        'Valkyrie hält Cafeteria.',
        'Aruni sperrt Lobby/Courtyard, kein Kontakt ohne Not.',
      ],
    },
  },

  /* ============================================================= KAFE */
  {
    id: 'kafe-cocktail-def-standard',
    map: 'kafe', site: 'cocktail', side: 'defense', style: 'standard',
    name: 'Cocktail Lounge – 3F-Dachverteidigung',
    summary:
      'Die Kern-Site auf Kafe: Cocktail Lounge/Bar wird gegen Dach- und Fensterdruck gehalten. Mira sichert das ' +
      'Skylight, Castle die Fenster, Echo die Dachkante, ein Roamer den 2F-Flur gegen Vertikal-Push.',
    confidence: 'verifiziert',
    ratings: {
      c: 5, d: 'hoch', u: 'hoch', k: 'hoch',
      s: ['Dach-Site mit großen Winkeln', 'Sehr starkes Utility-Setup möglich'],
      w: ['Vertikal-Push über 2F-Fireplace', 'Skylight ist offen'],
    },
    players: [
      {
        op: 'mira', role: 'Anchor', task: 'Cocktail-Anker & Skylight-Mirror',
        why: 'Der Mirror überwacht das Skylight – der wichtigste Einstieg auf dieser Site.',
        ab: 'Black-Mirror Cocktail ↔ Bar',
        load: L('Vector .45 ACP', 'ITA12S', 'Nitro Cell'),
        obj: ['anchor', 'intel', 'plantDenial'],
        prep: [
          'Verstärke die Skylight-Wand und die Außenwand.',
          'Mirror in die Wand Cocktail → Bar.',
          'Nitro direkt unter das Skylight.',
        ],
        act: [
          'Halte den Mirrorwinkel und das Skylight-Geräusch.',
          'Ruf jede Dach-Bewegung sofort durch.',
          'Retake: Nitro auf den Defuser.',
        ],
        m: [
          ['3F', 60, 48, 'position', 'Mira – Cocktail'],
          ['3F', 63, 50, 'gadget', 'Black-Mirror – Bar'],
          ['3F', 63, 55, 'gadget', 'Nitro – Skylight'],
        ],
      },
      {
        op: 'castle', role: 'Flex-Anchor', task: 'Bar-Flex & Fenster-Panels',
        why: 'Castle schließt die Bar-Fenster und den Balkonzugang.',
        ab: 'Armor Panels Bar-Fenster + Balkon',
        load: L('UMP45', 'M1014', 'Bulletproof Camera'),
        obj: ['support', 'antiEntry', 'anchor'],
        prep: [
          'Panels an zwei Bar-Fenster und die Balkontür.',
          'Verstärke die Bar-Außenwand.',
          'Kamera in den 3F-Flur.',
        ],
        act: [
          'Halte Bar und den Flur.',
          'Panel-Bruch ansagen.',
          'Retake: Panel an die Tür des Defusers.',
        ],
        m: [
          ['3F', 66, 47, 'position', 'Castle – Bar'],
          ['3F', 69, 45, 'gadget', 'Armor Panel – Fenster'],
          ['3F', 64, 45, 'gadget', 'Armor Panel – Balkon'],
          ['3F', 63, 52, 'gadget', 'Bulletproof Camera – Flur'],
        ],
      },
      {
        op: 'echo', role: 'Support-Roamer', task: 'Dachkante & Skylight-Denial',
        why: 'Yokai deckt die Dachkante und kann Plants am Skylight schocken.',
        ab: 'Yokai Skylight + Dachkante',
        load: L('MP5SD', 'SuperNova', 'Deployable Shield'),
        obj: ['support', 'intel', 'plantDenial'],
        prep: [
          'Yokai 1 unter das Skylight, Yokai 2 an die Dachkante.',
          'Shield an die Cocktail-Tür.',
        ],
        act: [
          'Dachkante und Skylight abwechselnd lesen.',
          'Schock bei Plant oder Dach-Entry.',
          'Retake: Yokai als Intel halten.',
        ],
        m: [
          ['3F', 63, 55, 'gadget', 'Yokai – Skylight'],
          ['3F', 57, 50, 'gadget', 'Yokai – Dachkante'],
          ['3F', 60, 50, 'gadget', 'Deployable Shield – Cocktail'],
          ['3F', 62, 53, 'position', 'Echo – Flur'],
        ],
      },
      {
        op: 'valkyrie', role: 'Roamer', task: '2F-Fireplace-Roam & Vertikal-Denial',
        why: 'Valkyrie liest den Vertikal-Push aus dem 2F-Fireplace und kann früh zurück sein.',
        ab: 'Black Eyes Fireplace / 2F-Flur / Terrace',
        load: L('MPX', 'SPAS-12', 'Nitro Cell'),
        obj: ['roam', 'intel', 'flankWatch'],
        prep: [
          'Kamera in Fireplace, Kamera in den 2F-Flur, Kamera an die Terrace.',
          'Nitro an die Fireplace-Tür.',
        ],
        act: [
          'Starte in Fireplace, halte das Aufbrechen des Bodens im Blick.',
          'Ruf Vertikal-Push sofort durch.',
          'Rückzug über den 2F-Flur → 3F-Treppe.',
          'Ab 1:05 an der Site.',
        ],
        m: [
          ['2F', 61, 50, 'position', 'Valkyrie – Fireplace'],
          ['2F', 63, 48, 'gadget', 'Black Eye – Fireplace'],
          ['2F', 60, 55, 'gadget', 'Nitro – Boden'],
          ['2F', 63, 47, 'rotation', 'Rückzug → 3F', 62, 49],
        ],
      },
      {
        op: 'kaid', role: 'Support-Roamer', task: 'Anti-Breach Balkonwand',
        why: 'Kaid sichert die Balkon-Außenwand, die beliebteste Hard-Breach-Wand auf Kafe.',
        ab: 'Electroclaw Balkonwand + Skylight-Hatch',
        load: L('AUG A3', 'TCSG12', 'Barbed Wire'),
        obj: ['support', 'breach', 'utility'],
        prep: [
          'Verstärke Balkonwand und Skylight-Hatch.',
          'Claw an die Balkonwand, zweite an das Hatch.',
        ],
        act: [
          'Halte den 3F-Flur.',
          'Breach-Picks ansagen.',
          'Retake: Claw an die Tür.',
        ],
        m: [
          ['3F', 62, 53, 'position', 'Kaid – Flur'],
          ['3F', 65, 44, 'gadget', 'Electroclaw – Balkonwand'],
          ['3F', 63, 56, 'gadget', 'Electroclaw – Hatch'],
        ],
      },
    ],
    subs: [
      { op: 'smoke', for: 'mira', role: 'Anchor', reason: 'Gas stoppt Skylight-Push und Plant.', takes: ['Denial'], change: 'Gas unter Skylight und Fenster.', weak: 'Kein Intel.' },
      { op: 'mute', for: 'kaid', role: 'Support-Roamer', reason: 'Jammer blocken Breach und Drohnen.', takes: ['Anti-Breach'], change: 'Jammer an Balkonwand/Flur.', weak: 'Kurze Reichweite.' },
      { op: 'alibi', for: 'valkyrie', role: 'Roamer', reason: 'Prismas im Fireplace.', takes: ['Roam-Intel'], change: 'Prismas statt Kameras.', weak: 'Nur lokale Intel.' },
      { op: 'lesion', for: 'castle', role: 'Flex-Anchor', reason: 'Minen verlangsamen Fenster-Entry.', takes: ['Anti-Entry'], change: 'Minen an Fenster/Flur.', weak: 'Keine Barriere.' },
      { op: 'maestro', for: 'echo', role: 'Support-Roamer', reason: 'Evil Eyes decken Skylight und Flur dauerhaft.', takes: ['Intel', 'Denial'], change: 'Evil Eyes an Skylight/Flur.', weak: 'Kein Schock.' },
    ],
    def: {
      retake: [
        'Mira/Castle halten Cocktail/Bar, Yokai liefert Skylight-Intel.',
        'Gas oder Panel schließt den Zugang.',
      ],
      roam: [
        'Valkyrie hält Fireplace gegen Vertikal.',
        'Kaid bleibt im 3F-Flur.',
      ],
    },
  },
  {
    id: 'kafe-kitchen-def-standard',
    map: 'kafe', site: 'kitchen', side: 'defense', style: 'standard',
    name: 'Kitchen – 1F-Bunker mit Bakery-Rotation',
    summary:
      'Kitchen Service/Cooking wird als 1F-Bunker gehalten. Bakery ist der Schlüsselraum; ein Roamer hält den 2F-Flur ' +
      'gegen Vertikal, während Castle die Fensterfront schließt.',
    confidence: 'eigene-analyse',
    ratings: {
      c: 3, d: 'mittel', u: 'mittel', k: 'mittel',
      s: ['Kurze Rotationen', 'Bakery-Kontrolle verhindert Früh-Push'],
      w: ['Vertikal von 2F-Fireplace', 'Zwei Fensterfronten'],
    },
    players: [
      {
        op: 'smoke', role: 'Anchor', task: 'Kitchen-Anker',
        why: 'Smoke hält die Kitchen-Tür und den Bakery-Zugang mit Gas.',
        ab: 'Remote-Gas Bakery-Tür',
        load: L('FMG-9', 'M590A1', 'Barbed Wire'),
        obj: ['anchor', 'plantDenial', 'antiEntry'],
        prep: [
          'Verstärke die Wand Kitchen ↔ Bakery.',
          'Stacheldraht in die Kitchen-Tür.',
        ],
        act: [
          'Halte den Tresenwinkel.',
          'Gas bei Plant oder offener Tür.',
          'Retake: Gas auf den Defuser.',
        ],
        m: [
          ['1F', 62, 52, 'position', 'Smoke – Kitchen'],
          ['1F', 64, 54, 'gadget', 'Stacheldraht – Tür'],
          ['1F', 60, 50, 'angle', 'Bakery-Winkel'],
        ],
      },
      {
        op: 'castle', role: 'Flex-Anchor', task: 'Cooking-Flex & Fenster-Panels',
        why: 'Castle schließt die Cooking-Fenster und die Bakery-Tür.',
        ab: 'Armor Panels Cooking-Fenster + Bakery',
        load: L('UMP45', 'M1014', 'Bulletproof Camera'),
        obj: ['support', 'antiEntry', 'anchor'],
        prep: [
          'Panels an das Cooking-Fenster und die Bakery-Tür.',
          'Kamera in die Lobby werfen.',
        ],
        act: [
          'Halte Cooking und den Lobby-Zugang.',
          'Panel-Bruch ansagen.',
          'Retake: Panel an die Tür.',
        ],
        m: [
          ['1F', 66, 55, 'position', 'Castle – Cooking'],
          ['1F', 68, 57, 'gadget', 'Armor Panel – Fenster'],
          ['1F', 58, 52, 'gadget', 'Armor Panel – Bakery'],
          ['1F', 58, 45, 'gadget', 'Bulletproof Camera – Lobby'],
        ],
      },
      {
        op: 'mira', role: 'Support-Roamer', task: 'Bakery-Intel & Rotation',
        why: 'Mira hält mit dem Mirror die Bakery und kann in beide Richtungen rotieren.',
        ab: 'Black-Mirror Bakery ↔ Lobby',
        load: L('Vector .45 ACP', 'ITA12S', 'Nitro Cell'),
        obj: ['support', 'intel', 'retake'],
        prep: [
          'Verstärke die Bakery-Wand, Mirror setzen.',
          'Nitro an die Bakery-Tür.',
        ],
        act: [
          'Halte Bakery als Vorposten.',
          'Mirror-Intel weitergeben.',
          'Retake: Mirror aufreißen, Nitro werfen.',
        ],
        m: [
          ['1F', 56, 50, 'position', 'Mira – Bakery'],
          ['1F', 57, 48, 'gadget', 'Black-Mirror – Lobby'],
          ['1F', 58, 54, 'gadget', 'Nitro – Bakery-Tür'],
        ],
      },
      {
        op: 'valkyrie', role: 'Roamer', task: '2F-&-Lobby-Watch',
        why: 'Valkyrie liest den 2F-Flur und die Lobby, damit Kitchen nicht von oben überrascht wird.',
        ab: 'Black Eyes 2F-Flur / Lobby / Fireplace',
        load: L('MPX', 'SPAS-12', 'Nitro Cell'),
        obj: ['roam', 'intel', 'flankWatch'],
        prep: [
          'Kamera in den 2F-Flur, Kamera in die Lobby, Kamera in Fireplace.',
        ],
        act: [
          'Starte im 2F-Flur, halte das Aufbrechen des Bodens im Blick.',
          'Ruf Vertikal-Push ans Team.',
          'Rückzug über die Haupttreppe.',
          'Ab 1:05 an der Site.',
        ],
        m: [
          ['2F', 60, 57, 'position', 'Valkyrie – 2F-Flur'],
          ['2F', 62, 55, 'gadget', 'Black Eye – 2F-Flur'],
          ['1F', 58, 45, 'gadget', 'Black Eye – Lobby'],
          ['2F', 58, 53, 'rotation', 'Rückzug → Treppe', 60, 52],
        ],
      },
      {
        op: 'kaid', role: 'Deep-Roamer', task: 'Lobby-Außenwand & Treppen-Denial',
        why: 'Kaid sichert die Lobby-Außenwand und die Haupttreppe gegen Breach.',
        ab: 'Electroclaw Lobby-Wand + Treppe',
        load: L('AUG A3', 'TCSG12', 'Barbed Wire'),
        obj: ['support', 'breach', 'utility'],
        prep: [
          'Verstärke die Lobby-Außenwand, Claw daran.',
          'Stacheldraht an die Treppe.',
        ],
        act: [
          'Halte die Lobby-Seite.',
          'Breach-Picks ansagen.',
          'Retake: Claw an die Tür.',
        ],
        m: [
          ['1F', 59, 43, 'position', 'Kaid – Lobby'],
          ['1F', 57, 40, 'gadget', 'Electroclaw – Lobby-Wand'],
          ['1F', 61, 47, 'gadget', 'Stacheldraht – Treppe'],
        ],
      },
    ],
    subs: [
      { op: 'aruni', for: 'castle', role: 'Flex-Anchor', reason: 'Gates sperren Bakery und Fenster.', takes: ['Anti-Entry'], change: 'Gates statt Panels.', weak: 'Fenster offen.' },
      { op: 'echo', for: 'mira', role: 'Support-Roamer', reason: 'Yokai deckt Bakery und Flur.', takes: ['Intel'], change: 'Yokai in Bakery/Flur.', weak: 'Kein Mirror.' },
      { op: 'lesion', for: 'kaid', role: 'Deep-Roamer', reason: 'Minen geben Lobby-Intel.', takes: ['Frühwarnung'], change: 'Minen an Lobby/Treppe.', weak: 'Kein Anti-Breach.' },
      { op: 'alibi', for: 'valkyrie', role: 'Roamer', reason: 'Prismas geben 2F-Intel.', takes: ['Roam-Intel'], change: 'Prismas statt Kameras.', weak: 'Nur lokale Intel.' },
      { op: 'mute', for: 'mira', role: 'Support-Roamer', reason: 'Jammer blocken Breach an der Bakery-Wand.', takes: ['Anti-Breach'], change: 'Jammer statt Mirror.', weak: 'Kein Intel.' },
    ],
    def: {
      retake: [
        'Smoke stoppt den Plant, Castle schließt den Zugang.',
        'Roamer kommen über die Treppe zurück.',
      ],
      roam: [
        'Valkyrie hält 2F-Flur.',
        'Kaid hält Lobby, kein Deep-Roam über Bakery hinaus.',
      ],
    },
  },

  /* ============================================================ KANAL */
  {
    id: 'kanal-server-def-standard',
    map: 'kanal', site: 'server', side: 'defense', style: 'standard',
    name: 'Server Room – 2F-Anker mit Roof-Kontrolle',
    summary:
      'Server/Radar wird gegen Dach- und Fensterdruck gehalten. Mira sichert den Radar-Room-Zugang, Castle die Fenster, ' +
      'ein Roamer hält die Construction-Roof-Kante und den 2F-Flur.',
    confidence: 'eigene-analyse',
    ratings: {
      c: 4, d: 'hoch', u: 'hoch', k: 'hoch',
      s: ['Dach nur über zwei Hatches erreichbar', 'Starke Fensterwinkel für Verteidiger'],
      w: ['Vertikal von 1F möglich', 'Lange Wege zur zweiten Site'],
    },
    players: [
      {
        op: 'mira', role: 'Anchor', task: 'Server-Anker & Radar-Mirror',
        why: 'Der Mirror sichert den Zugang aus dem Radar Room, ohne dass Mira exponiert steht.',
        ab: 'Black-Mirror Server ↔ Radar',
        load: L('Vector .45 ACP', 'ITA12S', 'Nitro Cell'),
        obj: ['anchor', 'intel', 'plantDenial'],
        prep: [
          'Verstärke die Außenwand und den Race-Aufgang.',
          'Mirror in die Wand Server → Radar.',
          'Nitro unter das Dachfenster.',
        ],
        act: [
          'Halte Mirror- und Dachwinkel.',
          'Dach-Bewegungen früh ansagen.',
          'Retake: Nitro auf den Defuser.',
        ],
        m: [
          ['2F', 56, 42, 'position', 'Mira – Server'],
          ['2F', 59, 44, 'gadget', 'Black-Mirror – Radar'],
          ['2F', 54, 46, 'gadget', 'Nitro – Dach'],
        ],
      },
      {
        op: 'castle', role: 'Flex-Anchor', task: 'Radar-Flex & Fenster-Panels',
        why: 'Castle schließt die Fensterfront des Radar Room.',
        ab: 'Armor Panels Radar-Fenster + Flur',
        load: L('UMP45', 'M1014', 'Bulletproof Camera'),
        obj: ['support', 'antiEntry', 'anchor'],
        prep: [
          'Panels an zwei Radar-Fenster und die Flur-Tür.',
          'Kamera in den 2F-Flur.',
        ],
        act: [
          'Halte Radar und den Flur.',
          'Panel-Bruch ansagen.',
          'Retake: Panel an die Tür.',
        ],
        m: [
          ['2F', 62, 40, 'position', 'Castle – Radar'],
          ['2F', 64, 38, 'gadget', 'Armor Panel – Fenster'],
          ['2F', 60, 44, 'gadget', 'Armor Panel – Flur'],
          ['2F', 60, 49, 'gadget', 'Bulletproof Camera – Flur'],
        ],
      },
      {
        op: 'echo', role: 'Support-Roamer', task: 'Dach & Roof-Kante',
        why: 'Yokai deckt die Dachkante und beide Hatches, Echo kann Plants schocken.',
        ab: 'Yokai Dachkante + Hatch',
        load: L('MP5SD', 'SuperNova', 'Deployable Shield'),
        obj: ['support', 'intel', 'plantDenial'],
        prep: [
          'Yokai 1 an die Dachkante, Yokai 2 an das Hatch.',
          'Shield an die Server-Tür.',
        ],
        act: [
          'Dachkante und Hatch abwechselnd lesen.',
          'Schock bei Plant oder Dach-Entry.',
          'Retake: Yokai als Intel halten.',
        ],
        m: [
          ['2F', 66, 55, 'gadget', 'Yokai – Dachkante'],
          ['2F', 54, 46, 'gadget', 'Yokai – Hatch'],
          ['2F', 56, 44, 'gadget', 'Deployable Shield – Server'],
          ['2F', 58, 47, 'position', 'Echo – Flur'],
        ],
      },
      {
        op: 'valkyrie', role: 'Roamer', task: 'Construction-Roam & Flur',
        why: 'Valkyrie liest den Push über Construction und den 2F-Flur.',
        ab: 'Black Eyes Construction / Flur / Bridge',
        load: L('MPX', 'SPAS-12', 'Nitro Cell'),
        obj: ['roam', 'intel', 'flankWatch'],
        prep: [
          'Kamera an Construction, Kamera in den Flur, Kamera an die Bridge.',
          'Nitro an die Flur-Tür.',
        ],
        act: [
          'Starte an Construction, halte die Dachkante.',
          'Ruf Rotationen durch.',
          'Rückzug über den Flur.',
          'Ab 1:05 an der Site.',
        ],
        m: [
          ['2F', 50, 40, 'position', 'Valkyrie – Construction'],
          ['2F', 52, 42, 'gadget', 'Black Eye – Construction'],
          ['2F', 58, 47, 'rotation', 'Rückzug → Server', 57, 45],
        ],
      },
      {
        op: 'kaid', role: 'Support-Roamer', task: 'Anti-Breach Server-Außenwand',
        why: 'Kaid sichert die Server-Außenwand gegen Hard Breach.',
        ab: 'Electroclaw Server-Außenwand',
        load: L('AUG A3', 'TCSG12', 'Barbed Wire'),
        obj: ['support', 'breach', 'utility'],
        prep: [
          'Verstärke die Außenwand, Claw daran.',
          'Stacheldraht in den Flur.',
        ],
        act: [
          'Halte den 2F-Flur.',
          'Breach-Picks ansagen.',
          'Retake: Claw an die Tür.',
        ],
        m: [
          ['2F', 58, 45, 'position', 'Kaid – Flur'],
          ['2F', 56, 38, 'gadget', 'Electroclaw – Außenwand'],
        ],
      },
    ],
    subs: [
      { op: 'smoke', for: 'mira', role: 'Anchor', reason: 'Gas stoppt Dach-Push und Plant.', takes: ['Denial'], change: 'Gas an Hatch und Fenster.', weak: 'Kein Intel.' },
      { op: 'mute', for: 'kaid', role: 'Support-Roamer', reason: 'Jammer blocken Breach und Drohnen.', takes: ['Anti-Breach'], change: 'Jammer an Außenwand.', weak: 'Kurze Reichweite.' },
      { op: 'alibi', for: 'valkyrie', role: 'Roamer', reason: 'Prismas an Construction.', takes: ['Roam-Intel'], change: 'Prismas statt Kameras.', weak: 'Nur lokale Intel.' },
      { op: 'lesion', for: 'castle', role: 'Flex-Anchor', reason: 'Minen verlangsamen Entry.', takes: ['Anti-Entry'], change: 'Minen an Fenster/Flur.', weak: 'Keine Barriere.' },
      { op: 'maestro', for: 'echo', role: 'Support-Roamer', reason: 'Evil Eyes decken Dach und Flur dauerhaft.', takes: ['Intel', 'Denial'], change: 'Evil Eyes statt Yokai.', weak: 'Kein Schock.' },
    ],
    def: {
      retake: [
        'Mira öffnet den Mirror, Yokai liefert Dach-Intel.',
        'Gas/Panel stoppt den Plant.',
      ],
      roam: [
        'Valkyrie hält Construction.',
        'Kaid hält den Flur.',
      ],
    },
  },
  {
    id: 'kanal-supply-def-standard',
    map: 'kanal', site: 'supply', side: 'defense', style: 'standard',
    name: 'Supply Room – Keller-Bunker mit Kayaks-Rotation',
    summary:
      'Supply/Kayaks wird als Keller-Bunker gespielt. Die Rotation über Kayaks ist entscheidend; Castle schließt die ' +
      'Tunnel-Tür, Kaid sichert die Außenwand, ein Roamer hält die Treppe.',
    confidence: 'eigene-analyse',
    ratings: {
      c: 3, d: 'hoch', u: 'hoch', k: 'hoch',
      s: ['Keller-Bunker mit engen Winkeln', 'Gute Rotationen'],
      w: ['Tunnel-Push schwer zu lesen', 'Keine Fensterverteidigung, nur Türen'],
    },
    players: [
      {
        op: 'mira', role: 'Anchor', task: 'Supply-Anker & Tunnel-Mirror',
        why: 'Der Mirror liest den Tunnel-Push, bevor er die Site erreicht.',
        ab: 'Black-Mirror Supply ↔ Kayaks',
        load: L('Vector .45 ACP', 'ITA12S', 'Nitro Cell'),
        obj: ['anchor', 'intel', 'plantDenial'],
        prep: [
          'Verstärke die Tunnel-Wand und die Außenwand.',
          'Mirror in die Wand Supply → Kayaks.',
          'Nitro in den Tunnel.',
        ],
        act: [
          'Halte Mirror und Tunnelwinkel.',
          'Tunnel-Bewegungen ansagen.',
          'Retake: Nitro auf den Defuser.',
        ],
        m: [
          ['B', 63, 48, 'position', 'Mira – Supply'],
          ['B', 66, 50, 'gadget', 'Black-Mirror – Kayaks'],
          ['B', 61, 50, 'gadget', 'Nitro – Tunnel'],
        ],
      },
      {
        op: 'castle', role: 'Flex-Anchor', task: 'Kayaks-Flex & Tunnel-Panel',
        why: 'Castle schließt die Tunnel-Tür und die Kayaks-Verbindung.',
        ab: 'Armor Panels Tunnel + Kayaks',
        load: L('UMP45', 'M1014', 'Bulletproof Camera'),
        obj: ['support', 'antiEntry', 'anchor'],
        prep: [
          'Panels an die Tunnel-Tür und die Kayaks-Verbindung.',
          'Kamera in den Basement-Hall.',
        ],
        act: [
          'Halte Kayaks und den Hall.',
          'Panel-Bruch ansagen.',
          'Retake: Panel an die Tür.',
        ],
        m: [
          ['B', 67, 52, 'position', 'Castle – Kayaks'],
          ['B', 64, 54, 'gadget', 'Armor Panel – Tunnel'],
          ['B', 69, 54, 'gadget', 'Armor Panel – Kayaks'],
          ['B', 58, 52, 'gadget', 'Bulletproof Camera – Hall'],
        ],
      },
      {
        op: 'smoke', role: 'Support-Roamer', task: 'Hall & Plant-Denial',
        why: 'Smoke hält den Hall und stoppt Plants.',
        ab: 'Remote-Gas Hall-Tür',
        load: L('FMG-9', 'M590A1', 'Barbed Wire'),
        obj: ['support', 'plantDenial', 'utility'],
        prep: [
          'Stacheldraht in den Hall.',
          'Verstärke die Hall-Wand.',
        ],
        act: [
          'Halte den Hall-Winkel.',
          'Gas bei Plant oder offener Tür.',
          'Retake: Gas auf den Defuser.',
        ],
        m: [
          ['B', 58, 52, 'position', 'Smoke – Hall'],
          ['B', 56, 54, 'gadget', 'Stacheldraht – Hall'],
        ],
      },
      {
        op: 'valkyrie', role: 'Roamer', task: 'Treppen- & 1F-Watch',
        why: 'Valkyrie liest den Push über die Treppe und den 1F-Security-Bereich.',
        ab: 'Black Eyes Treppe / Security / Bridge',
        load: L('MPX', 'SPAS-12', 'Nitro Cell'),
        obj: ['roam', 'intel', 'flankWatch'],
        prep: [
          'Kamera an die Treppe, Kamera in Security, Kamera an die Bridge.',
          'Nitro an die Treppen-Tür.',
        ],
        act: [
          'Starte an der Treppe, halte den 1F-Zugang.',
          'Ruf Treppenbewegungen durch.',
          'Rückzug in den Keller.',
          'Ab 1:05 an der Site.',
        ],
        m: [
          ['1F', 55, 42, 'position', 'Valkyrie – Treppe'],
          ['1F', 53, 45, 'gadget', 'Black Eye – Treppe'],
          ['1F', 59, 46, 'gadget', 'Black Eye – Security'],
          ['B', 60, 50, 'gadget', 'Nitro – Treppen-Tür'],
          ['1F', 58, 50, 'rotation', 'Rückzug → Keller', 60, 52],
        ],
      },
      {
        op: 'kaid', role: 'Support-Roamer', task: 'Anti-Breach Tunnel-Wand',
        why: 'Kaid sichert die Tunnel-/Außenwand gegen Hard Breach.',
        ab: 'Electroclaw Tunnel-Wand',
        load: L('AUG A3', 'TCSG12', 'Barbed Wire'),
        obj: ['support', 'breach', 'utility'],
        prep: [
          'Verstärke die Tunnel-Außenwand, Claw daran.',
        ],
        act: [
          'Halte den Tunnelzugang.',
          'Breach-Picks ansagen.',
          'Retake: Claw an die Tür.',
        ],
        m: [
          ['B', 64, 56, 'position', 'Kaid – Tunnel'],
          ['B', 62, 58, 'gadget', 'Electroclaw – Tunnel-Wand'],
        ],
      },
    ],
    subs: [
      { op: 'echo', for: 'mira', role: 'Anchor', reason: 'Yokai deckt Tunnel und Hall.', takes: ['Intel'], change: 'Yokai im Tunnel.', weak: 'Kein Mirror.' },
      { op: 'mute', for: 'kaid', role: 'Support-Roamer', reason: 'Jammer blocken Breach.', takes: ['Anti-Breach'], change: 'Jammer statt Claw.', weak: 'Kurze Reichweite.' },
      { op: 'aruni', for: 'castle', role: 'Flex-Anchor', reason: 'Gates sperren Tunnel/Kayaks.', takes: ['Anti-Entry'], change: 'Gates statt Panels.', weak: 'Keine Barriere.' },
      { op: 'alibi', for: 'valkyrie', role: 'Roamer', reason: 'Prismas an der Treppe.', takes: ['Roam-Intel'], change: 'Prismas statt Kameras.', weak: 'Nur lokale Intel.' },
      { op: 'lesion', for: 'smoke', role: 'Support-Roamer', reason: 'Minen verlangsamen Hall-Push.', takes: ['Anti-Entry'], change: 'Minen statt Gas.', weak: 'Weniger Plant-Stopp.' },
    ],
    def: {
      retake: [
        'Mira/Castle halten Supply/Kayaks, Smoke stoppt den Plant.',
        'Valkyrie liefert Treppen-Intel.',
      ],
      roam: [
        'Valkyrie hält Treppe/Security.',
        'Kaid hält Tunnel.',
      ],
    },
  },

  /* ============================================================= LAIR */
  {
    id: 'lair-lab-def-standard',
    map: 'lair', site: 'lab', side: 'defense', style: 'standard',
    name: 'Lab – Keller-Bunker mit Hatch-Kontrolle',
    summary:
      'Lab/Lab Support ist die stärkste Keller-Site auf Lair. Entscheidend ist die Hatch-Kontrolle von oben: ' +
      'Mira-Spiegel, Castle-Panels und ein Roamer auf 1F verhindern den Vertikal-Push.',
    confidence: 'eigene-analyse',
    ratings: {
      c: 4, d: 'hoch', u: 'hoch', k: 'hoch',
      s: ['Dichte Innenräume, viele Deckungen', 'Kurze Retake-Wege'],
      w: ['Mehrere Hatches direkt über der Site', 'Wenig Außenfenster, dafür viele Innenzugänge'],
    },
    players: [
      {
        op: 'mira', role: 'Anchor', task: 'Lab-Anker & Hatch-Mirror',
        why: 'Der Mirror liest den Hatch-Push von oben, ohne dass Mira am Hatch stehen muss.',
        ab: 'Black-Mirror Lab ↔ Lab Support',
        load: L('Vector .45 ACP', 'ITA12S', 'Nitro Cell'),
        obj: ['anchor', 'intel', 'plantDenial'],
        prep: [
          'Verstärke Hatch und Hauptwand.',
          'Mirror in die Wand Lab → Support.',
          'Nitro unter das Hatch legen.',
        ],
        act: [
          'Halte Mirror- und Hatchwinkel.',
          'Hatch-Bewegungen sofort ansagen.',
          'Retake: Nitro auf den Defuser.',
        ],
        m: [
          ['B', 58, 52, 'position', 'Mira – Lab'],
          ['B', 61, 54, 'gadget', 'Black-Mirror – Lab Support'],
          ['B', 56, 54, 'gadget', 'Nitro – Hatch'],
        ],
      },
      {
        op: 'castle', role: 'Flex-Anchor', task: 'Lab-Support-Flex & Panel',
        why: 'Castle schließt die Support-Tür und die Verbindung zum Gang.',
        ab: 'Armor Panels Support + Gang',
        load: L('UMP45', 'M1014', 'Bulletproof Camera'),
        obj: ['support', 'antiEntry', 'anchor'],
        prep: [
          'Panels an die Support-Tür und die Gang-Tür.',
          'Kamera in den Kellergang.',
        ],
        act: [
          'Halte Support und den Gang.',
          'Panel-Bruch ansagen.',
          'Retake: Panel an die Tür.',
        ],
        m: [
          ['B', 64, 54, 'position', 'Castle – Support'],
          ['B', 66, 56, 'gadget', 'Armor Panel – Support'],
          ['B', 60, 58, 'gadget', 'Armor Panel – Gang'],
          ['B', 55, 58, 'gadget', 'Bulletproof Camera – Gang'],
        ],
      },
      {
        op: 'echo', role: 'Support-Roamer', task: 'Hatch- & Gang-Intel',
        why: 'Yokai deckt das Hatch und den Gang, zusätzlich Schock-Denial beim Plant.',
        ab: 'Yokai Hatch + Gang',
        load: L('MP5SD', 'SuperNova', 'Deployable Shield'),
        obj: ['support', 'intel', 'plantDenial'],
        prep: [
          'Yokai 1 unter das Hatch, Yokai 2 in den Gang.',
          'Shield an die Lab-Tür.',
        ],
        act: [
          'Hatch und Gang abwechselnd lesen.',
          'Schock bei Plant oder Hatch-Entry.',
          'Retake: Yokai als Intel halten.',
        ],
        m: [
          ['B', 56, 54, 'gadget', 'Yokai – Hatch'],
          ['B', 55, 58, 'gadget', 'Yokai – Gang'],
          ['B', 58, 54, 'gadget', 'Deployable Shield – Lab'],
          ['B', 60, 56, 'position', 'Echo – Gang'],
        ],
      },
      {
        op: 'valkyrie', role: 'Roamer', task: '1F-Bunks- & Briefing-Push',
        why: 'Valkyrie hält den 1F-Bereich über der Site und liest den Vertikal-Push.',
        ab: 'Black Eyes Bunks / Briefing / Armory',
        load: L('MPX', 'SPAS-12', 'Nitro Cell'),
        obj: ['roam', 'intel', 'flankWatch'],
        prep: [
          'Kamera in Bunks, Kamera in Briefing, Kamera in Armory.',
          'Nitro an die Bunks-Tür.',
        ],
        act: [
          'Starte in Bunks, halte das Aufbrechen des Bodens im Blick.',
          'Ruf Vertikal-Push sofort durch.',
          'Rückzug über die Treppe in den Keller.',
          'Ab 1:05 an der Site.',
        ],
        m: [
          ['1F', 58, 50, 'position', 'Valkyrie – Bunks'],
          ['1F', 60, 48, 'gadget', 'Black Eye – Bunks'],
          ['1F', 52, 54, 'gadget', 'Black Eye – Briefing'],
          ['B', 55, 58, 'rotation', 'Rückzug → Keller', 57, 56],
        ],
      },
      {
        op: 'kaid', role: 'Support-Roamer', task: 'Anti-Breach Hatch & Wand',
        why: 'Kaid sichert das Hatch und die Außenwand mit Claws – wichtig gegen Hibana/Ace.',
        ab: 'Electroclaw Hatch + Wand',
        load: L('AUG A3', 'TCSG12', 'Barbed Wire'),
        obj: ['support', 'breach', 'utility'],
        prep: [
          'Verstärke Hatch und Hauptwand, Claws an beide setzen.',
        ],
        act: [
          'Halte den Kellergang.',
          'Breach-Picks ansagen, Claw erneuern.',
          'Retake: Claw an die Tür.',
        ],
        m: [
          ['B', 62, 58, 'position', 'Kaid – Gang'],
          ['B', 56, 54, 'gadget', 'Electroclaw – Hatch'],
          ['B', 63, 56, 'gadget', 'Electroclaw – Wand'],
        ],
      },
    ],
    subs: [
      { op: 'smoke', for: 'mira', role: 'Anchor', reason: 'Gas stoppt Hatch-Push und Plant.', takes: ['Denial'], change: 'Gas unter Hatch.', weak: 'Kein Intel.' },
      { op: 'mute', for: 'kaid', role: 'Support-Roamer', reason: 'Jammer blocken Breach und Drohnen im Gang.', takes: ['Anti-Breach'], change: 'Jammer am Hatch.', weak: 'Kurze Reichweite.' },
      { op: 'lesion', for: 'castle', role: 'Flex-Anchor', reason: 'Minen im Gang verlangsamen.', takes: ['Anti-Entry'], change: 'Minen statt Panels.', weak: 'Keine Barriere.' },
      { op: 'alibi', for: 'valkyrie', role: 'Roamer', reason: 'Prismas in Bunks.', takes: ['Roam-Intel'], change: 'Prismas statt Kameras.', weak: 'Nur lokale Intel.' },
      { op: 'maestro', for: 'echo', role: 'Support-Roamer', reason: 'Evil Eyes decken Hatch und Gang.', takes: ['Intel', 'Denial'], change: 'Evil Eyes statt Yokai.', weak: 'Kein Schock.' },
    ],
    def: {
      retake: [
        'Mira/Castle halten Lab/Support, Echo stoppt den Plant.',
        'Valkyrie liefert Intel von oben.',
      ],
      roam: [
        'Valkyrie hält Bunks/Briefing.',
        'Kaid hält den Gang.',
      ],
    },
  },
  {
    id: 'lair-master-def-standard',
    map: 'lair', site: 'master', side: 'defense', style: 'standard',
    name: 'Master Office – 2F-Anker mit Catwalk-Kontrolle',
    summary:
      'Master Office/R6 Room wird über die Catwalk- und Flurkontrolle gehalten. Der 2F-Anker ist stark, aber ' +
      'auf Vertikal-Push aus dem Keller angewiesen auf gutes Timing.',
    confidence: 'eigene-analyse',
    ratings: {
      c: 3, d: 'hoch', u: 'hoch', k: 'hoch',
      s: ['Starke Innenwinkel', 'Catwalk als natürliche Barriere'],
      w: ['Vertikal-Push von B/1F', 'Wenig Außenwände für Breach-Kontrolle'],
    },
    players: [
      {
        op: 'mira', role: 'Anchor', task: 'Master-Anker & Catwalk-Mirror',
        why: 'Der Mirror sichert den Catwalk-Zugang.',
        ab: 'Black-Mirror Master ↔ R6 Room',
        load: L('Vector .45 ACP', 'ITA12S', 'Nitro Cell'),
        obj: ['anchor', 'intel', 'plantDenial'],
        prep: [
          'Verstärke Catwalk-Wand und Flurwand.',
          'Mirror in die Wand Master → R6 Room.',
          'Nitro an die Catwalk-Tür.',
        ],
        act: [
          'Halte Mirror- und Catwalkwinkel.',
          'Bewegungen aus dem Flur ansagen.',
          'Retake: Nitro auf den Defuser.',
        ],
        m: [
          ['2F', 59, 47, 'position', 'Mira – Master'],
          ['2F', 62, 49, 'gadget', 'Black-Mirror – R6 Room'],
          ['2F', 57, 50, 'gadget', 'Nitro – Catwalk'],
        ],
      },
      {
        op: 'castle', role: 'Flex-Anchor', task: 'R6-Flex & Flur-Panel',
        why: 'Castle schließt die R6-Tür und den Flurzugang.',
        ab: 'Armor Panels R6 + Flur',
        load: L('UMP45', 'M1014', 'Bulletproof Camera'),
        obj: ['support', 'antiEntry', 'anchor'],
        prep: [
          'Panels an die R6-Tür und die Flur-Tür.',
          'Kamera in den Flur.',
        ],
        act: [
          'Halte R6 und den Flur.',
          'Panel-Bruch ansagen.',
          'Retake: Panel an die Tür.',
        ],
        m: [
          ['2F', 64, 50, 'position', 'Castle – R6'],
          ['2F', 66, 52, 'gadget', 'Armor Panel – R6'],
          ['2F', 60, 52, 'gadget', 'Armor Panel – Flur'],
          ['2F', 57, 55, 'gadget', 'Bulletproof Camera – Flur'],
        ],
      },
      {
        op: 'echo', role: 'Support-Roamer', task: 'Flur & Catwalk-Intel',
        why: 'Yokai deckt Flur und Catwalk, Echo stört den Plant.',
        ab: 'Yokai Flur + Catwalk',
        load: L('MP5SD', 'SuperNova', 'Deployable Shield'),
        obj: ['support', 'intel', 'plantDenial'],
        prep: [
          'Yokai 1 in den Flur, Yokai 2 an den Catwalk.',
          'Shield an die Master-Tür.',
        ],
        act: [
          'Flur und Catwalk abwechselnd lesen.',
          'Schock bei Plant.',
          'Retake: Yokai als Intel halten.',
        ],
        m: [
          ['2F', 57, 55, 'gadget', 'Yokai – Flur'],
          ['2F', 52, 57, 'gadget', 'Yokai – Catwalk'],
          ['2F', 59, 49, 'gadget', 'Deployable Shield – Master'],
          ['2F', 61, 53, 'position', 'Echo – Flur'],
        ],
      },
      {
        op: 'valkyrie', role: 'Roamer', task: '1F-Armory- & Bunks-Roam',
        why: 'Valkyrie liest den Push aus dem 1F-Bereich, der auf Lair oft den Ausschlag gibt.',
        ab: 'Black Eyes Armory / Bunks / Briefing',
        load: L('MPX', 'SPAS-12', 'Nitro Cell'),
        obj: ['roam', 'intel', 'flankWatch'],
        prep: [
          'Kamera in Armory, Kamera in Bunks, Kamera in Briefing.',
          'Nitro an die Armory-Tür.',
        ],
        act: [
          'Starte in Armory, halte die Treppe.',
          'Ruf Treppenbewegungen durch.',
          'Rückzug über den Flur.',
          'Ab 1:05 an der Site.',
        ],
        m: [
          ['1F', 62, 48, 'position', 'Valkyrie – Armory'],
          ['1F', 64, 46, 'gadget', 'Black Eye – Armory'],
          ['1F', 58, 50, 'gadget', 'Black Eye – Bunks'],
          ['2F', 58, 52, 'rotation', 'Rückzug → Master', 59, 49],
        ],
      },
      {
        op: 'kaid', role: 'Support-Roamer', task: 'Anti-Breach Catwalk-Wand',
        why: 'Kaid sichert die Catwalk-Außenwand gegen Hard Breach.',
        ab: 'Electroclaw Catwalk-Wand',
        load: L('AUG A3', 'TCSG12', 'Barbed Wire'),
        obj: ['support', 'breach', 'utility'],
        prep: [
          'Verstärke die Catwalk-Wand, Claw daran.',
          'Stacheldraht in den Flur.',
        ],
        act: [
          'Halte den Flur.',
          'Breach-Picks ansagen.',
          'Retake: Claw an die Tür.',
        ],
        m: [
          ['2F', 55, 53, 'position', 'Kaid – Flur'],
          ['2F', 52, 55, 'gadget', 'Electroclaw – Catwalk'],
        ],
      },
    ],
    subs: [
      { op: 'smoke', for: 'mira', role: 'Anchor', reason: 'Gas stoppt Catwalk-Push.', takes: ['Denial'], change: 'Gas am Catwalk.', weak: 'Kein Intel.' },
      { op: 'mute', for: 'kaid', role: 'Support-Roamer', reason: 'Jammer blocken Breach.', takes: ['Anti-Breach'], change: 'Jammer an Catwalk.', weak: 'Kurze Reichweite.' },
      { op: 'alibi', for: 'valkyrie', role: 'Roamer', reason: 'Prismas in Armory.', takes: ['Roam-Intel'], change: 'Prismas statt Kameras.', weak: 'Nur lokale Intel.' },
      { op: 'lesion', for: 'castle', role: 'Flex-Anchor', reason: 'Minen an Flur/Catwalk.', takes: ['Anti-Entry'], change: 'Minen statt Panels.', weak: 'Keine Barriere.' },
      { op: 'maestro', for: 'echo', role: 'Support-Roamer', reason: 'Evil Eyes decken Flur und Catwalk.', takes: ['Intel', 'Denial'], change: 'Evil Eyes statt Yokai.', weak: 'Kein Schock.' },
    ],
    def: {
      retake: [
        'Mira/Castle halten Master/R6, Echo stört den Plant.',
        'Valkyrie liefert Intel aus dem 1F.',
      ],
      roam: [
        'Valkyrie hält Armory.',
        'Kaid hält den Flur.',
      ],
    },
  },

  /* ======================================================= NIGHTHAVEN */
  {
    id: 'nighthaven-command-def-standard',
    map: 'nighthaven', site: 'command', side: 'defense', style: 'standard',
    name: 'Command Center – 2F-Anker mit Skylight-Denial',
    summary:
      'Command Center/Servers ist die stärkste Site auf Nighthaven Labs, wenn Skylight und Außenwand kontrolliert werden. ' +
      'Mira sichert den Skylight-Zugang, Castle die Fenster, Echo die Hatches, ein Roamer den 1F-Stairwell.',
    confidence: 'eigene-analyse',
    ratings: {
      c: 5, d: 'hoch', u: 'hoch', k: 'hoch',
      s: ['Sehr starke Ankerwinkel', 'Skylight-Kontrolle entscheidet'],
      w: ['Vertikal-Push durch 1F-Cafeteria', 'Zwei Außenwände'],
    },
    players: [
      {
        op: 'mira', role: 'Anchor', task: 'Command-Anker & Skylight-Mirror',
        why: 'Der Mirror sichert das Skylight, den wichtigsten Einstieg.',
        ab: 'Black-Mirror Command ↔ Servers',
        load: L('Vector .45 ACP', 'ITA12S', 'Nitro Cell'),
        obj: ['anchor', 'intel', 'plantDenial'],
        prep: [
          'Verstärke die Skylight-Wand und die Außenwand.',
          'Mirror in die Wand Command → Servers.',
          'Nitro unter das Skylight.',
        ],
        act: [
          'Halte Mirror- und Skylightwinkel.',
          'Dach-Bewegungen früh ansagen.',
          'Retake: Nitro auf den Defuser.',
        ],
        m: [
          ['2F', 58, 45, 'position', 'Mira – Command'],
          ['2F', 61, 47, 'gadget', 'Black-Mirror – Servers'],
          ['2F', 55, 48, 'gadget', 'Nitro – Skylight'],
        ],
      },
      {
        op: 'castle', role: 'Flex-Anchor', task: 'Servers-Flex & Fenster-Panels',
        why: 'Castle schließt die Servers-Fenster und die Flur-Tür.',
        ab: 'Armor Panels Servers + Flur',
        load: L('UMP45', 'M1014', 'Bulletproof Camera'),
        obj: ['support', 'antiEntry', 'anchor'],
        prep: [
          'Panels an zwei Servers-Fenster und die Flur-Tür.',
          'Kamera in den 2F-Flur.',
        ],
        act: [
          'Halte Servers und den Flur.',
          'Panel-Bruch ansagen.',
          'Retake: Panel an die Tür.',
        ],
        m: [
          ['2F', 62, 47, 'position', 'Castle – Servers'],
          ['2F', 64, 45, 'gadget', 'Armor Panel – Fenster'],
          ['2F', 58, 50, 'gadget', 'Armor Panel – Flur'],
          ['2F', 55, 50, 'gadget', 'Bulletproof Camera – Flur'],
        ],
      },
      {
        op: 'echo', role: 'Support-Roamer', task: 'Hatch- & Skylight-Intel',
        why: 'Yokai deckt Skylight und Hatches und stört Plants.',
        ab: 'Yokai Skylight + Hatches',
        load: L('MP5SD', 'SuperNova', 'Deployable Shield'),
        obj: ['support', 'intel', 'plantDenial'],
        prep: [
          'Yokai 1 unter das Skylight, Yokai 2 an die Hatches.',
          'Shield an die Command-Tür.',
        ],
        act: [
          'Skylight und Hatches abwechselnd lesen.',
          'Schock bei Plant oder Dach-Entry.',
          'Retake: Yokai als Intel halten.',
        ],
        m: [
          ['2F', 55, 48, 'gadget', 'Yokai – Skylight'],
          ['2F', 52, 46, 'gadget', 'Yokai – Hatches'],
          ['2F', 58, 47, 'gadget', 'Deployable Shield – Command'],
          ['2F', 56, 52, 'position', 'Echo – Flur'],
        ],
      },
      {
        op: 'valkyrie', role: 'Roamer', task: '1F-Cafeteria- & Stairwell-Roam',
        why: 'Valkyrie liest den Push aus der Cafeteria und dem Stairwell.',
        ab: 'Black Eyes Cafeteria / Stairwell / Control',
        load: L('MPX', 'SPAS-12', 'Nitro Cell'),
        obj: ['roam', 'intel', 'flankWatch'],
        prep: [
          'Kamera in Cafeteria, Kamera an den Stairwell, Kamera in Control.',
          'Nitro an die Cafeteria-Tür.',
        ],
        act: [
          'Starte in der Cafeteria, halte das Aufbrechen des Bodens im Blick.',
          'Ruf Vertikal-Push sofort durch.',
          'Rückzug über die Treppe.',
          'Ab 1:05 an der Site.',
        ],
        m: [
          ['1F', 60, 47, 'position', 'Valkyrie – Cafeteria'],
          ['1F', 62, 45, 'gadget', 'Black Eye – Cafeteria'],
          ['1F', 63, 43, 'gadget', 'Black Eye – Stairwell'],
          ['2F', 56, 50, 'rotation', 'Rückzug → Flur', 56, 50],
        ],
      },
      {
        op: 'kaid', role: 'Support-Roamer', task: 'Anti-Breach Außenwand',
        why: 'Kaid sichert die Command-Außenwand gegen Hard Breach.',
        ab: 'Electroclaw Command-Außenwand + Hatch',
        load: L('AUG A3', 'TCSG12', 'Barbed Wire'),
        obj: ['support', 'breach', 'utility'],
        prep: [
          'Verstärke die Außenwand und das Flur-Hatch, Claws setzen.',
        ],
        act: [
          'Halte den 2F-Flur.',
          'Breach-Picks ansagen.',
          'Retake: Claw an die Tür.',
        ],
        m: [
          ['2F', 56, 52, 'position', 'Kaid – Flur'],
          ['2F', 60, 42, 'gadget', 'Electroclaw – Außenwand'],
          ['2F', 53, 48, 'gadget', 'Electroclaw – Hatch'],
        ],
      },
    ],
    subs: [
      { op: 'smoke', for: 'mira', role: 'Anchor', reason: 'Gas stoppt Skylight-Push und Plant.', takes: ['Denial'], change: 'Gas unter Skylight.', weak: 'Kein Intel.' },
      { op: 'mute', for: 'kaid', role: 'Support-Roamer', reason: 'Jammer blocken Breach und Drohnen.', takes: ['Anti-Breach'], change: 'Jammer an Außenwand.', weak: 'Kurze Reichweite.' },
      { op: 'alibi', for: 'valkyrie', role: 'Roamer', reason: 'Prismas in Cafeteria.', takes: ['Roam-Intel'], change: 'Prismas statt Kameras.', weak: 'Nur lokale Intel.' },
      { op: 'lesion', for: 'castle', role: 'Flex-Anchor', reason: 'Minen verlangsamen Entry.', takes: ['Anti-Entry'], change: 'Minen an Fenster/Flur.', weak: 'Keine Barriere.' },
      { op: 'maestro', for: 'echo', role: 'Support-Roamer', reason: 'Evil Eyes decken Skylight und Flur.', takes: ['Intel', 'Denial'], change: 'Evil Eyes statt Yokai.', weak: 'Kein Schock.' },
    ],
    def: {
      retake: [
        'Mira/Castle halten Command/Servers, Yokai liefert Skylight-Intel.',
        'Gas/Panel stoppt den Plant.',
      ],
      roam: [
        'Valkyrie hält Cafeteria.',
        'Kaid hält den 2F-Flur.',
      ],
    },
  },
  {
    id: 'nighthaven-tank-def-standard',
    map: 'nighthaven', site: 'tank', side: 'defense', style: 'standard',
    name: 'Tank – Keller-Bunker mit Assembly-Rotation',
    summary:
      'Tank/Assembly ist ein klassischer Keller-Bunker. Der Fokus liegt auf der Assembly-Rotation und der Kontrolle ' +
      'der Treppen; Castle schließt den Basement-Flur, Kaid sichert die Außenwand.',
    confidence: 'eigene-analyse',
    ratings: {
      c: 4, d: 'hoch', u: 'hoch', k: 'hoch',
      s: ['Enge Innenräume', 'Assembly-Rotation für Retakes'],
      w: ['Mehrere Treppen in den Keller', 'Vertikal-Push möglich'],
    },
    players: [
      {
        op: 'mira', role: 'Anchor', task: 'Tank-Anker & Assembly-Mirror',
        why: 'Der Mirror sichert den Assembly-Zugang, den sonst niemand sieht.',
        ab: 'Black-Mirror Tank ↔ Assembly',
        load: L('Vector .45 ACP', 'ITA12S', 'Nitro Cell'),
        obj: ['anchor', 'intel', 'plantDenial'],
        prep: [
          'Verstärke die Assembly-Wand und die Treppenwand.',
          'Mirror in die Wand Tank → Assembly.',
          'Nitro an die Treppen-Tür.',
        ],
        act: [
          'Halte Mirror und Treppenwinkel.',
          'Bewegungen aus der Assembly ansagen.',
          'Retake: Nitro auf den Defuser.',
        ],
        m: [
          ['B', 58, 45, 'position', 'Mira – Tank'],
          ['B', 61, 47, 'gadget', 'Black-Mirror – Assembly'],
          ['B', 55, 47, 'gadget', 'Nitro – Treppe'],
        ],
      },
      {
        op: 'castle', role: 'Flex-Anchor', task: 'Assembly-Flex & Flur-Panel',
        why: 'Castle schließt die Assembly-Tür und den Basement-Flur.',
        ab: 'Armor Panels Assembly + Flur',
        load: L('UMP45', 'M1014', 'Bulletproof Camera'),
        obj: ['support', 'antiEntry', 'anchor'],
        prep: [
          'Panels an die Assembly-Tür und die Flur-Tür.',
          'Kamera in den Flur.',
        ],
        act: [
          'Halte Assembly und den Flur.',
          'Panel-Bruch ansagen.',
          'Retake: Panel an die Tür.',
        ],
        m: [
          ['B', 63, 48, 'position', 'Castle – Assembly'],
          ['B', 65, 50, 'gadget', 'Armor Panel – Assembly'],
          ['B', 58, 50, 'gadget', 'Armor Panel – Flur'],
          ['B', 55, 50, 'gadget', 'Bulletproof Camera – Flur'],
        ],
      },
      {
        op: 'echo', role: 'Support-Roamer', task: 'Treppen- & Hatch-Intel',
        why: 'Yokai deckt Treppen und Hatches, Schock beim Plant.',
        ab: 'Yokai Treppen + Hatch',
        load: L('MP5SD', 'SuperNova', 'Deployable Shield'),
        obj: ['support', 'intel', 'plantDenial'],
        prep: [
          'Yokai 1 an die Treppe, Yokai 2 an das Hatch.',
          'Shield an die Tank-Tür.',
        ],
        act: [
          'Treppe und Hatch abwechselnd lesen.',
          'Schock bei Plant.',
          'Retake: Yokai als Intel halten.',
        ],
        m: [
          ['B', 55, 52, 'gadget', 'Yokai – Treppe'],
          ['B', 60, 45, 'gadget', 'Yokai – Hatch'],
          ['B', 58, 47, 'gadget', 'Deployable Shield – Tank'],
          ['B', 56, 52, 'position', 'Echo – Flur'],
        ],
      },
      {
        op: 'valkyrie', role: 'Roamer', task: '1F-Kitchen- & Control-Roam',
        why: 'Valkyrie liest den 1F-Push über Kitchen und Control.',
        ab: 'Black Eyes Kitchen / Control / Stairwell',
        load: L('MPX', 'SPAS-12', 'Nitro Cell'),
        obj: ['roam', 'intel', 'flankWatch'],
        prep: [
          'Kamera in Kitchen, Kamera in Control, Kamera an den Stairwell.',
          'Nitro an die Kitchen-Tür.',
        ],
        act: [
          'Starte in der Kitchen, halte die Treppe.',
          'Ruf Treppenbewegungen durch.',
          'Rückzug in den Keller.',
          'Ab 1:05 an der Site.',
        ],
        m: [
          ['1F', 55, 45, 'position', 'Valkyrie – Kitchen'],
          ['1F', 57, 43, 'gadget', 'Black Eye – Kitchen'],
          ['1F', 52, 52, 'gadget', 'Black Eye – Control'],
          ['B', 55, 52, 'rotation', 'Rückzug → Flur', 56, 50],
        ],
      },
      {
        op: 'kaid', role: 'Support-Roamer', task: 'Anti-Breach Außenwand & Hatch',
        why: 'Kaid sichert die Tank-Außenwand und das Hatch.',
        ab: 'Electroclaw Tank-Wand + Hatch',
        load: L('AUG A3', 'TCSG12', 'Barbed Wire'),
        obj: ['support', 'breach', 'utility'],
        prep: [
          'Verstärke Tank-Außenwand und Hatch, Claws setzen.',
        ],
        act: [
          'Halte den Basement-Flur.',
          'Breach-Picks ansagen.',
          'Retake: Claw an die Tür.',
        ],
        m: [
          ['B', 62, 52, 'position', 'Kaid – Flur'],
          ['B', 60, 43, 'gadget', 'Electroclaw – Tank'],
          ['B', 60, 45, 'gadget', 'Electroclaw – Hatch'],
        ],
      },
    ],
    subs: [
      { op: 'smoke', for: 'mira', role: 'Anchor', reason: 'Gas stoppt Treppen-Push.', takes: ['Denial'], change: 'Gas an Treppe.', weak: 'Kein Intel.' },
      { op: 'mute', for: 'kaid', role: 'Support-Roamer', reason: 'Jammer blocken Breach.', takes: ['Anti-Breach'], change: 'Jammer an Wand.', weak: 'Kurze Reichweite.' },
      { op: 'lesion', for: 'castle', role: 'Flex-Anchor', reason: 'Minen verlangsamen Flur-Push.', takes: ['Anti-Entry'], change: 'Minen statt Panels.', weak: 'Keine Barriere.' },
      { op: 'alibi', for: 'valkyrie', role: 'Roamer', reason: 'Prismas in Kitchen.', takes: ['Roam-Intel'], change: 'Prismas statt Kameras.', weak: 'Nur lokale Intel.' },
      { op: 'maestro', for: 'echo', role: 'Support-Roamer', reason: 'Evil Eyes decken Treppe und Flur.', takes: ['Intel', 'Denial'], change: 'Evil Eyes statt Yokai.', weak: 'Kein Schock.' },
    ],
    def: {
      retake: [
        'Mira/Castle halten Tank/Assembly, Echo stört den Plant.',
        'Valkyrie liefert Treppen-Intel.',
      ],
      roam: [
        'Valkyrie hält Kitchen/Control.',
        'Kaid hält den Basement-Flur.',
      ],
    },
  },
];
