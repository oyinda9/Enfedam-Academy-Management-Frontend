"use client"
import React, { useState } from 'react';

const ExamResultForm = () => {
  // Mock data (you can fetch from your API)
  const exams = [
    { id: 1, title: 'First Term Exam' },
    { id: 2, title: 'Second Term Exam' }
  ];

  const students = [
    { id: 's123', name: 'John Doe' },
    { id: 's456', name: 'Jane Smith' }
  ];

  const subjects = [
    { id: 1, name: 'Math' },
    { id: 2, name: 'English' },
    { id: 3, name: 'Biology' }
  ];

  const [form, setForm] = useState({
    examId: '',
    studentId: '',
    scores: {}
  });

  const handleScoreChange = (subjectId, value) => {
    setForm((prev) => ({
      ...prev,
      scores: {
        ...prev.scores,
        [subjectId]: Number(value)
      }
    }));
  };

  const handleSubmit = async () => {
    const payload = Object.entries(form.scores).map(([subjectId, score]) => ({
      examId: Number(form.examId),
      studentId: form.studentId,
      subjectId: Number(subjectId),
      score
    }));

    try {
      const res = await fetch('/api/results/bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        alert('Scores submitted successfully!');
        setForm({ examId: '', studentId: '', scores: {} });
      } else {
        alert('Error submitting scores');
      }
    } catch (err) {
      console.error(err);
      alert('Something went wrong.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Enter Exam Scores</h2>

      {/* Select Exam */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">Select Exam</label>
        <select
          value={form.examId}
          onChange={(e) => setForm({ ...form, examId: e.target.value })}
          className="w-full p-2 border rounded"
        >
          <option value="">-- Select Exam --</option>
          {exams.map((exam) => (
            <option key={exam.id} value={exam.id}>
              {exam.title}
            </option>
          ))}
        </select>
      </div>

      {/* Select Student */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">Select Student</label>
        <select
          value={form.studentId}
          onChange={(e) => setForm({ ...form, studentId: e.target.value })}
          className="w-full p-2 border rounded"
        >
          <option value="">-- Select Student --</option>
          {students.map((student) => (
            <option key={student.id} value={student.id}>
              {student.name}
            </option>
          ))}
        </select>
      </div>

      {/* Subject Scores */}
      {subjects.map((subject) => (
        <div key={subject.id} className="mb-4">
          <label className="block font-medium mb-1">{subject.name} Score</label>
          <input
            type="number"
            min="0"
            max="100"
            value={form.scores[subject.id] || ''}
            onChange={(e) => handleScoreChange(subject.id, e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Enter score"
          />
        </div>
      ))}

      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Submit Scores
      </button>
    </div>
  );
};

export default ExamResultForm;
