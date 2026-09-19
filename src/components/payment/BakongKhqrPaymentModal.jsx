import { useState, useEffect, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import Icon from "../ui/Icon";
import { bakongService } from "../../services/bakongService";

/**
 * Bakong KHQR Payment Modal — clean premium card style matching the
 * SovannDomNour design system (brand tokens + dark mode).
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-line bg-white shadow-2xl shadow-ink/10 dark:bg-card">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-3.5 top-3.5 z-20 grid h-9 w-9 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
          aria-label={t("khqr.cancel")}
        >
          <Icon name="x" size={17} />
        </button>

        {/* Brand-green header */}
        <div className="relative overflow-hidden bg-gradient-to-br from-brand-800 via-brand-700 to-brand-600 px-6 py-6 text-center text-white">
          <div className="pointer-events-none absolute -right-10 -top-16 h-40 w-40 rounded-full bg-white/10" />
          <div className="pointer-events-none absolute -bottom-20 -left-12 h-44 w-44 rounded-full bg-white/5" />
          <span className="relative inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/15 px-3.5 py-1 text-[11px] font-bold uppercase tracking-widest">
            <Icon name="shield-check" size={13} />
            {t("khqr.khqr")} · {t("khqr.bakongPayment")}
          </span>
          <h3 className="relative mt-3 font-display text-2xl font-bold tracking-tight">
            {qrData?.merchantName || "SovannDomNour Tourism"}
          </h3>
          <p className="relative mt-0.5 text-xs text-white/75">{t("khqr.nbc")}</p>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-7">
          {/* ================= STATE 1: GENERATING ================= */}
          {status === "GENERATING" && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="relative h-16 w-16">
                <div className="absolute inset-0 animate-ping rounded-full border-4 border-brand-200 opacity-60" />
                <div className="h-16 w-16 animate-spin rounded-full border-4 border-brand-700 border-t-transparent" />
              </div>
              <div className="mt-5">
                <h4 className="font-display text-lg font-bold text-ink">{t("khqr.generating")}</h4>
                <p className="mt-1 text-sm text-muted">{t("khqr.connecting")}</p>
              </div>
            </div>
          )}

          {/* ================= STATE 2: SCANNING (ACTIVE) ================= */}
          {status === "SCANNING" && qrData && (
            <div className="flex flex-col items-center text-center">
              {/* Price */}
              <span className="text-xs font-bold uppercase tracking-widest text-muted">
                {t("khqr.amountPaid")}
              </span>
              <div className="mt-1 font-mono text-5xl font-extrabold tracking-tight text-brand-800 dark:text-white">
                {formatAmount(qrData.amount, qrData.currency)}
              </div>
              {description && (
                <p className="mt-1.5 mb-4 max-w-xs truncate text-sm text-muted">{description}</p>
              )}

              {/* QR Display */}
              <div className="relative mt-1 rounded-2xl border border-line bg-white p-3 shadow-lg shadow-brand-900/5">
                {qrData.qrImage ? (
                  <img
                    src={qrData.qrImage}
                    alt="Bakong KHQR"
                    className="h-60 w-60 rounded-xl object-contain"
                  />
                ) : (
                  <div className="flex h-60 w-60 items-center justify-center rounded-xl bg-canvas text-sm text-muted">
                    QR Code Loading...
                  </div>
                )}
                <div className="absolute left-1/2 top-1/2 grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-lg border border-line bg-white px-2 py-0.5 shadow-md">
                  <span className="font-mono text-xs font-black tracking-wider text-red-600">
                    KHQR
                  </span>
                </div>
              </div>

              {/* Countdown & polling */}
              <div className="mt-4 flex w-full items-center justify-between rounded-2xl border border-line bg-canvas px-4 py-3">
                <div className="flex items-center gap-2.5">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  </span>
                  <span className="text-sm font-semibold text-ink">{t("khqr.listening")}</span>
                </div>
                <div
                  className={`flex items-center gap-1 rounded-full px-3 py-1 font-mono text-sm font-bold ${
                    timeLeft <= 60
                      ? "animate-pulse bg-red-50 text-red-600"
                      : timeLeft <= 120
                      ? "bg-gold-100 text-gold-700"
                      : "bg-brand-50 text-brand-700"
                  }`}
                >
                  <Icon name="clock" size={14} />
                  {formatTime(timeLeft)}
                </div>
              </div>

              {/* Supported banking apps */}
              <div className="mt-3 w-full text-center">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">
                  {t("khqr.scanning")}
                </p>
                <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
                  {["Bakong", "ABA Mobile", "Acleda", "Wing", "Canadia"].map((bank, i) => (
                    <span
                      key={bank}
                      className={`rounded-full border px-2.5 py-1 text-[10px] font-bold ${
                        i === 0
                          ? "border-red-200 bg-red-50 text-red-600"
                          : "border-line bg-card text-muted"
                      }`}
                    >
                      {bank}
                    </span>
                  ))}
                </div>
              </div>

              {/* MD5 Reference & Copy */}
              <div className="mt-3 flex w-full items-center justify-between rounded-xl border border-line px-3.5 py-2.5 font-mono text-[11px] text-muted">
                <span className="max-w-[220px] truncate" title={qrData.md5}>
                  MD5: {qrData.md5?.substring(0, 16)}...
                </span>
                <button
                  onClick={handleCopyMd5}
                  className="ml-2 inline-flex items-center gap-1 font-sans font-semibold text-brand-700 transition hover:text-brand-900"
                >
                  <Icon name="copy" size={12} />
                  {copied ? t("khqr.copied") : t("khqr.copyMd5")}
                </button>
              </div>

              {/* Sandbox Dev Simulation Button */}
              <div className="mt-3 w-full">
                <button
                  onClick={handleSimulatePayment}
                  disabled={isSimulating}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-gold-400 bg-gold-50 py-2.5 text-xs font-bold text-gold-700 transition hover:bg-gold-100 disabled:opacity-60"
                  title="Simulate payment confirmation for testing without scanning real bank money"
                >
                  <span className="text-sm leading-none">⚡</span>
                  {isSimulating ? t("khqr.simulating") : t("khqr.simulate")}
                </button>
              </div>
            </div>
          )}

          {/* ================= STATE 3: SUCCESS ================= */}
          {status === "SUCCESS" && (
            <div className="flex flex-col items-center py-6 text-center">
              <span className="grid h-16 w-16 place-items-center rounded-full bg-emerald-50 text-emerald-600">
                <Icon name="check-circle" size={36} />
              </span>

              <div className="mt-4">
                <h3 className="font-display text-2xl font-bold text-ink">{t("khqr.successTitle")}</h3>
                <p className="mt-1 text-sm text-muted">{t("khqr.successSubtitle")}</p>
              </div>

              <div className="mt-5 w-full space-y-2.5 rounded-2xl border border-line bg-canvas p-5 text-left text-sm">
                <div className="flex justify-between">
                  <span className="text-muted">{t("khqr.amountPaid")}</span>
                  <span className="font-mono font-bold text-ink">
                    {formatAmount(amount, currency)}
                  </span>
                </div>
                {successData?.transactionId && (
                  <div className="flex justify-between">
                    <span className="text-muted">{t("khqr.transactionRef")}</span>
                    <span className="max-w-[190px] truncate font-mono text-ink">
                      {successData.transactionId}
                    </span>
                  </div>
                )}
                {bookingId && (
                  <div className="flex justify-between">
                    <span className="text-muted">{t("khqr.bookingRef")}</span>
                    <span className="font-mono font-bold text-emerald-600">#{bookingId}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted">{t("khqr.status")}</span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700">
                    <Icon name="check" size={12} />
                    {t("khqr.confirmed")}
                  </span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="mt-5 w-full rounded-xl bg-emerald-600 py-3 text-sm font-bold text-white shadow-md shadow-emerald-600/20 transition hover:bg-emerald-500"
              >
                {t("khqr.completeBtn")}
              </button>
            </div>
          )}

          {/* ================= STATE 4: EXPIRED ================= */}
          {status === "EXPIRED" && (
            <div className="flex flex-col items-center py-8 text-center">
              <span className="grid h-16 w-16 place-items-center rounded-full bg-gold-100 text-gold-600">
                <Icon name="clock" size={30} />
              </span>

              <div className="mt-4">
                <h3 className="font-display text-xl font-bold text-ink">{t("khqr.expiredTitle")}</h3>
                <p className="mt-1 max-w-xs text-sm text-muted">{t("khqr.expiredDesc")}</p>
              </div>

              <button
                onClick={generateKhqr}
                className="mt-5 w-full rounded-xl bg-brand-700 py-3 text-sm font-bold text-white shadow-md shadow-brand-700/20 transition hover:bg-brand-800"
              >
                {t("khqr.regenBtn")}
              </button>
            </div>
          )}

          {/* ================= STATE 5: ERROR ================= */}
          {status === "ERROR" && (
            <div className="flex flex-col items-center py-8 text-center">
              <span className="grid h-16 w-16 place-items-center rounded-full bg-red-50 text-red-600">
                <Icon name="x-circle" size={30} />
              </span>

              <div className="mt-4">
                <h3 className="font-display text-xl font-bold text-ink">{t("khqr.errorTitle")}</h3>
                <p className="mt-1 max-w-xs text-sm text-danger">{errorMessage}</p>
              </div>

              <div className="mt-5 flex w-full gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 rounded-xl border border-line bg-card py-2.5 text-sm font-semibold text-ink transition hover:bg-canvas"
                >
                  {t("khqr.cancel")}
                </button>
                <button
                  onClick={generateKhqr}
                  className="flex-1 rounded-xl bg-red-600 py-2.5 text-sm font-semibold text-white transition hover:bg-red-500"
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