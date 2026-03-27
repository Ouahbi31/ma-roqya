import { useState, useEffect, useCallback } from 'react';
import { Mail, Bug, Lightbulb, Check, Loader2, ChevronDown } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Message {
  id: string;
  nom: string;
  email: string;
  type: 'contact' | 'bug' | 'suggestion';
  sujet: string;
  message: string;
  lu: boolean;
  created_at: string;
}

const TYPE_CONFIG = {
  contact: { label: 'Contact', icon: Mail, color: 'bg-green-islamic/10 text-green-islamic' },
  bug: { label: 'Bug', icon: Bug, color: 'bg-red-100 text-red-600' },
  suggestion: { label: 'Suggestion', icon: Lightbulb, color: 'bg-amber-100 text-amber-700' },
};

export default function AdminMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterUnread, setFilterUnread] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchMessages = useCallback(async () => {
    const { data } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setMessages(data as Message[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const markAsRead = async (id: string) => {
    await supabase.from('contact_messages').update({ lu: true }).eq('id', id);
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, lu: true } : m)));
  };

  const filtered = messages.filter((m) => {
    if (filterType !== 'all' && m.type !== filterType) return false;
    if (filterUnread && m.lu) return false;
    return true;
  });

  const unreadCount = messages.filter((m) => !m.lu).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-green-islamic" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-heading text-xl font-bold text-green-islamic">
            Messages reçus
          </h2>
          <p className="mt-1 text-sm text-text-secondary">
            {unreadCount > 0
              ? `${unreadCount} message${unreadCount > 1 ? 's' : ''} non lu${unreadCount > 1 ? 's' : ''}`
              : 'Tous les messages sont lus'}
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {['all', 'contact', 'bug', 'suggestion'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                filterType === type
                  ? 'bg-green-islamic text-white'
                  : 'border border-cream-dark bg-white text-text-secondary hover:border-green-islamic'
              }`}
            >
              {type === 'all' ? 'Tous' : TYPE_CONFIG[type as keyof typeof TYPE_CONFIG].label}
            </button>
          ))}
          <label className="flex items-center gap-1.5 text-xs text-text-secondary">
            <input
              type="checkbox"
              checked={filterUnread}
              onChange={(e) => setFilterUnread(e.target.checked)}
              className="rounded"
            />
            Non lus
          </label>
        </div>
      </div>

      {/* Messages list */}
      {filtered.length === 0 ? (
        <div className="py-20 text-center">
          <Mail className="mx-auto h-12 w-12 text-cream-dark" />
          <p className="mt-4 text-text-secondary">Aucun message</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((msg) => {
            const config = TYPE_CONFIG[msg.type];
            const Icon = config.icon;
            const isExpanded = expandedId === msg.id;

            return (
              <div
                key={msg.id}
                className={`overflow-hidden rounded-2xl border bg-white/70 transition ${
                  msg.lu ? 'border-cream-dark' : 'border-green-islamic/30 bg-green-islamic/5'
                }`}
              >
                <button
                  onClick={() => setExpandedId(isExpanded ? null : msg.id)}
                  className="flex w-full items-start gap-3 p-4 text-left"
                >
                  <span className={`mt-0.5 shrink-0 rounded-full p-1.5 ${config.color}`}>
                    <Icon size={14} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-text-primary truncate">
                        {msg.sujet}
                      </span>
                      {!msg.lu && (
                        <span className="shrink-0 rounded-full bg-green-islamic px-2 py-0.5 text-[10px] font-bold text-white">
                          Nouveau
                        </span>
                      )}
                    </div>
                    <div className="mt-1 flex items-center gap-2 text-xs text-text-secondary">
                      <span>{msg.nom}</span>
                      <span>·</span>
                      <span>{new Date(msg.created_at).toLocaleDateString('fr-FR')}</span>
                    </div>
                  </div>
                  <ChevronDown
                    size={18}
                    className={`shrink-0 text-text-secondary transition-transform ${
                      isExpanded ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isExpanded && (
                  <div className="border-t border-cream-dark px-4 pb-4 pt-3">
                    <p className="text-xs text-text-secondary mb-1">
                      {msg.email}
                    </p>
                    <p className="whitespace-pre-wrap text-sm leading-relaxed text-text-primary">
                      {msg.message}
                    </p>
                    {!msg.lu && (
                      <button
                        onClick={() => markAsRead(msg.id)}
                        className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-green-islamic px-4 py-1.5 text-xs font-medium text-white transition hover:bg-green-islamic/90"
                      >
                        <Check size={14} />
                        Marquer comme lu
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
