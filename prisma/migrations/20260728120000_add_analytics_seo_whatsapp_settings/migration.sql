-- Admin-editable GA4/GTM IDs, default SEO title/description/keywords,
-- WhatsApp contact details, and enquiry success message — ported from
-- listings.blendproperty.co.za's site settings, so these can all be changed
-- from /admin/settings without a code deploy.
ALTER TABLE "SiteSetting" ADD COLUMN "googleAnalyticsId" TEXT;
ALTER TABLE "SiteSetting" ADD COLUMN "tagManagerId" TEXT;
ALTER TABLE "SiteSetting" ADD COLUMN "defaultTitleTemplate" TEXT;
ALTER TABLE "SiteSetting" ADD COLUMN "defaultMetaDescription" TEXT;
ALTER TABLE "SiteSetting" ADD COLUMN "defaultKeywords" TEXT;
ALTER TABLE "SiteSetting" ADD COLUMN "whatsapp" TEXT;
ALTER TABLE "SiteSetting" ADD COLUMN "whatsappTemplate" TEXT;
ALTER TABLE "SiteSetting" ADD COLUMN "enquirySuccessMessage" TEXT;
