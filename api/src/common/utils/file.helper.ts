import cloudinary from "../config/cloudinary.config";

/**
 * * Extracts the public_id from a Cloudinary URL
 */
const extractPublicIdFromUrl = (url: string): string | null => {
  try {
    // Handle both full URLs and relative paths
    const urlParts = url.split("/upload/");
    if (urlParts.length < 2) return null;

    // Get the part after /upload/
    const pathAfterUpload = urlParts[1];

    // Remove version (v1234567890) if present
    const withoutVersion = pathAfterUpload.replace(/^v\d+\//, "");

    // Remove file extension
    const publicId = withoutVersion.replace(/\.[^/.]+$/, "");

    return publicId;
  } catch (e) {
    console.error("❌ Error extracting public_id from URL:", e.message);
    return null;
  }
};

export const deleteFileIfExists = async (filePath: string | null) => {
  try {
    if (!filePath) return;

    const publicId = extractPublicIdFromUrl(filePath);
    if (!publicId) {
      console.warn("⚠️ Could not extract public_id from:", filePath);
      return;
    }

    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result === "ok") {
      console.log("✅ File deleted from Cloudinary:", publicId);
    } else if (result.result === "not found") {
      console.warn("⚠️ File not found in Cloudinary:", publicId);
    } else {
      console.error("❌ Failed to delete file from Cloudinary:", result);
    }
  } catch (e) {
    console.error("❌ Error deleting file from Cloudinary:", e.message);
  }
};
