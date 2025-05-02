// components/syncfusion-license.ts
"use client";

import { registerLicense } from "@syncfusion/ej2-base";

// Only call it once on client
registerLicense(process.env.NEXT_PUBLIC_SYNCFUSION_LICENSE_KEY as string);
