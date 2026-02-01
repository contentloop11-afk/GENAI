import { useState } from 'react';
import { 
  X, Download, Trash2, MessageCircle, Star, Link2, 
  BarChart3, ExternalLink, Clock,
  ChevronDown, ChevronUp
} from 'lucide-react';
import type { Comment } from '@/hooks/useComments';
import { mockImages, styleConfig } from '@/data/mockImages';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  comments: Comment[];
  ratings: { [key: string]: number };
  onDeleteComment: (id: string) => void;
  onClearComments: () => void;
  onExportData: () => { comments: Comment[]; exportedAt: string; totalComments: number };
}

export function AdminDashboard({
  isOpen,
  onClose,
  comments,
  ratings,
  onDeleteComment,
  onClearComments,
  onExportData,
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'comments' | 'links' | 'ratings'>('overview');
  const [expandedImage, setExpandedImage] = useState<string | null>(null);

  if (!isOpen) return null;

  const totalRatings = Object.keys(ratings).length;
  const avgRating = totalRatings > 0 
    ? (Object.values(ratings).reduce((a, b) => a + b, 0) / totalRatings).toFixed(1)
    : '0';
  
  const commentsWithLinks = comments.filter(c => c.outfitLink);

  const handleExport = () => {
    const data = {
      ...onExportData(),
      ratings,
      totalRatings,
      averageRating: avgRating,
      images: mockImages.map(img => ({
        ...img,
        userRating: ratings[img.id] || null,
        comments: comments.filter(c => c.imageId === img.id),
      })),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `luna-data-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportCSV = () => {
    // Create CSV for comments
    const headers = ['Bild ID', 'Bild Titel', 'Autor', 'Kommentar', 'Outfit Link', 'Datum'];
    const rows = comments.map(c => {
      const image = mockImages.find(img => img.id === c.imageId);
      return [
        c.imageId,
        image?.title || '',
        c.author,
        `"${c.text.replace(/"/g, '""')}"`,
        c.outfitLink || '',
        new Date(c.timestamp).toLocaleString('de-DE'),
      ];
    });

    const csv = [headers.join(';'), ...rows.map(r => r.join(';'))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `luna-kommentare-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full sm:max-w-4xl max-h-[95vh] sm:max-h-[90vh] bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col sm:m-4">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Admin Dashboard</h2>
            <p className="text-sm text-slate-500">Übersicht aller Daten & Kommentare</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-100">
          {[
            { id: 'overview', label: 'Übersicht', icon: BarChart3 },
            { id: 'comments', label: `Kommentare (${comments.length})`, icon: MessageCircle },
            { id: 'links', label: `Outfit-Links (${commentsWithLinks.length})`, icon: Link2 },
            { id: 'ratings', label: `Bewertungen (${totalRatings})`, icon: Star },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-2 text-slate-500 mb-1">
                    <Star className="w-4 h-4" />
                    <span className="text-xs">Bewertungen</span>
                  </div>
                  <p className="text-2xl font-semibold text-slate-900">{totalRatings}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-2 text-slate-500 mb-1">
                    <BarChart3 className="w-4 h-4" />
                    <span className="text-xs">Ø Bewertung</span>
                  </div>
                  <p className="text-2xl font-semibold text-slate-900">{avgRating}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-2 text-slate-500 mb-1">
                    <MessageCircle className="w-4 h-4" />
                    <span className="text-xs">Kommentare</span>
                  </div>
                  <p className="text-2xl font-semibold text-slate-900">{comments.length}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-2 text-slate-500 mb-1">
                    <Link2 className="w-4 h-4" />
                    <span className="text-xs">Outfit-Links</span>
                  </div>
                  <p className="text-2xl font-semibold text-slate-900">{commentsWithLinks.length}</p>
                </div>
              </div>

              {/* Export Buttons */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleExport}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Alle Daten (JSON)</span>
                </button>
                <button
                  onClick={handleExportCSV}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Kommentare (CSV)</span>
                </button>
                <button
                  onClick={() => {
                    if (confirm('Alle Kommentare löschen? Diese Aktion kann nicht rückgängig gemacht werden.')) {
                      onClearComments();
                    }
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Alle Kommentare löschen</span>
                </button>
              </div>

              {/* Recent Activity */}
              <div>
                <h3 className="font-medium text-slate-900 mb-3">Letzte Aktivität</h3>
                <div className="space-y-2">
                  {comments.slice(0, 5).map((comment) => {
                    const image = mockImages.find(img => img.id === comment.imageId);
                    return (
                      <div key={comment.id} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                        <img 
                          src={image?.src} 
                          alt="" 
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-slate-900 truncate">{comment.text}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-slate-500">{comment.author}</span>
                            <span className="text-xs text-slate-400">•</span>
                            <span className="text-xs text-slate-400">{formatDate(comment.timestamp)}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {comments.length === 0 && (
                    <p className="text-sm text-slate-400 text-center py-8">Noch keine Kommentare</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Comments Tab */}
          {activeTab === 'comments' && (
            <div className="space-y-4">
              {comments.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-8">Noch keine Kommentare</p>
              ) : (
                comments.map((comment) => {
                  const image = mockImages.find(img => img.id === comment.imageId);
                  return (
                    <div key={comment.id} className="p-4 bg-slate-50 rounded-xl">
                      <div className="flex gap-4">
                        <img 
                          src={image?.src} 
                          alt="" 
                          className="w-16 h-20 rounded-lg object-cover flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="font-medium text-slate-900">{comment.author}</p>
                              <p className="text-xs text-slate-500">{image?.title}</p>
                            </div>
                            <button
                              onClick={() => onDeleteComment(comment.id)}
                              className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <p className="text-sm text-slate-700 mt-2">{comment.text}</p>
                          {comment.outfitLink && (
                            <a
                              href={comment.outfitLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 mt-2 text-xs text-blue-600 hover:text-blue-700"
                            >
                              <ExternalLink className="w-3 h-3" />
                              <span className="truncate max-w-[200px]">{comment.outfitLink}</span>
                            </a>
                          )}
                          <div className="flex items-center gap-1 mt-2 text-xs text-slate-400">
                            <Clock className="w-3 h-3" />
                            <span>{formatDate(comment.timestamp)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* Links Tab */}
          {activeTab === 'links' && (
            <div className="space-y-4">
              {commentsWithLinks.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-8">Noch keine Outfit-Links eingereicht</p>
              ) : (
                commentsWithLinks.map((comment) => {
                  const image = mockImages.find(img => img.id === comment.imageId);
                  return (
                    <div key={comment.id} className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                      <div className="flex gap-4">
                        <img 
                          src={image?.src} 
                          alt="" 
                          className="w-16 h-20 rounded-lg object-cover flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-slate-900">{image?.title}</p>
                          <p className="text-xs text-slate-500">von {comment.author}</p>
                          <a
                            href={comment.outfitLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 mt-3 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" />
                            <span>Outfit ansehen</span>
                          </a>
                          {comment.text && (
                            <p className="text-sm text-slate-600 mt-2 italic">"{comment.text}"</p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* Ratings Tab */}
          {activeTab === 'ratings' && (
            <div className="space-y-3">
              {mockImages.map((image) => {
                const rating = ratings[image.id];
                const imageComments = comments.filter(c => c.imageId === image.id);
                const config = styleConfig[image.style];
                const isExpanded = expandedImage === image.id;

                return (
                  <div key={image.id} className="border border-slate-100 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setExpandedImage(isExpanded ? null : image.id)}
                      className="w-full p-4 flex items-center gap-4 hover:bg-slate-50 transition-colors"
                    >
                      <img 
                        src={image.src} 
                        alt="" 
                        className="w-12 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1 text-left">
                        <p className="font-medium text-slate-900">{image.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span 
                            className="px-2 py-0.5 rounded-full text-[10px] font-medium text-white"
                            style={{ backgroundColor: config.color }}
                          >
                            {config.labelDE}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        {rating ? (
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`w-4 h-4 ${i < rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`}
                              />
                            ))}
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400">Nicht bewertet</span>
                        )}
                        <div className="flex items-center gap-1 text-slate-400">
                          <MessageCircle className="w-4 h-4" />
                          <span className="text-xs">{imageComments.length}</span>
                        </div>
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-slate-400" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-slate-400" />
                        )}
                      </div>
                    </button>

                    {isExpanded && imageComments.length > 0 && (
                      <div className="px-4 pb-4 space-y-2 border-t border-slate-100 pt-3">
                        {imageComments.map((comment) => (
                          <div key={comment.id} className="p-3 bg-slate-50 rounded-lg">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-medium text-slate-700">{comment.author}</span>
                              <span className="text-[10px] text-slate-400">{formatDate(comment.timestamp)}</span>
                            </div>
                            <p className="text-sm text-slate-600 mt-1">{comment.text}</p>
                            {comment.outfitLink && (
                              <a
                                href={comment.outfitLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 mt-1 text-xs text-blue-600"
                              >
                                <Link2 className="w-3 h-3" />
                                <span>Link</span>
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
