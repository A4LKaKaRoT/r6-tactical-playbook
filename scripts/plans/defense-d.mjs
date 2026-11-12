/**
 * Verteidigungspläne – Teil D: Oregon, Outback, Villa, Calypso Casino
 * Marker: [floor, x, y, kind, label, toX?, toY?]
 */
const L = (p, s, g) => ({ primary: p, secondary: s, gadget: g });

export default [
  /* ============================================================ OREGON */
  {
    id: 'oregon-laundry-def-standard',
    map: 'oregon', site: 'laundry', side: 'defense', style: 'standard',
    name: 'Laundry – Keller-Bunker (Oregon-Klassiker)',
    summary:
      'Laundry/Supply wird in einem der bekanntesten Keller-Setups gehalten: Mira auf die Haupttreppe, Smoke im Supply, ' +
      'Kaid an der Außenwand, Castle schließt den Tunnel. Ein Roamer hält den 1F-Meeting-Bereich.',
    confidence: 'verifiziert',
    ratings: {
      c: 5, d: 'mittel', u: 'hoch', k: 'hoch',
      s: ['Das klassische Oregon-Basement', 'Sehr starke Ankerwinkel', 'Kurze Retake-Wege'],
      w: ['Vertikal-Push über 1F-Küche', 'Tunnel und Treppe müssen gleichzeitig gehalten werden'],
    },
    players: [
      {
        op: 'mira', role: 'Anchor', task: 'Laundry-Anker & Treppen-Mirror',
        why: 'Der Mirror auf die Haupttreppe ist der bekannteste Verteidigungs-Winkel auf Oregon.',
        ab: 'Black-Mirror Laundry ↔ Supply',
        load: L('Vector .45 ACP', 'ITA12S', 'Nitro Cell'),
        obj: ['anchor', 'intel', 'plantDenial'],
        prep: [
          'Verstärke die Treppenwand und die Tunnelwand.',
          'Mirror in die Wand Laundry → Supply.',
          'Nitro an die Tunnel-Tür.',
        ],
        act: [
          'Halte Mirror und Treppenwinkel.',
          'Ruf Bewegung auf der Treppe sofort an.',
          'Retake: Nitro auf den Defuser.',
        ],
        m: [
          ['B', 52, 46, 'position', 'Mira – Laundry'],
          ['B', 55, 49, 'gadget', 'Black-Mirror – Supply'],
          ['B', 49, 49, 'gadget', 'Nitro – Tunnel'],
        ],
      },
      {
        op: 'smoke', role: 'Anchor', task: 'Supply-Anker',
        why: 'Smoke hält Supply und stoppt Plants.',
        ab: 'Remote-Gas Supply-Eingang',
        load: L('FMG-9', 'M590A1', 'Barbed Wire'),
        obj: ['anchor', 'plantDenial', 'antiEntry'],
        prep: [
          'Verstärke Supply-Außenwand und die Treppenwand.',
          'Stacheldraht in den Gang.',
        ],
        act: [
          'Halte den Supply-Winkel.',
          'Gas bei Plant.',
          'Retake: Gas auf den Defuser.',
        ],
        m: [
          ['B', 57, 50, 'position', 'Smoke – Supply'],
          ['B', 59, 52, 'gadget', 'Stacheldraht – Gang'],
        ],
      },
      {
        op: 'kaid', role: 'Support-Roamer', task: 'Anti-Breach Keller-Außenwand',
        why: 'Kaid sichert die Keller-Außenwand, den wichtigsten Hard-Breach-Punkt.',
        ab: 'Electroclaw Keller-Außenwand + Hatch',
        load: L('AUG A3', 'TCSG12', 'Barbed Wire'),
        obj: ['support', 'breach', 'utility'],
        prep: [
          'Verstärke die Außenwand und das Küchen-Hatch, Claws setzen.',
        ],
        act: [
          'Halte den Gang und die Treppe.',
          'Breach-Picks ansagen.',
          'Retake: Claw an die Tür.',
        ],
        m: [
          ['B', 55, 56, 'position', 'Kaid – Gang'],
          ['B', 59, 54, 'gadget', 'Electroclaw – Außenwand'],
          ['1F', 51, 52, 'gadget', 'Electroclaw – Küchen-Hatch'],
        ],
      },
      {
        op: 'valkyrie', role: 'Roamer', task: 'Meeting- & Küchen-Roam',
        why: 'Valkyrie liest Vertikal-Push aus dem Meeting Hall und der Küche.',
        ab: 'Black Eyes Meeting / Küche / Dorms',
        load: L('MPX', 'SPAS-12', 'Nitro Cell'),
        obj: ['roam', 'intel', 'flankWatch'],
        prep: [
          'Kamera in Meeting Hall, Kamera in Küche, Kamera in Dorms.',
          'Nitro an die Meeting-Tür.',
        ],
        act: [
          'Starte in Meeting Hall, halte das Aufbrechen des Bodens im Blick.',
          'Ruf Vertikal-Push sofort durch.',
          'Rückzug über die 1F-Treppe.',
          'Ab 1:05 an der Site.',
        ],
        m: [
          ['1F', 47, 46, 'position', 'Valkyrie – Meeting'],
          ['1F', 49, 48, 'gadget', 'Black Eye – Meeting'],
          ['1F', 51, 52, 'gadget', 'Black Eye – Küche'],
          ['B', 54, 56, 'rotation', 'Rückzug → Keller', 55, 54],
        ],
      },
      {
        op: 'aruni', role: 'Deep-Roamer', task: 'Construction-/Tower-Denial',
        why: 'Aruni-Gates sperren den Construction-Zugang und den Tower-Weg.',
        ab: 'Surya-Gates Construction + Tower',
        load: L('P10 RONI', 'Mk 14 EBR', 'Barbed Wire'),
        obj: ['antiEntry', 'flankWatch', 'utility'],
        prep: [
          'Gate an Construction, Gate an den Tower-Zugang.',
          'Stacheldraht dahinter.',
        ],
        act: [
          'Halte Construction kurz, rotiere dann zurück.',
          'Gate-Bruch melden.',
          'Retake: Gate erneuern.',
        ],
        m: [
          ['1F', 32, 60, 'position', 'Aruni – Construction'],
          ['1F', 35, 62, 'gadget', 'Surya-Gate – Construction'],
          ['2F', 47, 55, 'gadget', 'Surya-Gate – Tower'],
        ],
      },
    ],
    subs: [
      { op: 'echo', for: 'mira', role: 'Anchor', reason: 'Yokai deckt Treppe und Gang.', takes: ['Intel', 'Plant-Denial'], change: 'Yokai an Treppe/Gang.', weak: 'Kein Mirror.' },
      { op: 'mute', for: 'kaid', role: 'Support-Roamer', reason: 'Jammer blocken Breach und Drohnen.', takes: ['Anti-Breach'], change: 'Jammer an Kellerwand.', weak: 'Kurze Reichweite.' },
      { op: 'lesion', for: 'aruni', role: 'Deep-Roamer', reason: 'Minen geben Construction-Intel.', takes: ['Frühwarnung'], change: 'Minen statt Gates.', weak: 'Kein harter Block.' },
      { op: 'castle', for: 'aruni', role: 'Flex-Anchor', reason: 'Panels schließen Tunnel und Treppe.', takes: ['Anti-Entry'], change: 'Panels statt Gates.', weak: 'Weniger Mobilität.' },
      { op: 'alibi', for: 'valkyrie', role: 'Roamer', reason: 'Prismas im Meeting.', takes: ['Roam-Intel'], change: 'Prismas statt Kameras.', weak: 'Nur lokale Intel.' },
    ],
    def: {
      retake: [
        'Mira öffnet den Treppen-Mirror, Smoke wirft Gas auf den Defuser.',
        'Kaid/Panel sichert den Nachrückweg, Roamer schneidet den Flank.',
      ],
      roam: [
        'Valkyrie hält Meeting/Küche.',
        'Aruni sperrt Construction/Tower, kein Kontakt ohne Not.',
      ],
    },
  },
  {
    id: 'oregon-kids-def-standard',
    map: 'oregon', site: 'kids', side: 'defense', style: 'standard',
    name: 'Kids\' Dorms – 2F-Anker mit Dachkontrolle',
    summary:
      'Kids\' Dorms/Dorms Main Hall wird gegen Dach- und Fensterdruck verteidigt. Der Schlüssel ist der Attic-Zugang ' +
      'und die Kontrolle der Tower-Treppe; Castle schließt die Fenster, Echo deckt das Dach.',
    confidence: 'verifiziert',
    ratings: {
      c: 5, d: 'mittel', u: 'hoch', k: 'hoch',
      s: ['Klassische 2F-Site', 'Sehr gute Ankerwinkel', 'Attic als Puffer'],
      w: ['Dach ist offen', 'Tower-Treppe als zweiter Weg'],
    },
    players: [
      {
        op: 'mira', role: 'Anchor', task: 'Kids-Anker & Tower-Mirror',
        why: 'Der Mirror sichert die Tower-Treppe, wichtigster Innenzugang.',
        ab: 'Black-Mirror Kids ↔ Dorms Main',
        load: L('Vector .45 ACP', 'ITA12S', 'Nitro Cell'),
        obj: ['anchor', 'intel', 'plantDenial'],
        prep: [
          'Verstärke die Tower-Wand und die Fensterwand.',
          'Mirror in die Wand Kids → Dorms Main Hall.',
          'Nitro unter das Dachfenster.',
        ],
        act: [
          'Halte Mirror- und Dachwinkel.',
          'Attic- und Tower-Bewegungen ansagen.',
          'Retake: Nitro auf den Defuser.',
        ],
        m: [
          ['2F', 51, 48, 'position', 'Mira – Kids'],
          ['2F', 54, 50, 'gadget', 'Black-Mirror – Dorms Main'],
          ['2F', 48, 51, 'gadget', 'Nitro – Dach'],
        ],
      },
      {
        op: 'castle', role: 'Flex-Anchor', task: 'Dorms-Flex & Fenster-Panels',
        why: 'Castle schließt die Fensterfront der Dorms.',
        ab: 'Armor Panels Dorms-Fenster + Tür',
        load: L('UMP45', 'M1014', 'Bulletproof Camera'),
        obj: ['support', 'antiEntry', 'anchor'],
        prep: [
          'Panels an zwei Dorms-Fenster und die Flur-Tür.',
          'Kamera in den 2F-Flur.',
        ],
        act: [
          'Halte Dorms und den Flur.',
          'Panel-Bruch ansagen.',
          'Retake: Panel an die Tür.',
        ],
        m: [
          ['2F', 56, 52, 'position', 'Castle – Dorms'],
          ['2F', 58, 50, 'gadget', 'Armor Panel – Fenster'],
          ['2F', 54, 55, 'gadget', 'Armor Panel – Flur'],
          ['2F', 54, 57, 'gadget', 'Bulletproof Camera – Flur'],
        ],
      },
      {
        op: 'echo', role: 'Support-Roamer', task: 'Attic- & Dach-Intel',
        why: 'Yokai deckt Attic und Dach, Schock beim Plant.',
        ab: 'Yokai Attic + Dachkante',
        load: L('MP5SD', 'SuperNova', 'Deployable Shield'),
        obj: ['support', 'intel', 'plantDenial'],
        prep: [
          'Yokai 1 in den Attic, Yokai 2 an die Dachkante.',
          'Shield an die Kids-Tür.',
        ],
        act: [
          'Attic und Dach abwechselnd lesen.',
          'Schock bei Plant.',
          'Retake: Yokai als Intel halten.',
        ],
        m: [
          ['3F', 53, 43, 'gadget', 'Yokai – Attic'],
          ['2F', 48, 47, 'gadget', 'Yokai – Dachkante'],
          ['2F', 51, 50, 'gadget', 'Deployable Shield – Kids'],
          ['2F', 52, 54, 'position', 'Echo – Flur'],
        ],
      },
      {
        op: 'valkyrie', role: 'Roamer', task: 'Meeting- & Tower-Roam',
        why: 'Valkyrie liest den Push über Meeting Hall und Tower.',
        ab: 'Black Eyes Meeting / Tower / Küche',
        load: L('MPX', 'SPAS-12', 'Nitro Cell'),
        obj: ['roam', 'intel', 'flankWatch'],
        prep: [
          'Kamera in Meeting Hall, Kamera an den Tower, Kamera in die Küche.',
          'Nitro an die Tower-Tür.',
        ],
        act: [
          'Starte in Meeting Hall, halte die 1F-Treppe.',
          'Ruf Tower-Bewegungen durch.',
          'Rückzug über die 1F-Treppe in den 2F-Flur.',
          'Ab 1:05 an der Site.',
        ],
        m: [
          ['1F', 47, 46, 'position', 'Valkyrie – Meeting'],
          ['1F', 49, 44, 'gadget', 'Black Eye – Meeting'],
          ['2F', 47, 55, 'gadget', 'Black Eye – Tower'],
          ['2F', 50, 57, 'rotation', 'Rückzug → Flur', 53, 55],
        ],
      },
      {
        op: 'kaid', role: 'Support-Roamer', task: 'Anti-Breach Kids-Außenwand',
        why: 'Kaid sichert die Kids-Außenwand und das Hatch.',
        ab: 'Electroclaw Kids-Wand + Hatch',
        load: L('AUG A3', 'TCSG12', 'Barbed Wire'),
        obj: ['support', 'breach', 'utility'],
        prep: [
          'Verstärke Außenwand und Hatch, Claws setzen.',
        ],
        act: [
          'Halte den 2F-Flur.',
          'Breach-Picks ansagen.',
          'Retake: Claw an die Tür.',
        ],
        m: [
          ['2F', 54, 57, 'position', 'Kaid – Flur'],
          ['2F', 51, 44, 'gadget', 'Electroclaw – Außenwand'],
          ['2F', 47, 50, 'gadget', 'Electroclaw – Hatch'],
        ],
      },
    ],
    subs: [
      { op: 'smoke', for: 'mira', role: 'Anchor', reason: 'Gas stoppt Dach-Push.', takes: ['Denial'], change: 'Gas am Dach.', weak: 'Kein Intel.' },
      { op: 'mute', for: 'kaid', role: 'Support-Roamer', reason: 'Jammer blocken Breach.', takes: ['Anti-Breach'], change: 'Jammer an Wand.', weak: 'Kurze Reichweite.' },
      { op: 'alibi', for: 'valkyrie', role: 'Roamer', reason: 'Prismas im Meeting.', takes: ['Roam-Intel'], change: 'Prismas statt Kameras.', weak: 'Nur lokale Intel.' },
      { op: 'lesion', for: 'castle', role: 'Flex-Anchor', reason: 'Minen verlangsamen Entry.', takes: ['Anti-Entry'], change: 'Minen statt Panels.', weak: 'Keine Barriere.' },
      { op: 'maestro', for: 'echo', role: 'Support-Roamer', reason: 'Evil Eyes decken Attic/Flur.', takes: ['Intel', 'Denial'], change: 'Evil Eyes statt Yokai.', weak: 'Kein Schock.' },
    ],
    def: {
      retake: [
        'Mira/Castle halten Kids/Dorms, Echo stört den Plant.',
        'Gas/Panel schließt den Zugang.',
      ],
      roam: [
        'Valkyrie hält Meeting/Tower.',
        'Kaid hält den 2F-Flur.',
      ],
    },
  },

  /* =========================================================== OUTBACK */
  {
    id: 'outback-party-def-standard',
    map: 'outback', site: 'party', side: 'defense', style: 'standard',
    name: 'Party Room – 2F-Anker mit Piano-Rotation',
    summary:
      'Party Room/Office wird über die Piano-Laundry-Rotation gehalten. Mira sichert die Treppe, Castle die Fenster, ' +
      'ein Roamer hält Mechanic/Kitchen gegen den 1F-Druck.',
    confidence: 'eigene-analyse',
    ratings: {
      c: 4, d: 'mittel', u: 'mittel', k: 'mittel',
      s: ['Party Room mit starken Innenwinkeln', 'Piano-Rotation entlastet'],
      w: ['Fensterfront breit', 'Vertikal-Push aus 1F'],
    },
    players: [
      {
        op: 'mira', role: 'Anchor', task: 'Party-Anker & Treppen-Mirror',
        why: 'Der Mirror sichert die Haupttreppe.',
        ab: 'Black-Mirror Party ↔ Office',
        load: L('Vector .45 ACP', 'ITA12S', 'Nitro Cell'),
        obj: ['anchor', 'intel', 'plantDenial'],
        prep: [
          'Verstärke Treppenwand und Außenwand.',
          'Mirror in die Wand Party → Office.',
          'Nitro an die Treppen-Tür.',
        ],
        act: [
          'Halte Mirror- und Treppenwinkel.',
          'Bewegungen aus der 1F ansagen.',
          'Retake: Nitro auf den Defuser.',
        ],
        m: [
          ['2F', 55, 46, 'position', 'Mira – Party'],
          ['2F', 58, 48, 'gadget', 'Black-Mirror – Office'],
          ['2F', 52, 48, 'gadget', 'Nitro – Treppe'],
        ],
      },
      {
        op: 'castle', role: 'Flex-Anchor', task: 'Office-Flex & Fenster-Panels',
        why: 'Castle schließt die Office-Fenster und die Flur-Tür.',
        ab: 'Armor Panels Office + Flur',
        load: L('UMP45', 'M1014', 'Bulletproof Camera'),
        obj: ['support', 'antiEntry', 'anchor'],
        prep: [
          'Panels an zwei Office-Fenster und die Flur-Tür.',
          'Kamera in den 2F-Flur.',
        ],
        act: [
          'Halte Office und den Flur.',
          'Panel-Bruch ansagen.',
          'Retake: Panel an die Tür.',
        ],
        m: [
          ['2F', 50, 50, 'position', 'Castle – Office'],
          ['2F', 48, 48, 'gadget', 'Armor Panel – Fenster'],
          ['2F', 53, 52, 'gadget', 'Armor Panel – Flur'],
          ['2F', 53, 43, 'gadget', 'Bulletproof Camera – Flur'],
        ],
      },
      {
        op: 'echo', role: 'Support-Roamer', task: 'Treppen- & Flur-Intel',
        why: 'Yokai deckt Treppe und Flur, Schock beim Plant.',
        ab: 'Yokai Treppe + Flur',
        load: L('MP5SD', 'SuperNova', 'Deployable Shield'),
        obj: ['support', 'intel', 'plantDenial'],
        prep: [
          'Yokai 1 an die Treppe, Yokai 2 in den Flur.',
          'Shield an die Party-Tür.',
        ],
        act: [
          'Treppe und Flur abwechselnd lesen.',
          'Schock bei Plant.',
          'Retake: Yokai als Intel halten.',
        ],
        m: [
          ['2F', 52, 48, 'gadget', 'Yokai – Treppe'],
          ['2F', 53, 43, 'gadget', 'Yokai – Flur'],
          ['2F', 55, 46, 'gadget', 'Deployable Shield – Party'],
          ['2F', 54, 50, 'position', 'Echo – Flur'],
        ],
      },
      {
        op: 'valkyrie', role: 'Roamer', task: 'Mechanic- & Kitchen-Roam',
        why: 'Valkyrie liest den 1F-Push über Mechanic und Kitchen.',
        ab: 'Black Eyes Mechanic / Kitchen / Bar',
        load: L('MPX', 'SPAS-12', 'Nitro Cell'),
        obj: ['roam', 'intel', 'flankWatch'],
        prep: [
          'Kamera in Mechanic, Kamera in Kitchen, Kamera in die Bar.',
          'Nitro an die Mechanic-Tür.',
        ],
        act: [
          'Starte in Mechanic, halte die Treppe.',
          'Ruf Vertikal-Push durch.',
          'Rückzug über die Bar → Treppe.',
          'Ab 1:05 an der Site.',
        ],
        m: [
          ['1F', 48, 40, 'position', 'Valkyrie – Mechanic'],
          ['1F', 50, 38, 'gadget', 'Black Eye – Mechanic'],
          ['1F', 54, 44, 'gadget', 'Black Eye – Kitchen'],
          ['2F', 53, 48, 'rotation', 'Rückzug → Party', 55, 47],
        ],
      },
      {
        op: 'kaid', role: 'Support-Roamer', task: 'Anti-Breach Außenwand',
        why: 'Kaid sichert die Party-Außenwand gegen Hard Breach.',
        ab: 'Electroclaw Party-Außenwand',
        load: L('AUG A3', 'TCSG12', 'Barbed Wire'),
        obj: ['support', 'breach', 'utility'],
        prep: [
          'Verstärke die Außenwand, Claw daran.',
          'Stacheldraht in den Flur.',
        ],
        act: [
          'Halte den Flur.',
          'Breach-Picks ansagen.',
          'Retake: Claw an die Tür.',
        ],
        m: [
          ['2F', 56, 50, 'position', 'Kaid – Flur'],
          ['2F', 58, 44, 'gadget', 'Electroclaw – Außenwand'],
        ],
      },
    ],
    subs: [
      { op: 'smoke', for: 'mira', role: 'Anchor', reason: 'Gas stoppt Treppen-Push.', takes: ['Denial'], change: 'Gas an Treppe.', weak: 'Kein Intel.' },
      { op: 'mute', for: 'kaid', role: 'Support-Roamer', reason: 'Jammer blocken Breach.', takes: ['Anti-Breach'], change: 'Jammer an Wand.', weak: 'Kurze Reichweite.' },
      { op: 'alibi', for: 'valkyrie', role: 'Roamer', reason: 'Prismas in Mechanic.', takes: ['Roam-Intel'], change: 'Prismas statt Kameras.', weak: 'Nur lokale Intel.' },
      { op: 'lesion', for: 'castle', role: 'Flex-Anchor', reason: 'Minen verlangsamen Entry.', takes: ['Anti-Entry'], change: 'Minen statt Panels.', weak: 'Keine Barriere.' },
      { op: 'maestro', for: 'echo', role: 'Support-Roamer', reason: 'Evil Eyes decken Treppe/Flur.', takes: ['Intel', 'Denial'], change: 'Evil Eyes statt Yokai.', weak: 'Kein Schock.' },
    ],
    def: {
      retake: [
        'Mira/Castle halten Party/Office, Echo stört den Plant.',
        'Gas/Panel schließt den Zugang.',
      ],
      roam: [
        'Valkyrie hält Mechanic/Kitchen.',
        'Kaid hält den Flur.',
      ],
    },
  },
  {
    id: 'outback-mechanic-def-standard',
    map: 'outback', site: 'mechanic', side: 'defense', style: 'standard',
    name: 'Mechanic Shop – Keller-naher Bunker',
    summary:
      'Mechanic/Kitchen wird als 1F-Bunker mit Garage-Rotation gespielt. Mira sichert die Garage, Castle die Fenster, ' +
      'ein Roamer hält die Bedrooms gegen den Push von oben.',
    confidence: 'eigene-analyse',
    ratings: {
      c: 3, d: 'mittel', u: 'mittel', k: 'mittel',
      s: ['Starke Innenwinkel', 'Garage-Rotation'],
      w: ['Viele 1F-Zugänge', 'Vertikal von 2F'],
    },
    players: [
      {
        op: 'mira', role: 'Anchor', task: 'Mechanic-Anker & Garage-Mirror',
        why: 'Der Mirror sichert die Garage.',
        ab: 'Black-Mirror Mechanic ↔ Kitchen',
        load: L('Vector .45 ACP', 'ITA12S', 'Nitro Cell'),
        obj: ['anchor', 'intel', 'plantDenial'],
        prep: [
          'Verstärke die Garage-Wand und die Außenwand.',
          'Mirror in die Wand Mechanic → Kitchen.',
          'Nitro an die Garage-Tür.',
        ],
        act: [
          'Halte Mirror und Garagenwinkel.',
          'Garage-Bewegungen ansagen.',
          'Retake: Nitro auf den Defuser.',
        ],
        m: [
          ['1F', 48, 40, 'position', 'Mira – Mechanic'],
          ['1F', 51, 42, 'gadget', 'Black-Mirror – Kitchen'],
          ['1F', 45, 42, 'gadget', 'Nitro – Garage'],
        ],
      },
      {
        op: 'castle', role: 'Flex-Anchor', task: 'Kitchen-Flex & Fenster-Panels',
        why: 'Castle schließt die Kitchen-Fenster und die Garage-Tür.',
        ab: 'Armor Panels Kitchen + Garage',
        load: L('UMP45', 'M1014', 'Bulletproof Camera'),
        obj: ['support', 'antiEntry', 'anchor'],
        prep: [
          'Panels an zwei Kitchen-Fenster und die Garage-Tür.',
          'Kamera in den Flur.',
        ],
        act: [
          'Halte Kitchen und den Flur.',
          'Panel-Bruch ansagen.',
          'Retake: Panel an die Tür.',
        ],
        m: [
          ['1F', 54, 44, 'position', 'Castle – Kitchen'],
          ['1F', 56, 42, 'gadget', 'Armor Panel – Fenster'],
          ['1F', 55, 58, 'gadget', 'Armor Panel – Garage'],
          ['1F', 52, 47, 'gadget', 'Bulletproof Camera – Flur'],
        ],
      },
      {
        op: 'smoke', role: 'Support-Roamer', task: 'Garage & Plant-Denial',
        why: 'Smoke hält die Garage und stoppt Plants.',
        ab: 'Remote-Gas Garage-Tür',
        load: L('FMG-9', 'M590A1', 'Barbed Wire'),
        obj: ['support', 'plantDenial', 'utility'],
        prep: [
          'Stacheldraht in die Garage.',
          'Verstärke die Garage-Wand.',
        ],
        act: [
          'Halte den Garagenwinkel.',
          'Gas bei Plant.',
          'Retake: Gas auf den Defuser.',
        ],
        m: [
          ['1F', 55, 58, 'position', 'Smoke – Garage'],
          ['1F', 53, 60, 'gadget', 'Stacheldraht – Garage'],
        ],
      },
      {
        op: 'valkyrie', role: 'Roamer', task: 'Bedroom- & 2F-Roam',
        why: 'Valkyrie liest den Push über die Bedrooms und den 2F-Flur.',
        ab: 'Black Eyes Bedrooms / Flur / Bridge',
        load: L('MPX', 'SPAS-12', 'Nitro Cell'),
        obj: ['roam', 'intel', 'flankWatch'],
        prep: [
          'Kamera in Green Bedroom, Kamera in Red Bedroom, Kamera in den 2F-Flur.',
          'Nitro an die Bedroom-Tür.',
        ],
        act: [
          'Starte in Green Bedroom, halte die Treppe.',
          'Ruf Treppenbewegungen durch.',
          'Rückzug über den Flur.',
          'Ab 1:05 an der Site.',
        ],
        m: [
          ['1F', 42, 33, 'position', 'Valkyrie – Green Bedroom'],
          ['1F', 44, 35, 'gadget', 'Black Eye – Green'],
          ['1F', 47, 30, 'gadget', 'Black Eye – Red'],
          ['1F', 52, 47, 'rotation', 'Rückzug → Flur', 52, 45],
        ],
      },
      {
        op: 'kaid', role: 'Support-Roamer', task: 'Anti-Breach Außenwand',
        why: 'Kaid sichert die Mechanic-Außenwand.',
        ab: 'Electroclaw Mechanic-Wand',
        load: L('AUG A3', 'TCSG12', 'Barbed Wire'),
        obj: ['support', 'breach', 'utility'],
        prep: [
          'Verstärke die Außenwand, Claw daran.',
        ],
        act: [
          'Halte den Flur.',
          'Breach-Picks ansagen.',
          'Retake: Claw an die Tür.',
        ],
        m: [
          ['1F', 50, 47, 'position', 'Kaid – Flur'],
          ['1F', 48, 36, 'gadget', 'Electroclaw – Außenwand'],
        ],
      },
    ],
    subs: [
      { op: 'echo', for: 'mira', role: 'Anchor', reason: 'Yokai deckt Garage und Flur.', takes: ['Intel'], change: 'Yokai in Garage.', weak: 'Kein Mirror.' },
      { op: 'mute', for: 'kaid', role: 'Support-Roamer', reason: 'Jammer blocken Breach.', takes: ['Anti-Breach'], change: 'Jammer statt Claw.', weak: 'Kurze Reichweite.' },
      { op: 'aruni', for: 'castle', role: 'Flex-Anchor', reason: 'Gates sperren Kitchen/Garage.', takes: ['Anti-Entry'], change: 'Gates statt Panels.', weak: 'Fenster offen.' },
      { op: 'alibi', for: 'valkyrie', role: 'Roamer', reason: 'Prismas in den Bedrooms.', takes: ['Roam-Intel'], change: 'Prismas statt Kameras.', weak: 'Nur lokale Intel.' },
      { op: 'lesion', for: 'smoke', role: 'Support-Roamer', reason: 'Minen verlangsamen Garage-Push.', takes: ['Anti-Entry'], change: 'Minen statt Gas.', weak: 'Weniger Plant-Stopp.' },
    ],
    def: {
      retake: [
        'Mira/Castle halten Mechanic/Kitchen, Smoke stoppt den Plant.',
        'Valkyrie liefert Bedroom-Intel.',
      ],
      roam: [
        'Valkyrie hält Bedrooms.',
        'Kaid hält den Flur.',
      ],
    },
  },

  /* ============================================================= VILLA */
  {
    id: 'villa-artstorage-def-standard',
    map: 'villa', site: 'art-storage', side: 'defense', style: 'standard',
    name: 'Art Storage – neue Basement-Site (Split Fire)',
    summary:
      'Die neue Basement-Site aus dem Villa-Targeted-Update: Art Storage/Old Office mit interner Garage als ' +
      'Hauptzugang. Da die Site neu ist, ist die Taktik bewusst defensiv strukturiert (Standard-Setup vor Aggression).',
    confidence: 'eigene-analyse',
    ratings: {
      c: 4, d: 'hoch', u: 'hoch', k: 'hoch',
      s: ['Neu: überrascht Gegner, die alte Villa-Setups kennen', 'Kurze, klare Retake-Wege'],
      w: ['Layout-Erfahrung im Team noch dünn', 'Garage ist jetzt interner Raum → mehr Innenwege für Angreifer'],
    },
    players: [
      {
        op: 'mira', role: 'Anchor', task: 'Art-Storage-Anker & Garage-Mirror',
        why: 'Der Mirror liest den neuen Garagen-Zugang – auf der neuen Site der wichtigste Innenweg.',
        ab: 'Black-Mirror Art Storage ↔ Old Office',
        load: L('Vector .45 ACP', 'ITA12S', 'Nitro Cell'),
        obj: ['anchor', 'intel', 'plantDenial'],
        prep: [
          'Verstärke die Garagen-Wand und den Treppen-Aufgang.',
          'Mirror in die Wand Art Storage → Old Office.',
          'Nitro an die Garagen-Tür.',
        ],
        act: [
          'Halte Mirror- und Garagenwinkel.',
          'Garagen-Bewegungen sofort ansagen.',
          'Retake: Nitro auf den Defuser.',
        ],
        m: [
          ['B', 77, 19, 'position', 'Mira – Art Storage'],
          ['B', 80, 22, 'gadget', 'Black-Mirror – Old Office'],
          ['B', 74, 22, 'gadget', 'Nitro – Garage'],
        ],
      },
      {
        op: 'castle', role: 'Flex-Anchor', task: 'Old-Office-Flex & Garage-Panel',
        why: 'Castle schließt die Garage als neuen Innenweg und die Old-Office-Tür.',
        ab: 'Armor Panels Garage + Old Office',
        load: L('UMP45', 'M1014', 'Bulletproof Camera'),
        obj: ['support', 'antiEntry', 'anchor'],
        prep: [
          'Panels an die Garagen-Tür und die Old-Office-Tür.',
          'Kamera in den Basement-Hall.',
        ],
        act: [
          'Halte Old Office und den Hall.',
          'Panel-Bruch ansagen.',
          'Retake: Panel an die Tür.',
        ],
        m: [
          ['B', 80, 24, 'position', 'Castle – Old Office'],
          ['B', 73, 33, 'gadget', 'Armor Panel – Garage'],
          ['B', 82, 26, 'gadget', 'Armor Panel – Old Office'],
          ['B', 76, 28, 'gadget', 'Bulletproof Camera – Hall'],
        ],
      },
      {
        op: 'echo', role: 'Support-Roamer', task: 'Hatch- & Treppen-Intel',
        why: 'Yokai deckt das 1F-Hatch (Küche) und die Treppe – auf Villa der häufigste Vertikal-Weg.',
        ab: 'Yokai 1F-Hatch + Treppe',
        load: L('MP5SD', 'SuperNova', 'Deployable Shield'),
        obj: ['support', 'intel', 'plantDenial'],
        prep: [
          'Yokai 1 unter das Küchen-Hatch, Yokai 2 an die Treppe.',
          'Shield an die Art-Storage-Tür.',
        ],
        act: [
          'Hatch und Treppe abwechselnd lesen.',
          'Schock bei Plant oder Hatch-Entry.',
          'Retake: Yokai als Intel halten.',
        ],
        m: [
          ['B', 74, 22, 'gadget', 'Yokai – Treppe'],
          ['1F', 74, 40, 'gadget', 'Yokai – Küchen-Hatch'],
          ['B', 77, 21, 'gadget', 'Deployable Shield – Art Storage'],
          ['B', 78, 25, 'position', 'Echo – Hall'],
        ],
      },
      {
        op: 'valkyrie', role: 'Roamer', task: '1F-Dining- & Küchen-Roam',
        why: 'Valkyrie liest den 1F-Push über Dining und Kitchen, der die neue Site am stärksten bedroht.',
        ab: 'Black Eyes Dining / Kitchen / Main Hall',
        load: L('MPX', 'SPAS-12', 'Nitro Cell'),
        obj: ['roam', 'intel', 'flankWatch'],
        prep: [
          'Kamera in Dining, Kamera in die Küche, Kamera in den Main Hall.',
          'Nitro an die Dining-Tür.',
        ],
        act: [
          'Starte in Dining, halte das Aufbrechen des Bodens im Blick.',
          'Ruf Vertikal-Push sofort durch.',
          'Rückzug über die Treppe.',
          'Ab 1:05 an der Site.',
        ],
        m: [
          ['1F', 76, 32, 'position', 'Valkyrie – Dining'],
          ['1F', 78, 30, 'gadget', 'Black Eye – Dining'],
          ['1F', 80, 37, 'gadget', 'Black Eye – Küche'],
          ['B', 76, 26, 'rotation', 'Rückzug → Hall', 77, 25],
        ],
      },
      {
        op: 'kaid', role: 'Support-Roamer', task: 'Anti-Breach Garage-Wand',
        why: 'Kaid sichert die Garagen-Außenwand gegen Hard Breach.',
        ab: 'Electroclaw Garage-Wand + Hatch',
        load: L('AUG A3', 'TCSG12', 'Barbed Wire'),
        obj: ['support', 'breach', 'utility'],
        prep: [
          'Verstärke Garage-Wand und Hatch, Claws setzen.',
        ],
        act: [
          'Halte den Basement-Hall.',
          'Breach-Picks ansagen.',
          'Retake: Claw an die Tür.',
        ],
        m: [
          ['B', 76, 30, 'position', 'Kaid – Hall'],
          ['B', 72, 35, 'gadget', 'Electroclaw – Garage'],
          ['1F', 74, 40, 'gadget', 'Electroclaw – Hatch'],
        ],
      },
    ],
    subs: [
      { op: 'smoke', for: 'mira', role: 'Anchor', reason: 'Gas stoppt Garage-Push und Plant.', takes: ['Denial'], change: 'Gas an Garage.', weak: 'Kein Intel.' },
      { op: 'mute', for: 'kaid', role: 'Support-Roamer', reason: 'Jammer blocken Breach und Drohnen.', takes: ['Anti-Breach'], change: 'Jammer an Wand.', weak: 'Kurze Reichweite.' },
      { op: 'lesion', for: 'castle', role: 'Flex-Anchor', reason: 'Minen verlangsamen Garage-Push.', takes: ['Anti-Entry'], change: 'Minen statt Panels.', weak: 'Keine Barriere.' },
      { op: 'alibi', for: 'valkyrie', role: 'Roamer', reason: 'Prismas in Dining.', takes: ['Roam-Intel'], change: 'Prismas statt Kameras.', weak: 'Nur lokale Intel.' },
      { op: 'maestro', for: 'echo', role: 'Support-Roamer', reason: 'Evil Eyes decken Treppe/Hall.', takes: ['Intel', 'Denial'], change: 'Evil Eyes statt Yokai.', weak: 'Kein Schock.' },
    ],
    def: {
      retake: [
        'Mira/Castle halten Art Storage/Old Office, Echo stört den Plant.',
        'Valkyrie liefert Dining-Intel, Kaid sichert die Garage.',
      ],
      roam: [
        'Valkyrie hält Dining/Küche (Vertikal-Push!).',
        'Kaid bleibt im Basement-Hall.',
      ],
    },
    notes: 'Die Site ist seit 01.09.2026 im Spiel. Nach 2–3 gespielten Runden Angriffs-/Verteidigungszeiten und funktionierende Winkel im Editor ergänzen.',
  },
  {
    id: 'villa-aviator-def-standard',
    map: 'villa', site: 'aviator', side: 'defense', style: 'standard',
    name: 'Aviator Room – 2F-Anker mit Games-Rotation',
    summary:
      'Aviator/Games ist die historisch stärkste Villa-Site. Das Setup setzt auf Fenster-Denial, Games-Rotation und ' +
      'einen Roamer, der den 1F-Library-Bereich gegen Vertikal hält.',
    confidence: 'verifiziert',
    ratings: {
      c: 5, d: 'hoch', u: 'hoch', k: 'hoch',
      s: ['Klassische Villa-Hauptsite', 'Sehr gute Ankerwinkel', 'Games-Rotation entlastet'],
      w: ['Sehr viele Fenster', 'Vertikal-Push über 1F-Library/Dining'],
    },
    players: [
      {
        op: 'mira', role: 'Anchor', task: 'Aviator-Anker & Fenster-Mirror',
        why: 'Der Mirror sichert die Hauptfensterfront, ohne dass Mira dort steht.',
        ab: 'Black-Mirror Aviator ↔ Games',
        load: L('Vector .45 ACP', 'ITA12S', 'Nitro Cell'),
        obj: ['anchor', 'intel', 'plantDenial'],
        prep: [
          'Verstärke die Fensterwand und die Games-Wand.',
          'Mirror in die Wand Aviator → Games.',
          'Nitro an die Fenstertür.',
        ],
        act: [
          'Halte Mirror- und Fensterwinkel.',
          'Fenster-Bewegungen früh ansagen.',
          'Retake: Nitro auf den Defuser.',
        ],
        m: [
          ['2F', 77, 30, 'position', 'Mira – Aviator'],
          ['2F', 80, 33, 'gadget', 'Black-Mirror – Games'],
          ['2F', 74, 32, 'gadget', 'Nitro – Fenster'],
        ],
      },
      {
        op: 'castle', role: 'Flex-Anchor', task: 'Games-Flex & Fenster-Panels',
        why: 'Castle schließt die Games-Fenster und die Statuary-Tür.',
        ab: 'Armor Panels Games + Statuary',
        load: L('UMP45', 'M1014', 'Bulletproof Camera'),
        obj: ['support', 'antiEntry', 'anchor'],
        prep: [
          'Panels an zwei Games-Fenster und die Statuary-Tür.',
          'Kamera in den 2F-Flur.',
        ],
        act: [
          'Halte Games und den Flur.',
          'Panel-Bruch ansagen.',
          'Retake: Panel an die Tür.',
        ],
        m: [
          ['2F', 81, 34, 'position', 'Castle – Games'],
          ['2F', 83, 31, 'gadget', 'Armor Panel – Fenster'],
          ['2F', 80, 42, 'gadget', 'Armor Panel – Statuary'],
          ['2F', 78, 45, 'gadget', 'Bulletproof Camera – Flur'],
        ],
      },
      {
        op: 'echo', role: 'Support-Roamer', task: 'Dach- & Flur-Intel',
        why: 'Yokai deckt das Dach und den Flur, Schock beim Plant.',
        ab: 'Yokai Dach + Flur',
        load: L('MP5SD', 'SuperNova', 'Deployable Shield'),
        obj: ['support', 'intel', 'plantDenial'],
        prep: [
          'Yokai 1 an das Dachfenster, Yokai 2 in den Flur.',
          'Shield an die Aviator-Tür.',
        ],
        act: [
          'Dach und Flur abwechselnd lesen.',
          'Schock bei Plant.',
          'Retake: Yokai als Intel halten.',
        ],
        m: [
          ['2F', 76, 28, 'gadget', 'Yokai – Dach'],
          ['2F', 78, 45, 'gadget', 'Yokai – Flur'],
          ['2F', 77, 32, 'gadget', 'Deployable Shield – Aviator'],
          ['2F', 79, 40, 'position', 'Echo – Flur'],
        ],
      },
      {
        op: 'valkyrie', role: 'Roamer', task: '1F-Library- & Dining-Roam',
        why: 'Valkyrie liest den Vertikal-Push aus Library/Dining.',
        ab: 'Black Eyes Library / Dining / Main Hall',
        load: L('MPX', 'SPAS-12', 'Nitro Cell'),
        obj: ['roam', 'intel', 'flankWatch'],
        prep: [
          'Kamera in Library, Kamera in Dining, Kamera in den Main Hall.',
          'Nitro an die Library-Tür.',
        ],
        act: [
          'Starte in Library, halte das Aufbrechen des Bodens im Blick.',
          'Ruf Vertikal-Push sofort durch.',
          'Rückzug über die Treppe.',
          'Ab 1:05 an der Site.',
        ],
        m: [
          ['1F', 74, 40, 'position', 'Valkyrie – Library'],
          ['1F', 72, 38, 'gadget', 'Black Eye – Library'],
          ['1F', 76, 32, 'gadget', 'Black Eye – Dining'],
          ['2F', 78, 40, 'rotation', 'Rückzug → Flur', 79, 42],
        ],
      },
      {
        op: 'kaid', role: 'Support-Roamer', task: 'Anti-Breach Aviator-Außenwand',
        why: 'Kaid sichert die Aviator-Außenwand gegen Hard Breach.',
        ab: 'Electroclaw Aviator-Außenwand',
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
          ['2F', 79, 42, 'position', 'Kaid – Flur'],
          ['2F', 76, 26, 'gadget', 'Electroclaw – Außenwand'],
        ],
      },
    ],
    subs: [
      { op: 'smoke', for: 'mira', role: 'Anchor', reason: 'Gas stoppt Fenster-Push.', takes: ['Denial'], change: 'Gas an Fenster.', weak: 'Kein Intel.' },
      { op: 'mute', for: 'kaid', role: 'Support-Roamer', reason: 'Jammer blocken Breach.', takes: ['Anti-Breach'], change: 'Jammer an Wand.', weak: 'Kurze Reichweite.' },
      { op: 'alibi', for: 'valkyrie', role: 'Roamer', reason: 'Prismas in Library.', takes: ['Roam-Intel'], change: 'Prismas statt Kameras.', weak: 'Nur lokale Intel.' },
      { op: 'lesion', for: 'castle', role: 'Flex-Anchor', reason: 'Minen verlangsamen Fenster-Entry.', takes: ['Anti-Entry'], change: 'Minen statt Panels.', weak: 'Keine Barriere.' },
      { op: 'maestro', for: 'echo', role: 'Support-Roamer', reason: 'Evil Eyes decken Dach/Flur.', takes: ['Intel', 'Denial'], change: 'Evil Eyes statt Yokai.', weak: 'Kein Schock.' },
    ],
    def: {
      retake: [
        'Mira/Castle halten Aviator/Games, Echo stört den Plant.',
        'Valkyrie liefert Library-Intel, Kaid sichert die Wand.',
      ],
      roam: [
        'Valkyrie hält Library/Dining.',
        'Kaid hält den 2F-Flur.',
      ],
    },
  },

  /* =================================================== CALYPSO CASINO */
  {
    id: 'calypso-cigar-def-standard',
    map: 'calypso-casino', site: 'cigar', side: 'defense', style: 'standard',
    name: 'Cigar Room – 2F-Anker (neue Map, defensiv)',
    summary:
      'Calypso Casino ist seit Y11S2 im Spiel – die Taktik ist bewusst konservativ: Site-Bunker, kontrollierte Fenster ' +
      'und ein Roamer, der die Treppen liest. Nach den ersten eigenen Matches hier gezielt nachschärfen.',
    confidence: 'eigene-analyse',
    ratings: {
      c: 3, d: 'hoch', u: 'mittel', k: 'hoch',
      s: ['Neue Map: Gegner kennen die Winkel oft schlechter', 'Kompakte Site'],
      w: ['Wenig eingespielte Erfahrung im Stack', 'Layout-Details noch nicht final bestätigt'],
    },
    players: [
      {
        op: 'mira', role: 'Anchor', task: 'Cigar-Anker & Treppen-Mirror',
        why: 'Der Mirror liest die Haupttreppe der 2F-Site.',
        ab: 'Black-Mirror Cigar ↔ Pool',
        load: L('Vector .45 ACP', 'ITA12S', 'Nitro Cell'),
        obj: ['anchor', 'intel', 'plantDenial'],
        prep: [
          'Verstärke die Treppenwand und die Außenwand.',
          'Mirror in die Wand Cigar → Pool.',
          'Nitro an die Treppen-Tür.',
        ],
        act: [
          'Halte Mirror- und Treppenwinkel.',
          'Treppen-Bewegungen ansagen.',
          'Retake: Nitro auf den Defuser.',
        ],
        m: [
          ['2F', 62, 27, 'position', 'Mira – Cigar'],
          ['2F', 65, 29, 'gadget', 'Black-Mirror – Pool'],
          ['2F', 59, 30, 'gadget', 'Nitro – Treppe'],
        ],
      },
      {
        op: 'castle', role: 'Flex-Anchor', task: 'Pool-Flex & Fenster-Panels',
        why: 'Castle schließt die Fensterfront und die High-Roller-Tür.',
        ab: 'Armor Panels Pool + High Roller',
        load: L('UMP45', 'M1014', 'Bulletproof Camera'),
        obj: ['support', 'antiEntry', 'anchor'],
        prep: [
          'Panels an zwei Pool-Fenster und die High-Roller-Tür.',
          'Kamera in den 2F-Flur.',
        ],
        act: [
          'Halte Pool und den Flur.',
          'Panel-Bruch ansagen.',
          'Retake: Panel an die Tür.',
        ],
        m: [
          ['2F', 67, 25, 'position', 'Castle – Pool'],
          ['2F', 69, 24, 'gadget', 'Armor Panel – Fenster'],
          ['2F', 58, 35, 'gadget', 'Armor Panel – High Roller'],
          ['2F', 64, 40, 'gadget', 'Bulletproof Camera – Flur'],
        ],
      },
      {
        op: 'echo', role: 'Support-Roamer', task: 'Flur- & Treppen-Intel',
        why: 'Yokai deckt Flur und Treppe, Schock beim Plant.',
        ab: 'Yokai Flur + Treppe',
        load: L('MP5SD', 'SuperNova', 'Deployable Shield'),
        obj: ['support', 'intel', 'plantDenial'],
        prep: [
          'Yokai 1 in den Flur, Yokai 2 an die Treppe.',
          'Shield an die Cigar-Tür.',
        ],
        act: [
          'Flur und Treppe abwechselnd lesen.',
          'Schock bei Plant.',
          'Retake: Yokai als Intel halten.',
        ],
        m: [
          ['2F', 64, 40, 'gadget', 'Yokai – Flur'],
          ['2F', 59, 30, 'gadget', 'Yokai – Treppe'],
          ['2F', 62, 29, 'gadget', 'Deployable Shield – Cigar'],
          ['2F', 63, 33, 'position', 'Echo – Flur'],
        ],
      },
      {
        op: 'valkyrie', role: 'Roamer', task: '1F-Bar- & Lobby-Roam',
        why: 'Valkyrie liest den 1F-Push über Bar und Lobby.',
        ab: 'Black Eyes Bar / Lobby / Betting',
        load: L('MPX', 'SPAS-12', 'Nitro Cell'),
        obj: ['roam', 'intel', 'flankWatch'],
        prep: [
          'Kamera in die Bar, Kamera in die Lobby, Kamera in Betting.',
          'Nitro an die Bar-Tür.',
        ],
        act: [
          'Starte in der Bar, halte die Treppe.',
          'Ruf Treppenbewegungen durch.',
          'Rückzug über die Lobby.',
          'Ab 1:05 an der Site.',
        ],
        m: [
          ['1F', 58, 40, 'position', 'Valkyrie – Bar'],
          ['1F', 56, 42, 'gadget', 'Black Eye – Bar'],
          ['1F', 61, 50, 'gadget', 'Black Eye – Lobby'],
          ['2F', 62, 35, 'rotation', 'Rückzug → Flur', 63, 33],
        ],
      },
      {
        op: 'kaid', role: 'Support-Roamer', task: 'Anti-Breach Außenwand',
        why: 'Kaid sichert die Cigar-Außenwand.',
        ab: 'Electroclaw Cigar-Außenwand',
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
          ['2F', 63, 33, 'position', 'Kaid – Flur'],
          ['2F', 60, 23, 'gadget', 'Electroclaw – Außenwand'],
        ],
      },
    ],
    subs: [
      { op: 'smoke', for: 'mira', role: 'Anchor', reason: 'Gas stoppt Treppen-Push.', takes: ['Denial'], change: 'Gas an Treppe.', weak: 'Kein Intel.' },
      { op: 'mute', for: 'kaid', role: 'Support-Roamer', reason: 'Jammer blocken Breach.', takes: ['Anti-Breach'], change: 'Jammer an Wand.', weak: 'Kurze Reichweite.' },
      { op: 'alibi', for: 'valkyrie', role: 'Roamer', reason: 'Prismas in der Bar.', takes: ['Roam-Intel'], change: 'Prismas statt Kameras.', weak: 'Nur lokale Intel.' },
      { op: 'lesion', for: 'castle', role: 'Flex-Anchor', reason: 'Minen verlangsamen Entry.', takes: ['Anti-Entry'], change: 'Minen statt Panels.', weak: 'Keine Barriere.' },
      { op: 'maestro', for: 'echo', role: 'Support-Roamer', reason: 'Evil Eyes decken Flur/Treppe.', takes: ['Intel', 'Denial'], change: 'Evil Eyes statt Yokai.', weak: 'Kein Schock.' },
    ],
    def: {
      retake: [
        'Mira/Castle halten Cigar/Pool, Echo stört den Plant.',
        'Valkyrie liefert Bar-Intel.',
      ],
      roam: [
        'Valkyrie hält Bar/Lobby.',
        'Kaid hält den Flur.',
      ],
    },
    notes: 'Calypso Casino ist neu (Y11S2). Nach den ersten Scrims/Matches hier Winkel und Timings im Editor nachtragen; die Site-Zuordnung folgt der offiziellen Ubisoft-Kartenübersicht.',
  },
];
