import { NextResponse } from "next/server";

export async function PUT(request) {
  try {
    const formData = await request.formData();

    const uploadUrl = formData.get("uploadUrl");
    const file = formData.get("file");

    if (!uploadUrl || !file) {
      return NextResponse.json(
        { error: "Upload URL and file are required" },
        { status: 400 }
      );
    }

    // More robust file validation that works in all environments
    if (!file || typeof file.arrayBuffer !== "function") {
      return NextResponse.json(
        { error: "Invalid file format" },
        { status: 400 }
      );
    }

    // Validate file size if available
    if (file.size && file.size > 10 * 1024 * 1024) {
      // 10MB
      return NextResponse.json(
        { error: "File size exceeds limit" },
        { status: 400 }
      );
    }

    // Validate file type if available
    if (file.type) {
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
      ];
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json(
          { error: "Invalid file type" },
          { status: 400 }
        );
      }
    }

    const fileBuffer = await file.arrayBuffer();

    // Add timeout and better error handling
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    try {
      const response = await fetch(uploadUrl, {
        method: "PUT",
        body: fileBuffer,
        headers: {
          "Content-Type": file.type || "application/octet-stream",
          ...(file.size && { "Content-Length": file.size.toString() }),
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text().catch(() => "Unknown error");
        console.error("S3 upload failed:", {
          status: response.status,
          statusText: response.statusText,
          error: errorText,
        });

        throw new Error(
          `S3 upload failed: ${response.status} ${response.statusText}`
        );
      }

      return NextResponse.json(
        {
          message: "File uploaded successfully",
          status: response.status,
        },
        { status: 200 }
      );
    } catch (fetchError) {
      clearTimeout(timeoutId);

      if (fetchError.name === "AbortError") {
        throw new Error("Upload timeout - please try again");
      }
      throw fetchError;
    }
  } catch (error) {
    console.error("Upload API error:", error);

    return NextResponse.json(
      {
        error: `Failed to upload file: ${error.message}`,
        details:
          process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
