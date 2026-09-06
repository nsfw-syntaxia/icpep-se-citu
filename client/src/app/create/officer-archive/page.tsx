"use client";

import React, { useState, useRef, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Sidebar from "@/app/create/components/sidebar";
import Button from "@/app/components/button";
import Header from "@/app/components/header";
import Footer from "@/app/components/footer";
import Grid from "@/app/components/grid";
import {
  Pencil,
  Trash2,
  RefreshCw,
  AlertTriangle,
  Upload,
  Archive,
  ImageIcon,
  ChevronDown,
  Check,
} from "lucide-react";
import officerTermService, {
  OfficerTermData,
} from "@/app/services/officerTerm";
import { getCurrentAcademicYear } from "@/app/utils/academic-year";

// --- INTERFACES ---
interface OfficerTerm {
  _id: string;
  name: string;
  position: string;
  role?: string;
  departmentType: "executive" | "committee";
  committeeName?: string;
  termYear: string;
  image?: string;
  isActive: boolean;
}

type FormErrors = {
  name: boolean;
  position: boolean;
  termYear: boolean;
  committeeName: boolean;
};

const COMMITTEES_LIST = [
  "Committee on Internal Affairs",
  "Committee on External Affairs",
  "Committee on Finance",
  "Committee on Public Relations",
  "Research and Development Committee",
  "Training and Seminar Committee",
  "Sports and Cultural Committee",
  "Media and Documentation Committee",
];

export default function OfficerArchivePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const editIdParam = searchParams.get("edit");

  const [showGlobalError, setShowGlobalError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [loadingAction, setLoadingAction] = useState<
    "saving" | "publishing" | null
  >(null);
  const [successMessage, setSuccessMessage] = useState({
    title: "",
    description: "",
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const [departmentType, setDepartmentType] = useState<
    "executive" | "committee"
  >("executive");
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    role: "",
    committeeName: "",
    termYear: getCurrentAcademicYear(),
  });
  const [errors, setErrors] = useState<FormErrors>({
    name: false,
    position: false,
    termYear: false,
    committeeName: false,
  });

  const [terms, setTerms] = useState<OfficerTerm[]>([]);
  const [isLoadingList, setIsLoadingList] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isEditingDraft, setIsEditingDraft] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [cover, setCover] = useState<File | null>(null);
  const [yearFilter, setYearFilter] = useState<string>("all");
  const [isCommitteeDropdownOpen, setIsCommitteeDropdownOpen] = useState(false);

  const fetchTerms = async () => {
    setIsLoadingList(true);
    try {
      const response = await officerTermService.getAllOfficerTerms();
      const data = Array.isArray(response.data)
        ? response.data
        : Array.isArray(response)
          ? response
          : [];
      setTerms(data);
      if (editIdParam) {
        const itemToEdit = data.find(
          (t: OfficerTerm) => t._id === editIdParam,
        );
        if (itemToEdit) handleEditClick(itemToEdit);
      }
    } catch (error) {
      console.error("Failed to fetch officer terms:", error);
    } finally {
      setIsLoadingList(false);
    }
  };

  useEffect(() => {
    fetchTerms();
  }, [editIdParam]);

  const handleEditClick = (item: OfficerTerm) => {
    setEditingId(item._id);
    setIsEditingDraft(!item.isActive);
    setDepartmentType(item.departmentType);
    setFormData({
      name: item.name,
      position: item.position,
      role: item.role || "",
      committeeName: item.committeeName || "",
      termYear: item.termYear,
    });
    setPreview(item.image || null);
    setCover(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setIsEditingDraft(false);
    setDepartmentType("executive");
    setFormData({
      name: "",
      position: "",
      role: "",
      committeeName: "",
      termYear: getCurrentAcademicYear(),
    });
    setPreview(null);
    setCover(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    router.push("/create/officer-archive");
  };

  const confirmDelete = (id: string) => {
    setItemToDelete(id);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    try {
      await officerTermService.deleteOfficerTerm(itemToDelete);
      setTerms((prev) => prev.filter((t) => t._id !== itemToDelete));
      setShowDeleteModal(false);
      setItemToDelete(null);
      setSuccessMessage({
        title: "Deleted Successfully!",
        description: "The archive entry has been permanently removed.",
      });
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Failed to delete officer term:", error);
      alert("Failed to delete archive entry");
    }
  };

  const validate = () => {
    const newErrors = {
      name: !formData.name.trim(),
      position: !formData.position.trim(),
      termYear: !/^\d{4}-\d{4}$/.test(formData.termYear.trim()),
      committeeName: departmentType === "committee" && !formData.committeeName,
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  const buildData = (isActive: boolean): OfficerTermData => ({
    name: formData.name,
    position: formData.position,
    role: formData.role || undefined,
    departmentType,
    committeeName:
      departmentType === "committee" ? formData.committeeName : undefined,
    termYear: formData.termYear,
    image: cover || undefined,
    isActive,
  });

  const handlePublish = async () => {
    if (!validate()) {
      setShowGlobalError(true);
      return;
    }
    setShowGlobalError(false);
    setIsSubmitting(true);
    setLoadingAction("publishing");
    try {
      const data = buildData(true);
      if (editingId) {
        await officerTermService.updateOfficerTerm(editingId, data);
      } else {
        await officerTermService.createOfficerTerm(data);
      }
      setSuccessMessage({
        title:
          editingId && !isEditingDraft
            ? "Updated Successfully!"
            : "Published Successfully!",
        description:
          editingId && !isEditingDraft
            ? "Changes have been saved."
            : "Archive entry is now live.",
      });
      setShowSuccessModal(true);
      handleCancelEdit();
      fetchTerms();
    } catch (error) {
      console.error("Failed to save officer term:", error);
      alert("Failed to save archive entry");
    } finally {
      setIsSubmitting(false);
      setLoadingAction(null);
    }
  };

  const handleSaveDraft = async () => {
    setIsSubmitting(true);
    setLoadingAction("saving");
    setShowGlobalError(false);
    if (!formData.name.trim()) {
      setErrors((p) => ({ ...p, name: true }));
      setShowGlobalError(true);
      setIsSubmitting(false);
      setLoadingAction(null);
      return;
    }
    try {
      const data = {
        ...buildData(false),
        position: formData.position || "TBA",
        termYear: formData.termYear || getCurrentAcademicYear(),
      };
      if (editingId) {
        await officerTermService.updateOfficerTerm(editingId, data);
      } else {
        await officerTermService.createOfficerTerm(data);
      }
      setSuccessMessage({
        title: editingId ? "Draft Updated!" : "Draft Saved!",
        description: editingId
          ? "Draft changes have been saved."
          : "Draft has been saved successfully.",
      });
      setShowSuccessModal(true);
      handleCancelEdit();
      fetchTerms();
    } catch (error) {
      console.error("Failed to save draft:", error);
      alert("Failed to save draft");
    } finally {
      setIsSubmitting(false);
      setLoadingAction(null);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors])
      setErrors((prev) => ({ ...prev, [name]: false }));
  };

  const resizeImage = (file: File, maxWidth = 1200): Promise<File> => {
    return new Promise((resolve) => {
      const img = new Image();
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target?.result as string;
      };
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const scaleSize = maxWidth / img.width;
        canvas.width = maxWidth;
        canvas.height = img.height * scaleSize;
        const ctx = canvas.getContext("2d");
        if (!ctx) return resolve(file);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(
          (blob) => {
            if (!blob) return resolve(file);
            resolve(new File([blob], file.name, { type: file.type }));
          },
          file.type,
          0.8,
        );
      };
      reader.readAsDataURL(file);
    });
  };

  const MAX_IMAGE_SIZE_MB = 5;

  const handleCoverChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
      alert(`Image must be ${MAX_IMAGE_SIZE_MB}MB or smaller.`);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }
    try {
      const resized = await resizeImage(file);
      setCover(resized);
      setPreview(URL.createObjectURL(resized));
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      console.error("Error resizing image", err);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
      alert(`Image must be ${MAX_IMAGE_SIZE_MB}MB or smaller.`);
      return;
    }
    try {
      const resized = await resizeImage(file);
      setCover(resized);
      setPreview(URL.createObjectURL(resized));
    } catch (err) {
      console.error("Error resizing image", err);
    }
  };

  const publishedItems = terms.filter((item) => item.isActive);
  const years = Array.from(
    new Set(publishedItems.map((t) => t.termYear)),
  ).sort((a, b) => b.localeCompare(a));
  const filteredItems =
    yearFilter === "all"
      ? publishedItems
      : publishedItems.filter((t) => t.termYear === yearFilter);

  const inputCls =
    "w-full font-rubik text-base bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 outline-none transition-all placeholder-gray-400 focus:bg-white focus:border-primary1 focus:ring-4 focus:ring-primary1/10";

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden bg-[#004e89]">
      {isSubmitting && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-white/90 backdrop-blur-md">
          <div className="flex flex-col items-center gap-5">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full border-4 border-primary2/20" />
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary2 animate-spin" />
            </div>
            <div className="text-center">
              <p className="text-primary3 font-bold font-rubik text-lg">
                {loadingAction === "saving"
                  ? "Saving Draft"
                  : editingId
                    ? "Updating Entry"
                    : "Publishing Entry"}
              </p>
              <p className="text-gray-400 text-sm font-raleway mt-1">
                Please wait a moment...
              </p>
            </div>
          </div>
        </div>
      )}

      <main className="relative z-10 bg-[#f8f9fc] rounded-b-[40px] md:rounded-b-[50px] overflow-hidden">
        <Grid />

        <div className="relative z-10 flex flex-col min-h-screen">
          <Header />

          <div className="grow w-full max-w-7xl mx-auto px-4 sm:px-6 pt-40 sm:pt-48 pb-20">
            <div className="mb-16 text-left">
              <h1 className="font-rubik text-4xl sm:text-5xl font-bold text-primary3 leading-tight mb-4">
                Officers Archive
              </h1>
              <p className="font-raleway text-gray-600 text-base sm:text-lg max-w-3xl">
                Log past officers per academic year for the About page&apos;s
                &quot;Our Student Leaders&quot; history — independent of who
                currently holds each seat.
              </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 items-start">
              <aside className="w-full lg:w-64 shrink-0">
                <Sidebar />
              </aside>

              <div className="flex-1 min-w-0 space-y-8">
                {/* FORM CARD */}
                <div
                  className={`bg-white rounded-4xl border transition-all duration-300 shadow-lg p-6 sm:p-10 lg:p-12 hover:shadow-primary1/40 hover:-translate-y-2 ${
                    editingId
                      ? "border-primary1 ring-2 ring-primary1/20"
                      : "border-gray-200"
                  }`}
                >
                  {editingId && (
                    <div className="-mx-6 sm:-mx-10 lg:-mx-12 -mt-6 sm:-mt-10 lg:-mt-12 mb-8 bg-linear-to-r from-primary1 to-primary3 px-6 sm:px-10 py-5 flex items-center justify-between rounded-t-4xl">
                      <div className="flex items-center gap-2 text-white">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                        <span className="text-sm font-bold font-rubik tracking-wide">
                          EDITING MODE
                        </span>
                      </div>
                      <button
                        onClick={handleCancelEdit}
                        className="text-white/80 hover:text-white text-sm font-bold font-raleway underline underline-offset-2 transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  )}

                  <div className="flex items-center justify-between mb-8">
                    <p className="text-gray-400 text-sm font-raleway">
                      Fill in the fields below
                    </p>
                    <div className="hidden sm:flex items-center gap-1.5 bg-primary2/8 rounded-full px-4 py-2">
                      <Archive size={12} className="text-primary2" />
                      <span className="text-xs font-bold text-primary2 font-rubik uppercase tracking-wider">
                        Archive Entry
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* LEFT — Upload */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="block text-sm font-bold font-raleway text-gray-700 mb-2 ml-1">
                          Photo
                        </label>
                        <span className="text-xs text-gray-400 font-raleway">
                          Max {MAX_IMAGE_SIZE_MB}MB
                        </span>
                      </div>

                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleCoverChange}
                        ref={fileInputRef}
                      />

                      {preview ? (
                        <div className="relative group rounded-xl overflow-hidden border-2 border-gray-100 bg-gray-50 h-56">
                          <img
                            src={preview}
                            alt="officer preview"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
                            <button
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              className="bg-white text-primary3 text-xs font-bold px-4 py-2 rounded-full shadow-lg hover:scale-105 active:scale-95 transition-transform font-rubik cursor-pointer"
                            >
                              Replace
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                try {
                                  if (preview) URL.revokeObjectURL(preview);
                                } catch {}
                                setCover(null);
                                setPreview(null);
                              }}
                              className="bg-red-500 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg hover:scale-105 active:scale-95 transition-transform font-rubik cursor-pointer"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div
                          role="button"
                          tabIndex={0}
                          onClick={() => fileInputRef.current?.click()}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ")
                              fileInputRef.current?.click();
                          }}
                          onDragOver={(e) => {
                            e.preventDefault();
                            setIsDragging(true);
                          }}
                          onDragLeave={() => setIsDragging(false)}
                          onDrop={handleDrop}
                          className={`cursor-pointer h-56 rounded-xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center gap-4 ${
                            isDragging
                              ? "border-primary2 bg-primary2/5 scale-[1.01]"
                              : "border-gray-200 bg-gray-50/80 hover:border-primary2/60 hover:bg-primary2/3"
                          }`}
                        >
                          <div
                            className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${
                              isDragging
                                ? "bg-primary2 text-white"
                                : "bg-white text-primary2 shadow-md"
                            }`}
                          >
                            <Upload size={22} strokeWidth={2.5} />
                          </div>
                          <div className="text-center">
                            <p className="text-sm font-bold text-gray-700 font-rubik">
                              {isDragging ? "Drop it!" : "Upload photo"}
                            </p>
                            <p className="text-xs text-gray-400 mt-1 font-raleway">
                              Drag & drop or click · PNG, JPG
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* RIGHT — Info */}
                    <div className="space-y-5">
                      <div className="space-y-2">
                        <label className="block text-sm font-bold font-raleway text-gray-700 mb-2 ml-1">
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="e.g., Dela Cruz, Juan"
                          className={`${inputCls} ${errors.name ? "border-red-300 ring-2 ring-red-100" : ""}`}
                        />
                        {errors.name && (
                          <p className="text-xs text-red-400 font-raleway flex items-center gap-1">
                            <span className="inline-block w-1 h-1 bg-red-400 rounded-full" />
                            Name is required
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-bold font-raleway text-gray-700 mb-2 ml-1">
                          Department Type <span className="text-red-500">*</span>
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          {(["executive", "committee"] as const).map((t) => (
                            <button
                              key={t}
                              type="button"
                              onClick={() => setDepartmentType(t)}
                              className={`px-5 py-2.5 rounded-xl text-sm font-semibold font-rubik border-2 transition-all duration-200 cursor-pointer ${
                                departmentType === t
                                  ? "border-primary1 text-primary1 bg-primary1/10"
                                  : "border-gray-300 text-gray-600 hover:border-gray-400 hover:text-gray-800 bg-transparent"
                              }`}
                            >
                              {t === "executive"
                                ? "Executive Council"
                                : "Committee"}
                            </button>
                          ))}
                        </div>
                      </div>

                      {departmentType === "committee" && (
                        <div className="space-y-2">
                          <label className="block text-sm font-bold font-raleway text-gray-700 mb-2 ml-1">
                            Committee <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <div
                              onClick={() =>
                                setIsCommitteeDropdownOpen((p) => !p)
                              }
                              className={`flex w-full cursor-pointer items-center justify-between rounded-2xl border bg-gray-50 px-4 py-3 font-rubik text-base text-gray-700 transition-all hover:bg-gray-100 ${
                                errors.committeeName
                                  ? "border-red-300 ring-2 ring-red-100"
                                  : "border-gray-200"
                              } ${
                                isCommitteeDropdownOpen
                                  ? "bg-white border-primary1 ring-4 ring-primary1/10"
                                  : ""
                              }`}
                            >
                              <span
                                className={
                                  formData.committeeName
                                    ? "text-gray-800"
                                    : "text-gray-400 font-normal"
                                }
                              >
                                {formData.committeeName ||
                                  "Select committee"}
                              </span>
                              <ChevronDown
                                className={`h-5 w-5 shrink-0 text-gray-400 transition-transform duration-300 ${
                                  isCommitteeDropdownOpen ? "rotate-180" : ""
                                }`}
                              />
                            </div>
                            {isCommitteeDropdownOpen && (
                              <>
                                <div
                                  className="fixed inset-0 z-10"
                                  onClick={() =>
                                    setIsCommitteeDropdownOpen(false)
                                  }
                                />
                                <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl">
                                  <div className="flex max-h-56 flex-col gap-1 overflow-y-auto p-2 themed-scrollbar">
                                    {COMMITTEES_LIST.map((c) => (
                                      <div
                                        key={c}
                                        onClick={() => {
                                          setFormData((prev) => ({
                                            ...prev,
                                            committeeName: c,
                                          }));
                                          setErrors((prev) => ({
                                            ...prev,
                                            committeeName: false,
                                          }));
                                          setIsCommitteeDropdownOpen(false);
                                        }}
                                        className={`flex cursor-pointer items-center justify-between rounded-xl px-3 py-2 font-rubik text-sm transition-colors ${
                                          formData.committeeName === c
                                            ? "bg-primary1/5 text-primary1"
                                            : "text-gray-700 hover:bg-gray-50"
                                        }`}
                                      >
                                        <span>{c}</span>
                                        {formData.committeeName === c && (
                                          <Check className="h-4 w-4 text-primary1" />
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </>
                            )}
                          </div>
                          {errors.committeeName && (
                            <p className="text-xs text-red-400 font-raleway flex items-center gap-1">
                              <span className="inline-block w-1 h-1 bg-red-400 rounded-full" />
                              Committee is required
                            </p>
                          )}
                        </div>
                      )}

                      <div className="space-y-2">
                        <label className="block text-sm font-bold font-raleway text-gray-700 mb-2 ml-1">
                          Position <span className="text-red-500">*</span>
                        </label>
                        <input
                          name="position"
                          value={formData.position}
                          onChange={handleInputChange}
                          placeholder={
                            departmentType === "executive"
                              ? "e.g., President"
                              : "e.g., Committee Head"
                          }
                          className={`${inputCls} ${errors.position ? "border-red-300 ring-2 ring-red-100" : ""}`}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-bold font-raleway text-gray-700 mb-2 ml-1">
                          Sub-label
                        </label>
                        <input
                          name="role"
                          value={formData.role}
                          onChange={handleInputChange}
                          placeholder="e.g., Batch Representative"
                          className={inputCls}
                        />
                      </div>
                      {errors.position && (
                        <p className="text-xs text-red-400 font-raleway flex items-center gap-1 -mt-3">
                          <span className="inline-block w-1 h-1 bg-red-400 rounded-full" />
                          Position is required
                        </p>
                      )}

                      <div className="space-y-2">
                        <label className="block text-sm font-bold font-raleway text-gray-700 mb-2 ml-1">
                          Academic Year <span className="text-red-500">*</span>
                        </label>
                        <input
                          name="termYear"
                          value={formData.termYear}
                          onChange={handleInputChange}
                          placeholder="e.g., 2024-2025"
                          className={`${inputCls} ${errors.termYear ? "border-red-300 ring-2 ring-red-100" : ""}`}
                        />
                        {errors.termYear && (
                          <p className="text-xs text-red-400 font-raleway flex items-center gap-1">
                            <span className="inline-block w-1 h-1 bg-red-400 rounded-full" />
                            Use the format YYYY-YYYY
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* ACTIONS */}
                  <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                    {showGlobalError && (
                      <p className="text-red-400 text-xs font-bold font-raleway flex items-center gap-1.5">
                        <AlertTriangle size={12} /> Please fill all required
                        fields
                      </p>
                    )}

                    <div className="flex flex-wrap gap-3 ml-auto">
                      {editingId && (
                        <Button
                          type="button"
                          variant="heroOutline"
                          onClick={handleCancelEdit}
                          className="px-6 py-3"
                        >
                          Cancel
                        </Button>
                      )}

                      {(!editingId || isEditingDraft) && (
                        <Button
                          type="button"
                          variant="heroOutline"
                          onClick={handleSaveDraft}
                          disabled={isSubmitting}
                          className="px-6 py-3"
                        >
                          {editingId ? "Update Draft" : "Save Draft"}
                        </Button>
                      )}

                      <Button
                        type="button"
                        variant="hero"
                        onClick={handlePublish}
                        disabled={isSubmitting}
                        className="px-8 py-3"
                      >
                        {editingId && !isEditingDraft
                          ? "Update Entry"
                          : "Publish Entry"}
                      </Button>
                    </div>
                  </div>
                </div>

                {/* MANAGE LIST */}
                <div className="bg-white rounded-4xl border transition-all duration-300 shadow-md hover:shadow-primary1/40 hover:-translate-y-2 border-gray-200 overflow-hidden">
                  <div className="px-6 sm:px-8 py-6 border-b border-gray-100 flex flex-wrap justify-between items-center gap-4">
                    <div>
                      <h2 className="text-xl font-bold font-rubik text-primary3">
                        Published Archive
                      </h2>
                      <p className="text-gray-400 text-xs font-raleway mt-0.5 tracking-wide">
                        {filteredItems.length} active{" "}
                        {filteredItems.length === 1 ? "entry" : "entries"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {years.length > 0 && (
                        <select
                          value={yearFilter}
                          onChange={(e) => setYearFilter(e.target.value)}
                          className="text-xs font-bold font-rubik text-primary1 border border-primary1/20 hover:border-primary1/50 px-3 py-2 rounded-full transition-all duration-200 cursor-pointer bg-white outline-none"
                        >
                          <option value="all">All years</option>
                          {years.map((y) => (
                            <option key={y} value={y}>
                              {y}
                            </option>
                          ))}
                        </select>
                      )}
                      <button
                        onClick={fetchTerms}
                        className="flex items-center gap-2 text-xs font-bold font-rubik text-primary1 border border-primary1/20 hover:border-primary1/50 hover:bg-primary1/5 px-4 py-2 rounded-full transition-all duration-200 cursor-pointer"
                      >
                        <RefreshCw
                          size={13}
                          className={isLoadingList ? "animate-spin" : ""}
                        />
                        Refresh
                      </button>
                    </div>
                  </div>

                  {isLoadingList ? (
                    <div className="py-20 flex flex-col items-center gap-3 text-gray-300">
                      <div className="w-8 h-8 border-2 border-gray-200 border-t-primary2 rounded-full animate-spin" />
                      <p className="text-sm font-raleway">
                        Loading archive...
                      </p>
                    </div>
                  ) : filteredItems.length === 0 ? (
                    <div className="py-20 flex flex-col items-center gap-4 text-gray-300">
                      <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center">
                        <ImageIcon size={24} className="text-gray-300" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-bold font-rubik text-gray-400">
                          No archive entries yet
                        </p>
                        <p className="text-xs font-raleway mt-0.5">
                          Create one using the form above
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="overflow-x-auto themed-scrollbar">
                      <table className="w-full text-left min-w-170">
                        <thead>
                          <tr className="bg-gray-50/80">
                            <th className="px-6 sm:px-8 py-3.5 text-[10px] font-semibold uppercase tracking-widest text-gray-400 font-raleway">
                              Photo
                            </th>
                            <th className="px-4 py-3.5 text-[10px] font-semibold uppercase tracking-widest text-gray-400 font-raleway">
                              Name
                            </th>
                            <th className="px-4 py-3.5 text-[10px] font-semibold uppercase tracking-widest text-gray-400 font-raleway">
                              Position
                            </th>
                            <th className="px-4 py-3.5 text-[10px] font-semibold uppercase tracking-widest text-gray-400 font-raleway">
                              Department
                            </th>
                            <th className="px-4 py-3.5 text-[10px] font-semibold uppercase tracking-widest text-gray-400 font-raleway">
                              Year
                            </th>
                            <th className="px-6 sm:px-8 py-3.5 text-right text-[10px] font-semibold uppercase tracking-widest text-gray-400 font-raleway">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredItems.map((item) => {
                            const isEditing = editingId === item._id;
                            return (
                              <tr
                                key={item._id}
                                className={`group border-t border-gray-50 transition-all duration-200 ${isEditing ? "bg-primary1/5" : "hover:bg-gray-50/70"}`}
                              >
                                <td className="px-6 sm:px-8 py-4">
                                  <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center">
                                    {item.image ? (
                                      <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-full h-full object-cover"
                                      />
                                    ) : (
                                      <Archive
                                        size={14}
                                        className="text-gray-300"
                                      />
                                    )}
                                  </div>
                                </td>
                                <td className="px-4 py-4">
                                  <div className="flex items-center gap-2">
                                    {isEditing && (
                                      <span className="w-1.5 h-1.5 rounded-full bg-primary1 animate-pulse shrink-0" />
                                    )}
                                    <span className="font-bold text-sm text-gray-800 font-rubik">
                                      {item.name}
                                    </span>
                                  </div>
                                </td>
                                <td className="px-4 py-4">
                                  <span className="text-xs text-gray-600 font-raleway">
                                    {item.position}
                                    {item.role ? ` · ${item.role}` : ""}
                                  </span>
                                </td>
                                <td className="px-4 py-4">
                                  <span
                                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-raleway font-semibold border ${
                                      item.departmentType === "executive"
                                        ? "bg-primary1/8 text-primary1 border-primary1/30"
                                        : "bg-primary2/8 text-primary2 border-primary2/30"
                                    }`}
                                  >
                                    {item.departmentType === "executive"
                                      ? "Executive"
                                      : item.committeeName || "Committee"}
                                  </span>
                                </td>
                                <td className="px-4 py-4">
                                  <span className="text-xs text-gray-600 font-raleway">
                                    {item.termYear}
                                  </span>
                                </td>
                                <td className="px-6 sm:px-8 py-4 text-right">
                                  <div className="inline-flex items-center gap-1 opacity-0 group-hover:opacity-100 sm:opacity-100 transition-opacity">
                                    <button
                                      onClick={() => handleEditClick(item)}
                                      className="p-2 text-gray-400 hover:text-primary1 hover:bg-primary1/10 rounded-lg transition-all duration-150 cursor-pointer"
                                      title="Edit"
                                    >
                                      <Pencil size={15} />
                                    </button>
                                    <button
                                      onClick={() => confirmDelete(item._id)}
                                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-150 cursor-pointer"
                                      title="Delete"
                                    >
                                      <Trash2 size={15} />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <div className="-mt-8.75 md:-mt-20 relative z-0">
        <Footer />
      </div>

      {/* DELETE MODAL */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-110 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowDeleteModal(false)}
          />
          <div className="relative bg-white rounded-2xl p-8 w-full max-w-sm shadow-2xl text-center">
            <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-primary3 font-rubik mb-2">
              Delete Entry?
            </h3>
            <p className="text-gray-400 text-sm font-raleway mb-6 leading-relaxed">
              This will permanently remove this archive entry. This action
              cannot be undone.
            </p>
            <div className="flex gap-3">
              <Button
                variant="heroOutline"
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-3"
              >
                Cancel
              </Button>
              <Button
                variant="heroDanger"
                onClick={handleDelete}
                className="flex-1 py-3"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* SUCCESS MODAL */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-110 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowSuccessModal(false)}
          />
          <div className="relative bg-white rounded-2xl p-8 w-full max-w-sm shadow-2xl">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-green-400/20 rounded-full animate-ping" />
                <div className="w-20 h-20 rounded-full bg-linear-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-xl relative">
                  <svg
                    className="w-10 h-10 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>
            </div>
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-primary3 font-rubik">
                {successMessage.title}
              </h3>
              <p className="text-gray-400 text-sm font-raleway mt-2">
                {successMessage.description}
              </p>
            </div>
            <Button
              variant="hero"
              onClick={() => setShowSuccessModal(false)}
              className="w-full py-3 text-sm"
            >
              Continue
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
