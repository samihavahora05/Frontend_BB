import React, { useState, useEffect, useRef } from "react";
import Head from "next/head";
import Link from "next/link";
import { AdminDashboardLayout } from "../../../src/layout/AdminDashboardLayout";
import { 
  CheckSquare, Search, Plus, Upload, Download, Trash2, Edit2, 
  CheckCircle2, XCircle, AlertCircle, RefreshCw, X, Layers, 
  HelpCircle, Eye, ArrowLeft, ChevronRight, FileSpreadsheet, Sparkles
} from "lucide-react";
import { AssessmentService, AssessmentQuestionItem } from "../../../src/lib/api/AssessmentService";
import toast from "react-hot-toast";

export default function AdminQuestionsManagementPage() {
  const [questions, setQuestions] = useState<AssessmentQuestionItem[]>([]);
  const [assessment, setAssessment] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Question Edit / Create Modal State
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<AssessmentQuestionItem | null>(null);
  const [formData, setFormData] = useState({
    category: "Web Development",
    question: "",
    option_a: "",
    option_b: "",
    option_c: "",
    option_d: "",
    correct_answer: "A",
    explanation: "",
    marks: 1,
    order: 1,
  });

  // Import Modal State
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importStep, setImportStep] = useState<"upload" | "preview">("upload");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<any>(null);
  const [duplicateStrategy, setDuplicateStrategy] = useState("update");
  const [isProcessingImport, setIsProcessingImport] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadQuestions();
  }, [search, selectedCategory]);

  const loadQuestions = async () => {
    try {
      setIsLoading(true);
      const res = await AssessmentService.getAdminQuestions(1, {
        search,
        category: selectedCategory,
      });
      if (res.success) {
        setQuestions(res.data.data || []);
        setAssessment(res.assessment);
        setCategories(res.categories || []);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load questions.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenCreateModal = () => {
    setEditingQuestion(null);
    setFormData({
      category: selectedCategory !== "All" ? selectedCategory : "Web Development",
      question: "",
      option_a: "",
      option_b: "",
      option_c: "",
      option_d: "",
      correct_answer: "A",
      explanation: "",
      marks: 1,
      order: (questions.length + 1),
    });
    setIsQuestionModalOpen(true);
  };

  const handleOpenEditModal = (q: AssessmentQuestionItem) => {
    setEditingQuestion(q);
    setFormData({
      category: q.category,
      question: q.question,
      option_a: q.option_a,
      option_b: q.option_b,
      option_c: q.option_c,
      option_d: q.option_d,
      correct_answer: q.correct_answer || "A",
      explanation: q.explanation || "",
      marks: q.marks || 1,
      order: q.order || 1,
    });
    setIsQuestionModalOpen(true);
  };

  const handleSaveQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingQuestion) {
        await AssessmentService.updateAdminQuestion(editingQuestion.id, formData);
        toast.success("Question updated successfully!");
      } else {
        await AssessmentService.createAdminQuestion(1, formData);
        toast.success("Question added to database!");
      }
      setIsQuestionModalOpen(false);
      loadQuestions();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to save question.");
    }
  };

  const handleDeleteQuestion = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this question from the database?")) return;
    try {
      await AssessmentService.deleteAdminQuestion(id);
      toast.success("Question deleted.");
      loadQuestions();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to delete question.");
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);

    try {
      setIsProcessingImport(true);
      const res = await AssessmentService.previewImportQuestions(1, file);
      if (res.success) {
        setPreviewData(res.data);
        setImportStep("preview");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to parse question file.");
    } finally {
      setIsProcessingImport(false);
    }
  };

  const handleConfirmImport = async () => {
    if (!previewData?.valid_rows || previewData.valid_rows.length === 0) {
      toast.error("No valid questions found to import.");
      return;
    }

    try {
      setIsProcessingImport(true);
      const res = await AssessmentService.importQuestions(1, {
        questions: previewData.valid_rows,
        duplicate_strategy: duplicateStrategy,
      });

      if (res.success) {
        toast.success(res.message || "Questions imported successfully!");
        setIsImportModalOpen(false);
        setImportStep("upload");
        setSelectedFile(null);
        setPreviewData(null);
        loadQuestions();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Import execution failed.");
    } finally {
      setIsProcessingImport(false);
    }
  };

  return (
    <AdminDashboardLayout>
      <Head>
        <title>Assessment Question Bank | BlueBoxx Admin</title>
      </Head>

      <div className="max-w-7xl mx-auto space-y-6 pb-12">
        {/* Navigation & Tabs */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/admin/assessments"
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors inline-flex items-center gap-1"
            >
              <ArrowLeft size={14} /> Candidate Results
            </Link>
            <div className="h-4 w-[1px] bg-slate-200" />
            <span className="text-xs font-bold text-slate-400">Database Question Management</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => AssessmentService.downloadQuestionsTemplate()}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5"
            >
              <Download size={14} /> Excel Template
            </button>
            <button
              onClick={() => {
                setImportStep("upload");
                setIsImportModalOpen(true);
              }}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5"
            >
              <Upload size={14} /> Import Questions
            </button>
            <button
              onClick={handleOpenCreateModal}
              className="px-4 py-2 bg-[#1B2A6B] hover:bg-[#0d1635] text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5"
            >
              <Plus size={14} /> Add Question
            </button>
          </div>
        </div>

        {/* Header & Stats Banner */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-2xl font-black text-[#0d1635] flex items-center gap-2">
              <CheckSquare className="text-[#1B2A6B]" size={26} />
              100 MCQ Database Question Bank
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Authoritative database storage of questions, options, and server-side answer keys.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-blue-50 border border-blue-100 rounded-2xl px-4 py-2.5 text-center">
              <span className="text-[10px] uppercase font-bold text-blue-600">Total in DB</span>
              <p className="text-xl font-black text-[#0d1635]">{assessment?.total_questions || questions.length}</p>
            </div>
            <div className="bg-purple-50 border border-purple-100 rounded-2xl px-4 py-2.5 text-center">
              <span className="text-[10px] uppercase font-bold text-purple-600">Total Marks</span>
              <p className="text-xl font-black text-[#0d1635]">{assessment?.total_marks || 100}</p>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
            {["All", "Web Development", "Digital Marketing", "Graphic Designing"].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
                  selectedCategory === cat
                    ? "bg-[#1B2A6B] text-white shadow-sm"
                    : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={15} />
            <input
              type="text"
              placeholder="Search question text..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#1B2A6B]/20"
            />
          </div>
        </div>

        {/* Questions Table */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="p-8 space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-16 bg-slate-100 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : questions.length === 0 ? (
            <div className="p-16 text-center">
              <AlertCircle size={36} className="mx-auto text-slate-400 mb-2" />
              <h3 className="text-base font-bold text-slate-700">No questions found</h3>
              <p className="text-xs text-slate-500 mt-1 mb-4">Click below to upload or add questions to the database.</p>
              <button
                onClick={() => setIsImportModalOpen(true)}
                className="px-4 py-2 bg-[#1B2A6B] text-white text-xs font-bold rounded-xl"
              >
                Import 100 Questions File
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 text-[11px] uppercase tracking-wider bg-slate-50/50">
                    <th className="px-5 py-3.5 font-bold w-12">#</th>
                    <th className="px-5 py-3.5 font-bold w-36">Category</th>
                    <th className="px-5 py-3.5 font-bold">Question & Options</th>
                    <th className="px-5 py-3.5 font-bold w-24 text-center">Key</th>
                    <th className="px-5 py-3.5 font-bold w-20 text-center">Marks</th>
                    <th className="px-5 py-3.5 font-bold text-right w-28">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {questions.map((q) => (
                    <tr key={q.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-5 py-4 font-bold text-slate-400 font-mono">{q.order}</td>
                      <td className="px-5 py-4">
                        <span className="px-2.5 py-1 bg-slate-100 text-slate-700 font-bold rounded-md">
                          {q.category}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <p className="font-bold text-[#0d1635] text-sm mb-2">{q.question}</p>
                        <div className="grid grid-cols-2 gap-1.5 text-[11px] text-slate-600">
                          <span className={q.correct_answer === 'A' ? 'font-bold text-emerald-700' : ''}>A: {q.option_a}</span>
                          <span className={q.correct_answer === 'B' ? 'font-bold text-emerald-700' : ''}>B: {q.option_b}</span>
                          <span className={q.correct_answer === 'C' ? 'font-bold text-emerald-700' : ''}>C: {q.option_c}</span>
                          <span className={q.correct_answer === 'D' ? 'font-bold text-emerald-700' : ''}>D: {q.option_d}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <span className="w-7 h-7 inline-flex items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 font-black text-xs">
                          {q.correct_answer}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-center font-bold text-slate-700">
                        {q.marks || 1}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEditModal(q)}
                            className="p-1.5 bg-slate-100 hover:bg-[#1B2A6B] text-slate-600 hover:text-white rounded-lg transition-colors"
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            onClick={() => handleDeleteQuestion(q.id)}
                            className="p-1.5 bg-slate-100 hover:bg-rose-600 text-slate-600 hover:text-white rounded-lg transition-colors"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add / Edit Question Modal */}
      {isQuestionModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 lg:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center pb-4 mb-6 border-b border-slate-100">
              <h3 className="text-xl font-black text-[#0d1635]">
                {editingQuestion ? "Edit Database Question" : "Add New Database Question"}
              </h3>
              <button onClick={() => setIsQuestionModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveQuestion} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Category Track *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                    required
                  >
                    <option value="Web Development">Web Development</option>
                    <option value="Digital Marketing">Digital Marketing</option>
                    <option value="Graphic Designing">Graphic Designing</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Question Order #</label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Question Text *</label>
                <textarea
                  rows={3}
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  placeholder="Enter MCQ question..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Option A *</label>
                  <input
                    type="text"
                    value={formData.option_a}
                    onChange={(e) => setFormData({ ...formData, option_a: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Option B *</label>
                  <input
                    type="text"
                    value={formData.option_b}
                    onChange={(e) => setFormData({ ...formData, option_b: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Option C *</label>
                  <input
                    type="text"
                    value={formData.option_c}
                    onChange={(e) => setFormData({ ...formData, option_c: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Option D *</label>
                  <input
                    type="text"
                    value={formData.option_d}
                    onChange={(e) => setFormData({ ...formData, option_d: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Correct Answer Key *</label>
                  <select
                    value={formData.correct_answer}
                    onChange={(e) => setFormData({ ...formData, correct_answer: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-emerald-700"
                    required
                  >
                    <option value="A">Option A</option>
                    <option value="B">Option B</option>
                    <option value="C">Option C</option>
                    <option value="D">Option D</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Marks</label>
                  <input
                    type="number"
                    value={formData.marks}
                    onChange={(e) => setFormData({ ...formData, marks: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Explanation (Optional)</label>
                <textarea
                  rows={2}
                  value={formData.explanation}
                  onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                  placeholder="Rationale or explanation for correct answer..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsQuestionModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#1B2A6B] hover:bg-[#0d1635] text-white font-bold rounded-xl shadow-md"
                >
                  Save Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Import Questions Modal with Preview */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 lg:p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center pb-4 mb-6 border-b border-slate-100">
              <div>
                <h3 className="text-xl font-black text-[#0d1635]">Import Questions to Database</h3>
                <p className="text-xs text-slate-500 font-medium">Upload Excel (.xlsx, .csv, .json) file containing 100 MCQs.</p>
              </div>
              <button onClick={() => setIsImportModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X size={20} />
              </button>
            </div>

            {importStep === "upload" ? (
              <div className="space-y-6 text-center py-6">
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-300 hover:border-[#1B2A6B] bg-slate-50/50 hover:bg-blue-50/30 rounded-3xl p-10 cursor-pointer transition-all flex flex-col items-center justify-center space-y-3"
                >
                  <FileSpreadsheet size={48} className="text-[#1B2A6B]" />
                  <div>
                    <p className="text-sm font-bold text-slate-700">Click or drag & drop questions spreadsheet</p>
                    <p className="text-xs text-slate-400 mt-1">Supports .xlsx, .xls, .csv, or .json</p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".xlsx,.xls,.csv,.json"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>

                <div className="flex items-center justify-between text-xs pt-4 border-t border-slate-100">
                  <span className="text-slate-500">Need the standardized template format?</span>
                  <button
                    onClick={() => AssessmentService.downloadQuestionsTemplate()}
                    className="font-bold text-[#1B2A6B] hover:underline flex items-center gap-1"
                  >
                    <Download size={14} /> Download Sample Template (.xlsx)
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6 text-xs">
                {/* Validation Summary Cards */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Total Found</span>
                    <p className="text-2xl font-black text-[#0d1635]">{previewData?.total_found}</p>
                  </div>
                  <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100 text-center">
                    <span className="text-[10px] uppercase font-bold text-emerald-600">Valid Questions</span>
                    <p className="text-2xl font-black text-emerald-700">{previewData?.valid_count}</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-2xl border border-purple-100 text-center">
                    <span className="text-[10px] uppercase font-bold text-purple-600">Duplicates Detected</span>
                    <p className="text-2xl font-black text-purple-700">{previewData?.duplicate_count}</p>
                  </div>
                </div>

                {/* Category Counts */}
                {previewData?.category_counts && (
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <h4 className="font-bold text-slate-700 mb-2">Track Distribution:</h4>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(previewData.category_counts).map(([cat, count]: any) => (
                        <span key={cat} className="px-3 py-1 bg-white border border-slate-200 rounded-lg font-bold text-slate-700">
                          {cat}: <strong className="text-[#1B2A6B]">{count}</strong>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Duplicate Strategy Option */}
                {previewData?.duplicate_count > 0 && (
                  <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 space-y-2">
                    <h4 className="font-bold text-amber-800">Duplicate Handling Strategy:</h4>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-1.5 font-bold text-amber-900 cursor-pointer">
                        <input
                          type="radio"
                          name="dup"
                          value="update"
                          checked={duplicateStrategy === "update"}
                          onChange={(e) => setDuplicateStrategy(e.target.value)}
                        />
                        Update existing questions
                      </label>
                      <label className="flex items-center gap-1.5 font-bold text-amber-900 cursor-pointer">
                        <input
                          type="radio"
                          name="dup"
                          value="skip"
                          checked={duplicateStrategy === "skip"}
                          onChange={(e) => setDuplicateStrategy(e.target.value)}
                        />
                        Skip duplicates
                      </label>
                      <label className="flex items-center gap-1.5 font-bold text-amber-900 cursor-pointer">
                        <input
                          type="radio"
                          name="dup"
                          value="create_new"
                          checked={duplicateStrategy === "create_new"}
                          onChange={(e) => setDuplicateStrategy(e.target.value)}
                        />
                        Import as new duplicates
                      </label>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                  <button
                    onClick={() => setImportStep("upload")}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                  >
                    Select Different File
                  </button>

                  <button
                    onClick={handleConfirmImport}
                    disabled={isProcessingImport || previewData?.valid_count === 0}
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold rounded-xl shadow-md flex items-center gap-2"
                  >
                    {isProcessingImport ? "Importing to Database..." : `Confirm & Import ${previewData?.valid_count} Questions`}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </AdminDashboardLayout>
  );
}
