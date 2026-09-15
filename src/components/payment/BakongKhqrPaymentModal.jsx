import { useState, useEffect, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { bakongService } from "../../services/bakongService";

/**
 * Production-ready Bakong KHQR Payment Modal for Cambodia National Bank (NBC) standard.
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Controls modal visibility
 * @param {Function} props.onClose - Triggered when modal is closed or dismissed
 * @param {Function} [props.onSuccess] - Callback when payment is successfully confirmed
 * @param {number} props.amount - Amount to be paid (e.g. 25.00)
 * @param {string} [props.currency="USD"] - "USD" or "KHR"
 * @param {number} [props.bookingId] - Associated ticket, room, or food booking ID
 * @param {string} [props.bookingType="TICKET"] - "TICKET", "ROOM", "FOOD_ORDER", or "GENERAL"
 * @param {string} [props.description="Tour Booking"] - Description displayed to customer
 */
export default function BakongKhqrPaymentModal({
  isOpen,
  onClose,
  onSuccess,
  amount = 10.0,
  currency = "USD",
  bookingId,
  bookingType = "TICKET",
  description = "Tourism Booking",
}) {
  const { t } = useTranslation();

  // UI States: 'IDLE' | 'GENERATING' | 'SCANNING' | 'SUCCESS' | 'EXPIRED' | 'ERROR'
  const [status, setStatus] = useState("IDLE");
  const [qrData, setQrData] = useState(null);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [errorMessage, setErrorMessage] = useState("");
  const [successData, setSuccessData] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [copied, setCopied] = useState(false);

  const pollTimerRef = useRef(null);
  const countdownTimerRef = useRef(null);
  const activeMd5Ref = useRef(null);

  // Helper to stop all active timers
  const clearAllTimers = useCallback(() => {
    if (pollTimerRef.current) {
      clearInterval(pollTimerRef.current);
      pollTimerRef.current = null;
    }
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }
  }, []);

  // 1. Generate KHQR code from backend
  const generateKhqr = useCallback(async () => {
    clearAllTimers();
    setStatus("GENERATING");
    setErrorMessage("");
    setSuccessData(null);

    try {
      const res = await bakongService.generateQr({
        amount: Number(amount),
        currency: currency.toUpperCase(),
        bookingId,
        bookingType,
        description,
      });

      setQrData(res);
      activeMd5Ref.current = res.md5;
      setStatus("SCANNING");

      // Calculate initial remaining seconds (default 300s / 5min)
      if (res.expiresAt) {
        const diffSec = Math.max(
          10,
          Math.floor((new Date(res.expiresAt).getTime() - Date.now()) / 1000)
        );
        setTimeLeft(diffSec);
      } else {
        setTimeLeft(300);
      }
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || "Failed to generate KHQR code";
      setErrorMessage(msg);
      setStatus("ERROR");
    }
  }, [amount, currency, bookingId, bookingType, description, clearAllTimers]);

  // 2. Poll transaction status via backend by MD5 hash
  const pollStatus = useCallback(async () => {
    const md5 = activeMd5Ref.current;
    if (!md5) return;

    try {
      const checkRes = await bakongService.checkStatus({
        md5,
        bookingId,
        bookingType,
      });

      if (checkRes.status === "SUCCESS") {
        clearAllTimers();
        setStatus("SUCCESS");
        setSuccessData(checkRes);
        if (onSuccess) {
          onSuccess(checkRes);
        }
      } else if (checkRes.status === "EXPIRED") {
        clearAllTimers();
        setStatus("EXPIRED");
      }
    } catch {
      // Non-fatal network error during polling; continue polling next interval
    }
  }, [bookingId, bookingType, clearAllTimers, onSuccess]);

  // 3. Initiate or teardown on open/close
  useEffect(() => {
    if (isOpen) {
      generateKhqr();
    } else {
      clearAllTimers();
      setStatus("IDLE");
      setQrData(null);
    }

    return () => {
      clearAllTimers();
    };
  }, [isOpen, generateKhqr, clearAllTimers]);

  // 4. Countdown timer & Polling interval when SCANNING
  useEffect(() => {
    if (status !== "SCANNING") return;

    // Countdown interval (1s)
    countdownTimerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearAllTimers();
          setStatus("EXPIRED");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Bakong Status Polling interval (3s)
    pollTimerRef.current = setInterval(() => {
      pollStatus();
    }, 3000);

    return () => {
      clearAllTimers();
    };
  }, [status, pollStatus, clearAllTimers]);

  // Simulate payment (Sandbox mode test helper)
  const handleSimulatePayment = async () => {
    if (!activeMd5Ref.current || isSimulating) return;
    setIsSimulating(true);
    try {
      const simRes = await bakongService.simulatePayment(activeMd5Ref.current);
      if (simRes.status === "SUCCESS") {
        clearAllTimers();
        setStatus("SUCCESS");
        setSuccessData(simRes);
        if (onSuccess) {
          onSuccess(simRes);
        }
      }
    } catch (err) {
      setErrorMessage("Simulation failed: " + (err?.message || "Unknown error"));
    } finally {
      setIsSimulating(false);
    }
  };

  const handleCopyMd5 = () => {
    if (!qrData?.md5) return;
    navigator.clipboard.writeText(qrData.md5);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  // Format time MM:SS
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  // Format display currency
  const formatAmount = (val, cur) => {
    if (cur === "KHR") {
      return `៛ ${Number(val).toLocaleString("en-US")}`;
    }
    return `$ ${Number(val).toFixed(2)}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-white dark:bg-[#13241c] rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-line transition-all">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 grid h-8 w-8 place-items-center rounded-full bg-white/20 text-white hover:bg-white/30 transition"
          aria-label={t("khqr.cancel")}
        >
          ✕
        </button>

        {/* Authentic Red KHQR Header Banner */}
        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 px-6 py-4 text-white text-center relative overflow-hidden shadow-md">
          <div className="flex items-center justify-center gap-2 mb-1">
            <span className="font-black tracking-wider text-xl bg-white text-red-600 px-2 py-0.5 rounded font-mono shadow-sm">
              {t("khqr.khqr")}
            </span>
            <span className="text-xs font-semibold tracking-wide uppercase opacity-90">
              {t("khqr.bakongPayment")}
            </span>
          </div>
          <p className="text-[11px] text-red-100 font-medium">{t("khqr.nbc")}</p>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {/* ================= STATE 1: GENERATING ================= */}
          {status === "GENERATING" && (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
              <div className="relative h-14 w-14">
                <div className="absolute inset-0 rounded-full border-4 border-red-200 animate-ping opacity-75" />
                <div className="h-14 w-14 rounded-full border-4 border-red-600 border-t-transparent animate-spin" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-base">{t("khqr.generating")}</h3>
                <p className="text-xs text-slate-500 mt-1">{t("khqr.connecting")}</p>
              </div>
            </div>
          )}

          {/* ================= STATE 2: SCANNING (ACTIVE) ================= */}
          {status === "SCANNING" && qrData && (
            <div className="flex flex-col items-center text-center space-y-4">
              {/* Merchant & Price Info */}
              <div className="w-full pb-3 border-b border-slate-100">
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                  {qrData.merchantName || "SovannDomNour Tourism"}
                </span>
                <div className="text-3xl font-extrabold text-slate-900 mt-0.5 font-mono">
                  {formatAmount(qrData.amount, qrData.currency)}
                </div>
                {description && (
                  <p className="text-xs text-slate-500 truncate max-w-xs mx-auto mt-0.5">
                    {description}
                  </p>
                )}
              </div>

              {/* High-Resolution QR Display Box */}
              <div className="relative p-3 bg-white rounded-xl border-2 border-slate-100 shadow-sm">
                {qrData.qrImage ? (
                  <img
                    src={qrData.qrImage}
                    alt="Bakong KHQR"
                    className="w-56 h-56 object-contain rounded-lg"
                  />
                ) : (
                  <div className="w-56 h-56 flex items-center justify-center bg-slate-50 text-xs text-slate-400">
                    QR Code Loading...
                  </div>
                )}

                {/* Center Bakong KHQR Badge */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 py-1 rounded shadow-md border border-red-200">
                  <span className="text-red-600 font-bold font-mono text-xs tracking-wider">KHQR</span>
                </div>
              </div>

              {/* Countdown Timer & Polling Indicator */}
              <div className="w-full flex items-center justify-between px-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                  </span>
                  <span className="text-slate-600 font-medium">{t("khqr.listening")}</span>
                </div>

                <div
                  className={`font-mono font-bold px-2 py-0.5 rounded-full ${
                    timeLeft <= 60
                      ? "bg-red-50 text-red-600 animate-pulse"
                      : timeLeft <= 120
                      ? "bg-amber-50 text-amber-600"
                      : "bg-slate-100 text-slate-700"
                  }`}
                >
                  ⏱ {formatTime(timeLeft)}
                </div>
              </div>

              {/* Supported Banking Apps Banner */}
              <div className="w-full bg-slate-50 rounded-xl p-3 border border-slate-100 text-center">
                <p className="text-[11px] font-semibold text-slate-600">{t("khqr.scanning")}</p>
                <div className="mt-1.5 flex items-center justify-center gap-1.5 flex-wrap text-[10px] font-bold text-slate-500">
                  <span className="px-1.5 py-0.5 rounded bg-white shadow-xs border border-slate-200 text-red-600">
                    Bakong
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-white shadow-xs border border-slate-200 text-blue-800">
                    ABA Mobile
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-white shadow-xs border border-slate-200 text-blue-600">
                    Acleda
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-white shadow-xs border border-slate-200 text-emerald-600">
                    Wing
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-white shadow-xs border border-slate-200 text-orange-600">
                    Canadia
                  </span>
                </div>
              </div>

              {/* MD5 Reference & Copy */}
              <div className="w-full flex items-center justify-between text-[11px] text-slate-400 px-1 pt-1 font-mono">
                <span className="truncate max-w-[200px]" title={qrData.md5}>
                  MD5: {qrData.md5?.substring(0, 16)}...
                </span>
                <button
                  onClick={handleCopyMd5}
                  className="text-slate-600 hover:text-slate-900 underline ml-2"
                >
                  {copied ? t("khqr.copied") : t("khqr.copyMd5")}
                </button>
              </div>

              {/* Sandbox Dev Simulation Button */}
              <div className="w-full pt-2">
                <button
                  onClick={handleSimulatePayment}
                  disabled={isSimulating}
                  className="w-full py-2 text-xs font-semibold rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 transition flex items-center justify-center gap-1.5"
                  title="Simulate payment confirmation for testing without scanning real bank money"
                >
                  {isSimulating ? t("khqr.simulating") : t("khqr.simulate")}
                </button>
              </div>
            </div>
          )}

          {/* ================= STATE 3: SUCCESS ================= */}
          {status === "SUCCESS" && (
            <div className="py-6 flex flex-col items-center text-center space-y-4 animate-scale-in">
              <div className="h-16 w-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-3xl shadow-inner animate-bounce">
                ✓
              </div>

              <div>
                <h3 className="text-xl font-extrabold text-slate-900">{t("khqr.successTitle")}</h3>
                <p className="text-xs text-slate-500 mt-1">
                  {t("khqr.successSubtitle")}
                </p>
              </div>

              <div className="w-full bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-2 text-xs text-left">
                <div className="flex justify-between">
                  <span className="text-slate-500">{t("khqr.amountPaid")}</span>
                  <span className="font-bold text-slate-800 font-mono">
                    {formatAmount(amount, currency)}
                  </span>
                </div>
                {successData?.transactionId && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">{t("khqr.transactionRef")}</span>
                    <span className="font-mono text-slate-700 truncate max-w-[180px]">
                      {successData.transactionId}
                    </span>
                  </div>
                )}
                {bookingId && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">{t("khqr.bookingRef")}</span>
                    <span className="font-bold text-emerald-600 font-mono">#{bookingId}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-slate-500">{t("khqr.status")}</span>
                  <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded text-[11px]">
                    {t("khqr.confirmed")}
                  </span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md shadow-emerald-600/20 transition"
              >
                {t("khqr.completeBtn")}
              </button>
            </div>
          )}

          {/* ================= STATE 4: EXPIRED ================= */}
          {status === "EXPIRED" && (
            <div className="py-8 flex flex-col items-center text-center space-y-4">
              <div className="h-14 w-14 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-2xl">
                ⏳
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900">{t("khqr.expiredTitle")}</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-xs">
                  {t("khqr.expiredDesc")}
                </p>
              </div>

              <button
                onClick={generateKhqr}
                className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm shadow-md transition"
              >
                {t("khqr.regenBtn")}
              </button>
            </div>
          )}

          {/* ================= STATE 5: ERROR ================= */}
          {status === "ERROR" && (
            <div className="py-8 flex flex-col items-center text-center space-y-4">
              <div className="h-14 w-14 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-2xl">
                ⚠️
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900">{t("khqr.errorTitle")}</h3>
                <p className="text-xs text-red-600 mt-1 max-w-xs">{errorMessage}</p>
              </div>

              <div className="flex gap-2 w-full">
                <button
                  onClick={onClose}
                  className="flex-1 py-2 text-xs font-semibold rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
                >
                  {t("khqr.cancel")}
                </button>
                <button
                  onClick={generateKhqr}
                  className="flex-1 py-2 text-xs font-semibold rounded-lg bg-red-600 text-white hover:bg-red-500 transition"
                >
                  {t("khqr.retry")}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
