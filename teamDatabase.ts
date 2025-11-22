import { Team } from './types';

// Helper to map Turkish color names to specific hex codes if needed, 
// or just keep the string description.
// This database acts as the central source of truth for team assets.

export const TEAM_DATABASE: Team[] = [
  // --- TÜRKİYE (Süper Lig) ---
  { id: 'tr1', name: 'Galatasaray', colors: 'Sarı Kırmızı', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/f6/Galatasaray_Sports_Club_Logo.png' },
  { id: 'tr2', name: 'Fenerbahçe', colors: 'Sarı Lacivert', logoUrl: 'https://upload.wikimedia.org/wikipedia/tr/8/86/Fenerbah%C3%A7e_SK.png' },
  { id: 'tr3', name: 'Beşiktaş', colors: 'Siyah Beyaz', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/20/Besiktas_JK_Logo.svg' },
  { id: 'tr4', name: 'Trabzonspor', colors: 'Bordo Mavi', logoUrl: 'https://upload.wikimedia.org/wikipedia/tr/a/ab/Trabzonspor_Amblemi.png' },
  { id: 'tr5', name: 'Başakşehir', colors: 'Turuncu Lacivert', logoUrl: 'https://upload.wikimedia.org/wikipedia/tr/c/cd/Istanbul_Basaksehir_FK.png' },
  { id: 'tr6', name: 'Adana Demirspor', colors: 'Mavi Lacivert', logoUrl: 'https://upload.wikimedia.org/wikipedia/tr/6/60/Adana_Demirspor_logo.png' },
  { id: 'tr7', name: 'Samsunspor', colors: 'Kırmızı Beyaz', logoUrl: 'https://upload.wikimedia.org/wikipedia/tr/6/65/Samsunspor_logo_2.png' },
  { id: 'tr8', name: 'Antalyaspor', colors: 'Kırmızı Beyaz', logoUrl: 'https://upload.wikimedia.org/wikipedia/tr/d/db/Antalyaspor_logo.png' },
  { id: 'tr9', name: 'Konyaspor', colors: 'Yeşil Beyaz', logoUrl: 'https://upload.wikimedia.org/wikipedia/tr/4/47/Konyaspor_logo.png' },
  { id: 'tr10', name: 'Göztepe', colors: 'Sarı Kırmızı', logoUrl: 'https://upload.wikimedia.org/wikipedia/tr/b/bb/G%C3%B6ztepe_logo.png' },
  { id: 'tr11', name: 'Kasımpaşa', colors: 'Lacivert Beyaz', logoUrl: 'https://upload.wikimedia.org/wikipedia/tr/d/d0/Kasimpasa_logo.png' },
  { id: 'tr12', name: 'Sivasspor', colors: 'Kırmızı Beyaz', logoUrl: 'https://upload.wikimedia.org/wikipedia/tr/a/a7/Sivasspor.png' },
  { id: 'tr13', name: 'Rizespor', colors: 'Yeşil Mavi', logoUrl: 'https://upload.wikimedia.org/wikipedia/tr/c/c0/%C3%87aykur_Rizespor_logo.png' },
  { id: 'tr14', name: 'Alanyaspor', colors: 'Turuncu Yeşil', logoUrl: 'https://upload.wikimedia.org/wikipedia/tr/6/6f/Alanyaspor_logo.png' },
  { id: 'tr15', name: 'Kayserispor', colors: 'Sarı Kırmızı', logoUrl: 'https://upload.wikimedia.org/wikipedia/tr/8/86/Kayserispor_logo.png' },
  { id: 'tr16', name: 'Gaziantep FK', colors: 'Kırmızı Siyah', logoUrl: 'https://upload.wikimedia.org/wikipedia/tr/e/e7/Gaziantep_FK_logo.png' },
  { id: 'tr17', name: 'Hatayspor', colors: 'Bordo Beyaz', logoUrl: 'https://upload.wikimedia.org/wikipedia/tr/2/26/Hatayspor_logo.png' },
  { id: 'tr18', name: 'Eyüpspor', colors: 'Eflatun Sarı', logoUrl: 'https://upload.wikimedia.org/wikipedia/tr/8/8c/Ey%C3%BCpspor_logo.png' },
  { id: 'tr19', name: 'Bodrum FK', colors: 'Yeşil Beyaz', logoUrl: 'https://upload.wikimedia.org/wikipedia/tr/f/f4/Bodrumspor_logo.png' },

  // --- İNGİLTERE (Premier League) ---
  { id: 'pl1', name: 'Arsenal', colors: 'Kırmızı Beyaz', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg' },
  { id: 'pl2', name: 'Aston Villa', colors: 'Bordo Mavi', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/f/f9/Aston_Villa_FC_crest_%282016%29.svg' },
  { id: 'pl3', name: 'Bournemouth', colors: 'Kırmızı Siyah', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/e/e5/AFC_Bournemouth_%282013%29.svg' },
  { id: 'pl4', name: 'Brentford', colors: 'Kırmızı Beyaz', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/2/2a/Brentford_FC_crest.svg' },
  { id: 'pl5', name: 'Brighton', colors: 'Mavi Beyaz', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/f/fd/Brighton_%26_Hove_Albion_logo.svg' },
  { id: 'pl6', name: 'Chelsea', colors: 'Mavi', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/c/cc/Chelsea_FC.svg' },
  { id: 'pl7', name: 'Crystal Palace', colors: 'Kırmızı Mavi', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/a/a2/Crystal_Palace_FC_logo_%282022%29.svg' },
  { id: 'pl8', name: 'Everton', colors: 'Mavi Beyaz', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/7/7c/Everton_FC_logo.svg' },
  { id: 'pl9', name: 'Fulham', colors: 'Siyah Beyaz', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/e/eb/Fulham_FC_%28shield%29.svg' },
  { id: 'pl10', name: 'Ipswich Town', colors: 'Mavi Beyaz', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/4/43/Ipswich_Town.svg' },
  { id: 'pl11', name: 'Leicester City', colors: 'Mavi Beyaz', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/2/2d/Leicester_City_crest.svg' },
  { id: 'pl12', name: 'Liverpool', colors: 'Kırmızı', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/0/0c/Liverpool_FC.svg' },
  { id: 'pl13', name: 'Manchester City', colors: 'Gök Mavisi', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/e/eb/Manchester_City_FC_badge.svg' },
  { id: 'pl14', name: 'Manchester United', colors: 'Kırmızı Siyah', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/7/7a/Manchester_United_FC_crest.svg' },
  { id: 'pl15', name: 'Newcastle United', colors: 'Siyah Beyaz', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/5/56/Newcastle_United_Logo.svg' },
  { id: 'pl16', name: 'Nottingham Forest', colors: 'Kırmızı Beyaz', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/e/e5/Nottingham_Forest_F.C._logo.svg' },
  { id: 'pl17', name: 'Southampton', colors: 'Kırmızı Beyaz', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/c/c9/FC_Southampton.svg' },
  { id: 'pl18', name: 'Tottenham', colors: 'Lacivert Beyaz', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/b/b4/Tottenham_Hotspur.svg' },
  { id: 'pl19', name: 'West Ham', colors: 'Bordo Mavi', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/c/c2/West_Ham_United_FC_logo.svg' },
  { id: 'pl20', name: 'Wolves', colors: 'Sarı Siyah', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/f/fc/Wolverhampton_Wanderers.svg' },

  // --- İSPANYA (La Liga) ---
  { id: 'es1', name: 'Real Madrid', colors: 'Beyaz', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/5/56/Real_Madrid_CF.svg' },
  { id: 'es2', name: 'Barcelona', colors: 'Bordo Mavi', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/4/47/FC_Barcelona_%28crest%29.svg' },
  { id: 'es3', name: 'Atletico Madrid', colors: 'Kırmızı Beyaz', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/f/f4/Atletico_Madrid_2017_logo.svg' },
  { id: 'es4', name: 'Sevilla', colors: 'Kırmızı Beyaz', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/3/3b/Sevilla_FC_logo.svg' },
  { id: 'es5', name: 'Real Betis', colors: 'Yeşil Beyaz', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/1/13/Real_betis_logo.svg' },
  { id: 'es6', name: 'Real Sociedad', colors: 'Mavi Beyaz', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/f/f1/Real_Sociedad_logo.svg' },
  { id: 'es7', name: 'Villarreal', colors: 'Sarı', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/7/70/Villarreal_CF_logo.svg' },
  { id: 'es8', name: 'Athletic Bilbao', colors: 'Kırmızı Beyaz', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/9/98/Club_Athletic_Bilbao_logo.svg' },
  { id: 'es9', name: 'Valencia', colors: 'Siyah Beyaz', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/c/ce/Valenciacf.svg' },
  { id: 'es10', name: 'Girona', colors: 'Kırmızı Beyaz', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/9/90/Girona_FC_Crest.svg' },
  { id: 'es11', name: 'Celta Vigo', colors: 'Gök Mavisi', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/1/12/RC_Celta_de_Vigo_logo.svg' },
  { id: 'es12', name: 'Mallorca', colors: 'Kırmızı Siyah', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/e/e0/RCD_Mallorca_logo.svg' },
  { id: 'es13', name: 'Osasuna', colors: 'Kırmızı Lacivert', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/d/db/Osasuna_logo.svg' },
  { id: 'es14', name: 'Rayo Vallecano', colors: 'Beyaz Kırmızı', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a6/Rayo_Vallecano_logo.svg' },
  { id: 'es15', name: 'Getafe', colors: 'Mavi', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/4/46/Getafe_logo.svg' },

  // --- ALMANYA (Bundesliga) ---
  { id: 'bl1', name: 'Bayern Münih', colors: 'Kırmızı Beyaz', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/1b/FC_Bayern_M%C3%BCnchen_logo_%282017%29.svg' },
  { id: 'bl2', name: 'Dortmund', colors: 'Sarı Siyah', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/6/67/Borussia_Dortmund_logo.svg' },
  { id: 'bl3', name: 'Leverkusen', colors: 'Kırmızı Siyah', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/5/59/Bayer_04_Leverkusen_logo.svg' },
  { id: 'bl4', name: 'RB Leipzig', colors: 'Kırmızı Beyaz', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/0/04/RB_Leipzig_2014_logo.svg' },
  { id: 'bl5', name: 'Stuttgart', colors: 'Kırmızı Beyaz', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/eb/VfB_Stuttgart_1893_Logo.svg' },
  { id: 'bl6', name: 'Eintracht Frankfurt', colors: 'Kırmızı Siyah', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/04/Eintracht_Frankfurt_Logo.svg' },
  { id: 'bl7', name: 'Hoffenheim', colors: 'Mavi Beyaz', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e7/Logo_TSG_Hoffenheim.svg' },
  { id: 'bl8', name: 'Heidenheim', colors: 'Kırmızı Mavi', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/9d/1._FC_Heidenheim_1846.svg' },
  { id: 'bl9', name: 'Werder Bremen', colors: 'Yeşil Beyaz', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/be/SV-Werder-Bremen-Logo.svg' },
  { id: 'bl10', name: 'Freiburg', colors: 'Kırmızı Siyah', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/6/6d/SC_Freiburg_logo.svg' },
  { id: 'bl11', name: 'Augsburg', colors: 'Kırmızı Yeşil', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/5/59/FC_Augsburg_logo.svg' },
  { id: 'bl12', name: 'Wolfsburg', colors: 'Yeşil Beyaz', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/f3/Logo-VfL-Wolfsburg.svg' },
  { id: 'bl13', name: 'Mainz 05', colors: 'Kırmızı Beyaz', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/9e/Logo_Mainz_05.svg' },
  { id: 'bl14', name: 'Mönchengladbach', colors: 'Siyah Beyaz Yeşil', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/81/Borussia_M%C3%B6nchengladbach_logo.svg' },
  { id: 'bl15', name: 'Union Berlin', colors: 'Kırmızı Beyaz', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/44/1._FC_Union_Berlin_Logo.svg' },
  { id: 'bl16', name: 'Bochum', colors: 'Mavi Beyaz', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/72/VfL_Bochum_logo.svg' },
  { id: 'bl17', name: 'St. Pauli', colors: 'Kahverengi Beyaz', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/0/05/FC_St._Pauli_logo.svg' },
  { id: 'bl18', name: 'Holstein Kiel', colors: 'Mavi Beyaz Kırmızı', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/07/Holstein_Kiel_Logo.svg' },

  // --- İTALYA (Serie A) ---
  { id: 'it1', name: 'Inter', colors: 'Mavi Siyah', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/05/FC_Internazionale_Milano_2021.svg' },
  { id: 'it2', name: 'Milan', colors: 'Kırmızı Siyah', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/d0/Logo_of_AC_Milan.svg' },
  { id: 'it3', name: 'Juventus', colors: 'Siyah Beyaz', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/bc/Juventus_FC_2017_icon_%28black%29.svg' },
  { id: 'it4', name: 'Atalanta', colors: 'Mavi Siyah', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/6/66/AtalantaBC.svg' },
  { id: 'it5', name: 'Bologna', colors: 'Kırmızı Mavi', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/5/5b/Bologna_F.C._1909_logo.svg' },
  { id: 'it6', name: 'Roma', colors: 'Sarı Kırmızı', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/f/f7/AS_Roma_logo_%282017%29.svg' },
  { id: 'it7', name: 'Lazio', colors: 'Gök Mavisi', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/c/ce/S.S._Lazio_badge.svg' },
  { id: 'it8', name: 'Fiorentina', colors: 'Mor', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/b/ba/ACF_Fiorentina_2_logo.svg' },
  { id: 'it9', name: 'Napoli', colors: 'Mavi', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/2d/SSC_Napoli_logo.svg' },
  { id: 'it10', name: 'Torino', colors: 'Bordo', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/2/2e/Torino_FC_Logo.svg' },
  { id: 'it11', name: 'Genoa', colors: 'Kırmızı Mavi', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/6/6c/Genoa_C.F.C._logo.svg' },
  { id: 'it12', name: 'Monza', colors: 'Kırmızı Beyaz', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/2/2e/AC_Monza_logo.svg' },
  { id: 'it13', name: 'Verona', colors: 'Sarı Mavi', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/9/92/Hellas_Verona_FC_logo_%282020%29.svg' },
  { id: 'it14', name: 'Lecce', colors: 'Sarı Kırmızı', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/a/ab/U.S._Lecce_logo.svg' },
  { id: 'it15', name: 'Udinese', colors: 'Siyah Beyaz', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/c/ce/Udinese_Calcio_logo.svg' },
  { id: 'it16', name: 'Cagliari', colors: 'Kırmızı Mavi', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/6/61/Cagliari_Calcio_1920.svg' },
  { id: 'it17', name: 'Empoli', colors: 'Mavi', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/a/a3/Empoli_FC_1920_logo.svg' },
  { id: 'it18', name: 'Parma', colors: 'Sarı Mavi', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/3/36/Parma_Calcio_1913_logo.svg' },
  { id: 'it19', name: 'Como', colors: 'Mavi Beyaz', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/e/e8/Como_1907_logo.svg' },
  { id: 'it20', name: 'Venezia', colors: 'Turuncu Siyah Yeşil', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/1/12/Venezia_FC_logo.svg' },

  // --- FRANSA (Ligue 1) ---
  { id: 'l1', name: 'PSG', colors: 'Lacivert Kırmızı', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/a/a7/Paris_Saint-Germain_FC.svg' },
  { id: 'l2', name: 'Monaco', colors: 'Kırmızı Beyaz', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/b/ba/AS_Monaco_FC.svg' },
  { id: 'l3', name: 'Marsilya', colors: 'Mavi Beyaz', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/d8/Olympique_Marseille_logo.svg' },
  { id: 'l4', name: 'Lille', colors: 'Kırmızı Lacivert', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/6/6f/Lille_OSC_2018_logo.svg' },
  { id: 'l5', name: 'Lyon', colors: 'Beyaz Mavi Kırmızı', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/c/c6/Olympique_Lyonnais.svg' },
  { id: 'l6', name: 'Lens', colors: 'Kırmızı Sarı', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/c/cc/RC_Lens_logo.svg' },
  { id: 'l7', name: 'Nice', colors: 'Kırmızı Siyah', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/2/2e/OGC_Nice_logo.svg' },
  { id: 'l8', name: 'Rennes', colors: 'Kırmızı Siyah', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/9/9e/Stade_Rennais_FC.svg' },
  { id: 'l9', name: 'Reims', colors: 'Kırmızı Beyaz', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/0/08/Stade_de_Reims_logo.svg' },
  { id: 'l10', name: 'Strasbourg', colors: 'Mavi Beyaz', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/8/80/Racing_Club_de_Strasbourg_Alsace_logo.svg' },
  { id: 'l11', name: 'Toulouse', colors: 'Mor Beyaz', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/8/8b/Toulouse_FC_logo.svg' },
  { id: 'l12', name: 'Montpellier', colors: 'Lacivert Turuncu', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/a/a8/Montpellier_HSC_logo.svg' },
  { id: 'l13', name: 'Nantes', colors: 'Sarı Yeşil', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/2/2b/FC_Nantes_logo.svg' },
  { id: 'l14', name: 'Brest', colors: 'Kırmızı Beyaz', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/0/05/Stade_Brestois_29_logo.svg' },
  { id: 'l15', name: 'Auxerre', colors: 'Mavi Beyaz', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/3/38/AJ_Auxerre_logo.svg' },
  { id: 'l16', name: 'Angers', colors: 'Siyah Beyaz', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/d/d4/Angers_SCO_logo.svg' },
  { id: 'l17', name: 'Saint-Etienne', colors: 'Yeşil', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/a/a0/AS_Saint-%C3%89tienne_logo.svg' },
  { id: 'l18', name: 'Le Havre', colors: 'Lacivert Gök Mavisi', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/4/43/Le_Havre_AC_logo.svg' },

  // --- DİĞER ---
  { id: 'eu17', name: 'Porto', colors: 'Mavi Beyaz', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/3/36/Futebol_Clube_do_Porto_badge.svg' },
  { id: 'eu18', name: 'Benfica', colors: 'Kırmızı', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/a/a2/SL_Benfica_logo.svg' },
  { id: 'eu19', name: 'Ajax', colors: 'Kırmızı Beyaz', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/7/79/Ajax_Amsterdam.svg' },
  { id: 'eu20', name: 'PSV', colors: 'Kırmızı Beyaz', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/0/05/PSV_Eindhoven.svg' },
  { id: 'eu21', name: 'Feyenoord', colors: 'Kırmızı Beyaz', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/2/24/Feyenoord_Rotterdam_logo.svg' },
  { id: 'eu22', name: 'Sporting Lisbon', colors: 'Yeşil Beyaz', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/3/3e/Sporting_Clube_de_Portugal.svg' }
];

// Helper function to search the database
export const searchTeams = (query: string): Team[] => {
    if (!query || query.length < 2) return [];
    const lower = query.toLocaleLowerCase('tr');
    return TEAM_DATABASE.filter(t => 
        t.name.toLocaleLowerCase('tr').includes(lower)
    );
};

export const findTeamExact = (name: string): Team | undefined => {
    if(!name) return undefined;
    const lower = name.toLocaleLowerCase('tr');
    
    // Priority 1: Exact match
    let match = TEAM_DATABASE.find(t => t.name.toLocaleLowerCase('tr') === lower);
    if(match) return match;

    // Priority 2: Starts with
    match = TEAM_DATABASE.find(t => t.name.toLocaleLowerCase('tr').startsWith(lower));
    if(match) return match;
    
    // Priority 3: Includes
    return TEAM_DATABASE.find(t => t.name.toLocaleLowerCase('tr').includes(lower));
};
