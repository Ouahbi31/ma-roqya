import { useState } from 'react';
import { CalendarDays, MessageSquare, CreditCard, Users } from 'lucide-react';
import AdminDisponibilites from '../components/admin/AdminDisponibilites';
import AdminMessages from '../components/admin/AdminMessages';
import AdminReservations from '../components/admin/AdminReservations';
import AdminUtilisateurs from '../components/admin/AdminUtilisateurs';

type Tab = 'reservations' | 'disponibilites' | 'messages' | 'utilisateurs';

const TABS: { key: Tab; label: string; icon: typeof CalendarDays }[] = [
  { key: 'reservations', label: 'Réservations', icon: CreditCard },
  { key: 'disponibilites', label: 'Disponibilités', icon: CalendarDays },
  { key: 'messages', label: 'Messages', icon: MessageSquare },
  { key: 'utilisateurs', label: 'Utilisateurs', icon: Users },
];

export default function Admin() {
  const [activeTab, setActiveTab] = useState<Tab>('reservations');

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
        <div className="mb-8 flex gap-2 overflow-x-auto">
          {TABS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition whitespace-nowrap ${
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
        {activeTab === 'reservations' && <AdminReservations />}
        {activeTab === 'disponibilites' && <AdminDisponibilites />}
        {activeTab === 'messages' && <AdminMessages />}
        {activeTab === 'utilisateurs' && <AdminUtilisateurs />}
      </div>
    </div>
  );
}
