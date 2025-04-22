import axios from "axios";
import path from "path";
import { api } from "./api";

// Define constants and types
const TELEGRAM_API = "https://api.telegram.org/bot"; // You'll need to add your bot token

type TelegramResponse = {
  ok: boolean;
  result?: {
    message_id: number;
    [key: string]: any;
  };
  description?: string;
};

/**
 * Sends a photo to a Telegram chat
 * @param chatId - The Telegram chat ID
 * @param photo - File object, Blob, or URL string of the photo
 * @param caption - Optional caption for the photo
 * @param parseMode - Parse mode for the caption (HTML, Markdown, etc.)
 * @param botToken - Your Telegram bot token
 * @returns Promise with the Telegram API response
 */
export async function sendTelegramPhoto(
  chatId: string | number,
  photo: File | Blob | string,
  caption: string | null = null,
  parseMode: "HTML" | "MarkdownV2" | "Markdown" = "HTML",
  botToken: string | undefined
): Promise<TelegramResponse> {
  const url = `${TELEGRAM_API}${botToken}/sendPhoto`;

  console.log(`Sending photo to chat ID: ${url}, ${chatId}`);

  try {
    const formData = new FormData();
    formData.append("chat_id", chatId.toString());

    // Handle different photo input types
    if (typeof photo === "string") {
      // If it's a URL, pass it directly to Telegram
      if (photo.startsWith("http")) {
        formData.append("photo", photo);
        console.log(`Using photo URL: ${photo}`);
      } else {
        // If it's a local path, we need to fetch it first (only works in Node.js environment)
        console.log(`Attempting to load file from path: ${photo}`);
        throw new Error(
          "Local file paths are not supported in browser environment"
        );
      }
    } else {
      // If it's a File or Blob object
      formData.append("photo", photo);
      console.log(`Appended photo as File/Blob object`);
    }

    // Add caption if provided
    if (caption) {
      formData.append("caption", caption);
      formData.append("parse_mode", parseMode);
    }

    console.log("sendTelegramPhoto fetch body:", formData);

    // Send the request
    const response = await fetch(url, {
      method: "POST",
      body: formData,
    });

    const result: TelegramResponse = await response.json();

    if (!result.ok) {
      console.error("Failed to send photo:", result.description);
      return result;
    }

    console.log(
      `Photo sent successfully with message ID: ${
        result.result?.message_id || "unknown"
      }`
    );
    return result;
  } catch (error) {
    console.error("Exception in sendTelegramPhoto:", error);
    return {
      ok: false,
      description: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Sends a photo to a Telegram chat
 * @param chatId - The Telegram chat ID
 * @param caption - Optional caption for the photo
 * @param botToken - Your Telegram bot token
 * @returns Promise with the Telegram API response
 */
export async function sendTelegramMessage(
  chatId: string | number,
  caption: string | null = null,
  botToken: string | undefined
): Promise<number | null> {
  const url = `${TELEGRAM_API}${botToken}/sendMessage`;

  console.log(`Sending Message to chat ID: ${url}, ${chatId}`);

  const data = {
    chat_id: chatId,
    text: caption,
  };

  try {
    // Using fetch API (modern browsers and Node.js 18+)
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const responseData: TelegramResponse = await response.json();

    console.log(`Telegram API Response: ${JSON.stringify(responseData)}`);

    return responseData && responseData.result?.message_id
      ? responseData.result.message_id
      : null;
  } catch (error) {
    console.error(
      `Error sending Telegram message: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
    return null;
  }
}

export async function uploadPhoto(file: File): Promise<any> {
  const formData = new FormData();
  formData.append("file", file);
  const response = await api.post("/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
}
