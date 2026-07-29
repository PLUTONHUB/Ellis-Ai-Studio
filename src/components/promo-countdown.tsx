import { useEffect, useState } from "react";
import "~/styles/promo-countdown.css";

const promotionEndsAt = new Date("2026-08-27T23:59:59-07:00").getTime();

function remainingTime() {
  const totalSeconds = Math.max(0, Math.floor((promotionEndsAt - Date.now()) / 1000));
  return {
    totalSeconds,
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

function twoDigits(value: number) { return String(value).padStart(2, "0"); }

export function PromoCountdown() {
  const [time, setTime] = useState<ReturnType<typeof remainingTime> | null>(null);

  useEffect(() => {
    const update = () => setTime(remainingTime());
    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, []);

  if (time?.totalSeconds === 0) return null;

  const display = time ? `${time.days}d ${twoDigits(time.hours)}h ${twoDigits(time.minutes)}m ${twoDigits(time.seconds)}s` : "30d 00h 00m 00s";
  return <aside className="promo-countdown" aria-label="60 percent off promotion ends in">
    <a href="/#pricing"><strong>60% OFF</strong><span>Website &amp; growth systems</span><b>Ends in {display}</b><em>View promotional pricing →</em></a>
  </aside>;
}
