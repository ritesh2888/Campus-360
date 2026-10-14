import { GRADE_THRESHOLDS } from '../data/mockData';
import { GradeLetter, MarksRequirement, SGPATargetResult, Subject } from '../types';

export const AcademicCalculator = {
  // Get grade point from GradeLetter
  getGradePoints(grade: GradeLetter): number {
    const found = GRADE_THRESHOLDS.find((g) => g.grade === grade);
    return found ? found.points : 0;
  },

  // Calculate marks needed in End-Sem for every grade in a given subject
  calculateSubjectMarksRequirements(subject: Subject): MarksRequirement[] {
    const totalMax = subject.internalMax + subject.endSemMax;
    const minEndSemPass = Math.ceil((subject.minEndSemPercent / 100) * subject.endSemMax);
    const minOverallPass = Math.ceil((subject.minPassingPercent / 100) * totalMax);

    return GRADE_THRESHOLDS.filter((gt) => gt.grade !== 'F').map((gt) => {
      // Required total marks = ceil(minTotalPercent / 100 * totalMax)
      const minTotalMarks = Math.ceil((gt.minTotalPercent / 100) * totalMax);
      // Marks needed = required total minus internal marks scored
      let marksNeeded = minTotalMarks - subject.internalScored;

      // Cannot be less than the end-sem passing minimum cutoff
      if (marksNeeded < minEndSemPass) {
        marksNeeded = minEndSemPass;
      }

      // Check if achievable
      const isAchievable = marksNeeded <= subject.endSemMax;

      let statusText = '';
      if (!isAchievable) {
        const shortfall = marksNeeded - subject.endSemMax;
        statusText = `Locked (Needs ${marksNeeded}/${subject.endSemMax}, short by ${shortfall})`;
      } else if (marksNeeded === minEndSemPass && (minTotalMarks - subject.internalScored) <= minEndSemPass) {
        statusText = `Needs ${marksNeeded}/${subject.endSemMax} (Pass cutoff applies)`;
      } else {
        statusText = `Needs ${marksNeeded}/${subject.endSemMax}`;
      }

      return {
        grade: gt.grade,
        points: gt.points,
        minTotalMarks,
        marksNeededInEndSem: marksNeeded,
        isAchievable,
        statusText,
      };
    });
  },

  // Find the highest achievable grade for a subject based on internal scored
  getHighestAchievableGrade(subject: Subject): { grade: GradeLetter; points: number } {
    const requirements = this.calculateSubjectMarksRequirements(subject);
    for (const req of requirements) {
      if (req.isAchievable) {
        return { grade: req.grade, points: req.points };
      }
    }
    return { grade: 'F', points: 0 };
  },

  // Calculate SGPA given a mapping of subjectId -> grade point
  calculateSGPA(subjects: Subject[], gradePointsMap: Record<string, number>): number {
    const totalCredits = subjects.reduce((sum, s) => sum + s.credits, 0);
    if (totalCredits === 0) return 0;

    const weightedPoints = subjects.reduce((sum, s) => {
      const points = gradePointsMap[s.id] ?? 5; // default pass (5)
      return sum + s.credits * points;
    }, 0);

    return Number((weightedPoints / totalCredits).toFixed(2));
  },

  // Target SGPA Reachability Checker
  checkTargetSGPA(subjects: Subject[], targetSGPA: number): SGPATargetResult {
    const totalCredits = subjects.reduce((sum, s) => sum + s.credits, 0);

    // Calculate maximum theoretical SGPA based on internal marks achieved
    const maxGradeProfile: Record<string, { grade: GradeLetter; points: number }> = {};
    let maxWeightedPoints = 0;

    for (const sub of subjects) {
      const highest = this.getHighestAchievableGrade(sub);
      maxGradeProfile[sub.id] = highest;
      maxWeightedPoints += sub.credits * highest.points;
    }

    const maxPossibleSGPA = Number((maxWeightedPoints / totalCredits).toFixed(2));
    const minPossibleSGPA = Number(((totalCredits * 5) / totalCredits).toFixed(2)); // All 'P' = 5.00

    const isAchievable = targetSGPA <= maxPossibleSGPA && targetSGPA >= 4.0;

    // Build recommended grade combination to hit targetSGPA
    const recommendedList: { subjectCode: string; subjectName: string; requiredGrade: GradeLetter; points: number }[] = [];

    if (!isAchievable) {
      // Return what was capped
      const cappedSubjects = subjects
        .filter((s) => maxGradeProfile[s.id].points < 10)
        .map((s) => `${s.code} (max ${maxGradeProfile[s.id].grade})`)
        .join(', ');

      return {
        targetSGPA,
        maxPossibleSGPA,
        minPossibleSGPA,
        isAchievable: false,
        recommendedGradeProfile: subjects.map((s) => ({
          subjectCode: s.code,
          subjectName: s.name,
          requiredGrade: maxGradeProfile[s.id].grade,
          points: maxGradeProfile[s.id].points,
        })),
        explanation: `Target SGPA ${targetSGPA.toFixed(2)} is mathematically not achievable. Your ceiling is capped at ${maxPossibleSGPA.toFixed(2)} because internal scores have locked the 'O' grade in ${cappedSubjects || 'certain subjects'}.`,
      };
    }

    // If achievable, solve for minimum grades needed across subjects
    // Sort subjects by credits descending to prioritize high credit subjects
    const targetWeightedSum = targetSGPA * totalCredits;
    const currentAssignments: Record<string, number> = {};
    subjects.forEach((s) => {
      currentAssignments[s.id] = 5; // Start with baseline Pass (5 points)
    });

    let currentSum = subjects.reduce((sum, s) => sum + s.credits * currentAssignments[s.id], 0);

    // Greedily raise grades towards highest achievable until sum >= targetWeightedSum
    const sortedSubjects = [...subjects].sort((a, b) => b.credits - a.credits);

    while (currentSum < targetWeightedSum) {
      let upgraded = false;
      for (const sub of sortedSubjects) {
        const maxPts = maxGradeProfile[sub.id].points;
        if (currentAssignments[sub.id] < maxPts) {
          currentAssignments[sub.id] += 1;
          currentSum += sub.credits;
          upgraded = true;
          if (currentSum >= targetWeightedSum) break;
        }
      }
      if (!upgraded) break;
    }

    for (const sub of subjects) {
      const pts = currentAssignments[sub.id];
      const gt = GRADE_THRESHOLDS.find((g) => g.points === pts) || GRADE_THRESHOLDS[GRADE_THRESHOLDS.length - 2];
      recommendedList.push({
        subjectCode: sub.code,
        subjectName: sub.name,
        requiredGrade: gt.grade,
        points: pts,
      });
    }

    const calculatedSGPA = Number((currentSum / totalCredits).toFixed(2));

    return {
      targetSGPA,
      maxPossibleSGPA,
      minPossibleSGPA,
      isAchievable: true,
      recommendedGradeProfile: recommendedList,
      explanation: `Target SGPA ${targetSGPA.toFixed(2)} is achievable! Projected achievable SGPA with this grade profile is ${calculatedSGPA.toFixed(2)}. Make sure to hit the required end-sem scores shown in the planner table.`,
    };
  },
};
