import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  AlertCircle,
  Award,
  CheckCircle2,
  HelpCircle,
  Lock,
  RotateCcw,
  Sliders,
  TrendingUp,
  Unlock,
} from 'lucide-react';
import { useCampus } from '../context/CampusContext';
import { AcademicCalculator } from '../utils/academicCalculator';
import { GradeLetter } from '../types';

export const AcademicPlannerView: React.FC = () => {
  const { subjects, targetSGPA, setTargetSGPA, updateSubjectInternalMarks, resetAcademicPlanner } =
    useCampus();

  const [simulatedSubjectId, setSimulatedSubjectId] = useState<string>(subjects[0].id);
  const [showExplanationModal, setShowExplanationModal] = useState(false);

  // Run academic calculation
  const sgpaResult = AcademicCalculator.checkTargetSGPA(subjects, targetSGPA);
  const totalCredits = subjects.reduce((sum, s) => sum + s.credits, 0);

  const handleTargetChange = (val: number) => {
    const clamped = Math.min(10, Math.max(4, Number(val.toFixed(2))));
    setTargetSGPA(clamped);
    if (clamped <= sgpaResult.maxPossibleSGPA) {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.7 },
      });
    }
  };

  const handleSliderInternalChange = (subjectId: string, val: number) => {
    updateSubjectInternalMarks(subjectId, val);
  };

  const simulatedSubject = subjects.find((s) => s.id === simulatedSubjectId) || subjects[0];

  return (
    <div className="space-y-8 pb-16">
      {/* Page Title & Mission */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-1">
            <Award className="w-3.5 h-3.5" /> First-Year Mathematical Decision Engine
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Academic Planner & Grade Locking
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Calculates exact marks required for every grade, locks unachievable targets, and validates SGPA reachability.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowExplanationModal(true)}
            className="px-3 py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-slate-700 shadow-2xs flex items-center gap-1.5 transition"
          >
            <HelpCircle className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            Grading Rules
          </button>
          <button
            onClick={resetAcademicPlanner}
            className="px-3 py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-slate-700 shadow-2xs flex items-center gap-1.5 transition"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            Reset
          </button>
        </div>
      </div>

      {/* Target SGPA Reachability Engine Card (PS-02 Core Deliverable) */}
      <div
        className={`rounded-2xl border p-6 transition-all shadow-xs ${
          sgpaResult.isAchievable
            ? 'bg-gradient-to-br from-emerald-50/70 via-white to-teal-50/50 dark:from-emerald-950/30 dark:via-slate-900 dark:to-teal-950/20 border-emerald-200/90 dark:border-emerald-800/60 shadow-emerald-500/5'
            : 'bg-gradient-to-br from-rose-50/70 via-white to-pink-50/50 dark:from-rose-950/30 dark:via-slate-900 dark:to-pink-950/20 border-rose-200/90 dark:border-rose-800/60 shadow-rose-500/5'
        }`}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-200/80 dark:border-slate-800">
          {/* Target Input and Slider */}
          <div className="space-y-3 flex-1 max-w-xl">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                Target SGPA Goal (Scale: 4.00 - 10.00)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="4.0"
                  max="10.0"
                  step="0.05"
                  value={targetSGPA}
                  onChange={(e) => handleTargetChange(parseFloat(e.target.value) || 4.0)}
                  className="w-20 px-2 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-sm font-bold text-center text-slate-900 dark:text-white font-mono focus:outline-none focus:border-indigo-500 shadow-2xs"
                />
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">/ 10.00</span>
              </div>
            </div>

            <input
              type="range"
              min="4.0"
              max="10.0"
              step="0.05"
              value={targetSGPA}
              onChange={(e) => handleTargetChange(parseFloat(e.target.value))}
              className="w-full accent-indigo-600 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
            />

            <div className="flex justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400">
              <span>Min Pass: 4.00</span>
              <span>Mid: 7.00</span>
              <span>Dean's List: 9.00</span>
              <span>Max: 10.00</span>
            </div>
          </div>

          {/* Large Result Badge */}
          <div className="shrink-0 flex items-center gap-4">
            <div className="p-4 rounded-xl bg-white dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700/80 shadow-2xs text-center">
              <div className="text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-medium">Max Possible SGPA</div>
              <div className="text-2xl font-black text-indigo-700 dark:text-indigo-400 font-mono mt-0.5">
                {sgpaResult.maxPossibleSGPA.toFixed(2)}
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Based on internal marks</div>
            </div>

            <div
              className={`p-4 rounded-xl border flex items-center gap-3 shadow-2xs ${
                sgpaResult.isAchievable
                  ? 'bg-emerald-100/70 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200'
                  : 'bg-rose-100/70 dark:bg-rose-950/60 border-rose-300 dark:border-rose-700 text-rose-800 dark:text-rose-200'
              }`}
            >
              {sgpaResult.isAchievable ? (
                <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400 shrink-0" />
              ) : (
                <AlertCircle className="w-8 h-8 text-rose-600 dark:text-rose-400 shrink-0" />
              )}
              <div>
                <div className="text-xs uppercase tracking-wider font-bold">
                  {sgpaResult.isAchievable ? 'Target Status' : 'Result'}
                </div>
                <div className="text-xl font-black uppercase tracking-tight">
                  {sgpaResult.isAchievable ? 'ACHIEVABLE' : 'NOT ACHIEVABLE'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Explanation / Breakdown */}
        <div className="mt-4 pt-2">
          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
            {sgpaResult.explanation}
          </p>

          {sgpaResult.isAchievable && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">Recommended Minimum Grades:</span>
              {sgpaResult.recommendedGradeProfile.map((rec) => (
                <span
                  key={rec.subjectCode}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 shadow-2xs text-xs font-mono"
                >
                  <span className="text-slate-600 dark:text-slate-300">{rec.subjectCode}:</span>
                  <span className="font-bold text-emerald-700 dark:text-emerald-400">{rec.requiredGrade}</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">({rec.points} pts)</span>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bonus USP: What-If Scenario Simulator */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Interactive "What-If" Scenario Simulator</h2>
          </div>
          <span className="text-xs text-indigo-700 dark:text-indigo-300 font-semibold bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 px-2.5 py-0.5 rounded-full">
            Bonus USP Feature
          </span>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          Simulate: <em>"What if I score higher in my upcoming Unit Test or lab re-assessment?"</em> Watch how locked grades unlock immediately.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* Select Subject */}
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Select Subject to Simulate:
            </label>
            <select
              value={simulatedSubjectId}
              onChange={(e) => setSimulatedSubjectId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800"
            >
              {subjects.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.code}: {sub.name} (Currently {sub.internalScored}/{sub.internalMax})
                </option>
              ))}
            </select>
          </div>

          {/* Adjust Internal Score Slider */}
          <div className="md:col-span-2 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-700 dark:text-slate-300 font-medium">
                Adjust Internal Score for {simulatedSubject.code}:
              </span>
              <span className="font-mono font-bold text-indigo-700 dark:text-indigo-400 text-sm">
                {simulatedSubject.internalScored} / {simulatedSubject.internalMax} marks
              </span>
            </div>

            <input
              type="range"
              min="0"
              max={simulatedSubject.internalMax}
              value={simulatedSubject.internalScored}
              onChange={(e) =>
                handleSliderInternalChange(simulatedSubject.id, parseInt(e.target.value) || 0)
              }
              className="w-full accent-indigo-600 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
            />

            <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-mono">
              <span>0 marks (worst case)</span>
              <span>Passing min internal</span>
              <span>{simulatedSubject.internalMax} marks (full score)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Marks-Needed Table with Locked Grades (Core PS Requirement) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Subject Marks-Needed & Grade Locking Matrix
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Total Credits: <strong className="text-slate-900 dark:text-white">{totalCredits}</strong> • Formula: <code className="text-indigo-700 dark:text-indigo-300 font-semibold bg-indigo-50 dark:bg-indigo-950/50 px-1.5 py-0.5 rounded border border-indigo-100 dark:border-indigo-800">Marks Needed = Required Total - Internal Scored</code>
            </p>
          </div>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-800/80 uppercase text-[11px] font-semibold text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="py-3.5 px-4">Subject</th>
                <th className="py-3.5 px-3 text-center">Credits</th>
                <th className="py-3.5 px-3 text-center">Internal Scored</th>
                <th className="py-3.5 px-3 text-center">End-Sem Max</th>
                <th className="py-3.5 px-2 text-center text-amber-700 dark:text-amber-400 font-bold">Grade O (10)</th>
                <th className="py-3.5 px-2 text-center text-indigo-700 dark:text-indigo-400 font-bold">Grade A (9)</th>
                <th className="py-3.5 px-2 text-center text-sky-700 dark:text-sky-400 font-bold">Grade B (8)</th>
                <th className="py-3.5 px-2 text-center text-emerald-700 dark:text-emerald-400 font-bold">Grade C (7)</th>
                <th className="py-3.5 px-2 text-center text-teal-700 dark:text-teal-400 font-bold">Grade D (6)</th>
                <th className="py-3.5 px-2 text-center text-slate-700 dark:text-slate-300 font-bold">Grade P (5)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {subjects.map((sub) => {
                const reqs = AcademicCalculator.calculateSubjectMarksRequirements(sub);
                const reqMap = Object.fromEntries(reqs.map((r) => [r.grade, r]));

                return (
                  <tr key={sub.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition">
                    {/* Subject info */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 dark:text-white">{sub.code}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 max-w-xs truncate">{sub.name}</div>
                    </td>

                    {/* Credits */}
                    <td className="py-3.5 px-3 text-center font-mono font-bold text-slate-800 dark:text-slate-200">
                      {sub.credits}
                    </td>

                    {/* Internal Input (Editable on the fly) */}
                    <td className="py-3.5 px-3 text-center">
                      <div className="inline-flex items-center gap-1">
                        <input
                          type="number"
                          min="0"
                          max={sub.internalMax}
                          value={sub.internalScored}
                          onChange={(e) =>
                            updateSubjectInternalMarks(sub.id, parseInt(e.target.value) || 0)
                          }
                          className="w-12 py-1 px-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-center font-mono font-bold text-slate-900 dark:text-white text-xs focus:outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800"
                        />
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">/{sub.internalMax}</span>
                      </div>
                    </td>

                    {/* End-Sem Max */}
                    <td className="py-3.5 px-3 text-center font-mono text-slate-600 dark:text-slate-400">
                      {sub.endSemMax}
                    </td>

                    {/* Grade Columns */}
                    {(['O', 'A', 'B', 'C', 'D', 'P'] as GradeLetter[]).map((grade) => {
                      const item = reqMap[grade];
                      if (!item) return <td key={grade} className="text-center">-</td>;

                      return (
                        <td key={grade} className="py-3 px-2 text-center">
                          {item.isAchievable ? (
                            <div className="inline-flex flex-col items-center">
                              <span className="px-2 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 font-mono font-semibold text-[11px] flex items-center gap-1 shadow-2xs">
                                <Unlock className="w-2.5 h-2.5 text-emerald-600 dark:text-emerald-400" />
                                {item.marksNeededInEndSem}
                              </span>
                              <span className="text-[9px] text-slate-500 dark:text-slate-400 mt-0.5">
                                /{sub.endSemMax}
                              </span>
                            </div>
                          ) : (
                            <div
                              title={item.statusText}
                              className="inline-flex flex-col items-center"
                            >
                              <span className="px-2 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 font-mono text-[11px] flex items-center gap-1 shadow-2xs cursor-not-allowed">
                                <Lock className="w-2.5 h-2.5 text-rose-600 dark:text-rose-400" />
                                Locked
                              </span>
                              <span className="text-[9px] text-rose-600/80 dark:text-rose-400/80 font-medium mt-0.5">
                                needs {item.marksNeededInEndSem}
                              </span>
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Explanation Modal */}
      {showExplanationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="max-w-lg w-full rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-4 text-slate-800 dark:text-slate-200 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Grading Scale & Mathematical Formulas</h3>
              <button
                onClick={() => setShowExplanationModal(false)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
              >
                ✕
              </button>
            </div>
            <div className="text-xs space-y-3 leading-relaxed">
              <p>
                <strong className="text-slate-900 dark:text-white">1. Marks Needed:</strong>
                <code className="block bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2.5 rounded-lg mt-1 font-mono text-indigo-700 dark:text-indigo-300">
                  Marks Needed = Ceil(Grade Cutoff % * Total Max) - Internal Scored
                </code>
              </p>
              <p>
                <strong className="text-slate-900 dark:text-white">2. Grade Locking Logic:</strong> If Marks Needed &gt; Max End-Sem Marks, the grade is physically impossible to achieve, and is locked immediately.
              </p>
              <p>
                <strong className="text-slate-900 dark:text-white">3. SGPA Calculation:</strong>
                <code className="block bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2.5 rounded-lg mt-1 font-mono text-indigo-700 dark:text-indigo-300">
                  SGPA = Sum(Subject Credits * Grade Points) / Total Credits
                </code>
              </p>
              <p>
                <strong className="text-slate-900 dark:text-white">4. Cutoff Matrix:</strong> O = 80%+ (10 pts), A = 75%+ (9 pts), B = 70%+ (8 pts), C = 60%+ (7 pts), D = 50%+ (6 pts), P = 40%+ (5 pts).
              </p>
            </div>
            <button
              onClick={() => setShowExplanationModal(false)}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-sm transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
