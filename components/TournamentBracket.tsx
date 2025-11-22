import React, { useState, useMemo } from 'react';
import { Group, Team, TeamStats, Match, Player } from '../types';
import { TeamCard } from './TeamCard';
import { generateGroupAnalysis } from '../services/geminiService';
import { Bot, Sparkles, Edit3, X, Plus, Trash2, UserPlus } from 'lucide-react';
import { TeamLogo } from './TeamLogo';

interface TournamentBracketProps {
  groups: Group[];
  players?: Player[]; 
  fixtureMethod: 'auto' | 'manual';
  groupMethod?: 'auto' | 'manual';
  teamsPerGroup?: number;
  onUpdateTeam: (team: Team) => void;
  onMatchUpdate: (groupName: string, matchId: string, field: 'homeScore' | 'awayScore', value: string) => void;
  onAddMatch: (groupName: string) => void;
  onDeleteMatch: (groupName: string, matchId: string) => void;
  onUpdateMatchTeams: (groupName: string, matchId: string, field: 'homeTeamId' | 'awayTeamId', teamId: string) => void;
  onAddTeamToGroup?: (groupName: string, teamId: string) => void;
  onRemoveTeamFromGroup?: (groupName: string, teamId: string) => void;
}

export const TournamentBracket: React.FC<TournamentBracketProps> = ({ 
    groups, 
    players,
    fixtureMethod,
    groupMethod = 'auto',
    teamsPerGroup = 3,
    onUpdateTeam, 
    onMatchUpdate,
    onAddMatch,
    onDeleteMatch,
    onUpdateMatchTeams,
    onAddTeamToGroup,
    onRemoveTeamFromGroup
}) => {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);

  const handleAnalyze = async () => {
    setLoadingAnalysis(true);
    const result = await generateGroupAnalysis(groups);
    setAnalysis(result);
    setLoadingAnalysis(false);
  };

  // Helper to get unassigned teams
  const unassignedTeams = useMemo(() => {
    if (!players) return [];
    const assignedTeamIds = new Set(groups.flatMap(g => g.teams.map(t => t.id)));
    const available: { player: string, teams: Team[] }[] = [];

    players.forEach(p => {
      const playerTeams = p.teams.filter(t => !assignedTeamIds.has(t.id));
      if (playerTeams.length > 0) {
        available.push({ player: p.name, teams: playerTeams });
      }
    });
    return available;
  }, [groups, players]);


  // Helper to calculate standings based on current match scores
  const calculateStandings = (group: Group): TeamStats[] => {
    const stats: Record<string, TeamStats> = {};

    // Initialize
    group.teams.forEach(team => {
      stats[team.id] = {
        teamId: team.id,
        played: 0,
        won: 0,
        drawn: 0,
        lost: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        points: 0
      };
    });

    // Process matches
    group.matches.forEach(match => {
      if (match.homeScore !== '' && match.awayScore !== '' && match.homeTeamId && match.awayTeamId) {
        const h = match.homeScore as number;
        const a = match.awayScore as number;
        const homeId = match.homeTeamId;
        const awayId = match.awayTeamId;

        if (stats[homeId] && stats[awayId]) {
            stats[homeId].played++;
            stats[awayId].played++;
            
            stats[homeId].goalsFor += h;
            stats[homeId].goalsAgainst += a;
            stats[awayId].goalsFor += a;
            stats[awayId].goalsAgainst += h;

            if (h > a) {
                stats[homeId].won++;
                stats[homeId].points += 3;
                stats[awayId].lost++;
            } else if (h < a) {
                stats[awayId].won++;
                stats[awayId].points += 3;
                stats[homeId].lost++;
            } else {
                stats[homeId].drawn++;
                stats[homeId].points += 1;
                stats[awayId].drawn++;
                stats[awayId].points += 1;
            }
        }
      }
    });

    return Object.values(stats).sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      const gdA = a.goalsFor - a.goalsAgainst;
      const gdB = b.goalsFor - b.goalsAgainst;
      if (gdB !== gdA) return gdB - gdA;
      return b.goalsFor - a.goalsFor;
    });
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold text-white">Turnuva Fikstürü & Puan Durumu</h2>
        <button
          onClick={handleAnalyze}
          disabled={loadingAnalysis}
          className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-4 py-2 rounded-lg transition-all shadow-lg shadow-indigo-500/20 text-sm font-medium"
        >
          {loadingAnalysis ? (
            <Sparkles className="animate-spin" size={18} />
          ) : (
            <Bot size={18} />
          )}
          <span>AI Analiz</span>
        </button>
      </div>

      {/* AI Analysis Output */}
      {analysis && (
        <div className="bg-slate-800/50 border border-indigo-500/30 rounded-xl p-6 mb-8 text-indigo-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500" />
          <h3 className="text-indigo-400 font-semibold mb-2 flex items-center gap-2">
            <Sparkles size={16} /> 
            Gemini 2.5 Flash Yorumu
          </h3>
          <p className="text-sm leading-relaxed whitespace-pre-line">{analysis}</p>
        </div>
      )}

      {/* Groups Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {groups.map((group) => {
          const standings = calculateStandings(group);
          
          return (
            <div key={group.name} className="bg-slate-800/30 border border-slate-700 rounded-2xl overflow-hidden flex flex-col h-full">
              
              {/* Group Header */}
              <div className="bg-slate-800/80 p-4 border-b border-slate-700 flex justify-between items-center">
                <h3 className="text-xl font-bold text-slate-200">Grup {group.name}</h3>
                <div className="text-xs text-slate-500 bg-slate-900 px-2 py-1 rounded border border-slate-700">
                  {group.matches.filter(m => m.isPlayed).length} / {group.matches.length} Maç Oynandı
                </div>
              </div>

              <div className="p-4 space-y-6">
                
                {/* Standings Table */}
                <div className="overflow-x-auto rounded-lg border border-slate-700/50">
                  <table className="w-full text-left text-sm text-slate-400">
                    <thead className="bg-slate-900/50 text-xs uppercase font-medium text-slate-300">
                      <tr>
                        <th className="px-3 py-2 text-center w-10">#</th>
                        <th className="px-3 py-2">Takım</th>
                        <th className="px-2 py-2 text-center" title="Oynanan">O</th>
                        <th className="px-2 py-2 text-center" title="Galibiyet">G</th>
                        <th className="px-2 py-2 text-center" title="Beraberlik">B</th>
                        <th className="px-2 py-2 text-center" title="Mağlubiyet">M</th>
                        <th className="px-2 py-2 text-center" title="Averaj">Av</th>
                        <th className="px-3 py-2 text-center font-bold text-white" title="Puan">P</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/50">
                      {/* Render specific team rows first */}
                      {standings.map((stat, index) => {
                        const team = group.teams.find(t => t.id === stat.teamId);
                        if (!team) return null;
                        return (
                          <tr key={stat.teamId} className="hover:bg-slate-700/30 transition-colors group/row">
                            <td className={`px-3 py-2 text-center font-medium ${index === 0 ? 'text-green-400' : 'text-slate-500'}`}>
                              {index + 1}
                            </td>
                            <td className="px-3 py-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <button 
                                            onClick={() => setEditingTeam(team || null)}
                                            className="group/img relative flex-shrink-0"
                                        >
                                            <TeamLogo 
                                                url={team.logoUrl} 
                                                name={team.name} 
                                                colors={team.colors} 
                                                className="w-6 h-6"
                                                showInitials={false}
                                            />
                                            <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition-opacity">
                                                <Edit3 size={10} className="text-white"/>
                                            </div>
                                        </button>
                                        <div className="flex flex-col">
                                            <span className="text-slate-200 font-medium truncate max-w-[100px] sm:max-w-[120px]">
                                                {team.name}
                                            </span>
                                            {team.ownerName && (
                                                <span className="text-[10px] text-purple-400 truncate max-w-[100px]">
                                                    ({team.ownerName})
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    
                                    {/* Remove Team Button (Manual Mode) */}
                                    {groupMethod === 'manual' && onRemoveTeamFromGroup && (
                                        <button 
                                            onClick={() => onRemoveTeamFromGroup(group.name, team.id)}
                                            className="opacity-0 group-hover/row:opacity-100 text-slate-600 hover:text-red-400 transition-all ml-1"
                                            title="Takımı Gruptan Çıkar"
                                        >
                                            <X size={14} />
                                        </button>
                                    )}
                                </div>
                            </td>
                            <td className="px-2 py-2 text-center">{stat.played}</td>
                            <td className="px-2 py-2 text-center">{stat.won}</td>
                            <td className="px-2 py-2 text-center">{stat.drawn}</td>
                            <td className="px-2 py-2 text-center">{stat.lost}</td>
                            <td className="px-2 py-2 text-center">{stat.goalsFor - stat.goalsAgainst}</td>
                            <td className="px-3 py-2 text-center font-bold text-white bg-slate-700/30">{stat.points}</td>
                          </tr>
                        );
                      })}

                      {/* Empty Slots for Manual Mode */}
                      {groupMethod === 'manual' && group.teams.length < teamsPerGroup && (
                        <tr>
                            <td colSpan={8} className="px-3 py-2">
                                {onAddTeamToGroup && (
                                    <div className="flex items-center gap-2">
                                        <UserPlus size={14} className="text-slate-500"/>
                                        <select 
                                            className="bg-slate-800 text-xs text-slate-300 border border-slate-600 rounded px-2 py-1.5 w-full focus:outline-none focus:border-blue-500"
                                            onChange={(e) => {
                                                if(e.target.value) onAddTeamToGroup(group.name, e.target.value);
                                            }}
                                            value=""
                                        >
                                            <option value="">Takım Ekle...</option>
                                            {unassignedTeams.map(groupItem => (
                                                <optgroup key={groupItem.player} label={groupItem.player}>
                                                    {groupItem.teams.map(t => (
                                                        <option key={t.id} value={t.id}>{t.name}</option>
                                                    ))}
                                                </optgroup>
                                            ))}
                                        </select>
                                    </div>
                                )}
                            </td>
                        </tr>
                      )}
                      
                      {/* Fallback for empty auto mode or fully empty manual */}
                      {group.teams.length === 0 && groupMethod !== 'manual' && (
                          <tr>
                              <td colSpan={8} className="px-3 py-4 text-center text-slate-600 italic text-sm">
                                  Grup oluşturulmadı.
                              </td>
                          </tr>
                      )}

                    </tbody>
                  </table>
                </div>

                {/* Fixtures / Matches */}
                <div>
                    <div className="flex justify-between items-center mb-3 pl-1">
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Fikstür</h4>
                        {fixtureMethod === 'manual' && (
                            <button 
                                onClick={() => onAddMatch(group.name)}
                                className="text-xs bg-slate-700 hover:bg-slate-600 text-slate-300 px-2 py-1 rounded flex items-center gap-1 transition-colors"
                            >
                                <Plus size={12} /> Maç Ekle
                            </button>
                        )}
                    </div>

                    <div className="space-y-2">
                        {group.matches.map((match) => {
                            const homeTeam = group.teams.find(t => t.id === match.homeTeamId);
                            const awayTeam = group.teams.find(t => t.id === match.awayTeamId);
                            const isConfigurable = fixtureMethod === 'manual';
                            
                            return (
                                <div key={match.id} className="bg-slate-900/40 p-2 rounded-lg border border-slate-700/50 flex items-center justify-between gap-2">
                                    
                                    {/* Home */}
                                    <div className="flex items-center gap-2 flex-1 overflow-hidden">
                                        {isConfigurable && !match.isPlayed ? (
                                            <select 
                                                value={match.homeTeamId}
                                                onChange={(e) => onUpdateMatchTeams(group.name, match.id, 'homeTeamId', e.target.value)}
                                                className="w-full bg-slate-800 text-xs text-slate-300 border border-slate-600 rounded px-1 py-1 focus:outline-none focus:border-blue-500"
                                            >
                                                <option value="">Seçiniz</option>
                                                {group.teams.map(t => (
                                                    <option key={t.id} value={t.id} disabled={t.id === match.awayTeamId}>{t.name}</option>
                                                ))}
                                            </select>
                                        ) : (
                                            <>
                                                <TeamLogo 
                                                    url={homeTeam?.logoUrl || ''} 
                                                    name={homeTeam?.name || ''} 
                                                    colors={homeTeam?.colors || ''} 
                                                    className="w-5 h-5 flex-shrink-0 opacity-80" 
                                                    showInitials={false}
                                                />
                                                <span className="text-xs sm:text-sm text-slate-300 truncate">{homeTeam?.name || '...'}</span>
                                            </>
                                        )}
                                    </div>

                                    {/* Scores */}
                                    <div className="flex items-center gap-1 bg-slate-800 rounded p-1">
                                        <input 
                                            type="number" 
                                            min="0" 
                                            value={match.homeScore}
                                            onChange={(e) => onMatchUpdate(group.name, match.id, 'homeScore', e.target.value)}
                                            className="w-8 h-6 bg-slate-700 text-center text-sm text-white rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        />
                                        <span className="text-slate-500 font-bold px-1">-</span>
                                        <input 
                                            type="number" 
                                            min="0" 
                                            value={match.awayScore}
                                            onChange={(e) => onMatchUpdate(group.name, match.id, 'awayScore', e.target.value)}
                                            className="w-8 h-6 bg-slate-700 text-center text-sm text-white rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        />
                                    </div>

                                    {/* Away */}
                                    <div className="flex items-center gap-2 flex-1 overflow-hidden justify-end">
                                        {isConfigurable && !match.isPlayed ? (
                                            <select 
                                                value={match.awayTeamId}
                                                onChange={(e) => onUpdateMatchTeams(group.name, match.id, 'awayTeamId', e.target.value)}
                                                className="w-full bg-slate-800 text-xs text-slate-300 border border-slate-600 rounded px-1 py-1 focus:outline-none focus:border-blue-500 text-right"
                                            >
                                                <option value="">Seçiniz</option>
                                                {group.teams.map(t => (
                                                    <option key={t.id} value={t.id} disabled={t.id === match.homeTeamId}>{t.name}</option>
                                                ))}
                                            </select>
                                        ) : (
                                            <>
                                                <span className="text-xs sm:text-sm text-slate-300 truncate text-right">{awayTeam?.name || '...'}</span>
                                                <TeamLogo 
                                                    url={awayTeam?.logoUrl || ''} 
                                                    name={awayTeam?.name || ''} 
                                                    colors={awayTeam?.colors || ''} 
                                                    className="w-5 h-5 flex-shrink-0 opacity-80" 
                                                    showInitials={false}
                                                />
                                            </>
                                        )}
                                    </div>

                                    {/* Delete Button for Manual Mode */}
                                    {isConfigurable && (
                                        <button 
                                            onClick={() => onDeleteMatch(group.name, match.id)}
                                            className="ml-1 text-slate-600 hover:text-red-400 transition-colors"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    )}

                                </div>
                            );
                        })}
                        {group.matches.length === 0 && (
                            <div className="text-center text-slate-600 text-xs py-2 italic">
                                {groupMethod === 'manual' && group.teams.length < 2 ? 'Takımları ekleyiniz.' : 'Henüz maç eklenmedi.'}
                            </div>
                        )}
                    </div>
                </div>

              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Team Modal Overlay */}
      {editingTeam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="w-full max-w-md">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-white font-bold text-lg">Logo Düzenle: {editingTeam.name}</h3>
                    <button onClick={() => setEditingTeam(null)} className="text-slate-400 hover:text-white">
                        <X size={24} />
                    </button>
                </div>
                <TeamCard 
                    team={editingTeam} 
                    onUpdateTeam={(t) => {
                        onUpdateTeam(t);
                        // Don't close automatically to let them see the result, or update local state
                        setEditingTeam(t); 
                    }} 
                    editable={true} 
                />
            </div>
        </div>
      )}

    </div>
  );
};