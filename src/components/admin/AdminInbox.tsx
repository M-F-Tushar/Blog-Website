import React, { useState, useEffect } from 'react';
import { Mail, Users, Trash2, CheckCircle, RefreshCw, Eye, MessageSquare } from 'lucide-react';
import { messageService, Message, Subscriber } from '../../services/messageService';

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
        <h1 className="text-3xl font-bold font-serif text-gray-900 dark:text-white">Inbox</h1>
        <button
          onClick={fetchData}
          className="p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
          title="Refresh"
        >
          <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveTab('messages')}
          className={`flex items-center gap-2 px-6 py-3 border-b-2 font-medium text-sm transition-colors ${
            activeTab === 'messages'
              ? 'border-primary-500 text-primary-600 dark:text-primary-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
          }`}
        >
          <MessageSquare size={18} />
          Messages
          {messages.some((m) => !m.read) && (
            <span className="ml-1 px-2 py-0.5 text-xs bg-red-500 text-white rounded-full">
              {messages.filter((m) => !m.read).length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('subscribers')}
          className={`flex items-center gap-2 px-6 py-3 border-b-2 font-medium text-sm transition-colors ${
            activeTab === 'subscribers'
              ? 'border-primary-500 text-primary-600 dark:text-primary-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
          }`}
        >
          <Users size={18} />
          Subscribers
        </button>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg">
          {error}
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
        </div>
      ) : (
        <>
          {activeTab === 'messages' ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[600px]">
              {/* Message List */}
              <div className="md:col-span-1 bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden flex flex-col">
                <div className="overflow-y-auto flex-1">
                  {messages.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">No messages found</div>
                  ) : (
                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                      {messages.map((msg) => (
                        <div
                          key={msg.id}
                          onClick={() => {
                            setSelectedMessage(msg);
                            if (!msg.read)
                              handleMarkAsRead(msg.id, { stopPropagation: () => {} } as any);
                          }}
                          className={`p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                            selectedMessage?.id === msg.id
                              ? 'bg-indigo-50 dark:bg-indigo-900/20'
                              : ''
                          } ${!msg.read ? 'border-l-4 border-primary-500' : 'border-l-4 border-transparent'}`}
                        >
                          <div className="flex justify-between items-start mb-1">
                            <h3
                              className={`font-medium text-sm truncate pr-2 ${!msg.read ? 'text-gray-900 dark:text-white font-bold' : 'text-gray-700 dark:text-gray-300'}`}
                            >
                              {msg.name}
                            </h3>
                            <span className="text-xs text-gray-500 flex-shrink-0">
                              {new Date(msg.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 truncate mb-1">
                            {msg.subject}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-500 truncate">
                            {msg.message}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Message Detail */}
              <div className="md:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow p-6 overflow-y-auto">
                {selectedMessage ? (
                  <div className="space-y-6">
                    <div className="flex justify-between items-start border-b border-gray-200 dark:border-gray-700 pb-4">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                          {selectedMessage.subject}
                        </h2>
                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                          <span className="font-medium text-gray-700 dark:text-gray-300">
                            {selectedMessage.name}
                          </span>
                          <span>&lt;{selectedMessage.email}&gt;</span>
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          {formatDate(selectedMessage.created_at)}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={(e) => handleDeleteMessage(selectedMessage.id, e)}
                          className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                    <div className="prose dark:prose-invert max-w-none whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                      {selectedMessage.message}
                    </div>
                    <div className="pt-8 border-t border-gray-200 dark:border-gray-700">
                      <a
                        href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
                      >
                        <Mail size={16} />
                        Reply via Email
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-gray-400">
                    <Mail size={48} className="mb-4 opacity-50" />
                    <p>Select a message to read</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-900/50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                      >
                        Email
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                      >
                        Subscribed Date
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {subscribers.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="px-6 py-12 text-center text-gray-500">
                          No subscribers yet
                        </td>
                      </tr>
                    ) : (
                      subscribers.map((sub) => (
                        <tr
                          key={sub.id}
                          className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white font-medium">
                            {sub.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {formatDate(sub.subscribed_at)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => handleDeleteSubscriber(sub.id)}
                              className="text-red-500 hover:text-red-700 dark:hover:text-red-300 transition-colors p-1"
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
              <div className="bg-gray-50 dark:bg-gray-900/50 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Total Subscribers:{' '}
                  <span className="font-bold text-gray-900 dark:text-white">
                    {subscribers.length}
                  </span>
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
