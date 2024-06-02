=== Integration for Zoho Campaigns and CF7 ===
Contributors: formsintegrations
Tags: Zoho with CF7,  CF7 with Zoho, Zoho and CF7, CF7 and Zoho, Zoho Integration, CF7 Integration, Zoho Campaigns, Integration, CF7 Form
Requires at least: 5.1
Tested up to: 6.5
Requires PHP: 7.4
Stable tag: 1.0
License: GPLv2 or later


A simple integration tool to send Contact Form 7 submissions to [Zoho Campaigns](https://www.zoho.com/campaigns).

== Description ==

Looking for an easy way to integrate **Contact Form 7 with Zoho Campaigns**? Look no further than the Integrations of Zoho Campaigns with Contact Form 7 plugin from WordPress! This plugin simplifies the process of connecting your Zoho Campaigns account and Contact Form 7, making it easy to collect and manage your customer data. Optimize your website's functionality with this powerful plugin today!

**Check out our step-by-step tutorial on Zoho Campaigns Integration with Contact Form 7**

**Things you need to use this plug-in :**
1. Contact Form 7.
2. [Zoho Campaigns account](https://accounts.zoho.com).

**Setup process for Contact Form 7 integration with Zoho Campaigns:**

1. Go to this plugin
2. Select form created by Contact Form 7 from which you want to send data in Zoho Campaigns
3. Then go to Zoho Campaigns authorization page
4. Click on "[Zoho API Console](https://api-console.zoho.com/)"
5. Select "Server Side Applications"
6. Give a client name but It cannot contain keyword "**Zoho**"
7. Copy "Homepage URL" and "Authorized Redirect URIs" from the plugin
8. It will generate "Client ID" and "Client Secret", paste it in the plugin. You can select data center[au, com, eu, in,..] from api console.
9. Complete the authorization process
10. Now select Zoho Campaigns module and layout where you want to send data
11. Map Contact Form 7 fields with Zoho Campaigns fields
12. Here we go, you successfully set up the integration between Contact Form 7 and Zoho Campaigns.

Note: Authorization compatible with Zoho Campaigns Plus and Zoho One within the scope Campaigns.

**Timeline/Log:**
Here you can see the API response from Zoho Campaigns after Contact Form 7 is submitted. You will get a response whether the submission is successful or failed. It will help you to debug the situation. 

**FEATURES ON FREE VERSION:**

1. User can send any Contact Form 7 data to list of [Zoho Campaigns]("https://campaigns.zoho.com).
2. Users can make one integration at a time.
3. Users can map only one field of Zoho Campaigns.
4. This plugin allow user to send custom value also.
5. View the detailed log of submitted data from the plugin dashboard.
6. Advance conditional logic.

Note : When you send data in Zoho Campaigns an email confirmation message will go to the typed email. The data will not insert before the confirmation. If you want to send data without email confirmation, you have to change some settings in the Zoho Campaigns. Have to disable SIGNUP FORM.

 1. All the lists from Zoho Campaigns are available in [pro plugin](https://formsintegrations.com).
 2. Zoho Campaigns Custom list modules are available.
 3. You can map unlimited field of Contact Form 7s and Zoho Campaigns.
 4. WordPress meta data/smart data fields are available for field mapping with Zoho Campaigns.
 5. You can do multiple/unlimited integrations.


== Installation ==

1. Download the plugin.
2. From the WordPress Admin Panel, click on Plugins => Add New.
3. Click on Upload, so you can directly upload your plugin zip file.
4. Use the browse button to select the plugin zip file that was downloaded, and then click on Install Now.
5. Once installed, click “Activate”.

Plugin Github [Repository](https://github.com/formsintegrations/integration-for-zoho-campaigns-and-cf7)


== Changelog ==

= 1.0 =
* Initial release
