'use client';

import { Analytics, type BeforeSendEvent } from '@vercel/analytics/next';

const OWNER_KEY = 'chinaimo_owner_exempt';

export default function OwnerAwareAnalytics() {
  return (
    <Analytics
      mode="production"
      beforeSend={(event: BeforeSendEvent) => {
        try {
          if (localStorage.getItem(OWNER_KEY) === '1') return null;
        } catch {}
        return event;
      }}
    />
  );
}
