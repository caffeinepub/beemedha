# Custom Domain Setup for Beemedha

This guide explains how to connect your custom domain to your Beemedha deployment on the Internet Computer.

## Overview

Your Beemedha application is deployed as a canister on the Internet Computer. To make it accessible via your custom domain (e.g., `www.yourdomain.com` or `yourdomain.com`), you need to configure DNS records and register the domain with the Internet Computer boundary nodes.

## Prerequisites

- Access to your domain's DNS management console (e.g., GoDaddy, Cloudflare, Namecheap, Route53)
- Your frontend canister ID (found in `.dfx/local/canister_ids.json` for local or `canister_ids.json` for production)
- Your application deployed to the Internet Computer mainnet

## Step 1: Choose Domain Type

You can use either:
- **Subdomain** (e.g., `www.yourdomain.com`, `app.yourdomain.com`) - Recommended, easier setup
- **Apex domain** (e.g., `yourdomain.com`) - Requires additional configuration

## Step 2: Configure DNS Records

### For Subdomain (Recommended)

Add a **CNAME record** in your DNS provider:

