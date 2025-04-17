import React, { useRef, useState } from "react";

interface ProcessTicketModalProps {
  isOpen: boolean;
  ticketID: string;
  isDarkMode: boolean;
  onClose: () => void;
}

const ProcessTicketModal: React.FC<ProcessTicketModalProps> = ({
  isOpen,
  ticketID,
  isDarkMode,
  onClose,
}) => {
  if (!isOpen) return null;

  const [isLoading, setIsLoading] = useState(false);
  const [action, setAction] = useState<string>("complete");
  const [completionFiles, setCompletionFiles] = useState<File[]>([]);
  const [errorFiles, setErrorFiles] = useState<File[]>([]);

  const completionInputRef = useRef<HTMLInputElement>(null);
  const errorInputRef = useRef<HTMLInputElement>(null);

  const handleCompletionFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files.length > 0) {
      setCompletionFiles(Array.from(e.target.files));
    }
  };

  const handleErrorFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setErrorFiles(Array.from(e.target.files));
    }
  };

  const formRef = useRef<HTMLFormElement | null>(null);
  const submitBtnRef = useRef<HTMLButtonElement | null>(null);
  const ticketIdRef = useRef<HTMLInputElement | null>(null);

  const submitProcessTicket = async () => {
    const form = formRef.current;
    if (!form) return;
  };

  return (
    <div className="fixed inset-0  flex items-center justify-center z-50">
      <div
        className={`${
          isDarkMode ? "bg-[#1F2937]" : "bg-white"
        } rounded-lg p-6 w-[600px] shadow-xl border border-gray-600`}
      >
        <div className="flex justify-between items-center mb-4">
          <h2
            className={`text-xl font-semibold ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Process Ticket
          </h2>
          <button
            onClick={onClose}
            className={`${
              isDarkMode
                ? "text-gray-400 hover:text-gray-300"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <hr className="mb-3" />
        <div className="modal-body">
          <form id="processTicketForm">
            <input type="hidden" id="processTicketId" name="ticket_id" />
            {/* Ticket ID Display */}
            <div
              className="alert alert-primary mb-3 text-left"
              id="ticketIdDisplay"
            >
              <strong>Ticket ID: {ticketID}</strong>{" "}
              <span id="displayTicketId"></span>
            </div>
            {/* Action Selection */}
            <div className="mb-3 flex flex-col">
              <label className="flex justify-start mb-2">Action</label>
              <div className="text-left ml-4">
                <label className="form-check-label" htmlFor="actionComplete">
                  <input
                    className="mr-2"
                    type="radio"
                    name="action"
                    id="actionComplete"
                    value="complete"
                    checked={action === "complete"}
                    onChange={() => setAction("complete")}
                  />
                  Complete Ticket
                </label>
              </div>
              <div className="text-left ml-4">
                <label className="form-check-label" htmlFor="actionError">
                  <input
                    className="mr-2"
                    type="radio"
                    name="action"
                    id="actionError"
                    value="report_error"
                    checked={action === "report_error"}
                    onChange={() => setAction("report_error")}
                  />
                  Report Error
                </label>
              </div>
            </div>
            <div className="container">
              {/* Completion Images Section */}
              <div
                id="completionSection"
                style={{ display: action === "complete" ? "block" : "none" }}
              >
                <div className="mb-3">
                  <p className="text-left mb-2">Upload Completion Images</p>
                  <div className="file-input-container">
                    <input
                      ref={completionInputRef}
                      type="file"
                      className="file-input"
                      id="completionImages"
                      name="completion_images[]"
                      multiple
                      accept="image/*"
                      onChange={handleCompletionFileChange}
                    />
                    <div className="file-input-custom">
                      <button className="choose-files-btn">Choose Files</button>
                      <span className="file-chosen">
                        {completionFiles.length > 0
                          ? `${completionFiles.length} file${
                              completionFiles.length > 1 ? "s" : ""
                            } chosen`
                          : "No file chosen"}
                      </span>
                    </div>
                  </div>
                </div>
                <div
                  id="imagePreviewContainer"
                  className="image-preview-container"
                >
                  {completionFiles.map((file, index) => (
                    <div key={index} className="image-preview">
                      <img
                        src={URL.createObjectURL(file) || "/placeholder.svg"}
                        alt={`Preview ${index}`}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Error Images Upload */}
              <div
                id="errorSection"
                style={{
                  display: action === "report_error" ? "block" : "none",
                }}
              >
                <div className="mb-3">
                  <label className="text-left mb-2">
                    Upload Screenshots (Optional)
                  </label>
                  <div className="file-input-container">
                    <input
                      ref={errorInputRef}
                      type="file"
                      className="file-input"
                      id="errorImages"
                      name="error_images[]"
                      multiple
                      accept="image/*"
                      onChange={handleErrorFileChange}
                    />
                    <div className="file-input-custom">
                      <button className="choose-files-btn">Choose Files</button>
                      <span className="file-chosen">
                        {errorFiles.length > 0
                          ? `${errorFiles.length} file${
                              errorFiles.length > 1 ? "s" : ""
                            } chosen`
                          : "No file chosen"}
                      </span>
                    </div>
                  </div>
                </div>
                <div
                  id="errorImagePreviewContainer"
                  className="image-preview-container"
                >
                  {errorFiles.map((file, index) => (
                    <div key={index} className="image-preview">
                      <img
                        src={URL.createObjectURL(file) || "/placeholder.svg"}
                        alt={`Preview ${index}`}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <style>{`
                .file-input-container {
                  position: relative;
                }
                .file-input {
                  position: absolute;
                  top: 0;
                  left: 0;
                  opacity: 0;
                  width: 100%;
                  height: 100%;
                  cursor: pointer;
                  z-index: 2;
                }
                .file-input-custom {
                  display: flex;
                  align-items: center;
                  border: 1px solid #ccc;
                  border-radius: 4px;
                  overflow: hidden;
                  background: #f8f9fa;
                }
                .choose-files-btn {
                  padding: 6px 12px;
                  background-color: #f0f0f0;
                  border: none;
                  border-right: 1px solid #ccc;
                  color: #333;
                  font-size: 14px;
                  cursor: pointer;
                }
                .file-chosen {
                  padding: 0 12px;
                  color: #6c757d;
                  font-size: 14px;
                }
                .image-preview-container {
                  display: flex;
                  flex-wrap: wrap;
                  gap: 10px;
                  margin-top: 10px;
                }
                .image-preview {
                  width: 100px;
                  height: 100px;
                  border: 1px solid #ddd;
                  border-radius: 4px;
                  overflow: hidden;
                }
                .image-preview img {
                  width: 100%;
                  height: 100%;
                  object-fit: cover;
                }
                .btn {
                  padding: 6px 12px;
                  border-radius: 4px;
                  cursor: pointer;
                }
                .btn-primary {
                  background-color: #0d6efd;
                  color: white;
                  border: 1px solid #0d6efd;
                }
                .btn-secondary {
                  background-color: #6c757d;
                  color: white;
                  border: 1px solid #6c757d;
                }
                .me-2 {
                  margin-right: 0.5rem;
                }
                .mt-4 {
                  margin-top: 1rem;
                }

              `}</style>
            </div>{" "}
          </form>
        </div>

        <hr className="mt-3 mb-3" />
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className={`mr-2 px-4 py-2 rounded-lg ${
              isDarkMode
                ? "bg-gray-700 text-white hover:bg-gray-600"
                : "bg-gray-200 text-white hover:bg-gray-300"
            }`}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={submitProcessTicket}
            className={`px-4 py-2 rounded-lg ${
              isDarkMode
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-blue-500 text-white hover:bg-blue-600"
            } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProcessTicketModal;
