import React, { useState, useRef, useMemo } from 'react';
import { Team, Player, Group, Match } from './types';
import { DEFAULT_TEAM_LOGO } from './constants';
import { TEAM_DATABASE, searchTeams, findTeamExact } from './teamDatabase';
import { TournamentBracket } from './components/TournamentBracket';
import { generateTeamLogo } from './services/geminiService';
import { Users, Trophy, ArrowRight, RefreshCw, Save, FolderDown, Download, Upload, Wand2, Loader2, Sparkles, Settings, Shield, User, LayoutGrid, CheckCircle2, Edit3 } from 'lucide-react';
import { TeamLogo } from './components/TeamLogo';
import { TeamCard } from './components/TeamCard';

// --- WIZARD TYPES ---
type WizardStep = 'mode' | 'setup' | 'register' | 'config' | 'bracket';
type TournamentMode = 'standard' | 'owned';

function App() {
  // --- STATE ---
  const [tournamentTitle, setTournamentTitle] = useState("Turnuva Sihirbazı");
  const [step, setStep] = useState<WizardStep>('mode');
  const [mode, setMode] = useState<TournamentMode>('standard');
  
  // Setup State
  const [standardCount, setStandardCount] = useState<number>(16);
  const [ownedUserCount, setOwnedUserCount] = useState<number>(3);
  const [ownedTeamsPerUser, setOwnedTeamsPerUser] = useState<number>(4);

  // Registration State
  const [playerNames, setPlayerNames] = useState<string[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);

  // Autocomplete State
  const [activeAutocompleteId, setActiveAutocompleteId] = useState<string | null>(null);
  const [filteredSuggestions, setFilteredSuggestions] = useState<Team[]>([]);
  const [suggestionIndex, setSuggestionIndex] = useState<number>(-1);

  // Bracket State
  const [groups, setGroups] = useState<Group[]>([]);
  const [finalPlayers, setFinalPlayers] = useState<Player[]>([]); // Used for manual assignments if needed
  
  // Configuration State
  const [selectedGroupConfig, setSelectedGroupConfig] = useState<{ numGroups: number, teamsPerGroup: number } | null>(null);
  
  // Settings
  const [fixtureMethod, setFixtureMethod] = useState<'auto' | 'manual'>('auto');
  const [includeReturnLegs, setIncludeReturnLegs] = useState(false);
  const [loadingLogoId, setLoadingLogoId] = useState<string | null>(null);

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const importFileInputRef = useRef<HTMLInputElement>(null);

  // --- WIZARD LOGIC ---

  const handleModeSelect = (selectedMode: TournamentMode) => {
    setMode(selectedMode);
    setStep('setup');
  };

  const handleSetupSubmit = () => {
    // Initialize Data Structures based on counts
    let newTeams: Team[] = [];
    let newPlayerNames: string[] = [];

    if (mode === 'standard') {
        // Just create N empty teams
        for(let i=0; i<standardCount; i++) {
            newTeams.push({
                id: `t-${i}`,
                name: '',
                colors: '',
                logoUrl: DEFAULT_TEAM_LOGO
            });
        }
        setPlayerNames(['Turnuva Yöneticisi']); // Single dummy player for standard
    } else {
        // Create U users * T teams
        for(let i=0; i<ownedUserCount; i++) {
            newPlayerNames.push(`Oyuncu ${i+1}`);
            for(let j=0; j<ownedTeamsPerUser; j++) {
                newTeams.push({
                    id: `u${i}-t${j}`,
                    name: '',
                    colors: '',
                    logoUrl: DEFAULT_TEAM_LOGO,
                    ownerName: `Oyuncu ${i+1}` // Placeholder, updated when player name changes
                });
            }
        }
    }

    setTeams(newTeams);
    setPlayerNames(newPlayerNames);
    setStep('register');
  };

  const handleRegistrationSubmit = () => {
     // Validate empty names
     if (teams.some(t => !t.name.trim())) {
         alert("Lütfen tüm takım isimlerini giriniz.");
         return;
     }
     setStep('config');
  };

  const handleConfigSelect = (numGroups: number, teamsPerGroup: number) => {
      setSelectedGroupConfig({ numGroups, teamsPerGroup });
      generateTournament(numGroups, teamsPerGroup);
  };

  // --- TOURNAMENT GENERATION ---

  const generateTournament = (numGroups: number, teamsPerGroup: number) => {
      // 1. Create Player Objects
      let playersPayload: Player[] = [];
      
      if (mode === 'standard') {
          // One admin player holding all teams
          playersPayload = [{
              id: 'admin',
              name: 'Admin',
              teams: teams,
              isBot: false
          }];
      } else {
          // Create player objects for each user
          playersPayload = playerNames.map((name, idx) => {
              // Filter teams belonging to this user
              // In owned mode, team IDs are u{idx}-t{j}
              const userTeams = teams.filter(t => t.id.startsWith(`u${idx}-`));
              // Update ownerName in case it changed
              const updatedUserTeams = userTeams.map(t => ({...t, ownerName: name}));
              return {
                  id: `p-${idx}`,
                  name: name,
                  teams: updatedUserTeams,
                  isBot: false
              };
          });
          // Update global teams array with new owner names for consistency
          const allUpdatedTeams = playersPayload.flatMap(p => p.teams);
          setTeams(allUpdatedTeams); 
      }

      setFinalPlayers(playersPayload);

      // 2. Distribute Teams into Groups
      const allTeams = playersPayload.flatMap(p => p.teams);
      const newGroups: Group[] = [];
      const groupNames = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');
      
      // Distribution Logic
      const distributedTeams: Team[][] = Array.from({ length: numGroups }, () => []);

      if (mode === 'owned') {
          // Fair Distribution: Try to place 1 team from each player into each group
          // Create a copy of teams per player
          const playerQueues = playersPayload.map(p => [...p.teams].sort(() => 0.5 - Math.random()));
          
          // Round robin distribution
          let groupIdx = 0;
          let safetyBreak = 0;
          
          // Continue until all teams are assigned
          while (playerQueues.some(q => q.length > 0) && safetyBreak < 1000) {
             safetyBreak++;
             // Try to pick a team for current group
             // We iterate through players to ensure mix
             for (let pIdx = 0; pIdx < playerQueues.length; pIdx++) {
                 if (distributedTeams[groupIdx].length < teamsPerGroup) {
                     const team = playerQueues[pIdx].pop();
                     if (team) {
                         distributedTeams[groupIdx].push(team);
                         // Move to next group to spread this player's teams
                         groupIdx = (groupIdx + 1) % numGroups;
                     }
                 }
             }
          }
          
          // Fallback cleanup if math wasn't perfect, just fill remaining spots
          const remaining = playerQueues.flat();
          remaining.forEach(t => {
               // Find first non-full group
               const target = distributedTeams.find(g => g.length < teamsPerGroup);
               if (target) target.push(t);
          });

      } else {
          // Standard Random Shuffle
          const shuffled = [...allTeams].sort(() => 0.5 - Math.random());
          for (let i = 0; i < numGroups; i++) {
              distributedTeams[i] = shuffled.slice(i * teamsPerGroup, (i + 1) * teamsPerGroup);
          }
      }

      // 3. Create Groups & Matches
      for (let i = 0; i < numGroups; i++) {
          const gTeams = distributedTeams[i];
          const matches = generateAutoMatches(gTeams, i);
          newGroups.push({
              name: groupNames[i],
              teams: gTeams,
              matches: matches
          });
      }

      setGroups(newGroups);
      setStep('bracket');
  };

  // Implementation of Berger Table (Round Robin) Algorithm
  const generateAutoMatches = (teams: Team[], groupIndex: number): Match[] => {
    if (teams.length < 2) return [];
    
    const matches: Match[] = [];
    let matchCount = 1;

    // Logic for Round Robin
    // If odd number of teams, add a dummy
    const teamList = [...teams];
    const hasDummy = teamList.length % 2 !== 0;
    if (hasDummy) {
        // We'll handle dummy by checking if valid team later, 
        // but for array rotation we need even number.
        // Actually simpler: just add a null placeholder conceptually
        teamList.push({ id: 'dummy', name: 'dummy', colors: '', logoUrl: '' });
    }

    const numTeams = teamList.length;
    const numRounds = numTeams - 1;
    const halfSize = numTeams / 2;

    const rounds: { home: Team, away: Team }[][] = [];

    // Generate Rounds
    for (let round = 0; round < numRounds; round++) {
        const currentRoundMatches: { home: Team, away: Team }[] = [];
        for (let i = 0; i < halfSize; i++) {
            const home = teamList[i];
            const away = teamList[numTeams - 1 - i];

            // Filter out dummy matches
            if (home.id !== 'dummy' && away.id !== 'dummy') {
                // Switch home/away every round to balance (standard Berger logic)
                // Special case for the first team (index 0) which stays fixed: it alternates
                let realHome = home;
                let realAway = away;

                if (i === 0) {
                   if (round % 2 === 1) {
                       realHome = away;
                       realAway = home;
                   }
                } else {
                   if (round % 2 === 1) {
                       // For other pairs, standard alternation
                       realHome = away;
                       realAway = home;
                   }
                }

                currentRoundMatches.push({ home: realHome, away: realAway });
            }
        }
        rounds.push(currentRoundMatches);

        // Rotate teams (Keep index 0 fixed, rotate the rest)
        // [0, 1, 2, 3] -> [0, 3, 1, 2] -> [0, 2, 3, 1]
        const first = teamList[0];
        const rest = teamList.slice(1);
        const last = rest.pop();
        if (last) rest.unshift(last);
        teamList.length = 0;
        teamList.push(first, ...rest);
    }

    // --- BUILD FIXTURE LIST ---
    
    // 1. First Leg (League 1st Half)
    rounds.forEach((roundMatches) => {
        roundMatches.forEach(pair => {
            matches.push({
                id: `g${groupIndex}-m${matchCount++}`,
                homeTeamId: pair.home.id,
                awayTeamId: pair.away.id,
                homeScore: '',
                awayScore: '',
                isPlayed: false
            });
        });
    });

    // 2. Return Leg (League 2nd Half) - Swap Home/Away
    if (includeReturnLegs) {
        rounds.forEach((roundMatches) => {
            roundMatches.forEach(pair => {
                matches.push({
                    id: `g${groupIndex}-m${matchCount++}`,
                    homeTeamId: pair.away.id, // Swap
                    awayTeamId: pair.home.id, // Swap
                    homeScore: '',
                    awayScore: '',
                    isPlayed: false
                });
            });
        });
    }

    return matches;
  };


  // --- HELPER INPUT HANDLERS ---

  const handleTeamChange = (id: string, field: keyof Team, value: string) => {
      setTeams(prev => prev.map(t => {
          if (t.id !== id) return t;
          const updated = { ...t, [field]: value };
          
          if (field === 'name') {
            // RESET LOGIC: If name is empty, reset logo and colors
            if (value.trim() === '') {
                updated.logoUrl = DEFAULT_TEAM_LOGO;
                updated.colors = '';
            } 
            // AUTO LOGIC: Check database
            else if (value.length > 2) {
                const match = findTeamExact(value);
                if (match && !t.logoUrl.startsWith('data:')) {
                    updated.logoUrl = match.logoUrl;
                    updated.colors = updated.colors || match.colors;
                }
            }
          }
          return updated;
      }));
  };

  // Autocomplete wrapper for handleTeamChange
  const handleTeamNameInput = (id: string, value: string) => {
      handleTeamChange(id, 'name', value);
      
      if (value.length > 1) {
          const matches = searchTeams(value);
          setFilteredSuggestions(matches.slice(0, 5)); // Limit to top 5
          setActiveAutocompleteId(id);
          setSuggestionIndex(-1); // Reset index when input changes
      } else {
          setFilteredSuggestions([]);
          setActiveAutocompleteId(null);
          setSuggestionIndex(-1);
      }
  };

  const applySuggestion = (teamId: string, suggestion: Team) => {
      setTeams(prev => prev.map(t => {
          if (t.id !== teamId) return t;
          return { 
              ...t, 
              name: suggestion.name, 
              logoUrl: suggestion.logoUrl, 
              colors: suggestion.colors || t.colors 
          };
      }));
      setActiveAutocompleteId(null);
      setFilteredSuggestions([]);
      setSuggestionIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent, teamId: string) => {
    if (!filteredSuggestions.length) return;

    if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSuggestionIndex(prev => (prev < filteredSuggestions.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSuggestionIndex(prev => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Enter') {
        if (suggestionIndex >= 0 && filteredSuggestions[suggestionIndex]) {
            e.preventDefault();
            applySuggestion(teamId, filteredSuggestions[suggestionIndex]);
        }
    } else if (e.key === 'Escape') {
        setActiveAutocompleteId(null);
    }
  };

  const handlePlayerNameUpdate = (index: number, value: string) => {
      const newNames = [...playerNames];
      newNames[index] = value;
      setPlayerNames(newNames);
      // Also update ownerName for their teams for visual consistency
      if (mode === 'owned') {
          setTeams(prev => prev.map(t => t.id.startsWith(`u${index}-`) ? {...t, ownerName: value} : t));
      }
  };

  const handleGenerateLogo = async (teamId: string, teamName: string) => {
      if (!teamName) return alert("Lütfen önce bir takım adı girin.");
      setLoadingLogoId(teamId);
      try {
          const logo = await generateTeamLogo(teamName);
          if (logo) {
             // Directly update the team state
             setTeams(prev => prev.map(t => t.id === teamId ? { ...t, logoUrl: logo } : t));
          } else {
             alert("Logo oluşturulamadı. Lütfen tekrar deneyin.");
          }
      } catch(e) { 
          console.error(e);
          alert("Yapay zeka servisine erişilemedi.");
      } finally {
          setLoadingLogoId(null);
      }
  };

  const handleFillRandom = () => {
      const shuffled = [...TEAM_DATABASE].sort(() => 0.5 - Math.random());
      let usedIdx = 0;
      setTeams(prev => prev.map(t => {
          if (t.name) return t;
          const pick = shuffled[usedIdx++] || { name: `Takım ${usedIdx}`, logoUrl: DEFAULT_TEAM_LOGO, colors: '?' };
          return { ...t, name: pick.name, logoUrl: pick.logoUrl, colors: pick.colors };
      }));
  };


  // --- CALCULATION HELPERS ---
  
  const groupOptions = useMemo(() => {
      const total = teams.length;
      const options: { numGroups: number, teamsPerGroup: number, label: string }[] = [];
      
      // Find all factors
      for (let i = 2; i <= Math.sqrt(total); i++) {
          if (total % i === 0) {
              options.push({ numGroups: i, teamsPerGroup: total / i, label: `${i} Grup (Grup başı ${total / i})` });
              if (i !== total / i) {
                  options.push({ numGroups: total / i, teamsPerGroup: i, label: `${total / i} Grup (Grup başı ${i})` });
              }
          }
      }
      return options.sort((a, b) => a.numGroups - b.numGroups);
  }, [teams.length]);


  // --- DATA PERSISTENCE ---
  const saveTournament = () => {
      const data = { 
          tournamentTitle, 
          step, 
          mode, 
          groups, 
          teams, 
          playerNames, 
          finalPlayers, 
          fixtureMethod, 
          includeReturnLegs, 
          timestamp: Date.now() 
      };
      localStorage.setItem('ai_tournament_v4', JSON.stringify(data));
      alert("Turnuva tarayıcıya kaydedildi.");
  };

  const loadTournament = () => {
      const s = localStorage.getItem('ai_tournament_v4');
      if (!s) {
          // Try loading older version
          const old = localStorage.getItem('ai_tournament_v3');
          if(old) {
              const d = JSON.parse(old);
              setStep(d.step || 'bracket');
              setMode(d.mode);
              setGroups(d.groups);
              setTeams(d.teams);
              setPlayerNames(d.playerNames);
              setFinalPlayers(d.finalPlayers);
              setFixtureMethod(d.fixtureMethod);
              setIncludeReturnLegs(d.includeReturnLegs);
              alert("Eski kayıt yüklendi.");
              return;
          }
          return alert("Kayıt bulunamadı.");
      }

      const d = JSON.parse(s);
      if (d.tournamentTitle) setTournamentTitle(d.tournamentTitle);
      setStep(d.step || 'bracket');
      setMode(d.mode);
      setGroups(d.groups);
      setTeams(d.teams);
      setPlayerNames(d.playerNames);
      setFinalPlayers(d.finalPlayers);
      setFixtureMethod(d.fixtureMethod);
      setIncludeReturnLegs(d.includeReturnLegs);
  };

  const handleExport = () => {
    const data = { 
        tournamentTitle, 
        step, 
        mode, 
        groups, 
        teams, 
        playerNames, 
        finalPlayers, 
        fixtureMethod, 
        includeReturnLegs, 
        timestamp: Date.now() 
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${tournamentTitle.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0,10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
          try {
              const content = e.target?.result as string;
              const d = JSON.parse(content);
              
              // Basic validation
              if (!d.teams || !Array.isArray(d.teams)) throw new Error("Geçersiz dosya formatı");

              if (confirm("Mevcut turnuva verileri silinecek ve dosyadan yüklenecek. Onaylıyor musunuz?")) {
                if (d.tournamentTitle) setTournamentTitle(d.tournamentTitle);
                setStep(d.step || 'bracket');
                setMode(d.mode);
                setGroups(d.groups);
                setTeams(d.teams);
                setPlayerNames(d.playerNames);
                setFinalPlayers(d.finalPlayers);
                setFixtureMethod(d.fixtureMethod);
                setIncludeReturnLegs(d.includeReturnLegs);
                
                // Persist loaded data to LS immediately
                localStorage.setItem('ai_tournament_v4', JSON.stringify(d));
                alert("Veriler başarıyla içe aktarıldı.");
              }
          } catch (error) {
              alert("Dosya okunurken hata oluştu: " + error);
          }
      };
      reader.readAsText(file);
      event.target.value = ''; // Reset input
  };

  const resetApp = () => {
      if(confirm("Başa dönmek istiyor musunuz?")) {
        setStep('mode');
        setGroups([]);
        setTeams([]);
      }
  }


  // --- RENDER ---

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      <header className="bg-slate-950/80 backdrop-blur border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2 cursor-pointer" onClick={resetApp}>
                <Trophy className="text-blue-500 flex-shrink-0" />
                <div className="flex flex-col justify-center">
                    <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider leading-none mb-1">Turnuva Yöneticisi</span>
                    <div className="relative group">
                        <input 
                            value={tournamentTitle}
                            onChange={(e) => setTournamentTitle(e.target.value)}
                            className="bg-transparent border-b border-transparent hover:border-slate-700 focus:border-blue-500 outline-none font-bold text-lg tracking-tight text-white w-full sm:w-64 transition-colors pb-0.5"
                        />
                        <Edit3 size={12} className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                    </div>
                </div>
            </div>
            <div className="flex gap-2 items-center">
                <button onClick={saveTournament} className="p-2 hover:bg-slate-800 rounded-full text-slate-400" title="Tarayıcıya Kaydet (Local Storage)"><Save size={18}/></button>
                <button onClick={loadTournament} className="p-2 hover:bg-slate-800 rounded-full text-slate-400" title="Tarayıcıdan Yükle (Local Storage)"><FolderDown size={18}/></button>
                
                <div className="w-px h-6 bg-slate-700 mx-1"></div>
                
                <button onClick={handleExport} className="p-2 hover:bg-slate-800 rounded-full text-blue-400" title="Dosya Olarak İndir (Export)"><Download size={18}/></button>
                <button onClick={() => importFileInputRef.current?.click()} className="p-2 hover:bg-slate-800 rounded-full text-green-400" title="Dosyadan Yükle (Import)"><Upload size={18}/></button>
                <input 
                    type="file" 
                    ref={importFileInputRef} 
                    onChange={handleImport} 
                    className="hidden" 
                    accept=".json"
                />
            </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-6xl mx-auto p-4 sm:p-6">
        
        {/* STEP 1: MODE SELECTION */}
        {step === 'mode' && (
            <div className="animate-in fade-in zoom-in duration-500 max-w-4xl mx-auto text-center mt-10">
                <h2 className="text-3xl font-bold text-white mb-8">Nasıl bir turnuva düzenliyorsun?</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <button 
                        onClick={() => handleModeSelect('standard')}
                        className="bg-slate-800 hover:bg-slate-700 border-2 border-slate-700 hover:border-blue-500 p-8 rounded-2xl transition-all group text-left"
                    >
                        <div className="bg-blue-500/20 w-16 h-16 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <LayoutGrid size={32} className="text-blue-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Standart Turnuva</h3>
                        <p className="text-slate-400 text-sm">Toplam takım sayısını gir, grupları biz oluşturalım. (Örn: 16 Takım, 4 Grup)</p>
                    </button>

                    <button 
                        onClick={() => handleModeSelect('owned')}
                        className="bg-slate-800 hover:bg-slate-700 border-2 border-slate-700 hover:border-purple-500 p-8 rounded-2xl transition-all group text-left"
                    >
                         <div className="bg-purple-500/20 w-16 h-16 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Users size={32} className="text-purple-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Sahipli Takım Turnuvası</h3>
                        <p className="text-slate-400 text-sm">Arkadaşlarınla her biriniz belirli sayıda takım seçin, sonra kapıştırın. (Örn: 3 Arkadaş, 4'er Takım)</p>
                    </button>
                </div>
            </div>
        )}

        {/* STEP 2: SETUP NUMBERS */}
        {step === 'setup' && (
            <div className="animate-in fade-in slide-in-from-right duration-300 max-w-md mx-auto mt-20 bg-slate-800 p-8 rounded-2xl border border-slate-700">
                <h2 className="text-2xl font-bold text-white mb-6">
                    {mode === 'standard' ? 'Turnuva Detayları' : 'Katılımcı Bilgileri'}
                </h2>
                
                {mode === 'standard' ? (
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-slate-400 mb-2">Toplam Katılımcı (Takım) Sayısı</label>
                        <input 
                            type="number" 
                            min="4" max="64" 
                            value={standardCount}
                            onChange={(e) => setStandardCount(parseInt(e.target.value))}
                            className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white font-mono text-lg focus:border-blue-500 outline-none"
                        />
                    </div>
                ) : (
                    <div className="space-y-4 mb-6">
                         <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">Arkadaş (Oyuncu) Sayısı</label>
                            <input 
                                type="number" min="2" max="8" 
                                value={ownedUserCount}
                                onChange={(e) => setOwnedUserCount(parseInt(e.target.value))}
                                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-purple-500 outline-none"
                            />
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">Kişi Başı Takım Sayısı</label>
                            <input 
                                type="number" min="1" max="8" 
                                value={ownedTeamsPerUser}
                                onChange={(e) => setOwnedTeamsPerUser(parseInt(e.target.value))}
                                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-purple-500 outline-none"
                            />
                        </div>
                    </div>
                )}

                <button 
                    onClick={handleSetupSubmit}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                    Devam Et <ArrowRight size={18} />
                </button>
            </div>
        )}

        {/* STEP 3: REGISTRATION */}
        {step === 'register' && (
            <div className="animate-in fade-in duration-500 space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-end gap-4 bg-slate-800/60 p-6 rounded-2xl border border-slate-700">
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-1">Takım Kaydı</h2>
                        <p className="text-slate-400 text-sm">
                            {mode === 'standard' 
                                ? `${teams.length} Takım için isimleri giriniz.` 
                                : `${playerNames.length} Oyuncu için takımları giriniz.`
                            }
                        </p>
                    </div>
                    <div className="flex gap-2">
                         <button onClick={handleFillRandom} className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2"><RefreshCw size={14}/> Rastgele Doldur</button>
                         <button 
                            onClick={handleRegistrationSubmit}
                            className="bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded-lg text-sm font-bold flex items-center gap-2 shadow-lg shadow-green-500/20"
                        >
                            Tamamla <CheckCircle2 size={16}/>
                        </button>
                    </div>
                </div>

                {/* Standard Grid */}
                {mode === 'standard' && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {teams.map((team) => (
                            <div key={team.id} className="bg-slate-800 p-3 rounded-xl border border-slate-700 hover:border-blue-500/50 transition-all">
                                <div className="flex gap-2 items-center mb-2">
                                    <div className="w-10 h-10 flex-shrink-0">
                                        <TeamLogo 
                                            url={team.logoUrl} 
                                            name={team.name} 
                                            colors={team.colors} 
                                            className="w-full h-full"
                                        />
                                    </div>
                                    <div className="relative flex-1 min-w-0">
                                        <input 
                                            type="text" 
                                            placeholder="Takım Adı"
                                            value={team.name}
                                            onChange={(e) => handleTeamNameInput(team.id, e.target.value)}
                                            onKeyDown={(e) => handleKeyDown(e, team.id)}
                                            onBlur={() => setTimeout(() => setActiveAutocompleteId(null), 200)}
                                            className="bg-transparent border-b border-transparent focus:border-blue-500 outline-none text-white font-medium w-full text-sm py-1 truncate"
                                        />
                                        {activeAutocompleteId === team.id && filteredSuggestions.length > 0 && (
                                            <ul className="absolute z-50 left-0 top-full w-full bg-slate-800 border border-slate-600 rounded-b-lg shadow-xl max-h-48 overflow-y-auto mt-1">
                                                {filteredSuggestions.map((s, idx) => (
                                                    <li 
                                                        key={s.id}
                                                        onClick={() => applySuggestion(team.id, s)}
                                                        className={`px-3 py-2 text-xs cursor-pointer flex items-center gap-2 border-b border-slate-700/50 last:border-0 transition-colors ${idx === suggestionIndex ? 'bg-blue-600 text-white' : 'hover:bg-blue-600 text-slate-200'}`}
                                                    >
                                                        <TeamLogo url={s.logoUrl} name={s.name} colors={s.colors} className="w-4 h-4" showInitials={false} />
                                                        <span>{s.name}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                </div>
                                <div className="flex gap-1">
                                    <button 
                                        onClick={() => handleGenerateLogo(team.id, team.name)}
                                        className="flex-1 bg-slate-700 hover:bg-blue-600 text-slate-300 hover:text-white text-[10px] py-1.5 rounded flex items-center justify-center gap-1"
                                    >
                                        {loadingLogoId === team.id ? <Loader2 size={10} className="animate-spin"/> : <Wand2 size={10}/>} AI Logo
                                    </button>
                                    <div className="relative flex-1">
                                        <input 
                                            type="file" 
                                            className="hidden" 
                                            onChange={(e) => {
                                                const f = e.target.files?.[0];
                                                if(f) {
                                                    const r = new FileReader();
                                                    r.onload = (ev) => handleTeamChange(team.id, 'logoUrl', ev.target?.result as string);
                                                    r.readAsDataURL(f);
                                                }
                                            }}
                                            id={`file-${team.id}`}
                                        />
                                        <label htmlFor={`file-${team.id}`} className="w-full h-full bg-slate-700 hover:bg-slate-600 text-slate-300 cursor-pointer text-[10px] py-1.5 rounded flex items-center justify-center gap-1">
                                            <Upload size={10}/> Yükle
                                        </label>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Owned Columns */}
                {mode === 'owned' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {playerNames.map((pName, pIdx) => (
                            <div key={pIdx} className="bg-slate-800/40 rounded-xl border border-slate-700 overflow-hidden">
                                <div className="bg-slate-900/80 p-3 border-b border-slate-700 flex items-center gap-2">
                                    <div className="bg-purple-500/20 p-1.5 rounded">
                                        <User size={16} className="text-purple-400"/>
                                    </div>
                                    <input 
                                        value={pName}
                                        onChange={(e) => handlePlayerNameUpdate(pIdx, e.target.value)}
                                        className="bg-transparent text-white font-bold outline-none focus:text-purple-400 w-full"
                                    />
                                </div>
                                <div className="p-3 space-y-3">
                                    {teams.filter(t => t.id.startsWith(`u${pIdx}-`)).map((team, tIdx) => (
                                        <div key={team.id} className="flex items-center gap-2 bg-slate-800 p-2 rounded-lg border border-slate-700/50">
                                            <div className="w-8 h-8 flex-shrink-0">
                                                <TeamLogo 
                                                    url={team.logoUrl} 
                                                    name={team.name} 
                                                    colors={team.colors} 
                                                    className="w-full h-full"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="relative w-full">
                                                    <input 
                                                        className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-600 py-1"
                                                        placeholder={`Takım ${tIdx+1}`}
                                                        value={team.name}
                                                        onChange={(e) => handleTeamNameInput(team.id, e.target.value)}
                                                        onKeyDown={(e) => handleKeyDown(e, team.id)}
                                                        onBlur={() => setTimeout(() => setActiveAutocompleteId(null), 200)}
                                                    />
                                                    {activeAutocompleteId === team.id && filteredSuggestions.length > 0 && (
                                                        <ul className="absolute z-50 left-0 top-full w-full bg-slate-800 border border-slate-600 rounded-b-lg shadow-xl max-h-48 overflow-y-auto mt-1">
                                                            {filteredSuggestions.map((s, idx) => (
                                                                <li 
                                                                    key={s.id}
                                                                    onClick={() => applySuggestion(team.id, s)}
                                                                    className={`px-3 py-2 text-xs cursor-pointer flex items-center gap-2 border-b border-slate-700/50 last:border-0 transition-colors ${idx === suggestionIndex ? 'bg-blue-600 text-white' : 'hover:bg-blue-600 text-slate-200'}`}
                                                                >
                                                                    <TeamLogo url={s.logoUrl} name={s.name} colors={s.colors} className="w-4 h-4" showInitials={false} />
                                                                    <span>{s.name}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <button onClick={() => handleGenerateLogo(team.id, team.name)} className="text-[10px] text-blue-400 hover:underline flex items-center gap-0.5">
                                                        {loadingLogoId === team.id ? <Loader2 size={8} className="animate-spin"/> : <Wand2 size={8}/>} AI
                                                    </button>
                                                    <input 
                                                        type="text" 
                                                        placeholder="URL" 
                                                        className="bg-slate-900 text-[10px] px-1 rounded text-slate-400 w-full border-none outline-none"
                                                        value={team.logoUrl === DEFAULT_TEAM_LOGO ? '' : team.logoUrl}
                                                        onChange={(e) => handleTeamChange(team.id, 'logoUrl', e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        )}

        {/* STEP 4: CONFIGURATION */}
        {step === 'config' && (
             <div className="animate-in fade-in zoom-in duration-300 max-w-3xl mx-auto mt-10 text-center">
                <h2 className="text-3xl font-bold text-white mb-2">Matematik ve Kura</h2>
                <p className="text-slate-400 mb-8">
                    Toplam <span className="text-white font-bold">{teams.length} Takım</span> var. 
                    Nasıl bir format istersin?
                </p>

                {groupOptions.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {groupOptions.map((opt, i) => (
                            <button 
                                key={i}
                                onClick={() => handleConfigSelect(opt.numGroups, opt.teamsPerGroup)}
                                className="bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-blue-500 p-6 rounded-xl transition-all group"
                            >
                                <div className="text-3xl font-bold text-white mb-1 group-hover:text-blue-400">{opt.numGroups} GRUP</div>
                                <div className="text-slate-400 text-sm">Her grupta {opt.teamsPerGroup} takım</div>
                                {mode === 'owned' && (
                                    <div className="mt-3 text-xs text-purple-400 bg-purple-900/20 py-1 px-2 rounded inline-block">
                                        Adil Dağılım Aktif
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                ) : (
                    <div className="bg-red-900/20 border border-red-500/50 p-6 rounded-xl text-red-200">
                        <p className="font-bold mb-2">Eşit grup oluşturulamıyor!</p>
                        <p className="text-sm">{teams.length} sayısı eşit gruplara bölünemiyor (Asal sayı veya uygun çarpan yok).</p>
                        <button onClick={() => setStep('register')} className="mt-4 bg-slate-800 px-4 py-2 rounded hover:bg-slate-700">Geri Dön ve Takım Ekle/Çıkar</button>
                    </div>
                )}
                
                {/* Extra Settings */}
                <div className="mt-12 bg-slate-800/50 p-4 rounded-xl inline-flex items-center gap-6 border border-slate-700">
                     <div className="flex items-center gap-2">
                         <span className="text-sm text-slate-400 font-bold uppercase">Fikstür:</span>
                         <select value={fixtureMethod} onChange={(e) => setFixtureMethod(e.target.value as any)} className="bg-slate-900 border border-slate-700 rounded text-sm px-2 py-1">
                             <option value="auto">Otomatik</option>
                             <option value="manual">Manuel</option>
                         </select>
                     </div>
                     {fixtureMethod === 'auto' && (
                         <label className="flex items-center gap-2 cursor-pointer">
                             <input type="checkbox" checked={includeReturnLegs} onChange={(e) => setIncludeReturnLegs(e.target.checked)} className="rounded bg-slate-900 border-slate-700"/>
                             <span className="text-sm text-slate-400">Rövanş Maçları</span>
                         </label>
                     )}
                </div>
             </div>
        )}

        {/* STEP 5: BRACKET */}
        {step === 'bracket' && (
            <TournamentBracket 
                groups={groups}
                players={finalPlayers}
                fixtureMethod={fixtureMethod}
                groupMethod={'manual'} // Always allow manual edits in bracket view
                teamsPerGroup={selectedGroupConfig?.teamsPerGroup || 4}
                onUpdateTeam={(updated) => {
                    setTeams(prev => prev.map(t => t.id === updated.id ? updated : t));
                    setGroups(prev => prev.map(g => ({...g, teams: g.teams.map(t => t.id === updated.id ? updated : t)})));
                }}
                onMatchUpdate={(gName, mId, field, val) => {
                    setGroups(prev => prev.map(g => g.name !== gName ? g : {
                        ...g, matches: g.matches.map(m => m.id !== mId ? m : { ...m, [field]: val === '' ? '' : parseInt(val), isPlayed: val !== '' })
                    }));
                }}
                onAddMatch={(gName) => {
                     setGroups(prev => prev.map(g => g.name !== gName ? g : {
                         ...g, matches: [...g.matches, { id: `m-${Date.now()}`, homeTeamId: '', awayTeamId: '', homeScore: '', awayScore: '', isPlayed: false }]
                     }));
                }}
                onDeleteMatch={(gName, mId) => {
                    setGroups(prev => prev.map(g => g.name !== gName ? g : { ...g, matches: g.matches.filter(m => m.id !== mId) }));
                }}
                onUpdateMatchTeams={(gName, mId, field, tId) => {
                    setGroups(prev => prev.map(g => g.name !== gName ? g : {
                        ...g, matches: g.matches.map(m => m.id !== mId ? m : { ...m, [field]: tId })
                    }));
                }}
                // Manual team management within groups
                onRemoveTeamFromGroup={(gName, tId) => {
                    setGroups(prev => prev.map(g => g.name !== gName ? g : { ...g, teams: g.teams.filter(t => t.id !== tId), matches: [] }));
                }}
                onAddTeamToGroup={(gName, tId) => {
                    const teamToAdd = teams.find(t => t.id === tId);
                    if(teamToAdd) {
                        setGroups(prev => prev.map(g => {
                            if(g.name !== gName) return g;
                            // Re-generate matches if auto
                            const newTeams = [...g.teams, teamToAdd];
                            const matches = fixtureMethod === 'auto' && newTeams.length === (selectedGroupConfig?.teamsPerGroup || 4) 
                                ? generateAutoMatches(newTeams, 0) // Simple generation
                                : g.matches;
                            return { ...g, teams: newTeams, matches: matches };
                        }));
                    }
                }}
            />
        )}

      </main>
    </div>
  );
}

export default App;
