import React, { useState, useEffect } from 'react';
import { Mail, Users, Trash2, RefreshCw, MessageSquare } from 'lucide-react';
import { messageService, type Message, type Subscriber } from '../../services/messageService';
import { cosmic } from './ui/cosmicClassNames';

const AdminInbox: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'messages' | 'subscribers'>('messages');
  const [messages, setMessages] = useState<Message[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      if (activeTab === 'messages') {
        const data = await messageService.getMessages();
        setMessages(data);
      } else {
        const data = await messageService.getSubscribers();
        setSubscribers(data);
      }
    } catch (err) {
      console.error('Failed to fetch data:', err);
      setError('Failed to fetch data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const handleMarkAsRead = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await messageService.markAsRead(id);
      setMessages(messages.map((m) => (m.id === id ? { ...m, read: true } : m)));
      if (selectedMessage?.id === id) {
        setSelectedMessage({ ...selectedMessage, read: true });
      }
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  };

  const handleDeleteMessage = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this message?')) return;
    try {
      await messageService.deleteMessage(id);
      setMessages(messages.filter((m) => m.id !== id));
      if (selectedMessage?.id === id) {
        setSelectedMessage(null);
      }
    } catch (err) {
      console.error('Failed to delete message:', err);
      alert('Failed to delete message');
    }
  };

  const handleDeleteSubscriber = async (id: string) => {
    if (!window.confirm('Are you sure you want to remove this subscriber?')) return;
    try {
      await messageService.deleteSubscriber(id);
      setSubscribers(subscribers.filter((s) => s.id !== id));
    } catch (err) {
      console.error('Failed to delete subscriber:', err);
      alert('Failed to delete subscriber');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className={cosmic.pageTitle}>Inbox</h1>
        <button onClick={fetchData} className={cosmic.buttonIcon} title="Refresh">
          <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-white/[0.06] pb-3">
        <button
          onClick={() => setActiveTab('messages')}
          className={`flex items-center gap-2 ${
            activeTab === 'messages' ? cosmic.tabActive : cosmic.tabInactive
          }`}
        >
          <MessageSquare size={18} />
          Messages
          {messages.some((m) => !m.read) && (
            <span className="ml-1 px-2 py-0.5 text-xs bg-primary-500 text-white rounded-full shadow-lg shadow-primary-500/30">
              {messages.filter((m) => !m.read).length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('subscribers')}
          className={`flex items-center gap-2 ${
            activeTab === 'subscribers' ? cosmic.tabActive : cosmic.tabInactive
          }`}
        >
          <Users size={18} />
          Subscribers
        </button>
      </div>

      {error && <div className={cosmic.alertError}>{error}</div>}

      {/* Content */}
      {loading ? (
        <div className={cosmic.loadingOverlay}>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
        </div>
      ) : (
        <>
          {activeTab === 'messages' ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[600px]">
              {/* Message List */}
              <div className="md:col-span-1 admin-glass rounded-xl overflow-hidden flex flex-col border border-white/[0.06]">
                <div className="overflow-y-auto flex-1 admin-scrollbar">
                  {messages.length === 0 ? (
                    <div className={cosmic.emptyState}>No messages found</div>
                  ) : (
                    <div className="divide-y divide-white/[0.06]">
                      {messages.map((msg) => (
                        <div
                          key={msg.id}
                          onClick={() => {
                            setSelectedMessage(msg);
                            if (!msg.read)
                              // eslint-disable-next-line @typescript-eslint/no-explicit-any
                              handleMarkAsRead(msg.id, { stopPropagation: () => {} } as any);
                          }}
                          className={`p-4 cursor-pointer hover:bg-white/[0.04] transition-colors ${
                            selectedMessage?.id === msg.id
                              ? 'bg-primary-500/10 border-l-2 border-primary-400'
                              : 'border-l-2 border-transparent'
                          } ${!msg.read ? 'border-l-2 border-primary-500' : ''}`}
                        >
                          <div className="flex justify-between items-start mb-1">
                            <div className="flex items-center gap-2">
                              {!msg.read && (
                                <span className="w-2 h-2 rounded-full bg-primary-500 shadow-[0_0_8px_rgba(6,182,212,0.5)] flex-shrink-0" />
                              )}
                              <h3
                                className={`font-medium text-sm truncate pr-2 ${!msg.read ? 'text-secondary-50 font-bold' : 'text-secondary-300'}`}
                              >
                                {msg.name}
                              </h3>
                            </div>
                            <span className="text-xs text-secondary-500 flex-shrink-0">
                              {new Date(msg.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm text-secondary-400 truncate mb-1">{msg.subject}</p>
                          <p className="text-xs text-secondary-500 truncate">{msg.message}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Message Detail */}
              <div className="md:col-span-2 admin-glass rounded-xl p-6 overflow-y-auto admin-scrollbar border border-white/[0.06]">
                {selectedMessage ? (
                  <div className="space-y-6">
                    <div className="flex justify-between items-start border-b border-white/[0.06] pb-4">
                      <div>
                        <h2 className={`${cosmic.sectionTitle} mb-2`}>{selectedMessage.subject}</h2>
                        <div className="flex items-center gap-2 text-sm text-secondary-400">
                          <span className="font-medium text-secondary-200">
                            {selectedMessage.name}
                          </span>
                          <span>&lt;{selectedMessage.email}&gt;</span>
                        </div>
                        <div className="text-xs text-secondary-500 mt-1">
                          {formatDate(selectedMessage.created_at)}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={(e) => handleDeleteMessage(selectedMessage.id, e)}
                          className={cosmic.buttonIcon + ' text-error-400 hover:text-error-300'}
                          title="Delete"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                    <div className="prose prose-invert max-w-none whitespace-pre-wrap text-secondary-300">
                      {selectedMessage.message}
                    </div>
                    <div className="pt-8 border-t border-white/[0.06]">
                      <a
                        href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}
                        className={`inline-flex items-center gap-2 ${cosmic.buttonPrimary}`}
                      >
                        <Mail size={16} />
                        Reply via Email
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-secondary-500">
                    <Mail size={48} className="mb-4 opacity-50" />
                    <p>Select a message to read</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="admin-glass rounded-xl overflow-hidden border border-white/[0.06]">
              <div className={cosmic.tableWrapper}>
                <table className={cosmic.table}>
                  <thead className={cosmic.tableHead}>
                    <tr>
                      <th scope="col" className={cosmic.tableHeadCell}>
                        Email
                      </th>
                      <th scope="col" className={cosmic.tableHeadCell}>
                        Subscribed Date
                      </th>
                      <th scope="col" className={`${cosmic.tableHeadCell} text-right`}>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className={cosmic.tableBody}>
                    {subscribers.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="px-6 py-12 text-center text-secondary-500">
                          No subscribers yet
                        </td>
                      </tr>
                    ) : (
                      subscribers.map((sub) => (
                        <tr key={sub.id} className={cosmic.tableRow}>
                          <td className={`${cosmic.tableCell} font-medium text-secondary-50`}>
                            {sub.email}
                          </td>
                          <td className={cosmic.tableCell}>{formatDate(sub.subscribed_at)}</td>
                          <td className={`${cosmic.tableCell} text-right`}>
                            <button
                              onClick={() => handleDeleteSubscriber(sub.id)}
                              className={`${cosmic.linkDelete} p-1`}
                              title="Remove Subscriber"
                            >
                              <Trash2 size={18} />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              <div className="bg-elevated/50 px-6 py-4 border-t border-white/[0.06]">
                <div className="text-sm text-secondary-400">
                  Total Subscribers:{' '}
                  <span className="font-bold text-secondary-50">{subscribers.length}</span>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminInbox;
