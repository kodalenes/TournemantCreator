import React, { useState, useRef } from 'react';
import { Team } from '../types';
import { editTeamLogo } from '../services/geminiService';
import { Loader2, Wand2, Upload, Palette } from 'lucide-react';
import { TeamLogo } from './TeamLogo';

interface TeamCardProps {
  team: Team;
  onUpdateTeam: (updatedTeam: Team) => void;
  editable?: boolean;
}

export const TeamCard: React.FC<TeamCardProps> = ({ team, onUpdateTeam, editable = false }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleEditLogo = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    try {
      const newLogo = await editTeamLogo(team.logoUrl, prompt);
      if (newLogo) {
        onUpdateTeam({ ...team, logoUrl: newLogo });
        setIsEditing(false);
        setPrompt('');
      }
    } catch (error: any) {
      alert(error.message || "Logo düzenlenirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        onUpdateTeam({ ...team, logoUrl: result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-slate-800 rounded-xl p-4 border border-slate-700 shadow-lg flex flex-col items-center text-center relative group transition-all hover:border-blue-500/50 w-full">
      <div className="relative w-24 h-24 mb-3 group/image">
        <TeamLogo 
          url={team.logoUrl} 
          name={team.name} 
          colors={team.colors} 
          className="w-full h-full"
        />
        
        {editable && !isEditing && (
          <div className="absolute -bottom-2 -right-2 flex gap-1 opacity-100 transition-opacity">
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileUpload} 
              className="hidden" 
              accept="image/*"
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="bg-slate-700 text-white p-1.5 rounded-full shadow-lg hover:bg-slate-600 transition-colors border border-slate-600"
              title="Cihazdan Yükle"
            >
              <Upload size={14} />
            </button>
            <button 
              onClick={() => setIsEditing(true)}
              className="bg-blue-600 text-white p-1.5 rounded-full shadow-lg hover:bg-blue-500 transition-colors border border-blue-500"
              title="Yapay Zeka ile Düzenle"
            >
              <Wand2 size={14} />
            </button>
          </div>
        )}
      </div>
      
      {editable ? (
         <input 
            type="text"
            value={team.name}
            onChange={(e) => onUpdateTeam({...team, name: e.target.value})}
            className="font-bold text-lg text-white bg-transparent border-b border-slate-600 focus:border-blue-500 focus:outline-none text-center w-full mb-1"
         />
      ) : (
        <div className="flex flex-col items-center">
            <h3 className="font-bold text-lg text-white">{team.name}</h3>
            {team.ownerName && (
                <span className="text-xs text-blue-400 font-medium">({team.ownerName})</span>
            )}
        </div>
      )}
      
      <div className="flex items-center justify-center gap-1.5 mt-1 w-full">
        <Palette size={10} className="text-slate-500" />
        {editable ? (
            <input 
                type="text" 
                value={team.colors} 
                onChange={(e) => onUpdateTeam({...team, colors: e.target.value})}
                className="text-xs text-slate-300 bg-slate-900/50 border border-slate-700 rounded px-2 py-0.5 text-center w-2/3 focus:border-blue-500 focus:outline-none"
                placeholder="Renkler"
            />
        ) : (
            <p className="text-xs text-slate-400 uppercase tracking-wider truncate max-w-[120px]">{team.colors}</p>
        )}
      </div>

      {isEditing && (
        <div className="absolute inset-0 bg-slate-900/95 backdrop-blur-sm rounded-xl p-4 flex flex-col justify-center items-center z-10">
          <h4 className="text-sm font-medium text-blue-400 mb-2">Logo Düzenle (AI)</h4>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Örn: 'Retro filtre ekle', 'Arka planı kaldır', 'Mavi alevler ekle'..."
            className="w-full text-xs bg-slate-800 border border-slate-600 rounded p-2 mb-2 text-white focus:outline-none focus:border-blue-500 resize-none"
            rows={3}
          />
          <div className="flex gap-2 w-full">
            <button 
              onClick={() => setIsEditing(false)}
              className="flex-1 bg-slate-700 text-xs py-1.5 rounded hover:bg-slate-600 text-white"
              disabled={loading}
            >
              İptal
            </button>
            <button 
              onClick={handleEditLogo}
              className="flex-1 bg-blue-600 text-xs py-1.5 rounded hover:bg-blue-500 text-white flex justify-center items-center gap-1"
              disabled={loading}
            >
              {loading ? <Loader2 size={12} className="animate-spin" /> : 'Uygula'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};