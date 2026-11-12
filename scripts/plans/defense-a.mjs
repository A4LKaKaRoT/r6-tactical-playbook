/**
 * Verteidigungspläne – Teil A: Bank, Border, Chalet, Clubhouse
 * Marker-Format: [floor, x, y, kind, label, toX?, toY?]
 * Koordinaten kalibriert an den Ubisoft-Blueprints (1600×900).
 */
const L = (p, s, g) => ({ primary: p, secondary: s, gadget: g });

export default [
  /* ============================================================ BANK */
  {
    id: 'bank-ceo-def-standard',
    map: 'bank', site: 'ceo', side: 'defense', style: 'standard',
    name: 'CEO – Doppel-Anker mit Dachkontrolle',
    summary:
      'Zwei Anker halten CEO/Executive Lounge über die Lobby-Treppe und den 2F-Flur, ein Utility-Anker ' +
      'sichert die Außenwand am Balkon, der Roamer verzögert den Druck über Skylight und Board Room. ' +
      'Ziel: Angreifer früh zum Fenster- oder Treppen-Push zwingen und dort mit Utility abfangen.',
    confidence: 'eigene-analyse',
    ratings: {
      c: 4, d: 'mittel', u: 'mittel', k: 'mittel',
      s: ['Starke Innenverteidigung mit zwei Ankern', 'Außenwand nur mit Hard Breach angreifbar', 'Gute Retake-Wege über Skylight'],
      w: ['Anfällig gegen vertikalen Druck von oben', 'Utility-intensiv gegen Fenster-Push (Balkon/Front)'],
    },
    players: [
      {
        op: 'mira', role: 'Anchor', task: 'CEO-Anker & Black-Mirror-Intel',
        why: 'Mira-Spiegel in der Wand zwischen CEO und Executive Lounge geben Dir Info auf den Hauptkorridor, ohne selbst zu stehen.',
        ab: 'Black-Mirror in der CEO-Innenwand, einer Richtung Balkon',
        load: L('Vector .45 ACP', 'ITA12S', 'Nitro Cell'),
        obj: ['anchor', 'intel', 'antiEntry'],
        prep: [
          'Verstärke die Westwand von CEO (Balkonseite) und eine Executive-Lounge-Wand.',
          'Setze den Black-Mirror in die Wand CEO → Executive Lounge (mittlere Höhe), den zweiten in die Wand Richtung 2F-Flur.',
          'Lege eine Nitro an die Balkontür (Wurfwinkel nach unten zum Fenster-Einstieg).',
          'Lass die Wand zwischen CEO und Board Room unverstärkt, damit Du den Rotation-Weg offen behältst.',
          'Stelle die Barrikade am Balkonfenster so, dass der Einstieg nur nach dem Öffnen möglich ist.',
        ],
        act: [
          'Halte den Winkel vom CEO-Schreibtisch auf die Lobby-Treppe (unten) und den Balkon.',
          'Kontrolliere alle 15–20 s kurz den 2F-Flur über die offene Board-Room-Tür.',
          'Sag sofort "Balkon öffnet" / "Skylight bricht", wenn Du Fenster oder Dach hörst.',
          'Greife den Mirror erst auf, wenn ein Angreifer dahinter steht – vorher nicht zerschießen lassen.',
          'Beim Retake: bleib im CEO, halte den Balkonwinkel und lass die Roamer vorrücken.',
        ],
        m: [
          ['2F', 57, 36, 'position', 'Mira – CEO-Anker'],
          ['2F', 64, 41, 'angle', 'Executive-Lounge-Winkel'],
          ['2F', 46, 47, 'gadget', 'Nitro – Balkontür'],
          ['2F', 61, 55, 'angle', 'Sicht auf Skylight-Stiegenhaus'],
        ],
      },
      {
        op: 'echo', role: 'Flex-Anchor', task: 'Board-Room-Flex & Yokai-Intel',
        why: 'Echo kann mit den Yokai-Drohnen den Board-Room- und den Skylight-Weg gleichzeitig sehen und dort auch Plant-Versuche stören.',
        ab: 'Yokai in Board Room + Executive Lounge (Schock bei Plant)',
        load: L('MP5SD', 'SuperNova', 'Deployable Shield'),
        obj: ['anchor', 'intel', 'plantDenial'],
        prep: [
          'Verstärke die Nordwand des Board Room (Frontseite) und das Fenster daneben.',
          'Verstärke das Skylight-Hatch im Stiegenhaus nicht – stattdessen Yokai dort positionieren.',
          'Setze Yokai 1 an die Decke des Skylight-Stiegenhauses, Yokai 2 in die Executive Lounge hinter den Mirror.',
          'Stelle das Deployable Shield als Abdeckung an die Board-Room-Tür.',
        ],
        act: [
          'Halte Board Room gegen die Lobby-Fenster und die Front-Balkone.',
          'Nutze Yokai 1 als Kamera auf dem Skylight-Weg, Yokai 2 als aktive Schock-Verteidigung am Plant.',
          'Schock erst, wenn der Defuser gelegt wird oder jemand wirklich durch das Dach steigt.',
          'Rufe Rotationsaufrufe: "Board Room ist frei, 2F-Flur öffnet".',
          'Retake: vom Board Room aus zurück Richtung Executive Lounge, Yokai als Vorhut.',
        ],
        m: [
          ['2F', 51, 29, 'position', 'Echo – Board Room'],
          ['2F', 60, 54, 'gadget', 'Yokai – Skylight'],
          ['2F', 66, 41, 'gadget', 'Yokai – Executive Lounge'],
          ['2F', 53, 31, 'gadget', 'Deployable Shield – Board-Tür'],
        ],
      },
      {
        op: 'castle', role: 'Utility-Support', task: 'Balkon & Kamin-Rotation sichern',
        why: 'Castle schließt die zwei Balkon-Einstiege mit Armor Panels, die nur Sprengstoff öffnet – das verlangsamt Fenster-Pushs massiv.',
        ab: 'Armor Panel am Balkonfenster CEO + Kamin-Rotation',
        load: L('UMP45', 'M1014', 'Bulletproof Camera'),
        obj: ['support', 'antiEntry', 'utility'],
        prep: [
          'Setze Armor Panels an das Balkonfenster CEO und an die Kamin-Rotation (2F-Terrace).',
          'Verstärke die Innenwand zwischen Executive Lounge und Skylight-Stiegenhaus.',
          'Platziere die Bulletproof Camera im 2F-Flur mit Sicht auf beide CEO-Türen.',
          'Koordiniere mit Echo: Yokai deckt den Bereich, den Castle nicht zu-panelt.',
        ],
        act: [
          'Halte den 2F-Flur als Verbindungsstück zwischen CEO und Board Room.',
          'Melde sofort, wenn ein Panel aufbricht (Sledge, Ash, Zofia) – dann ist der Balkon offen.',
          'Wirf die Kamera erst, wenn Du den 2F-Flur verlässt; vorher als feste Quelle nutzen.',
          'Beim Retake: Panel erneut an die Kamin-Rotation, damit der Rückweg nicht offen steht.',
        ],
        m: [
          ['2F', 48, 46, 'gadget', 'Armor Panel – Balkon CEO'],
          ['2F', 63, 50, 'gadget', 'Armor Panel – Kamin-Rotation'],
          ['2F', 56, 48, 'gadget', 'Bulletproof Camera – 2F-Flur'],
          ['2F', 58, 50, 'position', 'Castle – 2F-Flur'],
        ],
      },
      {
        op: 'alibi', role: 'Roamer', task: 'Skylight & Board-Room-Roam',
        why: 'Alibi kann den Skylight-Weg und den Board-Room-Zugang mit Prismas lesen und den Roam trotzdem jederzeit abbrechen.',
        ab: 'Prisma im Skylight-Stiegenhaus + Board-Room-Tür',
        load: L('Mx4 Storm', 'ACS12', 'Impact-Granaten'),
        obj: ['roam', 'intel', 'flankWatch'],
        prep: [
          'Wirf ein Prisma ins Skylight-Stiegenhaus (Boden), ein zweites in den Board-Room-Eingang.',
          'Öffne mit den Impact-Granaten eine Rotation von Board Room zum 2F-Flur.',
          'Verstärke nichts an Deiner Startposition – Du brauchst Flexibilität.',
        ],
        act: [
          'Starte in Board Room, halte 30 s den Skylight-Blick und rotiere dann Richtung Lobby-Treppe.',
          'Wenn ein Prisma beschossen wird, ruf Position und Anzahl der Angreifer durch.',
          'Rückzug: über den 2F-Flur → Executive Lounge, niemals über die Lobby.',
          'Ab Minute 1:30 zurück Richtung Site, Position zwischen CEO und Board Room.',
        ],
        m: [
          ['2F', 52, 28, 'position', 'Alibi – Board Room'],
          ['2F', 61, 55, 'gadget', 'Prisma – Skylight'],
          ['2F', 54, 33, 'rotation', 'Roam-Rotation Board → 2F-Flur', 57, 47],
          ['2F', 57, 47, 'position', 'Rückzugsposition 2F-Flur'],
        ],
      },
      {
        op: 'kaid', role: 'Support-Roamer', task: 'Außenwand & Vault-Anti-Breach',
        why: 'Kaid hält die Elektro-Claws an der CEO-Außenwand und dem Vault-Hatch – genau dort, wo Bandit sie nicht erreichen würde.',
        ab: 'Electroclaw an CEO-Außenwand (Balkon) + Vault-Hatch',
        load: L('AUG A3', 'TCSG12', 'Barbed Wire'),
        obj: ['support', 'breach', 'utility'],
        prep: [
          'Verstärke die CEO-Außenwand zum Balkon und die Executive-Lounge-Außenwand.',
          'Wirf die erste Electroclaw an die CEO-Außenwand (oberes Drittel), die zweite an das Vault-Hatch im Basement.',
          'Verstärke das Vault-Hatch selbst.',
          'Stacheldraht in den 2F-Flur vor die CEO-Tür.',
        ],
        act: [
          'Halte zuerst den 2F-Flur, dann den Balkonwinkel.',
          'Beobachte Thermite/Hibana/Ash-Picks und ruf durch: "Hard Breach auf Balkon".',
          'Erneuere die Claw nur, wenn sie zerstört wurde – nicht vorschnell umsetzen.',
          'Retake: über 1F-Treppe in die Executive Lounge, Claw vorher am Vault erneuern.',
        ],
        m: [
          ['2F', 66, 43, 'position', 'Kaid – 2F-Flur'],
          ['2F', 45, 44, 'gadget', 'Electroclaw – CEO-Außenwand'],
          ['B', 40, 44, 'gadget', 'Electroclaw – Vault-Hatch'],
          ['2F', 61, 45, 'gadget', 'Stacheldraht – CEO-Tür'],
        ],
      },
    ],
    subs: [
      { op: 'smoke', for: 'mira', role: 'Anchor', reason: 'Smoke ersetzt den Spiegel-Intel durch Rauch-Denial am Plant und hält den Balkon-Einstieg zu.', takes: ['CEO-Anker', 'Plant-Denial', 'Balkon-Kontrolle'], change: 'Kein Mirror-Intel mehr – Echo/Yokai muss den Korridor lesen; Smoke setzt Rauch am CEO-Aufgang.', weak: 'Weniger proaktiver Intel, Retakes langsamer.' },
      { op: 'valkyrie', for: 'alibi', role: 'Roamer', reason: 'Valkyrie liefert mit Black Eyes dieselbe Intel-Rolle, aber ortsunabhängig für das ganze Team.', takes: ['Roam-Intel', 'Flank-Watch', 'Skylight-Kontrolle'], change: 'Prismas entfallen; Valkyrie wirft Kameras an Skylight, Lobby und Vault-Rampe.', weak: 'Kein Bait gegen Drohnen, Kameras müssen aktiv gelesen werden.' },
      { op: 'bandit', for: 'kaid', role: 'Support-Roamer', reason: 'Bandit-Batterie übernimmt Anti-Breach an der CEO-Außenwand, ist aber selbst gefährdeter.', takes: ['Anti-Hard-Breach', 'Außenwand-Denial'], change: 'Vault-Hatch muss von jemand anderem verstärkt werden; Bandit trickt an der Balkonwand.', weak: 'Bandit-Trick ist riskanter gegen Thatcher/Kali.' },
      { op: 'lesion', for: 'castle', role: 'Utility-Support', reason: 'Lesion-Minen ersetzen die Panel-Verzögerung mit Verlangsamung + Intel in Flur und Balkon.', takes: ['Flur-Kontrolle', 'Frühwarnung', 'Anti-Entry'], change: 'Keine Armor Panels; Fenster bleiben offen, dafür Gu-Minen an zwei Einstiegen.', weak: 'Weniger robust gegen Fenster-Push mit Sprengstoff.' },
      { op: 'maestro', for: 'echo', role: 'Flex-Anchor', reason: 'Evil Eyes decken Balkon und Flur als feste Kameras mit Laser-Denial, ohne Drohnen-Management.', takes: ['Intel', 'Plant-Denial', 'Flex-Anker'], change: 'Kein Yokai-Schock; Maestro hält Board Room und zerstört Utility am Balkon.', weak: 'Laser bleibt sichtbar und ist angreifbar.' },
    ],
    def: {
      retake: [
        'Anker halten CEO/Executive Lounge und verhindern, dass Angreifer nach dem Plant freies Schussfeld bekommen.',
        'Castle/Smoke wirft Rauch bzw. schließt das Balkonfenster, Mira öffnet den Mirror von der Rückseite.',
        'Roamer kommen über 2F-Flur und die Lobby-Treppe zurück, nicht über den Balkon.',
        'Ziel: Plant in den letzten 20 s unterbrechen statt früh zu sterben.',
      ],
      roam: [
        'Alibi startet Board Room → Skylight → Lobby-Treppe, fällt bei Druck über den 2F-Flur zurück.',
        'Kaid startet 2F-Flur → Balkon-Winkel, weicht auf Executive Lounge aus.',
        'Kein Roamer geht tiefer als 1F-Open Area – sonst ist der Rückweg zur Site zu weit.',
      ],
    },
  },
  {
    id: 'bank-openarea-def-standard',
    map: 'bank', site: 'open-area', side: 'defense', style: 'standard',
    name: 'Open Area – Utility-Bunker mit Tellers-Rotation',
    summary:
      'Die Site wird als Bunker gespielt: zwei Anker halten Open Area/Staff Room, die Support-Rolle schließt ' +
      'die Außenwand und Keller-Rotation, ein tiefer Roamer kontrolliert Tellers/Archives und den Garage-Ramp-Weg.',
    confidence: 'eigene-analyse',
    ratings: {
      c: 4, d: 'mittel', u: 'hoch', k: 'mittel',
      s: ['Große Site mit vielen Deckungswinkeln', 'Tellers-Rotation erlaubt schnelle Retakes', 'Vertical-Denial über Server Room möglich'],
      w: ['Mehrere Fenster zum Innenhof', 'Anfällig gegen gleichzeitigen Garage-Ramp- und Fenster-Push'],
    },
    players: [
      {
        op: 'smoke', role: 'Anchor', task: 'Open-Area-Anker & Plant-Denial',
        why: 'Smoke hält die Open-Area-Tür und kann mit Fernzündern den Plant im Hauptraum verzögern.',
        ab: 'Remote-Gas am Hauptzugang + Staff-Room-Tür',
        load: L('FMG-9', 'M590A1', 'Barbed Wire'),
        obj: ['anchor', 'plantDenial', 'antiEntry'],
        prep: [
          'Verstärke die Innenwände Open Area ↔ Lobby und Open Area ↔ Server-Room.',
          'Lass die Wand zu den Tellers offen – das ist Deine Rotation.',
          'Stacheldraht in den Hauptzugang (Open-Area-Tür) und an die Fensterseite legen.',
          'Behalte 1 Rauchgranate für den Retake.',
        ],
        act: [
          'Halte den Winkel vom Staff-Room-Eingang auf die Open-Area-Fenster.',
          'Zünde den ersten Rauch erst, wenn ein Angreifer die Tür wirklich öffnet.',
          'Ruf bei jedem Fensterbruch Position und Anzahl durch.',
          'Letzte 40 s: Rauch auf den Defuser, dann aus der Deckung aggressiv nachdrücken.',
        ],
        m: [
          ['1F', 53, 39, 'position', 'Smoke – Open-Area-Anker'],
          ['1F', 50, 34, 'angle', 'Winkel Richtung Fenster Nord'],
          ['1F', 61, 41, 'gadget', 'Stacheldraht – Hauptzugang'],
        ],
      },
      {
        op: 'mute', role: 'Flex-Anchor', task: 'Server-Room & Hard-Breach-Denial',
        why: 'Mute blockiert Hard-Breach-Ladungen an der Wand zur Server-Room-Seite und schützt zusätzlich vor Dokkaebi-Hacks.',
        ab: 'Signal Disruptor an Server-Room-Wand + Hauptkorridor',
        load: L('MP5K', 'M590A1', 'Nitro Cell'),
        obj: ['anchor', 'breach', 'utility'],
        prep: [
          'Verstärke die Server-Room-Wand (Außenwand) und die Wand zu den Archiv-Räumen.',
          'Stelle Jammer 1 an die Server-Room-Außenwand, Jammer 2 in den Hauptkorridor unter der Decke (Drohnen).',
          'Nitro an die Archives-Tür legen.',
          'Lass die Wand zu den Tellers offen (Rotation, wird von Playern 1/3 genutzt).',
        ],
        act: [
          'Halte den Server-Room-Eingang und den Archives-Blick.',
          'Wenn ein Jammer zerstört wird, ruf "Breach kommt" und wechsle den Winkel.',
          'Setze die Nitro nur, wenn Gegner hinter der Tür gebunden sind (Archives-Bereich).',
          'Retake: Jammer an die Tür setzen, die Angreifer nach dem Plant nutzen.',
        ],
        m: [
          ['1F', 57, 35, 'position', 'Mute – Server-Eingang'],
          ['1F', 63, 33, 'gadget', 'Jammer – Server-Außenwand'],
          ['1F', 55, 43, 'gadget', 'Jammer – Hauptkorridor'],
          ['1F', 66, 52, 'gadget', 'Nitro – Archives'],
        ],
      },
      {
        op: 'mira', role: 'Support-Roamer', task: 'Tellers-Mirror & Rotation-Intel',
        why: 'Miras Spiegel in der Wand Tellers/Archives gibt dem Team den Rückzugsintel, während Mira flexibel bleibt.',
        ab: 'Black-Mirror Tellers ↔ Archives',
        load: L('Vector .45 ACP', 'ITA12S', 'Impact-Granaten'),
        obj: ['support', 'intel', 'retake'],
        prep: [
          'Verstärke die Wand zwischen Tellers und Archives und setze dort den Mirror.',
          'Öffne mit Impact eine Rotation Archives → Staff Room.',
          'Verstärke die Archiv-Außenwand.',
        ],
        act: [
          'Halte Tellers kurz als Startposition, dann rotiere ins Archiv.',
          'Der Mirror zeigt den Angreifer-Push durch die Fenster – sofort ansagen.',
          'Wenn Open Area fällt: über die Rotation ins Staff Room zurück, Mirror aufreißen.',
          'Retake: Mirror liefert den Winkel, Tellers-Fenster als Ausstieg.',
        ],
        m: [
          ['1F', 66, 45, 'position', 'Mira – Tellers'],
          ['1F', 67, 50, 'gadget', 'Black-Mirror – Tellers/Archives'],
          ['1F', 60, 52, 'rotation', 'Rotation Archives → Staff', 58, 43],
        ],
      },
      {
        op: 'pulse', role: 'Deep-Roamer', task: 'Garage-Ramp- & Keller-Intel',
        why: 'Pulse liest mit dem Heartbeat-Sensor den Garage-Ramp-Push, bevor er die Site erreicht – der wertvollste Intel auf dieser Site.',
        ab: 'Heartbeat-Sensor im Keller + Garage Ramp',
        load: L('UMP45', 'M1014', 'Nitro Cell'),
        obj: ['roam', 'intel', 'flankWatch'],
        prep: [
          'Verstärke im Keller das Vault-Hatch und eine Wand zum Server Room.',
          'Nichts an der Garage-Rampe verstärken – Du willst den Einstieg hören.',
        ],
        act: [
          'Starte an der Garage-Rampe (B), scanne alle 20 s Richtung Tunnel.',
          'Melde Herzen im Tunnel/Garage sofort mit Anzahl.',
          'Ziehe nach 45 s über die Treppe in den 1F-Korridor zurück, nicht durch die Open Area.',
          'Ab 1:00 nur noch zwischen Keller und 1F-Korridor – kein Kontakt ohne Not.',
        ],
        m: [
          ['B', 36, 58, 'position', 'Pulse – Garage Ramp'],
          ['B', 47, 50, 'angle', 'Scan-Richtung Tunnel'],
          ['1F', 55, 47, 'position', 'Rückzug 1F-Korridor'],
          ['B', 42, 45, 'gadget', 'Nitro – Vault-Zugang'],
        ],
      },
      {
        op: 'aruni', role: 'Roamer', task: 'Atrium- & Lobby-Watch',
        why: 'Aruni-Gates sperren den Lobby-Durchgang und den Atrium-Weg, ohne dass Aruni dort stehen bleiben muss.',
        ab: 'Surya-Gate Lobby-Durchgang + Atrium-Tür',
        load: L('P10 RONI', 'Mk 14 EBR', 'Barbed Wire'),
        obj: ['roam', 'antiEntry', 'flankWatch'],
        prep: [
          'Setze das erste Gate in den Lobby-Durchgang, das zweite an die Atrium-Tür.',
          'Verstärke die Lobby-Seite der Wand zur Open Area.',
          'Stacheldraht vor das Gate, damit der Durchbruch laut wird.',
        ],
        act: [
          'Starte in der Lobby, halte die Atrium-Fenster im Blick.',
          'Nach 30 s rotiere Richtung Haupttreppe und melde Lobby-Freiheit.',
          'Rückzug über den Hauptkorridor in die Staff-Room-Rotation.',
          'Ab 1:20 zurück an die Site, Gate-Status ansagen.',
        ],
        m: [
          ['1F', 57, 23, 'position', 'Aruni – Lobby'],
          ['1F', 53, 27, 'gadget', 'Surya-Gate – Lobby-Durchgang'],
          ['1F', 60, 30, 'gadget', 'Surya-Gate – Atrium'],
          ['1F', 58, 33, 'rotation', 'Rotation Lobby → Korridor', 56, 40],
        ],
      },
    ],
    subs: [
      { op: 'castle', for: 'smoke', role: 'Anchor', reason: 'Castle schließt die Open-Area-Fenster, sodass Smoke-Denial nicht nötig ist.', takes: ['Anker Open Area', 'Fenster-Denial'], change: 'Kein Rauch – dafür Armor Panels an beiden Fenstern und Kamera im Flur.', weak: 'Nach dem Aufbrechen der Panels ist der Raum offener als mit Rauch.' },
      { op: 'kaid', for: 'mute', role: 'Flex-Anchor', reason: 'Kaid übernimmt Anti-Breach an der Server-Außenwand mit der Electroclaw aus sicherer Position.', takes: ['Anti-Hard-Breach', 'Server-Kontrolle'], change: 'Drohnen-Denial fehlt; Jammer-Aufgaben muss Aruni/Pulse übernehmen.', weak: 'Claw ist sichtbar und kann aus der Ferne zerstört werden.' },
      { op: 'valkyrie', for: 'pulse', role: 'Deep-Roamer', reason: 'Valkyrie liefert Keller-Intel mit Kameras statt Bewegungssensor und bleibt mobiler.', takes: ['Keller-Intel', 'Garage-Watch', 'Flank-Watch'], change: 'Black Eye über der Garage-Rampe und im Tunnel; keine Live-Herz-Anzeige.', weak: 'Kein aktiver Scan – Kameras müssen manuell gelesen werden.' },
      { op: 'lesion', for: 'aruni', role: 'Roamer', reason: 'Lesion-Minen erzeugen Verlangsamung + Intel an den gleichen Durchgängen.', takes: ['Durchgangs-Denial', 'Frühwarnung'], change: 'Gates entfallen; Minen in Lobby, Atrium und Hauptkorridor.', weak: 'Minenschaden ist gering, harter Push kommt durch.' },
      { op: 'jager', for: 'mira', role: 'Support-Roamer', reason: 'Jäger sichert Fenster-Pushs gegen Granaten/Flashs, wenn Mira gebannt ist.', takes: ['Utility-Support', 'Fenster-Denial'], change: 'Kein Mirror-Intel; ADS an Open-Area-Fenster und Archiv-Tür.', weak: 'Keine aktive Intel-Quelle mehr auf Tellers.' },
    ],
    def: {
      retake: [
        'Anker halten Server/Archives, Support zieht über die Rotation Staff Room zurück.',
        'Smoke/Rauch oder Castle-Panel schließt den Hauptzugang, während der Roamer von hinten kommt.',
        'Pulse/Valkyrie liefert die Position des Defusers, bevor jemand hineingeht.',
      ],
      roam: [
        'Pulse kontrolliert Garage-Ramp (B) und zieht über den 1F-Korridor zurück.',
        'Aruni hält Lobby/Atrium 30–45 s und fällt über den Hauptkorridor zurück.',
        'Niemand roamt im Vault – der Weg zurück ist zu lang.',
      ],
    },
  },

  /* ========================================================== BORDER */
  {
    id: 'border-armory-def-standard',
    map: 'border', site: 'armory', side: 'defense', style: 'standard',
    name: 'Armory – zwei Anker, ein Dachroamer',
    summary:
      'Armory/Archives wird über 2F-Anker gehalten, während Castle die Fensterfront schließt und ein Rotationspaar ' +
      'über Briefing Room und Vents den Weg von der Border-Gate-Seite verzögert.',
    confidence: 'eigene-analyse',
    ratings: {
      c: 4, d: 'niedrig', u: 'mittel', k: 'mittel',
      s: ['Kompakte Site, klare Winkel', 'Schnelle Rotation über 2F-Flur', 'Dach nur über wenige Hatches erreichbar'],
      w: ['Fensterfront sehr breit', 'Nachbar-Rooms (Briefing/Vents) leicht zu räumen'],
    },
    players: [
      {
        op: 'mira', role: 'Anchor', task: 'Armory-Anker & Mirror auf Hauptfenster',
        why: 'Mira sieht mit dem Mirror den Fenster-Push auf Armory, ohne selbst im Schussfeld zu stehen.',
        ab: 'Black-Mirror Armory ↔ Archives',
        load: L('Vector .45 ACP', 'ITA12S', 'Nitro Cell'),
        obj: ['anchor', 'intel', 'antiEntry'],
        prep: [
          'Verstärke die Außenwand Armory (Fensterfront) und eine Seite der Archives-Wand.',
          'Setze den Mirror in die Wand Armory → Archives.',
          'Nitro an das Armory-Fenster legen.',
          'Lass die Tür zum 2F-Flur offen als Rotation.',
        ],
        act: [
          'Halte den Winkel vom Armory-Regal auf die Fenster.',
          'Aufreißen des Mirrors nur, wenn Gegner direkt dahinter stehen.',
          'Melde jede Drohne, die Armory betritt, und zerstöre sie sofort.',
          'Retake: Mirror auf, Fenster zu, dann mit Castle-Panel den Zugang halten.',
        ],
        m: [
          ['2F', 45, 30, 'position', 'Mira – Armory'],
          ['2F', 40, 27, 'gadget', 'Black-Mirror – Armory/Archives'],
          ['2F', 45, 24, 'gadget', 'Nitro – Armory-Fenster'],
        ],
      },
      {
        op: 'castle', role: 'Flex-Anchor', task: 'Archives-Flex & Fenster-Panel',
        why: 'Castle sichert mit einem Panel die zweite Fensterachse und verhindert frühe Fenster-Picks.',
        ab: 'Armor Panel Archives-Fenster + Briefing-Tür',
        load: L('UMP45', 'M1014', 'Bulletproof Camera'),
        obj: ['anchor', 'antiEntry', 'support'],
        prep: [
          'Setze ein Armor Panel an das Archives-Fenster, eines an die Briefing-Room-Tür.',
          'Verstärke die Archives-Außenwand.',
          'Wirf die Bulletproof Camera in den 2F-Flur.',
        ],
        act: [
          'Halte Archives gegen die Fensterfront und den Flur.',
          'Melde, wenn ein Panel bricht – dann Fensterwinkel aufgeben und Innenwinkel nehmen.',
          'Halte den 2F-Flur als Verbindung zu Mira offen.',
          'Retake: Panel an die Tür setzen, durch die der Defuser bewacht wird.',
        ],
        m: [
          ['2F', 51, 28, 'position', 'Castle – Archives'],
          ['2F', 55, 33, 'gadget', 'Armor Panel – Archives-Fenster'],
          ['2F', 40, 45, 'gadget', 'Armor Panel – Briefing-Tür'],
          ['2F', 47, 40, 'gadget', 'Bulletproof Camera – 2F-Flur'],
        ],
      },
      {
        op: 'maestro', role: 'Support-Roamer', task: 'Vents-Kamera & Utility-Denial',
        why: 'Maestro-Evil-Eyes überwachen das Vent- und das Briefing-Room-Fenster und können Utility verbrennen.',
        ab: 'Evil Eye im Ventilation Room + 2F-Flur',
        load: L('ALDA 5.56', 'ACS12', 'Impact-Granaten'),
        obj: ['support', 'intel', 'utility'],
        prep: [
          'Setze Evil Eye 1 in den Ventilation Room (Decke), Evil Eye 2 in den 2F-Flur.',
          'Öffne mit Impact eine Rotation Vents → Flur.',
          'Verstärke die Vents-Außenwand.',
        ],
        act: [
          'Halte Vents als Vorposten; öffne die Lüftungsöffnung nicht selbst.',
          'Laser nur kurz nutzen, um Zeit zu gewinnen – danach wieder als Kamera lesen.',
          'Ruf Vents-Freiheit, bevor Du zurückziehst.',
          'Retake: Evil Eye drehen, dann über den Flur in die Armory zurück.',
        ],
        m: [
          ['2F', 58, 38, 'position', 'Maestro – Vents'],
          ['2F', 58, 42, 'gadget', 'Evil Eye – Ventilation'],
          ['2F', 52, 44, 'gadget', 'Evil Eye – 2F-Flur'],
          ['2F', 56, 40, 'rotation', 'Rotation Vents → Flur', 52, 44],
        ],
      },
      {
        op: 'alibi', role: 'Roamer', task: 'Border-Gate-Roam & Bait',
        why: 'Alibi-Prismas im Gang vor der Border-Gate-Treppe erkennen den Push früh und binden Drohnen.',
        ab: 'Prisma in der Border-Gate-Treppe + 2F-Korridor',
        load: L('Mx4 Storm', 'ACS12', 'Impact-Granaten'),
        obj: ['roam', 'intel', 'flankWatch'],
        prep: [
          'Wirf ein Prisma unten in die Border-Gate-Treppe, eines in den 2F-Korridor.',
          'Impact-Rotation vorbereiten: Office → Flur.',
        ],
        act: [
          'Starte am Border-Gate (Nordseite), halte 40 s den Treppenaufgang.',
          'Bei Prisma-Beschuss: Anzahl und Richtung durchgeben.',
          'Rückzug über Office → 2F-Flur, nicht über Vents.',
          'Ab 1:15 zurück an die Site (2F-Flur).',
        ],
        m: [
          ['2F', 47, 15, 'position', 'Alibi – Border Gate'],
          ['2F', 47, 20, 'gadget', 'Prisma – Treppe'],
          ['2F', 40, 52, 'rotation', 'Rückzug Office → Flur', 45, 45],
        ],
      },
      {
        op: 'kaid', role: 'Support-Roamer', task: 'Anti-Breach an der Armory-Außenwand',
        why: 'Kaid hält die Electroclaw an der Außenwand, weil Bandit dort zu offen stünde – wichtig gegen Thermite/Hibana.',
        ab: 'Electroclaw Armory-Außenwand',
        load: L('AUG A3', 'TCSG12', 'Barbed Wire'),
        obj: ['support', 'breach', 'utility'],
        prep: [
          'Verstärke die Armory-Außenwand und die Verbindungswand zum Flur.',
          'Electroclaw an die Außenwand (mittlere Höhe).',
          'Stacheldraht in die Briefing-Tür.',
        ],
        act: [
          'Halte den Flur zwischen Armory und Briefing.',
          'Melde Hard-Breach-Picks und erneuere die Claw nach Zerstörung.',
          'Retake: Claw an die Tür setzen, durch die Angreifer nachrücken.',
        ],
        m: [
          ['2F', 42, 42, 'position', 'Kaid – Flur'],
          ['2F', 47, 26, 'gadget', 'Electroclaw – Armory-Außenwand'],
          ['2F', 41, 44, 'gadget', 'Stacheldraht – Briefing'],
        ],
      },
    ],
    subs: [
      { op: 'smoke', for: 'mira', role: 'Anchor', reason: 'Smoke deckt den Fenster-Push mit Gas statt Mirror ab.', takes: ['Armory-Anker', 'Plant-Denial'], change: 'Kein Mirror; Gas an Fenster und Flur, Castle hält die zweite Achse.', weak: 'Kein aktiver Intel auf Archives.' },
      { op: 'valkyrie', for: 'alibi', role: 'Roamer', reason: 'Valkyrie liefert ortsunabhängigen Intel statt Prisma-Bait.', takes: ['Roam-Intel', 'Border-Gate-Watch'], change: 'Black Eyes an Treppe, Flur und Vents; Roam defensiver.', weak: 'Kein Bait, weniger Druck auf Drohnen.' },
      { op: 'mute', for: 'kaid', role: 'Support-Roamer', reason: 'Jammer übernehmen Anti-Breach an der gleichen Wand und blocken Drohnen im Flur.', takes: ['Anti-Hard-Breach', 'Flur-Kontrolle'], change: 'Zwei Jammer statt Claw; Kaids TCSG-Löcher entfallen.', weak: 'Kurze Reichweite, muss näher an die Wand.' },
      { op: 'melusi', for: 'maestro', role: 'Support-Roamer', reason: 'Banshees verlangsamen Vents- und Flur-Push, wenn Evil Eyes gebannt sind.', takes: ['Utility-Denial', 'Frühwarnung'], change: 'Banshee in Vents und Flur; Rotation bleibt.', weak: 'Weniger Intel, langsameres Lesen des Puschs.' },
      { op: 'fenrir', for: 'castle', role: 'Flex-Anchor', reason: 'F-NATT-Gasminen ergänzen Panel-Denial um aktive Sichtbehinderung.', takes: ['Anti-Entry', 'Fenster-Denial'], change: 'Keine Panels; Gasminen an Archives-Fenster und Briefing-Tür.', weak: 'Panels fehlen gegen reine Spreng-Pushs.' },
    ],
    def: {
      retake: [
        'Anker halten Armory/Archives, Support öffnet Mirror bzw. Gas am Fenster.',
        'Castle-Panel schließt den Hauptzugang, Alibi/Valkyrie liefert Position des Defusers.',
        'Roamer kommen über 2F-Flur zurück – nie durch Vents, wenn dort Kontakt war.',
      ],
      roam: [
        'Alibi startet Border Gate → 2F-Korridor, fällt über Office zurück.',
        'Maestro hält Vents 30 s, dann zurück an die Site.',
        'Kaid bleibt im Flur, kein Deep-Roam – die Map ist zu klein dafür.',
      ],
    },
  },
  {
    id: 'border-workshop-def-standard',
    map: 'border', site: 'workshop', side: 'defense', style: 'standard',
    name: 'Workshop – Bunker mit Customs-Rotation',
    summary:
      'Workshop/Ventilation wird von zwei Ankern als Bunker gehalten, Castle schließt die Außenfenster, ein Roamer ' +
      'kontrolliert Customs/Supply als Vorposten. Fokus liegt auf Fenster-Denial und dem Weg über den Main Hall.',
    confidence: 'eigene-analyse',
    ratings: {
      c: 4, d: 'mittel', u: 'hoch', k: 'hoch',
      s: ['Sehr starke Innenwinkel', 'Customs-Rotation ermöglicht frühe Retakes', 'Viele Utility-Optionen'],
      w: ['Zwei offene Außenfenster + Garagen-Tür', 'Koordination zwischen Anker und Roamer nötig'],
    },
    players: [
      {
        op: 'smoke', role: 'Anchor', task: 'Workshop-Anker',
        why: 'Smoke hält die Workshop-Tür und kann den Plant mit Gas aus der Deckung verzögern.',
        ab: 'Remote-Gas Workshop-Tür + Fensterseite',
        load: L('FMG-9', 'M590A1', 'Barbed Wire'),
        obj: ['anchor', 'plantDenial', 'antiEntry'],
        prep: [
          'Verstärke die Wand Workshop ↔ Ventilation und die Garagen-Seite.',
          'Stacheldraht in die Werkstatt-Tür und vor das Garagen-Fenster.',
          'Fensterseite zur Main Hall nicht verstärken – dort willst Du hören.',
        ],
        act: [
          'Halte den Winkel von der Werkbank auf die Fenster und die Hall-Tür.',
          'Rauch erst, wenn Angreifer die Tür öffnen oder der Defuser liegt.',
          'Melde jede Fensteröffnung sofort an Castle.',
          'Retake: Rauch auf den Plant, dann aus der Customs-Rotation nachrücken.',
        ],
        m: [
          ['1F', 47, 33, 'position', 'Smoke – Workshop'],
          ['1F', 50, 36, 'angle', 'Winkel Fenster / Haupttor'],
          ['1F', 44, 38, 'gadget', 'Stacheldraht – Werkstatt-Tür'],
        ],
      },
      {
        op: 'castle', role: 'Flex-Anchor', task: 'Vent-Flex & Fenster-Panel',
        why: 'Castle-Panels schließen die Vent-Fenster und verhindern den schnellen Fenster-Entry.',
        ab: 'Armor Panel Ventilation-Fenster + Garage',
        load: L('UMP45', 'M1014', 'Bulletproof Camera'),
        obj: ['antiEntry', 'support', 'anchor'],
        prep: [
          'Panel an das Vent-Fenster und an die Garage-Tür setzen.',
          'Verstärke die Vent-Außenwand.',
          'Kamera in den Main Hall werfen.',
        ],
        act: [
          'Halte Ventilation und den Blick in den Hall.',
          'Panel-Bruch sofort melden, dann Innenwinkel einnehmen.',
          'Retake: Panel an die Tür setzen, die nach dem Plant benutzt wird.',
        ],
        m: [
          ['1F', 52, 42, 'position', 'Castle – Vent'],
          ['1F', 55, 38, 'gadget', 'Armor Panel – Vent-Fenster'],
          ['1F', 48, 46, 'gadget', 'Armor Panel – Garage'],
          ['1F', 44, 50, 'gadget', 'Bulletproof Camera – Hall'],
        ],
      },
      {
        op: 'aruni', role: 'Roamer', task: 'Customs-Vorposten',
        why: 'Aruni sperrt mit Gates den Customs-/Supply-Zugang und liefert Frühwarnung ohne Dauerpräsenz.',
        ab: 'Surya-Gates Customs ↔ Supply',
        load: L('P10 RONI', 'Mk 14 EBR', 'Barbed Wire'),
        obj: ['roam', 'antiEntry', 'flankWatch'],
        prep: [
          'Gate in den Customs-Eingang, Gate in die Supply-Tür.',
          'Stacheldraht hinter das erste Gate.',
          'Verstärke die Customs-Innenwand zur Site.',
        ],
        act: [
          'Starte Customs, halte die Außenseite 40 s.',
          'Gate-Bruch melden, dann über Supply in die Main Hall rotieren.',
          'Rückzug über die Customs-Rotation in die Site.',
          'Ab 1:10 an der Site, Gates erneuern.',
        ],
        m: [
          ['1F', 30, 32, 'position', 'Aruni – Customs'],
          ['1F', 27, 36, 'gadget', 'Surya-Gate – Customs'],
          ['1F', 25, 45, 'gadget', 'Surya-Gate – Supply'],
          ['1F', 40, 40, 'rotation', 'Rotation Customs → Hall', 44, 46],
        ],
      },
      {
        op: 'valkyrie', role: 'Deep-Roamer', task: 'Hall-Intel & Flank-Watch',
        why: 'Valkyrie-Kameras decken Main Hall, East Stairs und Garage ab – das macht den Roam auf dieser offenen Map erst effektiv.',
        ab: 'Black Eyes Main Hall / East Stairs / Garage',
        load: L('MPX', 'SPAS-12', 'Nitro Cell'),
        obj: ['roam', 'intel', 'flankWatch'],
        prep: [
          'Wirf Kamera 1 in die Main Hall (Ecke), Kamera 2 an die East Stairs, Kamera 3 in die Garage.',
          'Nitro an die Garage legen.',
        ],
        act: [
          'Starte an den East Stairs, lese die Hall über Kamera.',
          'Rufe Rotationen an, sobald Kameras Kontakt zeigen.',
          'Rückzug über die Hall in die Site, nicht durchs Garage.',
          'Ab 1:00 zwischen Hall und Werkstatt pendeln.',
        ],
        m: [
          ['1F', 57, 56, 'position', 'Valkyrie – East Stairs'],
          ['1F', 40, 50, 'gadget', 'Black Eye – Main Hall'],
          ['1F', 47, 61, 'gadget', 'Black Eye – Garage'],
          ['1F', 60, 52, 'rotation', 'Rotation Stairs → Hall', 50, 46],
        ],
      },
      {
        op: 'kaid', role: 'Support-Roamer', task: 'Anti-Breach Vent-Außenwand',
        why: 'Kaid hält die Claw an der Vent-Außenwand, die von innen schwer zu verteidigen wäre.',
        ab: 'Electroclaw Vent-Außenwand',
        load: L('AUG A3', 'TCSG12', 'Barbed Wire'),
        obj: ['support', 'breach', 'utility'],
        prep: [
          'Verstärke Vent-Außenwand, Claw daran.',
          'Stacheldraht in die Verbindung Workshop ↔ Vent.',
        ],
        act: [
          'Halte die Innenwand zwischen Workshop und Vent.',
          'Hard-Breach-Picks ansagen, Claw erneuern.',
          'Retake: Claw an die Tür, die Angreifer nutzen.',
        ],
        m: [
          ['1F', 50, 45, 'position', 'Kaid – Innenverbindung'],
          ['1F', 55, 34, 'gadget', 'Electroclaw – Vent-Wand'],
        ],
      },
    ],
    subs: [
      { op: 'mute', for: 'kaid', role: 'Support-Roamer', reason: 'Jammer direkt an der Wand blocken den Breach und zusätzlich Drohnen im Hall.', takes: ['Anti-Hard-Breach', 'Hall-Kontrolle'], change: 'Jammer statt Claw, TCSG-Löcher entfallen.', weak: 'Muss näher an der Außenwand stehen.' },
      { op: 'mira', for: 'smoke', role: 'Anchor', reason: 'Mira gibt Intel auf Customs statt Rauch-Denial.', takes: ['Anker', 'Intel'], change: 'Mirror Workshop ↔ Vent, Castle übernimmt Denial.', weak: 'Weniger aktive Plant-Verzögerung.' },
      { op: 'alibi', for: 'valkyrie', role: 'Deep-Roamer', reason: 'Prismas übernehmen die Flank-Erkennung mit aktiverem Bait.', takes: ['Flank-Watch', 'Intel'], change: 'Prismas in Hall und Customs statt Kameras.', weak: 'Weniger feste Intel-Quellen für Anker.' },
      { op: 'fenrir', for: 'castle', role: 'Flex-Anchor', reason: 'Gasminen behindern den Fenster-Entry aktiv.', takes: ['Anti-Entry', 'Fenster-Denial'], change: 'Gasminen an Vent-Fenster und Garage.', weak: 'Panels fehlen gegen Bretter-Push.' },
      { op: 'lesion', for: 'aruni', role: 'Roamer', reason: 'Minen liefern Verlangsamung + Intel an denselben Durchgängen.', takes: ['Customs-Denial', 'Frühwarnung'], change: 'Minen statt Gates, mehr Dichte im Hall.', weak: 'Kein harter Zugang-Block für 40 s.' },
    ],
    def: {
      retake: [
        'Anker halten Workshop/Vent, Smoke wirft Gas auf den Defuser.',
        'Castle setzt Panel in den Zugang, über den Roter nachkäme.',
        'Roamer kommen über Customs/Supply zurück und schneiden den Flank.',
      ],
      roam: [
        'Aruni hält Customs, Valkyrie die Hall, Kaid die Innenverbindung.',
        'Kein Roamer geht in die Garage ohne Valkyrie-Kamera.',
      ],
    },
  },
];
