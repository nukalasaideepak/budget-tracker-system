// ─────────────────────────────────────────────────────────────
//  ExportBackup.js — Module 5: Export & Cloud Backup
// ─────────────────────────────────────────────────────────────

import React, { useState } from "react";

const exportStyles = `
  .eb-container { display: flex; flex-direction: column; gap: 24px; }

  .eb-section { background: #13131a; border: 1px solid rgba(255,255,255,0.05); border-radius: 16px; padding: 28px; }
  .eb-section-title { font-family: 'Syne', sans-serif; font-size: 17px; font-weight: 700; color: #fff; margin-bottom: 8px; letter-spacing: -0.3px; }
  .eb-section-desc { font-size: 13px; color: #666680; margin-bottom: 20px; }

  .eb-btn-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }

  .eb-card { background: #1a1a26; border: 1px solid rgba(255,255,255,0.06); border-radius: 14px; padding: 24px; display: flex; flex-direction: column; align-items: center; gap: 14px; text-align: center; transition: all 0.2s; cursor: pointer; }
  .eb-card:hover { transform: translateY(-2px); border-color: rgba(0,255,136,0.2); }

  .eb-card-icon { font-size: 40px; }
  .eb-card-title { font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 700; color: #fff; }
  .eb-card-desc { font-size: 12px; color: #666680; }

  .eb-download-btn { padding: 10px 24px; background: linear-gradient(135deg, #00ff88, #00cc6a); border: none; border-radius: 10px; color: #0a0a0f; font-size: 13px; font-weight: 700; font-family: 'Syne', sans-serif; cursor: pointer; transition: all 0.2s; width: 100%; }
  .eb-download-btn:hover { box-shadow: 0 6px 20px rgba(0,255,136,0.2); transform: translateY(-1px); }
  .eb-download-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

  .eb-cloud-btn { padding: 10px 24px; border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; font-size: 13px; font-weight: 600; font-family: 'DM Sans', sans-serif; cursor: pointer; transition: all 0.2s; width: 100%; }
  .eb-cloud-btn:hover { transform: translateY(-1px); }
  .eb-gdrive-btn { background: rgba(66,133,244,0.12); color: #4285f4; border-color: rgba(66,133,244,0.3); }
  .eb-gdrive-btn:hover { background: rgba(66,133,244,0.2); }
  .eb-dropbox-btn { background: rgba(0,97,255,0.12); color: #0061ff; border-color: rgba(0,97,255,0.3); }
  .eb-dropbox-btn:hover { background: rgba(0,97,255,0.2); }

  .eb-status { padding: 12px 16px; border-radius: 10px; font-size: 13px; font-weight: 500; margin-top: 12px; animation: fadeIn 0.3s ease; }
  .eb-status-success { background: rgba(0,255,136,0.1); border: 1px solid rgba(0,255,136,0.2); color: #00ff88; }
  .eb-status-error { background: rgba(255,107,107,0.1); border: 1px solid rgba(255,107,107,0.2); color: #ff6b6b; }
  .eb-status-info { background: rgba(124,140,248,0.1); border: 1px solid rgba(124,140,248,0.2); color: #7c8cf8; }

  @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
`;

function ExportBackupModule({ token }) {
  const [status, setStatus] = useState(null);
  const [downloading, setDownloading] = useState("");

  const downloadFile = async (type) => {
    setDownloading(type);
    setStatus(null);
    try {
      const res = await fetch(`http://localhost:8080/api/export/${type}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Export failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `budgetwise_report.${type}`;
      a.click();
      URL.revokeObjectURL(url);
      setStatus({ type: "success", msg: `✅ ${type.toUpperCase()} downloaded successfully!` });
    } catch (e) {
      setStatus({ type: "error", msg: `❌ Failed to download ${type.toUpperCase()}` });
    } finally {
      setDownloading("");
    }
  };

  const handleCloudUpload = (provider) => {
    setStatus({ type: "info", msg: `📤 Opening ${provider} upload dialog... (Download the file first, then upload manually)` });
    if (provider === "Google Drive") {
      window.open("https://drive.google.com/drive/my-drive", "_blank");
    } else {
      window.open("https://www.dropbox.com/home", "_blank");
    }
  };

  return (
    <>
      <style>{exportStyles}</style>
      <div className="eb-container">

        {/* ── DOWNLOAD SECTION ── */}
        <div className="eb-section">
          <div className="eb-section-title">📥 Export Financial Data</div>
          <div className="eb-section-desc">Download your complete transaction history as CSV or PDF</div>
          <div className="eb-btn-grid">
            <div className="eb-card">
              <div className="eb-card-icon">📄</div>
              <div className="eb-card-title">CSV Export</div>
              <div className="eb-card-desc">Spreadsheet-compatible format with all transactions</div>
              <button className="eb-download-btn" onClick={() => downloadFile("csv")} disabled={downloading === "csv"}>
                {downloading === "csv" ? "⏳ Downloading..." : "📥 Download CSV"}
              </button>
            </div>
            <div className="eb-card">
              <div className="eb-card-icon">📑</div>
              <div className="eb-card-title">PDF Export</div>
              <div className="eb-card-desc">Styled financial report with summary and details</div>
              <button className="eb-download-btn" onClick={() => downloadFile("pdf")} disabled={downloading === "pdf"}>
                {downloading === "pdf" ? "⏳ Downloading..." : "📥 Download PDF"}
              </button>
            </div>
          </div>
        </div>

        {/* ── CLOUD BACKUP SECTION ── */}
        <div className="eb-section">
          <div className="eb-section-title">☁️ Backup to Cloud</div>
          <div className="eb-section-desc">Upload your exported data to Google Drive or Dropbox for safekeeping</div>
          <div className="eb-btn-grid">
            <div className="eb-card">
              <div className="eb-card-icon">
                <span style={{ fontSize: 40 }}>🔵</span>
              </div>
              <div className="eb-card-title">Google Drive</div>
              <div className="eb-card-desc">Save your financial reports to Google Drive</div>
              <button className="eb-cloud-btn eb-gdrive-btn" onClick={() => handleCloudUpload("Google Drive")}>
                📤 Upload to Google Drive
              </button>
            </div>
            <div className="eb-card">
              <div className="eb-card-icon">
                <span style={{ fontSize: 40 }}>📦</span>
              </div>
              <div className="eb-card-title">Dropbox</div>
              <div className="eb-card-desc">Save your financial reports to Dropbox</div>
              <button className="eb-cloud-btn eb-dropbox-btn" onClick={() => handleCloudUpload("Dropbox")}>
                📤 Upload to Dropbox
              </button>
            </div>
          </div>
        </div>

        {/* ── STATUS ── */}
        {status && (
          <div className={`eb-status eb-status-${status.type}`}>
            {status.msg}
          </div>
        )}

      </div>
    </>
  );
}

export default ExportBackupModule;
