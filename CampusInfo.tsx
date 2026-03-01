import React, { useState } from 'react';
import { Users, Bell, FileText, Briefcase, Search, ExternalLink, Loader2, Info } from 'lucide-react';
import { auraService } from '../services/auraService';
import { motion, AnimatePresence } from 'motion/react';
import { Club, Internship } from '../types';

const CLUBS: Club[] = [
  { id: '1', name: 'AI Research Lab', description: 'Exploring the frontiers of machine learning.', recruitmentStatus: 'open', alert: 'Interviewing for Junior Researchers!' },
  { id: '2', name: 'Design Collective', description: 'A community for creative minds and UI/UX enthusiasts.', recruitmentStatus: 'closed' },
  { id: '3', name: 'Entrepreneurship Cell', description: 'Building the next generation of campus startups.', recruitmentStatus: 'open', alert: 'Cohort 5 applications closing soon.' },
  { id: '4', name: 'Robotics Club', description: 'Hardware hacking and competitive robotics.', recruitmentStatus: 'closed' },
];

const INTERNSHIPS: Internship[] = [
  { id: '1', company: 'Google', role: 'Software Engineering Intern', deadline: 'Oct 15', link: '#' },
  { id: '2', company: 'Stripe', role: 'Product Design Intern', deadline: 'Nov 1', link: '#' },
  { id: '3', company: 'NVIDIA', role: 'Deep Learning Intern', deadline: 'Oct 20', link: '#' },
];

export const CampusInfo: React.FC = () => {
  const [notice, setNotice] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSummarize = async () => {
    if (!notice.trim()) return;
    setLoading(true);
    try {
      const result = await auraService.summarizeNotice(notice);
      setSummary(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <header className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-emerald-100 rounded-2xl text-emerald-600">
          <Users size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-zinc-900">Campus Info Module</h2>
          <p className="text-zinc-500 text-sm">Stay connected with campus life</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Notice Summarizer */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-zinc-100">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Bell className="text-emerald-500" />
              Notice Summarizer
            </h3>
            <textarea
              value={notice}
              onChange={(e) => setNotice(e.target.value)}
              placeholder="Paste a long campus notice here to summarize..."
              className="w-full h-32 p-4 rounded-2xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-none mb-4"
            />
            <button
              onClick={handleSummarize}
              disabled={loading || !notice.trim()}
              className="w-full py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <FileText size={20} />}
              Summarize Notice
            </button>

            <AnimatePresence>
              {summary && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-6 p-6 bg-emerald-50 rounded-2xl border border-emerald-100"
                >
                  <h4 className="text-sm font-bold text-emerald-800 uppercase tracking-wider mb-2">Key Takeaways</h4>
                  <div className="text-emerald-900 prose prose-sm prose-emerald">
                    {summary.split('\n').map((line, i) => (
                      <p key={i} className="mb-1">{line}</p>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-sm border border-zinc-100">
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <Users className="text-emerald-500" />
              Active Clubs
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {CLUBS.map(club => (
                <div key={club.id} className="p-5 rounded-2xl border border-zinc-100 bg-zinc-50 hover:border-emerald-200 transition-all group">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-zinc-900">{club.name}</h4>
                    <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full ${
                      club.recruitmentStatus === 'open' ? 'bg-emerald-100 text-emerald-700' : 'bg-zinc-200 text-zinc-500'
                    }`}>
                      {club.recruitmentStatus}
                    </span>
                  </div>
                  <p className="text-sm text-zinc-500 mb-3">{club.description}</p>
                  {club.alert && (
                    <div className="flex items-center gap-2 text-xs font-medium text-emerald-600 bg-emerald-50 p-2 rounded-lg">
                      <Info size={14} />
                      {club.alert}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Internships Sidebar */}
        <div className="space-y-6">
          <div className="bg-zinc-900 rounded-3xl p-8 shadow-xl text-white">
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <Briefcase className="text-emerald-400" />
              Internship Alerts
            </h3>
            <div className="space-y-4">
              {INTERNSHIPS.map(job => (
                <div key={job.id} className="p-4 rounded-2xl bg-zinc-800 border border-zinc-700 hover:border-emerald-500 transition-all">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-bold text-zinc-100">{job.company}</h4>
                    <ExternalLink size={14} className="text-zinc-500" />
                  </div>
                  <p className="text-sm text-zinc-400 mb-3">{job.role}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-rose-400 uppercase">Deadline: {job.deadline}</span>
                    <button className="text-xs font-bold text-emerald-400 hover:underline">Apply Now</button>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-6 py-3 border border-zinc-700 rounded-xl text-sm font-medium hover:bg-zinc-800 transition-all">
              View All Opportunities
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
