import React, { useState } from 'react';
import { AcademicCopilot } from './components/AcademicCopilot';
import { MoodSupport } from './components/MoodSupport';
import { CampusInfo } from './components/CampusInfo';
import { Module } from './types';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Heart, Users, Sparkles } from 'lucide-react';

export default function App() {
  const [activeModule, setActiveModule] = useState<Module>('academic');

  const navItems = [
    { id: 'academic' as Module, label: 'Academic', icon: BookOpen, color: 'indigo' },
    { id: 'mood' as Module, label: 'Well-being', icon: Heart, color: 'rose' },
    { id: 'campus' as Module, label: 'Campus', icon: Users, color: 'emerald' },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 font-sans text-zinc-900 selection:bg-indigo-100">
      {/* Sidebar Navigation */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 md:left-8 md:bottom-auto md:top-1/2 md:-translate-y-1/2 z-50">
        <div className="bg-white/80 backdrop-blur-xl border border-zinc-200 p-2 rounded-3xl shadow-2xl flex md:flex-col gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeModule === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveModule(item.id)}
                className={`p-4 rounded-2xl transition-all relative group ${
                  isActive 
                    ? `bg-${item.color}-600 text-white shadow-lg shadow-${item.color}-500/30` 
                    : 'text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600'
                }`}
              >
                <Icon size={24} />
                <span className="absolute left-full ml-4 px-3 py-1 bg-zinc-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity hidden md:block whitespace-nowrap">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-12 md:pl-32">
        <header className="mb-12 flex justify-between items-end">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 font-bold tracking-widest uppercase text-xs mb-2">
              <Sparkles size={14} />
              AURA AI
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-zinc-900">
              Welcome back, <span className="text-zinc-400">Student</span>
            </h1>
          </div>
          <div className="hidden sm:block text-right">
            <p className="text-sm font-medium text-zinc-500">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
            <p className="text-xs text-zinc-400">Campus Status: Active</p>
          </div>
        </header>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeModule}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeModule === 'academic' && <AcademicCopilot />}
            {activeModule === 'mood' && <MoodSupport />}
            {activeModule === 'campus' && <CampusInfo />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Background Accents */}
      <div className="fixed top-0 right-0 -z-10 w-[500px] h-[500px] bg-indigo-100/50 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2" />
      <div className="fixed bottom-0 left-0 -z-10 w-[400px] h-[400px] bg-rose-100/30 blur-[100px] rounded-full -translate-x-1/2 translate-y-1/2" />
    </div>
  );
}
