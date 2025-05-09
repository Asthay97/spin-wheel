import React, { useState } from 'react';
import { X, Plus, Edit2, Check, UserPlus } from 'lucide-react';
import { Participant } from '../types';
import { getColorByIndex } from '../utils/colors';

interface ParticipantListProps {
  participants: Participant[];
  onUpdateParticipants: (participants: Participant[]) => void;
  isSpinning: boolean;
}

const ParticipantList: React.FC<ParticipantListProps> = ({
  participants,
  onUpdateParticipants,
  isSpinning
}) => {
  const [newName, setNewName] = useState('');
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const handleAddParticipant = () => {
    if (newName.trim() && !isSpinning) {
      const newParticipant: Participant = {
        id: Date.now().toString(),
        name: newName.trim(),
        color: getColorByIndex(participants.length)
      };
      onUpdateParticipants([...participants, newParticipant]);
      setNewName('');
    }
  };

  const handleRemoveParticipant = (id: string) => {
    if (!isSpinning) {
      onUpdateParticipants(participants.filter(p => p.id !== id));
    }
  };

  const handleEditStart = (participant: Participant) => {
    if (!isSpinning) {
      setEditId(participant.id);
      setEditName(participant.name);
    }
  };

  const handleEditSave = () => {
    if (editName.trim() && !isSpinning) {
      onUpdateParticipants(
        participants.map(p =>
          p.id === editId ? { ...p, name: editName.trim() } : p
        )
      );
      setEditId(null);
      setEditName('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (editId) {
        handleEditSave();
      } else {
        handleAddParticipant();
      }
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto bg-white rounded-2xl shadow-xl p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Participants</h2>
        <span className="bg-indigo-50 text-indigo-700 text-sm font-medium px-3 py-1 rounded-full">
          {participants.length} Total
        </span>
      </div>

      <div className="flex mb-6">
        <div className="relative flex-1">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter participant name"
            className="w-full px-4 py-3 pl-12 border border-gray-200 rounded-l-xl
                     focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                     placeholder-gray-400 transition-all duration-200"
            disabled={isSpinning}
          />
          <UserPlus size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
        <button
          onClick={handleAddParticipant}
          disabled={!newName.trim() || isSpinning}
          className="px-6 bg-indigo-600 text-white rounded-r-xl hover:bg-indigo-700
                   focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
                   disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          <Plus size={20} />
        </button>
      </div>

      {participants.length === 0 ? (
        <div className="text-center py-8 px-4 border-2 border-dashed border-gray-200 rounded-xl">
          <p className="text-gray-500">Add participants to begin the selection process</p>
        </div>
      ) : (
        <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 -mr-2">
          {participants.map((participant) => (
            <div
              key={participant.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-xl
                       border-l-4 transition-all duration-200 hover:shadow-md"
              style={{ borderLeftColor: participant.color }}
            >
              {editId === participant.id ? (
                <div className="flex-1 flex items-center gap-2">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg
                             focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    autoFocus
                  />
                  <button
                    onClick={handleEditSave}
                    className="p-2 text-green-600 hover:text-green-700
                             focus:outline-none focus:ring-2 focus:ring-green-500 rounded-lg"
                  >
                    <Check size={18} />
                  </button>
                </div>
              ) : (
                <>
                  <span className="text-gray-800 font-medium">{participant.name}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEditStart(participant)}
                      className="p-2 text-gray-500 hover:text-gray-700
                               focus:outline-none focus:ring-2 focus:ring-gray-300 rounded-lg"
                      disabled={isSpinning}
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleRemoveParticipant(participant.id)}
                      className="p-2 text-red-500 hover:text-red-600
                               focus:outline-none focus:ring-2 focus:ring-red-300 rounded-lg"
                      disabled={isSpinning}
                    >
                      <X size={16} />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      {participants.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-100">
          <p className="text-sm text-gray-500 flex items-center justify-center">
            {isSpinning ? (
              <span className="flex items-center gap-2">
                <span className="block w-2 h-2 bg-indigo-600 rounded-full animate-pulse" />
                Selection in progress...
              </span>
            ) : (
              ''
            )}
          </p>
        </div>
      )}
    </div>
  );
};

export default ParticipantList;