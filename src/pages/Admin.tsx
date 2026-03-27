import { useState } from 'react';
import { CalendarDays, MessageSquare } from 'lucide-react';
import AdminDisponibilites from '../components/admin/AdminDisponibilites';
import AdminMessages from '../components/admin/AdminMessages';

type Tab = 'disponibilites' | 'messages';

const TABS: { key: Tab; label: string; icon: typeof CalendarDays }[] = [
  { key: 'disponibilites', label: 'Disponibilités', icon: CalendarDays },
  { key: 'messages', label: 'Messages', icon: MessageSquare },
];

export default function Admin() {
  const [activeTab, setActiveTab] = useState<Tab>('disponibilites');

  return (
    <div className="min-h-screen bg-cream">
      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-heading text-3xl font-bold text-green-islamic">
            Administration
          </h1>
          <p className="mt-1 text-text-secondary">
            Gérez votre site depuis un seul endroit
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-8 flex gap-2">
          {TABS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                activeTab === key
                  ? 'bg-green-islamic text-white shadow-sm'
                  : 'border-2 border-green-islamic text-green-islamic hover:bg-green-islamic/5'
              }`}
            >
              <Icon size={18} />
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === 'disponibilites' && <AdminDisponibilites />}
        {activeTab === 'messages' && <AdminMessages />}
      </div>
    </div>
  );
}
