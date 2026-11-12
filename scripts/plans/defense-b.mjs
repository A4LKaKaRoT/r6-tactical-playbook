/**
 * Verteidigungspläne – Teil B: Chalet, Clubhouse, Coastline, Consulate
 * Marker: [floor, x, y, kind, label, toX?, toY?]
 */
const L = (p, s, g) => ({ primary: p, secondary: s, gadget: g });

export default [
  /* ========================================================== CHALET */
  {
    id: 'chalet-wine-def-standard',
    map: 'chalet', site: 'wine', side: 'defense', style: 'standard',
    name: 'Wine Cellar – Keller-Bunker mit Snowmobile-Rotation',
    summary:
      'Wine Cellar/Snowmobile Garage wird als klassischer Keller-Bunker gehalten: Mira für Intel auf die Treppe, ' +
      'Smoke für Plant-Denial, Kaid für die Wand zum Garage-Ramp und ein Roamer, der 1F-Druck verzögert.',
    confidence: 'verifiziert',
    ratings: {
      c: 5, d: 'mittel', u: 'hoch', k: 'hoch',
      s: ['Etablierte Profi-Site (Wine/Garage)', 'Sehr starke Ankerwinkel', 'Gute Rotation über 1F-Küche'],
      w: ['Zwei Treppen + Garage-Rampe', 'Vertikal-Druck von 1F-Küche/Dining'],
    },
    players: [
      {
        op: 'mira', role: 'Anchor', task: 'Wine-Anker & Treppen-Intel',
        why: 'Der Mirror zeigt die Haupttreppe und den Wine-Eingang, während Mira in Deckung bleibt.',
        ab: 'Black-Mirror Wine ↔ Garage-Wand',
        load: L('Vector .45 ACP', 'ITA12S', 'Nitro Cell'),
        obj: ['anchor', 'intel', 'plantDenial'],
        prep: [
          'Verstärke die Haupttreppen-Wand im Wine Cellar und die Außenwand zum Garage-Ramp.',
          'Setze den Mirror in die Wand Wine → Garage.',
          'Nitro vor die Treppe legen.',
          'Lass die Wand zur Küche offen (Rotation, von Player 3 genutzt).',
        ],
        act: [
          'Halte den Treppenwinkel und den Spiegelblick.',
          'Öffne den Mirror erst, wenn Angreifer direkt davorstehen.',
          'Melde Rampe und Treppe getrennt – "Rampe offen", "Treppe ruhig".',
          'Retake: Nitro auf den Defuser, Mirror aufreißen.',
        ],
        m: [
          ['B', 62, 34, 'position', 'Mira – Wine Cellar'],
          ['B', 59, 38, 'gadget', 'Black-Mirror – Wine/Garage'],
          ['B', 65, 40, 'gadget', 'Nitro – Treppe'],
        ],
      },
      {
        op: 'smoke', role: 'Anchor', task: 'Snowmobile-Anker',
        why: 'Smoke hält die Rampe mit Gas und kann den Plant im Garage-Bereich verzögern.',
        ab: 'Remote-Gas Snowmobile Garage + Rampe',
        load: L('FMG-9', 'M590A1', 'Barbed Wire'),
        obj: ['anchor', 'plantDenial', 'antiEntry'],
        prep: [
          'Verstärke die Garage-Wand und die Verbindung zu Wine.',
          'Stacheldraht an die Rampe und in den Gang.',
        ],
        act: [
          'Halte die Rampe aus der Deckung, Gas wirft Du auf den Defuser oder die offene Tür.',
          'Melde, wenn die Rampe geöffnet wird.',
          'Retake: Gas auf den Plan, dann zurück in Wine.',
        ],
        m: [
          ['B', 55, 46, 'position', 'Smoke – Snowmobile'],
          ['B', 50, 50, 'gadget', 'Stacheldraht – Rampe'],
        ],
      },
      {
        op: 'kaid', role: 'Support-Roamer', task: 'Anti-Breach Garage-Wand & Hatch',
        why: 'Kaid sichert die Garage-Außenwand und das Hatch mit Electroclaws aus sicherem Abstand.',
        ab: 'Electroclaw Garage-Wand + 1F-Hatch',
        load: L('AUG A3', 'TCSG12', 'Barbed Wire'),
        obj: ['support', 'breach', 'utility'],
        prep: [
          'Verstärke Garage-Außenwand und Hatch.',
          'Claw 1 an die Garage-Außenwand, Claw 2 an das Hatch im 1F-Flur.',
        ],
        act: [
          'Halte zuerst den 1F-Flur (Hatch-Kontrolle), dann die Garagenwinkel.',
          'Hard-Breach-Picks sofort ansagen.',
          'Retake: Claw an die Tür setzen, die vom Angreifer gehalten wird.',
        ],
        m: [
          ['1F', 55, 60, 'position', 'Kaid – 1F-Flur'],
          ['B', 48, 72, 'gadget', 'Electroclaw – Garage'],
          ['1F', 52, 65, 'gadget', 'Electroclaw – Hatch'],
        ],
      },
      {
        op: 'valkyrie', role: 'Roamer', task: '1F-Küchen- & Dining-Druck',
        why: 'Valkyrie liefert Intel über Kameras in Küche/Dining und kann mit Nitro den vertikalen Push brechen.',
        ab: 'Black Eyes Küche / Dining / Balcony',
        load: L('MPX', 'SPAS-12', 'Nitro Cell'),
        obj: ['roam', 'intel', 'flankWatch'],
        prep: [
          'Kamera in die Küche (Boden), Kamera in den Dining Room, Kamera an den Balkon.',
          'Nitro an die Küchentür legen.',
        ],
        act: [
          'Starte in der Küche, halte den vertikalen Druck auf Wine im Blick.',
          'Ruf an, wenn jemand auf dem Küchenboden aufbricht (Sledge/Buck/Fuze).',
          'Rückzug über 1F-Flur → Wine-Treppe.',
          'Ab 1:10 wieder an die Site.',
        ],
        m: [
          ['1F', 64, 45, 'position', 'Valkyrie – Küche'],
          ['1F', 58, 40, 'gadget', 'Black Eye – Küche'],
          ['1F', 56, 34, 'gadget', 'Black Eye – Dining'],
          ['1F', 68, 48, 'gadget', 'Nitro – Küchentür'],
          ['1F', 60, 52, 'rotation', 'Rückzug Küche → Flur', 55, 58],
        ],
      },
      {
        op: 'castle', role: 'Flex-Anchor', task: 'Wine-Eingang & Balkon-Panel',
        why: 'Castle schließt die Balkontür und den Wine-Aufgang, sodass Fenster-Entrys verzögert werden.',
        ab: 'Armor Panel Küchenfenster + Wine-Tür',
        load: L('UMP45', 'M1014', 'Bulletproof Camera'),
        obj: ['support', 'antiEntry', 'utility'],
        prep: [
          'Panel an die Wine-Tür (1F-Aufgang) und an das Küchenfenster.',
          'Kamera in den 1F-Flur.',
        ],
        act: [
          'Halte den 1F-Flur und die Wine-Eingänge.',
          'Panel-Bruch melden; dann Innenwinkel (Treppe) einnehmen.',
          'Retake: Panel an die Tür des Defusers.',
        ],
        m: [
          ['1F', 62, 58, 'position', 'Castle – Flur'],
          ['1F', 61, 62, 'gadget', 'Armor Panel – Wine-Tür'],
          ['1F', 67, 42, 'gadget', 'Armor Panel – Küchenfenster'],
          ['1F', 58, 60, 'gadget', 'Bulletproof Camera – Flur'],
        ],
      },
    ],
    subs: [
      { op: 'echo', for: 'mira', role: 'Anchor', reason: 'Yokai-Drohnen ersetzen den Mirror-Intel und können den Plant aktiv schocken.', takes: ['Wine-Anker', 'Intel', 'Plant-Denial'], change: 'Yokai in Treppe und Garage; kein Spiegel-Winkel.', weak: 'Weniger harter Sicht-Winkel, aber beweglicher.' },
      { op: 'mute', for: 'kaid', role: 'Support-Roamer', reason: 'Jammer schützen die Garage-Wand und blocken Drohnen im Flur.', takes: ['Anti-Breach', 'Flur-Kontrolle'], change: 'Zwei Jammer statt Claws.', weak: 'Muss näher an die Wand.' },
      { op: 'lesion', for: 'castle', role: 'Flex-Anchor', reason: 'Minen ersetzen Panel-Denial mit Intel und Verlangsamung.', takes: ['Anti-Entry', 'Frühwarnung'], change: 'Minen am Wine-Aufgang und Küchenfenster.', weak: 'Keine Panel-Barriere gegen Sledge.' },
      { op: 'alibi', for: 'valkyrie', role: 'Roamer', reason: 'Prismas übernehmen die Frühwarnung im 1F-Bereich.', takes: ['Roam-Intel', 'Flank-Watch'], change: 'Prismas in Küche und Dining.', weak: 'Keine feste Kamera für Anker.' },
      { op: 'bandit', for: 'mira', role: 'Anchor', reason: 'Bandit übernimmt Anti-Breach und verstärkt damit die Keller-Verteidigung.', takes: ['Anti-Breach', 'Anker'], change: 'Bandit-Trick an der Garage-Wand, Smoke bleibt im Snowmobile.', weak: 'Kein Spiegel-Intel, dafür stärkere Wand.' },
    ],
    def: {
      retake: [
        'Mira öffnet den Mirror auf den Defuser, Smoke wirft Gas.',
        'Kaid/Support erneuert Claw an der Tür, durch die Angreifer nachrücken.',
        'Roamer kommt über die 1F-Küche zurück und schneidet die Flank.',
      ],
      roam: [
        'Valkyrie hält Küche/Dining und bricht Vertikal-Druck.',
        'Kaid pendelt zwischen 1F-Flur und Keller.',
        'Kein Roamer geht in den Master-Bedroom – der Rückweg ist zu lang.',
      ],
    },
  },
  {
    id: 'chalet-bar-def-standard',
    map: 'chalet', site: 'bar', side: 'defense', style: 'standard',
    name: 'Bar – Fensterfront mit Garage-Utility',
    summary:
      'Bar/Gaming wird über zwei Anker gehalten: einer am Bar-Fenster, einer am Gaming-Room-Eingang. Castle schließt ' +
      'die Fensterfront, Kaid sichert die Außenwand, ein Roamer hält die 1F-Küche gegen den Vertikal-Push.',
    confidence: 'eigene-analyse',
    ratings: {
      c: 4, d: 'mittel', u: 'hoch', k: 'hoch',
      s: ['Bar ist schwer zu betreten, wenn Fenster zu sind', 'Gute Rotationen über Great Room'],
      w: ['Vertikal anfällig von 2F-Bedroom', 'Viele Außenwinkel zum Campfire'],
    },
    players: [
      {
        op: 'smoke', role: 'Anchor', task: 'Bar-Anker',
        why: 'Smoke hält das Bar-Fenster und den Gaming-Eingang mit Gas und Stacheldraht.',
        ab: 'Remote-Gas Gaming-Eingang',
        load: L('FMG-9', 'M590A1', 'Barbed Wire'),
        obj: ['anchor', 'plantDenial', 'antiEntry'],
        prep: [
          'Verstärke die Wand Bar ↔ Great Room und die Bar-Außenwand.',
          'Stacheldraht an den Gaming-Eingang und vor das Fenster.',
        ],
        act: [
          'Halte den Winkel vom Bar-Tresen auf die Fenster.',
          'Rauch, wenn Fenster oder Gaming-Tür aufgeht.',
          'Melde Vertikal-Geräusche über Dir (2F-Bedroom).',
          'Retake: Rauch auf den Plant, dann über Great Room nachrücken.',
        ],
        m: [
          ['1F', 47, 66, 'position', 'Smoke – Bar'],
          ['1F', 51, 63, 'angle', 'Winkel Gaming-Eingang'],
          ['1F', 47, 70, 'gadget', 'Stacheldraht – Fenster'],
        ],
      },
      {
        op: 'castle', role: 'Flex-Anchor', task: 'Gaming-Flex & Fenster-Panel',
        why: 'Castle schließt zwei Fenster der Bar-Front, die sonst direkt einsehbar sind.',
        ab: 'Armor Panels Bar-Fenster + Gaming-Room',
        load: L('UMP45', 'M1014', 'Bulletproof Camera'),
        obj: ['support', 'antiEntry', 'anchor'],
        prep: [
          'Panels an das Hauptbar-Fenster und die Gaming-Room-Tür.',
          'Verstärke die Gaming-Außenwand.',
          'Kamera in den Great Room werfen.',
        ],
        act: [
          'Halte Gaming und den Weg in die Bar.',
          'Panel-Bruch ansagen, dann Bar-Tür als Winkel nutzen.',
          'Retake: Panel in die Tür setzen, die von Angreifern gehalten wird.',
        ],
        m: [
          ['1F', 55, 60, 'position', 'Castle – Gaming'],
          ['1F', 57, 64, 'gadget', 'Armor Panel – Gaming-Tür'],
          ['1F', 45, 62, 'gadget', 'Armor Panel – Bar-Fenster'],
          ['1F', 50, 68, 'gadget', 'Bulletproof Camera – Great Room'],
        ],
      },
      {
        op: 'kaid', role: 'Support-Roamer', task: 'Anti-Breach Bar-Außenwand',
        why: 'Die Bar-Außenwand ist die wahrscheinlichste Hard-Breach-Wand – Kaid hält sie mit Claws.',
        ab: 'Electroclaw Bar-Außenwand + Garage-Hatch',
        load: L('AUG A3', 'TCSG12', 'Barbed Wire'),
        obj: ['support', 'breach', 'utility'],
        prep: [
          'Verstärke Bar-Außenwand und Hatch.',
          'Claw an die Außenwand, zweite an das Garage-Hatch im Keller.',
        ],
        act: [
          'Halte den Great Room als Verbindung.',
          'Melde Thermite/Hibana und erneuere die Claw.',
          'Retake: Claw an die Tür setzen.',
        ],
        m: [
          ['1F', 62, 58, 'position', 'Kaid – Great Room'],
          ['1F', 47, 60, 'gadget', 'Electroclaw – Bar-Wand'],
          ['B', 56, 82, 'gadget', 'Electroclaw – Garage-Hatch'],
        ],
      },
      {
        op: 'valkyrie', role: 'Roamer', task: '2F-Bedroom- & Trophy-Intel',
        why: 'Valkyrie-Kameras überwachen den vertikalen Push aus dem 2F-Bedroom und die Küche.',
        ab: 'Black Eyes 2F-Bedroom / Küche / Campfire',
        load: L('MPX', 'SPAS-12', 'Nitro Cell'),
        obj: ['roam', 'intel', 'flankWatch'],
        prep: [
          'Kamera in den 2F-Bedroom (Boden), Kamera in die Küche, Kamera zum Campfire.',
          'Nitro an die Bedroom-Tür.',
        ],
        act: [
          'Starte im 2F-Bedroom, beobachte das Aufbrechen der Decke über der Bar.',
          'Bei Vertikal-Push: Nitro werfen und mit Ansage zurückziehen.',
          'Rückzug über die 2F-Treppe → Great Room.',
          'Ab 1:00 an der Site.',
        ],
        m: [
          ['2F', 56, 52, 'position', 'Valkyrie – Bedroom'],
          ['2F', 58, 48, 'gadget', 'Black Eye – Bedroom'],
          ['1F', 64, 45, 'gadget', 'Black Eye – Küche'],
          ['2F', 52, 50, 'gadget', 'Nitro – Bedroom-Tür'],
        ],
      },
      {
        op: 'aruni', role: 'Support-Roamer', task: 'Main-Entrance-Denial',
        why: 'Aruni-Gates sperren den Main Entrance und die Master-Hall-Tür, ohne dass jemand dort warten muss.',
        ab: 'Surya-Gates Main Entrance + Keller-Aufgang',
        load: L('P10 RONI', 'Mk 14 EBR', 'Barbed Wire'),
        obj: ['antiEntry', 'flankWatch', 'utility'],
        prep: [
          'Gate an den Main Entrance, Gate an den Keller-Aufgang.',
          'Stacheldraht dahinter.',
        ],
        act: [
          'Halte kurz den Main Entrance, dann rotiere in den Great Room.',
          'Gate-Bruch melden.',
          'Retake: Gate erneuern.',
        ],
        m: [
          ['1F', 52, 78, 'position', 'Aruni – Main Entrance'],
          ['1F', 52, 82, 'gadget', 'Surya-Gate – Main Entrance'],
          ['B', 55, 60, 'gadget', 'Surya-Gate – Keller-Aufgang'],
        ],
      },
    ],
    subs: [
      { op: 'mira', for: 'smoke', role: 'Anchor', reason: 'Mira gibt Intel auf Gaming statt Rauch-Denial.', takes: ['Anker', 'Intel'], change: 'Mirror Bar ↔ Gaming.', weak: 'Weniger aktive Plant-Verzögerung.' },
      { op: 'mute', for: 'kaid', role: 'Support-Roamer', reason: 'Jammer blocken Breach an der Bar-Wand und Drohnen im Great Room.', takes: ['Anti-Breach', 'Intel-Denial'], change: 'Zwei Jammer.', weak: 'Kurze Reichweite.' },
      { op: 'melusi', for: 'aruni', role: 'Support-Roamer', reason: 'Banshees behindern Main Entrance und Keller-Aufgang.', takes: ['Anti-Entry', 'Frühwarnung'], change: 'Banshees statt Gates.', weak: 'Kein harter Block.' },
      { op: 'lesion', for: 'castle', role: 'Flex-Anchor', reason: 'Minen übernehmen Entry-Denial mit Intel.', takes: ['Anti-Entry', 'Frühwarnung'], change: 'Minen an Fenster und Gaming-Tür.', weak: 'Panels fehlen gegen Fenster-Push.' },
      { op: 'ela', for: 'valkyrie', role: 'Roamer', reason: 'Ela hält 2F-Bedroom mit Grzmot-Minen und ist mobiler als Kamera-Roam.', takes: ['Roam', 'Vertikal-Denial'], change: 'Minen im Bedroom und in der Küche.', weak: 'Weniger Team-Intel.' },
    ],
    def: {
      retake: [
        'Smoke wirft Gas auf den Plant, Castle schließt den Zugang, Kaid sichert die Wand.',
        'Valkyrie liest die Position des Defusers.',
      ],
      roam: [
        'Valkyrie hält 2F-Bedroom gegen Vertikal.',
        'Aruni pendelt zwischen Main Entrance und Great Room.',
      ],
    },
  },

  /* ======================================================= CLUBHOUSE */
  {
    id: 'clubhouse-church-def-standard',
    map: 'clubhouse', site: 'church', side: 'defense', style: 'standard',
    name: 'Church – Arsenal-Bunker (Profi-Standard)',
    summary:
      'Die etablierteste Keller-Site im Spiel: Mira-Spiegel auf die Keller-Treppe, Smoke im Church, Kaid an der ' +
      'Arsenal-Wand, Castle schließt den Garage-Einstieg. Roamer halten Bar/Stock und Blue Stairs.',
    confidence: 'verifiziert',
    ratings: {
      c: 5, d: 'mittel', u: 'hoch', k: 'hoch',
      s: ['Bestes Anker-Setup im Spiel', 'Sehr sichere Rotationen', 'Kaum Fenster-Druck möglich'],
      w: ['Vertikal-Push über 1F-Bar gefährlich', 'Blue Stairs ist der kritische Weg'],
    },
    players: [
      {
        op: 'mira', role: 'Anchor', task: 'Church-Anker & Treppen-Mirror',
        why: 'Der Mirror auf die Blue-Stairs-/Kellertreppe ist auf dieser Site der wichtigste Intel-Winkel.',
        ab: 'Black-Mirror Church ↔ Treppe',
        load: L('Vector .45 ACP', 'ITA12S', 'Nitro Cell'),
        obj: ['anchor', 'intel', 'plantDenial'],
        prep: [
          'Verstärke die Wand Church ↔ Arsenal und die Haupttreppenwand.',
          'Mirror in die Wand zum Treppenhaus (Blue Stairs).',
          'Nitro in den Church-Gang legen.',
          'Lass die Innenwand zu Arsenal offen (Rotation).',
        ],
        act: [
          'Halte den Mirrorwinkel und den Church-Eingang.',
          'Melde jede Bewegung im Treppenhaus sofort.',
          'Retake: Nitro auf den Defuser, Mirror aufreißen.',
        ],
        m: [
          ['B', 55, 27, 'position', 'Mira – Church'],
          ['B', 58, 32, 'gadget', 'Black-Mirror – Blue Stairs'],
          ['B', 52, 33, 'gadget', 'Nitro – Church-Gang'],
        ],
      },
      {
        op: 'smoke', role: 'Anchor', task: 'Arsenal-Anker',
        why: 'Smoke hält Arsenal und wirft Gas in den Gang, wenn der Plant gesetzt wird.',
        ab: 'Remote-Gas Arsenal-Eingang',
        load: L('FMG-9', 'M590A1', 'Barbed Wire'),
        obj: ['anchor', 'plantDenial', 'antiEntry'],
        prep: [
          'Verstärke Arsenal-Seitenwand und Dach-Hatch-Zugang.',
          'Stacheldraht in den Arsenal-Gang.',
        ],
        act: [
          'Halte den Arsenal-Gangwinkel zum Keller.',
          'Gas beim Plant oder wenn die Garage geöffnet wird.',
          'Retake: Gas auf den Defuser.',
        ],
        m: [
          ['B', 62, 31, 'position', 'Smoke – Arsenal'],
          ['B', 60, 36, 'angle', 'Gangwinkel'],
          ['B', 64, 35, 'gadget', 'Stacheldraht – Gang'],
        ],
      },
      {
        op: 'kaid', role: 'Support-Roamer', task: 'Anti-Breach Arsenal-Wand & Garage',
        why: 'Kaid hält die Claws an der Arsenal-Außenwand und am Garage-Hatch – die zwei Breach-Punkte.',
        ab: 'Electroclaws Arsenal-Wand + Garage-Hatch',
        load: L('AUG A3', 'TCSG12', 'Barbed Wire'),
        obj: ['support', 'breach', 'utility'],
        prep: [
          'Verstärke Arsenal-Außenwand und Garage-Hatch.',
          'Claw 1 an die Außenwand, Claw 2 an das Hatch.',
        ],
        act: [
          'Halte den Keller-Gang und die Garage.',
          'Breach-Versuche ansagen, Claw erneuern.',
          'Retake: Claw an die Tür setzen, durch die Angreifer nachrücken.',
        ],
        m: [
          ['B', 66, 40, 'position', 'Kaid – Gang'],
          ['B', 67, 36, 'gadget', 'Electroclaw – Arsenal-Wand'],
          ['1F', 46, 64, 'gadget', 'Electroclaw – Garage-Hatch'],
        ],
      },
      {
        op: 'castle', role: 'Flex-Anchor', task: 'Garage-Einstieg & 1F-Panel',
        why: 'Castle schließt den Garage-Einstieg und die Bar-Tür, was den schnellsten Weg in den Keller blockiert.',
        ab: 'Armor Panels Garage + Bar-Tür',
        load: L('UMP45', 'M1014', 'Bulletproof Camera'),
        obj: ['support', 'antiEntry', 'anchor'],
        prep: [
          'Panel an die Garage und an die Bar-Tür zum 1F.',
          'Kamera in den Main Lobby werfen.',
        ],
        act: [
          'Halte die Garage und den 1F-Aufgang zur Bar.',
          'Panel-Bruch melden.',
          'Retake: Panel erneut in die Garage setzen.',
        ],
        m: [
          ['1F', 46, 64, 'position', 'Castle – Garage'],
          ['1F', 44, 68, 'gadget', 'Armor Panel – Garage'],
          ['1F', 43, 60, 'gadget', 'Armor Panel – Bar-Tür'],
          ['1F', 48, 60, 'gadget', 'Bulletproof Camera – Lobby'],
        ],
      },
      {
        op: 'valkyrie', role: 'Roamer', task: 'Bar/Stock-Roam & Blue Stairs-Watch',
        why: 'Valkyrie überwacht mit Kameras Stock/Bar und die Blue Stairs, den kritischen Weg in den Keller.',
        ab: 'Black Eyes Bar / Blue Stairs / Lobby',
        load: L('MPX', 'SPAS-12', 'Nitro Cell'),
        obj: ['roam', 'intel', 'flankWatch'],
        prep: [
          'Kamera in den Stock Room, Kamera an die Blue Stairs, Kamera in die Main Lobby.',
          'Nitro an den Bar-Eingang legen.',
        ],
        act: [
          'Starte im Stock Room, halte Bar und Treppe im Blick.',
          'Ruf Blue-Stairs-Bewegung sofort ans Team.',
          'Rückzug über Bar → Keller.',
          'Ab 1:10 an der Site.',
        ],
        m: [
          ['1F', 51, 36, 'position', 'Valkyrie – Stock'],
          ['1F', 47, 40, 'gadget', 'Black Eye – Bar'],
          ['B', 60, 46, 'gadget', 'Black Eye – Blue Stairs'],
          ['1F', 55, 60, 'gadget', 'Black Eye – Lobby'],
          ['1F', 51, 44, 'rotation', 'Rückzug Stock → Keller', 55, 44],
        ],
      },
    ],
    subs: [
      { op: 'echo', for: 'mira', role: 'Anchor', reason: 'Yokai liefert Treppen-Intel und Plant-Denial statt Mirror.', takes: ['Anker', 'Intel', 'Plant-Denial'], change: 'Yokai im Treppenhaus und Arsenal.', weak: 'Kein Sicht-Winkel.' },
      { op: 'mute', for: 'kaid', role: 'Support-Roamer', reason: 'Jammer schützen Arsenal-Wand und blocken Drohnen.', takes: ['Anti-Breach', 'Intel-Denial'], change: 'Zwei Jammer, Garage bleibt Kaid-Aufgabe.', weak: 'Muss näher an die Wand.' },
      { op: 'maestro', for: 'smoke', role: 'Anchor', reason: 'Evil Eyes decken Gang und Garage mit Laser-Denial.', takes: ['Anker', 'Intel', 'Denial'], change: 'Laser statt Gas.', weak: 'Weniger harter Plant-Stopp.' },
      { op: 'lesion', for: 'castle', role: 'Flex-Anchor', reason: 'Minen übernehmen Garage- und Tür-Denial.', takes: ['Anti-Entry', 'Frühwarnung'], change: 'Minen an Garage und Bar.', weak: 'Keine Barriere gegen schnellen Push.' },
      { op: 'alibi', for: 'valkyrie', role: 'Roamer', reason: 'Prismas im Stock/Bar erzeugen Bait-Intel.', takes: ['Roam-Intel'], change: 'Prismas statt Kameras.', weak: 'Weniger Team-Intel, nur lokale Sicht.' },
    ],
    def: {
      retake: [
        'Mira öffnet den Treppen-Mirror, Smoke wirft Gas auf den Defuser.',
        'Kaid/Support hält die Tür, durch die Roter nachrücken will.',
        'Castle setzt ein Panel an die Garage, wenn der Retake läuft.',
      ],
      roam: [
        'Valkyrie hält Stock/Bar und schaut auf Blue Stairs.',
        'Castle pendelt zwischen Garage und Bar.',
      ],
    },
  },
  {
    id: 'clubhouse-gym-def-standard',
    map: 'clubhouse', site: 'gym', side: 'defense', style: 'standard',
    name: 'Gym – 2F-Anker mit Dachkontrolle',
    summary:
      'Gym/Bedroom wird mit zwei Ankern und Castle-Fenstern gehalten. Echo-Drohnen decken Dach und Skylight, ' +
      'ein Roamer hält Construction und den 2F-Flur gegen den Push über das Hauptdach.',
    confidence: 'verifiziert',
    ratings: {
      c: 5, d: 'mittel', u: 'hoch', k: 'hoch',
      s: ['Klassische 2F-Site mit starken Winkeln', 'Dach nur über wenige Hatches betretbar'],
      w: ['Fensterfront zum Construction-Roof', 'Skylight-Push schwer zu verteidigen'],
    },
    players: [
      {
        op: 'mira', role: 'Anchor', task: 'Gym-Anker & Mirror auf Dach',
        why: 'Der Mirror zeigt den Dach-Push über das Construction-Roof, ohne dass Mira das Fenster öffnen muss.',
        ab: 'Black-Mirror Gym ↔ Bedroom',
        load: L('Vector .45 ACP', 'ITA12S', 'Nitro Cell'),
        obj: ['anchor', 'intel', 'plantDenial'],
        prep: [
          'Verstärke die Gym-Außenwand und die Wand zum 2F-Flur.',
          'Mirror in die Wand Gym ↔ Bedroom.',
          'Nitro unter das Skylight legen.',
        ],
        act: [
          'Halte den Mirrorwinkel, öffne erst bei Kontakt.',
          'Melde Dach-Geräusche sofort.',
          'Retake: Nitro auf den Defuser.',
        ],
        m: [
          ['2F', 52, 32, 'position', 'Mira – Gym'],
          ['2F', 48, 30, 'gadget', 'Black-Mirror – Gym/Bedroom'],
          ['2F', 56, 42, 'gadget', 'Nitro – Skylight'],
        ],
      },
      {
        op: 'castle', role: 'Flex-Anchor', task: 'Bedroom-Flex & Fenster-Panel',
        why: 'Castle schließt das Gym-Fenster und die Bedroom-Tür zur Dachseite.',
        ab: 'Armor Panels Gym-Fenster + Bedroom',
        load: L('UMP45', 'M1014', 'Bulletproof Camera'),
        obj: ['support', 'antiEntry', 'anchor'],
        prep: [
          'Panels an das Gym-Fenster und die Bedroom-Tür.',
          'Verstärke die Bedroom-Außenwand.',
          'Kamera in den 2F-Flur werfen.',
        ],
        act: [
          'Halte Bedroom und den Flur.',
          'Panel-Bruch ansagen, dann Innenwinkel.',
          'Retake: Panel an die Tür des Defusers.',
        ],
        m: [
          ['2F', 45, 27, 'position', 'Castle – Bedroom'],
          ['2F', 49, 24, 'gadget', 'Armor Panel – Gym-Fenster'],
          ['2F', 43, 30, 'gadget', 'Armor Panel – Bedroom'],
          ['2F', 50, 36, 'gadget', 'Bulletproof Camera – Flur'],
        ],
      },
      {
        op: 'echo', role: 'Support-Roamer', task: 'Skylight- & Dach-Intel',
        why: 'Yokai-Drohnen decken Skylight und Dach; Echo kann Plant-Versuche auf dem Dach verzögern.',
        ab: 'Yokai Skylight + Construction Roof',
        load: L('MP5SD', 'SuperNova', 'Deployable Shield'),
        obj: ['support', 'intel', 'plantDenial'],
        prep: [
          'Yokai 1 unter das Skylight hängen, Yokai 2 an die Construction-Roof-Tür.',
          'Shield an die Gym-Tür stellen.',
        ],
        act: [
          'Lese die Drohnen abwechselnd, sag jede Bewegung an.',
          'Schock nur beim Defuser, nicht bei bloßer Bewegung.',
          'Retake: Yokai aus der Deckung weiter nutzen.',
        ],
        m: [
          ['2F', 56, 42, 'gadget', 'Yokai – Skylight'],
          ['2F', 42, 55, 'gadget', 'Yokai – Construction Roof'],
          ['2F', 53, 34, 'gadget', 'Deployable Shield – Gym'],
          ['2F', 58, 38, 'position', 'Echo – Flur'],
        ],
      },
      {
        op: 'valkyrie', role: 'Roamer', task: 'Construction-Roam & Dachkante',
        why: 'Valkyrie liest den Dach-Push über Kameras an Construction und Skylight.',
        ab: 'Black Eyes Construction / Skylight / Lobby',
        load: L('MPX', 'SPAS-12', 'Nitro Cell'),
        obj: ['roam', 'intel', 'flankWatch'],
        prep: [
          'Kamera an Construction, Kamera an das Skylight, Kamera an die Main Lobby.',
          'Nitro an die Construction-Tür.',
        ],
        act: [
          'Starte an Construction, halte die Dachkante im Blick.',
          'Ruf an, wenn jemand über das Dach läuft oder ein Hatch aufgeht.',
          'Rückzug über den 2F-Flur.',
          'Ab 1:00 an der Site.',
        ],
        m: [
          ['2F', 42, 55, 'position', 'Valkyrie – Construction'],
          ['2F', 40, 58, 'gadget', 'Black Eye – Construction'],
          ['2F', 58, 45, 'gadget', 'Nitro – Skylight'],
          ['1F', 55, 60, 'gadget', 'Black Eye – Lobby'],
          ['2F', 46, 50, 'rotation', 'Rückzug → Flur', 51, 40],
        ],
      },
      {
        op: 'kaid', role: 'Support-Roamer', task: 'Anti-Breach Gym-Außenwand',
        why: 'Kaid verhindert den Hard Breach an der Gym-Außenwand zum Construction-Roof.',
        ab: 'Electroclaw Gym-Außenwand + Hatch',
        load: L('AUG A3', 'TCSG12', 'Barbed Wire'),
        obj: ['support', 'breach', 'utility'],
        prep: [
          'Verstärke die Gym-Außenwand und das Flur-Hatch.',
          'Claw an die Außenwand, zweite an das Hatch.',
        ],
        act: [
          'Halte den 2F-Flur zwischen Gym und Bedroom.',
          'Breach-Picks melden.',
          'Retake: Claw an die Hatch-Tür.',
        ],
        m: [
          ['2F', 49, 38, 'position', 'Kaid – Flur'],
          ['2F', 56, 30, 'gadget', 'Electroclaw – Gym-Wand'],
          ['2F', 52, 44, 'gadget', 'Electroclaw – Hatch'],
        ],
      },
    ],
    subs: [
      { op: 'smoke', for: 'mira', role: 'Anchor', reason: 'Gas hält das Gym-Fenster zu und stoppt Plants.', takes: ['Anker', 'Denial'], change: 'Gas an Fenster und Skylight-Zugang.', weak: 'Kein Intel.' },
      { op: 'mute', for: 'kaid', role: 'Support-Roamer', reason: 'Jammer blocken Breach und Drohnen im Flur.', takes: ['Anti-Breach', 'Intel-Denial'], change: 'Jammer an Gym-Wand und Flur.', weak: 'Kurze Reichweite.' },
      { op: 'alibi', for: 'valkyrie', role: 'Roamer', reason: 'Prismas decken die Dachkante und den Flur.', takes: ['Roam-Intel'], change: 'Prismas statt Kameras.', weak: 'Nur lokale Intel.' },
      { op: 'aruni', for: 'castle', role: 'Flex-Anchor', reason: 'Gates sperren Flur und Fensterzugang.', takes: ['Anti-Entry', 'Support'], change: 'Gates statt Panels.', weak: 'Kein Fenster-Verschluss.' },
      { op: 'maestro', for: 'echo', role: 'Support-Roamer', reason: 'Evil Eyes überwachen Skylight dauerhaft.', takes: ['Intel', 'Denial'], change: 'Zwei Evil Eyes an Skylight und Flur.', weak: 'Kein Schock-Stopp beim Plant.' },
    ],
    def: {
      retake: [
        'Mira liefert Mirror-Intel nach dem Plant, Smoke/Gas stoppt den Defuser.',
        'Castle setzt ein Panel an die Skylight-Tür.',
      ],
      roam: [
        'Valkyrie hält Construction und die Dachkante.',
        'Kaid bleibt im Flur.',
      ],
    },
  },

  /* ======================================================== COASTLINE */
  {
    id: 'coastline-hookah-def-standard',
    map: 'coastline', site: 'hookah', side: 'defense', style: 'standard',
    name: 'Hookah – Fenster-Bunker mit Courtyard-Roam',
    summary:
      'Hookah/Billiards wird über zwei Anker gehalten, die Fensterfront zum Courtyard per Castle-Panel geschlossen. ' +
      'Der Roamer hält Courtyard und Blue Bar, ein Support sichert Blue-Bar-Rotation und Fenster-Denial.',
    confidence: 'eigene-analyse',
    ratings: {
      c: 4, d: 'mittel', u: 'mittel', k: 'mittel',
      s: ['Sehr viele Fensterwinkel für den Verteidiger', 'Schnelle Rotation via Courtyard'],
      w: ['Angreifer können breit aufstellen', 'Panel-Verbrauch hoch'],
    },
    players: [
      {
        op: 'mira', role: 'Anchor', task: 'Hookah-Anker & Courtyard-Mirror',
        why: 'Der Mirror zeigt den Courtyard-Push und die Fenster, ohne dass Mira exponiert steht.',
        ab: 'Black-Mirror Hookah ↔ Billiards',
        load: L('Vector .45 ACP', 'ITA12S', 'Nitro Cell'),
        obj: ['anchor', 'intel', 'plantDenial'],
        prep: [
          'Verstärke die Courtyard-Wand und die Wand zur Billiards.',
          'Mirror in die Wand Hookah → Courtyard.',
          'Nitro vor das Hauptfenster legen.',
        ],
        act: [
          'Halte den Mirrorwinkel und den Billiards-Eingang.',
          'Melde jeden Fensterbruch.',
          'Retake: Nitro auf den Defuser.',
        ],
        m: [
          ['2F', 27, 42, 'position', 'Mira – Hookah'],
          ['2F', 29, 46, 'gadget', 'Black-Mirror – Courtyard'],
          ['2F', 31, 40, 'gadget', 'Nitro – Hauptfenster'],
        ],
      },
      {
        op: 'castle', role: 'Flex-Anchor', task: 'Billiards-Flex & Fenster-Panels',
        why: 'Castle schließt zwei Fenster der Hookah-Front und die Billiards-Tür.',
        ab: 'Armor Panels Hookah-Fenster + Billiards',
        load: L('UMP45', 'M1014', 'Bulletproof Camera'),
        obj: ['support', 'antiEntry', 'anchor'],
        prep: [
          'Panels an das östliche Hookah-Fenster und die Billiards-Tür.',
          'Verstärke die Billiards-Außenwand.',
          'Kamera in den 2F-Flur werfen.',
        ],
        act: [
          'Halte Billiards und den Flur.',
          'Panel-Bruch melden.',
          'Retake: Panel in die Tür setzen, durch die Angreifer kämen.',
        ],
        m: [
          ['2F', 35, 47, 'position', 'Castle – Billiards'],
          ['2F', 33, 43, 'gadget', 'Armor Panel – Fenster'],
          ['2F', 37, 45, 'gadget', 'Armor Panel – Billiards'],
          ['2F', 40, 45, 'gadget', 'Bulletproof Camera – Flur'],
        ],
      },
      {
        op: 'valkyrie', role: 'Roamer', task: 'Courtyard- & Blue-Bar-Roam',
        why: 'Valkyrie liefert mit Kameras Frühwarnung im Courtyard und an der Blue Bar.',
        ab: 'Black Eyes Courtyard / Blue Bar / Lobby',
        load: L('MPX', 'SPAS-12', 'Nitro Cell'),
        obj: ['roam', 'intel', 'flankWatch'],
        prep: [
          'Kamera in den Courtyard, Kamera an die Blue Bar, Kamera in die Lobby.',
          'Nitro an die Courtyard-Tür.',
        ],
        act: [
          'Starte im Courtyard, halte die Fensterfront im Blick.',
          'Ruf an, wenn Fenster aufgehen.',
          'Rückzug über die Blue Bar → Lobby.',
          'Ab 1:10 an der Site.',
        ],
        m: [
          ['1F', 29, 56, 'position', 'Valkyrie – Courtyard'],
          ['1F', 25, 50, 'gadget', 'Black Eye – Courtyard'],
          ['1F', 25, 30, 'gadget', 'Black Eye – Blue Bar'],
          ['2F', 28, 50, 'gadget', 'Nitro – Courtyard-Tür'],
          ['1F', 33, 45, 'rotation', 'Rückzug Blue Bar → Lobby', 36, 45],
        ],
      },
      {
        op: 'aruni', role: 'Support-Roamer', task: 'Blue-Bar-Denial & Flank',
        why: 'Aruni-Gates sperren die Blue Bar und den Kitchen-Zugang.',
        ab: 'Surya-Gates Blue Bar + Kitchen',
        load: L('P10 RONI', 'Mk 14 EBR', 'Barbed Wire'),
        obj: ['antiEntry', 'flankWatch', 'utility'],
        prep: [
          'Gate an die Blue Bar, Gate an den Kitchen-Zugang.',
          'Stacheldraht davor.',
        ],
        act: [
          'Halte die Blue Bar kurz, dann rotiere in den Flur.',
          'Gate-Bruch melden.',
          'Retake: Gate erneuern.',
        ],
        m: [
          ['1F', 25, 30, 'position', 'Aruni – Blue Bar'],
          ['1F', 23, 34, 'gadget', 'Surya-Gate – Blue Bar'],
          ['1F', 46, 30, 'gadget', 'Surya-Gate – Kitchen'],
        ],
      },
      {
        op: 'ela', role: 'Deep-Roamer', task: 'Kitchen- & Sunrise-Bar-Druck',
        why: 'Ela-Minen verzögern den Push über Kitchen und die Sunrise Bar, und Ela kann aggressiv rotieren.',
        ab: 'Grzmot-Minen Kitchen + Sunrise Bar',
        load: L('Scorpion EVO 3 A1', 'FO-12', 'Barbed Wire'),
        obj: ['roam', 'antiEntry', 'flankWatch'],
        prep: [
          'Minen in die Kitchen-Tür und an die Sunrise Bar.',
          'Stacheldraht in den Flur.',
        ],
        act: [
          'Starte in der Kitchen, halte 40 s Kontakt.',
          'Bei Minenauslösung Position ansagen und sofort rotieren.',
          'Rückzug über den 1F-Flur zur Hookah-Treppe.',
          'Ab 1:00 an der Site.',
        ],
        m: [
          ['1F', 44, 25, 'position', 'Ela – Kitchen'],
          ['1F', 46, 29, 'gadget', 'Grzmot – Kitchen'],
          ['1F', 33, 26, 'gadget', 'Grzmot – Sunrise'],
          ['2F', 28, 45, 'rotation', 'Rückzug → Hookah', 29, 47],
        ],
      },
    ],
    subs: [
      { op: 'smoke', for: 'mira', role: 'Anchor', reason: 'Gas stoppt Courtyard-Fenster-Push und Plants.', takes: ['Anker', 'Denial'], change: 'Gas an Fenster und Billiards-Eingang.', weak: 'Kein Mirror-Intel.' },
      { op: 'lesion', for: 'aruni', role: 'Support-Roamer', reason: 'Minen liefern Verlangsamung + Intel an Blue Bar und Kitchen.', takes: ['Anti-Entry', 'Frühwarnung'], change: 'Minen statt Gates.', weak: 'Kein harter Block.' },
      { op: 'alibi', for: 'valkyrie', role: 'Roamer', reason: 'Prismas arbeiten im Courtyard als Bait.', takes: ['Roam-Intel'], change: 'Prismas statt Kameras.', weak: 'Nur lokale Intel.' },
      { op: 'kaid', for: 'castle', role: 'Flex-Anchor', reason: 'Claws sichern die Billiards-Außenwand gegen Hard Breach.', takes: ['Anti-Breach', 'Anker'], change: 'Claws statt Panels.', weak: 'Fenster bleiben offen.' },
      { op: 'fenrir', for: 'ela', role: 'Deep-Roamer', reason: 'Gasminen halten Kitchen und Sunrise Bar ohne Kontakt.', takes: ['Entry-Denial', 'Frühwarnung'], change: 'F-NATT in Kitchen/Sunrise.', weak: 'Weniger Mobilität.' },
    ],
    def: {
      retake: [
        'Mira/Castle halten die Hookah-Tür, Smoke/Gas stoppt den Defuser.',
        'Valkyrie liefert Position und Flank-Info.',
      ],
      roam: [
        'Valkyrie spielt Courtyard → Blue Bar.',
        'Ela spielt Kitchen → Sunrise Bar, bricht bei Kontakt sofort ab.',
      ],
    },
  },
  {
    id: 'coastline-bluebar-def-standard',
    map: 'coastline', site: 'blue-bar', side: 'defense', style: 'standard',
    name: 'Blue Bar – 1F-Bunker mit Kitchen-Rotation',
    summary:
      'Blue Bar/Sunrise Bar wird als 1F-Bunker gehalten; die Kitchen-Rotation ist der Schlüssel. Zwei Anker, ' +
      'Castle-Fenster, ein Roamer im Courtyard und ein Support an der Kitchen-Tür.',
    confidence: 'eigene-analyse',
    ratings: {
      c: 4, d: 'mittel', u: 'mittel', k: 'mittel',
      s: ['Kurze Wege innerhalb der Site', 'Kitchen-Rotation erlaubt Retake aus zwei Richtungen'],
      w: ['Viele Fenster zur Poolseite', 'Angreifer können Kitchen früh einnehmen'],
    },
    players: [
      {
        op: 'smoke', role: 'Anchor', task: 'Blue-Bar-Anker',
        why: 'Smoke hält die Bar-Tür und die Poolseite mit Gas.',
        ab: 'Remote-Gas Bar-Tür + Pool-Fenster',
        load: L('FMG-9', 'M590A1', 'Barbed Wire'),
        obj: ['anchor', 'plantDenial', 'antiEntry'],
        prep: [
          'Verstärke die Wand Blue Bar ↔ Kitchen und die Poolseite.',
          'Stacheldraht in die Bar-Tür.',
        ],
        act: [
          'Halte den Tresenwinkel auf die Fenster.',
          'Gas bei Fensterbruch oder Plant.',
          'Retake: Gas auf den Defuser.',
        ],
        m: [
          ['1F', 25, 30, 'position', 'Smoke – Blue Bar'],
          ['1F', 27, 34, 'angle', 'Tresenwinkel'],
          ['1F', 23, 33, 'gadget', 'Stacheldraht – Bar-Tür'],
        ],
      },
      {
        op: 'castle', role: 'Flex-Anchor', task: 'Sunrise-Flex & Fenster-Panels',
        why: 'Castle schließt die Sunrise-Fenster und die Kitchen-Tür.',
        ab: 'Armor Panels Sunrise + Kitchen',
        load: L('UMP45', 'M1014', 'Bulletproof Camera'),
        obj: ['support', 'antiEntry', 'anchor'],
        prep: [
          'Panels an das Sunrise-Fenster und die Kitchen-Verbindung.',
          'Kamera in den Courtyard werfen.',
        ],
        act: [
          'Halte Sunrise und den Kitchen-Zugang.',
          'Panel-Bruch melden.',
          'Retake: Panel an die Tür des Defusers.',
        ],
        m: [
          ['1F', 33, 26, 'position', 'Castle – Sunrise'],
          ['1F', 36, 24, 'gadget', 'Armor Panel – Sunrise'],
          ['1F', 30, 26, 'gadget', 'Armor Panel – Kitchen'],
          ['1F', 32, 40, 'gadget', 'Bulletproof Camera – Courtyard'],
        ],
      },
      {
        op: 'mira', role: 'Support-Roamer', task: 'Kitchen-Intel & Mirror',
        why: 'Mira hält mit dem Mirror die Kitchen im Blick und kann flexibel zurückrotieren.',
        ab: 'Black-Mirror Kitchen ↔ Flur',
        load: L('Vector .45 ACP', 'ITA12S', 'Nitro Cell'),
        obj: ['support', 'intel', 'retake'],
        prep: [
          'Verstärke die Kitchen-Wand und setze den Mirror.',
          'Nitro an die Kitchen-Tür.',
        ],
        act: [
          'Halte die Kitchen, solange der Courtyard ruhig ist.',
          'Mirror-Intel an das Team weitergeben.',
          'Retake: Mirror aufreißen, Nitro werfen.',
        ],
        m: [
          ['1F', 44, 25, 'position', 'Mira – Kitchen'],
          ['1F', 42, 29, 'gadget', 'Black-Mirror – Kitchen'],
          ['1F', 46, 29, 'gadget', 'Nitro – Kitchen-Tür'],
        ],
      },
      {
        op: 'valkyrie', role: 'Roamer', task: 'Courtyard- & 2F-Watch',
        why: 'Valkyrie liest Courtyard und 2F-Flur, damit Blue Bar nicht von oben oder hinten überrascht wird.',
        ab: 'Black Eyes Courtyard / 2F-Flur / Pool',
        load: L('MPX', 'SPAS-12', 'Nitro Cell'),
        obj: ['roam', 'intel', 'flankWatch'],
        prep: [
          'Kamera in den Courtyard, Kamera in den 2F-Flur, Kamera an den Pool.',
        ],
        act: [
          'Starte im Courtyard, halte die Fensterfront.',
          'Ruf 2F-Bewegungen sofort durch.',
          'Rückzug über die Lobby.',
          'Ab 1:10 an der Site.',
        ],
        m: [
          ['1F', 29, 56, 'position', 'Valkyrie – Courtyard'],
          ['1F', 26, 52, 'gadget', 'Black Eye – Courtyard'],
          ['2F', 40, 45, 'gadget', 'Black Eye – 2F-Flur'],
          ['1F', 40, 40, 'rotation', 'Rückzug Lobby', 38, 45],
        ],
      },
      {
        op: 'kaid', role: 'Deep-Roamer', task: 'Kitchen-Außenwand & Pool-Denial',
        why: 'Kaid sichert die Kitchen-Außenwand und die Poolseite mit Claws.',
        ab: 'Electroclaw Kitchen-Wand + Pool',
        load: L('AUG A3', 'TCSG12', 'Barbed Wire'),
        obj: ['support', 'breach', 'utility'],
        prep: [
          'Verstärke die Kitchen-Außenwand, Claw daran.',
          'Stacheldraht an die Pool-Tür.',
        ],
        act: [
          'Halte die Poolseite und den Kitchen-Zugang.',
          'Breach-Picks ansagen.',
          'Retake: Claw an die Tür.',
        ],
        m: [
          ['1F', 50, 31, 'position', 'Kaid – Poolseite'],
          ['1F', 48, 27, 'gadget', 'Electroclaw – Kitchen-Wand'],
          ['1F', 52, 34, 'gadget', 'Stacheldraht – Pool'],
        ],
      },
    ],
    subs: [
      { op: 'aruni', for: 'castle', role: 'Flex-Anchor', reason: 'Gates sperren Sunrise und Kitchen ohne Panel-Verbrauch.', takes: ['Anti-Entry'], change: 'Gates statt Panels.', weak: 'Fenster bleiben offen.' },
      { op: 'echo', for: 'mira', role: 'Support-Roamer', reason: 'Yokai deckt Kitchen und Flur als bewegliche Intel-Quelle.', takes: ['Intel', 'Plant-Denial'], change: 'Yokai in Kitchen und Courtyard.', weak: 'Weniger harter Sicht-Winkel.' },
      { op: 'lesion', for: 'kaid', role: 'Deep-Roamer', reason: 'Minen geben Pool-Intel und verlangsamen.', takes: ['Frühwarnung', 'Denial'], change: 'Minen an Pool und Kitchen.', weak: 'Kein Anti-Breach.' },
      { op: 'alibi', for: 'valkyrie', role: 'Roamer', reason: 'Prismas übernehmen Courtyard-Bait.', takes: ['Roam-Intel'], change: 'Prismas statt Kameras.', weak: 'Nur lokale Intel.' },
      { op: 'mute', for: 'mira', role: 'Support-Roamer', reason: 'Jammer blocken Breach an der Kitchen-Wand.', takes: ['Anti-Breach', 'Intel-Denial'], change: 'Jammer statt Mirror.', weak: 'Kein Kitchen-Intel.' },
    ],
    def: {
      retake: [
        'Smoke/Kaid halten den Küchenzugang, Castle schließt ihn mit Panel.',
        'Mira öffnet Mirror-Intel, Roamer kommt über Courtyard.',
      ],
      roam: [
        'Valkyrie hält Courtyard und 2F-Flur.',
        'Kaid hält Poolseite, kein Deep-Roam über Kitchen hinaus.',
      ],
    },
  },

  /* ======================================================== CONSULATE */
  {
    id: 'consulate-cafeteria-def-standard',
    map: 'consulate', site: 'cafeteria', side: 'defense', style: 'standard',
    name: 'Cafeteria – Keller-Bunker mit Garage-Rotation',
    summary:
      'Die klassische Keller-Site: Mira im Cafeteria-Spiegel, Smoke im Garage-Zugang, Kaid auf der Außenwand, ' +
      'Castle schließt die Garage. Zwei Roamer halten Piano/Servers und die Treppe.',
    confidence: 'verifiziert',
    ratings: {
      c: 4, d: 'mittel', u: 'hoch', k: 'hoch',
      s: ['Starker Keller-Bunker', 'Garage-Rotation entlastet Anker'],
      w: ['Viele Wege in den Keller', 'Nach dem Rework offene Sichtlinien im 1F'],
    },
    players: [
      {
        op: 'mira', role: 'Anchor', task: 'Cafeteria-Anker & Garage-Mirror',
        why: 'Der Mirror zeigt die Garage, ohne dass Mira die Tür öffnen muss.',
        ab: 'Black-Mirror Cafeteria ↔ Garage',
        load: L('Vector .45 ACP', 'ITA12S', 'Nitro Cell'),
        obj: ['anchor', 'intel', 'plantDenial'],
        prep: [
          'Verstärke die Garage-Wand und die Treppenwand.',
          'Mirror in die Wand Cafeteria → Garage.',
          'Nitro in den Kellergang.',
        ],
        act: [
          'Halte den Mirror und den Gang.',
          'Melde Garage-Bewegungen.',
          'Retake: Nitro auf den Defuser.',
        ],
        m: [
          ['B', 58, 60, 'position', 'Mira – Cafeteria'],
          ['B', 61, 63, 'gadget', 'Black-Mirror – Garage'],
          ['B', 56, 65, 'gadget', 'Nitro – Gang'],
        ],
      },
      {
        op: 'smoke', role: 'Anchor', task: 'Garage-Anker',
        why: 'Smoke hält die Garage und stoppt Plants mit Gas.',
        ab: 'Remote-Gas Garage-Tür',
        load: L('FMG-9', 'M590A1', 'Barbed Wire'),
        obj: ['anchor', 'plantDenial', 'antiEntry'],
        prep: [
          'Verstärke die Garage-Wand und die Kellertreppe.',
          'Stacheldraht in die Garage.',
        ],
        act: [
          'Halte den Garagenwinkel.',
          'Gas bei Plant oder offener Tür.',
          'Retake: Gas auf den Defuser.',
        ],
        m: [
          ['B', 63, 63, 'position', 'Smoke – Garage'],
          ['B', 65, 66, 'gadget', 'Stacheldraht – Garage'],
        ],
      },
      {
        op: 'kaid', role: 'Support-Roamer', task: 'Anti-Breach Garage-Wand',
        why: 'Kaid sichert die Garage-Außenwand, den wahrscheinlichsten Hard-Breach-Punkt.',
        ab: 'Electroclaw Garage-Außenwand',
        load: L('AUG A3', 'TCSG12', 'Barbed Wire'),
        obj: ['support', 'breach', 'utility'],
        prep: [
          'Verstärke die Garage-Außenwand, Claw daran.',
          'Zweite Claw an das Haupttreppen-Fenster.',
        ],
        act: [
          'Halte den Kellergang.',
          'Breach-Picks ansagen.',
          'Retake: Claw an die Tür.',
        ],
        m: [
          ['B', 66, 60, 'position', 'Kaid – Kellergang'],
          ['B', 64, 66, 'gadget', 'Electroclaw – Garage-Wand'],
          ['1F', 58, 55, 'gadget', 'Electroclaw – Treppe'],
        ],
      },
      {
        op: 'castle', role: 'Flex-Anchor', task: 'Garage-Einstieg & 1F-Panel',
        why: 'Castle schließt die Garagen-Tür und die Piano-Verbindung.',
        ab: 'Armor Panels Garage + Piano',
        load: L('UMP45', 'M1014', 'Bulletproof Camera'),
        obj: ['support', 'antiEntry', 'anchor'],
        prep: [
          'Panel an die Garage und an die Piano-Tür.',
          'Kamera in die Lobby werfen.',
        ],
        act: [
          'Halte den 1F-Zugang zur Kellertreppe.',
          'Panel-Bruch melden.',
          'Retake: Panel erneut in die Garage.',
        ],
        m: [
          ['1F', 60, 55, 'position', 'Castle – Treppe'],
          ['1F', 63, 58, 'gadget', 'Armor Panel – Garage'],
          ['1F', 57, 55, 'gadget', 'Armor Panel – Piano'],
          ['1F', 59, 40, 'gadget', 'Bulletproof Camera – Lobby'],
        ],
      },
      {
        op: 'valkyrie', role: 'Roamer', task: 'Piano/Servers-Roam & Treppen-Watch',
        why: 'Valkyrie überwacht Piano, Servers und die Haupttreppe.',
        ab: 'Black Eyes Piano / Servers / Treppe',
        load: L('MPX', 'SPAS-12', 'Nitro Cell'),
        obj: ['roam', 'intel', 'flankWatch'],
        prep: [
          'Kamera in den Piano Room, Kamera an die Servers, Kamera an die Treppe.',
          'Nitro an die Piano-Tür.',
        ],
        act: [
          'Starte im Piano Room, halte die Fenster.',
          'Ruf Treppenbewegungen durch.',
          'Rückzug über Servers → Keller.',
          'Ab 1:10 an der Site.',
        ],
        m: [
          ['1F', 57, 55, 'position', 'Valkyrie – Piano'],
          ['1F', 55, 50, 'gadget', 'Black Eye – Piano'],
          ['1F', 65, 52, 'gadget', 'Black Eye – Servers'],
          ['B', 60, 55, 'gadget', 'Nitro – Treppe'],
          ['1F', 60, 57, 'rotation', 'Rückzug Piano → Keller', 59, 60],
        ],
      },
    ],
    subs: [
      { op: 'echo', for: 'mira', role: 'Anchor', reason: 'Yokai deckt Garage und Gang als bewegliche Intel-Quelle.', takes: ['Intel', 'Plant-Denial'], change: 'Yokai in Garage und Gang.', weak: 'Kein Sicht-Winkel.' },
      { op: 'mute', for: 'kaid', role: 'Support-Roamer', reason: 'Jammer blocken Breach und Drohnen im Keller.', takes: ['Anti-Breach'], change: 'Jammer an Garage-Wand.', weak: 'Kurze Reichweite.' },
      { op: 'lesion', for: 'castle', role: 'Flex-Anchor', reason: 'Minen geben Intel im Keller.', takes: ['Anti-Entry', 'Frühwarnung'], change: 'Minen an Garage und Treppe.', weak: 'Keine Barriere.' },
      { op: 'aruni', for: 'smoke', role: 'Anchor', reason: 'Gates sperren Garage und Gang, Aruni kann aggressiver nachrücken.', takes: ['Anti-Entry', 'Denial'], change: 'Gates statt Gas.', weak: 'Weniger Plant-Stopp.' },
      { op: 'alibi', for: 'valkyrie', role: 'Roamer', reason: 'Prismas geben Bait-Intel in Piano und Servers.', takes: ['Roam-Intel'], change: 'Prismas statt Kameras.', weak: 'Nur lokale Intel.' },
    ],
    def: {
      retake: [
        'Mira öffnet den Mirror, Smoke wirft Gas auf den Defuser.',
        'Castle/Panel schließt den Nachrückweg, Kaid sichert die Wand.',
      ],
      roam: [
        'Valkyrie hält Piano und Servers.',
        'Kaid pendelt zwischen Keller und Treppe.',
      ],
    },
  },
  {
    id: 'consulate-meeting-def-standard',
    map: 'consulate', site: 'meeting', side: 'defense', style: 'standard',
    name: 'Meeting Room – 2F-Anker mit Dacha-Kontrolle',
    summary:
      'Meeting Room/Consulate Office wird über zwei Anker gehalten. Der Schlüssel ist die Kontrolle des Dachs und des ' +
      '2F-Flurs; Castle schließt die Fensterfront, ein Roamer hält Admin/Archives.',
    confidence: 'eigene-analyse',
    ratings: {
      c: 3, d: 'hoch', u: 'hoch', k: 'hoch',
      s: ['Starke Innenwinkel', 'Gute Rotation über Admin'],
      w: ['Dachzugang sehr nah', 'Fensterfront breit'],
    },
    players: [
      {
        op: 'mira', role: 'Anchor', task: 'Meeting-Anker & Dach-Mirror',
        why: 'Der Mirror sichert den Dachzugang ab, ohne dass Mira selbst am Fenster steht.',
        ab: 'Black-Mirror Meeting ↔ Office',
        load: L('Vector .45 ACP', 'ITA12S', 'Nitro Cell'),
        obj: ['anchor', 'intel', 'plantDenial'],
        prep: [
          'Verstärke die Außenwand und die Dach-Tür.',
          'Mirror in die Wand Meeting → Consulate Office.',
          'Nitro unter das Dachfenster.',
        ],
        act: [
          'Halte den Mirror- und Dach-Winkel.',
          'Melde Dach-Bewegungen früh.',
          'Retake: Nitro auf den Defuser.',
        ],
        m: [
          ['2F', 57, 48, 'position', 'Mira – Meeting'],
          ['2F', 60, 50, 'gadget', 'Black-Mirror – Office'],
          ['2F', 55, 52, 'gadget', 'Nitro – Dach'],
        ],
      },
      {
        op: 'castle', role: 'Flex-Anchor', task: 'Office-Flex & Fenster-Panels',
        why: 'Castle schließt zwei Fenster der Meeting-Front.',
        ab: 'Armor Panels Meeting-Fenster + Office',
        load: L('UMP45', 'M1014', 'Bulletproof Camera'),
        obj: ['support', 'antiEntry', 'anchor'],
        prep: [
          'Panels an die Meeting-Fenster und die Office-Tür.',
          'Kamera in den 2F-Flur.',
        ],
        act: [
          'Halte Office und den Flur.',
          'Panel-Bruch ansagen.',
          'Retake: Panel an die Tür.',
        ],
        m: [
          ['2F', 62, 50, 'position', 'Castle – Office'],
          ['2F', 60, 46, 'gadget', 'Armor Panel – Fenster'],
          ['2F', 64, 53, 'gadget', 'Armor Panel – Office'],
          ['2F', 60, 58, 'gadget', 'Bulletproof Camera – Flur'],
        ],
      },
      {
        op: 'echo', role: 'Support-Roamer', task: 'Dach- & Flur-Intel',
        why: 'Yokai deckt Dach und Flur ab und kann Plants verzögern.',
        ab: 'Yokai Dach + Flur',
        load: L('MP5SD', 'SuperNova', 'Deployable Shield'),
        obj: ['support', 'intel', 'plantDenial'],
        prep: [
          'Yokai 1 an das Dachfenster, Yokai 2 in den 2F-Flur.',
          'Shield an die Meeting-Tür.',
        ],
        act: [
          'Lese Dach und Flur abwechselnd.',
          'Schock bei Plant oder Dach-Entry.',
          'Retake: Yokai als Intel halten.',
        ],
        m: [
          ['2F', 55, 52, 'gadget', 'Yokai – Dach'],
          ['2F', 60, 58, 'gadget', 'Yokai – Flur'],
          ['2F', 58, 50, 'gadget', 'Deployable Shield – Meeting'],
          ['2F', 57, 55, 'position', 'Echo – Flur'],
        ],
      },
      {
        op: 'valkyrie', role: 'Roamer', task: 'Admin- & Archives-Roam',
        why: 'Valkyrie hält Admin/Archives als Vorposten mit Kamera-Intel.',
        ab: 'Black Eyes Admin / Archives / Lobby',
        load: L('MPX', 'SPAS-12', 'Nitro Cell'),
        obj: ['roam', 'intel', 'flankWatch'],
        prep: [
          'Kamera in Admin, Kamera in Archives, Kamera in die Lobby.',
          'Nitro an die Admin-Tür.',
        ],
        act: [
          'Starte in Admin, halte die Fenster.',
          'Ruf Rotationen durch.',
          'Rückzug über Flur → Meeting.',
          'Ab 1:05 an der Site.',
        ],
        m: [
          ['2F', 55, 55, 'position', 'Valkyrie – Admin'],
          ['2F', 53, 58, 'gadget', 'Black Eye – Admin'],
          ['2F', 65, 55, 'gadget', 'Black Eye – Archives'],
          ['2F', 58, 50, 'rotation', 'Rückzug Admin → Meeting', 57, 50],
        ],
      },
      {
        op: 'kaid', role: 'Support-Roamer', task: 'Anti-Breach Außenwand',
        why: 'Kaid sichert die Meeting-Außenwand gegen Hard Breach.',
        ab: 'Electroclaw Meeting-Außenwand',
        load: L('AUG A3', 'TCSG12', 'Barbed Wire'),
        obj: ['support', 'breach', 'utility'],
        prep: [
          'Verstärke die Außenwand, Claw daran.',
          'Stacheldraht in den Flur.',
        ],
        act: [
          'Halte den 2F-Flur.',
          'Breach-Picks melden.',
          'Retake: Claw an die Tür.',
        ],
        m: [
          ['2F', 59, 56, 'position', 'Kaid – Flur'],
          ['2F', 54, 46, 'gadget', 'Electroclaw – Außenwand'],
        ],
      },
    ],
    subs: [
      { op: 'smoke', for: 'mira', role: 'Anchor', reason: 'Gas stoppt Fenster-Push und Plant.', takes: ['Denial'], change: 'Gas an Fenster und Dach.', weak: 'Kein Intel.' },
      { op: 'mute', for: 'kaid', role: 'Support-Roamer', reason: 'Jammer blocken Breach und Drohnen.', takes: ['Anti-Breach'], change: 'Jammer an Außenwand und Flur.', weak: 'Kurze Reichweite.' },
      { op: 'alibi', for: 'valkyrie', role: 'Roamer', reason: 'Prismas geben Admin-Intel.', takes: ['Roam-Intel'], change: 'Prismas statt Kameras.', weak: 'Nur lokale Intel.' },
      { op: 'lesion', for: 'castle', role: 'Flex-Anchor', reason: 'Minen im Flur verlangsamen.', takes: ['Anti-Entry'], change: 'Minen an Fenster und Flur.', weak: 'Keine Barriere.' },
      { op: 'maestro', for: 'echo', role: 'Support-Roamer', reason: 'Evil Eyes decken Dach und Flur dauerhaft.', takes: ['Intel', 'Denial'], change: 'Evil Eyes an Dach und Flur.', weak: 'Kein Schock.' },
    ],
    def: {
      retake: [
        'Mira/Castle halten Meeting/Office, Yokai liefert Dach-Intel.',
        'Gas/Panel schließt den Hauptzugang.',
      ],
      roam: [
        'Valkyrie hält Admin/Archives.',
        'Kaid bleit im Flur.',
      ],
    },
  },
];
