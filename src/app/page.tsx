"use client";
import { useState } from "react";
import styles from "./page.module.css";

export default function Home() {
  const [barcode, setBarcode] = useState("");
  const [language, setLanguage] = useState<"en" | "is">("en");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");
  const baseUrl = process.env.NEXT_PUBLIC_URL;

  const handleCheck = async () => {
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch(`${baseUrl}/${barcode}/${language}`);

      if (!response.ok) {
        throw new Error("API error");
      }

      const data = await response.json();

      if (!data || !Array.isArray(data.infos) || data.infos.length === 0) {
        setError(
          language === "is"
            ? "Engar upplýsingar fundust."
            : "No tracking info found."
        );
        return;
      }

      setResult(data.infos);
    } catch (error) {
      console.error(error);
      setError(
        language === "is"
          ? "Villa kom upp við leit."
          : "An error occurred while fetching data."
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <main className={styles.page}>
      <h1>{language === "is" ? "Vöruleit" : "Delivery Tracker"}</h1>

      <input
        type="text"
        placeholder={
          language === "is" ? "Sláðu inn strikamerki" : "Enter barcode"
        }
        value={barcode}
        onChange={(e) => setBarcode(e.target.value)}
      />

      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value as "en" | "is")}
      >
        <option value="en">English</option>
        <option value="is">Íslenska</option>
      </select>

      <button onClick={handleCheck} disabled={loading}>
        {loading
          ? language === "is"
            ? "Sæki..."
            : "Loading..."
          : language === "is"
          ? "Leita"
          : "Check"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {result && (
        <div className={styles.result}>
          <h2>{language === "is" ? "Ferill" : "Tracking History"}</h2>
          {result.map((info: any, index: number) => (
            <div
              className={styles.card}
              key={index}
              style={{ marginBottom: "1rem" }}
            >
              <p>
                <strong>{language === "is" ? "Staða" : "Status"}:</strong>{" "}
                {info.label}
              </p>
              <p>
                <strong>{language === "is" ? "Dagsetning" : "Date"}:</strong>{" "}
                {info.date}
              </p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
