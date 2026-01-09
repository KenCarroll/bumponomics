---
description: How to set up the Firebase Trigger Email Extension
---

# Setting up Email Automation

Since you chose **Option 1**, we will use the official **Trigger Email** extension. This requires a one-time setup in your Firebase Console.

## Prerequisites
1.  **Billing**: You must be on the **Blaze (Pay as you go)** plan.
    *   *Note: usage is usually free for low volume, but key features require this plan.*
2.  **Email Service**: You need an account with an SMTP provider (e.g., **SendGrid**, **Mailgun**, or even a **Gmail** account utilizing an App Password).

## Step 1: Install the Extension
1.  Go to the [Firebase Extensions Hub - Trigger Email](https://firebase.google.com/products/extensions/firebase-firestore-send-email).
2.  Click **Install in Console**.
3.  Select your project (`bumponomics-10c97`).
4.  **Review Billing**: Click checks to accept.
5.  **Review APIs**: Enable `Cloud Functions` if asked.
6.  **Access**: Grant the extension permission.

## Step 2: Configure the Extension
You will be asked for configuration parameters:
*   **Cloud Functions Location**: Pick one close to you (e.g., `us-central1`).
*   **SMTP Connection URI**: This is the key part.
    *   *Format*: `smtps://username:password@smtp.provider.com:465`
    *   *For Gmail*: `smtps://yourname@gmail.com:your-app-password@smtp.gmail.com:465`

    *   *For SendGrid*: `smtps://apikey:SG_REDACTED@smtp.sendgrid.net:465`

    api: SG_REDACTED 
*   **Email Documents Collection**: `mail` (Leave as default).
*   **Default FROM address**: `noreply@bumponomics.com` (or your email).

## Step 3: Deployment
1.  Click **Install Extension**.
2.  Wait 3-5 minutes for it to deploy.

## How it works (Code Side)
I have updated your application code. Now, when a user Subscribes:
1.  We save them to the `subscribers` list.
2.  We AUTOMATICALLY write a "letter" to the `mail` collection.
3.  The Extension sees this "letter", picks it up, delivers it, and writes the result back to the document.
