// app/api/proxy/route.ts
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { url, method, headers, body } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: "آدرس URL نمی‌تواند خالی باشد." },
        { status: 400 },
      );
    }

    const formattedHeaders: Record<string, string> = {};
    headers.forEach((h: { key: string; value: string }) => {
      if (h.key && h.value) {
        formattedHeaders[h.key] = h.value;
      }
    });

    const options: RequestInit = {
      method,
      headers: formattedHeaders,
    };

    if (method !== "GET" && body) {
      options.body = typeof body === "string" ? body : JSON.stringify(body);
    }

    const startTime = Date.now();
    const response = await fetch(url, options);
    const endTime = Date.now();

    const responseTime = endTime - startTime;
    const status = response.status;
    const statusText = response.statusText;

    let responseData;
    const contentType = response.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      responseData = await response.json();
    } else {
      responseData = await response.text();
    }

    return NextResponse.json({
      status,
      statusText,
      time: responseTime,
      data: responseData,
    });
  } catch (error: any) {
    // مدیریت خطاهای شبکه و عدم دسترسی به سرور مقصد (بند ۸ چک‌لیست)
    return NextResponse.json(
      {
        error: `خطای شبکه یا عدم دسترسی به سرور: ${error.message || "Unknown Error"}`,
      },
      { status: 502 },
    );
  }
}
